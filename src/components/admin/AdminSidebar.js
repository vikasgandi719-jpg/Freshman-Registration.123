import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

const DEFAULT_MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "D" },
  { id: "students", label: "Students", icon: "S" },
  { id: "verification", label: "Verification", icon: "V" },
  { id: "branches", label: "Branch Management", icon: "B" },
  { id: "admins", label: "Admin Management", icon: "A" },
  { id: "settings", label: "Settings", icon: "G" },
];

const AdminSidebar = ({
  activeScreen = "dashboard",
  menuItems = DEFAULT_MENU_ITEMS,
  onNavigate,
  onLogout,
  adminName = "Admin",
  adminRole = "Super Admin",
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const initials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={[styles.sidebar, { backgroundColor: colors.background }]}>
      <View style={styles.profileSection}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={[styles.adminName, { color: colors.text }]}>
          {adminName}
        </Text>
        <View
          style={[styles.roleBadge, { backgroundColor: colors.primaryLight }]}
        >
          <Text style={[styles.roleText, { color: colors.primary }]}>
            {adminRole}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                isActive && { backgroundColor: colors.primaryLight },
              ]}
              onPress={() => onNavigate && onNavigate(item.id)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.menuIcon,
                  { color: isActive ? colors.primary : colors.textSecondary },
                ]}
              >
                {item.icon}
              </Text>
              <Text
                style={[
                  styles.menuLabel,
                  isActive && { color: colors.primary, fontWeight: "700" },
                ]}
              >
                {item.label}
              </Text>
              {isActive && (
                <View
                  style={[
                    styles.activeIndicator,
                    { backgroundColor: colors.primary },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={[styles.logoutBtn, { backgroundColor: colors.input }]}
        onPress={onLogout}
      >
        <Text style={[styles.logoutIcon, { color: colors.error }]}>L</Text>
        <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: { fontSize: 22, fontWeight: "800", color: "#FFFFFF" },
  adminName: { fontSize: 15, fontWeight: "700", marginBottom: 6 },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  roleText: { fontSize: 11, fontWeight: "600" },
  divider: { height: 1, marginHorizontal: 20, marginBottom: 12 },
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
  menuIcon: {
    fontSize: 16,
    fontWeight: "700",
    marginRight: 12,
    width: 20,
    textAlign: "center",
  },
  menuLabel: { fontSize: 14, fontWeight: "500" },
  activeIndicator: {
    position: "absolute",
    right: 0,
    width: 3,
    height: "60%",
    borderRadius: 2,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  logoutIcon: {
    fontSize: 16,
    fontWeight: "700",
    marginRight: 12,
    width: 20,
    textAlign: "center",
  },
  logoutText: { fontSize: 14, fontWeight: "600" },
});

export default AdminSidebar;
