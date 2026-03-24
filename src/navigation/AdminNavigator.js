import React, { useState } from "react";
import {
  Platform, View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, TextInput, Modal, Alert,
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SCREENS } from "../constants/config";
import { useAdmin } from "../context/AdminContext";
import { BRANCHES } from "../constants/branches";

import AdminDashboard         from "../screens/admin/AdminDashboard";
import StudentListScreen      from "../screens/admin/StudentListScreen";
import StudentDetailScreen    from "../screens/admin/StudentDetailScreen";
import VerificationScreen     from "../screens/admin/VerificationScreen";
import BranchManagementScreen from "../screens/admin/BranchManagementScreen";
import AdminSettingsScreen from "../screens/admin/AdminSettingsScreen";
import AdminManagementScreen from "../screens/admin/AdminManagementScreen";
import AdminSidebar from "../components/admin/AdminSidebar";

const Drawer = createDrawerNavigator();
const Stack  = createNativeStackNavigator();

// ═══════════════════════════════════════════════════════════════════════════════
// TEAM SCREEN — defined here to avoid file import/casing issues on Windows
// ═══════════════════════════════════════════════════════════════════════════════

const BRANCH_CODES = BRANCHES.map((b) => b.shortName);

const ROLE_CONFIG = {
  "BRANCH ADMIN":         { badgeColor: "#F59E0B", badgeBg: "#FFFBEB", icon: "🏫" },
  "VERIFICATION OFFICER": { badgeColor: "#7C3AED", badgeBg: "#F5F3FF", icon: "✅" },
  "DOCUMENT MANAGER":     { badgeColor: "#059669", badgeBg: "#F0FDF4", icon: "📄" },
};

const generateTeam = () => {
  const branchAdmins = BRANCHES.map((b, i) => ({
    id: `ba_${i + 1}`,
    name: `${b.shortName} Branch Admin`,
    email: `${b.shortName.toLowerCase()}.admin@bvritn.ac.in`,
    role: "BRANCH ADMIN",
    branch: b.shortName,
    color: b.color,
    active: true,
  }));
  const verificationOfficers = BRANCHES.flatMap((b, bi) =>
    [1, 2, 3].map((n, i) => ({
      id: `vo_${bi * 3 + i + 1}`,
      name: `Verification Officer ${bi * 3 + i + 1}`,
      email: `vo${bi * 3 + i + 1}@bvritn.ac.in`,
      role: "VERIFICATION OFFICER",
      branch: b.shortName,
      color: "#7C3AED",
      active: true,
    }))
  );
  const documentManagers = BRANCHES.flatMap((b, bi) =>
    [1, 2].map((n, i) => ({
      id: `dm_${bi * 2 + i + 1}`,
      name: `Document Manager ${bi * 2 + i + 1}`,
      email: `dm${bi * 2 + i + 1}@bvritn.ac.in`,
      role: "DOCUMENT MANAGER",
      branch: b.shortName,
      color: "#059669",
      active: true,
    }))
  );
  return { branchAdmins, verificationOfficers, documentManagers };
};

const MemberCard = ({ member, onEdit }) => (
  <TouchableOpacity style={ts.memberCard} onPress={() => onEdit(member)} activeOpacity={0.8}>
    <View style={[ts.memberAvatar, { backgroundColor: member.color + "20" }]}>
      <Text style={[ts.memberAvatarText, { color: member.color }]}>
        {member.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
      </Text>
    </View>
    <View style={ts.memberInfo}>
      <Text style={ts.memberName}>{member.name}</Text>
      <Text style={ts.memberEmail}>{member.email}</Text>
    </View>
    <View style={[ts.branchBadge, { borderColor: member.color + "40" }]}>
      <Text style={[ts.branchBadgeText, { color: member.color }]}>{member.branch}</Text>
    </View>
  </TouchableOpacity>
);

const TeamSection = ({ role, members, onEdit, onAdd, searchQuery }) => {
  const config = ROLE_CONFIG[role];
  const filtered = members.filter(
    (m) => !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <View style={ts.section}>
      <View style={ts.sectionHeader}>
        <View style={[ts.roleBadge, { backgroundColor: config.badgeBg }]}>
          <Text style={[ts.roleBadgeText, { color: config.badgeColor }]}>{role}</Text>
        </View>
        <View style={[ts.countBadge, { backgroundColor: config.badgeBg }]}>
          <Text style={[ts.countBadgeText, { color: config.badgeColor }]}>{filtered.length}</Text>
        </View>
        <TouchableOpacity style={[ts.addBtn, { backgroundColor: config.badgeBg }]} onPress={() => onAdd(role)}>
          <Text style={[ts.addBtnText, { color: config.badgeColor }]}>+ Add</Text>
        </TouchableOpacity>
      </View>
      <View style={ts.memberGrid}>
        {filtered.length === 0
          ? <Text style={ts.emptyText}>No members found.</Text>
          : filtered.map((m) => (
              <View key={m.id} style={ts.memberGridItem}>
                <MemberCard member={m} onEdit={onEdit} />
              </View>
            ))}
      </View>
    </View>
  );
};

const TeamScreen = ({ navigation }) => {
  const [team, setTeam]             = useState(generateTeam());
  const [search, setSearch]         = useState("");
  const [activeTab, setActiveTab]   = useState("all");
  const [modalVisible, setModal]    = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState({ name: "", email: "", branch: BRANCH_CODES[0], role: "BRANCH ADMIN" });

  const allMembers = [...team.branchAdmins, ...team.verificationOfficers, ...team.documentManagers];

  const tabs = [
    { id: "all",                  label: "All",         count: allMembers.length },
    { id: "BRANCH ADMIN",         label: "Branch Admin",count: team.branchAdmins.length },
    { id: "VERIFICATION OFFICER", label: "Verification",count: team.verificationOfficers.length },
    { id: "DOCUMENT MANAGER",     label: "Doc Manager", count: team.documentManagers.length },
  ];

  const getList = (role) => {
    if (role === "BRANCH ADMIN")         return team.branchAdmins;
    if (role === "VERIFICATION OFFICER") return team.verificationOfficers;
    if (role === "DOCUMENT MANAGER")     return team.documentManagers;
    return [];
  };

  const setList = (role, list) => {
    if (role === "BRANCH ADMIN")         setTeam((t) => ({ ...t, branchAdmins: list }));
    if (role === "VERIFICATION OFFICER") setTeam((t) => ({ ...t, verificationOfficers: list }));
    if (role === "DOCUMENT MANAGER")     setTeam((t) => ({ ...t, documentManagers: list }));
  };

  const openEdit = (member) => {
    setEditing(member);
    setForm({ name: member.name, email: member.email, branch: member.branch, role: member.role });
    setModal(true);
  };

  const openAdd = (role) => {
    setEditing(null);
    setForm({ name: "", email: "", branch: BRANCH_CODES[0], role });
    setModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) {
      if (Platform.OS === "web") window.alert("Please fill in name and email.");
      else Alert.alert("Error", "Please fill in name and email.");
      return;
    }
    const color = BRANCHES.find((b) => b.shortName === form.branch)?.color || "#1D4ED8";
    if (editing) {
      const updated = getList(editing.role).map((m) =>
        m.id === editing.id ? { ...m, name: form.name.trim(), email: form.email.trim(), branch: form.branch, color } : m
      );
      setList(editing.role, updated);
    } else {
      const newMember = { id: `new_${Date.now()}`, name: form.name.trim(), email: form.email.trim(), role: form.role, branch: form.branch, color, active: true };
      setList(form.role, [...getList(form.role), newMember]);
    }
    setModal(false);
  };

  const handleDelete = () => {
    const doDelete = () => {
      setList(editing.role, getList(editing.role).filter((m) => m.id !== editing.id));
      setModal(false);
    };
    if (Platform.OS === "web") { if (window.confirm(`Remove ${editing.name}?`)) doDelete(); }
    else Alert.alert("Remove", `Remove ${editing.name}?`, [{ text: "Cancel", style: "cancel" }, { text: "Remove", style: "destructive", onPress: doDelete }]);
  };

  const visibleRoles = activeTab === "all"
    ? ["BRANCH ADMIN", "VERIFICATION OFFICER", "DOCUMENT MANAGER"]
    : [activeTab];

  return (
    <SafeAreaView style={ts.safe}>
      <View style={ts.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={ts.backBtn}>
          <Text style={ts.backBtnText}>‹</Text>
        </TouchableOpacity>
        <View>
          <Text style={ts.headerTitle}>Team</Text>
          <Text style={ts.headerSub}>{allMembers.length} members</Text>
        </View>
      </View>

      <View style={ts.searchBox}>
        <Text>🔍  </Text>
        <TextInput style={ts.searchInput} placeholder="Search by name or branch..." placeholderTextColor="#94A3B8" value={search} onChangeText={setSearch} />
        {search ? <TouchableOpacity onPress={() => setSearch("")}><Text style={{ color: "#94A3B8" }}>✕</Text></TouchableOpacity> : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={ts.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.id} style={[ts.tab, activeTab === tab.id && ts.tabActive]} onPress={() => setActiveTab(tab.id)}>
            <Text style={[ts.tabText, activeTab === tab.id && ts.tabTextActive]}>{tab.label}</Text>
            <View style={[ts.tabCount, activeTab === tab.id && ts.tabCountActive]}>
              <Text style={[ts.tabCountText, activeTab === tab.id && ts.tabCountTextActive]}>{tab.count}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {visibleRoles.map((role) => (
          <TeamSection key={role} role={role} members={getList(role)} onEdit={openEdit} onAdd={openAdd} searchQuery={search} />
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModal(false)}>
        <View style={ts.modalOverlay}>
          <View style={ts.modalBox}>
            <Text style={ts.modalTitle}>{editing ? "Edit Member" : `Add ${form.role}`}</Text>

            <Text style={ts.fieldLabel}>Full Name</Text>
            <TextInput style={ts.fieldInput} placeholder="Enter full name" value={form.name} onChangeText={(t) => setForm((f) => ({ ...f, name: t }))} />

            <Text style={ts.fieldLabel}>Email</Text>
            <TextInput style={ts.fieldInput} placeholder="Enter email" value={form.email} onChangeText={(t) => setForm((f) => ({ ...f, email: t }))} keyboardType="email-address" autoCapitalize="none" />

            <Text style={ts.fieldLabel}>Branch</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {BRANCH_CODES.map((code) => (
                <TouchableOpacity key={code} style={[ts.chip, form.branch === code && ts.chipActive]} onPress={() => setForm((f) => ({ ...f, branch: code }))}>
                  <Text style={[ts.chipText, form.branch === code && ts.chipTextActive]}>{code}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {!editing && (
              <>
                <Text style={ts.fieldLabel}>Role</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  {Object.keys(ROLE_CONFIG).map((role) => (
                    <TouchableOpacity key={role} style={[ts.chip, form.role === role && { backgroundColor: ROLE_CONFIG[role].badgeBg, borderColor: ROLE_CONFIG[role].badgeColor }]} onPress={() => setForm((f) => ({ ...f, role }))}>
                      <Text style={[ts.chipText, form.role === role && { color: ROLE_CONFIG[role].badgeColor }]}>{ROLE_CONFIG[role].icon} {role.split(" ")[0]}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
              {editing && (
                <TouchableOpacity style={[ts.btn, { backgroundColor: "#FFF1F2" }]} onPress={handleDelete}>
                  <Text style={{ color: "#BE123C", fontWeight: "700" }}>Remove</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[ts.btn, { backgroundColor: "#F1F5F9" }]} onPress={() => setModal(false)}>
                <Text style={{ color: "#64748B", fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[ts.btn, { backgroundColor: "#1D4ED8" }]} onPress={handleSave}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>{editing ? "Save" : "Add"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const ts = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: "#F8FAFC" },
  header:      { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#F1F5F9", gap: 12 },
  backBtn:     { padding: 4 },
  backBtnText: { fontSize: 28, color: "#1D4ED8", lineHeight: 32 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A" },
  headerSub:   { fontSize: 12, color: "#94A3B8" },
  searchBox:   { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", marginHorizontal: 16, marginTop: 12, marginBottom: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", gap: 8 },
  searchInput: { flex: 1, fontSize: 14, color: "#1E293B" },
  tabs:        { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  tab:         { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: "#F1F5F9", gap: 6 },
  tabActive:   { backgroundColor: "#1D4ED8" },
  tabText:     { fontSize: 13, color: "#64748B", fontWeight: "600" },
  tabTextActive:    { color: "#fff" },
  tabCount:         { backgroundColor: "#E2E8F0", borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1 },
  tabCountActive:   { backgroundColor: "rgba(255,255,255,0.25)" },
  tabCountText:     { fontSize: 11, color: "#64748B", fontWeight: "700" },
  tabCountTextActive:{ color: "#fff" },
  section:     { marginBottom: 20 },
  sectionHeader:{ flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 8 },
  roleBadge:   { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  roleBadgeText:{ fontSize: 12, fontWeight: "800", letterSpacing: 0.5 },
  countBadge:  { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  countBadgeText:{ fontSize: 12, fontWeight: "700" },
  addBtn:      { marginLeft: "auto", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  addBtnText:  { fontSize: 12, fontWeight: "700" },
  memberGrid:  { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  memberGridItem:{ width: "48.5%" },
  memberCard:  { backgroundColor: "#fff", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#F1F5F9" },
  memberAvatar:{ width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  memberAvatarText:{ fontSize: 13, fontWeight: "800" },
  memberInfo:  { marginBottom: 6 },
  memberName:  { fontSize: 13, fontWeight: "600", color: "#1E293B" },
  memberEmail: { fontSize: 10, color: "#94A3B8", marginTop: 2 },
  branchBadge: { alignSelf: "flex-start", borderWidth: 1, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  branchBadgeText:{ fontSize: 10, fontWeight: "700" },
  emptyText:   { fontSize: 13, color: "#94A3B8", padding: 12 },
  modalOverlay:{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalBox:    { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle:  { fontSize: 18, fontWeight: "800", color: "#0F172A", marginBottom: 20 },
  fieldLabel:  { fontSize: 12, fontWeight: "700", color: "#64748B", marginBottom: 6, marginTop: 4 },
  fieldInput:  { borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: "#1E293B", marginBottom: 12, backgroundColor: "#F8FAFC" },
  chip:        { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: "#F1F5F9", marginRight: 8, borderWidth: 1, borderColor: "transparent" },
  chipActive:  { backgroundColor: "#EFF6FF", borderColor: "#1D4ED8" },
  chipText:    { fontSize: 12, fontWeight: "600", color: "#64748B" },
  chipTextActive:{ color: "#1D4ED8" },
  btn:         { flex: 1, paddingVertical: 13, borderRadius: 12, alignItems: "center" },
});

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATOR
// ═══════════════════════════════════════════════════════════════════════════════

const CustomDrawerContent = (props) => {
  const { state, navigation } = props;
  const { admin, logoutAdmin } = useAdmin();
  const activeRoute = state.routeNames[state.index];

  const screenToId = {
    [SCREENS.ADMIN_DASHBOARD]:   "dashboard",
    [SCREENS.STUDENT_LIST]:      "students",
    [SCREENS.VERIFICATION]:      "verification",
    [SCREENS.BRANCH_MANAGEMENT]: "branches",
    [SCREENS.ADMIN_MANAGEMENT]: "admins",
    [SCREENS.ADMIN_SETTINGS]: "settings",
  };

  const idToScreen = Object.fromEntries(
    Object.entries(screenToId).map(([k, v]) => [v, k])
  );

  const activeId = screenToId[activeRoute] || "dashboard";

  return (
    <AdminSidebar
      activeScreen={activeId}
      onNavigate={(id) => {
        const screen = idToScreen[id];
        if (screen) navigation.navigate(screen);
      }}
      onLogout={logoutAdmin}
      adminName={admin?.name || "Admin"}
      adminRole={admin?.role || "Administrator"}
    />
  );
};

// ─── Admin Drawer Navigator ───────────────────────────────────────────────────
const AdminDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: Platform.OS === "web" ? "permanent" : "slide", // ✅ fixed for web
        drawerStyle: { width: 240 },
        overlayColor: "rgba(0,0,0,0.4)",
        swipeEdgeWidth: 40,
      }}
    >
      <Drawer.Screen
        name={SCREENS.ADMIN_DASHBOARD}
        component={AdminDashboard}
      />
      <Drawer.Screen
        name={SCREENS.STUDENT_LIST}
        component={StudentListScreen}
      />
      <Drawer.Screen
        name={SCREENS.VERIFICATION}
        component={VerificationScreen}
      />
      <Drawer.Screen
        name={SCREENS.BRANCH_MANAGEMENT}
        component={BranchManagementScreen}
      />
      <Drawer.Screen
        name={SCREENS.ADMIN_MANAGEMENT}
        component={AdminManagementScreen}
      />
      <Drawer.Screen
        name={SCREENS.ADMIN_SETTINGS}
        component={AdminSettingsScreen}
      />
    </Drawer.Navigator>
  );
};

const AdminNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminDrawer" component={AdminDrawer} />
    <Stack.Screen
      name={SCREENS.STUDENT_DETAIL}
      component={StudentDetailScreen}
      options={{ animation: "slide_from_right", gestureEnabled: true }}
    />
  </Stack.Navigator>
);

export default AdminNavigator;