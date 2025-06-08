import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1f3c" />
      <LinearGradient colors={["#1a1f3c", "#2c3e50"]} style={styles.gradient}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>PandemicGuard</Text>
              <Text style={styles.subtitle}>
                Advanced Health Monitoring System
              </Text>
            </View>

            <View style={styles.imageContainer}>
              <Image
                source={require("../../assets/images/happyMan.jpg")}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay}>
                <Text style={styles.imageText}>
                  Comprehensive Pandemic Monitoring and Analysis Platform
                </Text>
              </View>
            </View>

            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Text style={styles.featureTitle}>Real-Time Monitoring</Text>
                <Text style={styles.featureText}>
                  Advanced detection and instant alerts for outbreak patterns in
                  your vicinity
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureTitle}>AI-Powered Analytics</Text>
                <Text style={styles.featureText}>
                  Sophisticated predictive models for early outbreak detection
                  and analysis
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureTitle}>Global Coverage</Text>
                <Text style={styles.featureText}>
                  Comprehensive monitoring of pandemic developments worldwide
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={() => navigation.navigate("LogIn")}
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => navigation.navigate("SignUp")}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1f3c",
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginTop: height * 0.05,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 1.5,
    marginBottom: 12,
    fontFamily: "nunito-regular",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: "#ffffff",
    opacity: 0.9,
    fontFamily: "nunito-light",
    letterSpacing: 0.5,
  },
  imageContainer: {
    height: height * 0.3,
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 20,
  },
  imageText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "nunito-regular",
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  featuresContainer: {
    marginVertical: 24,
  },
  featureItem: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  featureTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "nunito-regular",
    letterSpacing: 0.5,
  },
  featureText: {
    color: "#ffffff",
    opacity: 0.9,
    fontSize: 15,
    fontFamily: "nunito-light",
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryButton: {
    backgroundColor: "#ffffff",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  buttonText: {
    color: "#1a1f3c",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "nunito-regular",
    letterSpacing: 0.5,
  },
  secondaryButtonText: {
    color: "#ffffff",
  },
});

export default HomeScreen;
