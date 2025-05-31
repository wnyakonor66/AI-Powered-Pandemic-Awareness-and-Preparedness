import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import { API_URL } from "@env";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SymptomSelector from "../component/SymptomSelector";
import SelectedSymptomsList from "../component/SelectedSymptomsList";

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

  const sendUserLocation = async (latitude, longitude, predictedDisease) => {
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
        body: JSON.stringify({
          latitude: latitude,
          longitude: longitude,
          predicted_disease: predictedDisease,
        }),
      });

      const data = await response.json();
      console.log("location stored:", data);
      console.log("Sending location with disease:", {
        latitude,
        longitude,
        predicted_disease: predictedDisease,
      });
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
      // sendUserLocation(userLocation.latitude, userLocation.longitude);
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
    if (!location) {
      Alert.alert("location data is missing");
      return;
    }
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
        sendUserLocation(
          location.latitude,
          location.longitude,
          data.prediction
        );
      })
      .catch((error) => console.error("Error making prediction:", error));
  };

  return (
    <View style={styles.container}>
      <Text>Select symptoms</Text>
      <SymptomSelector symptoms={symptoms} onAddSymptom={handleAddSymptom} />
      <SelectedSymptomsList
        selectedSymptoms={selectedSymptoms}
        symptoms={symptoms}
        onRemove={handleRemoveSymptom}
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
});
