import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, RefreshControl,
} from "react-native";
import { useAuth }        from "../../context/AuthContext";
import { useStudent }     from "../../context/StudentContext";
import useDocuments       from "../../hooks/useDocuments";
import StatusBadge        from "../../components/common/StatusBadge";
import Modal              from "../../components/common/Modal";
import Input              from "../../components/common/Input";
import Button             from "../../components/common/Button";
import DocumentUploader   from "../../components/student/DocumentUploader";
import { SCREENS }        from "../../constants/config";
import studentService     from "../../services/studentService";

const INTER_MEDIUM_OPTIONS = ["Telugu Medium", "English Medium", "Urdu Medium", "Hindi Medium"];
const TENTH_MEDIUM_OPTIONS  = ["Telugu Medium", "English Medium", "Urdu Medium", "Hindi Medium"];

const StudentDashboard = ({ navigation }) => {
  const { user }                                             = useAuth();
  const { profile, setProfile, documentStats }              = useStudent();
  const { documents, fetchDocuments, uploadDocument }       = useDocuments();
  const [refreshing, setRefreshing]                         = useState(false);

  // ── Modals ────────────────────────────────────────────────────────────────
  const [studentModal,   setStudentModal]   = useState(false);
  const [tenthModal,     setTenthModal]     = useState(false);
  const [interModal,     setInterModal]     = useState(false);
  const [eapcetModal,    setEapcetModal]    = useState(false);
  const [parentModal,    setParentModal]    = useState(false);
  const [generalModal,   setGeneralModal]   = useState(false);
  const [sportsModal,    setSportsModal]    = useState(false);
  const [careerModal,    setCareerModal]    = useState(false);
  const [docUploadModal, setDocUploadModal] = useState(false);

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [editForm,    setEditForm]    = useState({});
  const [saving,      setSaving]      = useState(false);

  useEffect(() => {
    loadProfile();
    if (user?.id) fetchDocuments(user.id);
  }, [user]);

  const loadProfile = async () => {
    try {
      const data = await studentService.getProfile();
      setProfile(data);
    } catch (e) { console.log("Error loading profile:", e); }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    if (user?.id) await fetchDocuments(user.id);
    setRefreshing(false);
  };

  const student = profile || user || {};

  const pendingDocs = documents.filter(
    (d) => d.status === "not_uploaded" || d.status === "rejected"
  );

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // ── Save helper ───────────────────────────────────────────────────────────
  const saveSection = async (closeFn) => {
    setSaving(true);
    try {
      await studentService.updateProfile(editForm);
      setProfile({ ...profile, ...editForm });
      closeFn(false);
    } catch (e) { console.log("Error saving:", e); }
    finally { setSaving(false); }
  };

  // ── Open edit handlers ────────────────────────────────────────────────────
  const openStudentEdit = () => {
    setEditForm({
      firstName: student.firstName || "", lastName: student.lastName || "",
      email: student.email || "", phone: student.phone || "",
      address: student.address || "",
      hostelType: student.hostelType || null,
      transportType: student.transportType || "",
    });
    setStudentModal(true);
  };

  const openTenthEdit = () => {
    setEditForm({
      tenthHallTicket: student.tenthHallTicket || "",
      tenthPercentage: student.tenthPercentage || "",
      tenthMedium:     student.tenthMedium     || "",
    });
    setTenthModal(true);
  };

  const openInterEdit = () => {
    setEditForm({
      interHallTicket: student.interHallTicket || "",
      interPercentage: student.interPercentage || "",
      interMedium:     student.interMedium     || "",
    });
    setInterModal(true);
  };

  const openEapcetEdit = () => {
    setEditForm({
      eapcetHallTicket: student.eapcetHallTicket || "",
      eapcetRank:       student.eapcetRank       || "",
    });
    setEapcetModal(true);
  };

  const openParentEdit = () => {
    setEditForm({
      fatherName:       student.fatherName       || "",
      fatherPhone:      student.fatherPhone      || "",
      fatherProfession: student.fatherProfession || "",
      motherName:       student.motherName       || "",
      motherPhone:      student.motherPhone      || "",
      motherProfession: student.motherProfession || "",
    });
    setParentModal(true);
  };

  const openGeneral = () => {
    setEditForm({
      hobbies:       student.hobbies       || "",
      skillsValues:  student.skillsValues  || "",
      goalsShortTerm: student.goalsShortTerm || "",
      goalsLongTerm:  student.goalsLongTerm  || "",
    });
    setGeneralModal(true);
  };

  const openSports = () => {
    setEditForm({
      sportName:     student.sportName     || "",
      sportRole:     student.sportRole     || "",
      tournamentWon: student.tournamentWon || "",
      sportPosition: student.sportPosition || "",
    });
    setSportsModal(true);
  };

  const openCareer = () => {
    setEditForm({
      careerInterest:             student.careerInterest             || "placement",
      placementDomain:            student.placementDomain            || "",
      higherStudiesCountry:       student.higherStudiesCountry       || "india",
      higherStudiesCountryDetail: student.higherStudiesCountryDetail || "",
      higherStudiesDegree:        student.higherStudiesDegree        || "",
      higherStudiesSector:        student.higherStudiesSector        || "",
    });
    setCareerModal(true);
  };

  // ── Document helpers ──────────────────────────────────────────────────────
  const getDocStatus  = (docId) => documents.find((d) => d.id === docId)?.status  || "not_uploaded";
  const getDocFileUri = (docId) => documents.find((d) => d.id === docId)?.fileUri || null;

  const handleDocUploadPress = (docId, docTitle) => {
    const existing = documents.find((d) => d.id === docId);
    setSelectedDoc(existing || { id: docId, title: docTitle });
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
    const status     = getDocStatus(docId);
    const isUploaded = status === "pending" || status === "approved";
    const icon = status === "approved" ? "✅" : status === "pending" ? "⏳" : status === "rejected" ? "❌" : "📄";
    const label = status === "approved" ? "Approved" : status === "pending" ? "Under Review" : status === "rejected" ? "Rejected — Tap to re-upload" : "Tap to upload";

    return (
      <TouchableOpacity
        key={docId}
        style={[styles.docUploadItem, isUploaded && styles.docUploadItemUploaded]}
        onPress={() => handleDocUploadPress(docId, docTitle)}
      >
        <Text style={styles.docUploadIcon}>{icon}</Text>
        <View style={styles.docUploadInfo}>
          <Text style={styles.docUploadTitle}>{docTitle}</Text>
          <Text style={[styles.docUploadStatus, status === "approved" && styles.statusApproved, status === "rejected" && styles.statusRejected]}>
            {label}
          </Text>
        </View>
        <Text style={styles.docArrow}>›</Text>
      </TouchableOpacity>
    );
  };

  // ── Option pill selector ──────────────────────────────────────────────────
  const OptionPills = ({ field, options }) => (
    <View style={styles.pillRow}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.pill, editForm[field] === opt && styles.pillActive]}
          onPress={() => setEditForm({ ...editForm, [field]: opt })}
        >
          <Text style={[styles.pillText, editForm[field] === opt && styles.pillTextActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // ── Detail row helpers ────────────────────────────────────────────────────
  const DetailRow = ({ label, value }) => (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || "—"}</Text>
    </View>
  );
  const DetailRowFull = ({ label, value }) => (
    <View style={styles.detailItemFull}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || "—"}</Text>
    </View>
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1D4ED8"]} />}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.studentName} numberOfLines={1}>
              {student.firstName || student.name || "Student"}
            </Text>
            <Text style={styles.rollNumber}>{student.uniqueId || ""}</Text>
          </View>
          <TouchableOpacity style={styles.avatarBtn} onPress={() => navigation.navigate(SCREENS.PROFILE)}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(student.firstName || student.name || "S").charAt(0).toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Document Stats ── */}
        <View style={styles.docStatusCard}>
          <View style={styles.docStatusHeader}>
            <Text style={styles.docStatusTitle}>📚 Academic Documents</Text>
            <TouchableOpacity onPress={() => navigation.navigate(SCREENS.DOCUMENT_UPLOAD)}>
              <Text style={styles.uploadLink}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsRow}>
            {[
              { label: "Total",    value: documentStats.total,    color: "#1D4ED8" },
              { label: "Approved", value: documentStats.approved, color: "#15803D" },
              { label: "Pending",  value: documentStats.pending,  color: "#C2410C" },
              { label: "Rejected", value: documentStats.rejected, color: "#BE123C" },
            ].map((stat) => (
              <View key={stat.label} style={[styles.statChip, { borderColor: stat.color }]}>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Action Required ── */}
        {pendingDocs.length > 0 && (
          <View style={styles.attentionSection}>
            <Text style={styles.attentionTitle}>⚠️ Action Required</Text>
            {pendingDocs.slice(0, 4).map((doc) => (
              <TouchableOpacity
                key={doc.id}
                style={styles.attentionCard}
                onPress={() => navigation.navigate(SCREENS.DOCUMENT_DETAIL, { document: doc })}
              >
                <Text style={styles.attentionDocIcon}>{doc.status === "rejected" ? "❌" : "📤"}</Text>
                <View style={styles.attentionInfo}>
                  <Text style={styles.attentionTitleText}>{doc.title}</Text>
                  <Text style={styles.attentionStatus}>
                    {doc.status === "rejected" ? "Rejected — Re-upload required" : "Not uploaded yet"}
                  </Text>
                </View>
                <Text style={styles.attentionArrow}>›</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigation.navigate(SCREENS.DOCUMENT_UPLOAD)}>
              <Text style={styles.viewAllText}>View All Documents →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Student Details ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>👤 Student Details</Text>
            <TouchableOpacity onPress={openStudentEdit}><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
          </View>
          <View style={styles.detailsGrid}>
            <DetailRow label="First Name"  value={student.firstName} />
            <DetailRow label="Last Name"   value={student.lastName}  />
            <DetailRow label="Email"       value={student.email}     />
            <DetailRow label="Phone"       value={student.phone}     />
            <DetailRow
              label="Stay Type"
              value={student.hostelType === "hostel" ? "🏠 Hostel" : student.hostelType === "dayscholar" ? `🚏 ${student.transportType || "Day Scholar"}` : undefined}
            />
          </View>
          <DetailRowFull label="Address" value={student.address} />
          <Text style={styles.docSectionTitle}>Documents</Text>
          {renderDocUpload("passport_photo", "Passport Size Photo")}
          {renderDocUpload("aadhar_card",    "Aadhaar Card")}
        </View>

        {/* ── 10th Documentation ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🏫 10th Documentation</Text>
            <TouchableOpacity onPress={openTenthEdit}><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
          </View>
          <View style={styles.detailsGrid}>
            <DetailRow label="Hall Ticket No." value={student.tenthHallTicket} />
            <DetailRow label="Percentage"      value={student.tenthPercentage ? `${student.tenthPercentage}%` : undefined} />
            <DetailRow label="Medium"          value={student.tenthMedium}     />
          </View>
          <Text style={styles.docSectionTitle}>Upload Documents</Text>
          {renderDocUpload("tenth_hall_ticket", "10th Hall Ticket")}
          {renderDocUpload("tenth_memo",        "10th Memo")}
          {renderDocUpload("tenth_bonafide",    "10th Bonafide Certificate")}
        </View>

        {/* ── Inter Documentation ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🎓 Inter Documentation</Text>
            <TouchableOpacity onPress={openInterEdit}><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
          </View>
          <View style={styles.detailsGrid}>
            <DetailRow label="Hall Ticket No." value={student.interHallTicket} />
            <DetailRow label="Percentage"      value={student.interPercentage ? `${student.interPercentage}%` : undefined} />
            <DetailRow label="Medium"          value={student.interMedium}     />
          </View>
          <Text style={styles.docSectionTitle}>Upload Documents</Text>
          {renderDocUpload("inter_hall_ticket", "Inter Hall Ticket")}
          {renderDocUpload("inter_memo",        "Inter Memo")}
          {renderDocUpload("inter_bonafide",    "Inter Bonafide Certificate")}
        </View>

        {/* ── EAPCET Documentation ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📝 EAPCET Documentation</Text>
            <TouchableOpacity onPress={openEapcetEdit}><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
          </View>
          <View style={styles.detailsGrid}>
            <DetailRow label="Hall Ticket No." value={student.eapcetHallTicket} />
            <DetailRow label="Rank"            value={student.eapcetRank}        />
          </View>
          <Text style={styles.docSectionTitle}>Upload Documents</Text>
          {renderDocUpload("eapcet_hall_ticket", "EAPCET Hall Ticket")}
          {renderDocUpload("eapcet_rank_card",   "EAPCET Rank Card")}
        </View>

        {/* ── Parent Details ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>👨‍👩‍👦 Parent Details</Text>
            <TouchableOpacity onPress={openParentEdit}><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
          </View>
          <View style={styles.detailsGrid}>
            <DetailRow label="Father's Name"       value={student.fatherName}       />
            <DetailRow label="Father's Phone"      value={student.fatherPhone}      />
            <DetailRow label="Father's Profession" value={student.fatherProfession} />
            <DetailRow label="Mother's Name"       value={student.motherName}       />
            <DetailRow label="Mother's Phone"      value={student.motherPhone}      />
            <DetailRow label="Mother's Profession" value={student.motherProfession} />
          </View>
        </View>

        {/* ── Other Documents ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📂 Other Documents</Text>
          </View>
          {renderDocUpload("caste_certificate",  "Caste Certificate")}
          {renderDocUpload("income_certificate", "Income Certificate")}
        </View>

        {/* ── General Info ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>💡 General Info</Text>
            <TouchableOpacity onPress={openGeneral}><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
          </View>
          <Text style={styles.subSectionTitle}>Student Interest</Text>
          <DetailRowFull label="Hobbies"         value={student.hobbies}        />
          <DetailRowFull label="Skills & Values" value={student.skillsValues}   />
          <DetailRowFull label="Short Term Goals" value={student.goalsShortTerm} />
          <DetailRowFull label="Long Term Goals"  value={student.goalsLongTerm}  />
        </View>

        {/* ── Sports ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🏅 Sports (Professional)</Text>
            <TouchableOpacity onPress={openSports}><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
          </View>
          <View style={styles.detailsGrid}>
            <DetailRow label="Sport Name"     value={student.sportName}     />
            <DetailRow label="Role in Sports" value={student.sportRole}     />
            <DetailRow label="Position"       value={student.sportPosition} />
          </View>
          <DetailRowFull label="Tournaments Won" value={student.tournamentWon} />
        </View>

        {/* ── Career Interest ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>💼 Career Interest</Text>
            <TouchableOpacity onPress={openCareer}><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
          </View>
          {student.careerInterest === "placement" ? (
            <>
              <View style={styles.careerTag}>
                <Text style={styles.careerTagText}>🏢 Placements</Text>
              </View>
              <DetailRowFull label="Domain of Interest" value={student.placementDomain} />
            </>
          ) : student.careerInterest === "higher_education" ? (
            <>
              <View style={[styles.careerTag, { backgroundColor: "#F0FDF4" }]}>
                <Text style={[styles.careerTagText, { color: "#16A34A" }]}>🎓 Higher Education</Text>
              </View>
              <View style={styles.detailsGrid}>
                <DetailRow
                  label="Location"
                  value={student.higherStudiesCountry === "abroad"
                    ? `🌍 Abroad — ${student.higherStudiesCountryDetail || ""}`
                    : "🇮🇳 India"}
                />
                <DetailRow label="Degree Aspired" value={student.higherStudiesDegree}  />
                <DetailRow label="Sector"         value={student.higherStudiesSector}  />
              </View>
            </>
          ) : (
            <Text style={styles.notSet}>Not updated yet</Text>
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ══════════════════════════ EDIT MODALS ══════════════════════════════ */}

      {/* Student Details Modal */}
      <Modal visible={studentModal} onClose={() => setStudentModal(false)} title="Edit Student Details" size="lg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input label="First Name" value={editForm.firstName} onChangeText={(t) => setEditForm({ ...editForm, firstName: t })} placeholder="First name" />
          <Input label="Last Name"  value={editForm.lastName}  onChangeText={(t) => setEditForm({ ...editForm, lastName: t })}  placeholder="Last name"  />
          <Input label="Email"      value={editForm.email}     onChangeText={(t) => setEditForm({ ...editForm, email: t })}     placeholder="Email" keyboardType="email-address" />
          <Input label="Phone"      value={editForm.phone}     onChangeText={(t) => setEditForm({ ...editForm, phone: t })}     placeholder="Phone" keyboardType="phone-pad" />
          <Input label="Address"    value={editForm.address}   onChangeText={(t) => setEditForm({ ...editForm, address: t })}   placeholder="Address" multiline />
          <Text style={styles.modalSectionLabel}>Stay Type</Text>
          <View style={styles.pillRow}>
            {[{ val: "hostel", label: "🏠 Hostel" }, { val: "dayscholar", label: "🚏 Day Scholar" }].map((o) => (
              <TouchableOpacity key={o.val} style={[styles.pill, editForm.hostelType === o.val && styles.pillActive]} onPress={() => setEditForm({ ...editForm, hostelType: o.val })}>
                <Text style={[styles.pillText, editForm.hostelType === o.val && styles.pillTextActive]}>{o.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {editForm.hostelType === "dayscholar" && (
            <>
              <Text style={styles.modalSectionLabel}>Transport</Text>
              <View style={styles.pillRow}>
                {[{ val: "college-bus", label: "College Bus" }, { val: "rtc", label: "RTC" }].map((o) => (
                  <TouchableOpacity key={o.val} style={[styles.pill, editForm.transportType === o.val && styles.pillActive]} onPress={() => setEditForm({ ...editForm, transportType: o.val })}>
                    <Text style={[styles.pillText, editForm.transportType === o.val && styles.pillTextActive]}>{o.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
          <Button title={saving ? "Saving..." : "Save Changes"} onPress={() => saveSection(setStudentModal)} disabled={saving} style={styles.saveBtn} />
        </ScrollView>
      </Modal>

      {/* 10th Details Modal */}
      <Modal visible={tenthModal} onClose={() => setTenthModal(false)} title="Edit 10th Details" size="lg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input label="Hall Ticket Number" value={editForm.tenthHallTicket} onChangeText={(t) => setEditForm({ ...editForm, tenthHallTicket: t.toUpperCase() })} placeholder="e.g. AP12345678" autoCapitalize="characters" />
          <Input label="Percentage (%)"     value={editForm.tenthPercentage} onChangeText={(t) => setEditForm({ ...editForm, tenthPercentage: t })}              placeholder="e.g. 95.5"       keyboardType="numeric" />
          <Text style={styles.modalSectionLabel}>Medium of Instruction</Text>
          <OptionPills field="tenthMedium" options={TENTH_MEDIUM_OPTIONS} />
          <Button title={saving ? "Saving..." : "Save Changes"} onPress={() => saveSection(setTenthModal)} disabled={saving} style={styles.saveBtn} />
        </ScrollView>
      </Modal>

      {/* Inter Details Modal */}
      <Modal visible={interModal} onClose={() => setInterModal(false)} title="Edit Inter Details" size="lg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input label="Hall Ticket Number" value={editForm.interHallTicket} onChangeText={(t) => setEditForm({ ...editForm, interHallTicket: t.toUpperCase() })} placeholder="e.g. IHT2024XXXXX" autoCapitalize="characters" />
          <Input label="Percentage (%)"     value={editForm.interPercentage} onChangeText={(t) => setEditForm({ ...editForm, interPercentage: t })}               placeholder="e.g. 96.0"        keyboardType="numeric" />
          <Text style={styles.modalSectionLabel}>Medium of Instruction</Text>
          <OptionPills field="interMedium" options={INTER_MEDIUM_OPTIONS} />
          <Button title={saving ? "Saving..." : "Save Changes"} onPress={() => saveSection(setInterModal)} disabled={saving} style={styles.saveBtn} />
        </ScrollView>
      </Modal>

      {/* EAPCET Modal */}
      <Modal visible={eapcetModal} onClose={() => setEapcetModal(false)} title="Edit EAPCET Details" size="lg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input label="Hall Ticket Number" value={editForm.eapcetHallTicket} onChangeText={(t) => setEditForm({ ...editForm, eapcetHallTicket: t.toUpperCase() })} placeholder="e.g. EAPCET2024XXXXX" autoCapitalize="characters" />
          <Input label="Rank"               value={editForm.eapcetRank}        onChangeText={(t) => setEditForm({ ...editForm, eapcetRank: t })}                    placeholder="e.g. 12345"           keyboardType="numeric" />
          <Button title={saving ? "Saving..." : "Save Changes"} onPress={() => saveSection(setEapcetModal)} disabled={saving} style={styles.saveBtn} />
        </ScrollView>
      </Modal>

      {/* Parent Modal */}
      <Modal visible={parentModal} onClose={() => setParentModal(false)} title="Edit Parent Details" size="lg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input label="Father's Name"       value={editForm.fatherName}       onChangeText={(t) => setEditForm({ ...editForm, fatherName: t })}       placeholder="Father's name" />
          <Input label="Father's Phone"      value={editForm.fatherPhone}      onChangeText={(t) => setEditForm({ ...editForm, fatherPhone: t })}      placeholder="Father's phone" keyboardType="phone-pad" />
          <Input label="Father's Profession" value={editForm.fatherProfession} onChangeText={(t) => setEditForm({ ...editForm, fatherProfession: t })} placeholder="e.g. Farmer, Teacher" />
          <Input label="Mother's Name"       value={editForm.motherName}       onChangeText={(t) => setEditForm({ ...editForm, motherName: t })}       placeholder="Mother's name" />
          <Input label="Mother's Phone"      value={editForm.motherPhone}      onChangeText={(t) => setEditForm({ ...editForm, motherPhone: t })}      placeholder="Mother's phone" keyboardType="phone-pad" />
          <Input label="Mother's Profession" value={editForm.motherProfession} onChangeText={(t) => setEditForm({ ...editForm, motherProfession: t })} placeholder="e.g. Housewife, Teacher" />
          <Button title={saving ? "Saving..." : "Save Changes"} onPress={() => saveSection(setParentModal)} disabled={saving} style={styles.saveBtn} />
        </ScrollView>
      </Modal>

      {/* General Info Modal */}
      <Modal visible={generalModal} onClose={() => setGeneralModal(false)} title="General Info — Student Interest" size="lg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input label="Hobbies"          value={editForm.hobbies}        onChangeText={(t) => setEditForm({ ...editForm, hobbies: t })}        placeholder="e.g. Reading, Gaming" multiline />
          <Input label="Skills & Values"  value={editForm.skillsValues}   onChangeText={(t) => setEditForm({ ...editForm, skillsValues: t })}   placeholder="e.g. Leadership, Coding" multiline />
          <Input label="Short Term Goals" value={editForm.goalsShortTerm} onChangeText={(t) => setEditForm({ ...editForm, goalsShortTerm: t })} placeholder="e.g. Get an internship" multiline />
          <Input label="Long Term Goals"  value={editForm.goalsLongTerm}  onChangeText={(t) => setEditForm({ ...editForm, goalsLongTerm: t })}  placeholder="e.g. Software engineer" multiline />
          <Button title={saving ? "Saving..." : "Save Changes"} onPress={() => saveSection(setGeneralModal)} disabled={saving} style={styles.saveBtn} />
        </ScrollView>
      </Modal>

      {/* Sports Modal */}
      <Modal visible={sportsModal} onClose={() => setSportsModal(false)} title="Sports Details" size="lg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input label="Sport Name"      value={editForm.sportName}     onChangeText={(t) => setEditForm({ ...editForm, sportName: t })}     placeholder="e.g. Cricket, Kabaddi" />
          <Input label="Role in Sports"  value={editForm.sportRole}     onChangeText={(t) => setEditForm({ ...editForm, sportRole: t })}     placeholder="e.g. Captain, Player" />
          <Input label="Tournaments Won" value={editForm.tournamentWon} onChangeText={(t) => setEditForm({ ...editForm, tournamentWon: t })} placeholder="e.g. District Level 2023" multiline />
          <Input label="Position"        value={editForm.sportPosition} onChangeText={(t) => setEditForm({ ...editForm, sportPosition: t })} placeholder="e.g. 1st, 2nd, 3rd" />
          <Button title={saving ? "Saving..." : "Save Changes"} onPress={() => saveSection(setSportsModal)} disabled={saving} style={styles.saveBtn} />
        </ScrollView>
      </Modal>

      {/* Career Interest Modal */}
      <Modal visible={careerModal} onClose={() => setCareerModal(false)} title="Career Interest" size="lg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.modalSectionLabel}>I am interested in</Text>
          <View style={styles.pillRow}>
            {[{ val: "placement", label: "🏢 Placements" }, { val: "higher_education", label: "🎓 Higher Education" }].map((o) => (
              <TouchableOpacity
                key={o.val}
                style={[styles.pill, styles.pillWide, editForm.careerInterest === o.val && styles.pillActive]}
                onPress={() => setEditForm({ ...editForm, careerInterest: o.val })}
              >
                <Text style={[styles.pillText, editForm.careerInterest === o.val && styles.pillTextActive]}>{o.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {editForm.careerInterest === "placement" && (
            <Input label="Domain of Interest" value={editForm.placementDomain} onChangeText={(t) => setEditForm({ ...editForm, placementDomain: t })} placeholder="e.g. Software, Data Science, Core" />
          )}

          {editForm.careerInterest === "higher_education" && (
            <>
              <Text style={styles.modalSectionLabel}>Location</Text>
              <View style={styles.pillRow}>
                {[{ val: "india", label: "🇮🇳 India" }, { val: "abroad", label: "🌍 Abroad" }].map((o) => (
                  <TouchableOpacity key={o.val} style={[styles.pill, styles.pillWide, editForm.higherStudiesCountry === o.val && styles.pillActive]} onPress={() => setEditForm({ ...editForm, higherStudiesCountry: o.val })}>
                    <Text style={[styles.pillText, editForm.higherStudiesCountry === o.val && styles.pillTextActive]}>{o.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {editForm.higherStudiesCountry === "abroad" && (
                <Input label="Which Country?" value={editForm.higherStudiesCountryDetail} onChangeText={(t) => setEditForm({ ...editForm, higherStudiesCountryDetail: t })} placeholder="e.g. USA, UK, Germany" />
              )}
              <Input label="Degree Aspired" value={editForm.higherStudiesDegree}  onChangeText={(t) => setEditForm({ ...editForm, higherStudiesDegree: t })}  placeholder="e.g. MTech, MBA, MS" />
              <Input label="Sector"         value={editForm.higherStudiesSector}  onChangeText={(t) => setEditForm({ ...editForm, higherStudiesSector: t })}  placeholder="e.g. AI, Finance, Management" />
            </>
          )}

          <Button title={saving ? "Saving..." : "Save Changes"} onPress={() => saveSection(setCareerModal)} disabled={saving} style={styles.saveBtn} />
        </ScrollView>
      </Modal>

      {/* Document Upload Modal */}
      <Modal
        visible={docUploadModal}
        onClose={() => { setDocUploadModal(false); setSelectedDoc(null); }}
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

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },

  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  headerLeft: { flex: 1, marginRight: 12 },
  greeting:    { fontSize: 13, color: "#94A3B8", fontWeight: "500" },
  studentName: { fontSize: 22, fontWeight: "800", color: "#0F172A", marginTop: 2 },
  rollNumber:  { fontSize: 12, color: "#64748B", marginTop: 2 },
  avatarBtn: {},
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "#DBEAFE", justifyContent: "center", alignItems: "center",
  },
  avatarText: { fontSize: 16, fontWeight: "800", color: "#1D4ED8" },

  docStatusCard: {
    marginHorizontal: 16, marginTop: 16, backgroundColor: "#FFFFFF",
    borderRadius: 14, padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  docStatusHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  docStatusTitle:  { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  uploadLink:      { fontSize: 14, color: "#1D4ED8", fontWeight: "600" },
  statsRow:        { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  statChip: {
    flex: 1, alignItems: "center", paddingVertical: 10,
    borderRadius: 10, borderWidth: 1.5, backgroundColor: "#FFFFFF",
  },
  statValue: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 10, color: "#64748B", marginTop: 2, fontWeight: "500" },

  attentionSection: { marginTop: 16, paddingHorizontal: 16 },
  attentionTitle:   { fontSize: 16, fontWeight: "700", color: "#0F172A", marginBottom: 10 },
  attentionCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#FFFBEB", borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: "#FDE68A", gap: 12, marginBottom: 8,
  },
  attentionDocIcon:  { fontSize: 24 },
  attentionInfo:     { flex: 1 },
  attentionTitleText: { fontSize: 14, fontWeight: "600", color: "#1E293B" },
  attentionStatus:   { fontSize: 12, color: "#92400E", marginTop: 2 },
  attentionArrow:    { fontSize: 22, color: "#CBD5E1" },
  viewAllBtn:        { alignItems: "center", marginTop: 8, paddingVertical: 8 },
  viewAllText:       { color: "#1D4ED8", fontWeight: "600", fontSize: 14 },

  card: {
    marginHorizontal: 16, marginTop: 16, backgroundColor: "#FFFFFF",
    borderRadius: 14, padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  cardTitle:  { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  editLink:   { fontSize: 14, color: "#1D4ED8", fontWeight: "600" },

  detailsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  detailItem:  { width: "47%" },
  detailItemFull: { width: "100%", marginTop: 8 },
  detailLabel: { fontSize: 11, color: "#94A3B8", fontWeight: "500", marginBottom: 2 },
  detailValue: { fontSize: 14, fontWeight: "600", color: "#0F172A" },

  subSectionTitle: { fontSize: 13, fontWeight: "700", color: "#64748B", marginBottom: 8 },

  docSectionTitle: {
    fontSize: 13, fontWeight: "600", color: "#64748B",
    marginTop: 16, marginBottom: 8, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: "#F1F5F9",
  },
  docUploadItem: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#F8FAFC", padding: 12, borderRadius: 10,
    marginBottom: 8, borderWidth: 1, borderColor: "#E2E8F0",
  },
  docUploadItemUploaded: { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" },
  docUploadIcon: { fontSize: 20, marginRight: 12 },
  docUploadInfo: { flex: 1 },
  docUploadTitle:  { fontSize: 14, fontWeight: "600", color: "#0F172A" },
  docUploadStatus: { fontSize: 12, color: "#64748B", marginTop: 2 },
  statusApproved:  { color: "#16A34A" },
  statusRejected:  { color: "#DC2626" },
  docArrow:        { fontSize: 20, color: "#94A3B8" },

  careerTag: {
    backgroundColor: "#EFF6FF", paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 8, alignSelf: "flex-start", marginBottom: 10,
  },
  careerTagText: { fontSize: 13, fontWeight: "700", color: "#1D4ED8" },
  notSet: { fontSize: 14, color: "#94A3B8" },

  // Modal styles
  modalSectionLabel: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 8, marginTop: 8 },
  pillRow:  { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  pill: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8,
    backgroundColor: "#F1F5F9", borderWidth: 1, borderColor: "#E2E8F0",
  },
  pillWide: { flex: 1, alignItems: "center", paddingVertical: 12 },
  pillActive: { backgroundColor: "#1D4ED8", borderColor: "#1D4ED8" },
  pillText:   { fontSize: 13, fontWeight: "600", color: "#64748B" },
  pillTextActive: { color: "#FFFFFF" },
  saveBtn: { marginTop: 20, marginBottom: 20 },
});

export default StudentDashboard;