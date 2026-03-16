import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, KeyboardAvoidingView,
  Platform, ActivityIndicator,
} from 'react-native';
import Input         from '../../components/common/Input';
import PasswordInput from '../../components/auth/PasswordInput';
import { SCREENS }   from '../../constants/config';
import { useAdmin }  from '../../context/AdminContext';
import adminService  from '../../services/adminService';

const AdminLoginScreen = ({ navigation }) => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);

  const { loginAdmin } = useAdmin();

  const validate = () => {
    const errs = {};
    if (!email.trim())    errs.email    = 'Email is required.';
    if (!password.trim()) errs.password = 'Password is required.';
    return errs;
  };

  const handleLogin = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});
    try {
      const response = await adminService.adminLogin(email.trim(), password);
      await loginAdmin(response.admin, response.token);
    } catch (error) {
      setErrors({ general: error?.message || 'Invalid credentials. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>‹ Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIconBox}>
              <Text style={styles.headerIcon}>🔐</Text>
            </View>
            <Text style={styles.title}>Admin Portal</Text>
            <Text style={styles.subtitle}>Sign in with your administrator credentials</Text>
          </View>

          {/* Warning banner */}
          <View style={styles.warningBanner}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              This portal is restricted to authorized administrators only.
              Unauthorized access attempts are monitored.
            </Text>
          </View>

          {/* General error */}
          {errors.general && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>⚠  {errors.general}</Text>
            </View>
          )}

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Admin Email"
              value={email}
              onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: null })); }}
              placeholder="admin@bvritn.ac.in"
              icon="✉️"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              required
            />
            <PasswordInput
              label="Password"
              value={password}
              onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: null })); }}
              placeholder="Enter admin password"
              error={errors.password}
              onSubmitEditing={handleLogin}
              returnKeyType="done"
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#FFFFFF" size="small" />
              : <Text style={styles.submitBtnText}>🔐  Sign In as Admin</Text>
            }
          </TouchableOpacity>

          {/* Student link */}
          <View style={styles.studentRow}>
            <Text style={styles.studentLabel}>Not an admin?  </Text>
            <TouchableOpacity onPress={() => navigation.navigate(SCREENS.LOGIN)}>
              <Text style={styles.studentLink}>Student Login</Text>
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
  header:     { alignItems: 'center', marginBottom: 24, marginTop: 12 },
  headerIconBox: {
    width:           80, height: 80, borderRadius: 40,
    backgroundColor: '#0F172A', justifyContent: 'center',
    alignItems:      'center', marginBottom: 14,
    shadowColor:     '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity:   0.2, shadowRadius: 12, elevation: 8,
  },
  headerIcon: { fontSize: 36 },
  title:      { fontSize: 26, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  subtitle:   { fontSize: 14, color: '#64748B', textAlign: 'center' },
  warningBanner: {
    flexDirection:   'row',
    alignItems:      'flex-start',
    backgroundColor: '#FFFBEB',
    borderRadius:    10,
    padding:         12,
    marginBottom:    20,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    gap:             10,
  },
  warningIcon: { fontSize: 16, marginTop: 1 },
  warningText: { flex: 1, fontSize: 12, color: '#92400E', lineHeight: 18 },
  errorBanner: {
    backgroundColor: '#FFF1F2', borderRadius: 10, padding: 12,
    marginBottom:    16, borderLeftWidth: 4, borderLeftColor: '#F43F5E',
  },
  errorBannerText: { fontSize: 13, color: '#BE123C', fontWeight: '500' },
  form:       { marginBottom: 24 },
  submitBtn: {
    backgroundColor: '#0F172A', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginBottom: 20,
    shadowColor:     '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity:   0.25, shadowRadius: 10, elevation: 6,
  },
  submitBtnDisabled: { backgroundColor: '#475569', shadowOpacity: 0 },
  submitBtnText:     { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  studentRow:  { flexDirection: 'row', justifyContent: 'center' },
  studentLabel:{ fontSize: 14, color: '#64748B' },
  studentLink: { fontSize: 14, color: '#1D4ED8', fontWeight: '700' },
});

export default AdminLoginScreen;