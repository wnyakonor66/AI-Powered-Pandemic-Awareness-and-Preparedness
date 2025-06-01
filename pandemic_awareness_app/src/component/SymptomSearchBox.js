import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function SymptomSearchBox({ symptomList, onSymptomSelect }) {
  const [searchText, setSearchText] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (showAll) {
      setFilteredList(symptomList);
    }
  }, [showAll, symptomList]);

  const handleSearch = (text) => {
    setSearchText(text);
    // if (text.trim() === "") {
    //   setFilteredList([]);
    //   return;
    // }

    if (!text) {
      setFilteredSymptoms(symptomList);
      return;
    }
    const filtered = symptomList.filter((symptom) =>
      symptom.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredList(filtered);
  };

  const handleSelect = (symptom) => {
    onSymptomSelect(symptom.id); // send ID to parent
    setSearchText(""); // clear input
    setFilteredList([]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search symptom..."
        value={searchText}
        onChangeText={handleSearch}
        style={styles.input}
        onFocus={() => setShowAll(true)}
        onBlur={() => setShowAll(false)}
      />
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item)}>
            <Text style={styles.item}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  item: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
