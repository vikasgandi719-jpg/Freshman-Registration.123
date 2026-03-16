import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  SafeAreaView, TouchableOpacity, Switch, Alert,
} from 'react-native';
import Header        from '../../components/common/Header';
import { useAdmin }  from '../../context/AdminContext';
import { useTheme }  from '../../context/ThemeContext';
import { ADMIN_ROLE_LABELS } from '../../constants/adminRoles';

const SettingRow = ({ icon, label, subtitle, value, onPress, showArrow = true, danger = false, rightComponent }) => (
  <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={onPress ? 0.75 : 1}>
    <View style={[styles.settingIconBox, danger && styles.settingIconBoxDanger]}>
      <Text style={styles.settingIcon}>{icon}</Text>
    </View>
    <View style={styles.settingInfo}>
      <Text style={[styles.settingLabel, danger && styles.settingLabelDanger]}>{label}</Text>
      {subtitle ? <Text style={styles.settingSubtitle}>{subtitle}</Text> : null}
    </View>
    {rightComponent
      ? rightComponent
      : (showArrow && <Text style={styles.arrow}>›</Text>)
    }
  </TouchableOpacity>
);

const SectionHeader = ({ title }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const AdminSettingsScreen = ({ navigation }) => {
  const { admin, logoutAdmin }    = useAdmin();
  const { isDark, toggleTheme }   = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts,   setEmailAlerts]   = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => logoutAdmin() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Settings" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Admin Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {(admin?.name || 'A').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{admin?.name || 'Admin'}</Text>
            <Text style={styles.profileEmail}>{admin?.email || ''}</Text>
            <View style={styles.profileRoleBadge}>
              <Text style={styles.profileRoleText}>
                {ADMIN_ROLE_LABELS[admin?.role] || admin?.role || 'Admin'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editProfileBtn}>
            <Text style={styles.editProfileBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Appearance */}
        <SectionHeader title="APPEARANCE" />
        <View style={styles.section}>
          <SettingRow
            icon="🌙"
            label="Dark Mode"
            subtitle={isDark ? 'Currently dark' : 'Currently light'}
            showArrow={false}
            rightComponent={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#E2E8F0', true: '#1D4ED8' }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </View>

        {/* Notifications */}
        <SectionHeader title="NOTIFICATIONS" />
        <View style={styles.section}>
          <SettingRow
            icon="🔔"
            label="Push Notifications"
            subtitle="New student registrations"
            showArrow={false}
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#E2E8F0', true: '#1D4ED8' }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <View style={styles.rowDivider} />
          <SettingRow
            icon="✉️"
            label="Email Alerts"
            subtitle="Daily summary reports"
            showArrow={false}
            rightComponent={
              <Switch
                value={emailAlerts}
                onValueChange={setEmailAlerts}
                trackColor={{ false: '#E2E8F0', true: '#1D4ED8' }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </View>

        {/* Account */}
        <SectionHeader title="ACCOUNT" />
        <View style={styles.section}>
          <SettingRow icon="🔑" label="Change Password"   subtitle="Update your password"     onPress={() => {}} />
          <View style={styles.rowDivider} />
          <SettingRow icon="📧" label="Update Email"      subtitle={admin?.email || ''}       onPress={() => {}} />
          <View style={styles.rowDivider} />
          <SettingRow icon="📱" label="Update Phone"      subtitle={admin?.phone || ''}       onPress={() => {}} />
        </View>

        {/* System */}
        <SectionHeader title="SYSTEM" />
        <View style={styles.section}>
          <SettingRow icon="📊" label="Export Data"       subtitle="Download student reports" onPress={() => {}} />
          <View style={styles.rowDivider} />
          <SettingRow icon="🗂️" label="Manage Documents"  subtitle="Edit document types"      onPress={() => {}} />
          <View style={styles.rowDivider} />
          <SettingRow icon="ℹ️" label="App Version"       subtitle="v1.0.0"                   showArrow={false} />
        </View>

        {/* Danger Zone */}
        <SectionHeader title="DANGER ZONE" />
        <View style={styles.section}>
          <SettingRow
            icon="🚪"
            label="Logout"
            subtitle="Sign out of your account"
            danger
            onPress={handleLogout}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: '#F8FAFC' },
  profileCard: {
    flexDirection:    'row',
    alignItems:       'center',
    backgroundColor:  '#FFFFFF',
    marginHorizontal: 16,
    marginTop:        16,
    padding:          16,
    borderRadius:     16,
    shadowColor:      '#000',
    shadowOffset:     { width: 0, height: 2 },
    shadowOpacity:    0.07,
    shadowRadius:     10,
    elevation:        3,
    gap:              12,
  },
  profileAvatar: {
    width:           56,
    height:          56,
    borderRadius:    28,
    backgroundColor: '#1D4ED8',
    justifyContent:  'center',
    alignItems:      'center',
  },
  profileAvatarText: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  profileInfo:       { flex: 1 },
  profileName:       { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  profileEmail:      { fontSize: 12, color: '#64748B', marginTop: 2 },
  profileRoleBadge:  { marginTop: 4, backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, alignSelf: 'flex-start' },
  profileRoleText:   { fontSize: 11, color: '#1D4ED8', fontWeight: '600' },
  editProfileBtn:    { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F1F5F9', borderRadius: 8 },
  editProfileBtnText:{ fontSize: 13, color: '#334155', fontWeight: '600' },
  sectionHeader:     { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 1, paddingHorizontal: 24, marginTop: 24, marginBottom: 6 },
  section: {
    backgroundColor:  '#FFFFFF',
    marginHorizontal: 16,
    borderRadius:     14,
    overflow:         'hidden',
    shadowColor:      '#000',
    shadowOffset:     { width: 0, height: 1 },
    shadowOpacity:    0.04,
    shadowRadius:     6,
    elevation:        1,
  },
  settingRow:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  settingIconBox:     { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  settingIconBoxDanger:{ backgroundColor: '#FFF1F2' },
  settingIcon:        { fontSize: 18 },
  settingInfo:        { flex: 1 },
  settingLabel:       { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  settingLabelDanger: { color: '#BE123C' },
  settingSubtitle:    { fontSize: 12, color: '#94A3B8', marginTop: 1 },
  arrow:              { fontSize: 22, color: '#CBD5E1', fontWeight: '300' },
  rowDivider:         { height: 1, backgroundColor: '#F1F5F9', marginLeft: 64 },
});

export default AdminSettingsScreen;