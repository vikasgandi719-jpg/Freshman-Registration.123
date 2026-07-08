import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/auth/PasswordInput";
import { SCREENS } from "../../constants/config";
import { useAuth } from "../../context/AuthContext";
import useAuthHook from "../../hooks/useAuth";

const LoginScreen = ({ navigation }) => {
  const [uniqueId, setUniqueId] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { login, isSubmitting } = useAuthHook();
  const { error: authError, clearError } = useAuth();

  const handleLogin = async () => {
    clearError();
    setErrors({});
    const result = await login(uniqueId, password);
    if (!result.success && result.errors) setErrors(result.errors);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnIcon}>‹</Text>
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.headerIconOuter}>
              <View style={styles.headerIcon}>
                <Text style={styles.headerIconText}>👤</Text>
              </View>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in with your Unique ID to continue
            </Text>
          </View>

          {authError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerIcon}>⚠</Text>
              <Text style={styles.errorBannerText}>{authError}</Text>
            </View>
          )}

          <View style={styles.form}>
            <Input
              label="Unique ID"
              value={uniqueId}
              onChangeText={(t) => {
                setUniqueId(t.toUpperCase());
                setErrors((e) => ({ ...e, uniqueId: null }));
              }}
              placeholder="e.g. 2026-BVRITN-1A-0001"
              icon="🆔"
              autoCapitalize="characters"
              autoCorrect={false}
              error={errors.uniqueId || errors.email}
              required
            />

            <PasswordInput
              label="Password (Date of Birth)"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setErrors((e) => ({ ...e, password: null }));
              }}
              placeholder="Enter your password"
              error={errors.password}
              onSubmitEditing={handleLogin}
              returnKeyType="done"
            />

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotBtnText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                isSubmitting && styles.submitBtnDisabled,
              ]}
              onPress={handleLogin}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitBtnText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.registerRow}>
            <Text style={styles.registerLabel}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(SCREENS.REGISTER)}
            >
              <Text style={styles.registerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.adminLink}
            onPress={() => navigation.navigate(SCREENS.ADMIN_LOGIN)}
          >
            <Text style={styles.adminLinkText}>🔐 Login as Admin instead</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  backBtn: {
    marginTop: 16,
    marginBottom: 8,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  backBtnIcon: { fontSize: 22, color: "#1D4ED8", fontWeight: "600" },
  backBtnText: { fontSize: 16, color: "#1D4ED8", fontWeight: "600" },
  header: { alignItems: "center", marginBottom: 28, marginTop: 12 },
  headerIconOuter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },
  headerIconText: { fontSize: 32 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
  errorBanner: {
    backgroundColor: "#FFF1F2",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#F43F5E",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  errorBannerIcon: { fontSize: 16 },
  errorBannerText: { fontSize: 13, color: "#BE123C", fontWeight: "500", flex: 1 },
  form: { marginBottom: 20 },
  forgotBtn: { alignSelf: "flex-end", marginTop: -8, marginBottom: 18 },
  forgotBtnText: { fontSize: 13, color: "#1D4ED8", fontWeight: "600" },
  submitBtn: {
    backgroundColor: "#1D4ED8",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  submitBtnDisabled: { backgroundColor: "#93C5FD", shadowOpacity: 0 },
  submitBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E2E8F0" },
  dividerText: { fontSize: 12, color: "#94A3B8", fontWeight: "600" },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  registerLabel: { fontSize: 14, color: "#64748B" },
  registerLink: { fontSize: 14, color: "#1D4ED8", fontWeight: "700" },
  adminLink: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
  },
  adminLinkText: { fontSize: 13, color: "#64748B", fontWeight: "500" },
});

export default LoginScreen;
