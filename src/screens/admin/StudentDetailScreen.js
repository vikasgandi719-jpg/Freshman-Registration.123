import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  SafeAreaView, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import Header              from '../../components/common/Header';
import ProfileCard         from '../../components/student/ProfileCard';
import DocumentStatusList  from '../../components/student/DocumentStatusList';
import VerificationControls from '../../components/admin/VerificationControls';
import { useStudents }     from '../../hooks/useStudents';

const StudentDetailScreen = ({ navigation, route }) => {
  const { studentId, student: passedStudent } = route.params || {};
  const { fetchStudentById, verifyStudent, rejectStudent,
          resetStudentStatus, selectedStudent, isLoading, actionLoading } = useStudents();

  const [tab, setTab] = useState('profile'); // 'profile' | 'documents'

  useEffect(() => {
    if (studentId) fetchStudentById(studentId);
  }, [studentId]);

  const student = selectedStudent || passedStudent;

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
        subtitle={student.rollNumber}
        onBack={() => navigation.goBack()}
      />

      {/* Tab toggle */}
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
              onApprove={(s)       => verifyStudent(s.id)}
              onReject={(s, reason)=> rejectStudent(s.id, reason)}
              onReset={(s)         => resetStudentStatus(s.id)}
            />
          </>
        ) : (
          <DocumentStatusList
            documents={student.documents || []}
            showFilter
          />
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
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
});

export default StudentDetailScreen;