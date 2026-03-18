import api from "./api";
import { API } from "../constants/config";
import { DOCUMENT_LIST } from "../constants/documents";

const DEMO_MODE = true;

const documentService = {
  getDocuments: async (studentId) => {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      return DOCUMENT_LIST.map((doc) => ({
        id: doc.id,
        type: doc.type,
        title: doc.title,
        description: doc.description,
        icon: doc.icon,
        required: doc.required,
        status: "not_uploaded",
        uploadedAt: null,
        fileUri: null,
        fileType: null,
        fileSize: null,
        rejectionReason: null,
      }));
    }

    const endpoint = studentId
      ? `${API.ENDPOINTS.DOCUMENTS_LIST}?studentId=${studentId}`
      : API.ENDPOINTS.DOCUMENTS_LIST;
    const response = await api.get(endpoint);
    return response;
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

    const response = await api.get(
      `${API.ENDPOINTS.DOCUMENTS_LIST}/${documentId}`,
    );
    return response;
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
        xhr.send(formData);
      });
    }

    const response = await api.upload(
      `${API.ENDPOINTS.DOCUMENT_UPLOAD}/${documentId}`,
      formData,
    );
    return response;
  },

  deleteDocument: async (documentId) => {
    if (DEMO_MODE) {
      return { success: true, message: "Document deleted (Demo)" };
    }

    const response = await api.delete(
      `${API.ENDPOINTS.DOCUMENTS_LIST}/${documentId}`,
    );
    return response;
  },

  getDocumentStatus: async (documentId) => {
    if (DEMO_MODE) {
      return { status: "pending", message: "Under review (Demo)" };
    }

    const response = await api.get(
      `${API.ENDPOINTS.DOCUMENT_STATUS}/${documentId}`,
    );
    return response;
  },

  getAllDocumentStatuses: async (studentId) => {
    if (DEMO_MODE) {
      return DOCUMENT_LIST.map((doc) => ({
        id: doc.id,
        status: "pending",
      }));
    }

    const endpoint = studentId
      ? `${API.ENDPOINTS.DOCUMENT_STATUS}?studentId=${studentId}`
      : API.ENDPOINTS.DOCUMENT_STATUS;
    const response = await api.get(endpoint);
    return response;
  },
};

export default documentService;
