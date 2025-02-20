import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { globalStyles } from "../../styles/global";
import FlatButton from "../shared/button";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
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
          <FlatButton
            text="Sign In"
            onPress={() => navigation.navigate("LogIn")}
          />
          <FlatButton
            text="Create account"
            backgroundColor="#ffffff"
            color="#000000"
            onPress={() => navigation.navigate("SignUp")}
          />
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
    marginVertical: 150,
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
    marginVertical: 25,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  button: {
    borderRadius: 10,
    backgroundColor: "#0867d2",
    padding: 10,
    shadowColor: "rgba(7, 0, 0, 0.5)",
    shadowOffset: { width: 2, height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.5,
    elevation: 10,
  },
});

export default HomeScreen;
