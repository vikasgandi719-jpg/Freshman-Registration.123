// In-memory OTP store. Replace with Redis or a `otp_codes` table
// before deploying to more than one instance.
const otpStore = new Map();

const OTP_TTL_MS  = 5 * 60 * 1000;
const OTP_LENGTH  = 6;
const MAX_ATTEMPTS = 5;

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
  if (record.attempts > MAX_ATTEMPTS) {
    otpStore.delete(phone);
    return { valid: false, reason: 'Too many attempts. Request a new OTP.' };
  }
  if (record.otp !== otp) return { valid: false, reason: 'Invalid OTP' };
  otpStore.delete(phone);
  return { valid: true };
};

const clearOTP = (phone) => otpStore.delete(phone);

// Sweep expired records every minute so the Map doesn't grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [phone, record] of otpStore.entries()) {
    if (now > record.expiresAt) otpStore.delete(phone);
  }
}, 60_000).unref?.();

module.exports = { generateOTP, storeOTP, verifyOTP, clearOTP };
