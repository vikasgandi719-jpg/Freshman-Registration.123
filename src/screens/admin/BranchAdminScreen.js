import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  FlatList,
} from "react-native";
import { useAdmin } from "../../context/AdminContext";
import { useStudents } from "../../hooks/useStudents";
import { useTheme } from "../../context/ThemeContext";
import { BRANCHES } from "../../constants/branches";
import { ADMIN_ROLE_LABELS } from "../../constants/adminRoles";
import { SCREENS } from "../../constants/config";

const BranchAdminScreen = ({ navigation }) => {
  const { admin } = useAdmin();
  const { theme } = useTheme();
  const colors = theme.colors;
  const { fetchStudents, students, studentStats } = useStudents();
  const [refreshing, setRefreshing] = useState(false);

  const branch = BRANCHES.find((b) => b.id === admin?.branchId) || BRANCHES[0];
  const branchStudents = students.filter((s) => s.branchCode === branch.code);

  const stats = {
    total: branchStudents.length,
    approved: branchStudents.filter((s) => s.verificationStatus === "approved")
      .length,
    pending: branchStudents.filter((s) => s.verificationStatus === "pending")
      .length,
    rejected: branchStudents.filter((s) => s.verificationStatus === "rejected")
      .length,
    incomplete: branchStudents.filter(
      (s) => s.verificationStatus === "incomplete" || !s.verificationStatus,
    ).length,
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
    setRefreshing(false);
  };

  const recentStudents = [...branchStudents]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
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
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                Welcome back
              </Text>
              <Text style={[styles.adminName, { color: colors.text }]}>
                {admin?.name || "Branch Admin"}
              </Text>
              <View
                style={[
                  styles.branchBadge,
                  { backgroundColor: colors.primaryLight },
                ]}
              >
                <Text
                  style={[styles.branchBadgeText, { color: colors.primary }]}
                >
                  {branch.shortName} Branch
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.settingsBtn, { backgroundColor: colors.input }]}
              onPress={() => navigation.navigate(SCREENS.ADMIN_SETTINGS)}
            >
              <Text style={[styles.settingsIcon, { color: colors.text }]}>
                S
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Branch Overview - {branch.name}
          </Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.statValue, { color: "#1D4ED8" }]}>
                {stats.total}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Total Students
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.statValue, { color: "#15803D" }]}>
                {stats.approved}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Verified
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.statValue, { color: "#C2410C" }]}>
                {stats.pending}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Pending
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.statValue, { color: "#BE123C" }]}>
                {stats.rejected}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Rejected
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.studentsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Students in {branch.shortName}
            </Text>
            <Text
              style={[styles.studentCount, { color: colors.textSecondary }]}
            >
              {branchStudents.length} students
            </Text>
          </View>

          {recentStudents.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.card }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No students in this branch yet.
              </Text>
            </View>
          ) : (
            recentStudents.map((student) => (
              <TouchableOpacity
                key={student.id}
                style={[styles.studentItem, { backgroundColor: colors.card }]}
                onPress={() =>
                  navigation.navigate(SCREENS.STUDENT_DETAIL, {
                    studentId: student.id,
                  })
                }
              >
                <View
                  style={[
                    styles.studentAvatar,
                    { backgroundColor: colors.primaryLight },
                  ]}
                >
                  <Text
                    style={[
                      styles.studentAvatarText,
                      { color: colors.primary },
                    ]}
                  >
                    {(student.name || "?").slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.studentInfo}>
                  <Text style={[styles.studentName, { color: colors.text }]}>
                    {student.name}
                  </Text>
                  <Text
                    style={[
                      styles.studentMeta,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {student.uniqueId}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
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
                      styles.statusText,
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
  header: { padding: 20, borderBottomWidth: 1 },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: { fontSize: 13, fontWeight: "500" },
  adminName: { fontSize: 22, fontWeight: "800", marginTop: 2 },
  branchBadge: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  branchBadgeText: { fontSize: 12, fontWeight: "600" },
  settingsBtn: { padding: 10, borderRadius: 10 },
  settingsIcon: { fontSize: 18, fontWeight: "700" },
  statsSection: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statValue: { fontSize: 28, fontWeight: "800" },
  statLabel: { fontSize: 12, marginTop: 4 },
  studentsSection: { padding: 16 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  studentCount: { fontSize: 13 },
  emptyBox: { padding: 30, borderRadius: 12, alignItems: "center" },
  emptyText: { fontSize: 14 },
  studentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  studentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  studentAvatarText: { fontSize: 14, fontWeight: "800" },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 14, fontWeight: "600" },
  studentMeta: { fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: "600", textTransform: "capitalize" },
});

export default BranchAdminScreen;
