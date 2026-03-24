import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Alert,
} from "react-native";
import { useAdmin } from "../../context/AdminContext";
import { useStudents } from "../../hooks/useStudents";
import { useTheme } from "../../context/ThemeContext";
import { SCREENS } from "../../constants/config";
import adminService from "../../services/adminService";

const VerificationOfficerScreen = ({ navigation }) => {
  const { admin } = useAdmin();
  const { theme } = useTheme();
  const colors = theme.colors;
  const { fetchStudents, students, verifyStudent, rejectStudent } =
    useStudents();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("pending");

  const pendingStudents = students.filter(
    (s) => s.verificationStatus === "pending" || !s.verificationStatus,
  );
  const approvedStudents = students.filter(
    (s) => s.verificationStatus === "approved",
  );
  const rejectedStudents = students.filter(
    (s) => s.verificationStatus === "rejected",
  );

  const displayStudents =
    filter === "pending"
      ? pendingStudents
      : filter === "approved"
        ? approvedStudents
        : rejectedStudents;

  useEffect(() => {
    fetchStudents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
    setRefreshing(false);
  };

  const handleVerify = async (studentId) => {
    try {
      await verifyStudent(studentId);
      Alert.alert("Success", "Student verified successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to verify student");
    }
  };

  const handleReject = async (studentId) => {
    Alert.prompt(
      "Reject Student",
      "Enter reason for rejection",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async (reason) => {
            try {
              await rejectStudent(studentId, reason || "Documents not valid");
              Alert.alert("Success", "Student rejected");
            } catch (error) {
              Alert.alert("Error", "Failed to reject student");
            }
          },
        },
      ],
      "plain-text",
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.studentCard, { backgroundColor: colors.card }]}
      onPress={() =>
        navigation.navigate(SCREENS.STUDENT_DETAIL, { studentId: item.id })
      }
    >
      <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
        <Text style={[styles.avatarText, { color: colors.primary }]}>
          {(item.name || "?").slice(0, 2).toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {item.uniqueId} · {item.branch}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.verifyBtn, { backgroundColor: "#F0FDF4" }]}
          onPress={() => handleVerify(item.id)}
        >
          <Text style={{ color: "#15803D", fontWeight: "600", fontSize: 12 }}>
            Verify
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.rejectBtn, { backgroundColor: "#FFF1F2" }]}
          onPress={() => handleReject(item.id)}
        >
          <Text style={{ color: "#BE123C", fontWeight: "600", fontSize: 12 }}>
            Reject
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
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
              {admin?.name || "Verification Officer"}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.settingsBtn, { backgroundColor: colors.input }]}
            onPress={() => navigation.navigate(SCREENS.ADMIN_SETTINGS)}
          >
            <Text style={[styles.settingsIcon, { color: colors.text }]}>S</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#C2410C" }]}>
              {pendingStudents.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Pending
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#15803D" }]}>
              {approvedStudents.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Approved
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#BE123C" }]}>
              {rejectedStudents.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Rejected
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.filterBar, { backgroundColor: colors.card }]}>
        {["pending", "approved", "rejected"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={displayStudents}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1D4ED8"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No students found
            </Text>
          </View>
        }
      />
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
    marginBottom: 16,
  },
  greeting: { fontSize: 13, fontWeight: "500" },
  adminName: { fontSize: 22, fontWeight: "800", marginTop: 2 },
  settingsBtn: { padding: 10, borderRadius: 10 },
  settingsIcon: { fontSize: 18, fontWeight: "700" },
  statsRow: { flexDirection: "row", gap: 20 },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "800" },
  statLabel: { fontSize: 11, marginTop: 2 },
  filterBar: { flexDirection: "row", padding: 12, gap: 8 },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  filterBtnActive: { backgroundColor: "#1D4ED8" },
  filterText: { fontSize: 13, color: "#64748B", fontWeight: "600" },
  filterTextActive: { color: "#FFF" },
  list: { padding: 16 },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { fontSize: 14, fontWeight: "800" },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: "600" },
  meta: { fontSize: 12, marginTop: 2 },
  actions: { flexDirection: "row", gap: 8 },
  verifyBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  rejectBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  emptyBox: { alignItems: "center", paddingVertical: 40 },
  emptyText: { fontSize: 14 },
});

export default VerificationOfficerScreen;
