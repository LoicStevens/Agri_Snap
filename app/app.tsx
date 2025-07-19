import { useEffect } from "react";
import { View, Image } from "react-native";
import * as SplashScreen from "expo-splash-screen";

// Empêcher le splash screen de disparaître immédiatement
SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    const loadApp = async () => {
      // Simule un chargement (ex: API, base de données)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Cache le splash screen après chargement
      await SplashScreen.hideAsync();
    };

    loadApp();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image source={require("../assets/loader.png")} style={{ width: 200, height: 200 }} />
    </View>
  );
}
