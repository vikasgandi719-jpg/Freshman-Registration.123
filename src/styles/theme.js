// ─── Palette ──────────────────────────────────────────────────────────────────
const PRIMARY = {
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

const NEUTRAL = {
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

const SUCCESS = {
  light: '#F0FDF4',
  main:  '#22C55E',
  dark:  '#15803D',
  text:  '#14532D',
};

const WARNING = {
  light: '#FFF7ED',
  main:  '#F97316',
  dark:  '#C2410C',
  text:  '#7C2D12',
};

const ERROR = {
  light: '#FFF1F2',
  main:  '#F43F5E',
  dark:  '#BE123C',
  text:  '#881337',
};

const INFO = {
  light: '#EFF6FF',
  main:  '#3B82F6',
  dark:  '#1D4ED8',
  text:  '#1E3A8A',
};

// ─── Semantic tokens (light mode) ─────────────────────────────────────────────
const lightTokens = {
  background: {
    screen:  NEUTRAL[50],
    surface: '#FFFFFF',
    card:    '#FFFFFF',
    input:   NEUTRAL[50],
    overlay: 'rgba(0, 0, 0, 0.5)',
    modal:   '#FFFFFF',
  },
  text: {
    primary:   NEUTRAL[900],
    secondary: NEUTRAL[700],
    tertiary:  NEUTRAL[400],
    disabled:  NEUTRAL[300],
    inverse:   '#FFFFFF',
    link:      PRIMARY[700],
    error:     ERROR.dark,
  },
  border: {
    default: NEUTRAL[200],
    light:   NEUTRAL[100],
    focus:   PRIMARY[700],
    error:   ERROR.main,
    success: SUCCESS.main,
  },
  shadow: {
    sm: {
      shadowColor:   '#000',
      shadowOffset:  { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius:  4,
      elevation:     1,
    },
    md: {
      shadowColor:   '#000',
      shadowOffset:  { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius:  10,
      elevation:     3,
    },
    lg: {
      shadowColor:   '#000',
      shadowOffset:  { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius:  16,
      elevation:     6,
    },
  },
};

// ─── Semantic tokens (dark mode) ──────────────────────────────────────────────
const darkTokens = {
  background: {
    screen:  NEUTRAL[900],
    surface: NEUTRAL[800],
    card:    NEUTRAL[800],
    input:   NEUTRAL[800],
    overlay: 'rgba(0, 0, 0, 0.7)',
    modal:   NEUTRAL[800],
  },
  text: {
    primary:   '#F1F5F9',
    secondary: NEUTRAL[300],
    tertiary:  NEUTRAL[400],
    disabled:  NEUTRAL[600],
    inverse:   NEUTRAL[900],
    link:      PRIMARY[300],
    error:     ERROR.main,
  },
  border: {
    default: NEUTRAL[700],
    light:   NEUTRAL[800],
    focus:   PRIMARY[400],
    error:   ERROR.main,
    success: SUCCESS.main,
  },
  shadow: {
    sm: {
      shadowColor:   '#000',
      shadowOffset:  { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius:  4,
      elevation:     1,
    },
    md: {
      shadowColor:   '#000',
      shadowOffset:  { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius:  10,
      elevation:     3,
    },
    lg: {
      shadowColor:   '#000',
      shadowOffset:  { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius:  16,
      elevation:     6,
    },
  },
};

// ─── Build theme object ────────────────────────────────────────────────────────
const buildTheme = (isDark = false) => {
  const tokens = isDark ? darkTokens : lightTokens;

  return {
    isDark,

    // ─── Palette ──────────────────────────────────────────────────────────────
    palette: { PRIMARY, NEUTRAL, SUCCESS, WARNING, ERROR, INFO },

    // ─── Colors ───────────────────────────────────────────────────────────────
    colors: {
      // Primary
      primary:      PRIMARY[700],
      primaryLight: PRIMARY[100],
      primaryDark:  PRIMARY[900],

      // Status
      success:      SUCCESS.main,
      successLight: SUCCESS.light,
      successDark:  SUCCESS.dark,

      warning:      WARNING.main,
      warningLight: WARNING.light,
      warningDark:  WARNING.dark,

      error:        ERROR.main,
      errorLight:   ERROR.light,
      errorDark:    ERROR.dark,

      info:         INFO.main,
      infoLight:    INFO.light,
      infoDark:     INFO.dark,

      // Document status
      status: {
        approved:    SUCCESS.dark,
        pending:     WARNING.dark,
        rejected:    ERROR.dark,
        not_uploaded:NEUTRAL[500],
        incomplete:  NEUTRAL[500],
      },

      // Semantic tokens
      background:    tokens.background.screen,
      surface:       tokens.background.surface,
      card:          tokens.background.card,
      input:         tokens.background.input,
      overlay:       tokens.background.overlay,
      modal:         tokens.background.modal,

      text:          tokens.text.primary,
      textSecondary: tokens.text.secondary,
      textTertiary:  tokens.text.tertiary,
      textDisabled:  tokens.text.disabled,
      textInverse:   tokens.text.inverse,
      link:          tokens.text.link,

      border:        tokens.border.default,
      borderLight:   tokens.border.light,
      borderFocus:   tokens.border.focus,
      borderError:   tokens.border.error,
    },

    // ─── Typography ───────────────────────────────────────────────────────────
    typography: {
      h1:       { fontSize: 32, fontWeight: '900', color: tokens.text.primary,   lineHeight: 40 },
      h2:       { fontSize: 26, fontWeight: '800', color: tokens.text.primary,   lineHeight: 34 },
      h3:       { fontSize: 22, fontWeight: '700', color: tokens.text.primary,   lineHeight: 30 },
      h4:       { fontSize: 18, fontWeight: '700', color: tokens.text.primary,   lineHeight: 26 },
      h5:       { fontSize: 16, fontWeight: '700', color: tokens.text.primary,   lineHeight: 24 },
      body1:    { fontSize: 15, fontWeight: '400', color: tokens.text.secondary, lineHeight: 24 },
      body2:    { fontSize: 13, fontWeight: '400', color: tokens.text.secondary, lineHeight: 20 },
      caption:  { fontSize: 11, fontWeight: '500', color: tokens.text.tertiary,  lineHeight: 16 },
      label:    { fontSize: 13, fontWeight: '600', color: tokens.text.secondary, lineHeight: 20 },
      button:   { fontSize: 15, fontWeight: '700', color: tokens.text.inverse,   lineHeight: 22 },
      overline: { fontSize: 11, fontWeight: '700', color: tokens.text.tertiary,  letterSpacing: 1, textTransform: 'uppercase' },
    },

    // ─── Spacing ──────────────────────────────────────────────────────────────
    spacing: {
      xs:   4,
      sm:   8,
      md:   16,
      lg:   24,
      xl:   32,
      xxl:  48,
    },

    // ─── Border radius ────────────────────────────────────────────────────────
    radius: {
      xs:   4,
      sm:   8,
      md:   12,
      lg:   16,
      xl:   20,
      xxl:  28,
      full: 9999,
    },

    // ─── Shadows ──────────────────────────────────────────────────────────────
    shadow: tokens.shadow,

    // ─── Component size tokens ────────────────────────────────────────────────
    components: {
      button: {
        height:            50,
        borderRadius:      12,
        paddingHorizontal: 20,
      },
      input: {
        height:            50,
        borderRadius:      12,
        borderWidth:       1.5,
        paddingHorizontal: 14,
      },
      card: {
        borderRadius: 14,
        padding:      16,
      },
      header: {
        height: 60,
      },
      tabBar: {
        height: 72,
      },
      avatar: {
        sm: 32,
        md: 44,
        lg: 60,
        xl: 90,
      },
    },
  };
};

// ─── Default (light) theme export ─────────────────────────────────────────────
export const lightTheme = buildTheme(false);
export const darkTheme  = buildTheme(true);
export const theme      = lightTheme;
export default theme;