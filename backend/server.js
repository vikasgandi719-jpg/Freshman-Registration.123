require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const rateLimit = require('express-rate-limit');

const { errorHandler }  = require('./src/middleware/errorHandler');
const authRoutes        = require('./src/routes/authRoutes');
const studentRoutes     = require('./src/routes/studentRoutes');
const adminRoutes       = require('./src/routes/adminRoutes');
const documentRoutes    = require('./src/routes/documentRoutes');

const app = express();

// ─── Security & parsing ───────────────────────────────────────────────────────
app.use(helmet());

// CORS — restrict via env in production. Comma-separated list of origins.
const CORS_ORIGIN = process.env.CORS_ORIGIN;
if (CORS_ORIGIN && CORS_ORIGIN !== '*') {
  const origins = CORS_ORIGIN.split(',').map((s) => s.trim());
  app.use(cors({ origin: origins, credentials: true }));
} else {
  // Dev: allow all. Do NOT deploy to prod without CORS_ORIGIN set.
  app.use(cors());
  if (process.env.NODE_ENV === 'production') {
    console.warn('[WARN] CORS_ORIGIN not set in production — allowing all origins.');
  }
}

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// If behind a proxy/load-balancer, express-rate-limit needs this to see real IPs.
app.set('trust proxy', 1);

// ─── Rate limiters ────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 auth attempts per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later.' },
});

const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3, // 3 OTP requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many OTP requests, please slow down.' },
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth/login',         authLimiter);
app.use('/api/auth/register',      authLimiter);
app.use('/api/auth/change-password', authLimiter);
app.use('/api/auth/otp',           otpLimiter);

app.use('/api/auth',      authRoutes);
app.use('/api/student',   studentRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/documents', documentRoutes);

app.get('/', (req, res) => res.json({ message: 'BVRITN API is running ✓' }));

// ─── Error Handler (must be last) ─────────────────────────────────────────────
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
