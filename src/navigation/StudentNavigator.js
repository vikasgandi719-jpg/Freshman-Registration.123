import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREENS } from '../constants/config';
import { PRIMARY, NEUTRAL } from '../constants/colors';

import StudentDashboard      from '../screens/student/StudentDashboard';
import DocumentUploadScreen  from '../screens/student/DocumentUploadScreen';
import ProfileScreen         from '../screens/student/ProfileScreen';
import DocumentDetailScreen  from '../screens/student/DocumentDetailScreen';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ─── Tab Bar Icon ──────────────────────────────────────────────────────────────
const TabIcon = ({ icon, label, focused }) => (
  <View style={[tabStyles.iconWrapper, focused && tabStyles.iconWrapperActive]}>
    <Text style={tabStyles.icon}>{icon}</Text>
    <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
  </View>
);

const tabStyles = StyleSheet.create({
  iconWrapper: {
    alignItems:   'center',
    paddingTop:   6,
    paddingBottom: 2,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  iconWrapperActive: {
    backgroundColor: PRIMARY[700] + '15',
  },
  icon:  { fontSize: 22 },
  label: { fontSize: 10, color: NEUTRAL[400], marginTop: 2, fontWeight: '500' },
  labelActive: { color: PRIMARY[700], fontWeight: '700' },
});

// ─── Bottom Tab Navigator ─────────────────────────────────────────────────────
const StudentTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor:   '#FFFFFF',
          borderTopWidth:    1,
          borderTopColor:    '#F1F5F9',
          height:            72,
          paddingBottom:     10,
          paddingTop:        4,
          elevation:         8,
          shadowColor:       '#000',
          shadowOffset:      { width: 0, height: -2 },
          shadowOpacity:     0.06,
          shadowRadius:      10,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name={SCREENS.STUDENT_DASHBOARD}
        component={StudentDashboard}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" label="Home" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name={SCREENS.DOCUMENT_UPLOAD}
        component={DocumentUploadScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📄" label="Documents" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name={SCREENS.PROFILE}
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// ─── Student Stack (tabs + modal screens) ─────────────────────────────────────
const StudentNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="StudentTabs"
        component={StudentTabs}
      />
      <Stack.Screen
        name={SCREENS.DOCUMENT_DETAIL}
        component={DocumentDetailScreen}
        options={{
          animation:      'slide_from_bottom',
          presentation:   'modal',
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default StudentNavigator;