import api from './api';
import { API } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';

// ─── Demo Mode Config ─────────────────────────────────────────────────────────
const ADMIN_DEMO_MODE = true;
const DEMO_ADMIN_EMAIL = "admin@bvritn.ac.in";
const DEMO_ADMIN_PASSWORD = "admin@123";

const adminService = {

  // ─── Admin Login ─────────────────────────────────────────────────────────────
  adminLogin: async (email, password) => {

    if (ADMIN_DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!email || !password) {
        throw new Error("Please enter email and password");
      }
      if (
        email.trim().toLowerCase() !== DEMO_ADMIN_EMAIL ||
        password !== DEMO_ADMIN_PASSWORD
      ) {
        throw new Error("Invalid admin credentials");
      }

      return {
        admin: {
          id: "admin_001",
          name: "Super Admin",
          email: DEMO_ADMIN_EMAIL,
          role: "Super Admin",
        },
        token: "demo_admin_token_" + Date.now(),
      };
    }

    // ── Real API (used when ADMIN_DEMO_MODE = false) ──
    const response = await api.post(API.ENDPOINTS.ADMIN_LOGIN, { email, password });
    if (response.token) {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
    }
    return response;
  },

  // ─── Get All Students ─────────────────────────────────────────────────────────
  getStudents: async ({ page = 1, limit = 20, branch = null, status = null, search = '' } = {}) => {
    if (ADMIN_DEMO_MODE) {
      return { data: [], total: 0, totalPages: 1, page: 1 };
    }
    const params = new URLSearchParams();
    params.append('page',  page);
    params.append('limit', limit);
    if (branch) params.append('branch', branch);
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    return await api.get(`${API.ENDPOINTS.ADMIN_STUDENTS}?${params.toString()}`);
  },

  // ─── Get Student by ID ───────────────────────────────────────────────────────
  getStudentById: async (studentId) => {
    if (ADMIN_DEMO_MODE) return { id: studentId, name: 'Demo Student' };
    return await api.get(`${API.ENDPOINTS.ADMIN_STUDENTS}/${studentId}`);
  },

  // ─── Verify Student ──────────────────────────────────────────────────────────
  verifyStudent: async (studentId) => {
    if (ADMIN_DEMO_MODE) return { success: true, message: 'Verified (Demo)' };
    return await api.post(`${API.ENDPOINTS.ADMIN_VERIFY}/${studentId}`, { action: 'approve' });
  },

  // ─── Reject Student ──────────────────────────────────────────────────────────
  rejectStudent: async (studentId, reason) => {
    if (ADMIN_DEMO_MODE) return { success: true, message: 'Rejected (Demo)' };
    return await api.post(`${API.ENDPOINTS.ADMIN_REJECT}/${studentId}`, { action: 'reject', reason });
  },

  // ─── Reset Student Status ────────────────────────────────────────────────────
  resetStudentStatus: async (studentId) => {
    if (ADMIN_DEMO_MODE) return { success: true };
    return await api.patch(`${API.ENDPOINTS.ADMIN_STUDENTS}/${studentId}/reset`, { status: 'pending' });
  },

  // ─── Get Stats ───────────────────────────────────────────────────────────────
  getStats: async () => {
    if (ADMIN_DEMO_MODE) {
      return {
        totalStudents: 0, approved: 0, pending: 0,
        rejected: 0, incomplete: 0, totalTrend: 0, approvedTrend: 0,
      };
    }
    return await api.get(API.ENDPOINTS.ADMIN_STATS);
  },

  // ─── Get Branches ────────────────────────────────────────────────────────────
  getBranches: async () => {
    if (ADMIN_DEMO_MODE) return [];
    return await api.get(API.ENDPOINTS.ADMIN_BRANCHES);
  },

  // ─── Update Branch ───────────────────────────────────────────────────────────
  updateBranch: async (branchId, data) => {
    if (ADMIN_DEMO_MODE) return { success: true };
    return await api.put(`${API.ENDPOINTS.ADMIN_BRANCHES}/${branchId}`, data);
  },

  // ─── Verify Document ─────────────────────────────────────────────────────────
  verifyDocument: async (documentId) => {
    if (ADMIN_DEMO_MODE) return { success: true };
    return await api.post(`/admin/documents/${documentId}/verify`, {});
  },

  // ─── Reject Document ─────────────────────────────────────────────────────────
  rejectDocument: async (documentId, reason) => {
    if (ADMIN_DEMO_MODE) return { success: true };
    return await api.post(`/admin/documents/${documentId}/reject`, { reason });
  },

  // ─── Export Data ─────────────────────────────────────────────────────────────
  exportStudentData: async (filters = {}) => {
    if (ADMIN_DEMO_MODE) return { downloadUrl: '' };
    return await api.post('/admin/export', filters);
  },

};

export default adminService;