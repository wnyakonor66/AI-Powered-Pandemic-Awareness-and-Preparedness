import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DiseaseHistory() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Disease History</Text>
      <Text style={styles.description}>
        This feature is under development. Stay tuned for updates!
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
  },
});
