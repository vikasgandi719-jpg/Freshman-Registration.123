import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const STATUS_CONFIG = {
  pending:    { label: 'Verification Pending',  bg: '#FFF7ED', text: '#C2410C', icon: '⏳' },
  approved:   { label: 'Verified',              bg: '#F0FDF4', text: '#15803D', icon: '✅' },
  rejected:   { label: 'Verification Rejected', bg: '#FFF1F2', text: '#BE123C', icon: '❌' },
  incomplete: { label: 'Incomplete Profile',    bg: '#F8FAFC', text: '#64748B', icon: '⚠️' },
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <View style={styles.infoTextBlock}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const ProfileCard = ({ student = {}, onEditPress, onViewDocuments }) => {
  const {
    name = 'Student Name', email = '', phone = '',
    rollNumber = '', branch = '', semester = '',
    photoUri = null, verificationStatus = 'incomplete',
  } = student;

  const config = STATUS_CONFIG[verificationStatus] || STATUS_CONFIG.incomplete;
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <View style={styles.card}>
      <View style={styles.headerBg} />

      <View style={styles.avatarWrapper}>
        {photoUri
          ? <Image source={{ uri: photoUri }} style={styles.avatar} />
          : <View style={styles.initialsAvatar}>
              <Text style={styles.initialsText}>{initials || '?'}</Text>
            </View>
        }
      </View>

      <Text style={styles.name}>{name}</Text>
      {rollNumber ? <Text style={styles.rollNumber}>Roll No: {rollNumber}</Text> : null}

      <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
        <Text style={styles.statusIcon}>{config.icon}</Text>
        <Text style={[styles.statusText, { color: config.text }]}>{config.label}</Text>
      </View>

      <View style={styles.infoSection}>
        {email    && <InfoRow icon="✉️" label="Email"    value={email} />}
        {phone    && <InfoRow icon="📞" label="Phone"    value={phone} />}
        {branch   && <InfoRow icon="🏫" label="Branch"   value={branch} />}
        {semester && <InfoRow icon="📚" label="Semester" value={`Semester ${semester}`} />}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editBtn} onPress={onEditPress}>
          <Text style={styles.editBtnText}>✏️  Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.docsBtn} onPress={onViewDocuments}>
          <Text style={styles.docsBtnText}>📄  My Documents</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16,
    marginHorizontal: 16, marginVertical: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
    overflow: 'hidden', alignItems: 'center',
  },
  headerBg: { height: 80, width: '100%', backgroundColor: '#1D4ED8' },
  avatarWrapper: { marginTop: -48, borderWidth: 4, borderColor: '#FFFFFF', borderRadius: 60, overflow: 'hidden' },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  initialsAvatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center' },
  initialsText: { fontSize: 32, fontWeight: '800', color: '#1D4ED8' },
  name: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginTop: 12 },
  rollNumber: { fontSize: 13, color: '#64748B', marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginTop: 10 },
  statusIcon: { fontSize: 14, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: '600' },
  infoSection: { width: '100%', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  infoIcon: { fontSize: 18, marginRight: 12 },
  infoTextBlock: { flex: 1 },
  infoLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  infoValue: { fontSize: 14, color: '#1E293B', fontWeight: '600', marginTop: 1 },
  actions: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16, gap: 10, width: '100%' },
  editBtn: { flex: 1, borderWidth: 1.5, borderColor: '#1D4ED8', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  editBtnText: { color: '#1D4ED8', fontWeight: '600', fontSize: 13 },
  docsBtn: { flex: 1, backgroundColor: '#1D4ED8', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  docsBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
});

export default ProfileCard;