import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

export default function History() {
  const [diseaseHistory, setDiseaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      fetchDiseaseHistory();
    } // Only fetch when screen is focused
  }, [isFocused]);

  const fetchDiseaseHistory = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      console.error("Auth token not found for history");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/disease-history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error(
          "Network response was not ok, when fetching disease history"
        );
      const data = await response.json();
      setDiseaseHistory(data.disease_history || []);
      console.log("Disease History:", data.disease_history);
      console.log("Fetched disease history successfully");
    } catch (error) {
      console.error("Failed to fetch disease history:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <MaterialCommunityIcons name="virus" size={28} color="#e74c3c" />
      <View style={styles.cardContent}>
        <Text style={styles.diseaseName}>{item.disease}</Text>
        <Text style={styles.date}>📅 {new Date(item.date).toDateString()}</Text>
        <Text style={styles.location}>
          📍 Lat: {item.latitude}, Lng: {item.longitude}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2c3e50" />
      ) : (
        <FlatList
          data={diseaseHistory}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa", padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#2c3e50",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardContent: { marginLeft: 12, flex: 1 },
  diseaseName: { fontSize: 18, fontWeight: "bold", color: "#e74c3c" },
  date: { color: "#555", marginTop: 4 },
  location: { color: "#555", marginTop: 4 },
});
