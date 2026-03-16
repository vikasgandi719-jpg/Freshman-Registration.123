import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, KeyboardAvoidingView,
  Platform, ActivityIndicator,
} from 'react-native';
import Input         from '../../components/common/Input';
import PasswordInput from '../../components/auth/PasswordInput';
import DatePicker    from '../../components/auth/DatePicker';
import { SCREENS }   from '../../constants/config';
import { BRANCH_LIST } from '../../constants/branches';
import useAuthHook   from '../../hooks/useAuth';
import { useAuth }   from '../../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', rollNumber: '',
    branch: '', semester: '', dob: null,
    password: '', confirmPassword: '',
  });
  const [errors,   setErrors]   = useState({});
  const [step,     setStep]     = useState(1); // 1 = personal, 2 = academic, 3 = security

  const { register, isSubmitting } = useAuthHook();
  const { error: authError, clearError } = useAuth();

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleNext = () => {
    let stepErrors = {};

    if (step === 1) {
      if (!form.name.trim())  stepErrors.name  = 'Full name is required.';
      if (!form.email.trim()) stepErrors.email = 'Email is required.';
      if (!form.phone.trim()) stepErrors.phone = 'Phone is required.';
    }
    if (step === 2) {
      if (!form.rollNumber.trim()) stepErrors.rollNumber = 'Roll number is required.';
      if (!form.branch)            stepErrors.branch     = 'Please select your branch.';
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setStep((s) => s + 1);
  };

  const handleRegister = async () => {
    clearError();
    setErrors({});
    const result = await register(form);
    if (result.success) {
      navigation.navigate(SCREENS.OTP_VERIFICATION, { phone: form.phone });
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };

  const StepIndicator = () => (
    <View style={styles.stepRow}>
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <View style={[styles.stepDot, step >= s && styles.stepDotActive]}>
            <Text style={[styles.stepDotText, step >= s && styles.stepDotTextActive]}>{s}</Text>
          </View>
          {s < 3 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
        </React.Fragment>
      ))}
    </View>
  );

  const stepLabels = ['Personal Info', 'Academic Info', 'Security'];

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={() => step > 1 ? setStep(s => s - 1) : navigation.goBack()}>
            <Text style={styles.backBtnText}>‹ {step > 1 ? 'Back' : 'Login'}</Text>
          </TouchableOpacity>

          {/* Header */}
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Step {step} of 3 — {stepLabels[step - 1]}</Text>

          <StepIndicator />

          {/* Auth error */}
          {authError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>⚠  {authError}</Text>
            </View>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <View style={styles.form}>
              <Input label="Full Name"      value={form.name}  onChangeText={(t) => setField('name', t)}  placeholder="Enter your full name"  icon="👤" error={errors.name}  required />
              <Input label="Email Address"  value={form.email} onChangeText={(t) => setField('email', t)} placeholder="Enter your email"       icon="✉️" error={errors.email} required keyboardType="email-address" autoCapitalize="none" />
              <Input label="Phone Number"   value={form.phone} onChangeText={(t) => setField('phone', t)} placeholder="10-digit mobile number" icon="📞" error={errors.phone} required keyboardType="phone-pad" maxLength={10} />
              <DatePicker label="Date of Birth" value={form.dob} onChange={(d) => setField('dob', d)} placeholder="Select your date of birth" maximumDate={new Date()} />
            </View>
          )}

          {/* Step 2: Academic Info */}
          {step === 2 && (
            <View style={styles.form}>
              <Input label="Roll Number" value={form.rollNumber} onChangeText={(t) => setField('rollNumber', t)} placeholder="e.g. 21BCE1234" icon="🪪" error={errors.rollNumber} required autoCapitalize="characters" />

              {/* Branch selector */}
              <Text style={styles.fieldLabel}>Branch <Text style={styles.required}>*</Text></Text>
              <View style={styles.branchGrid}>
                {BRANCH_LIST.slice(0, 6).map((b) => (
                  <TouchableOpacity
                    key={b.id}
                    style={[styles.branchChip, form.branch === b.id && styles.branchChipActive]}
                    onPress={() => setField('branch', b.id)}
                  >
                    <Text style={styles.branchChipIcon}>{b.icon}</Text>
                    <Text style={[styles.branchChipText, form.branch === b.id && styles.branchChipTextActive]}>
                      {b.shortName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.branch && <Text style={styles.fieldError}>⚠ {errors.branch}</Text>}

              {/* Semester */}
              <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Semester</Text>
              <View style={styles.semesterRow}>
                {[1,2,3,4,5,6,7,8].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.semChip, form.semester === String(s) && styles.semChipActive]}
                    onPress={() => setField('semester', String(s))}
                  >
                    <Text style={[styles.semChipText, form.semester === String(s) && styles.semChipTextActive]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Step 3: Security */}
          {step === 3 && (
            <View style={styles.form}>
              <PasswordInput
                label="Password"
                value={form.password}
                onChangeText={(t) => setField('password', t)}
                placeholder="Create a strong password"
                error={errors.password}
                showStrength
                required
              />
              <PasswordInput
                label="Confirm Password"
                value={form.confirmPassword}
                onChangeText={(t) => setField('confirmPassword', t)}
                placeholder="Re-enter your password"
                error={errors.confirmPassword}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
            </View>
          )}

          {/* CTA */}
          {step < 3 ? (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
              <Text style={styles.nextBtnText}>Continue  →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleRegister}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting
                ? <ActivityIndicator color="#FFFFFF" size="small" />
                : <Text style={styles.submitBtnText}>Create Account</Text>
              }
            </TouchableOpacity>
          )}

          {/* Login link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginLabel}>Already have an account?  </Text>
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
  safe:       { flex: 1, backgroundColor: '#F8FAFC' },
  container:  { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  backBtn:    { marginTop: 16, marginBottom: 8, alignSelf: 'flex-start' },
  backBtnText:{ fontSize: 16, color: '#1D4ED8', fontWeight: '600' },
  title:      { fontSize: 26, fontWeight: '800', color: '#0F172A', marginTop: 8 },
  subtitle:   { fontSize: 14, color: '#64748B', marginTop: 4, marginBottom: 20 },
  stepRow:    { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  stepDot:    { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  stepDotActive: { backgroundColor: '#1D4ED8' },
  stepDotText: { fontSize: 13, fontWeight: '700', color: '#94A3B8' },
  stepDotTextActive: { color: '#FFFFFF' },
  stepLine:   { flex: 1, height: 2, backgroundColor: '#E2E8F0' },
  stepLineActive: { backgroundColor: '#1D4ED8' },
  errorBanner:{ backgroundColor: '#FFF1F2', borderRadius: 10, padding: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#F43F5E' },
  errorBannerText: { fontSize: 13, color: '#BE123C', fontWeight: '500' },
  form:       { marginBottom: 20 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  required:   { color: '#EF4444' },
  fieldError: { fontSize: 12, color: '#EF4444', marginTop: 4 },
  branchGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  branchChip: { width: '30%', paddingVertical: 10, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent' },
  branchChipActive: { backgroundColor: '#EFF6FF', borderColor: '#1D4ED8' },
  branchChipIcon: { fontSize: 20, marginBottom: 4 },
  branchChipText: { fontSize: 11, color: '#475569', fontWeight: '600' },
  branchChipTextActive: { color: '#1D4ED8' },
  semesterRow: { flexDirection: 'row', gap: 8 },
  semChip: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#F1F5F9', alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent' },
  semChipActive: { backgroundColor: '#EFF6FF', borderColor: '#1D4ED8' },
  semChipText: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  semChipTextActive: { color: '#1D4ED8', fontWeight: '700' },
  nextBtn:    { backgroundColor: '#1D4ED8', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 20, shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  nextBtnText:{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  submitBtn:  { backgroundColor: '#1D4ED8', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 20, shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  submitBtnDisabled: { backgroundColor: '#93C5FD', shadowOpacity: 0 },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  loginRow:   { flexDirection: 'row', justifyContent: 'center' },
  loginLabel: { fontSize: 14, color: '#64748B' },
  loginLink:  { fontSize: 14, color: '#1D4ED8', fontWeight: '700' },
});

export default RegisterScreen;