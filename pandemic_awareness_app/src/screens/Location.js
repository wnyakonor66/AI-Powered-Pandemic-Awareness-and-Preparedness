// Location.js
import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Switch,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  Dimensions,
} from "react-native";
import { API_URL } from "@env";

const { width } = Dimensions.get("window");

// helper to bucket severity
const getSeverity = (count) =>
  count >= 8
    ? { label: "High", color: "#E63946" }
    : count >= 4
      ? { label: "Medium", color: "#F4A261" }
      : { label: "Low", color: "#2A9D8F" };

export default function Location() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showHighOnly, setShowHighOnly] = useState(false);
  const [selected, setSelected] = useState(null);

  // fetch & group
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/outbreaks`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        const map = {};
        data.forEach((o) => {
          const loc = o.location || "Miscellaneous";
          if (!map[loc]) map[loc] = { items: [], diseases: new Set() };
          map[loc].items.push(o);
          map[loc].diseases.add(o.predicted_disease);
        });

        setRegions(
          Object.entries(map).map(([location, { items, diseases }]) => ({
            location,
            items,
            count: items.length,
            diseaseCount: diseases.size,
          }))
        );
      } catch {
        Alert.alert("Error", "Could not load outbreak data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalCases = useMemo(
    () => regions.reduce((sum, r) => sum + r.count, 0),
    [regions]
  );

  // filtered + sorted
  const displayList = useMemo(() => {
    return regions
      .filter((r) => r.location.toLowerCase().includes(search.toLowerCase()))
      .filter((r) =>
        showHighOnly ? getSeverity(r.count).label === "High" : true
      )
      .sort((a, b) => b.count - a.count);
  }, [regions, search, showHighOnly]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <>
      {/* Header controls */}
      <View style={styles.header}>
        <Text style={styles.overview}>
          Regions: {regions.length} • Total Cases: {totalCases}
        </Text>
        <TextInput
          style={styles.search}
          placeholder="Search region..."
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.switchRow}>
          <Text>High-Severity Only</Text>
          <Switch value={showHighOnly} onValueChange={setShowHighOnly} />
        </View>
      </View>

      {/* Regions list */}
      <FlatList
        data={displayList}
        keyExtractor={(r) => r.location}
        renderItem={({ item }) => {
          const sev = getSeverity(item.count);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setSelected(item)}
            >
              <View style={styles.row}>
                <Text style={styles.locName}>{item.location}</Text>
                <View style={[styles.badge, { backgroundColor: sev.color }]}>
                  <Text style={styles.badgeText}>{sev.label}</Text>
                </View>
              </View>
              <Text style={styles.meta}>
                {item.count} cases • {item.diseaseCount} diseases
              </Text>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Detail Modal */}
      <Modal
        visible={!!selected}
        transparent
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              {selected?.location} — {selected?.count} cases
            </Text>
            <FlatList
              data={selected?.items}
              keyExtractor={(_, i) => String(i)}
              renderItem={({ item }) => (
                <View style={styles.detail}>
                  <Text>Disease: {item.predicted_disease}</Text>
                  <Text>Count: {item.case_count}</Text>
                  <Text>
                    Date:{" "}
                    {new Date(item.timestamp).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              )}
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelected(null)}
            >
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  overview: { marginBottom: 8, fontWeight: "600" },
  search: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  locName: { fontSize: 16, fontWeight: "500" },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  badgeText: { color: "#fff", fontWeight: "600" },
  meta: { marginTop: 4, color: "#555" },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
  },
  modal: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  detail: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  closeBtn: {
    marginTop: 16,
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
