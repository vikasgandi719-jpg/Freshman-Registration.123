import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, RefreshControl,
} from 'react-native';
import { useAuth }    from '../../context/AuthContext';
import { useStudent } from '../../context/StudentContext';
import useDocuments   from '../../hooks/useDocuments';
import StatusBadge    from '../../components/common/StatusBadge';
import { SCREENS }    from '../../constants/config';

const StudentDashboard = ({ navigation }) => {
  const { user }                                    = useAuth();
  const { profile, documentStats }                  = useStudent();
  const { documents, fetchDocuments, isLoading }    = useDocuments();
  const [refreshing, setRefreshing]                 = useState(false);

  useEffect(() => {
    if (user?.id) fetchDocuments(user.id);
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (user?.id) await fetchDocuments(user.id);
    setRefreshing(false);
  };

  const student = profile || user || {};

  const pendingDocs  = documents.filter((d) => d.status === 'not_uploaded' || d.status === 'rejected');
  const recentDocs   = [...documents].slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1D4ED8']} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.studentName} numberOfLines={1}>
              {student.name || 'Student'}
            </Text>
            <Text style={styles.rollNumber}>{student.rollNumber || ''}</Text>
          </View>

          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => navigation.navigate(SCREENS.PROFILE)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(student.name || 'S').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </Text>
            </View>
            <StatusBadge
              status={student.verificationStatus || 'incomplete'}
              size="sm"
              showDot
              style={styles.verificationBadge}
            />
          </TouchableOpacity>
        </View>

        {/* Verification status card */}
        <View style={[
          styles.statusCard,
          student.verificationStatus === 'approved' && styles.statusCardApproved,
          student.verificationStatus === 'rejected' && styles.statusCardRejected,
          student.verificationStatus === 'pending'  && styles.statusCardPending,
        ]}>
          <Text style={styles.statusCardIcon}>
            {student.verificationStatus === 'approved' ? '✅'
              : student.verificationStatus === 'rejected' ? '❌'
              : student.verificationStatus === 'pending'  ? '⏳'
              : '📋'}
          </Text>
          <View style={styles.statusCardInfo}>
            <Text style={styles.statusCardTitle}>
              {student.verificationStatus === 'approved' ? 'Profile Verified!'
                : student.verificationStatus === 'rejected' ? 'Verification Rejected'
                : student.verificationStatus === 'pending'  ? 'Under Review'
                : 'Complete Your Profile'}
            </Text>
            <Text style={styles.statusCardSubtitle}>
              {student.verificationStatus === 'approved'
                ? 'All documents have been verified.'
                : student.verificationStatus === 'rejected'
                ? 'Some documents were rejected. Please re-upload.'
                : student.verificationStatus === 'pending'
                ? 'Your documents are being reviewed by admin.'
                : 'Upload all required documents to get verified.'}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Total',    value: documentStats.total,       color: '#1D4ED8' },
            { label: 'Approved', value: documentStats.approved,    color: '#15803D' },
            { label: 'Pending',  value: documentStats.pending,     color: '#C2410C' },
            { label: 'Rejected', value: documentStats.rejected,    color: '#BE123C' },
          ].map((stat) => (
            <View key={stat.label} style={[styles.statChip, { borderColor: stat.color }]}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          {[
            { icon: '📤', label: 'Upload\nDocuments', screen: SCREENS.DOCUMENT_UPLOAD, color: '#EFF6FF' },
            { icon: '👤', label: 'My\nProfile',       screen: SCREENS.PROFILE,         color: '#F0FDF4' },
            { icon: '📄', label: 'View\nDocuments',   screen: SCREENS.DOCUMENT_UPLOAD, color: '#FFF7ED' },
          ].map((action) => (
            <TouchableOpacity
              key={action.label}
              style={[styles.actionCard, { backgroundColor: action.color }]}
              onPress={() => navigation.navigate(action.screen)}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Attention required */}
        {pendingDocs.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⚠️  Action Required</Text>
              <TouchableOpacity onPress={() => navigation.navigate(SCREENS.DOCUMENT_UPLOAD)}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.attentionList}>
              {pendingDocs.slice(0, 3).map((doc) => (
                <TouchableOpacity
                  key={doc.id}
                  style={styles.attentionCard}
                  onPress={() => navigation.navigate(SCREENS.DOCUMENT_DETAIL, { document: doc })}
                  activeOpacity={0.8}
                >
                  <Text style={styles.attentionDocIcon}>
                    {doc.status === 'rejected' ? '❌' : '📤'}
                  </Text>
                  <View style={styles.attentionInfo}>
                    <Text style={styles.attentionTitle}>{doc.title}</Text>
                    <Text style={styles.attentionStatus}>
                      {doc.status === 'rejected' ? 'Rejected — Re-upload required' : 'Not uploaded yet'}
                    </Text>
                  </View>
                  <Text style={styles.attentionArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Recent Documents */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Documents</Text>
          <TouchableOpacity onPress={() => navigation.navigate(SCREENS.DOCUMENT_UPLOAD)}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentList}>
          {recentDocs.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>📂</Text>
              <Text style={styles.emptyText}>No documents uploaded yet.</Text>
              <TouchableOpacity
                style={styles.uploadNowBtn}
                onPress={() => navigation.navigate(SCREENS.DOCUMENT_UPLOAD)}
              >
                <Text style={styles.uploadNowBtnText}>Upload Now</Text>
              </TouchableOpacity>
            </View>
          ) : (
            recentDocs.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                style={styles.recentCard}
                onPress={() => navigation.navigate(SCREENS.DOCUMENT_DETAIL, { document: doc })}
                activeOpacity={0.8}
              >
                <Text style={styles.recentDocIcon}>
                  {doc.fileType?.includes('pdf') ? '📕' : doc.fileType?.includes('image') ? '🖼️' : '📄'}
                </Text>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentTitle} numberOfLines={1}>{doc.title}</Text>
                  <Text style={styles.recentDate}>
                    {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('en-IN') : 'Not uploaded'}
                  </Text>
                </View>
                <StatusBadge status={doc.status || 'not_uploaded'} size="sm" />
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection:     'row',
    justifyContent:    'space-between',
    alignItems:        'center',
    paddingHorizontal: 20,
    paddingTop:        20,
    paddingBottom:     16,
    backgroundColor:   '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft:    { flex: 1, marginRight: 12 },
  greeting:      { fontSize: 13, color: '#94A3B8', fontWeight: '500' },
  studentName:   { fontSize: 22, fontWeight: '800', color: '#0F172A', marginTop: 2 },
  rollNumber:    { fontSize: 12, color: '#64748B', marginTop: 2 },
  avatarBtn:     { position: 'relative' },
  avatar: {
    width:           48, height: 48, borderRadius: 24,
    backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center',
  },
  avatarText:         { fontSize: 16, fontWeight: '800', color: '#1D4ED8' },
  verificationBadge:  { position: 'absolute', bottom: -4, right: -4 },
  statusCard: {
    flexDirection:     'row',
    alignItems:        'center',
    margin:            16,
    padding:           16,
    borderRadius:      14,
    backgroundColor:   '#F8FAFC',
    gap:               12,
    borderWidth:       1,
    borderColor:       '#E2E8F0',
  },
  statusCardApproved: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
  statusCardRejected: { backgroundColor: '#FFF1F2', borderColor: '#FECDD3' },
  statusCardPending:  { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' },
  statusCardIcon:     { fontSize: 32 },
  statusCardInfo:     { flex: 1 },
  statusCardTitle:    { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  statusCardSubtitle: { fontSize: 12, color: '#64748B', marginTop: 3, lineHeight: 18 },
  statsRow: {
    flexDirection:     'row',
    justifyContent:    'space-between',
    paddingHorizontal: 16,
    marginBottom:      8,
    gap:               8,
  },
  statChip: {
    flex:             1,
    alignItems:       'center',
    paddingVertical:  10,
    borderRadius:     10,
    borderWidth:      1.5,
    backgroundColor:  '#FFFFFF',
  },
  statValue:      { fontSize: 20, fontWeight: '800' },
  statLabel:      { fontSize: 10, color: '#64748B', marginTop: 2, fontWeight: '500' },
  sectionHeader: {
    flexDirection:     'row',
    justifyContent:    'space-between',
    alignItems:        'center',
    paddingHorizontal: 20,
    marginTop:         16,
    marginBottom:      8,
  },
  sectionTitle:   { fontSize: 16, fontWeight: '700', color: '#0F172A', paddingHorizontal: 20, marginTop: 16, marginBottom: 10 },
  seeAll:         { fontSize: 13, color: '#1D4ED8', fontWeight: '600' },
  actionsRow: {
    flexDirection:     'row',
    paddingHorizontal: 16,
    gap:               10,
    marginBottom:      4,
  },
  actionCard: {
    flex:            1,
    paddingVertical: 16,
    borderRadius:    14,
    alignItems:      'center',
    justifyContent:  'center',
  },
  actionIcon:   { fontSize: 26, marginBottom: 6 },
  actionLabel:  { fontSize: 11, color: '#334155', fontWeight: '600', textAlign: 'center' },
  attentionList:{ paddingHorizontal: 16, gap: 8 },
  attentionCard: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: '#FFFBEB',
    borderRadius:    12,
    padding:         12,
    borderWidth:     1,
    borderColor:     '#FDE68A',
    gap:             12,
  },
  attentionDocIcon: { fontSize: 24 },
  attentionInfo:    { flex: 1 },
  attentionTitle:   { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  attentionStatus:  { fontSize: 12, color: '#92400E', marginTop: 2 },
  attentionArrow:   { fontSize: 22, color: '#CBD5E1' },
  recentList:       { paddingHorizontal: 16, gap: 8 },
  recentCard: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: '#FFFFFF',
    borderRadius:    12,
    padding:         12,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.04,
    shadowRadius:    4,
    elevation:       1,
    gap:             12,
  },
  recentDocIcon: { fontSize: 26 },
  recentInfo:    { flex: 1 },
  recentTitle:   { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  recentDate:    { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  emptyBox:      { alignItems: 'center', paddingVertical: 40, backgroundColor: '#FFFFFF', borderRadius: 14, marginHorizontal: 0 },
  emptyIcon:     { fontSize: 40, marginBottom: 10 },
  emptyText:     { fontSize: 14, color: '#94A3B8', marginBottom: 14 },
  uploadNowBtn:  { backgroundColor: '#1D4ED8', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  uploadNowBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});

export default StudentDashboard;