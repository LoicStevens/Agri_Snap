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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location'; // ✅ NOUVEL IMPORT
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { cropDetails } from './utils/cropDetails';
import { savePrediction } from './utils/predictionStorage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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
      const now = new Date().toISOString();
  const prepareFileForUpload = async (uri, name = 'upload.jpg') => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new File([blob], name, { type: blob.type || 'image/jpeg' });
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
      const file = await prepareFileForUpload(result.assets[0].uri);
      setImageUri(result.assets[0].uri);
      setImageFile(file);
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
      const file = await prepareFileForUpload(result.assets[0].uri);
      setImageUri(result.assets[0].uri);
      setImageFile(file);
      setResult(null);
      setIsSoil(null);
    }
  }, []);

  // ✅ Fonction de géolocalisation avec expo-location
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
      console.error("Erreur de géolocalisation :", error);
      Alert.alert("Erreur", "Impossible de récupérer la position.");
      throw error;
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!imageFile) {
      Alert.alert('Erreur', 'Aucune image sélectionnée.');
      return;
    }

    setLoading(true);
    setResult(null);
    setIsSoil(null);

    try {
      const userLocation = await getUserLocation();
      setLocation(userLocation);

      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('lat', userLocation.lat.toString());
      formData.append('lon', userLocation.lon.toString());

      // Check si c’est un sol
      const checkSoilResponse = await axios.post(
        'http://192.168.152.34:5000/check-soil',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const soil = checkSoilResponse.data.is_soil;
      setIsSoil(soil);

      if (!soil) {
        setResult(null);
        return;
      }

      // Prédiction
      const cropResponse = await axios.post(
        'http://192.168.152.34:5000/predict-crop',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setResult(cropResponse.data);
      setSelectedCropIndex(0);
      setModalVisible(true);
      console.log('✅ Réponse reçue :', cropResponse.data);
    } catch (error) {
      console.error('❌ Erreur API :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la prédiction.');
    } finally {
      setLoading(false);
    }
  }, [imageFile]);

  const goPrev = () => {
    setSelectedCropIndex(i => Math.max(i - 1, 0));
  };

  const goNext = () => {
    if (result) {
      setSelectedCropIndex(i => Math.min(i + 1, result.recommended_crops.length - 1));
    }
  };

 const handleSave = async () => {
  if (!result || !result.recommended_crops || !imageUri) return;

  const crops = result.recommended_crops.map(item => item.crop); // ['maize', 'rice', ...]
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

        {/* Aperçu image */}
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

        {/* Boutons de sélection */}
        <View className="space-y-4 mb-8">
          <TouchableOpacity
            className="bg-yellowSoft py-4 rounded-xl items-center flex-row justify-center mb-8"
            onPress={takePhoto}
          >
            <Ionicons name="camera" size={20} color="black"  className="mr-2" />
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

        {/* Bouton analyse */}
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
          <Text className="text-red-500 font-bold mt-6 text-center">
            ⚠️ L'image ne représente pas un sol.
          </Text>
        )}

        

        {/* Modal */}
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
          onPress={handleSave}  // <- Appel à la fonction handleSave ici
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
