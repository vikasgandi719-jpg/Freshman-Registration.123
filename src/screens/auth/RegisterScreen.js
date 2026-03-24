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
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Input from "../../components/common/Input";
import { SCREENS } from "../../constants/config";
import useAuthHook from "../../hooks/useAuth";
import { useAuth } from "../../context/AuthContext";

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    file: null,
  });
  const [errors, setErrors] = useState({});

  const { register, isSubmitting } = useAuthHook();
  const { error: authError, clearError } = useAuth();

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (!result.canceled && result.assets?.[0]) {
      setField("file", result.assets[0]);
    }
  };

  const validateForm = () => {
    const stepErrors = {};
    if (!form.name?.trim()) stepErrors.name = "Name is required.";
    if (!form.email?.trim()) stepErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      stepErrors.email = "Enter a valid email address.";
    if (!form.password?.trim()) stepErrors.password = "Password is required.";
    else if (form.password.length < 8)
      stepErrors.password = "Password must be at least 8 characters.";

    return stepErrors;
  };

  const handleRegister = async () => {
    const stepErrors = validateForm();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    clearError();
    setErrors({});

    const registerData = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      file: form.file,
    };

    const result = await register(registerData);
    if (result.success) {
      navigation.replace(SCREENS.REGISTRATION_SUCCESS, {
        name: registerData.name,
        email: registerData.email,
      });
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
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
            <Text style={styles.backBtnText}>‹ Login</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Fill in your details to register
          </Text>

          {authError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>⚠ {authError}</Text>
            </View>
          )}

          <View style={styles.form}>
            <Input
              label="Full Name"
              value={form.name}
              onChangeText={(t) => setField("name", t)}
              placeholder="Enter your full name"
              icon="👤"
              error={errors.name}
              required
            />

            <Input
              label="Email"
              value={form.email}
              onChangeText={(t) => setField("email", t)}
              placeholder="Enter your email"
              icon="📧"
              error={errors.email}
              required
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              value={form.password}
              onChangeText={(t) => setField("password", t)}
              placeholder="Minimum 8 characters"
              icon="🔒"
              error={errors.password}
              required
              secureTextEntry
            />

            <TouchableOpacity style={styles.fileBtn} onPress={pickFile}>
              <Text style={styles.fileBtnLabel}>Attach Profile/Document (Optional)</Text>
              <Text style={styles.fileBtnValue}>
                {form.file?.name || "Tap to choose file"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
            onPress={handleRegister}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginLabel}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate(SCREENS.LOGIN)}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  backBtn: { marginTop: 16, marginBottom: 8, alignSelf: "flex-start" },
  backBtnText: { fontSize: 16, color: "#1D4ED8", fontWeight: "600" },
  title: { fontSize: 26, fontWeight: "800", color: "#0F172A", marginTop: 8 },
  subtitle: { fontSize: 14, color: "#64748B", marginTop: 4, marginBottom: 20 },
  errorBanner: {
    backgroundColor: "#FFF1F2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#F43F5E",
  },
  errorBannerText: { fontSize: 13, color: "#BE123C", fontWeight: "500" },
  form: { marginBottom: 20 },
  fileBtn: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  fileBtnLabel: { color: "#1D4ED8", fontWeight: "600", marginBottom: 4 },
  fileBtnValue: { color: "#334155", fontSize: 13 },
  submitBtn: {
    backgroundColor: "#1D4ED8",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  submitBtnDisabled: { backgroundColor: "#93C5FD", shadowOpacity: 0 },
  submitBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  loginRow: { flexDirection: "row", justifyContent: "center" },
  loginLabel: { fontSize: 14, color: "#64748B" },
  loginLink: { fontSize: 14, color: "#1D4ED8", fontWeight: "700" },
});

export default RegisterScreen;
