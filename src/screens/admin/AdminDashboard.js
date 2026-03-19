import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, RefreshControl, SafeAreaView, Platform,
} from 'react-native';
import { useAdmin }    from '../../context/AdminContext';
import { useStudents } from '../../hooks/useStudents';
import StatsCard       from '../../components/admin/StatsCard';
import { SCREENS }     from '../../constants/config';

const AdminDashboard = ({ navigation }) => {
  const { admin }                          = useAdmin();
  const { fetchStudents, fetchStats, stats,
          studentStats, isLoading, students } = useStudents();
  const [refreshing, setRefreshing]        = React.useState(false);

  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
    await fetchStats();
    setRefreshing(false);
  };

  const recentStudents = [...students]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1D4ED8']} />}
      >
        {/* Header */}
        <View style={styles.header}>

          {/* ✅ Hamburger menu — only on mobile */}
          {Platform.OS !== 'web' && (
            <TouchableOpacity
              style={styles.menuBtn}
              onPress={() => navigation.openDrawer()}
            >
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
          )}

          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Welcome back 👋</Text>
            <Text style={styles.adminName}>{admin?.name || 'Admin'}</Text>
            <Text style={styles.role}>{admin?.role || 'Administrator'}</Text>
          </View>

          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => navigation.navigate(SCREENS.ADMIN_SETTINGS)}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>

        </View>

        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatsCard
              title="Total Students"
              value={studentStats.total}
              icon="🎓"
              color="#1D4ED8"
              subtitle="All registered"
              trend={stats?.totalTrend}
            />
            <StatsCard
              title="Verified"
              value={studentStats.approved}
              icon="✅"
              color="#15803D"
              subtitle="Approved"
              trend={stats?.approvedTrend}
            />
          </View>
          <View style={styles.statsRow}>
            <StatsCard
              title="Pending"
              value={studentStats.pending}
              icon="⏳"
              color="#C2410C"
              subtitle="Awaiting review"
            />
            <StatsCard
              title="Rejected"
              value={studentStats.rejected}
              icon="❌"
              color="#BE123C"
              subtitle="Needs attention"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {[
            { icon: '🎓', label: 'All Students', screen: SCREENS.STUDENT_LIST      },
            { icon: '✅', label: 'Verify Docs',  screen: SCREENS.VERIFICATION      },
            { icon: '🏫', label: 'Branches',     screen: SCREENS.BRANCH_MANAGEMENT },
            { icon: '⚙️', label: 'Settings',     screen: SCREENS.ADMIN_SETTINGS    },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.actionCard}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>{item.icon}</Text>
              <Text style={styles.actionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Students */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Students</Text>
          <TouchableOpacity onPress={() => navigation.navigate(SCREENS.STUDENT_LIST)}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentList}>
          {recentStudents.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No students yet.</Text>
            </View>
          ) : (
            recentStudents.map((student) => (
              <TouchableOpacity
                key={student.id}
                style={styles.recentItem}
                onPress={() => navigation.navigate(SCREENS.STUDENT_DETAIL, { studentId: student.id })}
                activeOpacity={0.8}
              >
                <View style={styles.recentAvatar}>
                  <Text style={styles.recentAvatarText}>
                    {(student.name || '?').slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentName}>{student.name}</Text>
                  <Text style={styles.recentMeta}>{student.branch} · {student.rollNumber}</Text>
                </View>
                <View style={[
                  styles.recentBadge,
                  student.verificationStatus === 'approved' && { backgroundColor: '#F0FDF4' },
                  student.verificationStatus === 'pending'  && { backgroundColor: '#FFF7ED' },
                  student.verificationStatus === 'rejected' && { backgroundColor: '#FFF1F2' },
                ]}>
                  <Text style={[
                    styles.recentBadgeText,
                    student.verificationStatus === 'approved' && { color: '#15803D' },
                    student.verificationStatus === 'pending'  && { color: '#C2410C' },
                    student.verificationStatus === 'rejected' && { color: '#BE123C' },
                  ]}>
                    {student.verificationStatus || 'incomplete'}
                  </Text>
                </View>
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
  safe:      { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  header: {
    flexDirection:     'row',
    justifyContent:    'space-between',
    alignItems:        'flex-start',
    paddingHorizontal: 20,
    paddingTop:        20,
    paddingBottom:     16,
    backgroundColor:   '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuBtn:   { padding: 8, marginRight: 12, justifyContent: 'center' },  // ✅ new
  menuIcon:  { fontSize: 22, color: '#0F172A' },                          // ✅ new
  greeting:  { fontSize: 13, color: '#94A3B8', fontWeight: '500' },
  adminName: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginTop: 2 },
  role:      { fontSize: 12, color: '#1D4ED8', fontWeight: '600', marginTop: 2 },
  settingsBtn:   { padding: 8, backgroundColor: '#F1F5F9', borderRadius: 10 },
  settingsIcon:  { fontSize: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 20, marginBottom: 4 },
  sectionTitle:  { fontSize: 16, fontWeight: '700', color: '#0F172A', paddingHorizontal: 20, marginTop: 20, marginBottom: 10 },
  seeAll:        { fontSize: 13, color: '#1D4ED8', fontWeight: '600' },
  statsGrid:     { paddingHorizontal: 12 },
  statsRow:      { flexDirection: 'row', marginBottom: 4 },
  actionsGrid: {
    flexDirection:    'row',
    flexWrap:         'wrap',
    paddingHorizontal: 16,
    gap:              10,
  },
  actionCard: {
    width:           '22%',
    aspectRatio:     1,
    backgroundColor: '#FFFFFF',
    borderRadius:    14,
    justifyContent:  'center',
    alignItems:      'center',
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.06,
    shadowRadius:    8,
    elevation:       2,
  },
  actionIcon:  { fontSize: 26, marginBottom: 4 },
  actionLabel: { fontSize: 10, color: '#334155', fontWeight: '600', textAlign: 'center' },
  recentList:  { paddingHorizontal: 16, marginTop: 8 },
  recentItem: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: '#FFFFFF',
    borderRadius:    12,
    padding:         12,
    marginBottom:    8,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.04,
    shadowRadius:    4,
    elevation:       1,
  },
  recentAvatar: {
    width:           40,
    height:          40,
    borderRadius:    20,
    backgroundColor: '#DBEAFE',
    justifyContent:  'center',
    alignItems:      'center',
    marginRight:     12,
  },
  recentAvatarText: { fontSize: 14, fontWeight: '800', color: '#1D4ED8' },
  recentInfo:       { flex: 1 },
  recentName:       { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  recentMeta:       { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  recentBadge:      { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: '#F1F5F9' },
  recentBadgeText:  { fontSize: 11, fontWeight: '600', color: '#64748B', textTransform: 'capitalize' },
  emptyBox:         { alignItems: 'center', paddingVertical: 30 },
  emptyText:        { fontSize: 14, color: '#94A3B8' },
});

export default AdminDashboard;