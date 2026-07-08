const User              = require('../models/User');
const { hash, compare } = require('../utils/hashPassword');
const { signToken }     = require('../config/jwt');
const { generateStudentId } = require('../utils/generateId');
const { generateOTP, storeOTP, verifyOTP } = require('../services/otpService');
const { success, error } = require('../utils/responseHelper');

const ALLOWED_BRANCHES = new Set([
  'CSE','CSD','ECE','EEE','ME','MECH','CE','CIVIL',
  'CSBS','CHE','CHEM','CSM','BME','PHE','PHARM','IT',
]);

const validatePassword = (pw) => {
  if (!pw || typeof pw !== 'string') return 'Password is required';
  if (pw.length < 8) return 'Password must be at least 8 characters';
  return null;
};

const validatePhone = (p) => /^[6-9]\d{9}$/.test(p || '');

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, parentPhone, interhallTicket, dob, password } = req.body;
    let { branchCode } = req.body;

    if (!name || !parentPhone || !interhallTicket || !dob || !password) {
      return error(res, 'All fields are required', 400);
    }
    if (name.trim().length < 2) {
      return error(res, 'Name is too short', 400);
    }
    if (!validatePhone(parentPhone)) {
      return error(res, 'Parent phone must be a valid 10-digit Indian mobile number', 400);
    }
    const pwErr = validatePassword(password);
    if (pwErr) return error(res, pwErr, 400);

    if (branchCode) {
      branchCode = String(branchCode).toUpperCase();
      if (!ALLOWED_BRANCHES.has(branchCode)) {
        return error(res, 'Unknown branch code', 400);
      }
    } else {
      branchCode = '1A';
    }

    const existing = await User.findByInterhallTicket(interhallTicket.trim().toUpperCase());
    if (existing) return error(res, 'Student already registered', 409);

    const counter  = await User.getNextCounter();
    const uniqueId = generateStudentId(counter, branchCode);
    const passwordHash = await hash(password);

    const user = await User.create({
      name: name.trim(),
      parentPhone: parentPhone.trim(),
      interhallTicket: interhallTicket.trim().toUpperCase(),
      dob,
      passwordHash,
      uniqueId,
      branchCode,
    });

    return success(res, {
      uniqueId: user.unique_id,
      userId: user.id,
      name: user.name,
    }, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { uniqueId, password } = req.body;
    if (!uniqueId || !password) return error(res, 'Unique ID and password are required', 400);

    const user = await User.findByUniqueId(uniqueId.toUpperCase().trim());
    if (!user) return error(res, 'Invalid credentials', 401);

    const valid = await compare(password, user.password_hash);
    if (!valid) return error(res, 'Invalid credentials', 401);

    const token = signToken({ id: user.id, uniqueId: user.unique_id, role: 'student' });

    return success(res, {
      token,
      user: {
        id: user.id,
        uniqueId: user.unique_id,
        name: user.name,
        verificationStatus: user.verification_status,
      },
    }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
  return success(res, {}, 'Logged out successfully');
};

// POST /api/auth/otp/send
exports.sendOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!validatePhone(phone)) {
      return error(res, 'A valid 10-digit phone number is required', 400);
    }

    const otp = generateOTP();
    storeOTP(phone, otp);

    // TODO: send via SMS gateway (Twilio / MSG91).
    // OTP logging is dev-only — never in production.
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[OTP dev] ${phone} → ${otp}`);
    }

    return success(res, {
      maskedPhone: phone.slice(0, 2) + 'xxxxxx' + phone.slice(-2),
      expiresIn: 300,
    }, 'OTP sent successfully');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/otp/verify
exports.verifyOTP = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return error(res, 'Phone and OTP are required', 400);

    const result = verifyOTP(phone, otp);
    if (!result.valid) return error(res, result.reason, 400);

    const token = signToken({ phone, verified: true }, { expiresIn: '15m' });
    return success(res, { verified: true, token }, 'OTP verified successfully');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/otp/resend
exports.resendOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!validatePhone(phone)) {
      return error(res, 'A valid 10-digit phone number is required', 400);
    }

    const otp = generateOTP();
    storeOTP(phone, otp);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[OTP resend dev] ${phone} → ${otp}`);
    }

    return success(res, { expiresIn: 300 }, 'OTP resent successfully');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/refresh
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return error(res, 'Refresh token required', 400);

    const { verifyToken } = require('../config/jwt');
    const decoded = verifyToken(refreshToken);
    if (decoded.type && decoded.type !== 'refresh') {
      return error(res, 'Not a refresh token', 401);
    }
    const newToken = signToken({
      id: decoded.id, uniqueId: decoded.uniqueId, role: decoded.role,
    });
    return success(res, { token: newToken }, 'Token refreshed');
  } catch (err) {
    return error(res, 'Invalid refresh token', 401);
  }
};

// POST /api/auth/change-password (auth required)
exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const pwErr = validatePassword(newPassword);
    if (pwErr) return error(res, pwErr, 400);

    const user = await User.findById(userId);
    if (!user) return error(res, 'User not found', 404);

    const valid = await compare(oldPassword, user.password_hash);
    if (!valid) return error(res, 'Current password is incorrect', 401);

    const newHash = await hash(newPassword);
    await User.updatePassword(userId, newHash);

    return success(res, {}, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
};
