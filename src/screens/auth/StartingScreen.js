import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { SCREENS } from "../../constants/config";

const { width } = Dimensions.get("window");

const StartingScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const btnSlide = useRef(new Animated.Value(60)).current;
  const btnFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(btnFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(btnSlide, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFF6FF" />

      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Animated.View
          style={[styles.logoWrapper, { transform: [{ scale: scaleAnim }] }]}
        >
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🎓</Text>
          </View>
          <View style={styles.logoRing} />
        </Animated.View>

        <Text style={styles.appName}>Freshman</Text>
        <Text style={styles.appNameSub}>Registration</Text>
        <View style={styles.collegeBadge}>
          <Text style={styles.collegeText}>
            B V Raju Institute of Technology, Naraspur
          </Text>
        </View>

        <View style={styles.features}>
          {[
            { icon: "📤", text: "Upload documents securely" },
            { icon: "⚡", text: "Real-time verification status" },
            { icon: "🔒", text: "Safe & encrypted storage" },
          ].map((item) => (
            <View key={item.text} style={styles.featureRow}>
              <View style={styles.featureIconBg}>
                <Text style={styles.featureIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.featureText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <Animated.View
          style={[
            styles.btnGroup,
            { opacity: btnFade, transform: [{ translateY: btnSlide }] },
          ]}
        >
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate(SCREENS.LOGIN)}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnIcon}>👤</Text>
            <Text style={styles.primaryBtnText}>Student Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate(SCREENS.REGISTER)}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryBtnIcon}>✏️</Text>
            <Text style={styles.secondaryBtnText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.adminBtn}
            onPress={() => navigation.navigate(SCREENS.ADMIN_LOGIN)}
            activeOpacity={0.85}
          >
            <Text style={styles.adminBtnText}>🔐  Admin Portal</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.footer}>© 2026 BVRITN · All rights reserved</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EFF6FF" },
  bgCircle1: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "#DBEAFE",
    top: -100,
    right: -80,
    opacity: 0.6,
  },
  bgCircle2: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#BFDBFE",
    bottom: 80,
    left: -80,
    opacity: 0.4,
  },
  bgCircle3: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#93C5FD",
    bottom: -40,
    right: 30,
    opacity: 0.25,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  logoWrapper: {
    position: "relative",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#1D4ED8",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  logoIcon: { fontSize: 44 },
  logoRing: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2.5,
    borderColor: "#1D4ED8",
    opacity: 0.2,
  },
  appName: {
    fontSize: 36,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: 0.3,
    lineHeight: 42,
  },
  appNameSub: {
    fontSize: 36,
    fontWeight: "900",
    color: "#1D4ED8",
    letterSpacing: 0.3,
    marginBottom: 8,
    lineHeight: 42,
  },
  collegeBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 24,
  },
  collegeText: {
    fontSize: 12,
    color: "#1D4ED8",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  features: {
    width: "100%",
    marginBottom: 28,
    gap: 8,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  featureIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  featureIcon: { fontSize: 18 },
  featureText: { fontSize: 13, color: "#334155", fontWeight: "600", flex: 1 },
  btnGroup: { width: "100%", gap: 10, marginBottom: 20 },
  primaryBtn: {
    backgroundColor: "#1D4ED8",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryBtnIcon: { fontSize: 18 },
  primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  secondaryBtn: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#1D4ED8",
  },
  secondaryBtnIcon: { fontSize: 16 },
  secondaryBtnText: { color: "#1D4ED8", fontSize: 16, fontWeight: "700" },
  adminBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "rgba(248,250,252,0.8)",
  },
  adminBtnText: { color: "#475569", fontSize: 14, fontWeight: "600" },
  footer: { fontSize: 11, color: "#94A3B8", marginTop: 4 },
});

export default StartingScreen;
