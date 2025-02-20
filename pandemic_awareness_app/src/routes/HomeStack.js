import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";

const stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <stack.Navigator>
      <stack.Screen name="Home" component={HomeScreen} />
      <stack.Screen name="LogIn" component={Login} />
      <stack.Screen name="SignUp" component={SignUp} />
    </stack.Navigator>
  );
}

export default HomeStack;
