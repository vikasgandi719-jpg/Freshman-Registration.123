import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../constants/config';
import { addDemoStudent } from './adminService';  // one-way import, no circular dep

const DEMO_MODE = true;

let storedUserData = null;
let studentCounter = 1;

const authService = {
  login: async (uniqueId, password) => {
    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 1000));
      if (!uniqueId || !password) throw new Error('Please enter Unique ID and Password');
      const userData = storedUserData || {
        name: 'Student', firstName: 'Student', lastName: '',
        parentPhone: '9876543210', interhallTicket: 'IHT001', dob: '2008-01-15',
      };
      return {
        user: {
          id: '1', uniqueId: uniqueId.toUpperCase(),
          name:            userData.name      || 'Student',
          firstName:       userData.firstName || 'Student',
          lastName:        userData.lastName  || '',
          parentPhone:     userData.parentPhone,
          interhallTicket: userData.interhallTicket,
          dob:             userData.dob,
        },
        token: 'demo_token_' + Date.now(),
      };
    }
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.LOGIN}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uniqueId, password }),
    });
    if (!response.ok) { const err = await response.json().catch(() => ({})); throw new Error(err.message || 'Login failed'); }
    return response.json();
  },

  register: async (data) => {
    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 1000));
      const stored = await AsyncStorage.getItem('@student_counter');
      studentCounter = stored ? parseInt(stored) + 1 : 1;
      await AsyncStorage.setItem('@student_counter', String(studentCounter));
      const nameParts = (data.name || '').trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName  = nameParts.slice(1).join(' ') || '';
      const uniqueId  = `2026-BVRITN-1a-${String(studentCounter).padStart(4, '0')}`;
      const userId    = 'user_' + Date.now();
      storedUserData = {
        name: data.name, firstName, lastName,
        parentPhone: data.parentPhone, interhallTicket: data.interhallTicket,
        dob: data.dob ? data.dob.toISOString().split('T')[0] : null,
      };
      // Write to shared store so admin sees this student
      addDemoStudent({
        userId, uniqueId, name: data.name, firstName, lastName,
        parentPhone: data.parentPhone,
        interhallTicket: data.interhallTicket?.trim().toUpperCase(),
        dob: storedUserData.dob,
      });
      studentCounter++;
      return { message: 'Registration successful (Demo Mode)', uniqueId, userId, name: data.name, firstName, lastName };
    }
    const payload = {
      name: data.name.trim(), parentPhone: data.parentPhone.trim(),
      interhallTicket: data.interhallTicket.trim().toUpperCase(),
      dob: data.dob ? data.dob.toISOString() : null, password: data.password,
    };
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.REGISTER}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) { const err = await response.json().catch(() => ({})); throw new Error(err.message || 'Registration failed'); }
    return response.json();
  },

  logout: async () => {
    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 300));
      storedUserData = null; studentCounter = 1;
      return { message: 'Logged out (Demo Mode)' };
    }
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.LOGOUT}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },

  refreshToken: async (refreshToken) => {
    if (DEMO_MODE) return { token: 'demo_token_' + Date.now(), refreshToken };
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.REFRESH_TOKEN}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    return response.json();
  },

  sendOTP: async (phone) => {
    if (DEMO_MODE) return { message: 'OTP sent (Demo Mode)', expiresIn: 300 };
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.SEND_OTP}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    return response.json();
  },

  verifyOTP: async (phone, otp) => {
    if (DEMO_MODE) {
      if (otp === '123456' || otp === '000000') return { verified: true, token: 'demo_otp_token_' + Date.now() };
      throw new Error('Invalid OTP');
    }
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.VERIFY_OTP}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });
    return response.json();
  },

  changePassword: async (oldPassword, newPassword) => {
    if (DEMO_MODE) return { message: 'Password changed (Demo Mode)' };
    const response = await fetch(`${API.BASE_URL}/auth/change-password`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    return response.json();
  },

  forgotPassword: async (uniqueId) => {
    if (DEMO_MODE) return { message: 'Password reset link sent (Demo Mode)' };
    const response = await fetch(`${API.BASE_URL}/auth/forgot-password`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uniqueId }),
    });
    return response.json();
  },

  resetPassword: async (token, newPassword) => {
    if (DEMO_MODE) return { message: 'Password reset (Demo Mode)' };
    const response = await fetch(`${API.BASE_URL}/auth/reset-password`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    return response.json();
  },
};

export default authService;