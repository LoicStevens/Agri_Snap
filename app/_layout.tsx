// _layout.tsx
import { Stack } from "expo-router";
import { LogBox } from "react-native";
import { useEffect } from "react";

export default function Layout() {
  useEffect(() => {
    LogBox.ignoreLogs(["Warning: ..."]);
    console.log("App loaded");
  }, []);

  return (
    <Stack />
  );
}
