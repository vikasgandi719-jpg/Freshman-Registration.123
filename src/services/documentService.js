import { Platform } from "react-native";
import api, { getTokenCache } from "./api";
import { API } from "../constants/config";
import { DOCUMENT_LIST } from "../constants/documents";

const DEMO_MODE = false;

const normalizeDocument = (doc) => {
  const documentId =
    doc.id ||
    doc.document_type ||
    doc.documentType ||
    doc.type;

  const documentType =
    doc.document_type ||
    doc.documentType ||
    doc.type ||
    documentId;

  const base = DOCUMENT_LIST.find(
    (d) => d.id === documentType || d.id === documentId
  );

  return {
    id: documentType || documentId || base?.id,
    type: base?.type || documentType || "document",
    title: doc.title || base?.title || "Document",
    description: doc.description || base?.description || "",
    icon: doc.icon || base?.icon || "📄",
    required:
      typeof doc.required === "boolean"
        ? doc.required
        : (base?.required ?? false),

    status: doc.status || "not_uploaded",

    uploadedAt: doc.uploadedAt || doc.uploaded_at || null,
    updatedAt: doc.updatedAt || doc.updated_at || doc.verified_at || null,

    fileUrl: doc.fileUrl || doc.file_url || null,
    fileUri: doc.fileUri || doc.fileUrl || doc.file_url || null,

    fileType: doc.fileType || doc.file_type || doc.mimeType || null,
    mimeType: doc.mimeType || doc.fileType || doc.file_type || null,

    fileName:
      doc.fileName ||
      doc.file_name ||
      `${base?.title || "Document"}.pdf`,
    fileSize: doc.fileSize || doc.file_size || null,

    rejectionReason: doc.rejectionReason || doc.rejection_reason || null,
  };
};

const mergeWithDocumentList = (docs = []) => {
  const mapped = {};

  docs.forEach((doc) => {
    const normalized = normalizeDocument(doc);
    if (normalized.id) {
      mapped[normalized.id] = normalized;
    }
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

const uploadWeb = async (documentId, formData) => {
  const token = await getTokenCache();

  const response = await fetch(
    `${API.BASE_URL}${API.ENDPOINTS.DOCUMENT_UPLOAD}/${documentId}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    }
  );

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (isJson && (data?.message || data?.error)) ||
      `Upload failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data?.document || data?.data?.document || data?.data || data;
};

const documentService = {
  getDocuments: async (studentId) => {
    if (DEMO_MODE) {
      return DOCUMENT_LIST.map((doc) => ({
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
        fileSize: null,
        rejectionReason: null,
      }));
    }

    const endpoint = studentId
      ? `${API.ENDPOINTS.DOCUMENTS_LIST}?studentId=${studentId}`
      : API.ENDPOINTS.DOCUMENTS_LIST;

    const response = await api.get(endpoint);
    const docs = Array.isArray(response) ? response : response?.data || [];
    return mergeWithDocumentList(docs);
  },

  getDocumentById: async (documentId) => {
    if (DEMO_MODE) {
      const doc = DOCUMENT_LIST.find((d) => d.id === documentId);
      return {
        id: doc?.id || documentId,
        type: doc?.type,
        title: doc?.title || "Document",
        description: doc?.description,
        status: "not_uploaded",
      };
    }

    const response = await api.get(`${API.ENDPOINTS.DOCUMENTS_LIST}/${documentId}`);
    const doc = response?.data || response;
    return normalizeDocument(doc);
  },

  uploadDocument: async (documentId, formData, onProgress) => {
    if (DEMO_MODE) {
      for (let i = 0; i <= 100; i += 20) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (onProgress) onProgress(i);
      }

      const doc = DOCUMENT_LIST.find((d) => d.id === documentId);
      return {
        success: true,
        message: "Document uploaded successfully (Demo)",
        document: {
          id: documentId,
          title: doc?.title || "Document",
          status: "pending",
          uploadedAt: new Date().toISOString(),
          fileUri: "demo://uploaded/file.pdf",
        },
      };
    }

    if (Platform.OS === "web") {
      return uploadWeb(documentId, formData);
    }

    if (onProgress) {
      const token = await getTokenCache();

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
          `${API.BASE_URL}${API.ENDPOINTS.DOCUMENT_UPLOAD}/${documentId}`
        );
        xhr.setRequestHeader("Accept", "application/json");

        if (token) {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        }

        xhr.send(formData);
      });
    }

    const response = await api.upload(
      `${API.ENDPOINTS.DOCUMENT_UPLOAD}/${documentId}`,
      formData
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

  getAllDocumentStatuses: async (studentId) => {
    const endpoint = studentId
      ? `${API.ENDPOINTS.DOCUMENT_STATUS}?studentId=${studentId}`
      : API.ENDPOINTS.DOCUMENT_STATUS;

    const response = await api.get(endpoint);
    return response?.data || response;
  },
};

export default documentService;