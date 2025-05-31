import React from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#00C49F", "#845EC2"];

export default function PieDiseaseChart({ data, onSlicePress }) {
  // transform into chart-kit format
  const chartData = data.map((d, i) => ({
    name: d.name,
    population: d.count,
    color: COLORS[i % COLORS.length],
    legendFontColor: "#333",
    legendFontSize: 12,
  }));

  return (
    <View style={{ marginTop: 24 }}>
      <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "700" }}>
        Top Diseases
      </Text>
      <PieChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundColor: "#fff",
          color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      {/* Custom legend with touchable rows */}
      <View style={styles.legendContainer}>
        {data.map((slice, i) => (
          <TouchableOpacity
            key={slice.name}
            style={styles.legendRow}
            onPress={() => onSlicePress(slice)}
          >
            <View
              style={[styles.legendColorBox, { backgroundColor: COLORS[i] }]}
            />
            <Text style={styles.legendLabel}>
              {slice.name} ({slice.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legendContainer: { marginTop: 10, marginBottom: 20 },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  legendColorBox: {
    width: 16,
    height: 16,
    marginRight: 8,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 14,
    color: "#333",
  },
});
