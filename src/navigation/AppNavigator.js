import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer }  from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth }    from '../context/AuthContext';
import { useTheme }   from '../context/ThemeContext';

import AuthNavigator    from './AuthNavigator';
import StudentNavigator from './StudentNavigator';
import AdminNavigator   from './AdminNavigator';

const Stack = createNativeStackNavigator();

// ─── Splash / Loading Screen ──────────────────────────────────────────────────
const SplashScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.splash, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

// ─── App Navigator ────────────────────────────────────────────────────────────
const AppNavigator = () => {
  const { isLoggedIn, isLoading, user } = useAuth();
  const { theme } = useTheme();

  // Determine user role
  const isAdmin = user?.role === 'admin'       ||
                  user?.role === 'super_admin'  ||
                  user?.role === 'branch_admin' ||
                  user?.role === 'verifier';

  const navigationTheme = {
    dark: theme.mode === 'dark',
    colors: {
      primary:    theme.colors.primary,
      background: theme.colors.background,
      card:       theme.colors.surface,
      text:       theme.colors.text,
      border:     theme.colors.border,
      notification: theme.colors.primary,
    },
  };

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!isLoggedIn ? (
          // ── Not logged in → Auth flow ──────────────────────────────────────
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{ animationTypeForReplace: 'pop' }}
          />
        ) : isAdmin ? (
          // ── Admin logged in → Admin flow ───────────────────────────────────
          <Stack.Screen
            name="Admin"
            component={AdminNavigator}
          />
        ) : (
          // ── Student logged in → Student flow ───────────────────────────────
          <Stack.Screen
            name="Student"
            component={StudentNavigator}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splash: {
    flex:            1,
    justifyContent:  'center',
    alignItems:      'center',
  },
});

export default AppNavigator;