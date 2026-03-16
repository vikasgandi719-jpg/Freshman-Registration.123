import { useState, useCallback } from 'react';
import { useAuth as useAuthContext } from '../context/AuthContext';
import authService from '../services/authService';
import { VALIDATION } from '../constants/config';

const useAuth = () => {
  const context = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Validate Login ──────────────────────────────────────────────────────────
  const validateLoginForm = (email, password) => {
    const errors = {};
    if (!email.trim())
      errors.email = 'Email is required.';
    else if (!VALIDATION.EMAIL_PATTERN.test(email))
      errors.email = 'Enter a valid email address.';
    if (!password.trim())
      errors.password = 'Password is required.';
    else if (password.length < VALIDATION.PASSWORD_MIN_LENGTH)
      errors.password = `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters.`;
    return errors;
  };

  // ─── Validate Register ───────────────────────────────────────────────────────
  const validateRegisterForm = (data) => {
    const errors = {};
    if (!data.name?.trim())
      errors.name = 'Full name is required.';
    else if (data.name.trim().length < VALIDATION.NAME_MIN_LENGTH)
      errors.name = 'Name is too short.';

    if (!data.email?.trim())
      errors.email = 'Email is required.';
    else if (!VALIDATION.EMAIL_PATTERN.test(data.email))
      errors.email = 'Enter a valid email address.';

    if (!data.phone?.trim())
      errors.phone = 'Phone number is required.';
    else if (!VALIDATION.PHONE_PATTERN.test(data.phone))
      errors.phone = 'Enter a valid 10-digit phone number.';

    if (!data.password?.trim())
      errors.password = 'Password is required.';
    else if (data.password.length < VALIDATION.PASSWORD_MIN_LENGTH)
      errors.password = `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters.`;

    if (data.password !== data.confirmPassword)
      errors.confirmPassword = 'Passwords do not match.';

    if (!data.rollNumber?.trim())
      errors.rollNumber = 'Roll number is required.';
    else if (!VALIDATION.ROLL_NUMBER_PATTERN.test(data.rollNumber.toUpperCase()))
      errors.rollNumber = 'Invalid roll number format.';

    if (!data.branch)
      errors.branch = 'Please select your branch.';

    return errors;
  };

  // ─── Login ───────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const errors = validateLoginForm(email, password);
    if (Object.keys(errors).length > 0) return { success: false, errors };

    setIsSubmitting(true);
    context.clearError();
    try {
      const response = await authService.login(email.trim(), password);
      await context.login(response.user, response.token);
      return { success: true };
    } catch (error) {
      const msg = error?.message || 'Login failed. Please try again.';
      context.setError(msg);
      return { success: false, errors: { general: msg } };
    } finally {
      setIsSubmitting(false);
    }
  }, [context]);

  // ─── Register ────────────────────────────────────────────────────────────────
  const register = useCallback(async (data) => {
    const errors = validateRegisterForm(data);
    if (Object.keys(errors).length > 0) return { success: false, errors };

    setIsSubmitting(true);
    context.clearError();
    try {
      const response = await authService.register(data);
      return { success: true, data: response };
    } catch (error) {
      const msg = error?.message || 'Registration failed. Please try again.';
      context.setError(msg);
      return { success: false, errors: { general: msg } };
    } finally {
      setIsSubmitting(false);
    }
  }, [context]);

  // ─── Logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (_) {}
    await context.logout();
  }, [context]);

  // ─── Send OTP ────────────────────────────────────────────────────────────────
  const sendOTP = useCallback(async (phone) => {
    if (!phone || !VALIDATION.PHONE_PATTERN.test(phone)) {
      return { success: false, error: 'Enter a valid phone number.' };
    }
    setIsSubmitting(true);
    try {
      await authService.sendOTP(phone);
      context.otpSent();
      return { success: true };
    } catch (error) {
      const msg = error?.message || 'Failed to send OTP.';
      context.setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsSubmitting(false);
    }
  }, [context]);

  // ─── Verify OTP ──────────────────────────────────────────────────────────────
  const verifyOTP = useCallback(async (phone, otp) => {
    if (!otp || otp.length < 6) {
      return { success: false, error: 'Enter the complete OTP.' };
    }
    setIsSubmitting(true);
    try {
      const response = await authService.verifyOTP(phone, otp);
      context.otpVerified();
      return { success: true, data: response };
    } catch (error) {
      const msg = error?.message || 'Invalid OTP. Please try again.';
      context.setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsSubmitting(false);
    }
  }, [context]);

  return {
    // State
    user:         context.user,
    token:        context.token,
    isLoggedIn:   context.isLoggedIn,
    isLoading:    context.isLoading,
    isSubmitting,
    error:        context.error,
    otpSent:      context.otpSent,
    otpVerified:  context.otpVerified,

    // Actions
    login,
    register,
    logout,
    sendOTP,
    verifyOTP,
    updateUser:   context.updateUser,
    clearError:   context.clearError,

    // Validators
    validateLoginForm,
    validateRegisterForm,
  };
};

export default useAuth;