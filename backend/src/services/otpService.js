// In-memory OTP store (replace with Redis in production)
const otpStore = new Map();

const OTP_TTL_MS  = 5 * 60 * 1000; // 5 minutes
const OTP_LENGTH  = 6;

const generateOTP = () =>
  String(Math.floor(Math.random() * 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, '0');

const storeOTP = (phone, otp) => {
  otpStore.set(phone, { otp, expiresAt: Date.now() + OTP_TTL_MS, attempts: 0 });
};

const verifyOTP = (phone, otp) => {
  const record = otpStore.get(phone);
  if (!record) return { valid: false, reason: 'OTP not sent or expired' };
  if (Date.now() > record.expiresAt) {
    otpStore.delete(phone);
    return { valid: false, reason: 'OTP has expired' };
  }
  record.attempts += 1;
  if (record.attempts > 5) return { valid: false, reason: 'Too many attempts' };
  if (record.otp !== otp) return { valid: false, reason: 'Invalid OTP' };
  otpStore.delete(phone);
  return { valid: true };
};

const clearOTP = (phone) => otpStore.delete(phone);

module.exports = { generateOTP, storeOTP, verifyOTP, clearOTP };