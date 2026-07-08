import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
  Platform,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { SCREENS } from "../../constants/config";

const RegistrationSuccessScreen = ({ navigation, route }) => {
  const { uniqueId, password, name } = route.params || {};

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleCopy = async (text, label) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert("Copied!", `${label} copied to clipboard.`);
    } catch {
      Alert.alert("Note", `Your ${label}: ${text}`);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <View style={styles.container}>
        <Animated.View
          style={[styles.iconCircle, { transform: [{ scale: scaleAnim }] }]}
        >
          <Text style={styles.icon}>🎉</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.title}>Welcome, {name || "Student"}!</Text>
          <Text style={styles.subtitle}>
            Your account has been created successfully.
          </Text>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderIcon}>🔑</Text>
              <View>
                <Text style={styles.cardTitle}>Your Login Credentials</Text>
                <Text style={styles.cardSubtitle}>
                  Save these details securely
                </Text>
              </View>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>UNIQUE ID</Text>
              <TouchableOpacity
                style={styles.fieldRow}
                onPress={() => handleCopy(uniqueId, "Unique ID")}
                activeOpacity={0.7}
              >
                <Text style={styles.fieldValue}>{uniqueId}</Text>
                <Text style={styles.copyIcon}>📋</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>DEFAULT PASSWORD</Text>
              <TouchableOpacity
                style={styles.fieldRow}
                onPress={() => handleCopy(password, "Password")}
                activeOpacity={0.7}
              >
                <Text style={styles.fieldValue}>{password}</Text>
                <Text style={styles.copyIcon}>📋</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.noteBox}>
              <Text style={styles.noteIcon}>💡</Text>
              <Text style={styles.noteText}>
                Your default password is your Date of Birth in DDMMYYYY format.
                Tap any field above to copy it.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.replace(SCREENS.LOGIN)}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>Continue to Login</Text>
            <Text style={styles.loginBtnArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F0FDF4" },
  bgCircle1: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#DCFCE7",
    top: -60,
    right: -50,
    opacity: 0.6,
  },
  bgCircle2: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#BBF7D0",
    bottom: 60,
    left: -60,
    opacity: 0.4,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 50,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#22C55E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  icon: { fontSize: 52 },
  content: { width: "100%", alignItems: "center" },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 28,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 0,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 12,
  },
  cardHeaderIcon: { fontSize: 28 },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  cardSubtitle: { fontSize: 12, color: "#94A3B8", marginTop: 2 },
  cardDivider: { height: 1, backgroundColor: "#F1F5F9" },
  field: { paddingHorizontal: 18, paddingTop: 16 },
  fieldLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 6,
  },
  fieldRow: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: 1,
    flex: 1,
    textAlign: "center",
  },
  copyIcon: { fontSize: 16, opacity: 0.5 },
  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFBEB",
    margin: 18,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  noteIcon: { fontSize: 16, marginTop: 1 },
  noteText: {
    fontSize: 12,
    color: "#92400E",
    lineHeight: 18,
    flex: 1,
  },
  loginBtn: {
    marginTop: 28,
    width: "100%",
    backgroundColor: "#1D4ED8",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  loginBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  loginBtnArrow: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
});

export default RegistrationSuccessScreen;
