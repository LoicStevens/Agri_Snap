import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  Platform, // Ajout de l'importation
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { cropDetails } from './utils/cropDetails';
import { savePrediction } from './utils/predictionStorage';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Constants from 'expo-constants';

export default function PredictPage() {
  const [imageUri, setImageUri] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSoil, setIsSoil] = useState(null);
  const [location, setLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);

  const router = useRouter();
  const windowHeight = Dimensions.get('window').height;
  
const API_URL = Constants.expoConfig.extra.EXPO_PUBLIC_API_URL;
  const prepareFileForUpload = async (uri, name = 'upload.jpg') => {
  try {
    console.log('Preparing file from URI:', uri);
    let fileData = {
      uri,
      name,
      type: 'image/jpeg',
    };

    if (Platform.OS !== 'web') {
      const finalUri = `${FileSystem.cacheDirectory}${name}`;
      await FileSystem.copyAsync({ from: uri, to: finalUri });
      console.log('File copied to:', finalUri);
      const fileInfo = await FileSystem.getInfoAsync(finalUri);
      console.log('File info:', fileInfo);
      if (!fileInfo.exists) {
        throw new Error('Copied file does not exist');
      }
      fileData.uri = finalUri;
    } else {
      // Sur le web, l'URI peut être un Blob ou une URL
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log('Blob fetched:', blob);
      fileData = {
        uri: uri, // Garder l'URI original pour référence
        name: name,
        type: blob.type || 'image/jpeg',
        file: blob, // Ajouter le Blob pour FormData
      };
    }

    return fileData;
  } catch (error) {
    console.error('Error preparing file:', error);
    throw error;
  }
};

  const pickImage = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission refusée', "L'accès à la galerie est nécessaire.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      console.log('Selected image URI:', uri);
      const fileData = await prepareFileForUpload(uri);
      setImageUri(uri);
      setImageFile(fileData);
      setResult(null);
      setIsSoil(null);
    }
  }, []);

  const takePhoto = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission refusée', 'La caméra est nécessaire.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      console.log('Captured image URI:', uri);
      const fileData = await prepareFileForUpload(uri);
      setImageUri(uri);
      setImageFile(fileData);
      setResult(null);
      setIsSoil(null);
    }
  }, []);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission de localisation refusée.');
      }

      const location = await Location.getCurrentPositionAsync({});
      return {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      };
    } catch (error) {
      console.error('Erreur de géolocalisation :', error);
      Alert.alert('Erreur', 'Impossible de récupérer la position.');
      throw error;
    }
  };

 const handleSubmit = useCallback(async () => {
  if (!imageFile || !imageUri) {
    Alert.alert('Erreur', 'Aucune image sélectionnée ou URI manquant.');
    return;
  }

  setLoading(true);
  setResult(null);
  setIsSoil(null);

  try {
    const userLocation = await getUserLocation();
    setLocation(userLocation);

    const formData = new FormData();
    if (Platform.OS === 'web') {
      formData.append('image', imageFile.file, imageFile.name);
    } else {
      formData.append('image', {
        uri: imageFile.uri,
        name: imageFile.name,
        type: imageFile.type,
      });
    }
    formData.append('lat', userLocation.lat.toString());
    formData.append('lon', userLocation.lon.toString());

    console.log('FormData prepared:', {
      image: {
        uri: imageFile.uri,
        name: imageFile.name,
        type: imageFile.type,
        isWeb: Platform.OS === 'web',
      },
      lat: userLocation.lat,
      lon: userLocation.lon,
    });

    console.log('Sending request to: http://192.168.77.34:5000/check-soil');
    const checkSoilResponse = await axios.post(
      'http://192.168.77.34:5000/check-soil',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout: 30000,
      }
    );

    console.log('Response status:', checkSoilResponse.status);
    console.log('Response data:', checkSoilResponse.data);

    const soil = checkSoilResponse.data.is_soil;
    setIsSoil(soil);

    if (!soil) {
      setResult(null);
      return;
    }

    console.log('Sending request to: http://192.168.77.34:5000/predict-crop');
    const cropResponse = await axios.post(
      'http://192.168.77.34:5000/predict-crop',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout: 30000,
      }
    );

    setResult(cropResponse.data);
    setSelectedCropIndex(0);
    setModalVisible(true);
    console.log('✅ Réponse reçue :', cropResponse.data);
  } catch (error) {
    console.error('❌ Erreur API :', error.message, error.response?.data, error.stack);
    Alert.alert('Erreur', `Une erreur est survenue lors de la prédiction : ${error.message}`);
  } finally {
    setLoading(false);
  }
}, [imageFile, imageUri]);

  const handleSave = async () => {
    if (!result || !result.recommended_crops || !imageUri) return;

    const crops = result.recommended_crops.map(item => item.crop);
    const now = new Date().toISOString();

    const prediction = {
      id: Date.now(),
      imageUri,
      crops,
      date: now,
    };

    try {
      await savePrediction(prediction);
      Alert.alert('✅ Succès', 'Historique sauvegardé.');
    } catch (e) {
      console.error('❌ Erreur de sauvegarde :', e);
      Alert.alert('Erreur', 'Impossible de sauvegarder.');
    }

    setModalVisible(false);
  };

  return (
    <ImageBackground
      source={require('../assets/background/bg.png')}
      resizeMode="cover"
      imageStyle={{ opacity: 0.7 }}
      style={{ flex: 1, width: '100%', height: windowHeight }}
    >
      <SafeAreaView className="flex-1 px-4">
        <Text className="text-white text-xl font-bold mt-4 mb-6">
          Téléverse une image du sol
        </Text>

        <View className="bg-green800 rounded-xl h-60 justify-center items-center mb-6">
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              className="w-full h-full rounded-xl"
              resizeMode="cover"
            />
          ) : (
            <Text className="text-gray-400">Aucune image sélectionnée</Text>
          )}
        </View>

        <View className="space-y-4 mb-8">
          <TouchableOpacity
            className="bg-yellowSoft py-4 rounded-xl items-center flex-row justify-center mb-8"
            onPress={takePhoto}
          >
            <Ionicons name="camera" size={20} color="black" className="mr-2" />
            <Text className="text-black font-semibold"> Prendre une photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-green800 py-4 rounded-xl items-center flex-row justify-center mb-8"
            onPress={pickImage}
          >
            <Ionicons name="image" size={20} color="white" className="mr-2" />
            <Text className="text-white font-semibold"> Choisir depuis la galerie</Text>
          </TouchableOpacity>
        </View>

        {imageFile && (
          <TouchableOpacity
            className="bg-green800 py-4 rounded-xl items-center"
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold">🔍 Lancer l'analyse</Text>
            )}
          </TouchableOpacity>
        )}

       {isSoil === false && (
  <View className="bg-yellow-300 border border-yellow-600 p-4 rounded-lg mt-6">
    <Text className="text-black font-semibold text-center">
      ⚠️ L'image ne représente pas un sol. Veuillez réessayer avec une autre photo.
    </Text>
  </View>
)}


        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-6">
            <View className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[80%]">
              <Text className="text-xl font-bold mb-4">Cultures recommandées</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {result?.recommended_crops.map(({ crop, confidence }, i) => (
                  <View key={i} className="flex-row mb-4">
                    <Image
                      source={cropDetails[crop]?.image}
                      style={{ width: 100, height: 100, borderRadius: 10, marginRight: 12 }}
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <Text className="font-semibold text-lg mb-1">
                        {cropDetails[crop]?.title || crop}
                      </Text>
                      <Text className="text-gray-700 text-sm">
                        {cropDetails[crop]?.description || 'Description non disponible.'}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>

              <View className="flex-row justify-between mt-4">
                <TouchableOpacity
                  className="bg-green-800 py-2 px-6 rounded-lg"
                  onPress={handleSave}
                >
                  <Text className="text-white font-semibold">✅ Sauvegarder</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-red-600 py-2 px-6 rounded-lg"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-white font-semibold">❌ Fermer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}