import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';
import { PRIMARY, NEUTRAL, BACKGROUND, TEXT, BORDER, SHADOW } from '../constants/colors';

// ─── Theme Definitions ─────────────────────────────────────────────────────────
export const LIGHT_THEME = {
  mode: 'light',
  colors: {
    primary:    PRIMARY[700],
    primaryLight: PRIMARY[100],
    background: BACKGROUND.screen,
    surface:    BACKGROUND.surface,
    card:       BACKGROUND.card,
    input:      BACKGROUND.input,
    border:     BORDER.default,
    borderLight:BORDER.light,
    text:       TEXT.primary,
    textSecondary: TEXT.secondary,
    textTertiary:  TEXT.tertiary,
    textDisabled:  TEXT.disabled,
    textInverse:   TEXT.inverse,
    link:       TEXT.link,
    error:      TEXT.error,
    headerBg:   '#FFFFFF',
    tabBarBg:   '#FFFFFF',
    tabBarActive: PRIMARY[700],
    tabBarInactive: NEUTRAL[400],
    shadow:     SHADOW.md,
  },
};

export const DARK_THEME = {
  mode: 'dark',
  colors: {
    primary:    PRIMARY[500],
    primaryLight: PRIMARY[900],
    background: '#0F172A',
    surface:    '#1E293B',
    card:       '#1E293B',
    input:      '#0F172A',
    border:     '#334155',
    borderLight:'#1E293B',
    text:       '#F1F5F9',
    textSecondary: '#CBD5E1',
    textTertiary:  '#94A3B8',
    textDisabled:  '#475569',
    textInverse:   '#0F172A',
    link:       PRIMARY[400],
    error:      '#F87171',
    headerBg:   '#1E293B',
    tabBarBg:   '#1E293B',
    tabBarActive: PRIMARY[400],
    tabBarInactive: '#475569',
    shadow:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  },
};

// ─── Reducer ───────────────────────────────────────────────────────────────────
const themeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return action.payload === 'dark' ? DARK_THEME : LIGHT_THEME;
    case 'TOGGLE_THEME':
      return state.mode === 'light' ? DARK_THEME : LIGHT_THEME;
    default:
      return state;
  }
};

// ─── Context ───────────────────────────────────────────────────────────────────
const ThemeContext = createContext(null);

// ─── Provider ──────────────────────────────────────────────────────────────────
export const ThemeProvider = ({ children }) => {
  const [theme, dispatch] = useReducer(themeReducer, LIGHT_THEME);

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
        if (saved === 'dark' || saved === 'light') {
          dispatch({ type: 'SET_THEME', payload: saved });
        }
      } catch (_) {}
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const next = theme.mode === 'light' ? 'dark' : 'light';
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, next);
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const setTheme = async (mode) => {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, mode);
    dispatch({ type: 'SET_THEME', payload: mode });
  };

  const isDark  = theme.mode === 'dark';
  const isLight = theme.mode === 'light';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDark, isLight }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ─── Hook ──────────────────────────────────────────────────────────────────────
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export default ThemeContext;