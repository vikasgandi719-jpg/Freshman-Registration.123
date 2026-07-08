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
      ? `${String(form.dob.getDate()).padStart(2, "0")}${String(form.dob.getMonth() + 1).padStart(2, "0")}${form.dob.getFullYear()}`
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
      const generatedId = result.data?.uniqueId || "2026-BVRITN-1A-0001";
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

  const filledCount = [
    form.name?.trim(),
    form.parentPhone?.trim(),
    form.interhallTicket?.trim(),
    form.dob,
  ].filter(Boolean).length;

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

          <View style={styles.headerArea}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Fill in your details to get started
            </Text>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(filledCount / 4) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {filledCount}/4 fields completed
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
                <View style={styles.passwordInfoHeader}>
                  <Text style={styles.passwordInfoIcon}>🔑</Text>
                  <Text style={styles.passwordInfoTitle}>
                    Your Auto-Generated Password
                  </Text>
                </View>
                <View style={styles.passwordValueBox}>
                  <Text style={styles.passwordValue}>
                    {form.dob
                      ? `${String(form.dob.getDate()).padStart(2, "0")}${String(form.dob.getMonth() + 1).padStart(2, "0")}${form.dob.getFullYear()}`
                      : ""}
                  </Text>
                </View>
                <Text style={styles.passwordHint}>
                  Format: DDMMYYYY (your date of birth)
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
              <>
                <Text style={styles.submitBtnText}>Create Account</Text>
                <Text style={styles.submitBtnArrow}>→</Text>
              </>
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
  headerArea: { marginBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1D4ED8",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
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
  passwordInfo: {
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  passwordInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  passwordInfoIcon: { fontSize: 18 },
  passwordInfoTitle: {
    color: "#1D4ED8",
    fontSize: 14,
    fontWeight: "700",
  },
  passwordValueBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  passwordValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: 2,
  },
  passwordHint: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
  submitBtn: {
    backgroundColor: "#1D4ED8",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  submitBtnDisabled: { backgroundColor: "#93C5FD", shadowOpacity: 0 },
  submitBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  submitBtnArrow: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
  loginRow: { flexDirection: "row", justifyContent: "center" },
  loginLabel: { fontSize: 14, color: "#64748B" },
  loginLink: { fontSize: 14, color: "#1D4ED8", fontWeight: "700" },
});

export default RegisterScreen;
