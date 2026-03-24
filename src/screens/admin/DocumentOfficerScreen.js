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

const DOCUMENT_TYPES = [
  { id: "photo", label: "Student Photo", required: true },
  { id: "aadhar", label: "Aadhar Card", required: true },
  { id: "marksheet", label: "10th Marksheet", required: true },
  { id: "intermediate", label: "Intermediate Marksheet", required: true },
  { id: "transfer", label: "Transfer Certificate", required: false },
  { id: "income", label: "Income Certificate", required: false },
  { id: "caste", label: "Caste Certificate", required: false },
];

const DocumentOfficerScreen = ({ navigation }) => {
  const { admin } = useAdmin();
  const { theme } = useTheme();
  const colors = theme.colors;
  const { fetchStudents, students } = useStudents();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("incomplete");

  const studentsWithDocs = students.filter(
    (s) => s.documents && s.documents.length > 0,
  );
  const studentsWithoutDocs = students.filter(
    (s) => !s.documents || s.documents.length === 0,
  );

  const displayStudents =
    filter === "incomplete" ? studentsWithoutDocs : studentsWithDocs;

  useEffect(() => {
    fetchStudents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
    setRefreshing(false);
  };

  const getDocStatus = (student) => {
    if (!student.documents || student.documents.length === 0) return "missing";
    const uploaded = student.documents.length;
    const total = DOCUMENT_TYPES.filter((d) => d.required).length;
    if (uploaded >= total) return "complete";
    return "partial";
  };

  const renderItem = ({ item }) => {
    const status = getDocStatus(item);
    return (
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
        <View
          style={[
            styles.statusBadge,
            status === "complete" && { backgroundColor: "#F0FDF4" },
            status === "partial" && { backgroundColor: "#FFF7ED" },
            status === "missing" && { backgroundColor: "#FFF1F2" },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              status === "complete" && { color: "#15803D" },
              status === "partial" && { color: "#C2410C" },
              status === "missing" && { color: "#BE123C" },
            ]}
          >
            {status === "complete"
              ? "Complete"
              : status === "partial"
                ? "Partial"
                : "Missing"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
              {admin?.name || "Document Officer"}
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
            <Text style={[styles.statValue, { color: "#BE123C" }]}>
              {studentsWithoutDocs.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Missing
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#C2410C" }]}>
              {
                studentsWithDocs.filter((s) => getDocStatus(s) === "partial")
                  .length
              }
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Partial
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#15803D" }]}>
              {
                studentsWithDocs.filter((s) => getDocStatus(s) === "complete")
                  .length
              }
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Complete
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.filterBar, { backgroundColor: colors.card }]}>
        {[
          { key: "incomplete", label: "Incomplete" },
          { key: "complete", label: "Complete" },
        ].map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterBtn,
              filter === f.key && styles.filterBtnActive,
            ]}
            onPress={() => setFilter(f.key)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f.key && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.docTypes, { backgroundColor: colors.card }]}>
        <Text style={[styles.docTypesTitle, { color: colors.text }]}>
          Document Requirements
        </Text>
        <View style={styles.docList}>
          {DOCUMENT_TYPES.map((doc) => (
            <View key={doc.id} style={styles.docItem}>
              <Text style={[styles.docLabel, { color: colors.textSecondary }]}>
                {doc.label}
              </Text>
              {doc.required && (
                <Text style={styles.requiredBadge}>Required</Text>
              )}
            </View>
          ))}
        </View>
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
  docTypes: { margin: 16, padding: 16, borderRadius: 12 },
  docTypesTitle: { fontSize: 14, fontWeight: "700", marginBottom: 12 },
  docList: { gap: 8 },
  docItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  docLabel: { fontSize: 13 },
  requiredBadge: {
    fontSize: 10,
    color: "#BE123C",
    backgroundColor: "#FFF1F2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
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
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: "600" },
  emptyBox: { alignItems: "center", paddingVertical: 40 },
  emptyText: { fontSize: 14 },
});

export default DocumentOfficerScreen;
