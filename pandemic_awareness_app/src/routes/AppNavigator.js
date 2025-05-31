import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import UserScreen from "../screens/UserScreen";
import * as Splashscreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import AdminTabNavigator from "./AdminTabNavigator";
import UserTabNavigator from "./UserTabNavigator";

const Stack = createNativeStackNavigator();

Splashscreen.preventAutoHideAsync();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          let decodedToken;
          try {
            decodedToken = jwtDecode(token);
          } catch (decodeError) {
            console.error("Invalid or corrupted token:", decodeError);
            await AsyncStorage.removeItem("authToken");
            await AsyncStorage.removeItem("userRole");
            setInitialRoute("Home");
            await Splashscreen.hideAsync();
            return;
          }

          const currentTime = Math.floor(Date.now() / 1000);
          if (decodedToken.exp < currentTime) {
            await AsyncStorage.removeItem("authToken");
            await AsyncStorage.removeItem("userRole");
            setInitialRoute("Home");
          } else {
            const role = await AsyncStorage.getItem("userRole");
            setInitialRoute(role === "admin" ? "AdminScreen" : "UserScreen");
          }
        } else {
          setInitialRoute("Home");
        }
      } catch (error) {
        console.error("Unable to load auth", error);
        setInitialRoute("Home");
      } finally {
        await Splashscreen.hideAsync();
      }
    };

    checkUserRole();
  }, []);

  if (!initialRoute) {
    return null;
  }
  console.log("Login:", Login);
  console.log("SignUp:", SignUp);
  console.log("UserScreen:", UserScreen);
  console.log("AdminTabNavigator:", AdminTabNavigator);
  console.log("UserTabNavigator:", UserTabNavigator);

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="LogIn" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="UserScreen" component={UserTabNavigator} />
      <Stack.Screen name="AdminScreen" component={AdminTabNavigator} />
    </Stack.Navigator>
  );
}
