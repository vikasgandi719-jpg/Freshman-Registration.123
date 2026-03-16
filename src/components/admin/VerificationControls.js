import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  TextInput, Modal, ActivityIndicator,
} from 'react-native';

const VerificationControls = ({
  student,
  currentStatus = 'pending',
  onApprove,
  onReject,
  onReset,
  loading = false,
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason]       = useState('');
  const [showConfirm, setShowConfirm]         = useState(false);

  const handleApprove = () => {
    setShowConfirm(false);
    onApprove && onApprove(student);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    setShowRejectModal(false);
    onReject && onReject(student, rejectReason.trim());
    setRejectReason('');
  };

  const isApproved = currentStatus === 'approved';
  const isRejected = currentStatus === 'rejected';

  return (
    <View style={styles.container}>
      {/* Current status banner */}
      <View style={[
        styles.statusBanner,
        isApproved && styles.statusBannerApproved,
        isRejected && styles.statusBannerRejected,
        currentStatus === 'pending' && styles.statusBannerPending,
      ]}>
        <Text style={styles.statusBannerIcon}>
          {isApproved ? '✅' : isRejected ? '❌' : '⏳'}
        </Text>
        <View>
          <Text style={styles.statusBannerLabel}>Current Status</Text>
          <Text style={styles.statusBannerValue}>
            {isApproved ? 'Verified & Approved' : isRejected ? 'Rejected' : 'Pending Verification'}
          </Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.btnRow}>
        {/* Approve */}
        <TouchableOpacity
          style={[styles.approveBtn, isApproved && styles.btnDisabled]}
          onPress={() => setShowConfirm(true)}
          disabled={isApproved || loading}
        >
          {loading
            ? <ActivityIndicator color="#FFFFFF" size="small" />
            : <>
                <Text style={styles.approveBtnIcon}>✅</Text>
                <Text style={styles.approveBtnText}>{isApproved ? 'Approved' : 'Approve'}</Text>
              </>
          }
        </TouchableOpacity>

        {/* Reject */}
        <TouchableOpacity
          style={[styles.rejectBtn, isRejected && styles.btnDisabled]}
          onPress={() => setShowRejectModal(true)}
          disabled={isRejected || loading}
        >
          <Text style={styles.rejectBtnIcon}>❌</Text>
          <Text style={styles.rejectBtnText}>{isRejected ? 'Rejected' : 'Reject'}</Text>
        </TouchableOpacity>
      </View>

      {/* Reset button */}
      {(isApproved || isRejected) && (
        <TouchableOpacity style={styles.resetBtn} onPress={() => onReset && onReset(student)}>
          <Text style={styles.resetBtnText}>↺  Reset to Pending</Text>
        </TouchableOpacity>
      )}

      {/* Approve Confirm Modal */}
      <Modal visible={showConfirm} transparent animationType="fade" onRequestClose={() => setShowConfirm(false)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalIcon}>✅</Text>
            <Text style={styles.modalTitle}>Approve Verification</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to approve{'\n'}
              <Text style={{ fontWeight: '700' }}>{student?.name || 'this student'}</Text>?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowConfirm(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleApprove}>
                <Text style={styles.modalConfirmText}>Yes, Approve</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reject Reason Modal */}
      <Modal visible={showRejectModal} transparent animationType="slide" onRequestClose={() => setShowRejectModal(false)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalIcon}>❌</Text>
            <Text style={styles.modalTitle}>Reject Verification</Text>
            <Text style={styles.modalSubtitle}>Provide a reason for rejection:</Text>
            <TextInput
              style={styles.reasonInput}
              placeholder="e.g. Document unclear, photo mismatch…"
              placeholderTextColor="#94A3B8"
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => { setShowRejectModal(false); setRejectReason(''); }}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalRejectBtn, !rejectReason.trim() && styles.btnDisabled]}
                onPress={handleReject}
                disabled={!rejectReason.trim()}
              >
                <Text style={styles.modalRejectText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    gap: 12,
    backgroundColor: '#F8FAFC',
  },
  statusBannerApproved: { backgroundColor: '#F0FDF4' },
  statusBannerRejected: { backgroundColor: '#FFF1F2' },
  statusBannerPending:  { backgroundColor: '#FFF7ED' },
  statusBannerIcon: { fontSize: 28 },
  statusBannerLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  statusBannerValue: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginTop: 2 },
  btnRow: { flexDirection: 'row', gap: 12 },
  approveBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#16A34A', borderRadius: 10, paddingVertical: 14, gap: 8,
  },
  approveBtnIcon: { fontSize: 16 },
  approveBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  rejectBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#DC2626', borderRadius: 10, paddingVertical: 14, gap: 8,
  },
  rejectBtnIcon: { fontSize: 16 },
  rejectBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  btnDisabled: { opacity: 0.5 },
  resetBtn: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  resetBtnText: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 28 },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  modalIcon: { fontSize: 40, marginBottom: 10 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 16 },
  reasonInput: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 12,
    fontSize: 14,
    color: '#1E293B',
    minHeight: 80,
    marginBottom: 16,
  },
  modalActions: { flexDirection: 'row', gap: 12, width: '100%' },
  modalCancelBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#E2E8F0', alignItems: 'center',
  },
  modalCancelText: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  modalConfirmBtn: { flex: 1, backgroundColor: '#16A34A', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  modalConfirmText: { fontSize: 14, color: '#FFFFFF', fontWeight: '700' },
  modalRejectBtn: { flex: 1, backgroundColor: '#DC2626', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  modalRejectText: { fontSize: 14, color: '#FFFFFF', fontWeight: '700' },
});

export default VerificationControls;