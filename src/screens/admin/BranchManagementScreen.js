import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Header from "../../components/common/Header";
import { BRANCHES } from "../../constants/branches";
import { useTheme } from "../../context/ThemeContext";

const BranchManagementScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [branches, setBranches] = useState(
    BRANCHES.map((b) => ({
      ...b,
      studentCount: Math.floor(Math.random() * 120) + 10,
      active: true,
    })),
  );

  const toggleBranch = (id) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b)),
    );
  };

  const handleDelete = (branch) => {
    Alert.alert(
      "Remove Branch",
      `Are you sure you want to remove "${branch.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () =>
            setBranches((prev) => prev.filter((b) => b.id !== branch.id)),
        },
      ],
    );
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        !item.active && styles.cardInactive,
        { backgroundColor: colors.card },
      ]}
    >
      <View style={[styles.colorBar, { backgroundColor: item.color }]} />

      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View
            style={[
              styles.branchIconBox,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <Text style={[styles.branchIconText, { color: colors.primary }]}>
              {item.icon}
            </Text>
          </View>
          <View style={styles.branchInfo}>
            <Text style={[styles.branchName, { color: colors.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.branchCode, { color: colors.textSecondary }]}>
              Code: {item.code} · {item.studentCount} students
            </Text>
          </View>
          <View
            style={[
              styles.activeBadge,
              item.active
                ? { backgroundColor: "#F0FDF4" }
                : { backgroundColor: colors.input },
            ]}
          >
            <Text
              style={[
                styles.activeBadgeText,
                item.active
                  ? { color: "#15803D" }
                  : { color: colors.textSecondary },
              ]}
            >
              {item.active ? "Active" : "Inactive"}
            </Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              { backgroundColor: colors.input, borderColor: colors.border },
            ]}
            onPress={() => toggleBranch(item.id)}
          >
            <Text style={[styles.toggleBtnText, { color: colors.text }]}>
              {item.active ? "Deactivate" : "Activate"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.deleteBtnText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const activeBranches = branches.filter((b) => b.active).length;
  const inactiveBranches = branches.length - activeBranches;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Header
        title="Branch Management"
        subtitle={`${activeBranches} active · ${inactiveBranches} inactive`}
        onBack={() => navigation.goBack()}
      />

      <View
        style={[
          styles.summary,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <View style={[styles.summaryChip, { borderColor: colors.border }]}>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            {branches.length}
          </Text>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            Total
          </Text>
        </View>
        <View style={[styles.summaryChip, { borderColor: "#22C55E" }]}>
          <Text style={[styles.summaryValue, { color: "#15803D" }]}>
            {activeBranches}
          </Text>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            Active
          </Text>
        </View>
        <View style={[styles.summaryChip, { borderColor: "#F43F5E" }]}>
          <Text style={[styles.summaryValue, { color: "#BE123C" }]}>
            {inactiveBranches}
          </Text>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            Inactive
          </Text>
        </View>
        <View style={[styles.summaryChip, { borderColor: "#1D4ED8" }]}>
          <Text style={[styles.summaryValue, { color: "#1D4ED8" }]}>
            {branches.reduce((acc, b) => acc + (b.studentCount || 0), 0)}
          </Text>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            Students
          </Text>
        </View>
      </View>

      <FlatList
        data={branches}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No branches added yet.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  summaryChip: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    minWidth: 70,
  },
  summaryValue: { fontSize: 20, fontWeight: "700" },
  summaryLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: 2,
  },
  list: { padding: 16 },
  card: {
    flexDirection: "row",
    borderRadius: 14,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardInactive: { opacity: 0.65 },
  colorBar: { width: 5 },
  cardBody: { flex: 1, padding: 14 },
  cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  branchIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  branchIconText: { fontSize: 14, fontWeight: "700" },
  branchInfo: { flex: 1 },
  branchName: { fontSize: 14, fontWeight: "700" },
  branchCode: { fontSize: 12, marginTop: 2 },
  activeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  activeBadgeText: { fontSize: 11, fontWeight: "600" },
  cardActions: { flexDirection: "row", gap: 10 },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  toggleBtnText: { fontSize: 12, fontWeight: "600" },
  deleteBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFF1F2",
    alignItems: "center",
  },
  deleteBtnText: { fontSize: 12, color: "#BE123C", fontWeight: "600" },
  centered: { alignItems: "center", paddingVertical: 60 },
  emptyText: { fontSize: 14 },
});

export default BranchManagementScreen;
