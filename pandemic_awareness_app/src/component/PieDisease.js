// // components/PieDiseaseChart.js
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Dimensions,
//   ActivityIndicator,
//   Pressable,
//   Modal,
// } from "react-native";
// import { PieChart } from "react-native-chart-kit";
// import { API_URL } from "@env";

// const screenWidth = Dimensions.get("window").width;

// export default function PieDiseaseChart() {
//   const [diseaseData, setDiseaseData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selected, setSelected] = useState(null);

//   const fetchDiseaseStats = async () => {
//     try {
//       const response = await fetch(`${API_URL}/disease-pie`);
//       if (!response.ok) throw new Error("Failed to load disease data");
//       const data = await response.json();
//       console.log("Disease Data:", data);
//       const chartData = data.map((item, index) => ({
//         name: item.diseaseType,
//         population: item.count,
//         color: getColor(index),
//         legendFontColor: "#7F7F7F",
//         legendFontSize: 12,
//         key: index,
//         original: item,
//       }));
//       setDiseaseData(chartData);
//     } catch (error) {
//       console.error("Error fetching disease data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDiseaseStats();
//   }, []);

//   const getColor = (index) => {
//     const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#00C49F", "#845EC2"];
//     return colors[index % colors.length];
//   };

//   const handlePress = (index) => {
//     setSelected(diseaseData[index]);
//     console.log("Selected Disease:", diseaseData[index]);
//   };

//   if (loading) return <ActivityIndicator />;

//   return (
//     <View>
//       <Text
//         style={{
//           textAlign: "center",
//           fontSize: 18,
//           marginBottom: 10,
//           fontWeight: "bold",
//         }}
//       >
//         Top Diseases
//       </Text>
//       <Pressable onPress={() => setSelected(null)}>
//         <PieChart
//           data={diseaseData}
//           width={screenWidth - 20}
//           height={220}
//           chartConfig={{
//             backgroundColor: "#fff",
//             color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//           }}
//           accessor="population"
//           backgroundColor="transparent"
//           paddingLeft="15"
//           center={[5, 0]}
//           absolute
//           hasLegend={true}
//         />
//       </Pressable>
//       {selected && (
//         <View
//           style={{
//             backgroundColor: "#f0f0f0",
//             padding: 15,
//             borderRadius: 10,
//             marginTop: 10,
//             shadowColor: "#000",
//             shadowOpacity: 0.1,
//             shadowOffset: {
//               width: 0,
//               height: 2,
//             },
//           }}
//         >
//           <Text style={{ fontSize: 16, fontWeight: "bold" }}>
//             {selected.name}
//           </Text>
//           <Text style={{ fontSize: 14, color: "#555" }}>
//             Count: {selected.population}
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// }

// components/PieDiseaseChart.js
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
