import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import Settings from "../screens/Settings";
import Location from "../screens/Location";
import AdminScreen from "../screens/AdminScreen";

const Tab = createBottomTabNavigator();

const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Dashboard") iconName = "stats-chart";
          else if (route.name === "Location") iconName = "location";
          else if (route.name === "Settings") iconName = "settings";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007BFF",
        tabBarInactiveTintColor: "gray",
        headerShown: false,

        tabBarStyle: {
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 14,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminScreen} />
      <Tab.Screen name="Location" component={Location} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;
