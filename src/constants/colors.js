// ─── Primary Palette ──────────────────────────────────────────────────────────
export const PRIMARY = {
  50:  '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#3B82F6',
  600: '#2563EB',
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',
};

// ─── Neutral / Slate ──────────────────────────────────────────────────────────
export const NEUTRAL = {
  50:  '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
};

// ─── Status Colors ────────────────────────────────────────────────────────────
export const STATUS = {
  pending: {
    bg:   '#FFF7ED',
    text: '#C2410C',
    dot:  '#F97316',
    border: '#FED7AA',
  },
  approved: {
    bg:   '#F0FDF4',
    text: '#15803D',
    dot:  '#22C55E',
    border: '#BBF7D0',
  },
  rejected: {
    bg:   '#FFF1F2',
    text: '#BE123C',
    dot:  '#F43F5E',
    border: '#FECDD3',
  },
  incomplete: {
    bg:   '#F8FAFC',
    text: '#64748B',
    dot:  '#94A3B8',
    border: '#E2E8F0',
  },
};

// ─── Semantic Colors ──────────────────────────────────────────────────────────
export const SUCCESS = {
  light: '#F0FDF4',
  main:  '#22C55E',
  dark:  '#15803D',
  text:  '#14532D',
};

export const WARNING = {
  light: '#FFFBEB',
  main:  '#F59E0B',
  dark:  '#D97706',
  text:  '#92400E',
};

export const ERROR = {
  light: '#FFF1F2',
  main:  '#F43F5E',
  dark:  '#BE123C',
  text:  '#881337',
};

export const INFO = {
  light: '#EFF6FF',
  main:  '#3B82F6',
  dark:  '#1D4ED8',
  text:  '#1E3A8A',
};

// ─── Background & Surface ─────────────────────────────────────────────────────
export const BACKGROUND = {
  screen:  '#F8FAFC',
  surface: '#FFFFFF',
  card:    '#FFFFFF',
  input:   '#F8FAFC',
  overlay: 'rgba(0, 0, 0, 0.45)',
};

// ─── Text Colors ──────────────────────────────────────────────────────────────
export const TEXT = {
  primary:   '#0F172A',
  secondary: '#334155',
  tertiary:  '#64748B',
  disabled:  '#94A3B8',
  inverse:   '#FFFFFF',
  link:      '#1D4ED8',
  error:     '#BE123C',
};

// ─── Border Colors ────────────────────────────────────────────────────────────
export const BORDER = {
  light:  '#F1F5F9',
  default:'#E2E8F0',
  dark:   '#CBD5E1',
  focus:  '#1D4ED8',
  error:  '#EF4444',
};

// ─── Shadow ───────────────────────────────────────────────────────────────────
export const SHADOW = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
};

// ─── Dark Theme Override ──────────────────────────────────────────────────────
export const DARK = {
  bg:      '#0F172A',
  surface: '#1E293B',
  card:    '#1E293B',
  border:  '#334155',
  text:    '#F1F5F9',
  subtext: '#94A3B8',
};