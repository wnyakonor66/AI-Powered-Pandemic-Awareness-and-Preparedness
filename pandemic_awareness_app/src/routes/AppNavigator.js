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

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#1a237e" },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="LogIn"
        component={Login}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1a237e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: "nunito-regular",
          },
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1a237e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: "nunito-regular",
          },
        }}
      />
      <Stack.Screen name="UserScreen" component={UserTabNavigator} />
      <Stack.Screen name="AdminScreen" component={AdminTabNavigator} />
    </Stack.Navigator>
  );
}
