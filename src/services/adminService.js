import api from './api';
import { API } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';

const adminService = {

  // ─── Admin Login ─────────────────────────────────────────────────────────────
  adminLogin: async (email, password) => {
    const response = await api.post(API.ENDPOINTS.ADMIN_LOGIN, { email, password });
    // Save admin token separately if needed
    if (response.token) {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
    }
    return response;
    // Expected: { admin: {...}, token: '...' }
  },

  // ─── Get All Students ─────────────────────────────────────────────────────────
  getStudents: async ({ page = 1, limit = 20, branch = null, status = null, search = '' } = {}) => {
    const params = new URLSearchParams();
    params.append('page',  page);
    params.append('limit', limit);
    if (branch) params.append('branch', branch);
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const response = await api.get(`${API.ENDPOINTS.ADMIN_STUDENTS}?${params.toString()}`);
    return response;
    // Expected: { data: [...], total, totalPages, page }
  },

  // ─── Get Student by ID ───────────────────────────────────────────────────────
  getStudentById: async (studentId) => {
    const response = await api.get(`${API.ENDPOINTS.ADMIN_STUDENTS}/${studentId}`);
    return response;
  },

  // ─── Verify Student ──────────────────────────────────────────────────────────
  verifyStudent: async (studentId) => {
    const response = await api.post(`${API.ENDPOINTS.ADMIN_VERIFY}/${studentId}`, {
      action: 'approve',
    });
    return response;
    // Expected: { success: true, message: '...' }
  },

  // ─── Reject Student ──────────────────────────────────────────────────────────
  rejectStudent: async (studentId, reason) => {
    const response = await api.post(`${API.ENDPOINTS.ADMIN_REJECT}/${studentId}`, {
      action: 'reject',
      reason,
    });
    return response;
  },

  // ─── Reset Student Status ────────────────────────────────────────────────────
  resetStudentStatus: async (studentId) => {
    const response = await api.patch(`${API.ENDPOINTS.ADMIN_STUDENTS}/${studentId}/reset`, {
      status: 'pending',
    });
    return response;
  },

  // ─── Get Stats ───────────────────────────────────────────────────────────────
  getStats: async () => {
    const response = await api.get(API.ENDPOINTS.ADMIN_STATS);
    return response;
    // Expected: { totalStudents, approved, pending, rejected, incomplete, totalTrend, approvedTrend }
  },

  // ─── Get Branches ────────────────────────────────────────────────────────────
  getBranches: async () => {
    const response = await api.get(API.ENDPOINTS.ADMIN_BRANCHES);
    return response;
    // Expected: Array<{ id, name, code, studentCount, active }>
  },

  // ─── Update Branch ───────────────────────────────────────────────────────────
  updateBranch: async (branchId, data) => {
    const response = await api.put(`${API.ENDPOINTS.ADMIN_BRANCHES}/${branchId}`, data);
    return response;
  },

  // ─── Verify Document ─────────────────────────────────────────────────────────
  verifyDocument: async (documentId) => {
    const response = await api.post(`/admin/documents/${documentId}/verify`, {});
    return response;
  },

  // ─── Reject Document ─────────────────────────────────────────────────────────
  rejectDocument: async (documentId, reason) => {
    const response = await api.post(`/admin/documents/${documentId}/reject`, { reason });
    return response;
  },

  // ─── Export Data ─────────────────────────────────────────────────────────────
  exportStudentData: async (filters = {}) => {
    const response = await api.post('/admin/export', filters);
    return response;
    // Expected: { downloadUrl: '...' }
  },

};

export default adminService;