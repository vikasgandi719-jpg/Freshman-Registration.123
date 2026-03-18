import AsyncStorage from "@react-native-async-storage/async-storage";
import { API, OTP } from "../constants/config";

const DEMO_MODE = true;
const DEMO_OTP = "123456";

const otpService = {
  sendOTP: async (phone) => {
    if (!phone) throw new Error("Phone number is required.");

    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        message: "OTP sent (Demo Mode)",
        expiresIn: 300,
        maskedPhone: phone.slice(0, 2) + "xxxxxx" + phone.slice(-2),
      };
    }

    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.SEND_OTP}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Failed to send OTP");
    }
    return response.json();
  },

  verifyOTP: async (phone, otp) => {
    if (!phone) throw new Error("Phone number is required.");
    if (!otp || otp.length < OTP.LENGTH)
      throw new Error(`OTP must be ${OTP.LENGTH} digits.`);

    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (otp === DEMO_OTP || otp === "000000") {
        return {
          verified: true,
          token: "demo_token_" + Date.now(),
          message: "OTP verified successfully (Demo Mode)",
        };
      }
      throw new Error("Invalid OTP. Use 123456 for demo.");
    }

    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.VERIFY_OTP}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Invalid OTP");
    }
    return response.json();
  },

  resendOTP: async (phone) => {
    if (!phone) throw new Error("Phone number is required.");

    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { message: "OTP resent (Demo Mode)", expiresIn: 300 };
    }

    const response = await fetch(`${API.BASE_URL}/auth/otp/resend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Failed to resend OTP");
    }
    return response.json();
  },

  sendEmailOTP: async (email) => {
    if (!email) throw new Error("Email is required.");

    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { message: "Email OTP sent (Demo Mode)", expiresIn: 300 };
    }

    const response = await fetch(`${API.BASE_URL}/auth/otp/email/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) throw new Error("Failed to send email OTP");
    return response.json();
  },

  verifyEmailOTP: async (email, otp) => {
    if (!email) throw new Error("Email is required.");
    if (!otp) throw new Error("OTP is required.");

    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (otp === DEMO_OTP) {
        return { verified: true, message: "Email OTP verified (Demo Mode)" };
      }
      throw new Error("Invalid OTP");
    }

    const response = await fetch(`${API.BASE_URL}/auth/otp/email/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) throw new Error("Invalid email OTP");
    return response.json();
  },

  checkOTPStatus: async (phone) => {
    if (DEMO_MODE) {
      return { sent: true, expiresAt: Date.now() + 300000, attemptsLeft: 3 };
    }

    const response = await fetch(
      `${API.BASE_URL}/auth/otp/status?phone=${encodeURIComponent(phone)}`,
    );
    return response.json();
  },
};

export default otpService;
