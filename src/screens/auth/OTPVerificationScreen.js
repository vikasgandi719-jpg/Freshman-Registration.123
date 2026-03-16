import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ActivityIndicator,
} from 'react-native';
import OTPInput    from '../../components/auth/OTPInput';
import { SCREENS } from '../../constants/config';
import useOTP      from '../../hooks/useOTP';

const OTPVerificationScreen = ({ navigation, route }) => {
  const { phone = '', onVerifiedScreen = SCREENS.STUDENT_DASHBOARD } = route.params || {};

  const [verified, setVerified] = useState(false);

  const {
    sent, loading, error,
    countdown, canResend,
    sendOTP, verifyOTP, resendOTP,
    handleOTPChange, setError,
  } = useOTP(phone, () => {
    setVerified(true);
    setTimeout(() => navigation.replace(onVerifiedScreen), 1200);
  });

  // Auto-send OTP on mount
  React.useEffect(() => {
    if (phone) sendOTP(phone);
  }, []);

  const maskedPhone = phone
    ? phone.replace(/(\d{2})\d{6}(\d{2})/, '$1xxxxxx$2')
    : '**********';

  if (verified) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <Text style={styles.successIcon}>✅</Text>
          </View>
          <Text style={styles.successTitle}>Verified!</Text>
          <Text style={styles.successSubtitle}>Taking you to your dashboard…</Text>
          <ActivityIndicator color="#1D4ED8" style={{ marginTop: 20 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Back */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backBtnText}>‹ Back</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        {/* Icon */}
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>📱</Text>
        </View>

        {/* Phone info */}
        <Text style={styles.title}>Verify Your Number</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{'\n'}
          <Text style={styles.phoneHighlight}>{maskedPhone}</Text>
        </Text>

        {/* OTP Input */}
        <OTPInput
          length={6}
          loading={loading}
          error={error}
          title=""
          subtitle=""
          onComplete={(code) => verifyOTP(code, phone)}
          onResend={() => resendOTP(phone)}
          resendCooldown={30}
        />

        {/* Wrong number */}
        <TouchableOpacity
          style={styles.wrongNumberBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.wrongNumberText}>Wrong number? Go back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: '#F8FAFC' },
  backBtn:     { marginTop: 16, marginHorizontal: 24, alignSelf: 'flex-start' },
  backBtnText: { fontSize: 16, color: '#1D4ED8', fontWeight: '600' },
  container:   { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 24 },
  iconCircle: {
    width:           80, height: 80, borderRadius: 40,
    backgroundColor: '#DBEAFE', justifyContent: 'center',
    alignItems:      'center', marginBottom: 20,
  },
  iconText:          { fontSize: 36 },
  title:             { fontSize: 26, fontWeight: '800', color: '#0F172A', marginBottom: 8, textAlign: 'center' },
  subtitle:          { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  phoneHighlight:    { color: '#1D4ED8', fontWeight: '700' },
  wrongNumberBtn:    { marginTop: 16 },
  wrongNumberText:   { fontSize: 13, color: '#94A3B8', textDecorationLine: 'underline' },
  successContainer:  { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  successCircle: {
    width:           100, height: 100, borderRadius: 50,
    backgroundColor: '#F0FDF4', justifyContent: 'center',
    alignItems:      'center', marginBottom: 20,
  },
  successIcon:     { fontSize: 48 },
  successTitle:    { fontSize: 28, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  successSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center' },
});

export default OTPVerificationScreen;