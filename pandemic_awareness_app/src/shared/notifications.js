import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

export const registerForPushNotificationsAsync = async () => {
  if (!Constants.isDevice) {
    alert("Must use physical device for Push Notifications");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    console.log("Permission denied for push notifications");
    return;
  }

  try {
    const { data: token } = await Notifications.getExpoPushTokenAsync();
    console.log("Push notification token:", token);
    return token;
  } catch (error) {
    console.error("Error getting push token:", error);
    alert("Error getting push token");
  }
};
