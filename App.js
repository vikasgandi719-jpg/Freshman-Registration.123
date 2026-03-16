import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider }       from 'react-native-safe-area-context';

import { ThemeProvider,   useTheme }   from './src/context/ThemeContext';
import { AuthProvider }                from './src/context/AuthContext';
import { StudentProvider }             from './src/context/StudentContext';
import { AdminProvider }               from './src/context/AdminContext';
import AppNavigator                    from './src/navigation/AppNavigator';

// ─── Suppress known harmless warnings in dev ──────────────────────────────────
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'VirtualizedLists should never be nested',
  'Warning: Cannot update a component',
]);

// ─── Inner component to consume theme for StatusBar ───────────────────────────
const AppContent = () => {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#0F172A' : '#FFFFFF'}
        translucent={false}
      />
      <AppNavigator />
    </>
  );
};

// ─── Root component ───────────────────────────────────────────────────────────
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <StudentProvider>
              <AdminProvider>
                <AppContent />
              </AdminProvider>
            </StudentProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}