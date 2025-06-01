import React from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";

export default function SelectedSymptomsList({
  symptoms,
  selectedSymptoms,
  onRemove,
  onClearAll,
}) {
  const getSymptomName = (id) =>
    symptoms.find((symptom) => symptom.id === id)?.name || "";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Symptoms:</Text>
      {selectedSymptoms.length === 0 ? (
        <Text style={styles.empty}>No symptoms selected</Text>
      ) : (
        <>
          <FlatList
            data={selectedSymptoms}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => (
              <View style={styles.selectedItem}>
                <Text>{getSymptomName(item)}</Text>
                <Button title="Remove" onPress={() => onRemove(item)} />
              </View>
            )}
          />
          <TouchableOpacity style={styles.clearButton} onPress={onClearAll}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  title: { fontWeight: "bold", marginBottom: 5 },
  empty: { fontStyle: "italic", color: "gray" },
  selectedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  clearButton: {
    backgroundColor: "#ff6666",
    padding: 10,
    marginTop: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  clearText: {
    color: "white",
    fontWeight: "bold",
  },
});
