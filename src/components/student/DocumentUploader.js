import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const DocumentUploader = ({
  documentTitle = 'Document',
  documentId,
  allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'],
  maxSizeMB = 5,
  onUploadSuccess,
  onUploadError,
  existingFileUri = null,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading]       = useState(false);
  const [uploadDone, setUploadDone]     = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: allowedTypes, copyToCacheDirectory: true });
      if (result.canceled) return;
      const file = result.assets?.[0] || result;
      if (file.size && file.size > maxSizeMB * 1024 * 1024) {
        Alert.alert('File Too Large', `Max size is ${maxSizeMB}MB.`);
        return;
      }
      setSelectedFile(file);
      setUploadDone(false);
    } catch (error) {
      Alert.alert('Error', 'Could not pick document.');
      onUploadError && onUploadError(error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // replace with real API
      setUploadDone(true);
      onUploadSuccess && onUploadSuccess({ ...selectedFile, documentId });
    } catch (error) {
      Alert.alert('Upload Failed', 'Please try again.');
      onUploadError && onUploadError(error);
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (mimeType) => {
    if (!mimeType) return '📄';
    if (mimeType.includes('pdf')) return '📕';
    if (mimeType.includes('image')) return '🖼️';
    return '📄';
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{documentTitle}</Text>
        <Text style={styles.subtitle}>Accepted: PDF, JPG, PNG · Max {maxSizeMB}MB</Text>
      </View>

      {!selectedFile ? (
        <TouchableOpacity style={styles.dropZone} onPress={pickDocument} activeOpacity={0.75}>
          <Text style={styles.dropIcon}>☁️</Text>
          <Text style={styles.dropTitle}>Tap to select file</Text>
          <Text style={styles.dropHint}>PDF, JPG, or PNG up to {maxSizeMB}MB</Text>
          {existingFileUri && (
            <View style={styles.existingBadge}>
              <Text style={styles.existingBadgeText}>⚠️ Will replace existing file</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.filePreview}>
          <Text style={styles.filePreviewIcon}>{getFileIcon(selectedFile.mimeType)}</Text>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>{selectedFile.name}</Text>
            <Text style={styles.fileSize}>{formatSize(selectedFile.size)}</Text>
          </View>
          {!uploadDone
            ? <TouchableOpacity onPress={() => { setSelectedFile(null); setUploadDone(false); }}>
                <Text style={styles.removeBtnText}>✕</Text>
              </TouchableOpacity>
            : <Text style={{ fontSize: 20 }}>✅</Text>
          }
        </View>
      )}

      {selectedFile && !uploadDone && (
        <TouchableOpacity
          style={[styles.uploadBtn, uploading && styles.uploadBtnDisabled]}
          onPress={handleUpload}
          disabled={uploading}
        >
          {uploading
            ? <ActivityIndicator color="#FFFFFF" size="small" />
            : <Text style={styles.uploadBtnText}>Upload Document</Text>
          }
        </TouchableOpacity>
      )}

      {uploadDone && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>✅ Uploaded successfully!</Text>
          <TouchableOpacity onPress={pickDocument}>
            <Text style={styles.changeFileText}>Change file</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    marginHorizontal: 16, marginVertical: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  header: { marginBottom: 14 },
  title: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  subtitle: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  dropZone: {
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#CBD5E1',
    borderRadius: 12, paddingVertical: 32, alignItems: 'center', backgroundColor: '#F8FAFC',
  },
  dropIcon: { fontSize: 36, marginBottom: 8 },
  dropTitle: { fontSize: 15, fontWeight: '600', color: '#334155' },
  dropHint: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
  existingBadge: { marginTop: 10, backgroundColor: '#FFF7ED', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  existingBadgeText: { fontSize: 11, color: '#C2410C' },
  filePreview: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC',
    borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#E2E8F0',
  },
  filePreviewIcon: { fontSize: 28, marginRight: 10 },
  fileInfo: { flex: 1 },
  fileName: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  fileSize: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  removeBtnText: { fontSize: 16, color: '#94A3B8', fontWeight: '600', padding: 6 },
  uploadBtn: { backgroundColor: '#1D4ED8', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 14 },
  uploadBtnDisabled: { backgroundColor: '#93C5FD' },
  uploadBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  successBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 12, backgroundColor: '#F0FDF4', borderRadius: 10, padding: 12,
  },
  successText: { fontSize: 13, color: '#15803D', fontWeight: '500' },
  changeFileText: { fontSize: 13, color: '#1D4ED8', fontWeight: '600' },
});

export default DocumentUploader;