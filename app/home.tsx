import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ImageBackground, Dimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

import { getPredictions } from "./utils/predictionStorage";

const windowHeight = Dimensions.get('window').height;

// Typage pour un élément d'historique
type Prediction = {
  id: number;
  imageUri: string;
  crops: string[];
  date: string;
};

export default function HomeScreen() {
  const [history, setHistory] = useState<Prediction[]>([]);
  const router = useRouter();

  // Typage explicite de err
  useEffect(() => {
    getPredictions()
      .then(setHistory)
      .catch((err: Error) => console.error("Erreur chargement historique :", err));
  }, []);

  // Typage explicite du paramètre isoDate : string
  const formatRelativeDate = (isoDate: string): string => {
    const now = new Date();
    const date = new Date(isoDate);
    const diffMs = now.getTime() - date.getTime();

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'aujourd\'hui';
    if (diffDays === 1) return 'il y a 1 jour';
    if (diffDays < 7) return `il y a ${diffDays} jours`;
    const weeks = Math.floor(diffDays / 7);
    if (weeks === 1) return 'il y a 1 semaine';
    return `il y a ${weeks} semaines`;
  };

  return (
    <ImageBackground
      source={require("../assets/background/bg.png")}
      resizeMode="cover"
      imageStyle={{ opacity: 0.7 }}
      style={{ flex: 1, width: "100%", height: windowHeight }}
    >
      <SafeAreaView className="flex-1 px-6 pt-6 pb-16">
        {/* Header */}
        <Text className="text-white text-2xl font-bold px-4 mt-4">AgriSnap</Text>
        <Text className="text-white text-sm mb-6 px-4">
          Téléversez ou capturez une image du sol pour l'analyser 
        </Text>

        {/* Stats cards */}
        <View className="flex-row justify-between px-4 mb-6">
          <View className="bg-green800 rounded-xl w-[48%] p-4">
            <Text className="text-white text-2xl font-semibold">{history.length}</Text>
            <Text className="text-white text-xs">Images testées au total</Text>
          </View>

          <View className="bg-yellowSoft rounded-xl w-[48%] p-4">
            <Text className="text-white text-2xl font-semibold">85%</Text>
            <Text className="text-white text-xs">Confiance moyenne de détection</Text>
          </View>
        </View>

        {/* Start test button */}
        <View className="px-4">
          <TouchableOpacity
            className="bg-yellowSoft py-4 rounded-xl items-center flex-row justify-center mb-8"
            onPress={() => router.push("/upload")}
          >
            <Ionicons name="camera" size={20} color="white" style={{ marginRight: 8 }} />
            <Text className="text-white font-semibold text-base">Commencer un nouveau test</Text>
          </TouchableOpacity>
        </View>

        {/* --- Historique dynamique --- */}
        <Text className="text-white text-base font-semibold px-4 mb-3">
          <MaterialCommunityIcons name="history" size={18} color="white" /> Historique des tests
        </Text>

        <ScrollView className="space-y-3 px-4" style={{ maxHeight: 200 }}>
          {history.length === 0 ? (
            <Text className="text-white px-4">Aucun test enregistré pour le moment.</Text>
          ) : (
            history.map(item => (
              <View key={item.id} className="bg-green800 p-4 rounded-xl flex-row items-center">
                <MaterialCommunityIcons name="sprout" size={20} color="white" style={{ marginRight: 10 }} />
                <Text className="text-white flex-1">
                  {item.crops && item.crops.length > 0 ? item.crops[0] : "Culture inconnue"} – {formatRelativeDate(item.date)}
                </Text>
              </View>
            ))
          )}
        </ScrollView>

        {/* Bottom nav */}
        <View className="absolute bottom-4 left-4 right-4 flex-row justify-between bg-green800 px-6 py-3 rounded-full">
          <TouchableOpacity onPress={() => router.push("/stats")}>
            <Ionicons name="stats-chart" size={26} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/upload")}>
            <Ionicons name="camera" size={28} color="#FFD700" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/Chatbot")}>
            <Ionicons name="chatbubble-ellipses" size={26} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
