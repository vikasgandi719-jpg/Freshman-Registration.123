import api from "./api";
import { API, STORAGE_KEYS } from "../constants/config";
import { DOCUMENT_LIST } from "../constants/documents";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Backend document rows are snake_case; the rest of the app expects the
// camelCase shape the old demo mode produced. Exported so adminService can
// reuse it for the documents nested inside a student detail response.
export const normalizeDocument = (doc) => {
  const documentId = doc.id || doc.document_type || doc.documentType || doc.type;
  const documentType = doc.document_type || doc.documentType || doc.type || documentId;

  const base = DOCUMENT_LIST.find(
    (d) => d.id === documentType || d.id === documentId,
  );

  return {
    id: documentType || documentId || base?.id,
    dbId: doc.id !== documentType ? doc.id : undefined, // real row UUID, for admin verify/reject calls
    type: base?.type || documentType || "document",
    title: doc.title || base?.title || "Document",
    description: doc.description || base?.description || "",
    icon: doc.icon || base?.icon || "📄",
    required:
      typeof doc.required === "boolean" ? doc.required : (base?.required ?? false),
    status: doc.status || "not_uploaded",
    uploadedAt: doc.uploadedAt || doc.uploaded_at || null,
    updatedAt: doc.updatedAt || doc.updated_at || doc.verified_at || null,
    fileUrl: doc.fileUrl || doc.file_url || null,
    fileUri: doc.fileUri || doc.fileUrl || doc.file_url || null,
    fileType: doc.fileType || doc.file_type || doc.mimeType || null,
    mimeType: doc.mimeType || doc.fileType || doc.file_type || null,
    fileName: doc.fileName || doc.file_name || `${base?.title || "Document"}.pdf`,
    fileSize: doc.fileSize || doc.file_size || null,
    rejectionReason: doc.rejectionReason || doc.rejection_reason || null,
  };
};

const mergeWithDocumentList = (docs = []) => {
  const mapped = {};
  docs.forEach((doc) => {
    const normalized = normalizeDocument(doc);
    if (normalized.id) mapped[normalized.id] = normalized;
  });

  return DOCUMENT_LIST.map((doc) => {
    const uploaded = mapped[doc.id];
    if (uploaded) {
      return {
        ...doc,
        ...uploaded,
        id: doc.id,
        type: doc.type,
        title: doc.title,
        description: doc.description,
        icon: doc.icon,
        required: doc.required,
      };
    }
    return {
      id: doc.id,
      type: doc.type,
      title: doc.title,
      description: doc.description,
      icon: doc.icon,
      required: doc.required,
      status: "not_uploaded",
      uploadedAt: null,
      updatedAt: null,
      fileUri: null,
      fileUrl: null,
      fileType: null,
      mimeType: null,
      fileName: null,
      fileSize: null,
      rejectionReason: null,
    };
  });
};

const documentService = {
  // studentId is accepted for API-signature compatibility with existing
  // callers, but the backend always scopes this route to the caller's own
  // token — it's not usable to look up another student's documents.
  getDocuments: async () => {
    const response = await api.get(API.ENDPOINTS.DOCUMENTS_LIST);
    const docs = Array.isArray(response) ? response : response?.data || [];
    return mergeWithDocumentList(docs);
  },

  getDocumentById: async (documentId) => {
    const response = await api.get(`${API.ENDPOINTS.DOCUMENTS_LIST}/${documentId}`);
    const doc = response?.data || response;
    return normalizeDocument(doc);
  },

  uploadDocument: async (documentId, formData, onProgress) => {
    if (onProgress) {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            onProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(data.document || data.data?.document || data.data || data);
            } else {
              reject(new Error(data?.message || "Upload failed."));
            }
          } catch {
            reject(new Error("Invalid server response."));
          }
        };
        xhr.onerror = () => reject(new Error("Network error during upload."));
        xhr.open(
          "POST",
          `${API.BASE_URL}${API.ENDPOINTS.DOCUMENT_UPLOAD}/${documentId}`,
        );
        xhr.setRequestHeader("Accept", "application/json");
        if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(formData);
      });
    }

    const response = await api.upload(
      `${API.ENDPOINTS.DOCUMENT_UPLOAD}/${documentId}`,
      formData,
    );
    return response?.document || response?.data?.document || response?.data || response;
  },

  deleteDocument: async (documentId) => {
    const response = await api.delete(`${API.ENDPOINTS.DOCUMENTS_LIST}/${documentId}`);
    return response?.data || response;
  },

  getDocumentStatus: async (documentId) => {
    const response = await api.get(`${API.ENDPOINTS.DOCUMENT_STATUS}/${documentId}`);
    return response?.data || response;
  },

  getAllDocumentStatuses: async () => {
    const docs = await documentService.getDocuments();
    return docs.map((d) => ({ id: d.id, status: d.status, rejectionReason: d.rejectionReason }));
  },
};

export default documentService;
