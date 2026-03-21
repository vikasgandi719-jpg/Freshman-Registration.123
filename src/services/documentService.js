import api from "./api";
import { API } from "../constants/config";
import { DOCUMENT_LIST } from "../constants/documents";

const DEMO_MODE = true;

// ─── FIX: Persistent in-memory store for demo uploads ─────────────────────────
// This map survives re-renders and re-fetches within the same app session.
// Key: document id (e.g. "passport_photo"), Value: uploaded document object
const demoUploadedDocs = new Map();

const documentService = {
  getDocuments: async (studentId) => {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // ── FIX: Merge the static list with any docs already uploaded in this session
      return DOCUMENT_LIST.map((doc) => {
        // If the user already uploaded this doc, return the saved state
        if (demoUploadedDocs.has(doc.id)) {
          return demoUploadedDocs.get(doc.id);
        }
        // Otherwise return the default not_uploaded state
        return {
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
        };
      });
    }

    const endpoint = studentId
      ? `${API.ENDPOINTS.DOCUMENTS_LIST}?studentId=${studentId}`
      : API.ENDPOINTS.DOCUMENTS_LIST;
    const response = await api.get(endpoint);
    return response;
  },

  getDocumentById: async (documentId) => {
    if (DEMO_MODE) {
      // ── FIX: Return uploaded state if available
      if (demoUploadedDocs.has(documentId)) {
        return demoUploadedDocs.get(documentId);
      }
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
      `${API.ENDPOINTS.DOCUMENTS_LIST}/${documentId}`
    );
    return response;
  },

  uploadDocument: async (documentId, formData, onProgress) => {
    if (DEMO_MODE) {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 20) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (onProgress) onProgress(i);
      }

      const doc = DOCUMENT_LIST.find((d) => d.id === documentId);

      // ── FIX: Extract the actual file URI from FormData so we can display it
      let fileUri = null;
      let fileType = null;
      let fileName = null;
      try {
        // React Native FormData stores entries differently
        const fileEntry = formData._parts?.find(([key]) => key === "file");
        if (fileEntry) {
          fileUri  = fileEntry[1]?.uri  || null;
          fileType = fileEntry[1]?.type || null;
          fileName = fileEntry[1]?.name || null;
        }
      } catch (e) {
        // fallback — won't show preview but upload still registers
      }

      // ── FIX: Save uploaded doc to the persistent in-memory store
      const uploadedDoc = {
        id: documentId,
        type: doc?.type,
        title: doc?.title || "Document",
        description: doc?.description,
        icon: doc?.icon,
        required: doc?.required,
        status: "pending",
        uploadedAt: new Date().toISOString(),
        fileUri: fileUri,
        fileType: fileType,
        fileName: fileName,
        fileSize: null,
        rejectionReason: null,
      };
      demoUploadedDocs.set(documentId, uploadedDoc);

      return {
        success: true,
        message: "Document uploaded successfully (Demo)",
        document: uploadedDoc,
      };
    }

    // ── Real API ──────────────────────────────────────────────────────────────
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
          `${API.BASE_URL}${API.ENDPOINTS.DOCUMENT_UPLOAD}/${documentId}`
        );
        xhr.setRequestHeader("Accept", "application/json");
        xhr.send(formData);
      });
    }

    const response = await api.upload(
      `${API.ENDPOINTS.DOCUMENT_UPLOAD}/${documentId}`,
      formData
    );
    return response;
  },

  deleteDocument: async (documentId) => {
    if (DEMO_MODE) {
      // ── FIX: Remove from persistent store so it resets to not_uploaded
      demoUploadedDocs.delete(documentId);
      return { success: true, message: "Document deleted (Demo)" };
    }

    const response = await api.delete(
      `${API.ENDPOINTS.DOCUMENTS_LIST}/${documentId}`
    );
    return response;
  },

  getDocumentStatus: async (documentId) => {
    if (DEMO_MODE) {
      // ── FIX: Return real status from store if uploaded
      if (demoUploadedDocs.has(documentId)) {
        const doc = demoUploadedDocs.get(documentId);
        return { status: doc.status, message: "Under review (Demo)" };
      }
      return { status: "not_uploaded", message: "Not uploaded yet (Demo)" };
    }

    const response = await api.get(
      `${API.ENDPOINTS.DOCUMENT_STATUS}/${documentId}`
    );
    return response;
  },

  getAllDocumentStatuses: async (studentId) => {
    if (DEMO_MODE) {
      return DOCUMENT_LIST.map((doc) => ({
        id: doc.id,
        status: demoUploadedDocs.has(doc.id)
          ? demoUploadedDocs.get(doc.id).status
          : "not_uploaded",
      }));
    }

    const endpoint = studentId
      ? `${API.ENDPOINTS.DOCUMENT_STATUS}?studentId=${studentId}`
      : API.ENDPOINTS.DOCUMENT_STATUS;
    const response = await api.get(endpoint);
    return response;
  },

  // ── Helper: reset demo state (call on logout) ────────────────────────────────
  resetDemoState: () => {
    demoUploadedDocs.clear();
  },
};

export default documentService;