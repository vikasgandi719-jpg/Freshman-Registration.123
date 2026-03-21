const User              = require('../models/User');
const { hash, compare } = require('../utils/hashPassword');
const { signToken }     = require('../config/jwt');
const { generateStudentId } = require('../utils/generateId');
const { generateOTP, storeOTP, verifyOTP } = require('../services/otpService');
const { success, error } = require('../utils/responseHelper');

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, parentPhone, interhallTicket, dob, password } = req.body;

    if (!name || !parentPhone || !interhallTicket || !dob || !password) {
      return error(res, 'All fields are required', 400);
    }

    // Check duplicate interhall ticket
    const existing = await User.findByUniqueId(interhallTicket);
    if (existing) return error(res, 'Student already registered', 409);

    const counter  = await User.getNextCounter();
    const uniqueId = generateStudentId(counter);
    const passwordHash = await hash(password);

    const user = await User.create({
      name: name.trim(),
      parentPhone: parentPhone.trim(),
      interhallTicket: interhallTicket.trim().toUpperCase(),
      dob,
      passwordHash,
      uniqueId,
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
  // JWT is stateless; client drops the token
  return success(res, {}, 'Logged out successfully');
};

// POST /api/auth/otp/send
exports.sendOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) return error(res, 'Phone number is required', 400);

    const otp = generateOTP();
    storeOTP(phone, otp);

    // In production: send via SMS API (e.g., Twilio / MSG91)
    console.log(`[OTP] ${phone} → ${otp}`);

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

    const token = signToken({ phone, verified: true });
    return success(res, { verified: true, token }, 'OTP verified successfully');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/otp/resend
exports.resendOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) return error(res, 'Phone number is required', 400);

    const otp = generateOTP();
    storeOTP(phone, otp);
    console.log(`[OTP Resend] ${phone} → ${otp}`);

    return success(res, { expiresIn: 300 }, 'OTP resent successfully');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/refresh
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return error(res, 'Refresh token required', 400);

    // For simplicity, sign a new token; in production use a refresh token table
    const { verifyToken } = require('../config/jwt');
    const decoded = verifyToken(refreshToken);
    const newToken = signToken({ id: decoded.id, uniqueId: decoded.uniqueId, role: decoded.role });
    return success(res, { token: newToken }, 'Token refreshed');
  } catch (err) {
    return error(res, 'Invalid refresh token', 401);
  }
};

// POST /api/auth/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

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

