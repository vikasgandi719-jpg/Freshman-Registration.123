const router = require('express').Router();
const auth   = require('../middleware/auth');
const {
  register, login, logout,
  sendOTP, verifyOTP, resendOTP,
  refreshToken, changePassword,
} = require('../controllers/authController');

// Public
router.post('/register',      register);
router.post('/login',         login);
router.post('/logout',        logout);
router.post('/refresh',       refreshToken);
router.post('/otp/send',      sendOTP);
router.post('/otp/verify',    verifyOTP);
router.post('/otp/resend',    resendOTP);

// Protected
router.post('/change-password', auth, changePassword);

module.exports = router;
