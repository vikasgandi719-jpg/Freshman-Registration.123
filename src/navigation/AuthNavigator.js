import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SCREENS } from "../constants/config";

import StartingScreen from "../screens/auth/StartingScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import OTPVerificationScreen from "../screens/auth/OTPVerificationScreen";
import AdminLoginScreen from "../screens/auth/AdminLoginScreen";
import RegistrationSuccessScreen from "../screens/auth/RegistrationSuccessScreen";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREENS.STARTING}
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "#F8FAFC" },
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      <Stack.Screen
        name={SCREENS.STARTING}
        component={StartingScreen}
        options={{ animation: "fade" }}
      />

      <Stack.Screen name={SCREENS.LOGIN} component={LoginScreen} />

      <Stack.Screen name={SCREENS.REGISTER} component={RegisterScreen} />

      <Stack.Screen
        name={SCREENS.OTP_VERIFICATION}
        component={OTPVerificationScreen}
        options={{ gestureEnabled: false }}
      />

      <Stack.Screen name={SCREENS.ADMIN_LOGIN} component={AdminLoginScreen} />

      <Stack.Screen
        name={SCREENS.REGISTRATION_SUCCESS}
        component={RegistrationSuccessScreen}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
