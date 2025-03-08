import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import AdminScreen from "../screens/AdminScreen";
import UserScreen from "../screens/UserScreen";
import * as Splashscreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const stack = createNativeStackNavigator();

Splashscreen.preventAutoHideAsync();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          const role = await AsyncStorage.getItem("userRole");
          setInitialRoute(role === "admin" ? "AdminScreen" : "UserScreen");
        } else {
          setInitialRoute("Home");
        }
      } catch (error) {
        console.error("Unable to load auth", error);
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
    <stack.Navigator initialRouteName={initialRoute}>
      <stack.Screen name="Home" component={HomeScreen} />
      <stack.Screen name="LogIn" component={Login} />
      <stack.Screen name="SignUp" component={SignUp} />
      <stack.Screen name="UserScreen" component={UserScreen} />
      <stack.Screen name="AdminScreen" component={AdminScreen} />
    </stack.Navigator>
  );
}
