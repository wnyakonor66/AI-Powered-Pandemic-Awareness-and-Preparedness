import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../../styles/global";
import FlatButton from "../shared/button";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const navigation = useNavigation();
  return (
    <View style={globalStyles.container}>
      <View style={styles.innerContainer}>
        <View style={globalStyles.imageContainer}>
          <Image
            source={require("../../assets/images/tree.jpg")}
            style={globalStyles.image}
          />
        </View>
        <View style={globalStyles.headerContainer}>
          <Text style={globalStyles.headerText}>Pandemic Guard</Text>
        </View>

        <View style={globalStyles.formArea}>
          <View style={globalStyles.innerForm}>
            <View style={globalStyles.items}>
              <Text style={globalStyles.label}>Email address</Text>
              <TextInput
                placeholder="myemail@gmail.com"
                style={globalStyles.input}
              />
            </View>
            <View style={globalStyles.items}>
              <Text style={globalStyles.label}>Password</Text>
              <TextInput placeholder="........" style={globalStyles.input} />
            </View>
          </View>
        </View>
        <View style={styles.forgetContainer}>
          <TouchableOpacity>
            <Text style={styles.forgetText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        <FlatButton
          text="Log in"
          style={{
            width: "85%",
            marginVertical: 10,
          }}
        />

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text>Don't have an account? {""}</Text>

          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={{ fontWeight: "bold" }}>Sign Up</Text>
          </TouchableOpacity>
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

  forgetContainer: {
    padding: 2,
    width: "100%",
    alignItems: "flex-end",
  },

  forgetText: {
    marginHorizontal: 38,
  },
});
