// components/PieDiseaseChart.js
import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ActivityIndicator } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { API_URL } from "@env";

const screenWidth = Dimensions.get("window").width;

export default function PieDiseaseChart() {
  const [diseaseData, setDiseaseData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDiseaseStats = async () => {
    try {
      const response = await fetch(`${API_URL}/disease-pie`);
      if (!response.ok) throw new Error("Failed to load disease data");
      const data = await response.json();
      console.log("Disease Data:", data);
      const chartData = data.map((item, index) => ({
        name: item.diseaseType,
        population: item.count,
        color: getColor(index),
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
      }));
      setDiseaseData(chartData);
    } catch (error) {
      console.error("Error fetching disease data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseaseStats();
  }, []);

  const getColor = (index) => {
    const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#00C49F", "#845EC2"];
    return colors[index % colors.length];
  };

  if (loading) return <ActivityIndicator />;

  return (
    <View>
      <Text
        style={{
          textAlign: "center",
          fontSize: 18,
          marginBottom: 10,
          fontWeight: "bold",
        }}
      >
        Top Diseases
      </Text>
      <PieChart
        data={diseaseData}
        width={screenWidth - 20}
        height={220}
        chartConfig={{
          backgroundColor: "#fff",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[5, 0]}
        absolute
      />
    </View>
  );
}
