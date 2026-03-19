import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "students", label: "Students", icon: "🎓" },
  { id: "verification", label: "Verification", icon: "✅" },
  { id: "branches", label: "Branch Management", icon: "🏫" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

const AdminSidebar = ({
  activeScreen = "dashboard",
  onNavigate,
  onLogout,
  adminName = "Admin",
  adminRole = "Super Admin",
}) => {
  const initials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.sidebar}>
      {/* Admin Profile */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.adminName}>{adminName}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{adminRole}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Menu Items */}
      <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
        {MENU_ITEMS.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => onNavigate && onNavigate(item.id)}
              activeOpacity={0.75}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text
                style={[styles.menuLabel, isActive && styles.menuLabelActive]}
              >
                {item.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: "#0F172A",
    flex: 1,
    paddingTop: 50,
    paddingBottom: 24,
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1D4ED8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: { fontSize: 22, fontWeight: "800", color: "#FFFFFF" },
  adminName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  roleBadge: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  roleText: { fontSize: 11, color: "#93C5FD", fontWeight: "600" },
  divider: {
    height: 1,
    backgroundColor: "#1E293B",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  menuList: { flex: 1, paddingHorizontal: 12 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 4,
    position: "relative",
  },
  menuItemActive: { backgroundColor: "#1E3A8A" },
  menuIcon: { fontSize: 18, marginRight: 12 },
  menuLabel: { fontSize: 14, color: "#94A3B8", fontWeight: "500" },
  menuLabelActive: { color: "#FFFFFF", fontWeight: "700" },
  activeIndicator: {
    position: "absolute",
    right: 0,
    width: 3,
    height: "60%",
    backgroundColor: "#3B82F6",
    borderRadius: 2,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#1E293B",
  },
  logoutIcon: { fontSize: 18, marginRight: 12 },
  logoutText: { fontSize: 14, color: "#F87171", fontWeight: "600" },
});

export default AdminSidebar;
