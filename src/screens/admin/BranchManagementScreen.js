import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  SafeAreaView, TouchableOpacity, Alert,
} from 'react-native';
import Header   from '../../components/common/Header';
import { BRANCHES } from '../../constants/branches';

const BranchManagementScreen = ({ navigation }) => {
  const [branches, setBranches] = useState(
    BRANCHES.map((b) => ({ ...b, studentCount: Math.floor(Math.random() * 120) + 10, active: true }))
  );

  const toggleBranch = (id) => {
    setBranches((prev) =>
      prev.map((b) => b.id === id ? { ...b, active: !b.active } : b)
    );
  };

  const handleDelete = (branch) => {
    Alert.alert(
      'Remove Branch',
      `Are you sure you want to remove "${branch.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () =>
          setBranches((prev) => prev.filter((b) => b.id !== branch.id))
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, !item.active && styles.cardInactive]}>
      {/* Left color bar */}
      <View style={[styles.colorBar, { backgroundColor: item.color }]} />

      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.branchIcon}>{item.icon}</Text>
          <View style={styles.branchInfo}>
            <Text style={styles.branchName}>{item.name}</Text>
            <Text style={styles.branchCode}>Code: {item.code} · {item.studentCount} students</Text>
          </View>
          <View style={[styles.activeBadge, item.active ? styles.activeBadgeOn : styles.activeBadgeOff]}>
            <Text style={[styles.activeBadgeText, item.active ? styles.activeText : styles.inactiveText]}>
              {item.active ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => toggleBranch(item.id)}
          >
            <Text style={styles.toggleBtnText}>
              {item.active ? '⏸  Deactivate' : '▶  Activate'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.deleteBtnText}>🗑  Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const activeBranches   = branches.filter((b) => b.active).length;
  const inactiveBranches = branches.length - activeBranches;

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="Branch Management"
        subtitle={`${activeBranches} active · ${inactiveBranches} inactive`}
        onBack={() => navigation.goBack()}
      />

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryChip}>
          <Text style={styles.summaryValue}>{branches.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={[styles.summaryChip, { borderColor: '#22C55E' }]}>
          <Text style={[styles.summaryValue, { color: '#15803D' }]}>{activeBranches}</Text>
          <Text style={styles.summaryLabel}>Active</Text>
        </View>
        <View style={[styles.summaryChip, { borderColor: '#F43F5E' }]}>
          <Text style={[styles.summaryValue, { color: '#BE123C' }]}>{inactiveBranches}</Text>
          <Text style={styles.summaryLabel}>Inactive</Text>
        </View>
        <View style={[styles.summaryChip, { borderColor: '#1D4ED8' }]}>
          <Text style={[styles.summaryValue, { color: '#1D4ED8' }]}>
            {branches.reduce((acc, b) => acc + (b.studentCount || 0), 0)}
          </Text>
          <Text style={styles.summaryLabel}>Students</Text>
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
            <Text style={styles.emptyText}>No branches added yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#F8FAFC' },
  summary: {
    flexDirection:    'row',
    justifyContent:   'space-between',
    paddingHorizontal: 16,
    paddingVertical:  14,
    backgroundColor:  '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  summaryChip: {
    alignItems:       'center',
    paddingHorizontal: 12,
    paddingVertical:   8,
    borderRadius:      10,
    borderWidth:       1.5,
    borderColor:       '#E2E8F0',
    minWidth:          70,
  },
  summaryValue:  { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  summaryLabel:  { fontSize: 10, color: '#64748B', fontWeight: '500', marginTop: 2 },
  list:          { padding: 16 },
  card: {
    flexDirection:   'row',
    backgroundColor: '#FFFFFF',
    borderRadius:    14,
    marginBottom:    12,
    overflow:        'hidden',
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.06,
    shadowRadius:    8,
    elevation:       2,
  },
  cardInactive:  { opacity: 0.65 },
  colorBar:      { width: 5 },
  cardBody:      { flex: 1, padding: 14 },
  cardTop:       { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  branchIcon:    { fontSize: 26, marginRight: 10 },
  branchInfo:    { flex: 1 },
  branchName:    { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  branchCode:    { fontSize: 12, color: '#64748B', marginTop: 2 },
  activeBadge:   { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  activeBadgeOn: { backgroundColor: '#F0FDF4' },
  activeBadgeOff:{ backgroundColor: '#F1F5F9' },
  activeBadgeText:{ fontSize: 11, fontWeight: '600' },
  activeText:    { color: '#15803D' },
  inactiveText:  { color: '#64748B' },
  cardActions:   { flexDirection: 'row', gap: 10 },
  toggleBtn: {
    flex:            1,
    paddingVertical: 8,
    borderRadius:    8,
    backgroundColor: '#F8FAFC',
    alignItems:      'center',
    borderWidth:     1,
    borderColor:     '#E2E8F0',
  },
  toggleBtnText: { fontSize: 12, color: '#334155', fontWeight: '600' },
  deleteBtn: {
    paddingHorizontal: 14,
    paddingVertical:   8,
    borderRadius:      8,
    backgroundColor:   '#FFF1F2',
    alignItems:        'center',
  },
  deleteBtnText: { fontSize: 12, color: '#BE123C', fontWeight: '600' },
  centered:      { alignItems: 'center', paddingVertical: 60 },
  emptyText:     { fontSize: 14, color: '#94A3B8' },
});

export default BranchManagementScreen;