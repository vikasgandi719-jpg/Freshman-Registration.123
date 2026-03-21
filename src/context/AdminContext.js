import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants/config";

const initialState = {
  admin:      null,
  token:      null,
  isLoggedIn: false,
  isLoading:  false,   // ── FIX: start false — never blocks AppNavigator
  error:      null,
  students:         [],
  filteredStudents: [],
  selectedStudent:  null,
  stats:            null,
  searchQuery:  "",
  statusFilter: null,
  branchFilter: null,
  currentPage:   1,
  totalPages:    1,
  totalStudents: 0,
};

const ADMIN_ACTIONS = {
  SET_LOADING:"SET_LOADING", LOGIN_SUCCESS:"LOGIN_SUCCESS", LOGOUT:"LOGOUT",
  SET_ERROR:"SET_ERROR", CLEAR_ERROR:"CLEAR_ERROR", SET_STUDENTS:"SET_STUDENTS",
  SET_SELECTED:"SET_SELECTED", UPDATE_STUDENT:"UPDATE_STUDENT", SET_STATS:"SET_STATS",
  SET_SEARCH:"SET_SEARCH", SET_STATUS_FILTER:"SET_STATUS_FILTER",
  SET_BRANCH_FILTER:"SET_BRANCH_FILTER", CLEAR_FILTERS:"CLEAR_FILTERS", SET_PAGE:"SET_PAGE",
};

const applyFilters = (students, searchQuery, statusFilter, branchFilter) => {
  let result = [...students];
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    result = result.filter(
      (s) => s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) ||
             s.uniqueId?.toLowerCase().includes(q) || s.rollNumber?.toLowerCase().includes(q)
    );
  }
  if (statusFilter) result = result.filter((s) => s.verificationStatus === statusFilter);
  if (branchFilter) result = result.filter((s) => s.branch === branchFilter || s.branchCode === branchFilter);
  return result;
};

const adminReducer = (state, action) => {
  switch (action.type) {
    case ADMIN_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ADMIN_ACTIONS.LOGIN_SUCCESS:
      return { ...state, admin: action.payload.admin, token: action.payload.token, isLoggedIn: true, isLoading: false, error: null };
    case ADMIN_ACTIONS.LOGOUT:
      return { ...initialState };
    case ADMIN_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case ADMIN_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case ADMIN_ACTIONS.SET_STUDENTS: {
      const filtered = applyFilters(action.payload.students, state.searchQuery, state.statusFilter, state.branchFilter);
      return { ...state, students: action.payload.students, filteredStudents: filtered,
               totalStudents: action.payload.total || action.payload.students.length,
               totalPages: action.payload.totalPages || 1, isLoading: false };
    }
    case ADMIN_ACTIONS.SET_SELECTED:
      return { ...state, selectedStudent: action.payload };
    case ADMIN_ACTIONS.UPDATE_STUDENT: {
      const updated = state.students.map((s) => s.id === action.payload.id ? { ...s, ...action.payload } : s);
      const filtered = applyFilters(updated, state.searchQuery, state.statusFilter, state.branchFilter);
      return { ...state, students: updated, filteredStudents: filtered,
               selectedStudent: state.selectedStudent?.id === action.payload.id
                 ? { ...state.selectedStudent, ...action.payload } : state.selectedStudent };
    }
    case ADMIN_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };
    case ADMIN_ACTIONS.SET_SEARCH: {
      const filtered = applyFilters(state.students, action.payload, state.statusFilter, state.branchFilter);
      return { ...state, searchQuery: action.payload, filteredStudents: filtered };
    }
    case ADMIN_ACTIONS.SET_STATUS_FILTER: {
      const filtered = applyFilters(state.students, state.searchQuery, action.payload, state.branchFilter);
      return { ...state, statusFilter: action.payload, filteredStudents: filtered };
    }
    case ADMIN_ACTIONS.SET_BRANCH_FILTER: {
      const filtered = applyFilters(state.students, state.searchQuery, state.statusFilter, action.payload);
      return { ...state, branchFilter: action.payload, filteredStudents: filtered };
    }
    case ADMIN_ACTIONS.CLEAR_FILTERS:
      return { ...state, searchQuery: "", statusFilter: null, branchFilter: null, filteredStudents: state.students };
    case ADMIN_ACTIONS.SET_PAGE:
      return { ...state, currentPage: action.payload };
    default:
      return state;
  }
};

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // ── FIX: Just silently clear stale storage. No isLoading toggling at all.
  // isLoading starts false so AppNavigator is never blocked by admin state.
  useEffect(() => {
    AsyncStorage.removeItem(STORAGE_KEYS.ADMIN_DATA).catch(() => {});
  }, []);

  const loginAdmin = async (admin, token) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ADMIN_DATA, JSON.stringify(admin));
      dispatch({ type: ADMIN_ACTIONS.LOGIN_SUCCESS, payload: { admin, token } });
    } catch {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: "Failed to save admin session." });
    }
  };

  const logoutAdmin = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.ADMIN_DATA).catch(() => {});
    dispatch({ type: ADMIN_ACTIONS.LOGOUT });
  };

  const setStudents     = (data)    => dispatch({ type: ADMIN_ACTIONS.SET_STUDENTS,      payload: data    });
  const setSelected     = (student) => dispatch({ type: ADMIN_ACTIONS.SET_SELECTED,      payload: student });
  const updateStudent   = (data)    => dispatch({ type: ADMIN_ACTIONS.UPDATE_STUDENT,    payload: data    });
  const setStats        = (data)    => dispatch({ type: ADMIN_ACTIONS.SET_STATS,         payload: data    });
  const setSearch       = (query)   => dispatch({ type: ADMIN_ACTIONS.SET_SEARCH,        payload: query   });
  const setStatusFilter = (status)  => dispatch({ type: ADMIN_ACTIONS.SET_STATUS_FILTER, payload: status  });
  const setBranchFilter = (branch)  => dispatch({ type: ADMIN_ACTIONS.SET_BRANCH_FILTER, payload: branch  });
  const clearFilters    = ()        => dispatch({ type: ADMIN_ACTIONS.CLEAR_FILTERS                        });
  const setPage         = (page)    => dispatch({ type: ADMIN_ACTIONS.SET_PAGE,          payload: page    });
  const setLoading      = (val)     => dispatch({ type: ADMIN_ACTIONS.SET_LOADING,       payload: val     });
  const setError        = (msg)     => dispatch({ type: ADMIN_ACTIONS.SET_ERROR,         payload: msg     });
  const clearError      = ()        => dispatch({ type: ADMIN_ACTIONS.CLEAR_ERROR                         });

  return (
    <AdminContext.Provider value={{ ...state, loginAdmin, logoutAdmin, setStudents, setSelected,
      updateStudent, setStats, setSearch, setStatusFilter, setBranchFilter,
      clearFilters, setPage, setLoading, setError, clearError }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
};

export default AdminContext;