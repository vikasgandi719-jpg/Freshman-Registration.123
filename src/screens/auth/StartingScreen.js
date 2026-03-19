import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
} from "react-native";
import { SCREENS } from "../../constants/config";

const { width, height } = Dimensions.get("window");

const StartingScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Background shapes */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Logo */}
        <Animated.View
          style={[styles.logoWrapper, { transform: [{ scale: scaleAnim }] }]}
        >
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>📋</Text>
          </View>
          <View style={styles.logoRing} />
        </Animated.View>

        {/* Title */}
        <Text style={styles.appName}>Freshman Registration</Text>
        <Text style={styles.collegeName}>B V Raju Institue of Technology,Naraspur</Text>
        <Text style={styles.tagline}>
          {/* Streamlined document verification{"\n"}for students and administrators */}
        </Text>

        {/* Feature bullets */}
        <View style={styles.features}>
          {[
            // { icon: "📤", text: "Upload documents securely" },
            // { icon: "⚡", text: "Real-time verification status" },
            // { icon: "🔒", text: "Safe & encrypted storage" },
          ].map((item) => (
            <View key={item.text} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{item.icon}</Text>
              <Text style={styles.featureText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.btnGroup}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate(SCREENS.LOGIN)}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Student Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate(SCREENS.REGISTER)}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryBtnText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.adminBtn}
            onPress={() => navigation.navigate(SCREENS.ADMIN_LOGIN)}
            activeOpacity={0.85}
          >
            <Text style={styles.adminBtnText}>🔐 Admin Portal</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>© 2024 BVRITN · All rights reserved</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EFF6FF" },
  bgCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#DBEAFE",
    top: -80,
    right: -60,
    opacity: 0.7,
  },
  bgCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#BFDBFE",
    bottom: 100,
    left: -60,
    opacity: 0.5,
  },
  bgCircle3: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#93C5FD",
    bottom: -30,
    right: 40,
    opacity: 0.3,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  logoWrapper: {
    position: "relative",
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#1D4ED8",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  logoIcon: { fontSize: 40 },
  logoRing: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#1D4ED8",
    opacity: 0.25,
  },
  appName: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  collegeName: {
    fontSize: 13,
    color: "#1D4ED8",
    fontWeight: "600",
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  features: {
    width: "100%",
    marginBottom: 32,
    gap: 10,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  featureIcon: { fontSize: 20, marginRight: 12 },
  featureText: { fontSize: 13, color: "#334155", fontWeight: "500" },
  btnGroup: { width: "100%", gap: 10, marginBottom: 24 },
  primaryBtn: {
    backgroundColor: "#1D4ED8",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  secondaryBtn: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#1D4ED8",
  },
  secondaryBtnText: { color: "#1D4ED8", fontSize: 16, fontWeight: "700" },
  adminBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  adminBtnText: { color: "#475569", fontSize: 14, fontWeight: "600" },
  footer: { fontSize: 11, color: "#94A3B8" },
});

export default StartingScreen;
