import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Linking,
} from "react-native";

export default function Updates() {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const response = await fetch(
        "https://www.who.int/api/news/diseaseoutbreaknews"
      );
      if (!response.ok) throw new Error("Failed to fetch updates");
      const data = await response.json();
      setNews(data.value || []); // Access the 'value' array
    } catch (error) {
      console.error("Error:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  // Clean HTML tags from text
  const cleanHtml = (html) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.Title}</Text>
      <Text style={styles.date}>
        {new Date(item.PublicationDate).toDateString()}
      </Text>
      <Text style={styles.description}>
        {cleanHtml(item.Overview).substring(0, 150)}...
      </Text>
      <Text
        style={styles.readMore}
        onPress={() =>
          Linking.openURL(`https://www.who.int${item.ItemDefaultUrl}`)
        }
      >
        Read more
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (news.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text>No updates available</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={news}
      keyExtractor={(item) => item.Id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      refreshing={loading}
      onRefresh={fetchUpdates}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  readMore: {
    color: "#4CAF50",
    marginTop: 10,
    fontWeight: "bold",
  },
});
