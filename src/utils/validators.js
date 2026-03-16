import { VALIDATION } from '../constants/config';

// ─── Email ─────────────────────────────────────────────────────────────────────
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return VALIDATION.EMAIL_PATTERN.test(email.trim());
};

// ─── Phone ─────────────────────────────────────────────────────────────────────
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  return VALIDATION.PHONE_PATTERN.test(phone.replace(/\s/g, ''));
};

// ─── Password ──────────────────────────────────────────────────────────────────
export const isValidPassword = (password) => {
  if (!password) return false;
  return password.length >= VALIDATION.PASSWORD_MIN_LENGTH;
};

export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

export const getPasswordStrength = (password) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8)             score++;
  if (password.length >= 12)            score++;
  if (/[A-Z]/.test(password))           score++;
  if (/[0-9]/.test(password))           score++;
  if (/[^A-Za-z0-9]/.test(password))    score++;
  return score; // 0 – 5
};

export const getPasswordRequirements = (password = '') => ({
  minLength:    password.length >= 8,
  hasUppercase: /[A-Z]/.test(password),
  hasNumber:    /[0-9]/.test(password),
  hasSpecial:   /[^A-Za-z0-9]/.test(password),
});

// ─── Roll number ───────────────────────────────────────────────────────────────
export const isValidRollNumber = (roll) => {
  if (!roll || typeof roll !== 'string') return false;
  return VALIDATION.ROLL_NUMBER_PATTERN.test(roll.trim().toUpperCase());
};

// ─── Name ──────────────────────────────────────────────────────────────────────
export const isValidName = (name) => {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return (
    trimmed.length >= VALIDATION.NAME_MIN_LENGTH &&
    trimmed.length <= VALIDATION.NAME_MAX_LENGTH &&
    /^[a-zA-Z\s.'-]+$/.test(trimmed)
  );
};

// ─── OTP ───────────────────────────────────────────────────────────────────────
export const isValidOTP = (otp, length = 6) => {
  if (!otp || typeof otp !== 'string') return false;
  return otp.length === length && /^\d+$/.test(otp);
};

// ─── File ──────────────────────────────────────────────────────────────────────
export const isValidFileSize = (sizeBytes, maxMB = 5) => {
  if (!sizeBytes) return false;
  return sizeBytes <= maxMB * 1024 * 1024;
};

export const isValidFileType = (mimeType, allowedTypes = []) => {
  if (!mimeType || !allowedTypes.length) return false;
  return allowedTypes.some((type) => {
    if (type.endsWith('/*')) {
      return mimeType.startsWith(type.replace('/*', '/'));
    }
    return mimeType === type;
  });
};

// ─── Date ──────────────────────────────────────────────────────────────────────
export const isValidDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return !isNaN(d.getTime());
};

export const isAdult = (dob, minAge = 16) => {
  if (!dob) return true; // Optional field — don't block
  const birthDate = new Date(dob);
  const today     = new Date();
  const age       = today.getFullYear() - birthDate.getFullYear();
  return age >= minAge;
};

// ─── URL ───────────────────────────────────────────────────────────────────────
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ─── Form validators ───────────────────────────────────────────────────────────
export const validateLoginForm = (email, password) => {
  const errors = {};
  if (!email?.trim())
    errors.email = 'Email is required.';
  else if (!isValidEmail(email))
    errors.email = 'Enter a valid email address.';

  if (!password?.trim())
    errors.password = 'Password is required.';
  else if (password.length < VALIDATION.PASSWORD_MIN_LENGTH)
    errors.password = `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters.`;

  return errors; // {} means valid
};

export const validateRegisterForm = (data = {}) => {
  const errors = {};

  if (!isValidName(data.name))
    errors.name = 'Enter a valid full name (2–60 characters, letters only).';

  if (!isValidEmail(data.email))
    errors.email = 'Enter a valid email address.';

  if (!isValidPhone(data.phone))
    errors.phone = 'Enter a valid 10-digit phone number.';

  if (!isValidPassword(data.password))
    errors.password = `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters.`;

  if (!passwordsMatch(data.password, data.confirmPassword))
    errors.confirmPassword = 'Passwords do not match.';

  if (!isValidRollNumber(data.rollNumber))
    errors.rollNumber = 'Enter a valid roll number (e.g. 21BCE1234).';

  if (!data.branch)
    errors.branch = 'Please select your branch.';

  if (!data.semester)
    errors.semester = 'Please select your semester.';

  return errors;
};

export const validateProfileForm = (data = {}) => {
  const errors = {};

  if (data.name !== undefined && !isValidName(data.name))
    errors.name = 'Enter a valid full name.';

  if (data.email !== undefined && !isValidEmail(data.email))
    errors.email = 'Enter a valid email address.';

  if (data.phone !== undefined && !isValidPhone(data.phone))
    errors.phone = 'Enter a valid 10-digit phone number.';

  return errors;
};

export const validateAdminLoginForm = (email, password) => {
  const errors = {};

  if (!email?.trim())
    errors.email = 'Admin email is required.';
  else if (!isValidEmail(email))
    errors.email = 'Enter a valid email address.';

  if (!password?.trim())
    errors.password = 'Password is required.';

  return errors;
};

export const validateDocumentUpload = (file, maxMB = 5, allowedTypes = []) => {
  const errors = {};

  if (!file)
    errors.file = 'Please select a file.';
  else if (allowedTypes.length && !isValidFileType(file.mimeType, allowedTypes))
    errors.file = `Invalid file type. Allowed: ${allowedTypes.join(', ')}`;
  else if (file.size && !isValidFileSize(file.size, maxMB))
    errors.file = `File is too large. Maximum size is ${maxMB}MB.`;

  return errors;
};