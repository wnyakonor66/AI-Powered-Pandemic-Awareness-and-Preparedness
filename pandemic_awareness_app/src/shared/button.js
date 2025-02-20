import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export default function FlatButton({
  text,
  onPress,
  backgroundColor = "#0867d2",
  color = "white",
  style,
}) {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor }, style]}
        onPress={onPress}
      >
        <Text style={[styles.buttonText, { color }]}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 15,
    width: "100%",
    alignItems: "center",
  },

  buttonText: {
    textAlign: "center",
    fontSize: 16,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    shadowColor: "rgba(7, 0, 0, 0.5)",
    shadowOffset: { width: 2, height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.5,
    elevation: 10,
    width: "100%",
  },
});
