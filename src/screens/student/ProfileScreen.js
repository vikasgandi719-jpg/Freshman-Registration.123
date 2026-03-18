import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Header from "../../components/common/Header";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { useAuth } from "../../context/AuthContext";
import { useStudent } from "../../context/StudentContext";
import useAuthHook from "../../hooks/useAuth";
import studentService from "../../services/studentService";

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
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => logout() },
    ]);
  };

  const renderInfoRow = (label, value) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "Not provided"}</Text>
    </View>
  );

  const renderSection = (title, children) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="My Profile" showBack />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Student Name */}
        <View style={styles.nameCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(student.firstName || student.name || "S")
                .charAt(0)
                .toUpperCase()}
            </Text>
          </View>
          <Text style={styles.studentName}>
            {student.firstName} {student.lastName}
          </Text>
          <Text style={styles.uniqueId}>{student.uniqueId}</Text>
        </View>

        {/* Student Details Section */}
        {renderSection("Student Details", () => (
          <>
            {renderInfoRow(
              "Full Name",
              `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
                "Not provided",
            )}
            {renderInfoRow("Phone Number", student.phone || "Not provided")}
            {renderInfoRow("Address", student.address || "Not provided")}
          </>
        ))}

        {/* Parent Details Section */}
        {renderSection("Parent Details", () => (
          <>
            {renderInfoRow(
              "Father's Name",
              student.fatherName || "Not provided",
            )}
            {renderInfoRow(
              "Father's Phone",
              student.fatherPhone || "Not provided",
            )}
            {renderInfoRow(
              "Mother's Name",
              student.motherName || "Not provided",
            )}
            {renderInfoRow(
              "Mother's Phone",
              student.motherPhone || "Not provided",
            )}
          </>
        ))}

        {/* EMACET Details Section */}
        {renderSection("EMACET Details", () => (
          <>
            {renderInfoRow(
              "Hall Ticket Number",
              student.emacetHallTicket || "Not provided",
            )}
            {renderInfoRow("Rank", student.emacetRank || "Not provided")}
          </>
        ))}

        {/* Higher Studies Section */}
        {renderSection("Higher Studies Interest", () => (
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
          </>
        ))}

        {/* Edit Button */}
        <TouchableOpacity style={styles.editBtn} onPress={openEdit}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModal}
        onClose={() => setEditModal(false)}
        title="Edit Profile"
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

          <Text style={styles.modalSectionTitle}>EMACET Details</Text>
          <Input
            label="EMACET Hall Ticket Number"
            value={editForm.emacetHallTicket}
            onChangeText={(t) =>
              setEditForm({ ...editForm, emacetHallTicket: t })
            }
            placeholder="Enter hall ticket number"
          />
          <Input
            label="EMACET Rank"
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
            style={styles.saveBtn}
          />
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { flex: 1, paddingHorizontal: 16 },
  nameCard: { alignItems: "center", paddingVertical: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1D4ED8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: "700", color: "#FFFFFF" },
  studentName: { fontSize: 22, fontWeight: "700", color: "#0F172A" },
  uniqueId: { fontSize: 14, color: "#64748B", marginTop: 4 },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  infoLabel: { fontSize: 14, color: "#64748B" },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    maxWidth: "50%",
    textAlign: "right",
  },
  editBtn: {
    backgroundColor: "#1D4ED8",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  editBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  logoutBtn: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 24,
  },
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
