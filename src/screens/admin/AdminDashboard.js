import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Platform,
} from "react-native";
import { useAdmin } from "../../context/AdminContext";
import { useStudents } from "../../hooks/useStudents";
import { useTheme } from "../../context/ThemeContext";
import StatsCard from "../../components/admin/StatsCard";
import { SCREENS } from "../../constants/config";

const AdminDashboard = ({ navigation }) => {
  const { admin } = useAdmin();
  const {
    fetchStudents,
    fetchStats,
    stats,
    studentStats,
    isLoading,
    students,
  } = useStudents();
  const { theme } = useTheme();
  const colors = theme.colors;
  const [refreshing, setRefreshing] = React.useState(false);

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
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1D4ED8"]}
          />
        }
      >
        <View
          style={[
            styles.header,
            { backgroundColor: colors.card, borderBottomColor: colors.border },
          ]}
        >
          {Platform.OS !== "web" && (
            <TouchableOpacity
              style={styles.menuBtn}
              onPress={() => navigation.openDrawer()}
            >
              <Text style={[styles.menuIcon, { color: colors.text }]}>M</Text>
            </TouchableOpacity>
          )}

          <View style={{ flex: 1 }}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              Welcome back
            </Text>
            <Text style={[styles.adminName, { color: colors.text }]}>
              {admin?.name || "Admin"}
            </Text>
            <Text style={[styles.role, { color: colors.primary }]}>
              {admin?.role || "Administrator"}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.settingsBtn, { backgroundColor: colors.input }]}
            onPress={() => navigation.navigate(SCREENS.ADMIN_SETTINGS)}
          >
            <Text style={[styles.settingsIcon, { color: colors.text }]}>S</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Overview
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatsCard
              title="Total Students"
              value={studentStats.total}
              icon="T"
              color="#1D4ED8"
              subtitle="All registered"
              trend={stats?.totalTrend}
            />
            <StatsCard
              title="Verified"
              value={studentStats.approved}
              icon="V"
              color="#15803D"
              subtitle="Approved"
              trend={stats?.approvedTrend}
            />
          </View>
          <View style={styles.statsRow}>
            <StatsCard
              title="Pending"
              value={studentStats.pending}
              icon="P"
              color="#C2410C"
              subtitle="Awaiting review"
            />
            <StatsCard
              title="Rejected"
              value={studentStats.rejected}
              icon="R"
              color="#BE123C"
              subtitle="Needs attention"
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Quick Actions
        </Text>
        <View style={styles.actionsGrid}>
          {[
            { icon: "S", label: "All Students", screen: SCREENS.STUDENT_LIST },
            { icon: "V", label: "Verify Docs", screen: SCREENS.VERIFICATION },
            { icon: "B", label: "Branches", screen: SCREENS.BRANCH_MANAGEMENT },
            { icon: "G", label: "Settings", screen: SCREENS.ADMIN_SETTINGS },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.actionCard, { backgroundColor: colors.card }]}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.8}
            >
              <Text style={[styles.actionIcon, { color: colors.primary }]}>
                {item.icon}
              </Text>
              <Text style={[styles.actionLabel, { color: colors.text }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Students
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(SCREENS.STUDENT_LIST)}
          >
            <Text style={[styles.seeAll, { color: colors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentList}>
          {recentStudents.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.card }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No students yet.
              </Text>
            </View>
          ) : (
            recentStudents.map((student) => (
              <TouchableOpacity
                key={student.id}
                style={[styles.recentItem, { backgroundColor: colors.card }]}
                onPress={() =>
                  navigation.navigate(SCREENS.STUDENT_DETAIL, {
                    studentId: student.id,
                  })
                }
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.recentAvatar,
                    { backgroundColor: colors.primaryLight },
                  ]}
                >
                  <Text
                    style={[styles.recentAvatarText, { color: colors.primary }]}
                  >
                    {(student.name || "?").slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.recentInfo}>
                  <Text style={[styles.recentName, { color: colors.text }]}>
                    {student.name}
                  </Text>
                  <Text
                    style={[styles.recentMeta, { color: colors.textSecondary }]}
                  >
                    {student.branch} · {student.rollNumber}
                  </Text>
                </View>
                <View
                  style={[
                    styles.recentBadge,
                    student.verificationStatus === "approved" && {
                      backgroundColor: "#F0FDF4",
                    },
                    student.verificationStatus === "pending" && {
                      backgroundColor: "#FFF7ED",
                    },
                    student.verificationStatus === "rejected" && {
                      backgroundColor: "#FFF1F2",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.recentBadgeText,
                      student.verificationStatus === "approved" && {
                        color: "#15803D",
                      },
                      student.verificationStatus === "pending" && {
                        color: "#C2410C",
                      },
                      student.verificationStatus === "rejected" && {
                        color: "#BE123C",
                      },
                    ]}
                  >
                    {student.verificationStatus || "incomplete"}
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
  safe: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  menuBtn: { padding: 8, marginRight: 12, justifyContent: "center" },
  menuIcon: { fontSize: 22, fontWeight: "700" },
  greeting: { fontSize: 13, fontWeight: "500" },
  adminName: { fontSize: 22, fontWeight: "800", marginTop: 2 },
  role: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  settingsBtn: { padding: 10, borderRadius: 10 },
  settingsIcon: { fontSize: 18, fontWeight: "700" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  seeAll: { fontSize: 13, fontWeight: "600" },
  statsGrid: { paddingHorizontal: 12 },
  statsRow: { flexDirection: "row", marginBottom: 4 },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 10,
  },
  actionCard: {
    width: "22%",
    aspectRatio: 1,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  actionLabel: { fontSize: 10, fontWeight: "600", textAlign: "center" },
  recentList: { paddingHorizontal: 16, marginTop: 8 },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  recentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recentAvatarText: { fontSize: 14, fontWeight: "800" },
  recentInfo: { flex: 1 },
  recentName: { fontSize: 14, fontWeight: "600" },
  recentMeta: { fontSize: 12, marginTop: 2 },
  recentBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  recentBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  emptyBox: { alignItems: "center", paddingVertical: 30, borderRadius: 12 },
  emptyText: { fontSize: 14 },
});

export default AdminDashboard;
