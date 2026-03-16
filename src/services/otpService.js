import api from './api';
import { API, OTP } from '../constants/config';

const otpService = {

  // ─── Send OTP ────────────────────────────────────────────────────────────────
  sendOTP: async (phone) => {
    if (!phone) throw new Error('Phone number is required.');

    const response = await api.post(API.ENDPOINTS.SEND_OTP, { phone });
    return response;
    // Expected: { message: 'OTP sent', expiresIn: 300, maskedPhone: '**xxxxxx12' }
  },

  // ─── Verify OTP ──────────────────────────────────────────────────────────────
  verifyOTP: async (phone, otp) => {
    if (!phone)                      throw new Error('Phone number is required.');
    if (!otp || otp.length < OTP.LENGTH) throw new Error(`OTP must be ${OTP.LENGTH} digits.`);

    const response = await api.post(API.ENDPOINTS.VERIFY_OTP, { phone, otp });
    return response;
    // Expected: { verified: true, token: '...', message: '...' }
  },

  // ─── Resend OTP ──────────────────────────────────────────────────────────────
  resendOTP: async (phone) => {
    if (!phone) throw new Error('Phone number is required.');

    const response = await api.post('/auth/otp/resend', { phone });
    return response;
    // Expected: { message: 'OTP resent', expiresIn: 300 }
  },

  // ─── Send Email OTP ──────────────────────────────────────────────────────────
  sendEmailOTP: async (email) => {
    if (!email) throw new Error('Email is required.');

    const response = await api.post('/auth/otp/email/send', { email });
    return response;
  },

  // ─── Verify Email OTP ────────────────────────────────────────────────────────
  verifyEmailOTP: async (email, otp) => {
    if (!email) throw new Error('Email is required.');
    if (!otp)   throw new Error('OTP is required.');

    const response = await api.post('/auth/otp/email/verify', { email, otp });
    return response;
  },

  // ─── Check OTP Status ────────────────────────────────────────────────────────
  checkOTPStatus: async (phone) => {
    const response = await api.get(`/auth/otp/status?phone=${encodeURIComponent(phone)}`);
    return response;
    // Expected: { sent: true, expiresAt: '...', attemptsLeft: 3 }
  },

};

export default otpService;