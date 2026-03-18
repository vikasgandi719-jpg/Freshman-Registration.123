import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";

const RegistrationSuccessScreen = ({ navigation, route }) => {
  const { uniqueId, password, name } = route.params || {};

  const handleCopy = (text, label) => {
    Alert.alert("Note", `Please save your ${label}: ${text}`);
  };

  const formatPassword = (pwd) => {
    if (!pwd) return "";
    return `${pwd.slice(0, 2)}**${pwd.slice(-2)}`;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>✅</Text>
        </View>

        <Text style={styles.title}>Registration Successful!</Text>
        <Text style={styles.subtitle}>
          Congratulations {name}! Your account has been created.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Login Credentials</Text>
          <Text style={styles.cardSubtitle}>
            Please save these details - you'll need them to login
          </Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Unique ID</Text>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldValue}>{uniqueId}</Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Default Password</Text>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldValue}>{password}</Text>
            </View>
          </View>

          <Text style={styles.note}>
            ⚠️ Default password is your Date of Birth (YYYYMMDD format)
          </Text>
        </View>

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => navigation.replace("LoginScreen")}
        >
          <Text style={styles.loginBtnText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  icon: { fontSize: 48 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 32,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  cardSubtitle: { fontSize: 13, color: "#64748B", marginBottom: 20 },
  field: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
    marginBottom: 6,
  },
  fieldRow: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  fieldValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    letterSpacing: 1,
  },
  note: {
    fontSize: 12,
    color: "#F59E0B",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
  },
  loginBtn: {
    marginTop: 32,
    width: "100%",
    backgroundColor: "#1D4ED8",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  loginBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});

export default RegistrationSuccessScreen;
