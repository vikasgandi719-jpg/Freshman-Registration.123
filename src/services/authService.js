import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "../constants/config";

const DEMO_MODE = true;
const DEMO_STORAGE_KEY = "@demo_user_data";

let studentCounter = 1;

let storedUserData = null;

const authService = {
  login: async (uniqueId, password) => {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!uniqueId || !password) {
        throw new Error("Please enter Unique ID and Password");
      }

      const userData = storedUserData || {
        name: "Student",
        firstName: "Student",
        lastName: "",
        parentPhone: "9876543210",
        interhallTicket: "IHT001",
        dob: "2008-01-15",
      };

      return {
        user: {
          id: "1",
          uniqueId: uniqueId.toUpperCase(),
          name: userData.name || "Student",
          firstName: userData.firstName || "Student",
          lastName: userData.lastName || "",
          parentPhone: userData.parentPhone,
          interhallTicket: userData.interhallTicket,
          dob: userData.dob,
        },
        token: "demo_token_" + Date.now(),
      };
    }

    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.LOGIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uniqueId, password }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Login failed");
    }
    return response.json();
  },

  register: async (data) => {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const nameParts = (data.name || "").trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      storedUserData = {
        name: data.name,
        firstName: firstName,
        lastName: lastName,
        parentPhone: data.parentPhone,
        interhallTicket: data.interhallTicket,
        dob: data.dob ? data.dob.toISOString().split("T")[0] : null,
      };

      const year = data.dob ? data.dob.getFullYear() : new Date().getFullYear();
      const uniqueId = `${year}-bvritn-1a-${String(studentCounter++).padStart(4, "0")}`;

      return {
        message: "Registration successful (Demo Mode)",
        uniqueId: uniqueId,
        userId: "user_" + Date.now(),
        name: data.name,
        firstName: firstName,
        lastName: lastName,
      };
    }

    const payload = {
      name: data.name.trim(),
      parentPhone: data.parentPhone.trim(),
      interhallTicket: data.interhallTicket.trim().toUpperCase(),
      dob: data.dob ? data.dob.toISOString() : null,
      password: data.password,
    };

    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.REGISTER}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Registration failed");
    }
    return response.json();
  },

  logout: async () => {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      storedUserData = null;
      studentCounter = 1;
      return { message: "Logged out (Demo Mode)" };
    }

    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.LOGOUT}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  refreshToken: async (refreshToken) => {
    if (DEMO_MODE) {
      return { token: "demo_token_" + Date.now(), refreshToken };
    }

    const response = await fetch(
      `${API.BASE_URL}${API.ENDPOINTS.REFRESH_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      },
    );
    return response.json();
  },

  sendOTP: async (phone) => {
    if (DEMO_MODE) {
      return { message: "OTP sent (Demo Mode)", expiresIn: 300 };
    }

    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.SEND_OTP}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    return response.json();
  },

  verifyOTP: async (phone, otp) => {
    if (DEMO_MODE) {
      if (otp === "123456" || otp === "000000") {
        return { verified: true, token: "demo_otp_token_" + Date.now() };
      }
      throw new Error("Invalid OTP");
    }

    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.VERIFY_OTP}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    return response.json();
  },

  changePassword: async (oldPassword, newPassword) => {
    if (DEMO_MODE) {
      return { message: "Password changed (Demo Mode)" };
    }

    const response = await fetch(`${API.BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    return response.json();
  },

  forgotPassword: async (uniqueId) => {
    if (DEMO_MODE) {
      return { message: "Password reset link sent (Demo Mode)" };
    }

    const response = await fetch(`${API.BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uniqueId }),
    });
    return response.json();
  },

  resetPassword: async (token, newPassword) => {
    if (DEMO_MODE) {
      return { message: "Password reset (Demo Mode)" };
    }

    const response = await fetch(`${API.BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });
    return response.json();
  },
};

export default authService;
