import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext"; // ✅ ADD THIS
import { useTheme } from "../context/ThemeContext";

import AuthNavigator from "./AuthNavigator";
import StudentNavigator from "./StudentNavigator";
import AdminNavigator from "./AdminNavigator";

const Stack = createNativeStackNavigator();

const SplashScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.splash, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

const AppNavigator = () => {
  const { isLoggedIn, isLoading, user } = useAuth();
  const { isLoggedIn: isAdminLoggedIn, isLoading: isAdminLoading } = useAdmin();
  const { theme } = useTheme();

  const isAdmin = isAdminLoggedIn;

  if (isLoading || isAdminLoading) return <SplashScreen />;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: "fade" }}
      >
        {isAdmin ? (
          // ── Admin logged in → Admin flow ──────────────────────────────────
          <Stack.Screen name="Admin" component={AdminNavigator} />
        ) : isLoggedIn ? (
          // ── Student logged in → Student flow ─────────────────────────────
          <Stack.Screen name="Student" component={StudentNavigator} />
        ) : (
          // ── Not logged in → Auth flow ─────────────────────────────────────
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{ animationTypeForReplace: "pop" }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AppNavigator;
