//token storage and role fetching
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

//save the token and role after login
export const saveToken = async (token, role, username) => {
  try {
    await AsyncStorage.setItem("authToken", token);

    if (role) {
      await AsyncStorage.setItem("userRole", role);
    } else {
      console.warn("User role is undefined, not saving.");
    }
  } catch (error) {
    console.error("Error saving token:", error);
  }

  // Save username if provided
  if (username) {
    await AsyncStorage.setItem("username", username);
  } else {
    console.warn("Username is undefined, not saving.");
  }
};

//get stored token
export const getToken = async () => {
  return await AsyncStorage.getItem("authToken");
};

//decode token for details
export const getUserDetails = async () => {
  const token = await getToken();
  if (!token) return null;

  try {
    const decoded = await jwtDecode(token);
    const storedUsername = await AsyncStorage.getItem("username");

    const finalUsername = storedUsername || decoded.username;

    console.log("decoded JWT:", decoded);
    console.log("Using username:", finalUsername);
    // if (decoded.username) {
    //   await AsyncStorage.setItem("username", decoded.username);
    //   console.log("Username saved to AsyncStorage:", decoded.username);
    // }

    return {
      email: decoded.sub,
      role: decoded.role,
      username: finalUsername,
    };
  } catch (error) {
    console.log("Can't decode token, invalid token:", error);
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userRole");
    return null;
  }
};

//remove token after logout
const removeToken = async () => {
  return await AsyncStorage.removeItem("authToken");
};
