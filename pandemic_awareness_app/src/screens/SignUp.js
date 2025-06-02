import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { globalStyles } from "../../styles/global";
import FlatButton from "../shared/button";
import { useNavigation } from "@react-navigation/native";
import { saveToken } from "../shared/auth";
import { useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

export default function SignUp() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      console.log("signup response:", data);

      if (!response.ok) {
        if (Array.isArray(data.detail)) {
          setError(data.detail.map((err) => err.msg).join("\n"));
        } else {
          setError(data.detail || "Signup failed try again!");
        }
        return;
      }

      // Save token and role in AsyncStorage
      if (data.access_token) {
        await AsyncStorage.setItem("authToken", data.access_token);
      }
      if (data.role) {
        await AsyncStorage.setItem("userRole", data.role);
      } else {
        console.warn("User role is undefined, not saving.");
      }

      Alert.alert("Success", "Account created successfully!");

      // Ensure role-based navigation
      if (data.role === "admin") {
        navigation.replace("AdminScreen");
      } else {
        navigation.replace("UserScreen");
      }
    } catch (error) {
      console.log("Signup Failed", error);
      setError("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <View style={styles.innerContainer}>
        <View style={globalStyles.imageContainer}>
          <Image
            source={require("../../assets/images/purple.jpg")}
            style={globalStyles.image}
          />
        </View>
        <View style={globalStyles.headerContainer}>
          <Text style={globalStyles.headerText}>Pandemic Guard</Text>
        </View>

        <View style={globalStyles.formArea}>
          <View style={globalStyles.innerForm}>
            <View style={globalStyles.items}>
              <Text style={globalStyles.label}>Username</Text>
              <TextInput
                placeholder="Your username"
                style={globalStyles.input}
                value={username}
                onChangeText={setUsername}
              />
            </View>
            <View style={globalStyles.items}>
              <Text style={globalStyles.label}>Email</Text>
              <TextInput
                placeholder="Your email"
                style={globalStyles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
            <View style={globalStyles.items}>
              <Text style={globalStyles.label}>Password</Text>
              <TextInput
                placeholder="******"
                style={globalStyles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>
        </View>

        {loading && (
          <ActivityIndicator
            size="large"
            color="blue"
            style={{ marginBottom: 10 }}
          />
        )}

        <FlatButton
          text={loading ? "Registering..." : "Register"}
          style={{ width: "85%", marginVertical: 10 }}
          onPress={handleSignUp}
          disabled={loading}
        />

        {error ? (
          <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
        ) : null}

        <View style={{ flexDirection: "row" }}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
            <Text style={{ fontWeight: "bold" }}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
