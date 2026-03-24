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
import AdminManagementScreen from "../screens/admin/AdminManagementScreen";
import BranchAdminScreen from "../screens/admin/BranchAdminScreen";
import VerificationOfficerScreen from "../screens/admin/VerificationOfficerScreen";
import DocumentOfficerScreen from "../screens/admin/DocumentOfficerScreen";
import AdminSidebar from "../components/admin/AdminSidebar";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const MENU_ITEMS = {
  super_admin: [
    { id: "dashboard", label: "Dashboard", screen: SCREENS.ADMIN_DASHBOARD },
    { id: "students", label: "Students", screen: SCREENS.STUDENT_LIST },
    { id: "verification", label: "Verification", screen: SCREENS.VERIFICATION },
    { id: "branches", label: "Branches", screen: SCREENS.BRANCH_MANAGEMENT },
    { id: "admins", label: "Admin Mgmt", screen: SCREENS.ADMIN_MANAGEMENT },
    { id: "settings", label: "Settings", screen: SCREENS.ADMIN_SETTINGS },
  ],
  branch_admin: [
    { id: "dashboard", label: "Dashboard", screen: SCREENS.BRANCH_ADMIN },
    { id: "settings", label: "Settings", screen: SCREENS.ADMIN_SETTINGS },
  ],
  verification_officer: [
    {
      id: "dashboard",
      label: "Dashboard",
      screen: SCREENS.VERIFICATION_OFFICER,
    },
    { id: "settings", label: "Settings", screen: SCREENS.ADMIN_SETTINGS },
  ],
  document_officer: [
    { id: "dashboard", label: "Dashboard", screen: SCREENS.DOCUMENT_OFFICER },
    { id: "settings", label: "Settings", screen: SCREENS.ADMIN_SETTINGS },
  ],
};

const screenToId = {
  [SCREENS.ADMIN_DASHBOARD]: "dashboard",
  [SCREENS.BRANCH_ADMIN]: "dashboard",
  [SCREENS.VERIFICATION_OFFICER]: "dashboard",
  [SCREENS.DOCUMENT_OFFICER]: "dashboard",
  [SCREENS.STUDENT_LIST]: "students",
  [SCREENS.VERIFICATION]: "verification",
  [SCREENS.BRANCH_MANAGEMENT]: "branches",
  [SCREENS.ADMIN_MANAGEMENT]: "admins",
  [SCREENS.ADMIN_SETTINGS]: "settings",
};

const CustomDrawerContent = (props) => {
  const { state, navigation } = props;
  const { admin, logoutAdmin } = useAdmin();
  const activeRoute = state.routeNames[state.index];
  const activeId = screenToId[activeRoute] || "dashboard";
  const menuItems = MENU_ITEMS[admin?.role] || MENU_ITEMS.super_admin;

  return (
    <AdminSidebar
      activeScreen={activeId}
      menuItems={menuItems}
      onNavigate={(id) => {
        const item = menuItems.find((m) => m.id === id);
        if (item) navigation.navigate(item.screen);
      }}
      onLogout={logoutAdmin}
      adminName={admin?.name || "Admin"}
      adminRole={admin?.role || "Administrator"}
    />
  );
};

const AdminDrawer = () => {
  const { admin } = useAdmin();
  const role = admin?.role || "super_admin";

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: Platform.OS === "web" ? "permanent" : "slide",
        drawerStyle: { width: 240 },
        overlayColor: "rgba(0,0,0,0.4)",
        swipeEdgeWidth: 40,
      }}
    >
      {role === "super_admin" && (
        <>
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
            name={SCREENS.ADMIN_MANAGEMENT}
            component={AdminManagementScreen}
          />
          <Drawer.Screen
            name={SCREENS.ADMIN_SETTINGS}
            component={AdminSettingsScreen}
          />
        </>
      )}
      {role === "branch_admin" && (
        <>
          <Drawer.Screen
            name={SCREENS.BRANCH_ADMIN}
            component={BranchAdminScreen}
          />
          <Drawer.Screen
            name={SCREENS.ADMIN_SETTINGS}
            component={AdminSettingsScreen}
          />
        </>
      )}
      {role === "verification_officer" && (
        <>
          <Drawer.Screen
            name={SCREENS.VERIFICATION_OFFICER}
            component={VerificationOfficerScreen}
          />
          <Drawer.Screen
            name={SCREENS.ADMIN_SETTINGS}
            component={AdminSettingsScreen}
          />
        </>
      )}
      {role === "document_officer" && (
        <>
          <Drawer.Screen
            name={SCREENS.DOCUMENT_OFFICER}
            component={DocumentOfficerScreen}
          />
          <Drawer.Screen
            name={SCREENS.ADMIN_SETTINGS}
            component={AdminSettingsScreen}
          />
        </>
      )}
      {/* Fallback for any unknown role - show super admin UI */}
      {(!role ||
        ![
          "super_admin",
          "branch_admin",
          "verification_officer",
          "document_officer",
        ].includes(role)) && (
        <>
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
            name={SCREENS.ADMIN_MANAGEMENT}
            component={AdminManagementScreen}
          />
          <Drawer.Screen
            name={SCREENS.ADMIN_SETTINGS}
            component={AdminSettingsScreen}
          />
        </>
      )}
    </Drawer.Navigator>
  );
};

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
