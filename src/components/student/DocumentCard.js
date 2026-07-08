import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';

const STATUS_CONFIG = {
  pending:      { label: 'Pending',      bg: '#FFF7ED', text: '#C2410C', dot: '#F97316' },
  approved:     { label: 'Approved',     bg: '#F0FDF4', text: '#15803D', dot: '#22C55E' },
  rejected:     { label: 'Rejected',     bg: '#FFF1F2', text: '#BE123C', dot: '#F43F5E' },
  not_uploaded: { label: 'Not Uploaded', bg: '#F8FAFC', text: '#64748B', dot: '#94A3B8' },
};

const DocumentCard = ({ document, onPress, onUpload, onView, onApprove, onReject, actionBusy = false }) => {
  const {
    title = 'Document',
    description = '',
    status = 'not_uploaded',
    uploadedAt,
    fileType,
    fileUrl,
    fileUri,
  } = document || {};

  const config = STATUS_CONFIG[status] || STATUS_CONFIG.not_uploaded;
  const viewableUrl = fileUrl || fileUri || null;

  const handleView = () => {
    if (onView) return onView(document);
    if (!viewableUrl) return;
    Linking.openURL(viewableUrl).catch(() =>
      Alert.alert('Cannot open file', 'The file link could not be opened.'),
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getFileIcon = () => {
    if (!fileType) return '📄';
    if (fileType.includes('pdf')) return '📕';
    if (fileType.includes('image')) return '🖼️';
    return '📄';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.accent, { backgroundColor: config.dot }]} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.fileIcon}>{getFileIcon()}</Text>
          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            {description ? <Text style={styles.description} numberOfLines={1}>{description}</Text> : null}
          </View>
          <View style={[styles.badge, { backgroundColor: config.bg }]}>
            <View style={[styles.dot, { backgroundColor: config.dot }]} />
            <Text style={[styles.badgeText, { color: config.text }]}>{config.label}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.bottomRow}>
          {uploadedAt
            ? <Text style={styles.dateText}>Uploaded: {formatDate(uploadedAt)}</Text>
            : <Text style={styles.dateText}>No file uploaded yet</Text>
          }
          <View style={styles.actionRow}>
            {viewableUrl ? (
              <TouchableOpacity style={styles.viewBtn} onPress={handleView}>
                <Text style={styles.viewBtnText}>View</Text>
              </TouchableOpacity>
            ) : null}
            {onApprove && status !== 'approved' && status !== 'not_uploaded' ? (
              <TouchableOpacity
                style={styles.approveBtn}
                onPress={() => onApprove(document)}
                disabled={actionBusy}
              >
                <Text style={styles.approveBtnText}>{actionBusy ? '…' : 'Approve'}</Text>
              </TouchableOpacity>
            ) : null}
            {onReject && status !== 'rejected' && status !== 'not_uploaded' ? (
              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => onReject(document)}
                disabled={actionBusy}
              >
                <Text style={styles.rejectBtnText}>Reject</Text>
              </TouchableOpacity>
            ) : null}
            {onUpload ? (
              <TouchableOpacity
                style={[styles.actionBtn, status === 'approved' && styles.disabledBtn]}
                onPress={onUpload}
                disabled={status === 'approved'}
              >
                <Text style={[styles.actionBtnText, status === 'approved' && styles.disabledBtnText]}>
                  {status === 'not_uploaded' ? 'Upload' : 'Re-upload'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  accent: { width: 4 },
  body: { flex: 1, paddingHorizontal: 14, paddingVertical: 12 },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  fileIcon: { fontSize: 26, marginRight: 10 },
  titleBlock: { flex: 1, marginRight: 8 },
  title: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  description: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateText: { fontSize: 12, color: '#94A3B8' },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionBtn: { backgroundColor: '#1D4ED8', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  actionBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  disabledBtn: { backgroundColor: '#E2E8F0' },
  disabledBtnText: { color: '#94A3B8' },
  viewBtn: { borderWidth: 1.5, borderColor: '#1D4ED8', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 8 },
  viewBtnText: { color: '#1D4ED8', fontSize: 12, fontWeight: '600' },
  approveBtn: { backgroundColor: '#15803D', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  approveBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  rejectBtn: { backgroundColor: '#FEF2F2', borderWidth: 1.5, borderColor: '#F43F5E', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 8 },
  rejectBtnText: { color: '#BE123C', fontSize: 12, fontWeight: '700' },
});

export default DocumentCard;