import React from "react";
import { Text, View, FlatList, StyleSheet, Button } from "react-native";

export default function SelectedSymptomsList({
  symptoms,
  selectedSymptoms,
  onRemove,
}) {
  const getSymptomName = (id) =>
    symptoms.find((symptom) => symptom.id === id)?.name || "";
  return (
    <FlatList
      data={selectedSymptoms}
      keyExtractor={(item) => item.toString()}
      renderItem={({ item }) => (
        <View style={styles.selectedItem}>
          <Text>{symptoms.find((symptom) => symptom.id === item)?.name}</Text>
          <Button title="Remove" onPress={() => onRemove(item)} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  selectedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
});
