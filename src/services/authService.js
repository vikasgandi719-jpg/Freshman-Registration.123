import api from './api';
import { API } from '../constants/config';

const authService = {

  // ─── Student Login ───────────────────────────────────────────────────────────
  login: async (email, password) => {
    const response = await api.post(API.ENDPOINTS.LOGIN, { email, password });
    return response;
    // Expected: { user: {...}, token: '...' }
  },

  // ─── Student Register ────────────────────────────────────────────────────────
  register: async (data) => {
    const payload = {
      name:        data.name.trim(),
      email:       data.email.trim().toLowerCase(),
      phone:       data.phone.trim(),
      password:    data.password,
      rollNumber:  data.rollNumber.trim().toUpperCase(),
      branch:      data.branch,
      semester:    data.semester,
      dob:         data.dob ? data.dob.toISOString() : null,
    };
    const response = await api.post(API.ENDPOINTS.REGISTER, payload);
    return response;
    // Expected: { message: '...', userId: '...' }
  },

  // ─── Logout ──────────────────────────────────────────────────────────────────
  logout: async () => {
    try {
      await api.post(API.ENDPOINTS.LOGOUT, {});
    } catch (_) {
      // Ignore errors on logout — local session will be cleared anyway
    }
  },

  // ─── Refresh Token ───────────────────────────────────────────────────────────
  refreshToken: async (refreshToken) => {
    const response = await api.post(API.ENDPOINTS.REFRESH_TOKEN, { refreshToken });
    return response;
    // Expected: { token: '...', refreshToken: '...' }
  },

  // ─── Send OTP ────────────────────────────────────────────────────────────────
  sendOTP: async (phone) => {
    const response = await api.post(API.ENDPOINTS.SEND_OTP, { phone });
    return response;
    // Expected: { message: 'OTP sent', expiresIn: 300 }
  },

  // ─── Verify OTP ──────────────────────────────────────────────────────────────
  verifyOTP: async (phone, otp) => {
    const response = await api.post(API.ENDPOINTS.VERIFY_OTP, { phone, otp });
    return response;
    // Expected: { verified: true, token: '...' }
  },

  // ─── Change Password ─────────────────────────────────────────────────────────
  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post(API.ENDPOINTS.CHANGE_PASSWORD, { oldPassword, newPassword });
    return response;
  },

  // ─── Forgot Password ─────────────────────────────────────────────────────────
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  },

  // ─── Reset Password ──────────────────────────────────────────────────────────
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response;
  },

};

export default authService;