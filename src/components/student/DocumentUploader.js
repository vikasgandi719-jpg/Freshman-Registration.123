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

  // 📁 Pick file
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      // ⚠️ File size validation
      const maxSize =
        documentId === "photo" ? 200 * 1024 : 5 * 1024 * 1024;

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

  // 🚀 Upload file
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", {
        uri: selectedFile.uri,
        name: selectedFile.name || "file.jpg",
        type: selectedFile.mimeType || "application/octet-stream",
      });

      await onUploadSuccess(formData, documentId);

      setSelectedFile(null);
      alert("Upload successful!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* File Name */}
      <Text style={styles.fileText}>
        {selectedFile ? selectedFile.name : "No file uploaded yet"}
      </Text>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.pickBtn} onPress={pickFile}>
          <Text style={styles.btnText}>Choose File</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={handleUpload}
          disabled={uploading}
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

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  fileText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  pickBtn: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 6,
  },
  uploadBtn: {
    backgroundColor: "#2d6cdf",
    padding: 10,
    borderRadius: 6,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});