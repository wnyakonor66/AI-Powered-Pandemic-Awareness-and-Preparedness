import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

// Save token and role
export const saveToken = async (token, role) => {
  try {
    await AsyncStorage.setItem("authToken", token);
    if (role) {
      await AsyncStorage.setItem("userRole", role);
    }
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

// Get stored token
export const getToken = async () => {
  return await AsyncStorage.getItem("authToken");
};

// Decode token for user details
export const getUserDetails = async () => {
  const token = await getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded JWT:", decoded);
    return {
      email: decoded.sub,
      role: decoded.role,
      username: decoded.username,
      age: decoded.age,
      gender: decoded.gender,
    };
  } catch (error) {
    console.error("Invalid token:", error);
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userRole");
    return null;
  }
};

// Remove token on logout
export const removeToken = async () => {
  await AsyncStorage.removeItem("authToken");
  await AsyncStorage.removeItem("userRole");
};
