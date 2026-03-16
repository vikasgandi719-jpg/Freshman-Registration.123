import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';

// ─── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  user:          null,
  token:         null,
  isLoggedIn:    false,
  isLoading:     true,
  error:         null,
  otpSent:       false,
  otpVerified:   false,
};

// ─── Action Types ──────────────────────────────────────────────────────────────
const AUTH_ACTIONS = {
  SET_LOADING:       'SET_LOADING',
  LOGIN_SUCCESS:     'LOGIN_SUCCESS',
  LOGOUT:            'LOGOUT',
  SET_ERROR:         'SET_ERROR',
  CLEAR_ERROR:       'CLEAR_ERROR',
  OTP_SENT:          'OTP_SENT',
  OTP_VERIFIED:      'OTP_VERIFIED',
  UPDATE_USER:       'UPDATE_USER',
  RESTORE_SESSION:   'RESTORE_SESSION',
};

// ─── Reducer ───────────────────────────────────────────────────────────────────
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user:       action.payload.user,
        token:      action.payload.token,
        isLoggedIn: true,
        isLoading:  false,
        error:      null,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };

    case AUTH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case AUTH_ACTIONS.OTP_SENT:
      return { ...state, otpSent: true, error: null };

    case AUTH_ACTIONS.OTP_VERIFIED:
      return { ...state, otpVerified: true };

    case AUTH_ACTIONS.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };

    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        user:       action.payload.user,
        token:      action.payload.token,
        isLoggedIn: true,
        isLoading:  false,
      };

    default:
      return state;
  }
};

// ─── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ──────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on app start
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token    = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (token && userData) {
          dispatch({
            type: AUTH_ACTIONS.RESTORE_SESSION,
            payload: { token, user: JSON.parse(userData) },
          });
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    restoreSession();
  }, []);

  // ─── Actions ────────────────────────────────────────────────────────────────
  const login = async (user, token) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user, token } });
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: 'Failed to save session.' });
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
    } catch (_) {}
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const setError   = (msg) => dispatch({ type: AUTH_ACTIONS.SET_ERROR,   payload: msg  });
  const clearError = ()    => dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR                 });
  const setLoading = (val) => dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: val  });
  const otpSent    = ()    => dispatch({ type: AUTH_ACTIONS.OTP_SENT                    });
  const otpVerified= ()    => dispatch({ type: AUTH_ACTIONS.OTP_VERIFIED                });

  const updateUser = async (updates) => {
    const updated = { ...state.user, ...updates };
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updated));
    dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: updates });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        setError,
        clearError,
        setLoading,
        otpSent,
        otpVerified,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ──────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;