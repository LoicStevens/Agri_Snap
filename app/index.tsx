import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const { height: windowHeight } = Dimensions.get('window'); // pour les grands écrans

  return (
    <ImageBackground
      source={require('../assets/background/bg.png')}
      resizeMode="cover"
      imageStyle={{ opacity: 0.7 }}
      style={{
        flex: 1,
        width: '100%',
        height: windowHeight, // ✅ s'étend dynamiquement à la taille de l’écran
      }}
    >
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }} className="justify-between items-center px-6 pt-20 pb-10">
          {/* Logo + Titre */}
          <View className="items-center space-y-5 px-4">
            <Image
              source={require('../assets/logo/logo-agrisnap.png')}
              style={{ width: 140, height: 140 }}
              resizeMode="contain"
            />
        
            <Text className="text-2xl text-white font-bold tracking-wide text-center font-medium"
            style={{ letterSpacing: 0.5 }}>
              Révélez le plein potentiel de vos récoltes grâce à l’agriculture numérique.
            </Text>
            <Text className="text-lg text-white text-center leading-relaxed font-medium">
              <span className='text-xl text-green-800 font-bold'>AgriSnap</span> vous aide à analyser votre sol,{'\n'} comprendre ses besoins et recommander les cultures idéales.
            </Text>
          </View>

          {/* Bouton */}
          <View className="w-full px-4">
            <TouchableOpacity
              onPress={() => router.push('/login')}
              className="bg-green-800 py-4 rounded-2xl shadow-md"
            >
              <Text className="text-white text-center font-semibold text-lg">Commencer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
