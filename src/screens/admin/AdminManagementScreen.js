import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import Header from "../../components/common/Header";
import { BRANCHES } from "../../constants/branches";
import {
  ADMIN_ROLE_LABELS,
  ADMIN_ROLE_COLORS,
} from "../../constants/adminRoles";
import { useTheme } from "../../context/ThemeContext";

const demoAdmins = [
  {
    id: "1",
    name: "Super Admin",
    email: "super@bvritn.ac.in",
    role: "super_admin",
    branchId: null,
  },
  ...BRANCHES.map((branch, idx) => ({
    id: `${branch.id}_ba_${idx}`,
    name: `${branch.shortName} Branch Admin`,
    email: `ba_${branch.id}@bvritn.ac.in`,
    role: "branch_admin",
    branchId: branch.id,
  })),
  ...Array.from({ length: 30 }, (_, vIdx) => ({
    id: `vo_${vIdx}`,
    name: `Verification Officer ${vIdx + 1}`,
    email: `vo_${vIdx}@bvritn.ac.in`,
    role: "verification_officer",
    branchId: null,
  })),
  ...Array.from({ length: 30 }, (_, dIdx) => ({
    id: `do_${dIdx}`,
    name: `Document Officer ${dIdx + 1}`,
    email: `do_${dIdx}@bvritn.ac.in`,
    role: "document_officer",
    branchId: null,
  })),
];

const AdminManagementScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [admins, setAdmins] = useState(demoAdmins);
  const [filterRole, setFilterRole] = useState("all");
  const [filterBranch, setFilterBranch] = useState("all");
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "branch_admin",
    branchId: "",
  });

  const filteredAdmins = admins.filter((admin) => {
    const roleMatch = filterRole === "all" || admin.role === filterRole;
    const branchMatch =
      filterBranch === "all" || admin.branchId === filterBranch;
    const searchMatch =
      !search ||
      admin.name.toLowerCase().includes(search.toLowerCase()) ||
      admin.email.toLowerCase().includes(search.toLowerCase());
    return roleMatch && branchMatch && searchMatch;
  });

  const getBranchName = (branchId) => {
    if (!branchId) return "All Branches";
    const branch = BRANCHES.find((b) => b.id === branchId);
    return branch ? branch.shortName : branchId;
  };

  const handleDelete = (admin) => {
    if (admin.role === "super_admin") {
      Alert.alert("Cannot Delete", "Super Admin cannot be deleted.");
      return;
    }
    Alert.alert(
      "Remove Admin",
      `Are you sure you want to remove "${admin.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () =>
            setAdmins((prev) => prev.filter((a) => a.id !== admin.id)),
        },
      ],
    );
  };

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    setAdmins((prev) => [...prev, { id: `admin_${Date.now()}`, ...newAdmin }]);
    setModalVisible(false);
    setNewAdmin({ name: "", email: "", role: "branch_admin", branchId: "" });
  };

  const renderItem = ({ item }) => {
    const roleColor = ADMIN_ROLE_COLORS[item.role] || ADMIN_ROLE_COLORS.viewer;
    return (
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <View style={[styles.roleBadge, { backgroundColor: roleColor.bg }]}>
              <Text style={[styles.roleBadgeText, { color: roleColor.text }]}>
                {ADMIN_ROLE_LABELS[item.role] || item.role}
              </Text>
            </View>
            {item.branchId && (
              <Text
                style={[styles.branchText, { color: colors.textSecondary }]}
              >
                {getBranchName(item.branchId)}
              </Text>
            )}
          </View>
          <Text style={[styles.adminName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.adminEmail, { color: colors.textSecondary }]}>
            {item.email}
          </Text>
        </View>
        <View style={[styles.cardActions, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.deleteBtnText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const roles = [
    "all",
    "super_admin",
    "branch_admin",
    "verification_officer",
    "document_officer",
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Header
        title="Admin Management"
        subtitle={`${filteredAdmins.length} admins`}
        onBack={() => navigation.goBack()}
      />

      <View
        style={[
          styles.filters,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <TextInput
          style={[
            styles.searchInput,
            { backgroundColor: colors.input, color: colors.text },
          ]}
          placeholder="Search admins..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        <FlatList
          horizontal
          data={roles}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterRole === item && styles.filterChipActive,
              ]}
              onPress={() => setFilterRole(item)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterRole === item && styles.filterChipTextActive,
                ]}
              >
                {item === "all" ? "All" : ADMIN_ROLE_LABELS[item]}
              </Text>
            </TouchableOpacity>
          )}
        />
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filterBranch === "all" && styles.filterChipActive,
            ]}
            onPress={() => setFilterBranch("all")}
          >
            <Text
              style={[
                styles.filterChipText,
                filterBranch === "all" && styles.filterChipTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {BRANCHES.map((branch) => (
            <TouchableOpacity
              key={branch.id}
              style={[
                styles.filterChip,
                filterBranch === branch.id && styles.filterChipActive,
              ]}
              onPress={() => setFilterBranch(branch.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterBranch === branch.id && styles.filterChipTextActive,
                ]}
              >
                {branch.shortName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredAdmins}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No admins found.
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+ Add Admin</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add New Admin
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.input, color: colors.text },
              ]}
              placeholder="Name"
              placeholderTextColor={colors.textSecondary}
              value={newAdmin.name}
              onChangeText={(text) => setNewAdmin({ ...newAdmin, name: text })}
            />
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.input, color: colors.text },
              ]}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={newAdmin.email}
              onChangeText={(text) => setNewAdmin({ ...newAdmin, email: text })}
              keyboardType="email-address"
            />
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Role
            </Text>
            <View style={styles.roleSelector}>
              {["branch_admin", "verification_officer", "document_officer"].map(
                (role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleOption,
                      newAdmin.role === role && styles.roleOptionActive,
                    ]}
                    onPress={() => setNewAdmin({ ...newAdmin, role })}
                  >
                    <Text
                      style={[
                        styles.roleOptionText,
                        newAdmin.role === role && styles.roleOptionTextActive,
                      ]}
                    >
                      {ADMIN_ROLE_LABELS[role]}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text
                  style={[
                    styles.cancelBtnText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddAdmin}>
                <Text style={styles.saveBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  filters: { padding: 16, borderBottomWidth: 1 },
  searchInput: { borderRadius: 8, padding: 10, fontSize: 14, marginBottom: 12 },
  filterRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    marginRight: 8,
  },
  filterChipActive: { backgroundColor: "#1D4ED8" },
  filterChipText: { fontSize: 12, color: "#64748B" },
  filterChipTextActive: { color: "#FFF", fontWeight: "600" },
  list: { padding: 16 },
  card: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardBody: { padding: 14 },
  cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
  },
  roleBadgeText: { fontSize: 11, fontWeight: "600" },
  branchText: { fontSize: 12 },
  adminName: { fontSize: 16, fontWeight: "700", marginBottom: 2 },
  adminEmail: { fontSize: 13 },
  cardActions: { flexDirection: "row", borderTopWidth: 1, padding: 8 },
  deleteBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6 },
  deleteBtnText: { fontSize: 12, color: "#BE123C", fontWeight: "600" },
  centered: { alignItems: "center", paddingVertical: 60 },
  emptyText: { fontSize: 14 },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#1D4ED8",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    elevation: 4,
  },
  fabText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  input: { borderRadius: 8, padding: 12, fontSize: 14, marginBottom: 12 },
  inputLabel: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  roleSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  roleOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  roleOptionActive: { backgroundColor: "#1D4ED8" },
  roleOptionText: { fontSize: 13, color: "#64748B" },
  roleOptionTextActive: { color: "#FFF", fontWeight: "600" },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
  cancelBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  cancelBtnText: { fontSize: 14, fontWeight: "600" },
  saveBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#1D4ED8",
  },
  saveBtnText: { fontSize: 14, color: "#FFF", fontWeight: "600" },
});

export default AdminManagementScreen;
