// import React, { useEffect, useState } from "react";
// import { BarChart } from "react-native-chart-kit";
// import {
//   Dimensions,
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";
// import { API_URL } from "@env";

// const screenWidth = Dimensions.get("window").width;

// const DailyBarChart = () => {
//   const [labels, setLabels] = useState([]);
//   const [values, setValues] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchDaliyTrends = async () => {
//     try {
//       const response = await fetch(`${API_URL}/daily-trends`);
//       if (!response.ok) throw new Error("Failed to load daily dataTrends");
//       const data = await response.json();
//       console.log("Daily Trends Data:", data);

//       setLabels(data.labels);
//       setValues(data.values);
//       console.log("Labels:", data.labels);
//       console.log("Values:", data.values);
//     } catch (error) {
//       console.error("Error at daily_trends", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDaliyTrends();
//   }, []);

//   if (loading) {
//     return (
//       <View>
//         <ActivityIndicator size="large" color="#007AFF" />
//         <Text>Loading daily Trends...</Text>
//       </View>
//     );
//   }

//   return (
//     <View>
//       <Text>Daily Reported Cases</Text>
//       <BarChart
//         data={{
//           labels: labels,
//           datasets: [{ data: values }],
//         }}
//         width={screenWidth - 32}
//         height={220}
//         yAxisLabel=""
//         yAxisSuffix=""
//         chartConfig={{
//           backgroundColor: "#ffffff",
//           backgroundGradientFrom: "#ffffff",
//           backgroundGradientTo: "#ffffff",
//           decimalPlaces: 0,
//           color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
//           labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//           style: { borderRadius: 8 },
//           propsForDots: {
//             r: "6",
//             strokeWidth: "2",
//             stroke: "#007AFF",
//           },
//         }}
//         style={{ borderRadius: 8 }}
//       />
//     </View>
//   );
// };

// export default DailyBarChart;
import React, { useEffect, useState } from "react";
import { BarChart } from "react-native-chart-kit";
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { API_URL } from "@env";

const screenWidth = Dimensions.get("window").width;

const DailyBarChart = () => {
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDaliyTrends = async () => {
    try {
      const response = await fetch(`${API_URL}/daily-trends`);
      if (!response.ok) throw new Error("Failed to load daily data trends");
      const data = await response.json();
      console.log("Daily Trends Data:", data);

      setLabels(data.labels);
      setValues(data.values);
      console.log("Labels:", data.labels);
      console.log("Values:", data.values);
    } catch (error) {
      console.error("Error at daily_trends", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDaliyTrends();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading daily trends...</Text>
      </View>
    );
  }

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>Daily Reported Cases</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          data={{
            labels: labels,
            datasets: [{ data: values }],
          }}
          width={screenWidth - 32}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 8 },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#007AFF",
            },
          }}
          style={styles.chartStyle}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chartContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chartStyle: {
    borderRadius: 8,
    paddingBottom: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
});

export default DailyBarChart;
