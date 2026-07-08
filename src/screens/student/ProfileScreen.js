import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import Header from "../../components/common/Header";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { useAuth } from "../../context/AuthContext";
import { useStudent } from "../../context/StudentContext";
import useAuthHook from "../../hooks/useAuth";
import studentService from "../../services/studentService";
import { SCREENS } from "../../constants/config";

const ProfileScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { profile, setProfile, updateProfile } = useStudent();
  const { logout } = useAuthHook();

  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await studentService.getProfile();
      setProfile(data);
    } catch (e) {
      console.log("Error loading profile:", e);
    } finally {
      setLoading(false);
    }
  };

  const student = profile || user || {};

  const verificationColor = {
    approved: { bg: "#F0FDF4", text: "#15803D", label: "Verified" },
    rejected: { bg: "#FFF1F2", text: "#BE123C", label: "Rejected" },
    pending: { bg: "#FFF7ED", text: "#C2410C", label: "Pending Review" },
  };

  const status =
    verificationColor[student.verificationStatus] || verificationColor.pending;

  const openEdit = () => {
    setEditForm({
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      phone: student.phone || "",
      address: student.address || "",
      fatherName: student.fatherName || "",
      fatherPhone: student.fatherPhone || "",
      motherName: student.motherName || "",
      motherPhone: student.motherPhone || "",
      emacetHallTicket: student.emacetHallTicket || "",
      emacetRank: student.emacetRank || "",
      higherStudiesInterest: student.higherStudiesInterest || null,
      higherStudiesCountry: student.higherStudiesCountry || "",
    });
    setEditModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await studentService.updateProfile(editForm);
      setProfile({ ...profile, ...editForm });
      setEditModal(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (e) {
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to logout?");
      if (confirmed) logout();
    } else {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => logout() },
      ]);
    }
  };

  const renderInfoRow = (label, value) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "Not provided"}</Text>
    </View>
  );

  const renderSection = (icon, title, children) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>{icon}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="My Profile" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1D4ED8" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="My Profile" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(student.firstName || student.name || "S")
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>
            <View style={styles.avatarRing} />
          </View>
          <Text style={styles.studentName}>
            {student.firstName} {student.lastName}
          </Text>
          <Text style={styles.uniqueId}>{student.uniqueId}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <View
              style={[styles.statusDot, { backgroundColor: status.text }]}
            />
            <Text style={[styles.statusText, { color: status.text }]}>
              {status.label}
            </Text>
          </View>
        </View>

        {renderSection(
          "👤",
          "Student Details",
          <>
            {renderInfoRow(
              "Full Name",
              `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
                "Not provided",
            )}
            {renderInfoRow("Phone Number", student.phone)}
            {renderInfoRow("Address", student.address)}
          </>,
        )}

        {renderSection(
          "👨‍👩‍👧",
          "Parent Details",
          <>
            {renderInfoRow("Father's Name", student.fatherName)}
            {renderInfoRow("Father's Phone", student.fatherPhone)}
            {renderInfoRow("Mother's Name", student.motherName)}
            {renderInfoRow("Mother's Phone", student.motherPhone)}
          </>,
        )}

        {renderSection(
          "📝",
          "EAPCET Details",
          <>
            {renderInfoRow("Hall Ticket Number", student.emacetHallTicket)}
            {renderInfoRow("Rank", student.emacetRank)}
          </>,
        )}

        {renderSection(
          "🎓",
          "Higher Studies Interest",
          <>
            {renderInfoRow(
              "Interested?",
              student.higherStudiesInterest === "yes"
                ? "Yes"
                : student.higherStudiesInterest === "no"
                  ? "No"
                  : "Not provided",
            )}
            {student.higherStudiesInterest === "yes" &&
              renderInfoRow(
                "Preference",
                student.higherStudiesCountry === "abroad"
                  ? `Abroad - ${student.higherStudiesCountryDetail || "Not specified"}`
                  : "India",
              )}
          </>,
        )}

        <TouchableOpacity style={styles.editBtn} onPress={openEdit}>
          <Text style={styles.editBtnIcon}>✏️</Text>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.passwordBtn}
          onPress={() => navigation.navigate(SCREENS.CHANGE_PASSWORD)}
        >
          <Text style={styles.passwordBtnIcon}>🔒</Text>
          <Text style={styles.passwordBtnText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnIcon}>🚪</Text>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={editModal}
        onClose={() => setEditModal(false)}
        title="Edit Profile"
        size="lg"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.modalSectionTitle}>Student Details</Text>
          <Input
            label="First Name"
            value={editForm.firstName}
            onChangeText={(t) => setEditForm({ ...editForm, firstName: t })}
            placeholder="Enter first name"
          />
          <Input
            label="Last Name"
            value={editForm.lastName}
            onChangeText={(t) => setEditForm({ ...editForm, lastName: t })}
            placeholder="Enter last name"
          />
          <Input
            label="Phone Number"
            value={editForm.phone}
            onChangeText={(t) => setEditForm({ ...editForm, phone: t })}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
          <Input
            label="Address"
            value={editForm.address}
            onChangeText={(t) => setEditForm({ ...editForm, address: t })}
            placeholder="Enter address"
            multiline
          />

          <Text style={styles.modalSectionTitle}>Parent Details</Text>
          <Input
            label="Father's Name"
            value={editForm.fatherName}
            onChangeText={(t) => setEditForm({ ...editForm, fatherName: t })}
            placeholder="Enter father's name"
          />
          <Input
            label="Father's Phone"
            value={editForm.fatherPhone}
            onChangeText={(t) => setEditForm({ ...editForm, fatherPhone: t })}
            placeholder="Enter father's phone"
            keyboardType="phone-pad"
          />
          <Input
            label="Mother's Name"
            value={editForm.motherName}
            onChangeText={(t) => setEditForm({ ...editForm, motherName: t })}
            placeholder="Enter mother's name"
          />
          <Input
            label="Mother's Phone"
            value={editForm.motherPhone}
            onChangeText={(t) => setEditForm({ ...editForm, motherPhone: t })}
            placeholder="Enter mother's phone"
            keyboardType="phone-pad"
          />

          <Text style={styles.modalSectionTitle}>EAPCET Details</Text>
          <Input
            label="EAPCET Hall Ticket Number"
            value={editForm.emacetHallTicket}
            onChangeText={(t) =>
              setEditForm({ ...editForm, emacetHallTicket: t })
            }
            placeholder="Enter hall ticket number"
          />
          <Input
            label="EAPCET Rank"
            value={editForm.emacetRank}
            onChangeText={(t) => setEditForm({ ...editForm, emacetRank: t })}
            placeholder="Enter rank"
            keyboardType="numeric"
          />

          <Text style={styles.modalSectionTitle}>Higher Studies Interest</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                editForm.higherStudiesInterest === "yes" &&
                  styles.toggleBtnActive,
              ]}
              onPress={() =>
                setEditForm({ ...editForm, higherStudiesInterest: "yes" })
              }
            >
              <Text
                style={[
                  styles.toggleText,
                  editForm.higherStudiesInterest === "yes" &&
                    styles.toggleTextActive,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                editForm.higherStudiesInterest === "no" &&
                  styles.toggleBtnActive,
              ]}
              onPress={() =>
                setEditForm({
                  ...editForm,
                  higherStudiesInterest: "no",
                  higherStudiesCountry: "",
                })
              }
            >
              <Text
                style={[
                  styles.toggleText,
                  editForm.higherStudiesInterest === "no" &&
                    styles.toggleTextActive,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>

          {editForm.higherStudiesInterest === "yes" && (
            <>
              <Text style={styles.subLabel}>Where do you want to study?</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    editForm.higherStudiesCountry === "india" &&
                      styles.toggleBtnActive,
                  ]}
                  onPress={() =>
                    setEditForm({ ...editForm, higherStudiesCountry: "india" })
                  }
                >
                  <Text
                    style={[
                      styles.toggleText,
                      editForm.higherStudiesCountry === "india" &&
                        styles.toggleTextActive,
                    ]}
                  >
                    India
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    editForm.higherStudiesCountry === "abroad" &&
                      styles.toggleBtnActive,
                  ]}
                  onPress={() =>
                    setEditForm({ ...editForm, higherStudiesCountry: "abroad" })
                  }
                >
                  <Text
                    style={[
                      styles.toggleText,
                      editForm.higherStudiesCountry === "abroad" &&
                        styles.toggleTextActive,
                    ]}
                  >
                    Abroad
                  </Text>
                </TouchableOpacity>
              </View>

              {editForm.higherStudiesCountry === "abroad" && (
                <Input
                  label="Which Country?"
                  value={editForm.higherStudiesCountryDetail || ""}
                  onChangeText={(t) =>
                    setEditForm({ ...editForm, higherStudiesCountryDetail: t })
                  }
                  placeholder="e.g., USA, UK, Canada, Australia"
                />
              )}
            </>
          )}

          <Button
            title={saving ? "Saving..." : "Save Changes"}
            onPress={handleSave}
            disabled={saving}
            loading={saving}
            fullWidth
            style={styles.saveBtn}
          />
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 16,
    backgroundColor: "#EFF6FF",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#1D4ED8",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarRing: {
    position: "absolute",
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2.5,
    borderColor: "#1D4ED8",
    opacity: 0.2,
  },
  avatarText: { fontSize: 36, fontWeight: "700", color: "#FFFFFF" },
  studentName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },
  uniqueId: { fontSize: 14, color: "#64748B", marginTop: 4, marginBottom: 10 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  sectionIcon: { fontSize: 18 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  infoLabel: { fontSize: 14, color: "#64748B", flex: 1 },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    maxWidth: "55%",
    textAlign: "right",
  },
  editBtn: {
    backgroundColor: "#1D4ED8",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  editBtnIcon: { fontSize: 16 },
  editBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  passwordBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "#DBEAFE",
  },
  passwordBtnIcon: { fontSize: 16 },
  passwordBtnText: { color: "#1D4ED8", fontSize: 16, fontWeight: "700" },
  logoutBtn: {
    backgroundColor: "#FEF2F2",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutBtnIcon: { fontSize: 16 },
  logoutBtnText: { color: "#DC2626", fontSize: 16, fontWeight: "600" },
  modalSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1D4ED8",
    marginTop: 16,
    marginBottom: 10,
  },
  toggleRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  toggleBtnActive: { backgroundColor: "#1D4ED8" },
  toggleText: { fontSize: 14, fontWeight: "600", color: "#64748B" },
  toggleTextActive: { color: "#FFFFFF" },
  subLabel: { fontSize: 13, color: "#64748B", marginBottom: 8 },
  saveBtn: { marginTop: 20, marginBottom: 20 },
});

export default ProfileScreen;
