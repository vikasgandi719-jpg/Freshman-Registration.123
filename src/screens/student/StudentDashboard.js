import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useStudent } from "../../context/StudentContext";
import useDocuments from "../../hooks/useDocuments";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import DocumentUploader from "../../components/student/DocumentUploader";
import { SCREENS } from "../../constants/config";
import studentService from "../../services/studentService";

const StudentDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const { profile, setProfile, documentStats } = useStudent();
  const { documents, fetchDocuments, uploadDocument, isLoading } =
    useDocuments();
  const [refreshing, setRefreshing] = useState(false);

  // Separate modals for each section
  const [studentModal, setStudentModal] = useState(false);
  const [schoolModal, setSchoolModal] = useState(false);
  const [interModal, setInterModal] = useState(false);
  const [parentModal, setParentModal] = useState(false);
  const [emacetModal, setEmacetModal] = useState(false);
  const [generalModal, setGeneralModal] = useState(false);
  const [sportsModal, setSportsModal] = useState(false);
  const [placementModal, setPlacementModal] = useState(false);
  const [docUploadModal, setDocUploadModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
    if (user?.id) fetchDocuments(user.id);
  }, [user]);

  const loadProfile = async () => {
    try {
      const data = await studentService.getProfile();
      setProfile(data);
    } catch (e) {
      console.log("Error loading profile:", e);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    if (user?.id) await fetchDocuments(user.id);
    setRefreshing(false);
  };

  const student = profile || user || {};

  const pendingDocs = documents.filter(
    (d) => d.status === "not_uploaded" || d.status === "rejected",
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Separate edit handlers for each section
  const openStudentEdit = () => {
    setEditForm({
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      email: student.email || "",
      phone: student.phone || "",
      address: student.address || "",
      hostelType: student.hostelType || null,
      transportType: student.transportType || "",
    });
    setStudentModal(true);
  };

  const openSchoolEdit = () => {
    setEditForm({
      schoolName: student.schoolName || "",
      tenthPercentage: student.tenthPercentage || "",
    });
    setSchoolModal(true);
  };

  const openInterEdit = () => {
    setEditForm({
      interCollege: student.interCollege || "",
      interHallticket: student.interHallticket || "",
      interPercentage: student.interPercentage || "",
    });
    setInterModal(true);
  };

  const openParentEdit = () => {
    setEditForm({
      fatherName: student.fatherName || "",
      fatherPhone: student.fatherPhone || "",
      fatherProfession: student.fatherProfession || "",
      motherName: student.motherName || "",
      motherPhone: student.motherPhone || "",
      motherProfession: student.motherProfession || "",
    });
    setParentModal(true);
  };

  const openEmacetEdit = () => {
    setEditForm({
      emacetHallTicket: student.emacetHallTicket || "",
      emacetRank: student.emacetRank || "",
      higherStudiesInterest: student.higherStudiesInterest || null,
      higherStudiesCountry: student.higherStudiesCountry || "",
      higherStudiesCountryDetail: student.higherStudiesCountryDetail || "",
      higherStudiesProgram: student.higherStudiesProgram || "",
    });
    setEmacetModal(true);
  };

  const openGeneral = () => {
    setEditForm({
      hobbies: student.hobbies || "",
      skillsValues: student.skillsValues || "",
      goalsShortTerm: student.goalsShortTerm || "",
      goalsLongTerm: student.goalsLongTerm || "",
      booksNewspaper: student.booksNewspaper || "",
    });
    setGeneralModal(true);
  };

  const openSports = () => {
    setEditForm({
      sportName: student.sportName || "",
      sportRole: student.sportRole || "",
      tournamentWon: student.tournamentWon || "",
      sportPosition: student.sportPosition || "",
    });
    setSportsModal(true);
  };

  const handleStudentSave = async () => {
    setSaving(true);
    try {
      await studentService.updateProfile(editForm);
      setProfile({ ...profile, ...editForm });
      setStudentModal(false);
    } catch (e) {
      console.log("Error saving:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleSchoolSave = async () => {
    setSaving(true);
    try {
      await studentService.updateProfile(editForm);
      setProfile({ ...profile, ...editForm });
      setSchoolModal(false);
    } catch (e) {
      console.log("Error saving:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleInterSave = async () => {
    setSaving(true);
    try {
      await studentService.updateProfile(editForm);
      setProfile({ ...profile, ...editForm });
      setInterModal(false);
    } catch (e) {
      console.log("Error saving:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleParentSave = async () => {
    setSaving(true);
    try {
      await studentService.updateProfile(editForm);
      setProfile({ ...profile, ...editForm });
      setParentModal(false);
    } catch (e) {
      console.log("Error saving:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleEmacetSave = async () => {
    setSaving(true);
    try {
      await studentService.updateProfile(editForm);
      setProfile({ ...profile, ...editForm });
      setEmacetModal(false);
    } catch (e) {
      console.log("Error saving:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleGeneralSave = async () => {
    setSaving(true);
    try {
      await studentService.updateProfile(editForm);
      setProfile({ ...profile, ...editForm });
      setGeneralModal(false);
    } catch (e) {
      console.log("Error saving:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleSportsSave = async () => {
    setSaving(true);
    try {
      await studentService.updateProfile(editForm);
      setProfile({ ...profile, ...editForm });
      setSportsModal(false);
    } catch (e) {
      console.log("Error saving:", e);
    } finally {
      setSaving(false);
    }
  };

  const openPlacement = () => {
    setEditForm({
      placementDomain: student.placementDomain || "",
    });
    setPlacementModal(true);
  };

  const handlePlacementSave = async () => {
    setSaving(true);
    try {
      await studentService.updateProfile(editForm);
      setProfile({ ...profile, ...editForm });
      setPlacementModal(false);
    } catch (e) {
      console.log("Error saving:", e);
    } finally {
      setSaving(false);
    }
  };

  const getDocStatus = (docId) => {
    const doc = documents.find((d) => d.id === docId);
    return doc?.status || "not_uploaded";
  };

  const getDocFileUri = (docId) => {
    const doc = documents.find((d) => d.id === docId);
    return doc?.fileUri || null;
  };

  const handleDocUploadPress = (docId, docTitle) => {
    const existingDoc = documents.find((d) => d.id === docId);
    const doc = existingDoc || { id: docId, title: docTitle };
    setSelectedDoc(doc);
    setDocUploadModal(true);
  };

  const handleDocUploadSuccess = async (file) => {
    if (selectedDoc) {
      await uploadDocument(selectedDoc.id, file.uri, file.mimeType, file.name);
      if (user?.id) fetchDocuments(user.id);
    }
    setDocUploadModal(false);
    setSelectedDoc(null);
  };

  const renderDocUpload = (docId, docTitle) => {
    const doc = documents.find((d) => d.id === docId);
    const status = doc?.status || "not_uploaded";
    const isUploaded = status === "pending" || status === "approved";

    return (
      <TouchableOpacity
        style={[
          styles.docUploadItem,
          isUploaded && styles.docUploadItemUploaded,
        ]}
        onPress={() => handleDocUploadPress(docId, docTitle)}
      >
        <View style={styles.docUploadInfo}>
          <Text style={styles.docUploadIcon}>
            {status === "approved"
              ? "✅"
              : status === "pending"
                ? "⏳"
                : status === "rejected"
                  ? "❌"
                  : "📄"}
          </Text>
          <View>
            <Text style={styles.docUploadTitle}>{docTitle}</Text>
            <Text
              style={[
                styles.docUploadStatus,
                status === "approved" && styles.docUploadStatusApproved,
              ]}
            >
              {status === "approved"
                ? "Approved"
                : status === "pending"
                  ? "Pending"
                  : status === "rejected"
                    ? "Rejected - Tap to re-upload"
                    : "Tap to upload"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render the UI cards
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1D4ED8"]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.studentName} numberOfLines={1}>
              {student.firstName || student.name || "Student"}
            </Text>
            <Text style={styles.rollNumber}>{student.uniqueId || ""}</Text>
          </View>

          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => navigation.navigate(SCREENS.PROFILE)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(student.firstName || student.name || "S")
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Documents Section */}
        <View style={styles.docStatusCard}>
          <View style={styles.docStatusHeader}>
            <Text style={styles.docStatusTitle}>📚 Documents</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(SCREENS.DOCUMENT_UPLOAD)}
            >
              <Text style={styles.uploadLink}>Upload</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            {[
              { label: "Total", value: documentStats.total, color: "#1D4ED8" },
              {
                label: "Approved",
                value: documentStats.approved,
                color: "#15803D",
              },
              {
                label: "Pending",
                value: documentStats.pending,
                color: "#C2410C",
              },
              {
                label: "Rejected",
                value: documentStats.rejected,
                color: "#BE123C",
              },
            ].map((stat) => (
              <View
                key={stat.label}
                style={[styles.statChip, { borderColor: stat.color }]}
              >
                <Text style={[styles.statValue, { color: stat.color }]}>
                  {stat.value}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Attention required */}
        {pendingDocs.length > 0 && (
          <View style={styles.attentionSection}>
            <Text style={styles.attentionTitle}>⚠️ Action Required</Text>
            <View style={styles.attentionList}>
              {pendingDocs.slice(0, 4).map((doc) => (
                <TouchableOpacity
                  key={doc.id}
                  style={styles.attentionCard}
                  onPress={() =>
                    navigation.navigate(SCREENS.DOCUMENT_DETAIL, {
                      document: doc,
                    })
                  }
                >
                  <Text style={styles.attentionDocIcon}>
                    {doc.status === "rejected" ? "❌" : "📤"}
                  </Text>
                  <View style={styles.attentionInfo}>
                    <Text style={styles.attentionTitleText}>{doc.title}</Text>
                    <Text style={styles.attentionStatus}>
                      {doc.status === "rejected"
                        ? "Rejected — Re-upload"
                        : "Not uploaded"}
                    </Text>
                  </View>
                  <Text style={styles.attentionArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => navigation.navigate(SCREENS.DOCUMENT_UPLOAD)}
            >
              <Text style={styles.viewAllText}>View All Documents →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Student Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Student Details</Text>
            <TouchableOpacity onPress={openStudentEdit}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>
                {student.firstName} {student.lastName}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{student.email || "-"}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{student.phone || "-"}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Hostel/Day Scholar</Text>
              <Text style={styles.detailValue}>
                {student.hostelType === "hostel"
                  ? "🏠 Hostel"
                  : student.hostelType === "dayscholar"
                    ? `🚏 ${student.transportType || "Day Scholar"}`
                    : "-"}
              </Text>
            </View>
            <View style={styles.detailItemFull}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>{student.address || "-"}</Text>
            </View>
          </View>

          <Text style={styles.docSectionTitle}>Student Documents</Text>
          {renderDocUpload("passport_photo", "Passport Size Photo")}
        </View>

        {/* School Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>School Details</Text>
            <TouchableOpacity onPress={openSchoolEdit}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>School Name</Text>
              <Text style={styles.detailValue}>
                {student.schoolName || "-"}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>10th %</Text>
              <Text style={styles.detailValue}>
                {student.tenthPercentage ? `${student.tenthPercentage}%` : "-"}
              </Text>
            </View>
          </View>

          <Text style={styles.docSectionTitle}>School Documents</Text>
          {renderDocUpload("tenth_memo", "10th Memo")}
          {renderDocUpload("school_bonafide", "School Bonafide")}
        </View>

        {/* Inter Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Inter Details</Text>
            <TouchableOpacity onPress={openInterEdit}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Inter College</Text>
              <Text style={styles.detailValue}>
                {student.interCollege || "-"}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Inter Hallticket</Text>
              <Text style={styles.detailValue}>
                {student.interHallticket || "-"}
              </Text>
            </View>
            <View style={styles.detailItemFull}>
              <Text style={styles.detailLabel}>Inter Marks (%)</Text>
              <Text style={styles.detailValue}>
                {student.interPercentage ? `${student.interPercentage}%` : "-"}
              </Text>
            </View>
          </View>

          <Text style={styles.docSectionTitle}>Inter Documents</Text>
          {renderDocUpload("inter_hall_ticket", "Inter Hall Ticket")}
          {renderDocUpload("inter_memo", "Inter Memo")}
          {renderDocUpload("inter_bonafide", "Inter Bonafide")}
        </View>

        {/* Parent Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Parent Details</Text>
            <TouchableOpacity onPress={openParentEdit}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Father's Name</Text>
              <Text style={styles.detailValue}>
                {student.fatherName || "-"}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Father's Phone</Text>
              <Text style={styles.detailValue}>
                {student.fatherPhone || "-"}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Father's Profession</Text>
              <Text style={styles.detailValue}>
                {student.fatherProfession || "-"}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Mother's Name</Text>
              <Text style={styles.detailValue}>
                {student.motherName || "-"}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Mother's Phone</Text>
              <Text style={styles.detailValue}>
                {student.motherPhone || "-"}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Mother's Profession</Text>
              <Text style={styles.detailValue}>
                {student.motherProfession || "-"}
              </Text>
            </View>
          </View>

          <Text style={styles.docSectionTitle}>Parent Documents</Text>
          {renderDocUpload("aadhar_card", "Aadhaar Card")}
        </View>

        {/* EMACET Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>EMACET Details</Text>
            <TouchableOpacity onPress={openEmacetEdit}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Hall Ticket No.</Text>
              <Text style={styles.detailValue}>
                {student.emacetHallTicket || "-"}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Rank</Text>
              <Text style={styles.detailValue}>
                {student.emacetRank || "-"}
              </Text>
            </View>
          </View>

          <Text style={styles.docSectionTitle}>EMACET Documents</Text>
          {renderDocUpload("emacet_rank_card", "EMACET Rank Card")}
          {renderDocUpload("emacet_hall_ticket", "EMACET Hall Ticket")}
        </View>

        {/* Caste Certificate Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Caste Certificate</Text>
          </View>
          <Text style={styles.docSectionTitle}>Upload Document</Text>
          {renderDocUpload("caste_certificate", "Caste Certificate")}
        </View>

        {/* Income Certificate Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Income Certificate</Text>
          </View>
          <Text style={styles.docSectionTitle}>Upload Document</Text>
          {renderDocUpload("income_certificate", "Income Certificate")}
        </View>

        {/* Higher Studies Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Higher Studies Interest</Text>
          </View>

          <View style={styles.higherStudiesBox}>
            {student.higherStudiesInterest === "yes" ? (
              <>
                <View style={styles.interestTag}>
                  <Text style={styles.interestTagText}>✅ Interested</Text>
                </View>
                <Text style={styles.interestDetail}>
                  {student.higherStudiesCountry === "abroad"
                    ? `🌍 Abroad - ${student.higherStudiesCountryDetail || "Not specified"}`
                    : "🇮🇳 India"}
                </Text>
                {student.higherStudiesProgram && (
                  <Text style={styles.interestDetail}>
                    Program: {student.higherStudiesProgram}
                  </Text>
                )}
              </>
            ) : student.higherStudiesInterest === "no" ? (
              <View style={styles.interestTag}>
                <Text style={styles.interestTagText}>❌ Not Interested</Text>
              </View>
            ) : (
              <Text style={styles.notSet}>Not updated yet</Text>
            )}
          </View>
        </View>

        {/* General Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>General Info</Text>
            <TouchableOpacity onPress={openGeneral}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailItemFull}>
            <Text style={styles.detailLabel}>Hobbies</Text>
            <Text style={styles.detailValue}>{student.hobbies || "-"}</Text>
          </View>
          <View style={styles.detailItemFull}>
            <Text style={styles.detailLabel}>Skills & Values</Text>
            <Text style={styles.detailValue}>
              {student.skillsValues || "-"}
            </Text>
          </View>
          <View style={styles.detailItemFull}>
            <Text style={styles.detailLabel}>Short Term Goals</Text>
            <Text style={styles.detailValue}>
              {student.goalsShortTerm || "-"}
            </Text>
          </View>
          <View style={styles.detailItemFull}>
            <Text style={styles.detailLabel}>Long Term Goals</Text>
            <Text style={styles.detailValue}>
              {student.goalsLongTerm || "-"}
            </Text>
          </View>
          <View style={styles.detailItemFull}>
            <Text style={styles.detailLabel}>Books & Newspaper</Text>
            <Text style={styles.detailValue}>
              {student.booksNewspaper || "-"}
            </Text>
          </View>
        </View>

        {/* Placement Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Placement</Text>
            <TouchableOpacity onPress={openPlacement}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailItemFull}>
            <Text style={styles.detailLabel}>Domain Interest</Text>
            <Text style={styles.detailValue}>
              {student.placementDomain || "-"}
            </Text>
          </View>
        </View>

        {/* Sports Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Sports</Text>
            <TouchableOpacity onPress={openSports}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailItemFull}>
            <Text style={styles.detailLabel}>Sport Name</Text>
            <Text style={styles.detailValue}>{student.sportName || "-"}</Text>
          </View>
          <View style={styles.detailItemFull}>
            <Text style={styles.detailLabel}>Role in Sports</Text>
            <Text style={styles.detailValue}>{student.sportRole || "-"}</Text>
          </View>
          <View style={styles.detailItemFull}>
            <Text style={styles.detailLabel}>Tournament Won</Text>
            <Text style={styles.detailValue}>
              {student.tournamentWon || "-"}
            </Text>
          </View>
          <View style={styles.detailItemFull}>
            <Text style={styles.detailLabel}>Position</Text>
            <Text style={styles.detailValue}>
              {student.sportPosition || "-"}
            </Text>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Student Details Edit Modal */}
      <Modal
        visible={studentModal}
        onClose={() => setStudentModal(false)}
        title="Edit Student Details"
        size="lg"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input
            label="First Name"
            value={editForm.firstName}
            onChangeText={(t) => setEditForm({ ...editForm, firstName: t })}
            placeholder="First name"
          />
          <Input
            label="Last Name"
            value={editForm.lastName}
            onChangeText={(t) => setEditForm({ ...editForm, lastName: t })}
            placeholder="Last name"
          />
          <Input
            label="Email"
            value={editForm.email}
            onChangeText={(t) => setEditForm({ ...editForm, email: t })}
            placeholder="Email"
            keyboardType="email-address"
          />
          <Input
            label="Phone"
            value={editForm.phone}
            onChangeText={(t) => setEditForm({ ...editForm, phone: t })}
            placeholder="Phone"
            keyboardType="phone-pad"
          />
          <Input
            label="Address"
            value={editForm.address}
            onChangeText={(t) => setEditForm({ ...editForm, address: t })}
            placeholder="Address"
            multiline
          />
          <Text style={styles.subLabel}>Hostel / Transport</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                editForm.hostelType === "hostel" && styles.toggleBtnActive,
              ]}
              onPress={() => setEditForm({ ...editForm, hostelType: "hostel" })}
            >
              <Text
                style={[
                  styles.toggleText,
                  editForm.hostelType === "hostel" && styles.toggleTextActive,
                ]}
              >
                🏠 Hostel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                editForm.hostelType === "dayscholar" && styles.toggleBtnActive,
              ]}
              onPress={() =>
                setEditForm({ ...editForm, hostelType: "dayscholar" })
              }
            >
              <Text
                style={[
                  styles.toggleText,
                  editForm.hostelType === "dayscholar" &&
                    styles.toggleTextActive,
                ]}
              >
                🚏 Day Scholar
              </Text>
            </TouchableOpacity>
          </View>
          {editForm.hostelType === "dayscholar" && (
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  editForm.transportType === "college-bus" &&
                    styles.toggleBtnActive,
                ]}
                onPress={() =>
                  setEditForm({ ...editForm, transportType: "college-bus" })
                }
              >
                <Text
                  style={[
                    styles.toggleText,
                    editForm.transportType === "college-bus" &&
                      styles.toggleTextActive,
                  ]}
                >
                  College Bus
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  editForm.transportType === "rtc" && styles.toggleBtnActive,
                ]}
                onPress={() =>
                  setEditForm({ ...editForm, transportType: "rtc" })
                }
              >
                <Text
                  style={[
                    styles.toggleText,
                    editForm.transportType === "rtc" && styles.toggleTextActive,
                  ]}
                >
                  RTC
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <Button
            title={saving ? "Saving..." : "Save Changes"}
            onPress={handleStudentSave}
            disabled={saving}
            style={styles.saveBtn}
          />
        </ScrollView>
      </Modal>

      {/* School Details Edit Modal */}
      <Modal
        visible={schoolModal}
        onClose={() => setSchoolModal(false)}
        title="Edit School Details"
        size="lg"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input
            label="School Name"
            value={editForm.schoolName}
            onChangeText={(t) => setEditForm({ ...editForm, schoolName: t })}
            placeholder="e.g., Narayana High School"
          />
          <Input
            label="10th Percentage"
            value={editForm.tenthPercentage}
            onChangeText={(t) =>
              setEditForm({ ...editForm, tenthPercentage: t })
            }
            placeholder="e.g., 95.5"
            keyboardType="numeric"
          />
          <Button
            title={saving ? "Saving..." : "Save Changes"}
            onPress={handleSchoolSave}
            disabled={saving}
            style={styles.saveBtn}
          />
        </ScrollView>
      </Modal>

      {/* Inter Details Edit Modal */}
      <Modal
        visible={interModal}
        onClose={() => setInterModal(false)}
        title="Edit Inter Details"
        size="lg"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input
            label="Inter College"
            value={editForm.interCollege}
            onChangeText={(t) => setEditForm({ ...editForm, interCollege: t })}
            placeholder="e.g., Narayana Junior College"
          />
          <Input
            label="Inter Hallticket"
            value={editForm.interHallticket}
            onChangeText={(t) =>
              setEditForm({ ...editForm, interHallticket: t })
            }
            placeholder="e.g., IHT123456"
            autoCapitalize="characters"
          />
          <Input
            label="Inter Marks (%)"
            value={editForm.interPercentage}
            onChangeText={(t) =>
              setEditForm({ ...editForm, interPercentage: t })
            }
            placeholder="e.g., 96.0"
            keyboardType="numeric"
          />
          <Button
            title={saving ? "Saving..." : "Save Changes"}
            onPress={handleInterSave}
            disabled={saving}
            style={styles.saveBtn}
          />
        </ScrollView>
      </Modal>

      {/* Parent Details Edit Modal */}
      <Modal
        visible={parentModal}
        onClose={() => setParentModal(false)}
        title="Edit Parent Details"
        size="lg"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input
            label="Father's Name"
            value={editForm.fatherName}
            onChangeText={(t) => setEditForm({ ...editForm, fatherName: t })}
            placeholder="Father's name"
          />
          <Input
            label="Father's Phone"
            value={editForm.fatherPhone}
            onChangeText={(t) => setEditForm({ ...editForm, fatherPhone: t })}
            placeholder="Father's phone"
            keyboardType="phone-pad"
          />
          <Input
            label="Father's Profession"
            value={editForm.fatherProfession}
            onChangeText={(t) =>
              setEditForm({ ...editForm, fatherProfession: t })
            }
            placeholder="e.g., Farmer, Teacher, Business"
          />
          <Input
            label="Mother's Name"
            value={editForm.motherName}
            onChangeText={(t) => setEditForm({ ...editForm, motherName: t })}
            placeholder="Mother's name"
          />
          <Input
            label="Mother's Phone"
            value={editForm.motherPhone}
            onChangeText={(t) => setEditForm({ ...editForm, motherPhone: t })}
            placeholder="Mother's phone"
            keyboardType="phone-pad"
          />
          <Input
            label="Mother's Profession"
            value={editForm.motherProfession}
            onChangeText={(t) =>
              setEditForm({ ...editForm, motherProfession: t })
            }
            placeholder="e.g., Housewife, Teacher, Business"
          />
          <Button
            title={saving ? "Saving..." : "Save Changes"}
            onPress={handleParentSave}
            disabled={saving}
            style={styles.saveBtn}
          />
        </ScrollView>
      </Modal>

      {/* EMACET Details Edit Modal */}
      <Modal
        visible={emacetModal}
        onClose={() => setEmacetModal(false)}
        title="Edit EMACET Details"
        size="lg"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input
            label="Hall Ticket"
            value={editForm.emacetHallTicket}
            onChangeText={(t) =>
              setEditForm({ ...editForm, emacetHallTicket: t })
            }
            placeholder="Hall ticket number"
          />
          <Input
            label="Rank"
            value={editForm.emacetRank}
            onChangeText={(t) => setEditForm({ ...editForm, emacetRank: t })}
            placeholder="Rank"
            keyboardType="numeric"
          />
          <Text style={styles.modalSectionTitle}>Higher Studies</Text>
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
                  higherStudiesCountryDetail: "",
                  higherStudiesProgram: "",
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
              <Text style={styles.subLabel}>Where?</Text>
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
                    🇮🇳 India
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
                    🌍 Abroad
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
                  placeholder="e.g., USA, UK"
                />
              )}
              <Text style={styles.subLabel}>Program?</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    editForm.higherStudiesProgram === "mtech" &&
                      styles.toggleBtnActive,
                  ]}
                  onPress={() =>
                    setEditForm({ ...editForm, higherStudiesProgram: "mtech" })
                  }
                >
                  <Text
                    style={[
                      styles.toggleText,
                      editForm.higherStudiesProgram === "mtech" &&
                        styles.toggleTextActive,
                    ]}
                  >
                    MTech
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    editForm.higherStudiesProgram === "mba" &&
                      styles.toggleBtnActive,
                  ]}
                  onPress={() =>
                    setEditForm({ ...editForm, higherStudiesProgram: "mba" })
                  }
                >
                  <Text
                    style={[
                      styles.toggleText,
                      editForm.higherStudiesProgram === "mba" &&
                        styles.toggleTextActive,
                    ]}
                  >
                    MBA
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          <Button
            title={saving ? "Saving..." : "Save Changes"}
            onPress={handleEmacetSave}
            disabled={saving}
            style={styles.saveBtn}
          />
        </ScrollView>
      </Modal>

      {/* General Info Edit Modal */}
      <Modal
        visible={generalModal}
        onClose={() => setGeneralModal(false)}
        title="General Info"
        size="lg"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input
            label="Hobbies"
            value={editForm.hobbies}
            onChangeText={(t) => setEditForm({ ...editForm, hobbies: t })}
            placeholder="e.g., Reading, Gaming, Painting"
            multiline
          />
          <Input
            label="Skills & Values"
            value={editForm.skillsValues}
            onChangeText={(t) => setEditForm({ ...editForm, skillsValues: t })}
            placeholder="e.g., Leadership, Teamwork, Coding"
            multiline
          />
          <Input
            label="Short Term Goals"
            value={editForm.goalsShortTerm}
            onChangeText={(t) =>
              setEditForm({ ...editForm, goalsShortTerm: t })
            }
            placeholder="e.g., Learn a new skill, Get internship"
            multiline
          />
          <Input
            label="Long Term Goals"
            value={editForm.goalsLongTerm}
            onChangeText={(t) => setEditForm({ ...editForm, goalsLongTerm: t })}
            placeholder="e.g., Become a software engineer, Start own business"
            multiline
          />
          <Input
            label="Books & Newspaper"
            value={editForm.booksNewspaper}
            onChangeText={(t) =>
              setEditForm({ ...editForm, booksNewspaper: t })
            }
            placeholder="e.g., The Hindu, Times of India, Novels"
            multiline
          />
          <Button
            title={saving ? "Saving..." : "Save Changes"}
            onPress={handleGeneralSave}
            disabled={saving}
            style={styles.saveBtn}
          />
        </ScrollView>
      </Modal>

      {/* Sports Edit Modal */}
      <Modal
        visible={sportsModal}
        onClose={() => setSportsModal(false)}
        title="Sports Details"
        size="lg"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input
            label="Sport Name"
            value={editForm.sportName}
            onChangeText={(t) => setEditForm({ ...editForm, sportName: t })}
            placeholder="e.g., Cricket, Basketball, Kabaddi"
          />
          <Input
            label="Role in Sports"
            value={editForm.sportRole}
            onChangeText={(t) => setEditForm({ ...editForm, sportRole: t })}
            placeholder="e.g., Captain, Player, Coach"
          />
          <Input
            label="Tournament Won"
            value={editForm.tournamentWon}
            onChangeText={(t) => setEditForm({ ...editForm, tournamentWon: t })}
            placeholder="e.g., District Level Cricket 2023, State Basketball 2022"
            multiline
          />
          <Input
            label="Position (1st, 2nd, 3rd)"
            value={editForm.sportPosition}
            onChangeText={(t) => setEditForm({ ...editForm, sportPosition: t })}
            placeholder="e.g., 1st, 2nd, 3rd"
          />
          <Button
            title={saving ? "Saving..." : "Save Changes"}
            onPress={handleSportsSave}
            disabled={saving}
            style={styles.saveBtn}
          />
        </ScrollView>
      </Modal>

      {/* Document Upload Modal */}
      <Modal
        visible={docUploadModal}
        onClose={() => {
          setDocUploadModal(false);
          setSelectedDoc(null);
        }}
        title={selectedDoc?.title || "Upload Document"}
        subtitle="Select a file from your device"
        icon="📤"
        size="md"
      >
        {selectedDoc && (
          <DocumentUploader
            documentTitle={selectedDoc.title}
            documentId={selectedDoc.id}
            existingFileUri={getDocFileUri(selectedDoc.id)}
            onUploadSuccess={handleDocUploadSuccess}
            onUploadError={() => {}}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  headerLeft: { flex: 1, marginRight: 12 },
  greeting: { fontSize: 13, color: "#94A3B8", fontWeight: "500" },
  studentName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 2,
  },
  rollNumber: { fontSize: 12, color: "#64748B", marginTop: 2 },
  avatarBtn: { position: "relative" },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 16, fontWeight: "800", color: "#1D4ED8" },

  docStatusCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  docStatusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  docStatusTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  uploadLink: { fontSize: 14, color: "#1D4ED8", fontWeight: "600" },

  statsRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  statChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    backgroundColor: "#FFFFFF",
  },
  statValue: { fontSize: 20, fontWeight: "800" },
  statLabel: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },

  attentionSection: { marginTop: 16, paddingHorizontal: 16 },
  attentionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },
  attentionList: { gap: 8 },
  attentionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
    gap: 12,
  },
  attentionDocIcon: { fontSize: 24 },
  attentionInfo: { flex: 1 },
  attentionTitleText: { fontSize: 14, fontWeight: "600", color: "#1E293B" },
  attentionStatus: { fontSize: 12, color: "#92400E", marginTop: 2 },
  attentionArrow: { fontSize: 22, color: "#CBD5E1" },
  viewAllBtn: { alignItems: "center", marginTop: 12, paddingVertical: 8 },
  viewAllText: { color: "#1D4ED8", fontWeight: "600", fontSize: 14 },

  card: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  editLink: { fontSize: 14, color: "#1D4ED8", fontWeight: "600" },
  detailsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  detailItem: { width: "47%" },
  detailItemFull: { width: "100%", marginTop: 8 },
  detailLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
    marginBottom: 2,
  },
  detailValue: { fontSize: 14, fontWeight: "600", color: "#0F172A" },

  higherStudiesBox: { alignItems: "flex-start" },
  interestTag: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  interestTagText: { fontSize: 13, fontWeight: "600", color: "#16A34A" },
  interestDetail: { fontSize: 14, fontWeight: "600", color: "#0F172A" },
  notSet: { fontSize: 14, color: "#94A3B8" },

  modalSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1D4ED8",
    marginTop: 16,
    marginBottom: 10,
  },
  subLabel: { fontSize: 13, color: "#64748B", marginBottom: 8 },
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
  saveBtn: { marginTop: 20, marginBottom: 20 },

  docSectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 16,
    marginBottom: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  docUploadItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  docUploadItemUploaded: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  docUploadInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  docUploadIcon: { fontSize: 20 },
  docUploadTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  docUploadStatus: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  docUploadStatusApproved: {
    color: "#16A34A",
  },
  docUploadArrow: {
    fontSize: 20,
    color: "#94A3B8",
  },
});

export default StudentDashboard;
