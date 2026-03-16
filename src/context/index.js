// Providers
export { AuthProvider,    useAuth    } from './AuthContext';
export { AdminProvider,   useAdmin   } from './AdminContext';
export { StudentProvider, useStudent } from './StudentContext';
export { ThemeProvider,   useTheme   } from './ThemeContext';

// Default contexts (if needed directly)
export { default as AuthContext    } from './AuthContext';
export { default as AdminContext   } from './AdminContext';
export { default as StudentContext } from './StudentContext';
export { default as ThemeContext   } from './ThemeContext';