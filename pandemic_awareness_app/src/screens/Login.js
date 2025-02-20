import React from "react";
import { StyleSheet, View, Text, Image, TextInput } from "react-native";
import { globalStyles } from "../../styles/global";

export default function Login() {
  return (
    <View style={globalStyles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/tree.jpg")}
            style={styles.image}
          />
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Pandemic Guard</Text>
        </View>

        <View style={styles.formArea}>
          <View style={styles.innerForm}>
            <View style={styles.items}>
              <Text style={styles.label}>Email address</Text>
              <TextInput placeholder="myemail@gmail.com" style={styles.input} />
            </View>
            <View style={styles.items}>
              <Text style={styles.label}>Password</Text>
              <TextInput placeholder="........" style={styles.input} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: 200,
    height: 200,
  },
  image: {
    width: 200,
    height: 190,
    objectFit: "cover",
  },
  headerContainer: {
    width: "100%",
    minHeight: 35,
    alignItems: "center",
    borderColor: "red",
    borderWidth: 2,
  },
  headerText: {
    fontFamily: "nunito-regular",
    fontSize: 30,
    fontWeight: "bold",
  },

  formArea: {
    width: "100%",
    marginVertical: 10,
    borderColor: "green",
    borderWidth: 2,
    minHeight: 200,
    padding: 10,
  },

  innerForm: {
    width: 330,
    // borderColor: "yellow",
    borderWidth: 1,
    paddingVertical: 1,
    paddingHorizontal: 5,
    height: 200,
  },

  items: {
    width: 300,
    borderColor: "red",
    // borderWidth: 2,
    paddingVertical: 5,
    paddingHorizontal: 8,
    justifyContent: "flex-start",
  },

  input: {
    borderWidth: 1,
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },

  label: {
    fontFamily: "nunito-light",
    marginVertical: 5,
  },
});
