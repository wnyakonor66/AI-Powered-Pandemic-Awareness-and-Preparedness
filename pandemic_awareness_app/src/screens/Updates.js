import React, { useEffect, useState, useCallback, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TouchableOpacity,
} from "react-native";
import {
  Card,
  Button,
  Title,
  Paragraph,
  Portal,
  Provider as PaperProvider,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { API_URL } from "@env";

// Memoized Card Component for FlatList
const UpdatesCard = memo(function UpdatesCard({
  disease,
  location,
  cases,
  gender,
  age,
  time,
  onShowPrecautions,
  description,
}) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.rowBetween}>
          <Title style={styles.diseaseTitle}>
            <Icon name="virus" size={22} color="#D32F2F" /> {disease}
          </Title>
          <Button
            mode="outlined"
            compact
            onPress={onShowPrecautions}
            icon="shield-alert"
            style={styles.precautionBtn}
          >
            Precautions
          </Button>
        </View>
        <Paragraph style={styles.descriptionText}>
          <Icon name="information-outline" size={16} color="#1976D2" />
          {description || "Tap 'Precautions' for more info."}
        </Paragraph>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon name="map-marker" size={18} color="#388E3C" />
            <Text style={styles.detailText}>{location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="account-group" size={18} color="#1976D2" />
            <Text style={styles.detailText}>Cases: {cases}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon name="gender-male-female" size={18} color="#7B1FA2" />
            <Text style={styles.detailText}>Gender: {gender}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="calendar-account" size={18} color="#FBC02D" />
            <Text style={styles.detailText}>Age: {age}</Text>
          </View>
        </View>
        <Text style={styles.dateText}>
          <Icon name="clock-outline" size={15} color="#777" /> {time}
        </Text>
      </Card.Content>
    </Card>
  );
});

export default function Updates() {
  const [outbreaks, setOutbreaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPrecautions, setSelectedPrecautions] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [descCache, setDescCache] = useState({}); // Cache for disease descriptions

  useEffect(() => {
    fetchOutbreaks();
  }, []);

  const fetchOutbreaks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/outbreaks`);
      const data = await response.json();
      setOutbreaks(data.reverse()); // Latest first
    } catch (error) {
      console.error("Error fetching outbreaks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowPrecautions = async (disease) => {
    setSelectedDisease(disease);
    setModalVisible(true);
    setModalLoading(true);
    setModalError("");
    // Check cache first
    if (descCache[disease]) {
      setSelectedDescription(descCache[disease].description);
      setSelectedPrecautions(descCache[disease].precautions);
      setModalLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/disease-description?disease=${encodeURIComponent(disease)}`
      );
      if (!response.ok) throw new Error("Not found");
      const data = await response.json();
      setSelectedDescription(data.description);
      setSelectedPrecautions(data.precautions);
      setDescCache((prev) => ({ ...prev, [disease]: data }));
    } catch (err) {
      setModalError("No description or precautions found for this disease.");
      setSelectedDescription("");
      setSelectedPrecautions([]);
    } finally {
      setModalLoading(false);
    }
  };

  // Memoize renderItem for FlatList
  const renderItem = useCallback(
    ({ item }) => {
      const time = item.timestamp
        ? new Date(item.timestamp).toLocaleString()
        : "Unknown time";
      const disease = item.predicted_disease || "Unknown Disease";
      const location = item.location_name || "Unknown Location";
      const cases = item.case_count || 1;
      const gender = item.gender || "N/A";
      const age = item.age || "N/A";
      return (
        <UpdatesCard
          disease={disease}
          location={location}
          cases={cases}
          gender={gender}
          age={age}
          time={time}
          onShowPrecautions={() => handleShowPrecautions(disease)}
          description={descCache[disease]?.description}
        />
      );
    },
    [descCache]
  );

  return (
    <PaperProvider>
      <View style={styles.headerContainer}>
        <Icon name="newspaper-variant-outline" size={32} color="#1976D2" />
        <Text style={styles.headerTitle}>Outbreak News Feed</Text>
        <Text style={styles.headerSubtitle}>
          Stay updated with real-time outbreak reports, trends, and safety tips.
        </Text>
      </View>
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1976D2" />
        </View>
      ) : outbreaks.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="emoticon-sad-outline" size={60} color="#B0BEC5" />
          <Text style={styles.emptyText}>
            No outbreak updates at the moment.
          </Text>
        </View>
      ) : (
        <FlatList
          data={outbreaks}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchOutbreaks} />
          }
        />
      )}
      <Portal>
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedDisease} Precautions
              </Text>
              {modalLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#1976D2"
                  style={{ marginVertical: 10 }}
                />
              ) : modalError ? (
                <Text style={{ color: "red", marginBottom: 10 }}>
                  {modalError}
                </Text>
              ) : (
                <>
                  <Text style={styles.modalDescription}>
                    {selectedDescription}
                  </Text>
                  {selectedPrecautions.map((prec, idx) => (
                    <Text key={idx} style={styles.modalPrecaution}>
                      • {prec}
                    </Text>
                  ))}
                </>
              )}
              <Button
                mode="contained"
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
              >
                Close
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#f4f6f8",
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 18,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  diseaseTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#D32F2F",
    flex: 1,
  },
  descriptionText: {
    fontSize: 14,
    color: "#1976D2",
    marginBottom: 6,
    marginTop: 2,
    flexWrap: "wrap", // ✅ force wrap
    flexShrink: 1,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    marginTop: 2,
    flexWrap: "wrap", // ✅ force wrap
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 4,
    flexWrap: "wrap", // ✅ force wrap
    flexShrink: 1,
  },
  dateText: {
    fontSize: 12,
    color: "#777",
    textAlign: "right",
    marginTop: 4,
  },
  headerContainer: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1976D2",
    marginTop: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
    textAlign: "center",
    marginHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 24,
    width: "85%",
    alignItems: "center",
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 15,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  modalPrecaution: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  closeBtn: {
    marginTop: 16,
    width: "100%",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  precautionBtn: {
    borderColor: "#1976D2",
  },
});
