// ─── App Info ─────────────────────────────────────────────────────────────────
export const APP = {
  NAME:        'BVRITN Document Verification',
  SHORT_NAME:  'DocVerify',
  VERSION:     '1.0.0',
  BUILD:       '1',
  SUPPORT_EMAIL: 'support@bvritn.ac.in',
  COLLEGE_NAME:  'BVRITN College of Engineering',
  COLLEGE_SHORT: 'BVRITN',
};

// ─── API Configuration ────────────────────────────────────────────────────────
export const API = {
  BASE_URL:    'https://api.bvritn.ac.in/v1',     // replace with real URL
  TIMEOUT:     15000,                               // 15 seconds
  RETRY_COUNT: 3,

  ENDPOINTS: {
    // Auth
    LOGIN:            '/auth/login',
    REGISTER:         '/auth/register',
    LOGOUT:           '/auth/logout',
    REFRESH_TOKEN:    '/auth/refresh',
    SEND_OTP:         '/auth/otp/send',
    VERIFY_OTP:       '/auth/otp/verify',

    // Student
    STUDENT_PROFILE:  '/student/profile',
    STUDENT_UPDATE:   '/student/update',
    STUDENT_PHOTO:    '/student/photo',

    // Documents
    DOCUMENTS_LIST:   '/documents',
    DOCUMENT_UPLOAD:  '/documents/upload',
    DOCUMENT_STATUS:  '/documents/status',

    // Admin
    ADMIN_LOGIN:      '/admin/login',
    ADMIN_STUDENTS:   '/admin/students',
    ADMIN_VERIFY:     '/admin/verify',
    ADMIN_REJECT:     '/admin/reject',
    ADMIN_STATS:      '/admin/stats',
    ADMIN_BRANCHES:   '/admin/branches',
  },
};

// ─── Storage Keys ─────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  AUTH_TOKEN:     '@bvritn_auth_token',
  REFRESH_TOKEN:  '@bvritn_refresh_token',
  USER_DATA:      '@bvritn_user_data',
  ADMIN_DATA:     '@bvritn_admin_data',
  ONBOARDING:     '@bvritn_onboarding_done',
  THEME:          '@bvritn_theme',
  LAST_LOGIN:     '@bvritn_last_login',
};

// ─── OTP Configuration ────────────────────────────────────────────────────────
export const OTP = {
  LENGTH:          6,
  RESEND_COOLDOWN: 30,     // seconds
  EXPIRY:          300,    // seconds (5 min)
};

// ─── File Upload Limits ───────────────────────────────────────────────────────
export const UPLOAD = {
  MAX_FILE_SIZE_MB:   5,
  MAX_PHOTO_SIZE_MB:  2,
  ALLOWED_DOC_TYPES:  ['application/pdf', 'image/jpeg', 'image/png'],
  ALLOWED_IMG_TYPES:  ['image/jpeg', 'image/png', 'image/webp'],
  IMAGE_QUALITY:      0.8,
  IMAGE_ASPECT_RATIO: [1, 1],
};

// ─── Pagination ───────────────────────────────────────────────────────────────
export const PAGINATION = {
  PAGE_SIZE:      20,
  INITIAL_PAGE:   1,
};

// ─── Validation Rules ─────────────────────────────────────────────────────────
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH:     2,
  NAME_MAX_LENGTH:     60,
  PHONE_LENGTH:        10,
  ROLL_NUMBER_PATTERN: /^[A-Z0-9]{5,12}$/,
  EMAIL_PATTERN:       /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN:       /^[6-9]\d{9}$/,
};

// ─── App Screen Names ─────────────────────────────────────────────────────────
export const SCREENS = {
  // Auth
  STARTING:          'StartingScreen',
  LOGIN:             'LoginScreen',
  REGISTER:          'RegisterScreen',
  OTP_VERIFICATION:  'OTPVerificationScreen',
  ADMIN_LOGIN:       'AdminLoginScreen',

  // Student
  STUDENT_DASHBOARD: 'StudentDashboard',
  DOCUMENT_UPLOAD:   'DocumentUploadScreen',
  PROFILE:           'ProfileScreen',
  DOCUMENT_DETAIL:   'DocumentDetailScreen',

  // Admin
  ADMIN_DASHBOARD:   'AdminDashboard',
  STUDENT_LIST:      'StudentListScreen',
  STUDENT_DETAIL:    'StudentDetailScreen',
  VERIFICATION:      'VerificationScreen',
  BRANCH_MANAGEMENT: 'BranchManagementScreen',
  ADMIN_SETTINGS:    'AdminSettingsScreen',
};

// ─── Toast / Alert Durations ──────────────────────────────────────────────────
export const TOAST = {
  SHORT:  2000,
  MEDIUM: 3500,
  LONG:   5000,
};