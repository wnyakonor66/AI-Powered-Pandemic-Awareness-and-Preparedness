import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getUserDetails } from "../shared/auth";
import { useIsFocused } from "@react-navigation/native";

export default function WelcomeBanner() {
  const [username, setUsername] = useState("");
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchUsername();
    }
  }, [isFocused]);

  const fetchUsername = async () => {
    try {
      const userDetails = await getUserDetails();
      if (userDetails?.username) {
        setUsername(userDetails.username);
      } else {
        console.warn("Username not found in user details");
      }
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}> Welcome back, </Text>
      <Text style={styles.username}>{username ? username : "User"}👋</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    // alignSelf: "flex-start",
    // marginBottom: 20,
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "center",
    // padding: 10,
  },
  welcomeText: {
    fontSize: 20,
    color: "#666",
    fontWeight: "bold",
    alignItems: "center",
  },
  username: {
    fontSize: 24,
    color: "#1E90FF",
    fontWeight: "bold",
    alignItems: "center",
  },
});
