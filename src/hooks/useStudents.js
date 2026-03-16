import { useState, useCallback } from 'react';
import { useAdmin } from '../context/AdminContext';
import adminService from '../services/adminService';

const useStudents = () => {
  const context = useAdmin();
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError,   setActionError]   = useState(null);

  // ─── Fetch All Students ───────────────────────────────────────────────────────
  const fetchStudents = useCallback(async (params = {}) => {
    context.setLoading(true);
    context.clearError();
    try {
      const response = await adminService.getStudents({
        page:     params.page   || 1,
        limit:    params.limit  || 20,
        branch:   params.branch || null,
        status:   params.status || null,
        search:   params.search || '',
      });
      context.setStudents({
        students:   response.data   || response,
        total:      response.total  || response.length,
        totalPages: response.totalPages || 1,
      });
      return { success: true, data: response };
    } catch (error) {
      const msg = error?.message || 'Failed to fetch students.';
      context.setError(msg);
      return { success: false, error: msg };
    }
  }, [context]);

  // ─── Fetch Student by ID ─────────────────────────────────────────────────────
  const fetchStudentById = useCallback(async (studentId) => {
    context.setLoading(true);
    try {
      const student = await adminService.getStudentById(studentId);
      context.setSelected(student);
      return { success: true, data: student };
    } catch (error) {
      const msg = error?.message || 'Failed to fetch student details.';
      context.setError(msg);
      return { success: false, error: msg };
    }
  }, [context]);

  // ─── Verify Student ───────────────────────────────────────────────────────────
  const verifyStudent = useCallback(async (studentId) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const response = await adminService.verifyStudent(studentId);
      context.updateStudent({ id: studentId, verificationStatus: 'approved' });
      return { success: true, data: response };
    } catch (error) {
      const msg = error?.message || 'Failed to verify student.';
      setActionError(msg);
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  }, [context]);

  // ─── Reject Student ───────────────────────────────────────────────────────────
  const rejectStudent = useCallback(async (studentId, reason = '') => {
    if (!reason.trim()) {
      setActionError('Rejection reason is required.');
      return { success: false, error: 'Rejection reason is required.' };
    }
    setActionLoading(true);
    setActionError(null);
    try {
      const response = await adminService.rejectStudent(studentId, reason);
      context.updateStudent({ id: studentId, verificationStatus: 'rejected', rejectionReason: reason });
      return { success: true, data: response };
    } catch (error) {
      const msg = error?.message || 'Failed to reject student.';
      setActionError(msg);
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  }, [context]);

  // ─── Reset Student to Pending ────────────────────────────────────────────────
  const resetStudentStatus = useCallback(async (studentId) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const response = await adminService.resetStudentStatus(studentId);
      context.updateStudent({ id: studentId, verificationStatus: 'pending', rejectionReason: null });
      return { success: true, data: response };
    } catch (error) {
      const msg = error?.message || 'Failed to reset student status.';
      setActionError(msg);
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  }, [context]);

  // ─── Fetch Stats ─────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const stats = await adminService.getStats();
      context.setStats(stats);
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  }, [context]);

  // ─── Search & Filter ─────────────────────────────────────────────────────────
  const searchStudents    = useCallback((query)  => context.setSearch(query),        [context]);
  const filterByStatus    = useCallback((status) => context.setStatusFilter(status), [context]);
  const filterByBranch    = useCallback((branch) => context.setBranchFilter(branch), [context]);
  const clearAllFilters   = useCallback(()       => context.clearFilters(),          [context]);
  const selectStudent     = useCallback((student)=> context.setSelected(student),    [context]);

  // ─── Computed ─────────────────────────────────────────────────────────────────
  const studentStats = {
    total:      context.students.length,
    approved:   context.students.filter((s) => s.verificationStatus === 'approved').length,
    pending:    context.students.filter((s) => s.verificationStatus === 'pending').length,
    rejected:   context.students.filter((s) => s.verificationStatus === 'rejected').length,
    incomplete: context.students.filter((s) => s.verificationStatus === 'incomplete').length,
  };

  return {
    // State
    students:         context.filteredStudents,
    allStudents:      context.students,
    selectedStudent:  context.selectedStudent,
    isLoading:        context.isLoading,
    error:            context.error,
    actionLoading,
    actionError,
    searchQuery:      context.searchQuery,
    statusFilter:     context.statusFilter,
    branchFilter:     context.branchFilter,
    currentPage:      context.currentPage,
    totalPages:       context.totalPages,
    totalStudents:    context.totalStudents,
    stats:            context.stats,
    studentStats,

    // Actions
    fetchStudents,
    fetchStudentById,
    verifyStudent,
    rejectStudent,
    resetStudentStatus,
    fetchStats,
    searchStudents,
    filterByStatus,
    filterByBranch,
    clearAllFilters,
    selectStudent,
    setPage:      context.setPage,
    clearError:   context.clearError,
  };
};

export default useStudents;