import api from './api';
import { API } from '../constants/config';

const documentService = {

  // ─── Get All Documents for Student ───────────────────────────────────────────
  getDocuments: async (studentId) => {
    const endpoint = studentId
      ? `${API.ENDPOINTS.DOCUMENTS_LIST}?studentId=${studentId}`
      : API.ENDPOINTS.DOCUMENTS_LIST;
    const response = await api.get(endpoint);
    return response;
    // Expected: Array<{ id, title, description, status, uploadedAt, fileUri, fileType, fileSize, rejectionReason }>
  },

  // ─── Get Single Document ─────────────────────────────────────────────────────
  getDocumentById: async (documentId) => {
    const response = await api.get(`${API.ENDPOINTS.DOCUMENTS_LIST}/${documentId}`);
    return response;
  },

  // ─── Upload Document ─────────────────────────────────────────────────────────
  uploadDocument: async (documentId, formData, onProgress) => {
    // Note: progress tracking requires XMLHttpRequest (fetch doesn't support it natively)
    if (onProgress) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };

        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(data);
            } else {
              reject(new Error(data?.message || 'Upload failed.'));
            }
          } catch {
            reject(new Error('Invalid server response.'));
          }
        };

        xhr.onerror = () => reject(new Error('Network error during upload.'));

        xhr.open('POST', `${API.BASE_URL}${API.ENDPOINTS.DOCUMENT_UPLOAD}/${documentId}`);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send(formData);
      });
    }

    // Fallback without progress
    const response = await api.upload(`${API.ENDPOINTS.DOCUMENT_UPLOAD}/${documentId}`, formData);
    return response;
  },

  // ─── Delete Document ─────────────────────────────────────────────────────────
  deleteDocument: async (documentId) => {
    const response = await api.delete(`${API.ENDPOINTS.DOCUMENTS_LIST}/${documentId}`);
    return response;
  },

  // ─── Get Document Status ─────────────────────────────────────────────────────
  getDocumentStatus: async (documentId) => {
    const response = await api.get(`${API.ENDPOINTS.DOCUMENT_STATUS}/${documentId}`);
    return response;
    // Expected: { status: 'pending' | 'approved' | 'rejected', rejectionReason: '...' }
  },

  // ─── Get All Document Statuses ───────────────────────────────────────────────
  getAllDocumentStatuses: async (studentId) => {
    const endpoint = studentId
      ? `${API.ENDPOINTS.DOCUMENT_STATUS}?studentId=${studentId}`
      : API.ENDPOINTS.DOCUMENT_STATUS;
    const response = await api.get(endpoint);
    return response;
  },

};

export default documentService;