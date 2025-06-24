import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { API_URL } from "@env";
import { globalStyles } from "../../styles/global";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, {
  withTiming,
  withRepeat,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Picker } from "@react-native-picker/picker";
import DailyBarChart from "../component/TrendsChart/DailyBarChart";
import PieDiseaseChart from "../component/PieDisease";

const THRESHOLD_DISTANCE = 50; // 50 km
const { height } = Dimensions.get("window");

const AdminScreen = () => {
  const [loading, setLoading] = useState(true);
  const [outbreaks, setOutbreak] = useState([]);
  const mapRef = useRef(null);
  const [diseaseTypeCount, setDiseaseTypeCount] = useState(0);
  const [reportedCaseCount, setReportedCaseCount] = useState(0);
  const [filteredCases, setFilteredCases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedSlice, setSelectedSlice] = useState(null);
  const [selectedAgeRange, setSelectedAgeRange] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const rotation = useSharedValue(0);
  const animatedRefreshStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation.value}deg`,
        },
      ],
    };
  });

  // Haversine formula to calculate distance between two coordinates
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Checks if any outbreak is within 50km of the admin
  const checkOutbreakThreshold = (latitude, longitude) => {
    return outbreaks.some((item) => {
      const distance = haversineDistance(
        latitude,
        longitude,
        item.latitude,
        item.longitude
      );
      return distance <= THRESHOLD_DISTANCE;
    });
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

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/outbreaks`);
      if (!response.ok) throw new Error("Failed to fetch outbreaks");

      const rawData = await response.json();

      // Enhance each outbreak with readable location
      const enhancedData = await Promise.all(
        rawData.map(async (outbreak) => {
          const locationName = await reverseGeocode(
            outbreak.latitude,
            outbreak.longitude
          );
          return { ...outbreak, location: locationName };
        })
      );

      setOutbreak(enhancedData);
      setFilteredCases(enhancedData);

      const uniqueDiseases = new Set(
        enhancedData.map((item) => item.predicted_disease)
      );
      setDiseaseTypeCount(uniqueDiseases.size);
      const totalCases = enhancedData.reduce(
        (sum, item) => sum + item.case_count,
        0
      );
      setReportedCaseCount(totalCases);
    } catch (error) {
      Alert.alert("Error", "Failed to load outbreak data");
      console.error("Error fetching outbreaks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const pieData = useMemo(() => {
  //   const map = {};
  //   outbreaks.forEach(({ predicted_disease, location }) => {
  //     if (!map[predicted_disease]) {
  //       map[predicted_disease] = { count: 0, locations: new Set() };
  //     }
  //     map[predicted_disease].count++;
  //     map[predicted_disease].locations.add(location);
  //   });
  //   return Object.entries(map)
  //     .map(([disease, { count, locations }], i) => ({
  //       name: disease,
  //       count,
  //       locations: Array.from(locations),
  //     }))
  //     .sort((a, b) => b.count - a.count)
  //     .slice(0, 5);
  // }, [outbreaks]);

  const pieData = useMemo(() => {
    const map = {};
    outbreaks.forEach((outbreak) => {
      const { predicted_disease, location, age, gender } = outbreak;

      if (!map[predicted_disease]) {
        map[predicted_disease] = {
          count: 0,
          locations: new Set(),
          ages: [],
          genders: {},
        };
      }

      map[predicted_disease].count++;
      map[predicted_disease].locations.add(location);

      // Add age
      if (typeof age === "number") {
        map[predicted_disease].ages.push(age);
      }

      // Add gender count
      if (gender) {
        map[predicted_disease].genders[gender] =
          (map[predicted_disease].genders[gender] || 0) + 1;
      }
    });

    return Object.entries(map)
      .map(([disease, { count, locations, ages, genders }]) => ({
        name: disease,
        count,
        locations: Array.from(locations),
        ages,
        genders,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [outbreaks]);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  const adminLatitude = 5.6037;
  const adminLongitude = -0.187;
  const isOutbreakNear = checkOutbreakThreshold(adminLatitude, adminLongitude);

  const applyFilters = () => {
    let result = outbreaks;
    if (selectedDisease) {
      result = result.filter(
        (item) => item.predicted_disease === selectedDisease
      );
    }
    if (selectedLocation) {
      result = result.filter((item) => item.location === selectedLocation);
    }
    if (selectedGender) {
      result = result.filter((item) => item.gender === selectedGender);
    }

    if (selectedAgeRange) {
      const [minAge, maxAge] = selectedAgeRange.split("-").map(Number);
      result = result.filter(
        (item) => item.age >= minAge && item.age <= maxAge
      );
    }

    setFilteredCases(result);
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Admin Dashboard</Text>

          <TouchableOpacity
            onPress={() => {
              rotation.value = withRepeat(
                withTiming(360, { duration: 1000 }),
                -1, // infinite loop
                false
              );

              setLoading(true);
              fetchData().finally(() => {
                rotation.value = 0; // Stop rotation
                setLoading(false);
              });
            }}
            disabled={loading}
            style={styles.refreshButton}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Animated.View style={animatedRefreshStyle}>
                <Ionicons name="refresh" size={25} color="#000" />
              </Animated.View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsContainer}>
            <StatCard
              title="Reported Cases"
              count={reportedCaseCount}
              iconName="alert-circle-outline"
              iconColor="#FF6347"
            />
            <StatCard
              title="Affected Locations"
              count={outbreaks.length}
              iconName="location-outline"
              iconColor="#4682B4"
            />
            <StatCard
              title="Disease Types"
              count={diseaseTypeCount}
              iconName="medkit-outline"
              iconColor="#32CD32"
            />
          </View>
        </View>

        <View style={styles.filterCard}>
          <Text style={styles.filterHeader}>Filter Options</Text>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Disease</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedDisease}
                onValueChange={(value) => {
                  setSelectedDisease(value);
                  if (value === null && selectedDisease === null) {
                    setFilteredCases(outbreaks);
                  } else {
                    applyFilters();
                  }
                }}
                style={styles.picker}
              >
                <Picker.Item label="All Diseases" value={null} />
                {[
                  ...new Set(outbreaks.map((item) => item.predicted_disease)),
                ].map((disease, index) => (
                  <Picker.Item key={index} label={disease} value={disease} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Location</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedLocation}
                onValueChange={(value) => {
                  setSelectedLocation(value);
                  if (value === null && selectedLocation === null) {
                    setFilteredCases(outbreaks);
                  } else {
                    applyFilters();
                  }
                }}
                style={styles.picker}
              >
                <Picker.Item label="All Locations" value={null} />
                {[...new Set(outbreaks.map((item) => item.location))].map(
                  (loc, index) => (
                    <Picker.Item key={index} label={loc} value={loc} />
                  )
                )}
              </Picker>
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Gender</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedGender}
                onValueChange={(value) => {
                  setSelectedGender(value);
                  applyFilters();
                }}
                style={styles.picker}
              >
                <Picker.Item label="All Genders" value={null} />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Age Range</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedAgeRange}
                onValueChange={(value) => {
                  setSelectedAgeRange(value);
                  applyFilters();
                }}
                style={styles.picker}
              >
                <Picker.Item label="All Ages" value={null} />
                <Picker.Item label="0 - 12 (Children)" value={[0, 12]} />
                <Picker.Item label="13 - 19 (Teens)" value={[13, 19]} />
                <Picker.Item label="20 - 35 (Young Adults)" value={[20, 35]} />
                <Picker.Item label="36 - 60 (Adults)" value={[36, 60]} />
                <Picker.Item label="60+ (Elderly)" value={[61, 120]} />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outbreak Map</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: 7.9465,
                longitude: -1.0232,
                latitudeDelta: 6,
                longitudeDelta: 6,
              }}
              showsUserLocation={false}
              showsPointsOfInterest={false}
              showsTraffic={false}
              toolbarEnabled={false}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outbreak Details</Text>
          {filteredCases.map((outbreak, index) => (
            <View key={index} style={styles.outbreakItem}>
              <Text style={styles.location}>{outbreak.location}</Text>
              <Text>Disease: {outbreak.predicted_disease}</Text>
              <Text>Cases: {outbreak.case_count}</Text>
              <Text>Age: {outbreak.age}</Text>
              <Text>Gender: {outbreak.gender}</Text>
            </View>
          ))}
        </View>
        <DailyBarChart />

        <View>
          <PieDiseaseChart
            data={pieData}
            onSlicePress={(slice) => setSelectedSlice(slice)}
          />
        </View>
        <Modal
          visible={!!selectedSlice}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedSlice(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedSlice?.name}</Text>
              <Text>Total cases: {selectedSlice?.count}</Text>
              <Text style={{ marginTop: 8, fontWeight: "600" }}>
                Locations:
              </Text>
              <FlatList
                data={selectedSlice?.locations}
                keyExtractor={(l) => l}
                renderItem={({ item }) => <Text>• {item}</Text>}
              />
              <Text style={{ marginTop: 10, fontWeight: "600" }}>
                Gender Breakdown:
              </Text>
              {Object.entries(selectedSlice?.genders || {}).map(
                ([gender, count]) => (
                  <Text key={gender}>
                    • {gender}: {count}
                  </Text>
                )
              )}

              <Text style={{ marginTop: 10, fontWeight: "600" }}>
                Age Range:
              </Text>
              <Text>
                {(() => {
                  const ages = selectedSlice?.ages || [];
                  if (ages.length === 0) return "No data";
                  const min = Math.min(...ages);
                  const max = Math.max(...ages);
                  return `${min} - ${max} years`;
                })()}
              </Text>

              <TouchableOpacity
                onPress={() => setSelectedSlice(null)}
                style={styles.modalClose}
              >
                <Text style={{ color: "#fff" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outbreak Near You</Text>
          <Text>
            {isOutbreakNear
              ? "Yes, there's an outbreak near!"
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
  outbreakItem: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
  },
  location: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  refreshButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "#f2f2f2",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 24,
  },

  filterHeader: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },

  filterGroup: {
    marginBottom: 16,
  },

  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#555",
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },

  picker: {
    width: "100%",
    height: 49,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    maxHeight: height * 0.6,
  },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  modalClose: {
    marginTop: 12,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 6,
    alignSelf: "center",
  },
});

export default AdminScreen;
