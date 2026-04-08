<<<<<<< HEAD
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { UPLOAD } from "../../constants/config";
=======
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
>>>>>>> c27836c8543bb82f81e1890a9b2bfc65248491d7

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const DocumentUploader = ({
  documentTitle,
  documentId,
  existingFileUri,
  onUploadSuccess,
  onUploadError,
}) => {
  const [isPicking, setIsPicking] = useState(false);

  const handleUpload = async () => {
    try {
      setIsPicking(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      console.log('DocumentPicker result:', result);

<<<<<<< HEAD
      const file = result.assets[0];

      const maxSize =
        documentId === "passport_photo"
          ? UPLOAD.MAX_PHOTO_SIZE_MB * 1024 * 1024
          : UPLOAD.MAX_FILE_SIZE_MB * 1024 * 1024;
      if (file.size > maxSize) {
        alert(
          documentId === "passport_photo"
            ? `Photo must be under ${UPLOAD.MAX_PHOTO_SIZE_MB}MB`
            : `File must be under ${UPLOAD.MAX_FILE_SIZE_MB}MB`
        );
=======
      if (result.canceled) {
        setIsPicking(false);
>>>>>>> c27836c8543bb82f81e1890a9b2bfc65248491d7
        return;
      }

      const asset = result.assets?.[0];

      console.log('Picked asset:', asset);
      console.log('asset?.uri:', asset?.uri);
      console.log('asset?.name:', asset?.name);
      console.log('asset?.mimeType:', asset?.mimeType);
      console.log('asset?.size:', asset?.size);
      console.log('asset?.file:', asset?.file);
      console.log('asset.file instanceof File:', asset?.file instanceof File);

      if (!asset) {
        throw new Error('No file selected.');
      }

      if (asset.size && asset.size > MAX_FILE_SIZE) {
        throw new Error('File size should be less than 5MB.');
      }

      // ✅ On web, we must pass the actual browser File object
      if (typeof window !== 'undefined') {
        if (!(asset.file instanceof File)) {
          throw new Error('Web upload failed: selected file is not a valid browser File object.');
        }

        await onUploadSuccess({
          file: asset.file,
          name: asset.name || asset.file.name || 'document',
          mimeType: asset.mimeType || asset.file.type || 'application/octet-stream',
          size: asset.size || asset.file.size || 0,
          uri: asset.uri,
        });

        return;
      }

      // ✅ Native fallback
      await onUploadSuccess({
        uri: asset.uri,
        name: asset.name || 'document',
        mimeType: asset.mimeType || 'application/octet-stream',
        size: asset.size || 0,
      });
    } catch (error) {
      console.error('Document selection/upload error:', error);

      if (onUploadError) {
        onUploadError(error.message || 'Failed to pick file.');
      } else {
        Alert.alert('Upload Error', error.message || 'Failed to pick file.');
      }
    } finally {
      setIsPicking(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{documentTitle}</Text>

      {existingFileUri ? (
        <Text style={styles.existingText}>
          A file is already uploaded. You can replace it.
        </Text>
      ) : (
        <Text style={styles.subtitle}>
          Choose a PDF, JPG, or PNG file (max 5MB)
        </Text>
      )}

      <TouchableOpacity
        style={[styles.button, isPicking && styles.buttonDisabled]}
        onPress={handleUpload}
        disabled={isPicking}
      >
        {isPicking ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Choose File</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  existingText: {
    fontSize: 13,
    color: '#B45309',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default DocumentUploader;