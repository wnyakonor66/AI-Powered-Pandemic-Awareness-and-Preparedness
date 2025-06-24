import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BaseToast } from "react-native-toast-message";

const CustomToast = ({ text1, text2, props }) => (
  <View
    style={[
      styles.toastContainer,
      { backgroundColor: props.bgColor || "#333" },
    ]}
  >
    <Text style={styles.title}>
      {props.icon || ""} {text1}
    </Text>

    <Text style={styles.message}>{text2}</Text>
  </View>
);

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={styles.successToast}
      contentContainerStyle={styles.successToastContent}
      text1Style={styles.successText1}
      text2Style={styles.successText2}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={styles.errorToast}
      contentContainerStyle={styles.errorToastContent}
      text1Style={styles.errorText1}
      text2Style={styles.errorText2}
    />
  ),
  customToast: (props) => <CustomToast {...props} />,
};

const styles = StyleSheet.create({
  toastContainer: {
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  message: {
    fontSize: 14,
    color: "#fff",
  },
  successToast: {
    backgroundColor: "#28a745",
    borderLeftColor: "green",
  },
  successToastContent: {
    paddingHorizontal: 15,
  },
  successText1: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  successText2: {
    color: "#fff",
    fontSize: 14,
  },
  errorToast: {
    backgroundColor: "#dc3545",
    borderLeftColor: "red",
  },
  errorToastContent: {
    paddingHorizontal: 15,
  },
  errorText1: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText2: {
    color: "#fff",
    fontSize: 14,
  },
});

export default toastConfig;
