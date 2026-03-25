import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
  Image,
  Modal as RNModal,
} from 'react-native';
import Header from '../../components/common/Header';
import StatusBadge from '../../components/common/StatusBadge';
import DocumentUploader from '../../components/student/DocumentUploader';
import Modal from '../../components/common/Modal';
import useDocuments from '../../hooks/useDocuments';

const DocumentDetailScreen = ({ navigation, route }) => {
  const { document: passedDoc } = route.params || {};
  const { uploadDocument, getDocumentById } = useDocuments();

  const [uploadModal, setUploadModal] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  const doc = getDocumentById(passedDoc?.id) || passedDoc || {};

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const statusInfo = {
    approved: {
      color: '#15803D',
      bg: '#F0FDF4',
      msg: 'This document has been verified and approved by admin.',
    },
    pending: {
      color: '#C2410C',
      bg: '#FFF7ED',
      msg: 'This document is currently under review by admin.',
    },
    rejected: {
      color: '#BE123C',
      bg: '#FFF1F2',
      msg: 'This document was rejected. Please re-upload a clear copy.',
    },
    not_uploaded: {
      color: '#64748B',
      bg: '#F8FAFC',
      msg: 'This document has not been uploaded yet.',
    },
  };

  const info = statusInfo[doc.status] || statusInfo.not_uploaded;

  const handleUploadSuccess = async (file) => {
    const result = await uploadDocument(
      doc.id,
      file.uri,
      file.mimeType,
      file.name
    );

    if (!result?.success) {
      throw new Error(result?.error || 'Upload failed');
    }

    setUploadModal(false);
    return result;
  };

  const handleViewDocument = async () => {
    const fileSource = doc.fileUrl || doc.fileUri;

    if (!fileSource) {
      Alert.alert('No File', 'No uploaded file is available for viewing.');
      return;
    }

    const isImage =
      doc.fileType?.includes('image') ||
      doc.mimeType?.includes('image') ||
      /\.(jpg|jpeg|png|gif|webp)$/i.test(fileSource);

    if (isImage) {
      setImageViewerVisible(true);
      return;
    }

    try {
      if (Platform.OS === 'web') {
        window.open(fileSource, '_blank', 'noopener,noreferrer');
        return;
      }

      const supported = await Linking.canOpenURL(fileSource);
      if (!supported) {
        Alert.alert('Cannot Open File', 'This file cannot be opened on this device.');
        return;
      }

      await Linking.openURL(fileSource);
    } catch (error) {
      Alert.alert('Open Failed', error?.message || 'Unable to open this document.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="Document Detail"
        onBack={() => navigation.goBack()}
        variant="default"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.docCard}>
          <View style={styles.docIconBox}>
            <Text style={styles.docIcon}>
              {doc.fileType?.includes('pdf')
                ? '📕'
                : doc.fileType?.includes('image')
                ? '🖼️'
                : '📄'}
            </Text>
          </View>

          <Text style={styles.docTitle}>{doc.title || 'Document'}</Text>

          {doc.description && (
            <Text style={styles.docDesc}>{doc.description}</Text>
          )}

          <StatusBadge
            status={doc.status || 'not_uploaded'}
            size="md"
            showIcon
            style={styles.badge}
          />
        </View>

        <View style={[styles.statusMsg, { backgroundColor: info.bg }]}>
          <Text style={[styles.statusMsgText, { color: info.color }]}>
            {info.msg}
          </Text>
        </View>

        {doc.status === 'rejected' && doc.rejectionReason && (
          <View style={styles.rejectionCard}>
            <Text style={styles.rejectionLabel}>Rejection Reason:</Text>
            <Text style={styles.rejectionReason}>{doc.rejectionReason}</Text>
          </View>
        )}

        {!!(doc.fileUrl || doc.fileUri) && (
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={handleViewDocument}
            activeOpacity={0.85}
          >
            <Text style={styles.viewBtnText}>📄 View Document</Text>
          </TouchableOpacity>
        )}

        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Document Info</Text>

          {[
            { label: 'Document Type', value: doc.type || 'N/A' },
            { label: 'Status', value: doc.status || 'Not Uploaded' },
            { label: 'Uploaded On', value: formatDate(doc.uploadedAt) },
            { label: 'Last Updated', value: formatDate(doc.updatedAt) },
            { label: 'File Name', value: doc.fileName || 'N/A' },
            {
              label: 'File Size',
              value: doc.fileSize
                ? `${(doc.fileSize / (1024 * 1024)).toFixed(1)} MB`
                : 'N/A',
            },
            { label: 'Required', value: doc.required ? 'Yes' : 'Optional' },
          ].map((item, index, arr) => (
            <View
              key={item.label}
              style={[
                styles.detailRow,
                index < arr.length - 1 && styles.detailRowBorder,
              ]}
            >
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {doc.status !== 'approved' && (
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => setUploadModal(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.uploadBtnText}>
              {doc.status === 'not_uploaded'
                ? '📤  Upload Document'
                : '🔄  Re-upload Document'}
            </Text>
          </TouchableOpacity>
        )}

        {doc.status === 'approved' && (
          <View style={styles.approvedBox}>
            <Text style={styles.approvedIcon}>✅</Text>
            <Text style={styles.approvedText}>
              Document verified — no action needed.
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal
        visible={uploadModal}
        onClose={() => setUploadModal(false)}
        title={doc.title || 'Upload Document'}
        icon="📤"
        size="md"
      >
        <DocumentUploader
          documentTitle={doc.title}
          documentId={doc.id}
          existingFileUri={doc.fileUri}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={() => {}}
        />
      </Modal>

      <RNModal visible={imageViewerVisible} transparent animationType="fade">
        <View style={styles.viewerOverlay}>
          <TouchableOpacity
            style={styles.viewerClose}
            onPress={() => setImageViewerVisible(false)}
          >
            <Text style={styles.viewerCloseText}>✕</Text>
          </TouchableOpacity>

          <Image
            source={{ uri: doc.fileUrl || doc.fileUri }}
            style={styles.viewerImage}
            resizeMode="contain"
          />
        </View>
      </RNModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  docCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  docIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  docIcon: {
    fontSize: 36,
  },
  docTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 4,
  },
  docDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 10,
  },
  badge: {
    marginTop: 4,
  },
  statusMsg: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
  },
  statusMsgText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
  rejectionCard: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#FFF1F2',
    borderLeftWidth: 4,
    borderLeftColor: '#F43F5E',
  },
  rejectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#BE123C',
    marginBottom: 4,
  },
  rejectionReason: {
    fontSize: 13,
    color: '#BE123C',
    lineHeight: 20,
  },
  viewBtn: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  viewBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  detailsCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  uploadBtn: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#1D4ED8',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  uploadBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  approvedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    paddingVertical: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  approvedIcon: {
    fontSize: 22,
  },
  approvedText: {
    fontSize: 14,
    color: '#15803D',
    fontWeight: '600',
  },
  viewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  viewerClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerCloseText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  viewerImage: {
    width: '100%',
    height: '80%',
  },
});

export default DocumentDetailScreen;