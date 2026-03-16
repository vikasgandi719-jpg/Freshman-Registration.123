import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, SafeAreaView, RefreshControl, FlatList,
} from 'react-native';
import Header          from '../../components/common/Header';
import SearchFilter    from '../../components/admin/SearchFilter';
import BranchSelector  from '../../components/admin/BranchSelector';
import StudentTable    from '../../components/admin/StudentTable';
import { useStudents } from '../../hooks/useStudents';
import { BRANCH_LIST } from '../../constants/branches';
import { SCREENS }     from '../../constants/config';

const StudentListScreen = ({ navigation }) => {
  const {
    students, isLoading, fetchStudents,
    searchStudents, filterByStatus, filterByBranch,
    clearAllFilters, verifyStudent, rejectStudent,
    branchFilter, totalStudents,
  } = useStudents();

  const [refreshing, setRefreshing] = useState(false);

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

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="Students"
        subtitle={`${totalStudents} total`}
        onBack={() => navigation.goBack()}
        variant="default"
      />

      {/* Branch Selector */}
      <View style={styles.branchWrapper}>
        <BranchSelector
          branches={BRANCH_LIST}
          selectedBranch={branchFilter}
          onSelect={(b) => filterByBranch(b ? b.id : null)}
          label=""
          placeholder="Filter by Branch"
        />
      </View>

      {/* Search + Status Filter */}
      <SearchFilter
        onSearch={searchStudents}
        onFilterChange={handleFilterChange}
        onClear={clearAllFilters}
      />

      {/* Table */}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#F8FAFC' },
  branchWrapper: { paddingHorizontal: 16, paddingTop: 12, backgroundColor: '#FFFFFF' },
});

export default StudentListScreen;