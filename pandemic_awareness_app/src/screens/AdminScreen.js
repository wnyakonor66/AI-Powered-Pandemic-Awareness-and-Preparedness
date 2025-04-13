import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps"; // Use Marker instead of custom View for easier handling
import { API_URL } from "@env";
import { globalStyles } from "../../styles/global";
import Ionicons from "@expo/vector-icons/Ionicons";

// Define a threshold distance (in km) to detect nearby outbreaks
const THRESHOLD_DISTANCE = 50; // 50 km

const { height } = Dimensions.get("window");

const AdminScreen = () => {
  const [loading, setLoading] = useState(true);
  const [outbreak, setOutbreak] = useState([]);

  // Helper function to calculate distance using the Haversine formula
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  // Function to check if any outbreak is within the threshold
  const checkOutbreakThreshold = (latitude, longitude) => {
    return outbreak.some((item) => {
      const distance = haversineDistance(
        latitude,
        longitude,
        item.latitude,
        item.longitude
      );
      return distance <= THRESHOLD_DISTANCE; // Check if within threshold distance
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/outbreaks`);
        if (!response.ok) {
          throw new Error("Failed to fetch outbreaks");
        }
        const data = await response.json();
        console.log("Outbreak data:", data);
        setOutbreak(data);
      } catch (error) {
        Alert.alert("Error", "Failed to load outbreak data");
        console.error("Error fetching outbreaks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  // Example: Check for outbreaks within a specific area (your admin's location for example)
  const adminLatitude = 5.6037; // Replace with actual latitude
  const adminLongitude = -0.187; // Replace with actual longitude
  const isOutbreakNear = checkOutbreakThreshold(adminLatitude, adminLongitude);

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.header}>Admin Dashboard</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsContainer}>
            <StatCard
              title="Reported Cases"
              count={213}
              iconName="alert-circle-outline"
              iconColor="#FF6347"
            />
            <StatCard
              title="Affected Locations"
              count={outbreak.length}
              iconName="location-outline"
              iconColor="#4682B4"
            />
            <StatCard
              title="Disease Types"
              count={5}
              iconName="medkit-outline"
              iconColor="#32CD32"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outbreak Map</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: outbreak.length > 0 ? outbreak[0].latitude : 37.78825,
                longitude:
                  outbreak.length > 0 ? outbreak[0].longitude : -122.4324,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
              }}
            ></MapView>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outbreak Near You</Text>
          <Text>
            {isOutbreakNear
              ? "Yes, there's an outbreak near you!"
              : "No outbreaks nearby"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const StatCard = ({ title, count, iconName, iconColor }) => (
  <View style={styles.statCard}>
    <Ionicons name={iconName} size={25} color={iconColor} />
    <Text style={styles.statCount}>{count}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  innerContainer: {
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "nunito-regular",
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    paddingVertical: 20,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    padding: 10,
  },
  statCount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  statTitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  mapContainer: {
    width: "100%",
    height: height * 0.35,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AdminScreen;
