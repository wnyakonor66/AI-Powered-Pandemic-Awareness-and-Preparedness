import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserProfile() {
  const [username, setUsername] = useState("");
  // const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      console.error("Auth token not found for the user profile");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user-profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      setUsername(data.username || "");
      setEmail(data.email || "");
      // setProfilePicture(data.profile_picture || null);
      console.log("User Profile Data:", data);
      // console.log("Fetched user profile successfully");
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Alert.alert("Error", "Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      console.error("failed to load updateProfile token");
      return;
    }

    const formData = new FormData();
    if (username) formData.append("username", username);
    if (email) formData.append("email", email);
    if (password) formData.append("password", password);

    const response = await fetch(`${API_URL}/update-profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });
    const result = await response.json();
    console.log("Update Profile Response:", result);
    console.log("Update Profile Response Status:", response.status);
    if (response.ok) {
      await AsyncStorage.setItem("username", username);
      setPassword("");
      setEmail("");
      Alert.alert("Success", "Profile Updated Successfully");
      console.log("new username:", username);
    } else {
      Alert.alert(
        "Error",
        result.detail || "Failed to Update Profile Successfully"
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Edit Profile</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="New Password(Optional)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={updateProfile}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f6fa",
  },

  innerContainer: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
    elevation: 3,
    width: "100%",
    justifyContent: "center",
    margin: "auto",
    height: "80%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 50,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#0984e3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
