import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';

/**
 * OTPInput
 * Props:
 *  - length: number (default 6)
 *  - onComplete: (otp: string) => void
 *  - onResend: () => void
 *  - resendCooldown: number (seconds, default 30)
 *  - loading: boolean
 *  - error: string | null
 *  - title: string
 *  - subtitle: string
 */

const OTPInput = ({
  length = 6,
  onComplete,
  onResend,
  resendCooldown = 30,
  loading = false,
  error = null,
  title = 'OTP Verification',
  subtitle = 'Enter the code sent to your number',
}) => {
  const [otp, setOtp]             = useState(Array(length).fill(''));
  const [cooldown, setCooldown]   = useState(resendCooldown);
  const [canResend, setCanResend] = useState(false);
  const inputRefs                 = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) { setCanResend(true); return; }
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleChange = (text, index) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Trigger complete
    if (newOtp.every((d) => d !== '')) {
      onComplete && onComplete(newOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(Array(length).fill(''));
    setCooldown(resendCooldown);
    setCanResend(false);
    inputRefs.current[0]?.focus();
    onResend && onResend();
  };

  const handlePaste = (text) => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, length).split('');
    const newOtp = Array(length).fill('');
    digits.forEach((d, i) => { newOtp[i] = d; });
    setOtp(newOtp);
    const lastFilled = Math.min(digits.length, length - 1);
    inputRefs.current[lastFilled]?.focus();
    if (digits.length === length) onComplete && onComplete(newOtp.join(''));
  };

  const filled = otp.filter((d) => d !== '').length;
  const progress = (filled / length) * 100;

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {/* OTP boxes */}
      <View style={styles.boxRow}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.box,
              digit && styles.boxFilled,
              error && styles.boxError,
              index === filled && !error && styles.boxActive,
            ]}
            value={digit}
            onChangeText={(text) => {
              if (text.length > 1) { handlePaste(text); return; }
              handleChange(text, index);
            }}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="numeric"
            maxLength={length} // allow paste
            textAlign="center"
            selectTextOnFocus
            editable={!loading}
          />
        ))}
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {/* Error */}
      {error && (
        <View style={styles.errorRow}>
          <Text style={styles.errorText}>⚠ {error}</Text>
        </View>
      )}

      {/* Submit button */}
      <TouchableOpacity
        style={[styles.submitBtn, filled < length && styles.submitBtnDisabled]}
        onPress={() => onComplete && onComplete(otp.join(''))}
        disabled={filled < length || loading}
      >
        {loading
          ? <ActivityIndicator color="#FFFFFF" size="small" />
          : <Text style={styles.submitBtnText}>Verify OTP</Text>
        }
      </TouchableOpacity>

      {/* Resend */}
      <View style={styles.resendRow}>
        <Text style={styles.resendLabel}>Didn't receive the code?  </Text>
        {canResend ? (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendLink}>Resend OTP</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.cooldownText}>Resend in {cooldown}s</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingHorizontal: 24 },
  title: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  boxRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  box: {
    width: 48, height: 56, borderRadius: 12,
    backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#E2E8F0',
    fontSize: 22, fontWeight: '700', color: '#0F172A',
  },
  boxFilled: { backgroundColor: '#EFF6FF', borderColor: '#1D4ED8' },
  boxActive: { borderColor: '#3B82F6', backgroundColor: '#F0F9FF' },
  boxError:  { borderColor: '#EF4444', backgroundColor: '#FFF1F2' },
  progressBar: { width: '100%', height: 4, backgroundColor: '#E2E8F0', borderRadius: 4, marginBottom: 16, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#1D4ED8', borderRadius: 4 },
  errorRow: { marginBottom: 12 },
  errorText: { fontSize: 13, color: '#EF4444', fontWeight: '500' },
  submitBtn: {
    width: '100%', backgroundColor: '#1D4ED8',
    paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20,
  },
  submitBtnDisabled: { backgroundColor: '#BFDBFE' },
  submitBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  resendRow: { flexDirection: 'row', alignItems: 'center' },
  resendLabel: { fontSize: 13, color: '#94A3B8' },
  resendLink: { fontSize: 13, color: '#1D4ED8', fontWeight: '700' },
  cooldownText: { fontSize: 13, color: '#64748B', fontWeight: '600' },
});

export default OTPInput;