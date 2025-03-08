import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as Font from "expo-font";
import { useState, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/routes/AppNavigator";

SplashScreen.preventAutoHideAsync();

const getFonts = async () =>
  await Font.loadAsync({
    "nunito-regular": require("./assets/fonts/Nunito-Regular.ttf"),
    "nunito-light": require("./assets/fonts/Nunito-Light.ttf"),
  });

export default function App() {
  const [fontsloaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadResources() {
      await getFonts();
      setFontsLoaded(true);
      await SplashScreen.hideAsync();
    }
    loadResources();
  }, []);

  if (!fontsloaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
