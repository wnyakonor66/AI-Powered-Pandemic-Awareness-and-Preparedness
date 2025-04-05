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
import MapView, { Marker } from "react-native-maps";
import { API_URL } from "@env";
import { globalStyles } from "../../styles/global";

// const { width, height } = Dimensions.get("window");

const AdminScreen = () => {
  const [loading, setLoading] = useState(true);
  const [outbreak, setOutbreak] = useState([]);

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

  return (
    <View style={globalStyles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      <View style={styles.statsContainer}>
        <StatCard title="Reported Cases" count={213} />
        <StatCard title="Affected Locations" count={3} />
        <StatCard title="Disease Types" count={5} />
      </View>
    </View>
  );
};

const StatCard = ({ title, count }) => {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statCount}>{count}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    textAlign: "center",
    marginVertical: 5,
    fontFamily: "nunito-regular",
    fontWeight: "700",
    paddingRight: 50,
    lineHeight: 30,
    padding: 5,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#eaeaea",
    width: "30%",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: "center",
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginVertical: 4,
    marginHorizontal: 6,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    borderColor: "red",
    borderWidth: 1,
    height: 80,
  },
  statTitle: {
    fontSize: 18,
    color: "gray",
    fontWeight: 600,
    textAlign: "center",
  },
  statCount: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  // map: {
  //   width: "100%",
  //   height: height * 0.5,
  //   borderRadius: 10,
  // },
  // loader: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // innerContainer: {
  //   width: "90%",
  //   height: height * 0.5,
  //   alignSelf: "center",
  //   borderRadius: 10,
  //   overflow: "hidden",
  //   marginVertical: 10,
  // },
});

export default AdminScreen;
