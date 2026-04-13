import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, RefreshControl, TouchableOpacity,
  Platform,
} from 'react-native';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import useDocuments from '../../hooks/useDocuments';
import { API } from '../../constants/config';
import { getTokenCache } from '../../services/api';

const DOC_GROUPS = [
  {
    key: 'general',
    title: '👤 General',
    color: '#1D4ED8',
    bg: '#EFF6FF',
    docs: [
      { id: 'passport_photo', title: 'Passport Size Photo', required: true },
      { id: 'aadhar_card', title: 'Aadhaar Card', required: true },
    ],
  },
  {
    key: 'school',
    title: '🏫 Schooling — School',
    color: '#0369A1',
    bg: '#F0F9FF',
    docs: [
      { id: 'school_memo', title: 'School Memo', required: true },
      { id: 'school_bonafide', title: 'School Bonafide Certificate', required: true },
    ],
  },
  {
    key: 'inter',
    title: '🎓 Schooling — Intermediate',
    color: '#7C3AED',
    bg: '#F5F3FF',
    docs: [
      { id: 'inter_hall_ticket', title: 'Inter Hall Ticket', required: true },
      { id: 'inter_memo', title: 'Inter Memo', required: true },
      { id: 'inter_bonafide', title: 'Inter Bonafide Certificate', required: true },
    ],
  },
  {
    key: 'tenth',
    title: '📄 10th Documentation',
    color: '#0F766E',
    bg: '#F0FDFA',
    docs: [
      { id: 'tenth_hall_ticket', title: '10th Hall Ticket', required: true },
      { id: 'tenth_memo', title: '10th Memo', required: true },
      { id: 'tenth_bonafide', title: '10th Bonafide Certificate', required: true },
    ],
  },
  {
    key: 'eapcet',
    title: '📝 EAPCET',
    color: '#B45309',
    bg: '#FFFBEB',
    docs: [
      { id: 'eapcet_hall_ticket', title: 'EAPCET Hall Ticket', required: true },
      { id: 'eapcet_rank_card', title: 'EAPCET Rank Card', required: true },
    ],
  },
  {
    key: 'jee',
    title: '🎓 JEE Mains',
    color: '#059669',
    bg: '#F0FDF4',
    optional: true,
    docs: [
      { id: 'jee_hall_ticket', title: 'JEE Mains Hall Ticket', required: false },
      { id: 'jee_rank_card', title: 'JEE Mains Rank Card', required: false },
    ],
  },
  {
    key: 'other',
    title: '📂 Other Documents',
    color: '#64748B',
    bg: '#F8FAFC',
    docs: [
      { id: 'caste_certificate', title: 'Caste Certificate', required: false },
      { id: 'income_certificate', title: 'Income Certificate', required: false },
    ],
  },
];

const STATUS = {
  approved: {
    icon: '✅',
    label: 'Approved',
    labelColor: '#15803D',
    rowBg: '#F0FDF4',
    rowBorder: '#BBF7D0',
  },
  pending: {
    icon: '⏳',
    label: 'Under Review',
    labelColor: '#C2410C',
    rowBg: '#FFF7ED',
    rowBorder: '#FED7AA',
  },
  rejected: {
    icon: '❌',
    label: 'Rejected',
    labelColor: '#BE123C',
    rowBg: '#FFF1F2',
    rowBorder: '#FECDD3',
  },
  not_uploaded: {
    icon: '📄',
    label: 'Tap to Upload',
    labelColor: '#64748B',
    rowBg: '#F8FAFC',
    rowBorder: '#E2E8F0',
  },
};

const DocumentUploadScreen = () => {
  const { user } = useAuth();
  const { documents, fetchDocuments } = useDocuments();

  const [refreshing, setRefreshing] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      fetchDocuments(user.id);
    }
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (user?.id) {
      await fetchDocuments(user.id);
    }
    setRefreshing(false);
  };

  const getDoc = (docId) => documents.find((d) => d.id === docId);
  const getStatus = (docId) => getDoc(docId)?.status || 'not_uploaded';

  const allDocIds = DOC_GROUPS.flatMap((g) => g.docs.map((d) => d.id));
  const counts = {
    total: allDocIds.length,
    approved: allDocIds.filter((id) => getStatus(id) === 'approved').length,
    pending: allDocIds.filter((id) => getStatus(id) === 'pending').length,
    rejected: allDocIds.filter((id) => getStatus(id) === 'rejected').length,
    notUploaded: allDocIds.filter((id) => getStatus(id) === 'not_uploaded').length,
  };

  const handleDocPress = (docId, docTitle) => {
    const existing = getDoc(docId);
    setSelectedDoc(existing || { id: docId, title: docTitle });
    setUploadModal(true);
  };

  const handleUploadSuccess = async (file) => {
    if (selectedDoc) {
      const formData = new FormData();
      if (Platform.OS === "web") {
        if (file.file instanceof File) {
          formData.append("file", file.file);
        } else if (file?.uri) {
          // Expo web may return uri/name/mimeType without a File instance.
          // Convert uri -> Blob -> File so multer receives req.file.
          const response = await fetch(file.uri);
          const blob = await response.blob();
          const webFile = new File(
            [blob],
            file.name || "document",
            { type: file.mimeType || blob.type || "application/octet-stream" }
          );
          formData.append("file", webFile);
        } else {
          throw new Error("Invalid file object for web upload.");
        }
      } else {
        formData.append("file", {
          uri: file.uri,
          name: file.name || "document.pdf",
          type: file.mimeType || "application/octet-stream",
        });
      }
      const result = await uploadDocument(selectedDoc.id, formData);
      if (!result?.success) {
        throw new Error(result?.error || "Upload failed.");
      }
      if (user?.id) fetchDocuments(user.id);
    }

    return data;
  };

  const openBrowserFilePicker = () => {
    if (Platform.OS !== 'web') {
      Alert.alert('Info', 'This temporary picker is for web only.');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,image/png,image/jpeg,image/jpg';

    input.onchange = async (event) => {
      try {
        const file = event.target.files?.[0];

        if (!file) {
          return;
        }

        console.log('Direct browser selected file:', file);

        await uploadBrowserFile(selectedDoc.id, file);

        if (user?.id) {
          await fetchDocuments(user.id);
        }

        Alert.alert('Success', 'Document uploaded successfully');
      } catch (error) {
        console.error('Direct upload failed:', error);
        Alert.alert('Upload Failed', error.message || 'Upload failed');
      } finally {
        setUploadModal(false);
        setSelectedDoc(null);
      }
    };

    input.click();
  };

  const DocRow = ({ docId, title, required }) => {
    const status = getStatus(docId);
    const cfg = STATUS[status] || STATUS.not_uploaded;
    const canReplace = status !== 'approved';

    return (
      <TouchableOpacity
        style={[styles.docRow, { backgroundColor: cfg.rowBg, borderColor: cfg.rowBorder }]}
        onPress={() => canReplace && handleDocPress(docId, title)}
        activeOpacity={canReplace ? 0.7 : 1}
      >
        <Text style={styles.docRowIcon}>{cfg.icon}</Text>
        <View style={styles.docRowMiddle}>
          <View style={styles.docRowTitleRow}>
            <Text style={styles.docRowTitle}>{title}</Text>
            {required ? (
              <View style={styles.requiredBadge}>
                <Text style={styles.requiredText}>Required</Text>
              </View>
            ) : (
              <View style={styles.optionalBadge}>
                <Text style={styles.optionalText}>Optional</Text>
              </View>
            )}
          </View>
          <Text style={[styles.docRowStatus, { color: cfg.labelColor }]}>{cfg.label}</Text>
        </View>
        {canReplace && <Text style={styles.docRowArrow}>›</Text>}
      </TouchableOpacity>
    );
  };

  const GroupCard = ({ group }) => {
    const uploaded = group.docs.filter((d) => {
      const s = getStatus(d.id);
      return s === 'pending' || s === 'approved';
    }).length;

    const total = group.docs.length;
    const allDone = uploaded === total;

    return (
      <View style={styles.groupCard}>
        <View style={[styles.groupHeader, { backgroundColor: group.bg }]}>
          <View style={styles.groupHeaderLeft}>
            <Text style={[styles.groupTitle, { color: group.color }]}>{group.title}</Text>
            {group.optional && (
              <View style={styles.groupOptionalTag}>
                <Text style={styles.groupOptionalText}>Optional</Text>
              </View>
            )}
          </View>
          <View style={styles.groupProgress}>
            <Text style={[styles.groupProgressText, { color: group.color }]}>
              {uploaded}/{total}
            </Text>
            {allDone && <Text style={styles.groupDoneCheck}>✓</Text>}
          </View>
        </View>

        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${(uploaded / total) * 100}%`,
                backgroundColor: group.color,
              },
            ]}
          />
        </View>

        <View style={styles.groupDocs}>
          {group.docs.map((doc) => (
            <DocRow
              key={doc.id}
              docId={doc.id}
              title={doc.title}
              required={doc.required}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topHeader}>
        <Text style={styles.topTitle}>My Documents</Text>
        <Text style={styles.topSubtitle}>Upload & track all your documents</Text>
      </View>

      <View style={styles.statsRow}>
        {[
          { label: 'Total', value: counts.total, color: '#1D4ED8' },
          { label: 'Approved', value: counts.approved, color: '#15803D' },
          { label: 'Pending', value: counts.pending, color: '#C2410C' },
          { label: 'Rejected', value: counts.rejected, color: '#BE123C' },
          { label: 'Not Uploaded', value: counts.notUploaded, color: '#64748B' },
        ].map((s) => (
          <View key={s.label} style={[styles.statChip, { borderColor: s.color }]}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.infoBanner}>
        <Text style={styles.infoBannerIcon}>ℹ️</Text>
        <Text style={styles.infoBannerText}>
          Upload all required documents in PDF or image format. Max 5MB per document. Tap any row to upload.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1D4ED8']}
          />
        }
      >
        {DOC_GROUPS.map((group) => (
          <GroupCard key={group.key} group={group} />
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal
        visible={uploadModal}
        onClose={() => {
          setUploadModal(false);
          setSelectedDoc(null);
        }}
        title={selectedDoc?.title || 'Upload Document'}
        subtitle="Select a PDF, JPG, or PNG file"
        icon="📤"
        size="md"
      >
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 14, color: '#475569' }}>
            Using direct browser upload test for web.
          </Text>

          <TouchableOpacity style={styles.uploadButton} onPress={openBrowserFilePicker}>
            <Text style={styles.uploadButtonText}>Choose File</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },

  topHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  topTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  topSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  statChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
  },
  statValue: { fontSize: 16, fontWeight: '800' },
  statLabel: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '500',
    textAlign: 'center',
  },

  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    padding: 12,
    borderRadius: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoBannerIcon: { fontSize: 14, marginTop: 1 },
  infoBannerText: { flex: 1, fontSize: 12, color: '#1E40AF', lineHeight: 18 },

  scrollContent: { paddingTop: 8, paddingHorizontal: 16 },

  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginTop: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  groupHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  groupTitle: { fontSize: 15, fontWeight: '700' },
  groupOptionalTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  groupOptionalText: { fontSize: 10, fontWeight: '700', color: '#15803D' },
  groupProgress: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  groupProgressText: { fontSize: 13, fontWeight: '700' },
  groupDoneCheck: { fontSize: 14, color: '#15803D', fontWeight: '800' },

  progressBarBg: { height: 3, backgroundColor: '#E2E8F0' },
  progressBarFill: { height: 3, borderRadius: 2 },

  groupDocs: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 8,
  },

  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
  },
  docRowIcon: { fontSize: 22 },
  docRowMiddle: { flex: 1 },
  docRowTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  docRowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    flexShrink: 1,
  },
  docRowStatus: { fontSize: 12, marginTop: 3, fontWeight: '500' },
  docRowArrow: { fontSize: 20, color: '#CBD5E1' },

  requiredBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  requiredText: { fontSize: 9, fontWeight: '700', color: '#DC2626' },

  optionalBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  optionalText: { fontSize: 9, fontWeight: '700', color: '#16A34A' },

  uploadButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default DocumentUploadScreen;