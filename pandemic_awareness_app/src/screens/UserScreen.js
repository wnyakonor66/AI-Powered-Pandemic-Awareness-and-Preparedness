import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Button, FlatList } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { API_URL } from "@env";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserScreen() {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [location, setLocation] = useState(null);

  // Fetch symptoms from backend
  useEffect(() => {
    fetch(`${API_URL}/symptoms`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Symptoms API Response:", data);
        setSymptoms(data.symptoms || []);
      })
      .catch((error) => console.error("Error fetching symptoms:", error));

    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      getUserLocation();
    } else {
      Alert.alert(
        "Location Permission Denied",
        "Enable location in settings for outbreak detection"
      );
    }
  };

  const sendUserLocation = async (latitude, longitude) => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      console.error("Auth token not found");
      return;
    }
    console.log("Auth Token:", token);
    try {
      const response = await fetch(`${API_URL}/store-location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ latitude: latitude, longitude: longitude }),
      });

      const data = await response.json();
      console.log("location stored:", data);
    } catch (error) {
      console.error("Error", "failed to send location");
    }
  };

  const getUserLocation = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({});
      const userLocation = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setLocation(userLocation);
      sendUserLocation(userLocation.latitude, userLocation.longitude);
    } catch (error) {
      Alert.alert("Error", "Could not fetch location");
    }
  };

  //Add a selected symptom
  const handleAddSymptom = (value) => {
    if (value && !selectedSymptoms.includes(value)) {
      setSelectedSymptoms([...selectedSymptoms, value]);
    }
  };

  //Remove selected symptoms
  const handleRemoveSymptom = (value) => {
    setSelectedSymptoms(
      selectedSymptoms.filter((symptom) => symptom !== value)
    );
  };

  // Send selected symptoms to backend
  const handlePredict = () => {
    fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symptoms: selectedSymptoms,
        latitude: location.latitude,
        longitude: location.longitude,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Prediction Response:", data);
        Alert.alert("Prediction Result", data.prediction || "No result");
      })
      .catch((error) => console.error("Error making prediction:", error));
  };

  return (
    <View style={styles.container}>
      <Text>Select symptoms</Text>
      <RNPickerSelect
        onValueChange={handleAddSymptom}
        items={symptoms.map((s) => ({ label: s.name, value: s.id }))}
        placeholder={{ label: "Select a symptom...", value: null }}
      />
      <FlatList
        data={selectedSymptoms}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <View style={styles.selectedItem}>
            <Text>{symptoms.find((s) => s.id === item)?.name}</Text>
            <Button title="Remove" onPress={() => handleRemoveSymptom(item)} />
          </View>
        )}
      />
      {location ? (
        <Text>
          latitude: {location.latitude}, longitude: {location.longitude}
        </Text>
      ) : (
        <Text>Fetching location...</Text>
      )}
      <Button title="Analyze Symptoms" onPress={handlePredict} />
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
