import React from "react";
import { View, StyleSheet, Text, Image, Button } from "react-native";
import { globalStyles } from "../../styles/global";

const HomeScreen = () => {
  return (
    <View style={globalStyles.container}>
      <View style={styles.textHeader}>
        <Text style={styles.textHead}>PandemicGuard</Text>
        <View style={styles.textSlogan}>
          <Text style={styles.sloganText}>
            Stay informed about Pandemics outbreaks worldwide
          </Text>
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/images/happyMan.jpg")}
              style={styles.image}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="start" style={styles.startButton} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textHeader: {
    fontWeight: 16,
    flex: 1,
    alignItems: "center",
    marginVertical: 180,
  },
  textHead: {
    fontWeight: "bold",
    fontSize: 35,
    letterSpacing: 2,
  },
  textSlogan: {
    marginVertical: 20,
    width: 300,
  },
  sloganText: {
    fontSize: 20,
    textAlign: "center",
    paddingVertical: 2,
    lineHeight: 20,
    fontFamily: "nunito-light",
    fontWeight: "600",
  },
  imageContainer: {
    marginVertical: 8,
    width: 200,
    height: 200,
  },
  image: {
    width: 200,
    height: 200,
    marginHorizontal: 32,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  startButton: {
    borderRadius: 20,
  },
});

export default HomeScreen;
