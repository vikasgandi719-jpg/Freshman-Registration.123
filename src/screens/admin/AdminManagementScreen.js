import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
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
import { useAdmin } from "../../context/AdminContext";

const ROLE_ICONS = {
  super_admin:          "🛡️",
  principal:            "🎓",
  branch_manager:       "🏫",
  verification_officer: "✅",
  officer:              "📄",
};

const FALLBACK_COLOR = { bg: "#F1F5F9", text: "#64748B", dot: "#94A3B8" };

const demoAdmins = [
  {
    id: "1",
    name: "Super Admin",
    email: "super@bvritn.ac.in",
    role: "super_admin",
    branchId: null,
  },
  ...Array.from({ length: 3 }, (_, i) => ({
    id: `principal_${i}`,
    name: `Principal ${i + 1}`,
    email: `principal_${i + 1}@bvritn.ac.in`,
    role: "principal",
    branchId: null,
  })),
  ...BRANCHES.map((branch) => ({
    id: `bm_${branch.id}`,
    name: `${branch.shortName} Branch Manager`,
    email: `bm_${branch.id}@bvritn.ac.in`,
    role: "branch_manager",
    branchId: branch.id,
  })),
  ...BRANCHES.flatMap((branch) =>
    [1, 2, 3].map((n) => ({
      id: `vo_${branch.id}_${n}`,
      name: `${branch.shortName} Verification Officer ${n}`,
      email: `vo_${branch.id}_${n}@bvritn.ac.in`,
      role: "verification_officer",
      branchId: branch.id,
    }))
  ),
  ...Array.from({ length: 3 }, (_, i) => ({
    id: `officer_${i + 1}`,
    name: `Officer ${i + 1}`,
    email: `officer_${i + 1}@bvritn.ac.in`,
    role: "officer",
    branchId: null,
  })),
];

const ROLE_FILTERS = [
  "all",
  "super_admin",
  "principal",
  "branch_manager",
  "verification_officer",
  "officer",
];

const ADDABLE_ROLES = [
  "principal",
  "branch_manager",
  "verification_officer",
  "officer",
];

const AdminManagementScreen = ({ navigation }) => {
  const { admin } = useAdmin();
  const isSuperAdmin = admin?.roleKey === "super_admin";

  const [admins,       setAdmins]       = useState(demoAdmins);
  const [filterRole,   setFilterRole]   = useState("all");
  const [filterBranch, setFilterBranch] = useState("all");
  const [search,       setSearch]       = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newAdmin,     setNewAdmin]     = useState({
    name: "", email: "", role: "branch_manager", branchId: "",
  });

  const filteredAdmins = admins.filter((admin) => {
    const roleMatch   = filterRole   === "all" || admin.role     === filterRole;
    const branchMatch = filterBranch === "all" || admin.branchId === filterBranch || admin.branchId === null;
    const searchMatch = !search ||
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
          onPress: () => setAdmins((prev) => prev.filter((a) => a.id !== admin.id)),
        },
      ]
    );
  };

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) {
      Alert.alert("Error", "Please fill in name and email.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAdmin.email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    const admin = {
      id:       `admin_${Date.now()}`,
      name:     newAdmin.name.trim(),
      email:    newAdmin.email.trim(),
      role:     newAdmin.role,
      branchId: newAdmin.branchId || null,
    };
    setAdmins((prev) => [...prev, admin]);
    setModalVisible(false);
    setNewAdmin({ name: "", email: "", role: "branch_manager", branchId: "" });
  };

  const renderItem = ({ item }) => {
    const roleColor = ADMIN_ROLE_COLORS[item.role] || FALLBACK_COLOR;
    const icon      = ROLE_ICONS[item.role] || "👤";

    return (
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <View style={[styles.roleBadge, { backgroundColor: roleColor.bg }]}>
              <Text style={styles.roleIcon}>{icon}</Text>
              <Text style={[styles.roleBadgeText, { color: roleColor.text }]}>
                {ADMIN_ROLE_LABELS[item.role] || item.role}
              </Text>
            </View>
            {item.branchId && (
              <View style={[styles.branchPill, { borderColor: roleColor.dot + "55" }]}>
                <Text style={[styles.branchText, { color: roleColor.text }]}>
                  {getBranchName(item.branchId)}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.adminName}>{item.name}</Text>
          <Text style={styles.adminEmail}>{item.email}</Text>
        </View>
        <View style={styles.cardActions}>
          {item.role !== "super_admin" && isSuperAdmin && (
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
              <Text style={styles.deleteBtnText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="Admin Management"
        subtitle={`${filteredAdmins.length} of ${admins.length} admins`}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.filters}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search admins..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
        <FlatList
          horizontal
          data={ROLE_FILTERS}
          keyExtractor={(r) => r}
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 8 }}
          renderItem={({ item: role }) => (
            <TouchableOpacity
              style={[styles.filterChip, filterRole === role && styles.filterChipActive]}
              onPress={() => setFilterRole(role)}
            >
              {role !== "all" && (
                <Text style={styles.filterChipIcon}>{ROLE_ICONS[role]}</Text>
              )}
              <Text style={[styles.filterChipText, filterRole === role && styles.filterChipTextActive]}>
                {role === "all" ? "All" : ADMIN_ROLE_LABELS[role]}
              </Text>
            </TouchableOpacity>
          )}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterChip, filterBranch === "all" && styles.filterChipActive]}
              onPress={() => setFilterBranch("all")}
            >
              <Text style={[styles.filterChipText, filterBranch === "all" && styles.filterChipTextActive]}>
                All Branches
              </Text>
            </TouchableOpacity>
            {BRANCHES.map((branch) => (
              <TouchableOpacity
                key={branch.id}
                style={[styles.filterChip, filterBranch === branch.id && styles.filterChipActive]}
                onPress={() => setFilterBranch(branch.id)}
              >
                <Text style={[styles.filterChipText, filterBranch === branch.id && styles.filterChipTextActive]}>
                  {branch.shortName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <FlatList
        data={filteredAdmins}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No admins found.</Text>
          </View>
        }
      />

      {isSuperAdmin && (
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <Text style={styles.fabText}>+ Add Admin</Text>
        </TouchableOpacity>
      )}

      {isSuperAdmin && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>Add New Admin</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#94A3B8"
                  value={newAdmin.name}
                  onChangeText={(t) => setNewAdmin({ ...newAdmin, name: t })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email (e.g. name@bvritn.ac.in)"
                  placeholderTextColor="#94A3B8"
                  value={newAdmin.email}
                  onChangeText={(t) => setNewAdmin({ ...newAdmin, email: t })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={styles.inputLabel}>Role</Text>
                <View style={styles.roleSelector}>
                  {ADDABLE_ROLES.map((role) => {
                    const color = ADMIN_ROLE_COLORS[role] || FALLBACK_COLOR;
                    const active = newAdmin.role === role;
                    return (
                      <TouchableOpacity
                        key={role}
                        style={[
                          styles.roleOption,
                          active && { backgroundColor: color.bg, borderColor: color.dot },
                        ]}
                        onPress={() => setNewAdmin({ ...newAdmin, role })}
                      >
                        <Text style={styles.roleOptionIcon}>{ROLE_ICONS[role]}</Text>
                        <Text style={[styles.roleOptionText, active && { color: color.text, fontWeight: "700" }]}>
                          {ADMIN_ROLE_LABELS[role]}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.inputLabel}>Branch</Text>
                <View style={styles.roleSelector}>
                  <TouchableOpacity
                    style={[styles.roleOption, !newAdmin.branchId && styles.roleOptionActive]}
                    onPress={() => setNewAdmin({ ...newAdmin, branchId: "" })}
                  >
                    <Text style={[styles.roleOptionText, !newAdmin.branchId && styles.roleOptionTextActive]}>
                      All
                    </Text>
                  </TouchableOpacity>
                  {BRANCHES.map((branch) => (
                    <TouchableOpacity
                      key={branch.id}
                      style={[styles.roleOption, newAdmin.branchId === branch.id && styles.roleOptionActive]}
                      onPress={() => setNewAdmin({ ...newAdmin, branchId: branch.id })}
                    >
                      <Text style={[styles.roleOptionText, newAdmin.branchId === branch.id && styles.roleOptionTextActive]}>
                        {branch.shortName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleAddAdmin}>
                    <Text style={styles.saveBtnText}>Add Admin</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  filters: {
    padding:           16,
    backgroundColor:   "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  searchInput: {
    backgroundColor: "#F1F5F9",
    borderRadius:    8,
    padding:         10,
    fontSize:        14,
    marginBottom:    12,
    color:           "#1E293B",
  },
  filterRow:            { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  filterChip: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 12,
    paddingVertical:   6,
    borderRadius:      20,
    backgroundColor:   "#F1F5F9",
    marginRight:       8,
    gap:               4,
  },
  filterChipActive:     { backgroundColor: "#1D4ED8" },
  filterChipIcon:       { fontSize: 11 },
  filterChipText:       { fontSize: 12, color: "#64748B", fontWeight: "500" },
  filterChipTextActive: { color: "#FFF", fontWeight: "600" },
  list: { padding: 16 },
  card: {
    backgroundColor: "#FFF",
    borderRadius:    12,
    marginBottom:    12,
    overflow:        "hidden",
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.06,
    shadowRadius:    8,
    elevation:       2,
  },
  cardBody:  { padding: 14 },
  cardTop:   { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 8, flexWrap: "wrap" },
  roleBadge: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      12,
    gap:               4,
  },
  roleIcon:      { fontSize: 11 },
  roleBadgeText: { fontSize: 11, fontWeight: "700" },
  branchPill: {
    borderWidth:       1,
    borderRadius:      10,
    paddingHorizontal: 8,
    paddingVertical:   2,
  },
  branchText:  { fontSize: 11, fontWeight: "600" },
  adminName:   { fontSize: 16, fontWeight: "700", color: "#1E293B", marginBottom: 2 },
  adminEmail:  { fontSize: 13, color: "#64748B" },
  cardActions: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#F1F5F9", padding: 8 },
  deleteBtn:     { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6 },
  deleteBtnText: { fontSize: 12, color: "#BE123C", fontWeight: "600" },
  centered:    { alignItems: "center", paddingVertical: 60 },
  emptyIcon:   { fontSize: 36, marginBottom: 12 },
  emptyText:   { fontSize: 14, color: "#94A3B8" },
  fab: {
    position:          "absolute",
    bottom:            20,
    right:             20,
    backgroundColor:   "#1D4ED8",
    paddingHorizontal: 20,
    paddingVertical:   14,
    borderRadius:      28,
    shadowColor:       "#1D4ED8",
    shadowOffset:      { width: 0, height: 4 },
    shadowOpacity:     0.3,
    shadowRadius:      8,
    elevation:         4,
  },
  fabText:       { color: "#FFF", fontWeight: "700", fontSize: 14 },
  modalOverlay: {
    flex:            1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent:  "center",
    alignItems:      "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius:    16,
    padding:         20,
    width:           "90%",
    maxHeight:       "88%",
  },
  modalTitle:  { fontSize: 20, fontWeight: "700", color: "#1E293B", marginBottom: 16 },
  input: {
    backgroundColor: "#F1F5F9",
    borderRadius:    8,
    padding:         12,
    fontSize:        14,
    marginBottom:    12,
    color:           "#1E293B",
  },
  inputLabel:   { fontSize: 14, fontWeight: "600", color: "#1E293B", marginBottom: 8 },
  roleSelector: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  roleOption: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 12,
    paddingVertical:   8,
    borderRadius:      8,
    backgroundColor:   "#F1F5F9",
    borderWidth:       1,
    borderColor:       "transparent",
    gap:               4,
  },
  roleOptionActive:     { backgroundColor: "#1D4ED8", borderColor: "#1D4ED8" },
  roleOptionIcon:       { fontSize: 13 },
  roleOptionText:       { fontSize: 13, color: "#64748B" },
  roleOptionTextActive: { color: "#FFF", fontWeight: "600" },
  modalActions:  { flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 8 },
  cancelBtn:     { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  cancelBtnText: { fontSize: 14, color: "#64748B", fontWeight: "600" },
  saveBtn: {
    paddingHorizontal: 20,
    paddingVertical:   10,
    borderRadius:      8,
    backgroundColor:   "#1D4ED8",
  },
  saveBtnText: { fontSize: 14, color: "#FFF", fontWeight: "600" },
});

export default AdminManagementScreen;