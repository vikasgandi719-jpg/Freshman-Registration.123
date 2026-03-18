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
import Input from "../../components/common/Input";
import DatePicker from "../../components/auth/DatePicker";
import { SCREENS } from "../../constants/config";
import useAuthHook from "../../hooks/useAuth";
import { useAuth } from "../../context/AuthContext";

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: "",
    parentPhone: "",
    interhallTicket: "",
    dob: null,
  });
  const [errors, setErrors] = useState({});

  const { register, isSubmitting } = useAuthHook();
  const { error: authError, clearError } = useAuth();

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const stepErrors = {};
    if (!form.name?.trim()) stepErrors.name = "Student name is required.";
    if (!form.parentPhone?.trim())
      stepErrors.parentPhone = "Parent's phone number is required.";
    else if (!/^[6-9]\d{9}$/.test(form.parentPhone))
      stepErrors.parentPhone = "Enter a valid 10-digit phone number.";
    if (!form.interhallTicket?.trim())
      stepErrors.interhallTicket = "Interhall ticket number is required.";
    if (!form.dob) stepErrors.dob = "Date of birth is required.";
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

    const dobFormatted = form.dob
      ? `${form.dob.getFullYear()}${String(form.dob.getMonth() + 1).padStart(2, "0")}${String(form.dob.getDate()).padStart(2, "0")}`
      : "";

    const registerData = {
      name: form.name.trim(),
      parentPhone: form.parentPhone.trim(),
      interhallTicket: form.interhallTicket.trim().toUpperCase(),
      dob: form.dob,
      password: dobFormatted,
    };

    const result = await register(registerData);
    if (result.success) {
      const generatedId = result.data?.uniqueId || "2026-bvritn-1a-0001";
      navigation.replace(SCREENS.REGISTRATION_SUCCESS, {
        uniqueId: generatedId,
        password: dobFormatted,
        name: form.name.trim(),
      });
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };

  const formatDOB = (dob) => {
    if (!dob) return "";
    return `${dob.getDate().toString().padStart(2, "0")}/${(dob.getMonth() + 1).toString().padStart(2, "0")}/${dob.getFullYear()}`;
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
          <Text style={styles.subtitle}>Fill in your details to register</Text>

          {authError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>⚠ {authError}</Text>
            </View>
          )}

          <View style={styles.form}>
            <Input
              label="Student Name"
              value={form.name}
              onChangeText={(t) => setField("name", t)}
              placeholder="Enter your full name"
              icon="👤"
              error={errors.name}
              required
            />

            <Input
              label="Parent's Phone Number"
              value={form.parentPhone}
              onChangeText={(t) => setField("parentPhone", t)}
              placeholder="10-digit mobile number"
              icon="📞"
              error={errors.parentPhone}
              required
              keyboardType="phone-pad"
              maxLength={10}
            />

            <Input
              label="Interhall Ticket Number"
              value={form.interhallTicket}
              onChangeText={(t) => setField("interhallTicket", t.toUpperCase())}
              placeholder="e.g. IHT123456"
              icon="🎫"
              error={errors.interhallTicket}
              required
              autoCapitalize="characters"
            />

            <DatePicker
              label="Date of Birth"
              value={form.dob}
              onChange={(d) => setField("dob", d)}
              placeholder="Select your date of birth"
              maximumDate={new Date()}
              error={errors.dob}
            />

            {form.dob && (
              <View style={styles.passwordInfo}>
                <Text style={styles.passwordInfoText}>
                  Default Password: {formatDOB(form.dob)}
                </Text>
              </View>
            )}
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
            <TouchableOpacity
              onPress={() => navigation.navigate(SCREENS.LOGIN)}
            >
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
  passwordInfo: {
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#1D4ED8",
  },
  passwordInfoText: { color: "#1D4ED8", fontSize: 13, fontWeight: "600" },
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
