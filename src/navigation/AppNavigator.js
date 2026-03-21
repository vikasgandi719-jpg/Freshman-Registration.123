import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
 
import { useAuth }  from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";
import { useTheme } from "../context/ThemeContext";
 
import AuthNavigator    from "./AuthNavigator";
import StudentNavigator from "./StudentNavigator";
import AdminNavigator   from "./AdminNavigator";
 
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
  const { isLoggedIn, isLoading }              = useAuth();
  const { isLoggedIn: isAdminLoggedIn }        = useAdmin();  // ← NO isLoading from admin
  const { theme, isDark }                      = useTheme();
 
  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.colors.background,
      primary:    theme.colors.primary,
    },
  };
 
  // ── FIX: Only ever block on AuthContext isLoading — admin never blocks ────────
  if (isLoading) return <SplashScreen />;
 
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
        {isAdminLoggedIn ? (
          <Stack.Screen name="Admin"   component={AdminNavigator} />
        ) : isLoggedIn ? (
          <Stack.Screen name="Student" component={StudentNavigator} />
        ) : (
          <Stack.Screen name="Auth"    component={AuthNavigator}
            options={{ animationTypeForReplace: "pop" }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
 
const styles = StyleSheet.create({
  splash: { flex: 1, justifyContent: "center", alignItems: "center" },
});
 
export default AppNavigator;
 