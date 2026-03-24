import api from "./api";
import { API } from "../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants/config";
import { BRANCHES } from "../constants/branches";

const ADMIN_DEMO_MODE = true;

// Demo credentials for different admin roles
// Super Admin, Verification Officer, Document Officer
const ADMIN_CREDENTIALS = {
  super_admin: {
    email: "admin@bvritn.ac.in",
    password: "admin@123",
    name: "Super Admin",
  },
  verification_officer: {
    email: "verification@bvritn.ac.in",
    password: "verification@123",
    name: "Verification Officer",
  },
  document_officer: {
    email: "document@bvritn.ac.in",
    password: "document@123",
    name: "Document Officer",
  },
};

// Generate branch admin credentials for each branch
const BRANCH_ADMIN_CREDENTIALS = BRANCHES.map((branch) => ({
  email: `ba_${branch.id}@bvritn.ac.in`,
  password: `ba_${branch.id}@123`,
  name: `${branch.shortName} Branch Admin`,
  branchId: branch.id,
}));

const ALL_CREDENTIALS = [
  ...Object.entries(ADMIN_CREDENTIALS).map(([role, creds]) => ({
    ...creds,
    role,
  })),
  ...BRANCH_ADMIN_CREDENTIALS.map((creds) => ({
    ...creds,
    role: "branch_admin",
  })),
];

// ─── Shared demo student store (exported so authService can write to it) ──────
export const demoStudentStore = new Map();

export const addDemoStudent = (studentData) => {
  const student = {
    id: studentData.userId || `user_${Date.now()}`,
    uniqueId: studentData.uniqueId,
    name: studentData.name || "",
    firstName: studentData.firstName || "",
    lastName: studentData.lastName || "",
    parentPhone: studentData.parentPhone || "",
    interhallTicket: studentData.interhallTicket || "",
    dob: studentData.dob || null,
    branchCode: studentData.branchCode || "",
    verificationStatus: "pending",
    createdAt: new Date().toISOString(),
    email: "",
    phone: "",
    address: "",
    fatherName: "",
    motherName: "",
    documents: [],
  };
  demoStudentStore.set(studentData.uniqueId, student);
  return student;
};

const adminService = {
  adminLogin: async (email, password) => {
    if (ADMIN_DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 1000));
      if (!email || !password)
        throw new Error("Please enter email and password");

      // Check credentials for all admin roles
      let matchedAdmin = null;
      for (const creds of ALL_CREDENTIALS) {
        if (
          email.trim().toLowerCase() === creds.email &&
          password === creds.password
        ) {
          matchedAdmin = {
            id: `${creds.role}_${Date.now()}`,
            name: creds.name,
            email: creds.email,
            role: creds.role,
            branchId: creds.branchId || null,
          };
          break;
        }
      }

      if (!matchedAdmin) {
        throw new Error("Invalid admin credentials");
      }

      return {
        admin: matchedAdmin,
        token: "demo_admin_token_" + Date.now(),
      };
    }
    const response = await api.post(API.ENDPOINTS.ADMIN_LOGIN, {
      email,
      password,
    });
    if (response.token)
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
    return response;
  },

  getStudents: async ({
    page = 1,
    limit = 20,
    branch = null,
    status = null,
    search = "",
  } = {}) => {
    if (ADMIN_DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 400));
      let students = Array.from(demoStudentStore.values());
      if (branch) students = students.filter((s) => s.branchCode === branch);
      if (status)
        students = students.filter((s) => s.verificationStatus === status);
      if (search) {
        const q = search.toLowerCase();
        students = students.filter(
          (s) =>
            s.name?.toLowerCase().includes(q) ||
            s.uniqueId?.toLowerCase().includes(q) ||
            s.email?.toLowerCase().includes(q),
        );
      }
      students.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const total = students.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const paginated = students.slice((page - 1) * limit, page * limit);
      return { data: paginated, total, totalPages, page };
    }
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (branch) params.append("branch", branch);
    if (status) params.append("status", status);
    if (search) params.append("search", search);
    return await api.get(
      `${API.ENDPOINTS.ADMIN_STUDENTS}?${params.toString()}`,
    );
  },

  getStudentById: async (studentId) => {
    if (ADMIN_DEMO_MODE) {
      const student = Array.from(demoStudentStore.values()).find(
        (s) => s.id === studentId,
      );
      return student || { id: studentId, name: "Unknown Student" };
    }
    return await api.get(`${API.ENDPOINTS.ADMIN_STUDENTS}/${studentId}`);
  },

  verifyStudent: async (studentId) => {
    if (ADMIN_DEMO_MODE) {
      for (const [key, s] of demoStudentStore.entries())
        if (s.id === studentId) {
          demoStudentStore.set(key, { ...s, verificationStatus: "approved" });
          break;
        }
      return { success: true, message: "Verified (Demo)" };
    }
    return await api.post(`${API.ENDPOINTS.ADMIN_VERIFY}/${studentId}`, {
      action: "approve",
    });
  },

  rejectStudent: async (studentId, reason) => {
    if (ADMIN_DEMO_MODE) {
      for (const [key, s] of demoStudentStore.entries())
        if (s.id === studentId) {
          demoStudentStore.set(key, {
            ...s,
            verificationStatus: "rejected",
            rejectionReason: reason,
          });
          break;
        }
      return { success: true, message: "Rejected (Demo)" };
    }
    return await api.post(`${API.ENDPOINTS.ADMIN_REJECT}/${studentId}`, {
      action: "reject",
      reason,
    });
  },

  resetStudentStatus: async (studentId) => {
    if (ADMIN_DEMO_MODE) {
      for (const [key, s] of demoStudentStore.entries())
        if (s.id === studentId) {
          demoStudentStore.set(key, {
            ...s,
            verificationStatus: "pending",
            rejectionReason: null,
          });
          break;
        }
      return { success: true };
    }
    return await api.patch(
      `${API.ENDPOINTS.ADMIN_STUDENTS}/${studentId}/reset`,
      { status: "pending" },
    );
  },

  getStats: async () => {
    if (ADMIN_DEMO_MODE) {
      const students = Array.from(demoStudentStore.values());
      return {
        totalStudents: students.length,
        approved: students.filter((s) => s.verificationStatus === "approved")
          .length,
        pending: students.filter((s) => s.verificationStatus === "pending")
          .length,
        rejected: students.filter((s) => s.verificationStatus === "rejected")
          .length,
        incomplete: students.filter(
          (s) => s.verificationStatus === "incomplete",
        ).length,
        totalTrend: 0,
        approvedTrend: 0,
      };
    }
    return await api.get(API.ENDPOINTS.ADMIN_STATS);
  },

  getBranches: async () => {
    if (ADMIN_DEMO_MODE) {
      return [
        {
          id: "1",
          name: "Computer Science & Engineering",
          code: "CSE",
          seats: 60,
        },
        {
          id: "2",
          name: "Electronics & Communication Eng.",
          code: "ECE",
          seats: 60,
        },
        {
          id: "3",
          name: "Electrical & Electronics Eng.",
          code: "EEE",
          seats: 60,
        },
        { id: "4", name: "Mechanical Engineering", code: "MECH", seats: 60 },
        { id: "5", name: "Civil Engineering", code: "CIVIL", seats: 60 },
        { id: "6", name: "Information Technology", code: "IT", seats: 60 },
      ];
    }
    return await api.get(API.ENDPOINTS.ADMIN_BRANCHES);
  },

  updateBranch: async (branchId, data) => {
    if (ADMIN_DEMO_MODE) return { success: true };
    return await api.put(`${API.ENDPOINTS.ADMIN_BRANCHES}/${branchId}`, data);
  },

  verifyDocument: async (documentId) => {
    if (ADMIN_DEMO_MODE) return { success: true };
    return await api.post(`/admin/documents/${documentId}/verify`, {});
  },

  rejectDocument: async (documentId, reason) => {
    if (ADMIN_DEMO_MODE) return { success: true };
    return await api.post(`/admin/documents/${documentId}/reject`, { reason });
  },

  exportStudentData: async (filters = {}) => {
    if (ADMIN_DEMO_MODE) return { downloadUrl: "" };
    return await api.post("/admin/export", filters);
  },
};

export default adminService;
