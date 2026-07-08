import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

const DocumentUploader = ({
  documentId,
  documentTitle,
  existingFileUri,
  onUploadSuccess,
  onUploadError,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      const isPhoto = documentId === "passport_photo";
      const maxSize = isPhoto ? 200 * 1024 : 5 * 1024 * 1024;

      if (file.size && file.size > maxSize) {
        Alert.alert(
          "File too large",
          isPhoto
            ? "Photo must be under 200KB."
            : "File must be under 5MB.",
        );
        return;
      }

      setSelectedFile(file);
    } catch (err) {
      console.error("File pick error:", err);
      onUploadError && onUploadError(err);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert("No file", "Please choose a file first.");
      return;
    }

    try {
      setUploading(true);
      await onUploadSuccess({
        uri: selectedFile.uri,
        mimeType: selectedFile.mimeType || "application/octet-stream",
        name: selectedFile.name || "file",
        size: selectedFile.size,
      });
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      onUploadError && onUploadError(err);
      Alert.alert("Upload failed", err?.message || "Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const isImage = (name = "") =>
    /\.(png|jpg|jpeg|webp|gif)$/i.test(name);

  return (
    <View style={styles.container}>
      {existingFileUri && !selectedFile && (
        <View style={styles.existingBox}>
          <Text style={styles.existingIcon}>📎</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.existingLabel}>Currently uploaded</Text>
            <Text style={styles.existingSubtext}>
              Choose a new file to replace it
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.dropzone}
        onPress={pickFile}
        activeOpacity={0.7}
      >
        {selectedFile ? (
          <View style={styles.selectedRow}>
            {isImage(selectedFile.name) ? (
              <Image
                source={{ uri: selectedFile.uri }}
                style={styles.thumb}
              />
            ) : (
              <View style={styles.fileIconBox}>
                <Text style={styles.fileIcon}>📄</Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.selectedName} numberOfLines={1}>
                {selectedFile.name}
              </Text>
              {selectedFile.size ? (
                <Text style={styles.selectedSize}>
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </Text>
              ) : null}
            </View>
            <TouchableOpacity
              onPress={() => setSelectedFile(null)}
              style={styles.removeBtn}
            >
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.dropzoneIcon}>📤</Text>
            <Text style={styles.dropzoneTitle}>Tap to choose file</Text>
            <Text style={styles.dropzoneHint}>PDF, JPG, PNG · Max 5MB</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.uploadBtn,
          (!selectedFile || uploading) && styles.uploadBtnDisabled,
        ]}
        onPress={handleUpload}
        disabled={!selectedFile || uploading}
        activeOpacity={0.85}
      >
        {uploading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            <Text style={styles.uploadBtnIcon}>⬆</Text>
            <Text style={styles.uploadBtnText}>
              {existingFileUri ? "Replace & Upload" : "Upload Document"}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default DocumentUploader;

const styles = StyleSheet.create({
  container: { marginTop: 6, gap: 12 },
  existingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  existingIcon: { fontSize: 20 },
  existingLabel: { fontSize: 13, fontWeight: "700", color: "#15803D" },
  existingSubtext: { fontSize: 11, color: "#166534", marginTop: 2 },
  dropzone: {
    borderWidth: 2,
    borderColor: "#DBEAFE",
    borderStyle: "dashed",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  dropzoneIcon: { fontSize: 36, marginBottom: 6 },
  dropzoneTitle: { fontSize: 15, fontWeight: "700", color: "#1D4ED8" },
  dropzoneHint: { fontSize: 12, color: "#94A3B8", marginTop: 4 },
  selectedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
  thumb: { width: 44, height: 44, borderRadius: 8, backgroundColor: "#E2E8F0" },
  fileIconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },
  fileIcon: { fontSize: 20 },
  selectedName: { fontSize: 13, fontWeight: "600", color: "#0F172A" },
  selectedSize: { fontSize: 11, color: "#64748B", marginTop: 2 },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  removeBtnText: { fontSize: 13, color: "#DC2626", fontWeight: "700" },
  uploadBtn: {
    backgroundColor: "#1D4ED8",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  uploadBtnDisabled: { backgroundColor: "#93C5FD", shadowOpacity: 0 },
  uploadBtnIcon: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  uploadBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});
