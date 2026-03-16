import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  SafeAreaView, TouchableOpacity, RefreshControl,
} from 'react-native';
import Header              from '../../components/common/Header';
import VerificationControls from '../../components/admin/VerificationControls';
import Loading             from '../../components/common/Loading';
import { useStudents }     from '../../hooks/useStudents';
import { SCREENS }         from '../../constants/config';

const VerificationScreen = ({ navigation, route }) => {
  const passedStudent = route?.params?.student || null;

  const {
    students, isLoading, fetchStudents,
    verifyStudent, rejectStudent, resetStudentStatus,
    actionLoading,
  } = useStudents();

  const [refreshing, setRefreshing] = useState(false);
  const [activeId,   setActiveId]   = useState(passedStudent?.id || null);

  useEffect(() => {
    fetchStudents({ status: 'pending' });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStudents({ status: 'pending' });
    setRefreshing(false);
  };

  const pendingStudents = students.filter((s) => s.verificationStatus === 'pending');

  // If a specific student was passed, show their detail view
  if (passedStudent || activeId) {
    const student = pendingStudents.find((s) => s.id === activeId) || passedStudent;

    return (
      <SafeAreaView style={styles.safe}>
        <Header
          title="Verify Student"
          subtitle={student?.name}
          onBack={() => { setActiveId(null); navigation.goBack(); }}
        />
        <View style={{ flex: 1 }}>
          {student ? (
            <>
              {/* Student info summary */}
              <View style={styles.studentSummary}>
                <View style={styles.summaryAvatar}>
                  <Text style={styles.summaryAvatarText}>
                    {(student.name || '?').slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text style={styles.summaryName}>{student.name}</Text>
                  <Text style={styles.summaryMeta}>{student.branch} · {student.rollNumber}</Text>
                  <Text style={styles.summaryEmail}>{student.email}</Text>
                </View>
              </View>

              <VerificationControls
                student={student}
                currentStatus={student.verificationStatus}
                loading={actionLoading}
                onApprove={async (s) => {
                  await verifyStudent(s.id);
                  setActiveId(null);
                  navigation.goBack();
                }}
                onReject={async (s, reason) => {
                  await rejectStudent(s.id, reason);
                  setActiveId(null);
                  navigation.goBack();
                }}
                onReset={(s) => resetStudentStatus(s.id)}
              />

              <TouchableOpacity
                style={styles.viewDocsBtn}
                onPress={() => navigation.navigate(SCREENS.STUDENT_DETAIL, { studentId: student.id, student })}
              >
                <Text style={styles.viewDocsBtnText}>📄  View Full Profile & Documents</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>Student not found.</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Default: list of pending students
  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Verification" subtitle={`${pendingStudents.length} pending`} onBack={() => navigation.goBack()} />

      {isLoading && !refreshing ? (
        <Loading variant="fullscreen" message="Loading pending students…" />
      ) : (
        <FlatList
          data={pendingStudents}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1D4ED8']} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyIcon}>🎉</Text>
              <Text style={styles.emptyTitle}>All Caught Up!</Text>
              <Text style={styles.emptySubtitle}>No students pending verification.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.pendingCard}
              onPress={() => setActiveId(item.id)}
              activeOpacity={0.8}
            >
              <View style={styles.pendingAvatar}>
                <Text style={styles.pendingAvatarText}>
                  {(item.name || '?').slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={styles.pendingInfo}>
                <Text style={styles.pendingName}>{item.name}</Text>
                <Text style={styles.pendingMeta}>{item.branch} · {item.rollNumber}</Text>
                <Text style={styles.pendingEmail}>{item.email}</Text>
              </View>
              <View style={styles.pendingArrow}>
                <Text style={styles.pendingArrowText}>›</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: '#F8FAFC' },
  list:         { padding: 16, flexGrow: 1 },
  centered:     { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyIcon:    { fontSize: 48, marginBottom: 12 },
  emptyTitle:   { fontSize: 17, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  emptySubtitle:{ fontSize: 13, color: '#94A3B8' },
  emptyText:    { fontSize: 14, color: '#94A3B8' },
  pendingCard: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: '#FFFFFF',
    borderRadius:    12,
    padding:         14,
    marginBottom:    10,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.06,
    shadowRadius:    8,
    elevation:       2,
  },
  pendingAvatar: {
    width:           44,
    height:          44,
    borderRadius:    22,
    backgroundColor: '#FFF7ED',
    justifyContent:  'center',
    alignItems:      'center',
    marginRight:     12,
  },
  pendingAvatarText: { fontSize: 15, fontWeight: '800', color: '#C2410C' },
  pendingInfo:       { flex: 1 },
  pendingName:       { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  pendingMeta:       { fontSize: 12, color: '#64748B', marginTop: 2 },
  pendingEmail:      { fontSize: 12, color: '#94A3B8', marginTop: 1 },
  pendingArrow:      { paddingLeft: 8 },
  pendingArrowText:  { fontSize: 24, color: '#CBD5E1', fontWeight: '300' },
  studentSummary: {
    flexDirection:    'row',
    alignItems:       'center',
    backgroundColor:  '#FFFFFF',
    marginHorizontal: 16,
    marginTop:        16,
    padding:          16,
    borderRadius:     14,
    shadowColor:      '#000',
    shadowOffset:     { width: 0, height: 2 },
    shadowOpacity:    0.06,
    shadowRadius:     8,
    elevation:        2,
    gap:              14,
  },
  summaryAvatar: {
    width:           52,
    height:          52,
    borderRadius:    26,
    backgroundColor: '#DBEAFE',
    justifyContent:  'center',
    alignItems:      'center',
  },
  summaryAvatarText: { fontSize: 18, fontWeight: '800', color: '#1D4ED8' },
  summaryName:       { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  summaryMeta:       { fontSize: 12, color: '#64748B', marginTop: 2 },
  summaryEmail:      { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  viewDocsBtn: {
    marginHorizontal: 16,
    marginTop:        12,
    backgroundColor:  '#F8FAFC',
    borderRadius:     12,
    paddingVertical:  14,
    alignItems:       'center',
    borderWidth:      1.5,
    borderColor:      '#E2E8F0',
  },
  viewDocsBtnText: { fontSize: 14, color: '#1D4ED8', fontWeight: '600' },
});

export default VerificationScreen;