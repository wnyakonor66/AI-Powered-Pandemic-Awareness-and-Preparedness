import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Button,
  ScrollView,
} from "react-native";
import { API_URL } from "@env";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SelectedSymptomsList from "../component/SelectedSymptomsList";
import WelcomeBanner from "../component/WelcomeBanner";
import SymptomSearchBox from "../component/SymptomSearchBox";

export default function UserScreen() {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [location, setLocation] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [locationName, setLocationName] = useState(null);

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
      const locationName = await reverseGeocode(latitude, longitude);
      console.log("Location Name:", locationName);
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
          location_name: locationName,
        }),
      });

      const data = await response.json();
      console.log("Location stored with reverse geocoded name:", data);
      console.log("Sending location with disease:", {
        latitude,
        longitude,
        predicted_disease: predictedDisease,
        location_name: locationName,
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
      const name = await reverseGeocode(
        userLocation.latitude,
        userLocation.longitude
      ); // NEW
      setLocationName(name);
      // sendUserLocation(userLocation.latitude, userLocation.longitude);
    } catch (error) {
      Alert.alert("Error", "Could not fetch location");
    }
  };

  const reverseGeocode = async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&limit=1`;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "pandemic-awareness-app/1.0 nyakonor@example.com",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch geocoding data");
      }

      const data = await response.json();

      if (data && data.address) {
        const {
          city,
          town,
          village,
          hamlet,
          suburb,
          district,
          state,
          county,
          country,
        } = data.address;

        let locationName =
          city ||
          town ||
          village ||
          hamlet ||
          suburb ||
          district ||
          state ||
          county ||
          country ||
          "Unknown Location";

        return locationName;
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      return "Unknown Location";
    }
  };

  //Add a selected symptom
  const handleAddSymptom = (value) => {
    if (value && !selectedSymptoms.includes(value)) {
      setSelectedSymptoms([...selectedSymptoms, value]);
    }
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
        const result = data.prediction || "No disease detected";
        setPredictionResult(result);
        sendUserLocation(location.latitude, location.longitude, result);
      })
      .catch((error) => console.error("Error making prediction:", error));
  };

  const handleRemoveSymptom = (id) => {
    setSelectedSymptoms((prev) => prev.filter((symptom) => symptom !== id));
  };

  const isPredictDisabled = selectedSymptoms.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.locationContainer}>
        <WelcomeBanner />

        {location ? (
          <Text style={styles.locationText}>
            Your Location: {locationName || "Loading..."}
            {/* {location.latitude}, {location.longitude}) */}
          </Text>
        ) : (
          <Text>Fetching location...</Text>
        )}
      </View>

      <Text>Select symptoms</Text>
      <SymptomSearchBox
        symptomList={symptoms}
        onSymptomSelect={handleAddSymptom}
      />

      <SelectedSymptomsList
        symptoms={symptoms}
        selectedSymptoms={selectedSymptoms}
        onRemove={handleRemoveSymptom}
        onClearAll={() => setSelectedSymptoms([])}
      />

      {/* <Button title="Analyze Symptoms" onPress={handlePredict} /> */}
      <Button
        title="Analyze Symptoms"
        onPress={handlePredict}
        disabled={isPredictDisabled}
        color={isPredictDisabled ? "#ccc" : "#4CAF50"} // gray if disabled, green if active
      />

      {predictionResult && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Prediction Result</Text>
          <Text style={styles.resultText}>{predictionResult}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    padding: 20,
    backgroundColor: "#f5f6fa",
  },
  resultCard: {
    marginTop: 20,
    padding: 5,
    backgroundColor: "#d0f0c0",
    borderRadius: 10,
    borderColor: "#2e7d32",
    borderWidth: 2,
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 5,
  },
  resultText: {
    fontSize: 18,
    color: "#1b5e20",
  },
  locationContainer: {
    alignSelf: "flex-start",
    marginBottom: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
