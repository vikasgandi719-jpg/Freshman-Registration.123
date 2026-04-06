import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Clipboard,
  Alert,
  TextInput,
} from "react-native";
import Header from "../../components/common/Header";
import { generateDemoCredentials } from "../../constants/demoCredentials";
import { ADMIN_ROLE_COLORS } from "../../constants/adminRoles";

const roleColorMap = {
  "Super Admin":          ADMIN_ROLE_COLORS.super_admin,
  "Principal":            ADMIN_ROLE_COLORS.principal,
  "Branch Manager":       ADMIN_ROLE_COLORS.branch_manager,
  "Verification Officer": ADMIN_ROLE_COLORS.verification_officer,
  "Officer":              ADMIN_ROLE_COLORS.officer,
};

const ROLE_ICONS = {
  "Super Admin":          "🛡️",
  "Principal":            "🎓",
  "Branch Manager":       "🏫",
  "Verification Officer": "✅",
  "Officer":              "📄",
};

const ALL_CREDENTIALS = generateDemoCredentials();

const CredentialsScreen = ({ navigation }) => {
  const [search,     setSearch]     = useState("");
  const [filterRole, setFilterRole] = useState("All");

  const roles = [
    "All",
    "Super Admin",
    "Principal",
    "Branch Manager",
    "Verification Officer",
    "Officer",
  ];

  const filtered = ALL_CREDENTIALS.filter((c) => {
    const roleMatch   = filterRole === "All" || c.role === filterRole;
    const searchMatch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase())   ||
      c.email.toLowerCase().includes(search.toLowerCase())  ||
      c.branch.toLowerCase().includes(search.toLowerCase());
    return roleMatch && searchMatch;
  });

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert("Copied", `"${text}" copied to clipboard`);
  };

  const renderItem = ({ item }) => {
    const color = roleColorMap[item.role] || ADMIN_ROLE_COLORS.officer;
    const icon  = ROLE_ICONS[item.role]   || "👤";
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.badge, { backgroundColor: color.bg }]}>
            <Text style={styles.badgeIcon}>{icon}</Text>
            <Text style={[styles.badgeText, { color: color.text }]}>{item.role}</Text>
          </View>
          <View style={[styles.branchPill, { borderColor: color.dot + "55" }]}>
            <Text style={[styles.branchTag, { color: color.text }]}>{item.branch}</Text>
          </View>
        </View>

        <Text style={styles.name}>{item.name}</Text>

        {item.note ? (
          <View style={[styles.noteBanner, { borderLeftColor: color.dot }]}>
            <Text style={styles.noteText}>{item.note}</Text>
          </View>
        ) : null}

        <View style={styles.credRow}>
          <View style={styles.credInfo}>
            <Text style={styles.credLabel}>Email</Text>
            <Text style={styles.credValue}>{item.email}</Text>
          </View>
          <TouchableOpacity
            style={[styles.copyBtn, { backgroundColor: color.bg }]}
            onPress={() => copyToClipboard(item.email)}
          >
            <Text style={[styles.copyBtnText, { color: color.text }]}>Copy</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.credRow}>
          <View style={styles.credInfo}>
            <Text style={styles.credLabel}>Password</Text>
            <Text style={styles.credValue}>{item.password}</Text>
          </View>
          <TouchableOpacity
            style={[styles.copyBtn, { backgroundColor: color.bg }]}
            onPress={() => copyToClipboard(item.password)}
          >
            <Text style={[styles.copyBtnText, { color: color.text }]}>Copy</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="Login Credentials"
        subtitle={`${filtered.length} of ${ALL_CREDENTIALS.length} accounts`}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.filters}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email or branch..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
        <FlatList
          horizontal
          data={roles}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: role }) => (
            <TouchableOpacity
              style={[styles.chip, filterRole === role && styles.chipActive]}
              onPress={() => setFilterRole(role)}
            >
              {ROLE_ICONS[role] ? (
                <Text style={styles.chipIcon}>{ROLE_ICONS[role]}</Text>
              ) : null}
              <Text style={[styles.chipText, filterRole === role && styles.chipTextActive]}>
                {role}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.email}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No credentials found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: "#F8FAFC" },
  filters: {
    padding:           16,
    backgroundColor:   "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap:               12,
  },
  searchInput: {
    backgroundColor: "#F1F5F9",
    borderRadius:    8,
    padding:         10,
    fontSize:        14,
    color:           "#1E293B",
  },
  chip: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 12,
    paddingVertical:   6,
    borderRadius:      20,
    backgroundColor:   "#F1F5F9",
    marginRight:       8,
    gap:               4,
  },
  chipActive:     { backgroundColor: "#1D4ED8" },
  chipIcon:       { fontSize: 12 },
  chipText:       { fontSize: 12, color: "#64748B", fontWeight: "600" },
  chipTextActive: { color: "#FFF" },
  list:           { padding: 16 },
  card: {
    backgroundColor: "#FFF",
    borderRadius:    14,
    marginBottom:    12,
    padding:         16,
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.06,
    shadowRadius:    8,
    elevation:       2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems:    "center",
    marginBottom:  10,
    gap:           8,
    flexWrap:      "wrap",
  },
  badge: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 8,
    paddingVertical:   4,
    borderRadius:      12,
    gap:               4,
  },
  badgeIcon: { fontSize: 11 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  branchPill: {
    borderWidth:       1,
    borderRadius:      10,
    paddingHorizontal: 8,
    paddingVertical:   2,
  },
  branchTag:   { fontSize: 11, fontWeight: "600" },
  name: {
    fontSize:     16,
    fontWeight:   "700",
    color:        "#1E293B",
    marginBottom: 10,
  },
  noteBanner: {
    backgroundColor:   "#F8FAFC",
    borderLeftWidth:   3,
    borderRadius:      6,
    paddingHorizontal: 10,
    paddingVertical:   6,
    marginBottom:      12,
  },
  noteText:  { fontSize: 11, color: "#64748B", lineHeight: 16 },
  credRow: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "space-between",
    paddingVertical: 6,
  },
  credInfo:    { flex: 1 },
  credLabel:   { fontSize: 11, color: "#94A3B8", marginBottom: 2 },
  credValue:   { fontSize: 13, color: "#1E293B", fontFamily: "monospace" },
  copyBtn: {
    paddingHorizontal: 12,
    paddingVertical:   5,
    borderRadius:      6,
  },
  copyBtnText: { fontSize: 12, fontWeight: "700" },
  divider:     { height: 1, backgroundColor: "#F1F5F9", marginVertical: 2 },
  centered:    { alignItems: "center", paddingVertical: 60 },
  emptyIcon:   { fontSize: 36, marginBottom: 12 },
  emptyText:   { fontSize: 14, color: "#94A3B8" },
});

export default CredentialsScreen;