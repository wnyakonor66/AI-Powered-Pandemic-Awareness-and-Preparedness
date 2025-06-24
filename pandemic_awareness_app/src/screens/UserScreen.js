import React, { useState, useEffect, useCallback, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
  Animated,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { API_URL } from "@env";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SelectedSymptomsList from "../component/SelectedSymptomsList";
import WelcomeBanner from "../component/WelcomeBanner";
import SymptomSearchBox from "../component/SymptomSearchBox";
import HealthTipCard from "../component/HealthTipCard";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";

// Memoized components for better performance
const MemoizedHealthTipCard = memo(HealthTipCard);
const MemoizedSymptomSearchBox = memo(SymptomSearchBox);
const MemoizedSelectedSymptomsList = memo(SelectedSymptomsList);

// Separate component for the diagnosis result
const DiagnosisResult = memo(({ result, fadeAnim }) => (
  <Animated.View style={[styles.resultCard, { opacity: fadeAnim }]}>
    <View style={styles.resultHeader}>
      <Text style={styles.resultTitle}>Diagnosis Result</Text>
      <View style={styles.diseaseContainer}>
        <Text style={styles.diseaseName}>{result.prediction}</Text>
      </View>
    </View>

    <View style={styles.precautionSection}>
      <Text style={styles.precautionTitle}>Precautionary Measures</Text>
      {result.disease_precautions?.map((item, index) => (
        <View key={index} style={styles.precautionItem}>
          <Ionicons name="checkmark-circle" size={18} color="#1a237e" />
          <Text style={styles.precautionText}>{item}</Text>
        </View>
      ))}
    </View>
  </Animated.View>
));

// Separate component for health tips
const HealthTips = memo(() => (
  <View style={styles.healthTipsContainer}>
    <Text style={styles.sectionTitle}>Health Tips</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.healthTipsScroll}
    >
      <MemoizedHealthTipCard
        title="Daily Health Tip"
        description="Wash your hands frequently with soap and water for at least 20 seconds"
        style={styles.healthTipCard}
      />
      <MemoizedHealthTipCard
        title="Prevention"
        description="Maintain social distance and wear masks in crowded places"
        style={styles.healthTipCard}
      />
      <MemoizedHealthTipCard
        title="Emergency"
        description="Know your nearest healthcare facility and emergency contacts"
        style={styles.healthTipCard}
      />
    </ScrollView>
  </View>
));

export default function UserScreen() {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [location, setLocation] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const navigation = useNavigation();

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

  const showMyToast = () => {
    Toast.show({
      type: "customToast",
      text1: "Success",
      text2: "Location sent succesfully!",
      position: "bottom",
      visibilityTime: 3000,
      props: {
        icon: "✅",
        bgColor: "#1e90ff",
      },
    });
  };

  const sendUserLocation = async (latitude, longitude, predictedDisease) => {
    const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      console.error("Auth token not found");
      Alert.alert("Session Expired", "Please log in again.");
      // Optionally, you can navigate to the login screen here
      navigation.navigate("Login");
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
          // age: age,
          // gender: gender,
        }),
      });

      const data = await response.json();
      console.log("Location stored with reverse geocoded name:", data);
      showMyToast();

      console.log("Sending location with disease:", {
        latitude,
        longitude,
        predicted_disease: predictedDisease,
        location_name: locationName,
        // age: age,
        // gender: gender,
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
      );
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

  // Memoize handlers
  const handleAddSymptom = useCallback(
    (value) => {
      if (value && !selectedSymptoms.includes(value)) {
        setSelectedSymptoms((prev) => [...prev, value]);
      }
    },
    [selectedSymptoms]
  );

  const handleRemoveSymptom = useCallback((id) => {
    setSelectedSymptoms((prev) => prev.filter((symptom) => symptom !== id));
  }, []);

  const handleClearSymptoms = useCallback(() => {
    setSelectedSymptoms([]);
  }, []);

  const handlePredict = useCallback(async () => {
    if (!location) {
      Alert.alert(
        "Location Required",
        "Please enable location services to continue."
      );
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      const data = await response.json();
      const result = {
        prediction: data.prediction || "No disease detected",
        disease_precautions: data.disease_precautions || [],
      };

      setPredictionResult(result);
      await sendUserLocation(
        location.latitude,
        location.longitude,
        result.prediction
      );

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Error making prediction:", error);
      Alert.alert(
        "Analysis Error",
        "Unable to analyze symptoms. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, [location, selectedSymptoms, fadeAnim]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a237e", "#283593"]}
        style={styles.headerGradient}
      >
        <WelcomeBanner />
        {location && (
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#fff" />
            <Text style={styles.locationText}>
              {locationName || "Loading location..."}
            </Text>
          </View>
        )}
      </LinearGradient>

      <FlatList
        data={[{ key: "screen-content" }]}
        renderItem={() => (
          <View style={styles.contentContainer}>
            <View style={styles.symptomSection}>
              <Text style={styles.sectionTitle}>Select Your Symptoms</Text>
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
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                selectedSymptoms.length === 0 && styles.disabledButton,
              ]}
              onPress={handlePredict}
              disabled={selectedSymptoms.length === 0 || isAnalyzing}
            >
              {isAnalyzing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Analyze Symptoms</Text>
              )}
            </TouchableOpacity>

            {predictionResult && (
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Diagnosis Result</Text>
                  <View style={styles.diseaseContainer}>
                    <Text style={styles.diseaseName}>
                      {predictionResult.prediction}
                    </Text>
                  </View>
                </View>

                <View style={styles.precautionSection}>
                  <Text style={styles.precautionTitle}>
                    Precautionary Measures
                  </Text>
                  {predictionResult.disease_precautions?.map((item, index) => (
                    <View key={index} style={styles.precautionItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#1a237e"
                      />
                      <Text style={styles.precautionText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.healthTipsContainer}>
              <Text style={styles.sectionTitle}>Health Tips</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.healthTipsScroll}
              >
                <View style={styles.healthTipCardWrapper}>
                  <HealthTipCard
                    title="Daily Health Tip"
                    description="Wash your hands frequently with soap and water for at least 20 seconds"
                    style={styles.healthTipCard}
                  />
                </View>
                <View style={styles.healthTipCardWrapper}>
                  <HealthTipCard
                    title="Prevention"
                    description="Maintain social distance and wear masks in crowded places"
                    style={styles.healthTipCard}
                  />
                </View>
                <View style={styles.healthTipCardWrapper}>
                  <HealthTipCard
                    title="Emergency"
                    description="Know your nearest healthcare facility and emergency contacts"
                    style={styles.healthTipCard}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        )}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  headerGradient: {
    padding: 15,
    paddingTop: 35,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  contentContainer: {
    padding: 15,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 8,
    borderRadius: 15,
    alignSelf: "flex-start",
  },
  locationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    marginLeft: 5,
  },
  symptomSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a237e",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#1a237e",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#9e9e9e",
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  resultHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 12,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a237e",
    marginBottom: 8,
  },
  diseaseContainer: {
    backgroundColor: "#f5f6fa",
    padding: 10,
    borderRadius: 8,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#d32f2f",
    textAlign: "center",
  },
  precautionSection: {
    marginTop: 8,
  },
  precautionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a237e",
    marginBottom: 8,
  },
  precautionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingLeft: 4,
  },
  precautionText: {
    fontSize: 14,
    color: "#424242",
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  healthTipsContainer: {
    marginTop: 15,
  },
  healthTipsScroll: {
    paddingHorizontal: 5,
  },
  healthTipCard: {
    width: "100%",
    height: "100%",
    marginRight: 10,
    borderRadius: 8,
  },
  healthTipCardWrapper: {
    marginRight: 12,
    width: 160,
    height: 160,
  },
});
