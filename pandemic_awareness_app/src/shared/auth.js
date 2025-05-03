//token storage and role fetching
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

//save the token and role after login
export const saveToken = async (token, role) => {
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
    return { email: decoded.sub, role: decoded.role };
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
