import { useState, useEffect, useCallback, useRef } from 'react';
import otpService from '../services/otpService';
import { OTP } from '../constants/config';

/**
 * useOTP
 * Manages OTP send, verify, resend, and countdown.
 *
 * @param {string}   phone       - Phone number to send OTP to
 * @param {function} onVerified  - Callback when OTP is verified successfully
 */

const useOTP = (phone = '', onVerified = null) => {
  const [otp,         setOtp]         = useState('');
  const [sent,        setSent]        = useState(false);
  const [verified,    setVerified]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [countdown,   setCountdown]   = useState(0);
  const [canResend,   setCanResend]   = useState(false);
  const [attempts,    setAttempts]    = useState(0);

  const timerRef = useRef(null);
  const MAX_ATTEMPTS = 3;

  // ─── Countdown timer ─────────────────────────────────────────────────────────
  const startCountdown = useCallback((seconds = OTP.RESEND_COOLDOWN) => {
    setCountdown(seconds);
    setCanResend(false);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ─── Send OTP ────────────────────────────────────────────────────────────────
  const sendOTP = useCallback(async (targetPhone = phone) => {
    if (!targetPhone) {
      setError('Phone number is required.');
      return { success: false };
    }

    setLoading(true);
    setError(null);

    try {
      await otpService.sendOTP(targetPhone);
      setSent(true);
      setOtp('');
      setAttempts(0);
      startCountdown();
      return { success: true };
    } catch (err) {
      const msg = err?.message || 'Failed to send OTP. Try again.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [phone, startCountdown]);

  // ─── Verify OTP ──────────────────────────────────────────────────────────────
  const verifyOTP = useCallback(async (code = otp, targetPhone = phone) => {
    if (!code || code.length < OTP.LENGTH) {
      setError(`Enter all ${OTP.LENGTH} digits.`);
      return { success: false };
    }

    if (attempts >= MAX_ATTEMPTS) {
      setError('Too many failed attempts. Please request a new OTP.');
      return { success: false };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await otpService.verifyOTP(targetPhone, code);
      setVerified(true);
      if (timerRef.current) clearInterval(timerRef.current);
      onVerified && onVerified(response);
      return { success: true, data: response };
    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      const remaining = MAX_ATTEMPTS - newAttempts;
      const msg =
        remaining > 0
          ? `Incorrect OTP. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.`
          : 'Too many failed attempts. Please request a new OTP.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [otp, phone, attempts, onVerified]);

  // ─── Resend OTP ───────────────────────────────────────────────────────────────
  const resendOTP = useCallback(async (targetPhone = phone) => {
    if (!canResend) return { success: false, error: 'Please wait before resending.' };
    return await sendOTP(targetPhone);
  }, [canResend, sendOTP, phone]);

  // ─── Reset ───────────────────────────────────────────────────────────────────
  const resetOTP = useCallback(() => {
    setOtp('');
    setSent(false);
    setVerified(false);
    setLoading(false);
    setError(null);
    setCountdown(0);
    setCanResend(false);
    setAttempts(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // ─── OTP change handler ───────────────────────────────────────────────────────
  const handleOTPChange = useCallback((value) => {
    setOtp(value);
    if (error) setError(null);
  }, [error]);

  const isMaxAttempts   = attempts >= MAX_ATTEMPTS;
  const attemptsLeft    = MAX_ATTEMPTS - attempts;
  const countdownLabel  = countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP';

  return {
    otp,
    sent,
    verified,
    loading,
    error,
    countdown,
    canResend,
    attempts,
    attemptsLeft,
    isMaxAttempts,
    countdownLabel,

    sendOTP,
    verifyOTP,
    resendOTP,
    resetOTP,
    handleOTPChange,
    setOtp,
    setError,
  };
};

export default useOTP;