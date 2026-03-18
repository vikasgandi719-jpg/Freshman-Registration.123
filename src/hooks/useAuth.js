import { useState, useCallback } from "react";
import { useAuth as useAuthContext } from "../context/AuthContext";
import authService from "../services/authService";
import studentService from "../services/studentService";

const useAuth = () => {
  const context = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateLoginForm = (uniqueId, password) => {
    const errors = {};
    if (!uniqueId.trim()) errors.uniqueId = "Unique ID is required.";
    if (!password.trim()) errors.password = "Password is required.";
    return errors;
  };

  const validateRegisterForm = (data) => {
    const errors = {};
    if (!data.name?.trim()) errors.name = "Student name is required.";
    else if (data.name.trim().length < 2) errors.name = "Name is too short.";

    if (!data.parentPhone?.trim())
      errors.parentPhone = "Parent's phone number is required.";
    else if (!/^[6-9]\d{9}$/.test(data.parentPhone))
      errors.parentPhone = "Enter a valid 10-digit phone number.";

    if (!data.interhallTicket?.trim())
      errors.interhallTicket = "Interhall ticket number is required.";

    if (!data.dob) errors.dob = "Date of birth is required.";

    if (!data.password?.trim()) errors.password = "Password is required.";

    return errors;
  };

  const login = useCallback(
    async (uniqueId, password) => {
      const errors = validateLoginForm(uniqueId, password);
      if (Object.keys(errors).length > 0) return { success: false, errors };

      setIsSubmitting(true);
      context.clearError();
      try {
        const response = await authService.login(uniqueId, password);
        await context.login(response.user, response.token);
        studentService.initProfile(response.user);
        return { success: true };
      } catch (error) {
        const msg = error?.message || "Login failed. Please try again.";
        context.setError(msg);
        return { success: false, errors: { general: msg } };
      } finally {
        setIsSubmitting(false);
      }
    },
    [context],
  );

  const register = useCallback(
    async (data) => {
      const errors = validateRegisterForm(data);
      if (Object.keys(errors).length > 0) return { success: false, errors };

      setIsSubmitting(true);
      context.clearError();
      try {
        const response = await authService.register(data);
        return { success: true, data: response };
      } catch (error) {
        const msg = error?.message || "Registration failed. Please try again.";
        context.setError(msg);
        return { success: false, errors: { general: msg } };
      } finally {
        setIsSubmitting(false);
      }
    },
    [context],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (_) {}
    studentService.resetProfile();
    await context.logout();
  }, [context]);

  const sendOTP = useCallback(
    async (phone) => {
      if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
        return { success: false, error: "Enter a valid phone number." };
      }
      setIsSubmitting(true);
      try {
        await authService.sendOTP(phone);
        context.otpSent();
        return { success: true };
      } catch (error) {
        const msg = error?.message || "Failed to send OTP.";
        context.setError(msg);
        return { success: false, error: msg };
      } finally {
        setIsSubmitting(false);
      }
    },
    [context],
  );

  const verifyOTP = useCallback(
    async (phone, otp) => {
      if (!otp || otp.length < 6) {
        return { success: false, error: "Enter the complete OTP." };
      }
      setIsSubmitting(true);
      try {
        const response = await authService.verifyOTP(phone, otp);
        context.otpVerified();
        return { success: true, data: response };
      } catch (error) {
        const msg = error?.message || "Invalid OTP. Please try again.";
        context.setError(msg);
        return { success: false, error: msg };
      } finally {
        setIsSubmitting(false);
      }
    },
    [context],
  );

  return {
    user: context.user,
    token: context.token,
    isLoggedIn: context.isLoggedIn,
    isLoading: context.isLoading,
    isSubmitting,
    error: context.error,
    otpSent: context.otpSent,
    otpVerified: context.otpVerified,

    login,
    register,
    logout,
    sendOTP,
    verifyOTP,
    updateUser: context.updateUser,
    clearError: context.clearError,

    validateLoginForm,
    validateRegisterForm,
  };
};

export default useAuth;
