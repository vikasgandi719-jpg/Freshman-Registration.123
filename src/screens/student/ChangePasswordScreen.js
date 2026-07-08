import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert,
  ActivityIndicator,
} from 'react-native';
import PasswordInput from '../../components/auth/PasswordInput';
import authService from '../../services/authService';

const REQUIREMENTS = [
  { label: 'At least 8 characters',  test: (p) => p.length >= 8 },
  { label: 'One uppercase letter',   test: (p) => /[A-Z]/.test(p) },
  { label: 'One number',             test: (p) => /[0-9]/.test(p) },
  { label: 'Different from current', test: (p, o) => p.length > 0 && p !== o },
];

const ChangePasswordScreen = ({ navigation }) => {
  const [oldPw, setOldPw]         = useState('');
  const [newPw, setNewPw]         = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [busy, setBusy]           = useState(false);
  const [errors, setErrors]       = useState({});

  const requirementResults = useMemo(
    () => REQUIREMENTS.map((r) => ({ ...r, met: r.test(newPw, oldPw) })),
    [newPw, oldPw],
  );
  const metCount   = requirementResults.filter((r) => r.met).length;
  const allMet     = metCount === REQUIREMENTS.length;
  const passwordsMatch = confirmPw.length > 0 && confirmPw === newPw;
  const canSubmit  = oldPw.length > 0 && allMet && passwordsMatch && !busy;

  const handleSubmit = async () => {
    setErrors({});
    setBusy(true);
    try {
      await authService.changePassword(oldPw, newPw);
      Alert.alert(
        'Password updated',
        'Your new password will be required the next time you sign in.',
        [{ text: 'Done', onPress: () => navigation.goBack() }],
      );
      setOldPw(''); setNewPw(''); setConfirmPw('');
    } catch (err) {
      const msg = err?.message || 'Could not change password. Try again.';
      if (/current password|invalid/i.test(msg)) {
        setErrors({ oldPw: 'That doesn\'t match your current password.' });
      } else {
        Alert.alert('Failed', msg);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBg} />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.closeBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Change Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <View style={styles.iconRing}>
              <View style={styles.iconInner}>
                <Text style={styles.icon}>🔐</Text>
              </View>
            </View>
            <Text style={styles.title}>Keep your account secure</Text>
            <Text style={styles.subtitle}>
              Set a new password. You'll use it every time you sign in from now on.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>CURRENT</Text>
              <PasswordInput
                value={oldPw}
                onChangeText={(t) => {
                  setOldPw(t);
                  setErrors((e) => ({ ...e, oldPw: null }));
                }}
                placeholder="Current password"
                error={errors.oldPw}
                label=""
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>NEW PASSWORD</Text>
              <PasswordInput
                value={newPw}
                onChangeText={setNewPw}
                placeholder="New password"
                label=""
              />
              <PasswordInput
                value={confirmPw}
                onChangeText={setConfirmPw}
                placeholder="Confirm new password"
                label=""
                error={confirmPw.length > 0 && !passwordsMatch ? 'Doesn\'t match' : null}
              />

              <View style={styles.checklist}>
                <View style={styles.checklistHeader}>
                  <Text style={styles.checklistTitle}>Requirements</Text>
                  <Text
                    style={[
                      styles.checklistCount,
                      allMet && styles.checklistCountDone,
                    ]}
                  >
                    {metCount}/{REQUIREMENTS.length}
                  </Text>
                </View>
                {requirementResults.map((r) => (
                  <View key={r.label} style={styles.checkRow}>
                    <View style={[styles.checkDot, r.met && styles.checkDotMet]}>
                      {r.met ? <Text style={styles.checkTick}>✓</Text> : null}
                    </View>
                    <Text style={[styles.checkText, r.met && styles.checkTextMet]}>
                      {r.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.85}
          >
            {busy
              ? <ActivityIndicator color="#FFFFFF" size="small" />
              : <Text style={styles.submitBtnText}>Update Password</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
            disabled={busy}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  topBg: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 220,
    backgroundColor: '#EFF6FF',
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
  },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 12 : 20, paddingBottom: 8,
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  closeBtnText: { fontSize: 22, color: '#0F172A', fontWeight: '600', marginTop: -2 },
  topBarTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },

  container: { paddingHorizontal: 20, paddingBottom: 40 },

  hero: { alignItems: 'center', paddingVertical: 20, marginBottom: 8 },
  iconRing: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20,
  },
  iconInner: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#1D4ED8',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 10,
  },
  icon: { fontSize: 32 },
  title: {
    fontSize: 22, fontWeight: '800', color: '#0F172A',
    textAlign: 'center', letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14, color: '#64748B', textAlign: 'center',
    marginTop: 6, lineHeight: 20, maxWidth: 320,
  },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20,
    marginTop: 16, marginBottom: 20,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 16, elevation: 4,
    overflow: 'hidden',
  },
  section: { padding: 20, paddingBottom: 4 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: '#64748B',
    letterSpacing: 1.2, marginBottom: 14,
  },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 20 },

  checklist: {
    backgroundColor: '#F8FAFC', borderRadius: 12,
    padding: 14, marginTop: 4, marginBottom: 16,
  },
  checklistHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  checklistTitle: { fontSize: 12, fontWeight: '700', color: '#334155' },
  checklistCount: {
    fontSize: 12, fontWeight: '700', color: '#94A3B8',
    backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 10, overflow: 'hidden',
  },
  checklistCountDone: { color: '#15803D', backgroundColor: '#DCFCE7' },
  checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  checkDot: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 10,
  },
  checkDotMet: { backgroundColor: '#22C55E' },
  checkTick: { fontSize: 11, color: '#FFFFFF', fontWeight: '800' },
  checkText: { fontSize: 13, color: '#64748B' },
  checkTextMet: { color: '#0F172A', fontWeight: '500' },

  submitBtn: {
    backgroundColor: '#1D4ED8', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  submitBtnDisabled: { backgroundColor: '#CBD5E1', shadowOpacity: 0 },
  submitBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },

  cancelBtn: { alignItems: 'center', paddingVertical: 14, marginTop: 4 },
  cancelBtnText: { color: '#64748B', fontSize: 14, fontWeight: '600' },
});

export default ChangePasswordScreen;
