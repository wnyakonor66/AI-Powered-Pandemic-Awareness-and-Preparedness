import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  imageContainer: {
    width: 200,
    height: 200,
  },
  image: {
    width: 200,
    height: 190,
    objectFit: "cover",
  },
  headerContainer: {
    width: "100%",
    minHeight: 35,
    alignItems: "center",
  },
  headerText: {
    fontFamily: "nunito-regular",
    fontSize: 25,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOpacity: 0.5,
    textShadowRadius: 6,
    textShadowOffset: { width: 2, height: 2 },
    elevation: 2,
  },
  formArea: {
    width: "100%",
    marginVertical: 10,
    minHeight: 150,
    padding: 3,
  },

  innerForm: {
    width: 330,
    paddingHorizontal: 5,
    minHeight: 150,
  },

  items: {
    width: 300,
    paddingVertical: 5,
    paddingHorizontal: 8,
    justifyContent: "flex-start",
    width: "100%",
  },

  input: {
    borderWidth: 1,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    width: "100%",
  },

  label: {
    fontFamily: "nunito-light",
    marginVertical: 5,
  },
});
