import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import Header       from '../../components/common/Header';
import ProfileCard  from '../../components/student/ProfileCard';
import PhotoUploader from '../../components/student/PhotoUploader';
import Input        from '../../components/common/Input';
import Modal        from '../../components/common/Modal';
import Button       from '../../components/common/Button';
import { useAuth }  from '../../context/AuthContext';
import { useStudent } from '../../context/StudentContext';
import useAuthHook  from '../../hooks/useAuth';
import { SCREENS }  from '../../constants/config';

const ProfileScreen = ({ navigation }) => {
  const { user }                           = useAuth();
  const { profile, updateProfile }         = useStudent();
  const { logout }                         = useAuthHook();

  const [editModal,  setEditModal]         = useState(false);
  const [photoModal, setPhotoModal]        = useState(false);
  const [editForm,   setEditForm]          = useState({});
  const [saving,     setSaving]            = useState(false);

  const student = profile || user || {};

  const openEdit = () => {
    setEditForm({
      name:   student.name  || '',
      phone:  student.phone || '',
      email:  student.email || '',
    });
    setEditModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(editForm);
      setEditModal(false);
    } catch (e) {
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="My Profile"
        variant="default"
        showBorder
        rightComponent={
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Profile Card */}
        <ProfileCard
          student={student}
          onEditPress={openEdit}
          onViewDocuments={() => navigation.navigate(SCREENS.DOCUMENT_UPLOAD)}
        />

        {/* Change Photo */}
        <TouchableOpacity
          style={styles.changePhotoBtn}
          onPress={() => setPhotoModal(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.changePhotoIcon}>📷</Text>
          <Text style={styles.changePhotoText}>Change Profile Photo</Text>
          <Text style={styles.changePhotoArrow}>›</Text>
        </TouchableOpacity>

        {/* Settings rows */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>ACCOUNT</Text>
          <View style={styles.settingsCard}>
            {[
              { icon: '✉️', label: 'Email Address',    value: student.email    || 'Not set' },
              { icon: '📞', label: 'Phone Number',     value: student.phone    || 'Not set' },
              { icon: '🏫', label: 'Branch',           value: student.branch   || 'Not set' },
              { icon: '📚', label: 'Semester',         value: student.semester ? `Semester ${student.semester}` : 'Not set' },
              { icon: '🪪', label: 'Roll Number',      value: student.rollNumber || 'Not set' },
            ].map((item, index, arr) => (
              <View key={item.label} style={[styles.settingRow, index < arr.length - 1 && styles.settingRowBorder]}>
                <Text style={styles.settingIcon}>{item.icon}</Text>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  <Text style={styles.settingValue}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Danger */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>ACCOUNT ACTIONS</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
              <Text style={styles.settingIcon}>🚪</Text>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: '#BE123C' }]}>Logout</Text>
                <Text style={styles.settingValue}>Sign out of your account</Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModal}
        onClose={() => setEditModal(false)}
        title="Edit Profile"
        icon="✏️"
        size="lg"
        footer={
          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              variant="secondary"
              onPress={() => setEditModal(false)}
              style={{ flex: 1 }}
            />
            <Button
              title="Save Changes"
              variant="primary"
              loading={saving}
              onPress={handleSave}
              style={{ flex: 1 }}
            />
          </View>
        }
      >
        <Input
          label="Full Name"
          value={editForm.name}
          onChangeText={(t) => setEditForm((f) => ({ ...f, name: t }))}
          placeholder="Enter your full name"
          icon="👤"
        />
        <Input
          label="Phone Number"
          value={editForm.phone}
          onChangeText={(t) => setEditForm((f) => ({ ...f, phone: t }))}
          placeholder="10-digit mobile number"
          icon="📞"
          keyboardType="phone-pad"
          maxLength={10}
        />
        <Input
          label="Email Address"
          value={editForm.email}
          onChangeText={(t) => setEditForm((f) => ({ ...f, email: t }))}
          placeholder="Enter your email"
          icon="✉️"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </Modal>

      {/* Photo Upload Modal */}
      <Modal
        visible={photoModal}
        onClose={() => setPhotoModal(false)}
        title="Update Profile Photo"
        icon="📷"
        size="md"
      >
        <PhotoUploader
          currentPhotoUri={student.photoUri}
          studentName={student.name}
          onUploadSuccess={(uri) => {
            updateProfile({ photoUri: uri });
            setPhotoModal(false);
          }}
          onUploadError={() => {}}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: '#F8FAFC' },
  logoutBtn:        { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#FFF1F2', borderRadius: 8 },
  logoutBtnText:    { fontSize: 13, color: '#BE123C', fontWeight: '600' },
  changePhotoBtn: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   '#FFFFFF',
    marginHorizontal:  16,
    marginTop:         12,
    padding:           14,
    borderRadius:      12,
    shadowColor:       '#000',
    shadowOffset:      { width: 0, height: 1 },
    shadowOpacity:     0.04,
    shadowRadius:      4,
    elevation:         1,
    gap:               12,
  },
  changePhotoIcon:  { fontSize: 22 },
  changePhotoText:  { flex: 1, fontSize: 14, fontWeight: '600', color: '#1E293B' },
  changePhotoArrow: { fontSize: 22, color: '#CBD5E1' },
  settingsSection:  { marginTop: 20, paddingHorizontal: 16 },
  settingsSectionTitle: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 1, marginBottom: 8 },
  settingsCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, overflow: 'hidden',
    shadowColor:     '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity:   0.04, shadowRadius: 6, elevation: 1,
  },
  settingRow:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12 },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  settingIcon:      { fontSize: 20, marginRight: 12 },
  settingInfo:      { flex: 1 },
  settingLabel:     { fontSize: 13, fontWeight: '600', color: '#1E293B' },
  settingValue:     { fontSize: 12, color: '#94A3B8', marginTop: 1 },
  settingArrow:     { fontSize: 22, color: '#CBD5E1' },
  modalFooter:      { flexDirection: 'row', gap: 10 },
});

export default ProfileScreen;