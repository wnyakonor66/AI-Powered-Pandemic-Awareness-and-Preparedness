import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../../styles/global";
import FlatButton from "../shared/button";
import { useNavigation } from "@react-navigation/native";
import { saveToken } from "../shared/auth";
import { useState } from "react";
import { Alert } from "react-native";

export default function SignUp() {
  const navigation = useNavigation();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "All fields are required!");
    }
    setLoading(true);

    try {
      const response = await fetch("http://100.112.17.49:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Signup failed");
      await saveToken(data.access_token);

      Alert.alert("Success", "Account created successfully!");

      if (data.role === "admin") {
        navigation.navigate("AdminScreen");
      } else {
        navigation.navigate("UserScreen");
      }
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
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

        <FlatButton
          text={loading ? "Registering..." : "Register"}
          style={{ width: "85%", marginVertical: 10 }}
          onPress={handleSignUp}
          disabled={loading}
        />

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
