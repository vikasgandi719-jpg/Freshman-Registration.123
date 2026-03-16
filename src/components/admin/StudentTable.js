import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    bg: '#FFF7ED', text: '#C2410C' },
  approved:   { label: 'Approved',   bg: '#F0FDF4', text: '#15803D' },
  rejected:   { label: 'Rejected',   bg: '#FFF1F2', text: '#BE123C' },
  incomplete: { label: 'Incomplete', bg: '#F8FAFC', text: '#64748B' },
};

const StudentTable = ({
  students = [],
  loading = false,
  onStudentPress,
  onVerifyPress,
  onRejectPress,
  emptyMessage = 'No students found.',
}) => {
  const [sortField, setSortField] = useState('name');
  const [sortAsc, setSortAsc]     = useState(true);

  const toggleSort = (field) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const sorted = [...students].sort((a, b) => {
    const aVal = a[sortField] || '';
    const bVal = b[sortField] || '';
    return sortAsc
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const SortHeader = ({ field, label }) => (
    <TouchableOpacity style={styles.headerCell} onPress={() => toggleSort(field)}>
      <Text style={styles.headerText}>{label}</Text>
      {sortField === field && (
        <Text style={styles.sortArrow}>{sortAsc ? ' ↑' : ' ↓'}</Text>
      )}
    </TouchableOpacity>
  );

  const renderItem = ({ item, index }) => {
    const config = STATUS_CONFIG[item.verificationStatus] || STATUS_CONFIG.incomplete;
    const initials = (item.name || '?').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

    return (
      <TouchableOpacity
        style={[styles.row, index % 2 === 0 && styles.rowAlt]}
        onPress={() => onStudentPress && onStudentPress(item)}
        activeOpacity={0.8}
      >
        {/* Avatar + Name */}
        <View style={[styles.cell, styles.nameCell]}>
          <View style={styles.miniAvatar}>
            <Text style={styles.miniAvatarText}>{initials}</Text>
          </View>
          <View style={styles.nameInfo}>
            <Text style={styles.studentName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.studentEmail} numberOfLines={1}>{item.email}</Text>
          </View>
        </View>

        {/* Roll No */}
        <View style={styles.cell}>
          <Text style={styles.cellText}>{item.rollNumber || '—'}</Text>
        </View>

        {/* Branch */}
        <View style={styles.cell}>
          <Text style={styles.cellText}>{item.branch || '—'}</Text>
        </View>

        {/* Status */}
        <View style={styles.cell}>
          <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
            <Text style={[styles.statusText, { color: config.text }]}>{config.label}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={[styles.cell, styles.actionsCell]}>
          {item.verificationStatus === 'pending' && (
            <>
              <TouchableOpacity
                style={styles.approveBtn}
                onPress={() => onVerifyPress && onVerifyPress(item)}
              >
                <Text style={styles.approveBtnText}>✓</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => onRejectPress && onRejectPress(item)}
              >
                <Text style={styles.rejectBtnText}>✕</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => onStudentPress && onStudentPress(item)}
          >
            <Text style={styles.viewBtnText}>View</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1D4ED8" />
        <Text style={styles.loadingText}>Loading students…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <SortHeader field="name"       label="Student"  />
        <SortHeader field="rollNumber" label="Roll No"  />
        <SortHeader field="branch"     label="Branch"   />
        <SortHeader field="verificationStatus" label="Status" />
        <View style={styles.headerCell}><Text style={styles.headerText}>Actions</Text></View>
      </View>

      {/* Rows */}
      <FlatList
        data={sorted}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎓</Text>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden' },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0',
  },
  headerCell: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4 },
  headerText: { fontSize: 12, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' },
  sortArrow: { fontSize: 11, color: '#1D4ED8' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowAlt: { backgroundColor: '#FAFAFA' },
  cell: { flex: 1, paddingHorizontal: 4 },
  nameCell: { flex: 1.5, flexDirection: 'row', alignItems: 'center' },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  miniAvatarText: { fontSize: 11, fontWeight: '700', color: '#1D4ED8' },
  nameInfo: { flex: 1 },
  studentName: { fontSize: 13, fontWeight: '600', color: '#1E293B' },
  studentEmail: { fontSize: 11, color: '#94A3B8', marginTop: 1 },
  cellText: { fontSize: 13, color: '#475569' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, alignSelf: 'flex-start' },
  statusText: { fontSize: 11, fontWeight: '600' },
  actionsCell: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  approveBtn: { backgroundColor: '#F0FDF4', borderRadius: 6, width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  approveBtnText: { fontSize: 14, color: '#15803D', fontWeight: '700' },
  rejectBtn: { backgroundColor: '#FFF1F2', borderRadius: 6, width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  rejectBtnText: { fontSize: 14, color: '#BE123C', fontWeight: '700' },
  viewBtn: { backgroundColor: '#EFF6FF', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  viewBtnText: { fontSize: 11, color: '#1D4ED8', fontWeight: '600' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  loadingText: { marginTop: 12, fontSize: 14, color: '#94A3B8' },
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: '#94A3B8' },
});

export default StudentTable;