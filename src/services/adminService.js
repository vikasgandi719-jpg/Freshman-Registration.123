import { adminApi } from './api';
import { API, STORAGE_KEYS } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalizeDocument } from './documentService';

// Backend rows are snake_case; map to the camelCase shape screens expect.
const mapStudentRow = (row) => {
  if (!row) return row;
  return {
    id: row.id,
    uniqueId: row.unique_id,
    name: row.name,
    firstName: row.first_name || '',
    lastName: row.last_name || '',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    parentPhone: row.parent_phone,
    interhallTicket: row.interhall_ticket,
    dob: row.dob,
    branchCode: row.branch_code,
    branch: row.branch_code,
    verificationStatus: row.verification_status,
    rejectionReason: row.rejection_reason,
    fatherName: row.father_name || '',
    fatherPhone: row.father_phone || '',
    motherName: row.mother_name || '',
    motherPhone: row.mother_phone || '',
    emacetHallTicket: row.emacet_hall_ticket || '',
    emacetRank: row.emacet_rank || '',
    createdAt: row.created_at,
    documents: Array.isArray(row.documents) ? row.documents.map(normalizeDocument) : undefined,
  };
};

const mapBranch = (row) => row && ({
  id: row.id,
  name: row.name,
  code: row.code,
  seats: row.seats,
  intake: row.intake,
  hodName: row.hod_name,
});

const adminService = {
  adminLogin: async (email, password) => {
    const response = await adminApi.post(API.ENDPOINTS.ADMIN_LOGIN, { email, password });
    if (response.token) await AsyncStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, response.token);
    return response;
  },

  getStudents: async ({ page = 1, limit = 20, branch = null, status = null, search = '' } = {}) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (branch) params.append('branch', branch);
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const response = await adminApi.get(`${API.ENDPOINTS.ADMIN_STUDENTS}?${params.toString()}`);
    return {
      data: (response.data || []).map(mapStudentRow),
      total: response.total,
      totalPages: response.totalPages,
      page: response.page,
    };
  },

  getStudentById: async (studentId) => {
    const response = await adminApi.get(`${API.ENDPOINTS.ADMIN_STUDENTS}/${studentId}`);
    return mapStudentRow(response?.data || response);
  },

  verifyStudent: (studentId) => adminApi.post(`${API.ENDPOINTS.ADMIN_VERIFY}/${studentId}`),

  rejectStudent: (studentId, reason) =>
    adminApi.post(`${API.ENDPOINTS.ADMIN_REJECT}/${studentId}`, { reason }),

  resetStudentStatus: (studentId) =>
    adminApi.patch(`${API.ENDPOINTS.ADMIN_STUDENTS}/${studentId}/reset`),

  getStats: async () => {
    const response = await adminApi.get(API.ENDPOINTS.ADMIN_STATS);
    const s = response?.data || response || {};
    return {
      totalStudents: Number(s.totalStudents) || 0,
      approved: Number(s.approved) || 0,
      pending: Number(s.pending) || 0,
      rejected: Number(s.rejected) || 0,
      incomplete: Number(s.incomplete) || 0,
      totalTrend: s.totalTrend,
      approvedTrend: s.approvedTrend,
    };
  },

  getBranches: async () => {
    const response = await adminApi.get(API.ENDPOINTS.ADMIN_BRANCHES);
    return (response?.data || response || []).map(mapBranch);
  },

  updateBranch: async (branchId, data) => {
    const response = await adminApi.put(`${API.ENDPOINTS.ADMIN_BRANCHES}/${branchId}`, data);
    return mapBranch(response?.data || response);
  },

  verifyDocument: (documentId) => adminApi.post(`/admin/documents/${documentId}/verify`, {}),

  rejectDocument: (documentId, reason) =>
    adminApi.post(`/admin/documents/${documentId}/reject`, { reason }),

  exportStudentData: (filters = {}) => adminApi.post('/admin/export', filters),
};

export default adminService;
