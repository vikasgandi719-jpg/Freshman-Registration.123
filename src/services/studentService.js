import api from './api';
import { API } from '../constants/config';

const studentService = {

  // ─── Get Profile ─────────────────────────────────────────────────────────────
  getProfile: async () => {
    const response = await api.get(API.ENDPOINTS.STUDENT_PROFILE);
    return response;
    // Expected: { id, name, email, phone, rollNumber, branch, semester, photoUri, verificationStatus, ... }
  },

  // ─── Update Profile ──────────────────────────────────────────────────────────
  updateProfile: async (data) => {
    const payload = {};
    if (data.name    !== undefined) payload.name  = data.name.trim();
    if (data.phone   !== undefined) payload.phone = data.phone.trim();
    if (data.email   !== undefined) payload.email = data.email.trim().toLowerCase();
    if (data.semester!== undefined) payload.semester = data.semester;

    const response = await api.put(API.ENDPOINTS.STUDENT_UPDATE, payload);
    return response;
  },

  // ─── Upload Profile Photo ────────────────────────────────────────────────────
  uploadPhoto: async (formData) => {
    const response = await api.upload(API.ENDPOINTS.STUDENT_PHOTO, formData);
    return response;
    // Expected: { photoUri: '...' }
  },

  // ─── Get Student by ID (admin use) ───────────────────────────────────────────
  getStudentById: async (studentId) => {
    const response = await api.get(`${API.ENDPOINTS.STUDENTById}/${studentId}`);
    return response;
  },

  // ─── Get Verification Status ─────────────────────────────────────────────────
  getVerificationStatus: async () => {
    const response = await api.get('/student/verification-status');
    return response;
    // Expected: { status: 'pending' | 'approved' | 'rejected', rejectionReason: '...' }
  },

  // ─── Get Document Summary ────────────────────────────────────────────────────
  getDocumentSummary: async () => {
    const response = await api.get('/student/document-summary');
    return response;
    // Expected: { total, approved, pending, rejected, notUploaded }
  },

};

export default studentService;