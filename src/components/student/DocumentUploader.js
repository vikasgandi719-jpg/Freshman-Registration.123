import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

const DocumentUploader = ({ documentId, onUploadSuccess }) => {
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

      const maxSize = documentId === "photo" ? 200 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(
          documentId === "photo"
            ? "Photo must be under 200KB"
            : "File must be under 5MB"
        );
        return;
      }

      setSelectedFile(file);
    } catch (error) {
      console.error("File pick error:", error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    try {
      setUploading(true);
      // ✅ pass the full file object — let the screen handle FormData
      await onUploadSuccess(selectedFile);
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.fileText}>
        {selectedFile ? selectedFile.name : "No file selected yet"}
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.pickBtn} onPress={pickFile}>
          <Text style={styles.btnText}>Choose File</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.uploadBtn, !selectedFile && styles.uploadBtnDisabled]}
          onPress={handleUpload}
          disabled={uploading || !selectedFile}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Upload</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DocumentUploader;

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  fileText: { fontSize: 14, color: "#666", marginBottom: 10 },
  buttonRow: { flexDirection: "row", gap: 10 },
  pickBtn: { backgroundColor: "#ccc", padding: 10, borderRadius: 6 },
  uploadBtn: { backgroundColor: "#2d6cdf", padding: 10, borderRadius: 6 },
  uploadBtnDisabled: { backgroundColor: "#93C5FD" },
  btnText: { color: "#fff", fontWeight: "600" },
});