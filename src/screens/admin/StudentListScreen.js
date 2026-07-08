import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert,
} from 'react-native';
import Header          from '../../components/common/Header';
import Modal           from '../../components/common/Modal';
import SearchFilter    from '../../components/admin/SearchFilter';
import BranchSelector  from '../../components/admin/BranchSelector';
import StudentTable    from '../../components/admin/StudentTable';
import { useStudents } from '../../hooks/useStudents';
import { useAdmin }    from '../../context/AdminContext';
import { BRANCH_LIST } from '../../constants/branches';
import { SCREENS }     from '../../constants/config';
import exportService   from '../../services/exportService';

const StudentListScreen = ({ navigation }) => {
  const {
    students, allStudents, isLoading, fetchStudents,
    searchStudents, filterByStatus, filterByBranch,
    clearAllFilters, verifyStudent, rejectStudent,
    branchFilter, totalStudents,
  } = useStudents();
  const { searchQuery, statusFilter } = useAdmin();

  const [refreshing, setRefreshing] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  const [exportScope, setExportScope] = useState('filtered');
  const [exportBusy, setExportBusy] = useState(false);

  useEffect(() => { fetchStudents(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
    setRefreshing(false);
  };

  const handleFilterChange = ({ status, query }) => {
    filterByStatus(status);
    searchStudents(query);
  };

  const hasFilters = !!(searchQuery || statusFilter || branchFilter);

  const runExport = async (format) => {
    setExportBusy(true);
    try {
      const dataset = exportScope === 'all' ? allStudents : students;
      const suffix =
        exportScope === 'all' ? 'all' :
        (branchFilter ? `branch_${branchFilter}` :
          statusFilter ? statusFilter : 'filtered');
      const filenamePrefix = `students_${suffix}`;
      const result = format === 'json'
        ? await exportService.exportStudentsToJson(dataset, { filenamePrefix })
        : await exportService.exportStudentsToCsv(dataset, { filenamePrefix });

      if (result.success) {
        setExportModal(false);
        Alert.alert(
          'Export ready',
          `${result.count} students exported as ${result.filename}.`,
        );
      }
    } catch (e) {
      Alert.alert('Export failed', e?.message || 'Please try again.');
    } finally {
      setExportBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="Students"
        subtitle={`${totalStudents} total`}
        onBack={() => navigation.goBack()}
        variant="default"
        rightComponent={
          <TouchableOpacity
            style={styles.exportBtn}
            onPress={() => setExportModal(true)}
            activeOpacity={0.75}
          >
            <Text style={styles.exportBtnIcon}>⬇</Text>
            <Text style={styles.exportBtnText}>Export</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.branchWrapper}>
        <BranchSelector
          branches={BRANCH_LIST}
          selectedBranch={branchFilter}
          onSelect={(b) => filterByBranch(b ? b.id : null)}
          label=""
          placeholder="Filter by Branch"
        />
      </View>

      <SearchFilter
        onSearch={searchStudents}
        onFilterChange={handleFilterChange}
        onClear={clearAllFilters}
      />

      <StudentTable
        students={students}
        loading={isLoading && !refreshing}
        onStudentPress={(s) =>
          navigation.navigate(SCREENS.STUDENT_DETAIL, { studentId: s.id, student: s })
        }
        onVerifyPress={(s) => verifyStudent(s.id)}
        onRejectPress={(s) =>
          navigation.navigate(SCREENS.VERIFICATION, { studentId: s.id, student: s })
        }
      />

      <Modal
        visible={exportModal}
        onClose={() => setExportModal(false)}
        title="Export Students"
        subtitle="Download the current view as a file"
        icon="📤"
        size="md"
      >
        <Text style={styles.exportSectionLabel}>WHICH RECORDS</Text>
        <View style={styles.scopeRow}>
          <TouchableOpacity
            style={[styles.scopeChip, exportScope === 'filtered' && styles.scopeChipActive]}
            onPress={() => setExportScope('filtered')}
          >
            <Text style={[styles.scopeChipText, exportScope === 'filtered' && styles.scopeChipTextActive]}>
              Current view ({students.length})
            </Text>
            {hasFilters && (
              <Text style={styles.scopeChipHint}>filters applied</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.scopeChip, exportScope === 'all' && styles.scopeChipActive]}
            onPress={() => setExportScope('all')}
          >
            <Text style={[styles.scopeChipText, exportScope === 'all' && styles.scopeChipTextActive]}>
              All students ({allStudents?.length || 0})
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.exportSectionLabel}>FORMAT</Text>
        <TouchableOpacity
          style={styles.formatBtn}
          onPress={() => runExport('csv')}
          disabled={exportBusy}
          activeOpacity={0.85}
        >
          <Text style={styles.formatBtnIcon}>📄</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.formatBtnTitleLight}>Excel / CSV</Text>
            <Text style={styles.formatBtnHintLight}>
              Opens in Excel, Google Sheets, or Numbers. 21 columns.
            </Text>
          </View>
          <Text style={styles.formatBtnArrowLight}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.formatBtnAlt}
          onPress={() => runExport('json')}
          disabled={exportBusy}
          activeOpacity={0.85}
        >
          <Text style={styles.formatBtnIcon}>🧾</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.formatBtnTitle}>JSON</Text>
            <Text style={styles.formatBtnHint}>
              Full data including document metadata. For developers.
            </Text>
          </View>
          <Text style={styles.formatBtnArrow}>→</Text>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#F8FAFC' },
  branchWrapper: { paddingHorizontal: 16, paddingTop: 12, backgroundColor: '#FFFFFF' },
  exportBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1D4ED8', paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, gap: 4,
  },
  exportBtnIcon: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  exportBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

  exportSectionLabel: {
    fontSize: 11, fontWeight: '700', color: '#94A3B8',
    letterSpacing: 1, marginTop: 4, marginBottom: 10,
  },
  scopeRow: { flexDirection: 'row', gap: 10, marginBottom: 22 },
  scopeChip: {
    flex: 1, padding: 14, borderRadius: 12,
    backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#E2E8F0',
  },
  scopeChipActive: { borderColor: '#1D4ED8', backgroundColor: '#EFF6FF' },
  scopeChipText: { fontSize: 13, fontWeight: '700', color: '#334155' },
  scopeChipTextActive: { color: '#1D4ED8' },
  scopeChipHint: { fontSize: 10, color: '#94A3B8', marginTop: 4, fontWeight: '500' },

  formatBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: 12, backgroundColor: '#1D4ED8',
    marginBottom: 10, shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25,
    shadowRadius: 8, elevation: 4,
  },
  formatBtnAlt: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: 12, backgroundColor: '#FFFFFF',
    borderWidth: 1.5, borderColor: '#E2E8F0', marginBottom: 8,
  },
  formatBtnIcon: { fontSize: 22 },
  formatBtnTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  formatBtnHint:  { fontSize: 11, color: '#64748B', marginTop: 2 },
  formatBtnArrow: { fontSize: 18, color: '#1D4ED8', fontWeight: '700' },
  formatBtnTitleLight: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  formatBtnHintLight:  { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  formatBtnArrowLight: { fontSize: 18, color: '#FFFFFF', fontWeight: '700' },
});

export default StudentListScreen;
