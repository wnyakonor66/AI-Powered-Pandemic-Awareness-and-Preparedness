//login screen
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { globalStyles } from "../../styles/global";
import FlatButton from "../shared/button";
import { useNavigation } from "@react-navigation/native";
import { saveToken, getUserDetails } from "../shared/auth";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "@env";

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log("Login button pressed");

    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("API Response:", JSON.stringify(data, null, 2)); // Debugging

      if (!response.ok) throw new Error(data.detail || "Login failed");

      // Check if token exists
      if (!data.access_token) {
        throw new Error("Authentication failed: No token received.");
      }

      // Decode the token to extract the role
      const decoded = jwtDecode(data.access_token);
      console.log("Decoded Token:", decoded);

      const userRole = decoded.role || "user"; // Default to "user" if undefined
      console.log("Extracted Role:", userRole);

      // Save the token and role
      await saveToken(data.access_token, userRole);
      console.log("Saved Token:", data.access_token);
      console.log("Saved Role:", userRole);

      // Fetch user details from the token
      const userDetails = await getUserDetails();
      console.log("User Role:", userDetails?.role);

      // Navigate without back navigation
      if (userDetails?.role === "admin") {
        navigation.replace("AdminScreen");
      } else {
        navigation.replace("UserScreen");
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      Alert.alert("Login failed", error.message);
    } finally {
      setLoading(false);
    }
  };

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
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <View style={globalStyles.items}>
              <Text style={globalStyles.label}>Password</Text>
              <TextInput
                placeholder="********"
                style={globalStyles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>
        </View>
        <View style={styles.forgetContainer}>
          <TouchableOpacity>
            <Text style={styles.forgetText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        <FlatButton
          text={loading ? "Logging in..." : "Log in"}
          style={{
            width: "85%",
            marginVertical: 10,
          }}
          onPress={handleLogin}
          disabled={loading}
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
