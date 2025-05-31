import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function UserProfile() {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Edit Profile</Text>
        {/* <View>
          <label htmlFor="username">Username:</label>
        </View> */}
        <Text style={styles.description}>
          This feature is about to be implemented. Stay tuned for updates!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f6fa",
  },

  innerContainer: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
    elevation: 3,
    width: "100%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 50,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
