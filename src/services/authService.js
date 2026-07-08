import { API } from '../constants/config';
import api from './api';

const authService = {
  login: (uniqueId, password) => api.post(API.ENDPOINTS.LOGIN, { uniqueId, password }),

  register: (data) => {
    const payload = {
      name: data.name.trim(),
      parentPhone: data.parentPhone.trim(),
      interhallTicket: data.interhallTicket.trim().toUpperCase(),
      dob: data.dob ? data.dob.toISOString() : null,
      password: data.password,
    };
    return api.post(API.ENDPOINTS.REGISTER, payload);
  },

  logout: () => api.post(API.ENDPOINTS.LOGOUT),

  refreshToken: (refreshToken) => api.post(API.ENDPOINTS.REFRESH_TOKEN, { refreshToken }),

  sendOTP: (phone) => api.post(API.ENDPOINTS.SEND_OTP, { phone }),

  verifyOTP: (phone, otp) => api.post(API.ENDPOINTS.VERIFY_OTP, { phone, otp }),

  changePassword: (oldPassword, newPassword) =>
    api.post('/auth/change-password', { oldPassword, newPassword }),
};

export default authService;
