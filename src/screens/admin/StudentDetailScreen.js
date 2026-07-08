import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  SafeAreaView, ActivityIndicator, TouchableOpacity,
  Alert, Platform,
} from 'react-native';
import Header              from '../../components/common/Header';
import ProfileCard         from '../../components/student/ProfileCard';
import DocumentStatusList  from '../../components/student/DocumentStatusList';
import VerificationControls from '../../components/admin/VerificationControls';
import Modal               from '../../components/common/Modal';
import Input               from '../../components/common/Input';
import { useStudents }     from '../../hooks/useStudents';
import adminService        from '../../services/adminService';

const StudentDetailScreen = ({ navigation, route }) => {
  const { studentId, student: passedStudent } = route.params || {};
  const { fetchStudentById, verifyStudent, rejectStudent,
          resetStudentStatus, selectedStudent, isLoading, actionLoading } = useStudents();

  const [tab, setTab] = useState('profile');
  const [busyDocId, setBusyDocId] = useState(null);
  const [rejectDoc, setRejectDoc] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (studentId) fetchStudentById(studentId);
  }, [studentId]);

  const student = selectedStudent || passedStudent;

  const askConfirm = (title, message) =>
    new Promise((resolve) => {
      if (Platform.OS === 'web') {
        resolve(window.confirm(`${title}\n\n${message}`));
      } else {
        Alert.alert(title, message, [
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
          { text: 'OK', onPress: () => resolve(true) },
        ]);
      }
    });

  const handleApproveDoc = async (doc) => {
    const docDbId = doc.dbId || doc.id;
    const ok = await askConfirm('Approve document?', `Mark "${doc.title}" as approved?`);
    if (!ok) return;
    setBusyDocId(docDbId);
    try {
      await adminService.verifyDocument(docDbId);
      await fetchStudentById(studentId);
    } catch (e) {
      Alert.alert('Failed', e?.message || 'Could not approve document.');
    } finally {
      setBusyDocId(null);
    }
  };

  const openRejectModal = (doc) => {
    setRejectDoc(doc);
    setRejectReason('');
  };

  const submitReject = async () => {
    if (!rejectReason.trim()) {
      Alert.alert('Reason required', 'Please provide a reason for rejection.');
      return;
    }
    const docDbId = rejectDoc.dbId || rejectDoc.id;
    setBusyDocId(docDbId);
    try {
      await adminService.rejectDocument(docDbId, rejectReason.trim());
      setRejectDoc(null);
      setRejectReason('');
      await fetchStudentById(studentId);
    } catch (e) {
      Alert.alert('Failed', e?.message || 'Could not reject document.');
    } finally {
      setBusyDocId(null);
    }
  };

  if (isLoading && !student) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Student Detail" onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1D4ED8" />
        </View>
      </SafeAreaView>
    );
  }

  if (!student) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Student Detail" onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Student not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title={student.name || 'Student Detail'}
        subtitle={student.uniqueId}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.tabRow}>
        {['profile', 'documents'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'profile' ? '👤  Profile' : '📄  Documents'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {tab === 'profile' ? (
          <>
            <ProfileCard student={student} />
            <VerificationControls
              student={student}
              currentStatus={student.verificationStatus}
              loading={actionLoading}
              onApprove={(s)        => verifyStudent(s.id)}
              onReject={(s, reason) => rejectStudent(s.id, reason)}
              onReset={(s)          => resetStudentStatus(s.id)}
            />
          </>
        ) : (
          <DocumentStatusList
            documents={student.documents || []}
            showFilter
            onApprovePress={handleApproveDoc}
            onRejectPress={openRejectModal}
            busyDocId={busyDocId}
          />
        )}
        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal
        visible={!!rejectDoc}
        onClose={() => setRejectDoc(null)}
        title="Reject document"
        subtitle={rejectDoc?.title || ''}
        icon="⚠️"
        size="md"
        footer={
          <TouchableOpacity
            style={styles.rejectSubmitBtn}
            onPress={submitReject}
            disabled={!rejectReason.trim() || busyDocId}
          >
            <Text style={styles.rejectSubmitText}>
              {busyDocId ? 'Rejecting…' : 'Reject Document'}
            </Text>
          </TouchableOpacity>
        }
      >
        <Text style={styles.rejectHint}>
          Tell the student why this document was rejected so they can re-upload.
        </Text>
        <Input
          label="Reason"
          value={rejectReason}
          onChangeText={setRejectReason}
          placeholder="e.g. Image is blurry, name doesn't match, expired document…"
          multiline
          numberOfLines={4}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: '#F8FAFC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText:{ fontSize: 15, color: '#94A3B8' },
  tabRow: {
    flexDirection:    'row',
    marginHorizontal: 16,
    marginVertical:   12,
    backgroundColor:  '#F1F5F9',
    borderRadius:     10,
    padding:          4,
  },
  tab: {
    flex:            1,
    paddingVertical: 10,
    borderRadius:    8,
    alignItems:      'center',
  },
  tabActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  tabText:       { fontSize: 13, color: '#64748B', fontWeight: '600' },
  tabTextActive: { color: '#1D4ED8', fontWeight: '700' },
  rejectHint:    { fontSize: 13, color: '#64748B', marginBottom: 12 },
  rejectSubmitBtn: { backgroundColor: '#BE123C', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  rejectSubmitText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});

export default StudentDetailScreen;
