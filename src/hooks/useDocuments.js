import { useState, useCallback } from 'react';
import { useStudent } from '../context/StudentContext';
import documentService from '../services/documentService';

const useDocuments = () => {
  const context = useStudent();
  const [uploading, setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // ─── Fetch Documents ─────────────────────────────────────────────────────────
  const fetchDocuments = useCallback(async (studentId) => {
    if (!studentId) return;
    context.setLoading(true);
    context.clearError();
    try {
      const docs = await documentService.getDocuments(studentId);
      context.setDocuments(docs);
      return { success: true, data: docs };
    } catch (error) {
      const msg = error?.message || 'Failed to fetch documents.';
      context.setError(msg);
      return { success: false, error: msg };
    }
  }, [context]);

  // ─── Upload Document ─────────────────────────────────────────────────────────
  const uploadDocument = useCallback(async (documentId, fileUri, fileType, fileName) => {
    if (!documentId || !fileUri) {
      return { success: false, error: 'Invalid document or file.' };
    }

    setUploading(true);
    setUploadError(null);
    context.setUploadStatus(documentId, 'uploading');
    context.setUploadProgress(documentId, 0);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri:  fileUri,
        type: fileType || 'application/pdf',
        name: fileName || 'document',
      });
      formData.append('documentId', String(documentId));

      const response = await documentService.uploadDocument(
        documentId,
        formData,
        (progress) => context.setUploadProgress(documentId, progress)
      );

      context.setUploadProgress(documentId, 100);
      context.setUploadStatus(documentId, 'done');
      context.updateDocument({ id: documentId, status: 'pending', fileUri, uploadedAt: new Date().toISOString() });

      return { success: true, data: response };
    } catch (error) {
      const msg = error?.message || 'Upload failed. Please try again.';
      setUploadError(msg);
      context.setUploadStatus(documentId, 'error');
      return { success: false, error: msg };
    } finally {
      setUploading(false);
    }
  }, [context]);

  // ─── Get Document by ID ──────────────────────────────────────────────────────
  const getDocumentById = useCallback((documentId) => {
    return context.documents.find((d) => d.id === documentId) || null;
  }, [context.documents]);

  // ─── Get Documents by Status ─────────────────────────────────────────────────
  const getDocumentsByStatus = useCallback((status) => {
    return context.documents.filter((d) => d.status === status);
  }, [context.documents]);

  // ─── Get Upload Progress ─────────────────────────────────────────────────────
  const getUploadProgress = useCallback((documentId) => {
    return context.uploadProgress[documentId] || 0;
  }, [context.uploadProgress]);

  const getUploadStatus = useCallback((documentId) => {
    return context.uploadStatus[documentId] || 'idle';
  }, [context.uploadStatus]);

  // ─── Refresh Single Document ─────────────────────────────────────────────────
  const refreshDocument = useCallback(async (documentId) => {
    try {
      const doc = await documentService.getDocumentById(documentId);
      context.updateDocument(doc);
      return { success: true, data: doc };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  }, [context]);

  return {
    // State
    documents:       context.documents,
    isLoading:       context.isLoading,
    error:           context.error,
    uploading,
    uploadError,
    documentStats:   context.documentStats,
    pendingDocuments:context.pendingDocuments,

    // Actions
    fetchDocuments,
    uploadDocument,
    refreshDocument,

    // Helpers
    getDocumentById,
    getDocumentsByStatus,
    getUploadProgress,
    getUploadStatus,
    clearError: context.clearError,
  };
};

export default useDocuments;