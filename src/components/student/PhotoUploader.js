import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PhotoUploader = ({
  currentPhotoUri = null,
  studentName = '',
  onPhotoSelected,
  onUploadSuccess,
  onUploadError,
  size = 110,
}) => {
  const [photoUri, setPhotoUri]     = useState(currentPhotoUri);
  const [uploading, setUploading]   = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  const initials = studentName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const pickImage = async (useCamera) => {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== 'granted') {
      Alert.alert('Permission Denied', 'Access is required.');
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      setUploadDone(false);
      onPhotoSelected && onPhotoSelected(uri);
    }
  };

  const showOptions = () => {
    Alert.alert('Update Profile Photo', 'Choose an option', [
      { text: 'Take Photo',           onPress: () => pickImage(true)  },
      { text: 'Choose from Gallery',  onPress: () => pickImage(false) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleUpload = async () => {
    if (!photoUri) return;
    setUploading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // replace with real API
      setUploadDone(true);
      onUploadSuccess && onUploadSuccess(photoUri);
    } catch (error) {
      Alert.alert('Upload Failed', 'Please try again.');
      onUploadError && onUploadError(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={showOptions} activeOpacity={0.85}>
        <View style={[styles.avatarRing, { width: size + 8, height: size + 8, borderRadius: (size + 8) / 2 }]}>
          {photoUri
            ? <Image source={{ uri: photoUri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
            : <View style={[styles.initialsBox, { width: size, height: size, borderRadius: size / 2 }]}>
                <Text style={[styles.initials, { fontSize: size * 0.32 }]}>{initials || '👤'}</Text>
              </View>
          }
        </View>
        <View style={styles.editBadge}>
          <Text style={{ fontSize: 12 }}>✏️</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.tapHint}>Tap photo to change</Text>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.sourceBtn} onPress={() => pickImage(true)}>
          <Text style={styles.sourceBtnText}>📷  Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sourceBtn} onPress={() => pickImage(false)}>
          <Text style={styles.sourceBtnText}>🖼️  Gallery</Text>
        </TouchableOpacity>
      </View>

      {photoUri && !uploadDone && (
        <TouchableOpacity
          style={[styles.uploadBtn, uploading && styles.uploadBtnDisabled]}
          onPress={handleUpload}
          disabled={uploading}
        >
          {uploading
            ? <ActivityIndicator color="#FFFFFF" size="small" />
            : <Text style={styles.uploadBtnText}>Save Photo</Text>
          }
        </TouchableOpacity>
      )}

      {uploadDone && (
        <View style={styles.successRow}>
          <Text style={styles.successText}>✅ Photo saved successfully!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', paddingVertical: 20 },
  avatarRing: { borderWidth: 3, borderColor: '#1D4ED8', justifyContent: 'center', alignItems: 'center' },
  initialsBox: { backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center' },
  initials: { color: '#1D4ED8', fontWeight: '800' },
  editBadge: {
    position: 'absolute', bottom: 2, right: 2,
    backgroundColor: '#1D4ED8', width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#FFFFFF',
  },
  tapHint: { fontSize: 12, color: '#94A3B8', marginTop: 10 },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  sourceBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' },
  sourceBtnText: { fontSize: 13, color: '#334155', fontWeight: '500' },
  uploadBtn: { marginTop: 16, backgroundColor: '#1D4ED8', paddingHorizontal: 36, paddingVertical: 12, borderRadius: 10 },
  uploadBtnDisabled: { backgroundColor: '#93C5FD' },
  uploadBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  successRow: { marginTop: 12, backgroundColor: '#F0FDF4', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  successText: { fontSize: 13, color: '#15803D', fontWeight: '500' },
});

export default PhotoUploader;