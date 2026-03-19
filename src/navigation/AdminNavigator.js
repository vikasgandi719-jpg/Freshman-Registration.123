import React from "react";
import { Platform } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SCREENS } from "../constants/config";
import { useAdmin } from "../context/AdminContext";

import AdminDashboard from "../screens/admin/AdminDashboard";
import StudentListScreen from "../screens/admin/StudentListScreen";
import StudentDetailScreen from "../screens/admin/StudentDetailScreen";
import VerificationScreen from "../screens/admin/VerificationScreen";
import BranchManagementScreen from "../screens/admin/BranchManagementScreen";
import AdminSettingsScreen from "../screens/admin/AdminSettingsScreen";
import AdminSidebar from "../components/admin/AdminSidebar";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// ─── Custom Drawer Content ────────────────────────────────────────────────────
const CustomDrawerContent = (props) => {
  const { state, navigation } = props;
  const { admin, logoutAdmin } = useAdmin();
  const activeRoute = state.routeNames[state.index];

  const screenToId = {
    [SCREENS.ADMIN_DASHBOARD]: "dashboard",
    [SCREENS.STUDENT_LIST]: "students",
    [SCREENS.VERIFICATION]: "verification",
    [SCREENS.BRANCH_MANAGEMENT]: "branches",
    [SCREENS.ADMIN_SETTINGS]: "settings",
  };

  const idToScreen = Object.fromEntries(
    Object.entries(screenToId).map(([k, v]) => [v, k]),
  );

  const activeId = screenToId[activeRoute] || "dashboard";

  return (
    <AdminSidebar
      activeScreen={activeId}
      onNavigate={(id) => {
        const screen = idToScreen[id];
        if (screen) navigation.navigate(screen);
      }}
      onLogout={logoutAdmin}
      adminName={admin?.name || "Admin"}
      adminRole={admin?.role || "Administrator"}
    />
  );
};

// ─── Admin Drawer Navigator ───────────────────────────────────────────────────
const AdminDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: Platform.OS === "web" ? "permanent" : "slide", // ✅ fixed for web
        drawerStyle: { width: 240 },
        overlayColor: "rgba(0,0,0,0.4)",
        swipeEdgeWidth: 40,
      }}
    >
      <Drawer.Screen
        name={SCREENS.ADMIN_DASHBOARD}
        component={AdminDashboard}
      />
      <Drawer.Screen
        name={SCREENS.STUDENT_LIST}
        component={StudentListScreen}
      />
      <Drawer.Screen
        name={SCREENS.VERIFICATION}
        component={VerificationScreen}
      />
      <Drawer.Screen
        name={SCREENS.BRANCH_MANAGEMENT}
        component={BranchManagementScreen}
      />
      <Drawer.Screen
        name={SCREENS.ADMIN_SETTINGS}
        component={AdminSettingsScreen}
      />
    </Drawer.Navigator>
  );
};

// ─── Admin Stack (drawer + detail screens) ────────────────────────────────────
const AdminNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDrawer" component={AdminDrawer} />
      <Stack.Screen
        name={SCREENS.STUDENT_DETAIL}
        component={StudentDetailScreen}
        options={{
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
