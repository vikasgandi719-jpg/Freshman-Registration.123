import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, RefreshControl,
  Platform,
} from "react-native";
import { useAuth }       from "../../context/AuthContext";
import { useStudent }    from "../../context/StudentContext";
import useDocuments      from "../../hooks/useDocuments";
import Modal             from "../../components/common/Modal";
import Input             from "../../components/common/Input";
import Button            from "../../components/common/Button";
import DocumentUploader  from "../../components/student/DocumentUploader";
import { SCREENS }       from "../../constants/config";
import studentService    from "../../services/studentService";

const MEDIUM_OPTIONS = ["English", "Telugu", "Urdu", "Hindi"];

// ─── Small reusable pieces ─────────────────────────────────────────────────────
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

// ─── Main Component ────────────────────────────────────────────────────────────
const StudentDashboard = ({ navigation }) => {
  const { user }                                       = useAuth();
  const { profile, setProfile, documentStats }        = useStudent();
  const { documents, fetchDocuments, uploadDocument } = useDocuments();
  const [refreshing, setRefreshing]                   = useState(false);

  // ── Modal open/close state ─────────────────────────────────────────────
  const [modals, setModals] = useState({
    student: false, school: false, inter: false,
    tenth: false, eapcet: false, jee: false,
    parent: false, general: false, sports: false,
    career: false, docUpload: false,
  });
  const openModal  = (key) => setModals((m) => ({ ...m, [key]: true  }));
  const closeModal = (key) => setModals((m) => ({ ...m, [key]: false }));

  const [editForm,    setEditForm]    = useState({});
  const [saving,      setSaving]      = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    loadProfile();
    if (user?.id) fetchDocuments(user.id);
  }, [user]);

  const loadProfile = async () => {
    try { const data = await studentService.getProfile(); setProfile(data); }
    catch (e) { console.log("Error loading profile:", e); }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    if (user?.id) await fetchDocuments(user.id);
    setRefreshing(false);
  };

  const student     = profile || user || {};
  const pendingDocs = documents.filter((d) => d.status === "not_uploaded" || d.status === "rejected");

  const getGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";
  };

  // ── Generic save ──────────────────────────────────────────────────────────
  const saveSection = async (modalKey) => {
    setSaving(true);
    try {
      await studentService.updateProfile(editForm);
      setProfile({ ...profile, ...editForm });
      closeModal(modalKey);
    } catch (e) { console.log("Save error:", e); }
    finally { setSaving(false); }
  };

  // ── Open edit handlers (populate editForm then open modal) ────────────────
  const open = (key, fields) => { setEditForm(fields); openModal(key); };

  const openStudent = () => open("student", {
    firstName: student.firstName || "", lastName: student.lastName || "",
    email: student.email || "", phone: student.phone || "",
    address: student.address || "",
    hostelType: student.hostelType || null, transportType: student.transportType || "",
  });
  const openSchool = () => open("school", {
    schoolName: student.schoolName || "", schoolMedium: student.schoolMedium || "",
  });
  const openInter  = () => open("inter", {
    interHallTicket: student.interHallTicket || "",
    interPercentage: student.interPercentage || "",
    interMedium:     student.interMedium     || "",
  });
  const openTenth  = () => open("tenth", {
    tenthHallTicket: student.tenthHallTicket || "",
    tenthPercentage: student.tenthPercentage || "",
    tenthMedium:     student.tenthMedium     || "",
  });
  const openEapcet = () => open("eapcet", {
    eapcetHallTicket: student.eapcetHallTicket || "",
    eapcetRank:       student.eapcetRank       || "",
  });
  const openJee    = () => open("jee", {
    jeeHallTicket: student.jeeHallTicket || "",
    jeeRank:       student.jeeRank       || "",
    jeePercentile: student.jeePercentile || "",
  });
  const openParent = () => open("parent", {
    fatherName: student.fatherName || "", fatherPhone: student.fatherPhone || "",
    fatherProfession: student.fatherProfession || "",
    motherName: student.motherName || "", motherPhone: student.motherPhone || "",
    motherProfession: student.motherProfession || "",
  });
  const openGeneral = () => open("general", {
    hobbies: student.hobbies || "", skillsValues: student.skillsValues || "",
    goalsShortTerm: student.goalsShortTerm || "", goalsLongTerm: student.goalsLongTerm || "",
  });
  const openSports = () => open("sports", {
    sportName: student.sportName || "", sportRole: student.sportRole || "",
    tournamentWon: student.tournamentWon || "", sportPosition: student.sportPosition || "",
  });
  const openCareer = () => open("career", {
    careerInterest:             student.careerInterest             || "placement",
    placementDomain:            student.placementDomain            || "",
    higherStudiesCountry:       student.higherStudiesCountry       || "india",
    higherStudiesCountryDetail: student.higherStudiesCountryDetail || "",
    higherStudiesDegree:        student.higherStudiesDegree        || "",
    higherStudiesSector:        student.higherStudiesSector        || "",
  });

  // ── Document helpers ──────────────────────────────────────────────────────
  const getDocStatus  = (id) => documents.find((d) => d.id === id)?.status  || "not_uploaded";
  const getDocFileUri = (id) => documents.find((d) => d.id === id)?.fileUri || null;

  const handleDocPress = (docId, docTitle) => {
    setSelectedDoc(documents.find((d) => d.id === docId) || { id: docId, title: docTitle });
    openModal("docUpload");
  };

  const handleUploadSuccess = async (file) => {
    if (selectedDoc) {
      const formData = new FormData();
      if (Platform.OS === "web") {
        if (file.file instanceof File) {
          formData.append("file", file.file);
        } else if (file?.uri) {
          const response = await fetch(file.uri);
          const blob = await response.blob();
          const webFile = new File(
            [blob],
            file.name || "document",
            { type: file.mimeType || blob.type || "application/octet-stream" }
          );
          formData.append("file", webFile);
        } else {
          throw new Error("Invalid file object for web upload.");
        }
      } else {
        formData.append("file", {
          uri: file.uri,
          name: file.name || "document.pdf",
          type: file.mimeType || "application/octet-stream",
        });
      }
      const result = await uploadDocument(selectedDoc.id, formData);
      if (!result?.success) {
        throw new Error(result?.error || "Upload failed.");
      }
      if (user?.id) fetchDocuments(user.id);
    }
    closeModal("docUpload"); setSelectedDoc(null);
  };

  const DocRow = ({ docId, title }) => {
    const status     = getDocStatus(docId);
    const isUploaded = status === "pending" || status === "approved";
    const icon  = { approved: "✅", pending: "⏳", rejected: "❌", not_uploaded: "📄" }[status] || "📄";
    const label = { approved: "Approved", pending: "Under Review", rejected: "Rejected — re-upload", not_uploaded: "Tap to upload" }[status];
    return (
      <TouchableOpacity
        style={[styles.docRow, isUploaded && styles.docRowUploaded]}
        onPress={() => handleDocPress(docId, title)}
      >
        <Text style={styles.docRowIcon}>{icon}</Text>
        <View style={styles.docRowInfo}>
          <Text style={styles.docRowTitle}>{title}</Text>
          <Text style={[styles.docRowStatus,
            status === "approved" && styles.statusGreen,
            status === "rejected" && styles.statusRed,
          ]}>{label}</Text>
        </View>
        <Text style={styles.docArrow}>›</Text>
      </TouchableOpacity>
    );
  };

  // ── Card helpers ──────────────────────────────────────────────────────────
  const CardHeader = ({ title, onEdit }) => (
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      {onEdit && <TouchableOpacity onPress={onEdit}><Text style={styles.editLink}>Edit</Text></TouchableOpacity>}
    </View>
  );

  const DocSection = ({ title }) => <Text style={styles.docSectionTitle}>{title}</Text>;

  // ── Medium pills (for edit modals) ────────────────────────────────────────
  const MediumPills = ({ field }) => (
    <>
      <Text style={styles.modalLabel}>Medium of Instruction</Text>
      <View style={styles.pillRow}>
        {MEDIUM_OPTIONS.map((opt) => (
          <TouchableOpacity key={opt}
            style={[styles.pill, editForm[field] === opt && styles.pillActive]}
            onPress={() => setEditForm({ ...editForm, [field]: opt })}>
            <Text style={[styles.pillText, editForm[field] === opt && styles.pillTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const SaveBtn = ({ modalKey }) => (
    <Button title={saving ? "Saving..." : "Save Changes"} onPress={() => saveSection(modalKey)} disabled={saving} style={styles.saveBtn} />
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1D4ED8"]} />}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.studentName} numberOfLines={1}>
              {student.firstName || student.name || "Student"}
            </Text>
            <Text style={styles.rollNumber}>{student.uniqueId || ""}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate(SCREENS.PROFILE)}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(student.firstName || student.name || "S").charAt(0).toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Document Stats ───────────────────────────────────────────────── */}
        <View style={styles.statsCard}>
          <View style={styles.statsCardHeader}>
            <Text style={styles.statsCardTitle}>📚 My Documents</Text>
            <TouchableOpacity onPress={() => navigation.navigate(SCREENS.DOCUMENT_UPLOAD)}>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsRow}>
            {[
              { label: "Total",    value: documentStats.total,    color: "#1D4ED8" },
              { label: "Approved", value: documentStats.approved, color: "#15803D" },
              { label: "Pending",  value: documentStats.pending,  color: "#C2410C" },
              { label: "Rejected", value: documentStats.rejected, color: "#BE123C" },
            ].map((s) => (
              <View key={s.label} style={[styles.statChip, { borderColor: s.color }]}>
                <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Action Required ──────────────────────────────────────────────── */}
        {pendingDocs.length > 0 && (
          <View style={styles.attentionBox}>
            <Text style={styles.attentionTitle}>⚠️ Action Required</Text>
            {pendingDocs.slice(0, 4).map((doc) => (
              <TouchableOpacity key={doc.id} style={styles.attentionCard}
                onPress={() => navigation.navigate(SCREENS.DOCUMENT_DETAIL, { document: doc })}>
                <Text style={styles.attentionIcon}>{doc.status === "rejected" ? "❌" : "📤"}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.attentionDocTitle}>{doc.title}</Text>
                  <Text style={styles.attentionDocStatus}>{doc.status === "rejected" ? "Rejected — Re-upload" : "Not uploaded yet"}</Text>
                </View>
                <Text style={styles.attentionArrow}>›</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigation.navigate(SCREENS.DOCUMENT_UPLOAD)}>
              <Text style={styles.viewAllBtnText}>View All Documents →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Student Details ──────────────────────────────────────────────── */}
        <View style={styles.card}>
          <CardHeader title="👤 Student Details" onEdit={openStudent} />
          <View style={styles.grid}>
            <DetailRow label="First Name" value={student.firstName} />
            <DetailRow label="Last Name"  value={student.lastName}  />
            <DetailRow label="Email"      value={student.email}     />
            <DetailRow label="Phone"      value={student.phone}     />
            <DetailRow label="Stay Type"
              value={student.hostelType === "hostel" ? "🏠 Hostel"
                : student.hostelType === "dayscholar" ? `🚏 ${student.transportType || "Day Scholar"}` : undefined} />
          </View>
          <DetailRowFull label="Address" value={student.address} />
          <DocSection title="Documents" />
          <DocRow docId="passport_photo" title="Passport Size Photo" />
          <DocRow docId="aadhar_card"    title="Aadhaar Card"        />
        </View>

        {/* ── Schooling ────────────────────────────────────────────────────── */}
        <View style={styles.card}>
          <CardHeader title="🏫 Schooling" />

          {/* School sub-section */}
          <View style={styles.subSection}>
            <View style={styles.subSectionHeader}>
              <Text style={styles.subSectionTitle}>School</Text>
              <TouchableOpacity onPress={openSchool}><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
            </View>
            <View style={styles.grid}>
              <DetailRow label="School Name" value={student.schoolName}   />
              <DetailRow label="Medium"      value={student.schoolMedium} />
            </View>
            <DocSection title="Upload Certificates" />
            <DocRow docId="school_memo"     title="School Memo"              />
            <DocRow docId="school_bonafide" title="School Bonafide Certificate" />
          </View>

          {/* Intermediate sub-section */}
          <View style={[styles.subSection, { marginTop: 16 }]}>
            <View style={styles.subSectionHeader}>
              <Text style={styles.subSectionTitle}>Intermediate</Text>
              <TouchableOpacity onPress={openInter}><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
            </View>
            <View style={styles.grid}>
              <DetailRow label="Hall Ticket No." value={student.interHallTicket} />
              <DetailRow label="Percentage"      value={student.interPercentage ? `${student.interPercentage}%` : undefined} />
              <DetailRow label="Medium"          value={student.interMedium}     />
            </View>
            <DocSection title="Upload Certificates" />
            <DocRow docId="inter_hall_ticket" title="Inter Hall Ticket"          />
            <DocRow docId="inter_memo"        title="Inter Memo"                 />
            <DocRow docId="inter_bonafide"    title="Inter Bonafide Certificate" />
          </View>
        </View>

        {/* ── 10th Documentation ───────────────────────────────────────────── */}
        <View style={styles.card}>
          <CardHeader title="📄 10th Documentation" onEdit={openTenth} />
          <View style={styles.grid}>
            <DetailRow label="Hall Ticket No." value={student.tenthHallTicket} />
            <DetailRow label="Percentage" value={student.tenthPercentage ? `${student.tenthPercentage}%` : undefined} />
            <DetailRow label="Medium"     value={student.tenthMedium} />
          </View>
          <DocSection title="Upload Certificates" />
          <DocRow docId="tenth_hall_ticket" title="10th Hall Ticket"          />
          <DocRow docId="tenth_memo"        title="10th Memo"                 />
          <DocRow docId="tenth_bonafide"    title="10th Bonafide Certificate" />
        </View>

        {/* ── EAPCET ───────────────────────────────────────────────────────── */}
        <View style={styles.card}>
          <CardHeader title="📝 EAPCET" onEdit={openEapcet} />
          <View style={styles.grid}>
            <DetailRow label="Hall Ticket No." value={student.eapcetHallTicket} />
            <DetailRow label="Rank"            value={student.eapcetRank}       />
          </View>
          <DocSection title="Documents Upload" />
          <DocRow docId="eapcet_hall_ticket" title="EAPCET Hall Ticket" />
          <DocRow docId="eapcet_rank_card"   title="EAPCET Rank Card"  />
        </View>

        {/* ── JEE Mains ────────────────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🎓 JEE Mains</Text>
            <View style={styles.cardHeaderRight}>
              <View style={styles.optionalTag}><Text style={styles.optionalTagText}>Optional</Text></View>
              <TouchableOpacity onPress={openJee}><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
            </View>
          </View>
          <View style={styles.grid}>
            <DetailRow label="Hall Ticket No." value={student.jeeHallTicket} />
            <DetailRow label="Rank"            value={student.jeeRank}       />
            <DetailRow label="Percentile"      value={student.jeePercentile} />
          </View>
          <DocSection title="Documents Upload" />
          <DocRow docId="jee_hall_ticket" title="JEE Mains Hall Ticket" />
          <DocRow docId="jee_rank_card"   title="JEE Mains Rank Card"  />
        </View>

        {/* ── Parent Details ───────────────────────────────────────────────── */}
        <View style={styles.card}>
          <CardHeader title="👨‍👩‍👦 Parent Details" onEdit={openParent} />
          <View style={styles.grid}>
            <DetailRow label="Father's Name"       value={student.fatherName}       />
            <DetailRow label="Father's Phone"      value={student.fatherPhone}      />
            <DetailRow label="Father's Profession" value={student.fatherProfession} />
            <DetailRow label="Mother's Name"       value={student.motherName}       />
            <DetailRow label="Mother's Phone"      value={student.motherPhone}      />
            <DetailRow label="Mother's Profession" value={student.motherProfession} />
          </View>
        </View>

        {/* ── Other Documents ──────────────────────────────────────────────── */}
        <View style={styles.card}>
          <CardHeader title="📂 Other Documents" />
          <DocRow docId="caste_certificate"  title="Caste Certificate"  />
          <DocRow docId="income_certificate" title="Income Certificate" />
        </View>

        {/* ── General Info ─────────────────────────────────────────────────── */}
        <View style={styles.card}>
          <CardHeader title="💡 General Info" />

          {/* Student Interest */}
          <View style={styles.subSection}>
            <View style={styles.subSectionHeader}>
              <Text style={styles.subSectionTitle}>Student Interest</Text>
              <TouchableOpacity onPress={openGeneral}><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
            </View>
            <DetailRowFull label="Hobbies"          value={student.hobbies}        />
            <DetailRowFull label="Skills & Values"  value={student.skillsValues}   />
            <DetailRowFull label="Short-term Goals" value={student.goalsShortTerm} />
            <DetailRowFull label="Long-term Goals"  value={student.goalsLongTerm}  />
          </View>

          {/* Sports */}
          <View style={[styles.subSection, { marginTop: 16 }]}>
            <View style={styles.subSectionHeader}>
              <Text style={styles.subSectionTitle}>Sports (Professional)</Text>
              <TouchableOpacity onPress={openSports}><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
            </View>
            <View style={styles.grid}>
              <DetailRow label="Sport Name"     value={student.sportName}     />
              <DetailRow label="Role in Sports" value={student.sportRole}     />
              <DetailRow label="Position"       value={student.sportPosition} />
            </View>
            <DetailRowFull label="Tournaments Won" value={student.tournamentWon} />
          </View>
        </View>

        {/* ── Career Interest ───────────────────────────────────────────────── */}
        <View style={styles.card}>
          <CardHeader title="💼 Career Interest" onEdit={openCareer} />
          {student.careerInterest === "higher_education" ? (
            <>
              <View style={styles.careerTag}>
                <Text style={styles.careerTagText}>🎓 Higher Education</Text>
              </View>
              <View style={styles.grid}>
                <DetailRow label="Location"
                  value={student.higherStudiesCountry === "abroad"
                    ? `🌍 Abroad — ${student.higherStudiesCountryDetail || ""}`
                    : "🇮🇳 India"} />
                <DetailRow label="Degree Aspired" value={student.higherStudiesDegree} />
                <DetailRow label="Sector"         value={student.higherStudiesSector} />
              </View>
            </>
          ) : student.careerInterest === "placement" ? (
            <>
              <View style={[styles.careerTag, { backgroundColor: "#EFF6FF" }]}>
                <Text style={[styles.careerTagText, { color: "#1D4ED8" }]}>🏢 Placements</Text>
              </View>
              <DetailRowFull label="Domain of Interest" value={student.placementDomain} />
            </>
          ) : (
            <Text style={styles.notSet}>Not updated yet</Text>
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ═══════════════════════ EDIT MODALS ═══════════════════════════════ */}

      {/* Student */}
      <Modal visible={modals.student} onClose={() => closeModal("student")} title="Edit Student Details" size="lg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input label="First Name" value={editForm.firstName} onChangeText={(t) => setEditForm({ ...editForm, firstName: t })} placeholder="First name" />
          <Input label="Last Name"  value={editForm.lastName}  onChangeText={(t) => setEditForm({ ...editForm, lastName: t })}  placeholder="Last name" />
          <Input label="Email"      value={editForm.email}     onChangeText={(t) => setEditForm({ ...editForm, email: t })}     placeholder="Email" keyboardType="email-address" />
          <Input label="Phone"      value={editForm.phone}     onChangeText={(t) => setEditForm({ ...editForm, phone: t })}     placeholder="Phone" keyboardType="phone-pad" />
          <Input label="Address"    value={editForm.address}   onChangeText={(t) => setEditForm({ ...editForm, address: t })}   placeholder="Address" multiline />
          <Text style={styles.modalLabel}>Stay Type</Text>
          <View style={styles.pillRow}>
            {[{ val: "hostel", label: "🏠 Hostel" }, { val: "dayscholar", label: "🚏 Day Scholar" }].map((o) => (
              <TouchableOpacity key={o.val} style={[styles.pill, styles.pillFlex, editForm.hostelType === o.val && styles.pillActive]} onPress={() => setEditForm({ ...editForm, hostelType: o.val })}>
                <Text style={[styles.pillText, editForm.hostelType === o.val && styles.pillTextActive]}>{o.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {editForm.hostelType === "dayscholar" && (
            <>
              <Text style={styles.modalLabel}>Transport</Text>
              <View style={styles.pillRow}>
                {[{ val: "college-bus", label: "College Bus" }, { val: "rtc", label: "RTC" }].map((o) => (
                  <TouchableOpacity key={o.val} style={[styles.pill, styles.pillFlex, editForm.transportType === o.val && styles.pillActive]} onPress={() => setEditForm({ ...editForm, transportType: o.val })}>
                    <Text style={[styles.pillText, editForm.transportType === o.val && styles.pillTextActive]}>{o.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
          <SaveBtn modalKey="student" />
        </ScrollView>
      </Modal>

      {/* School */}
      <Modal visible={modals.school} onClose={() => closeModal("school")} title="Edit School Details" size="lg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input label="School Name" value={editForm.schoolName} onChangeText={(t) => setEditForm({ ...editForm, schoolName: t })} placeholder="e.g. Narayana High School" />
          <MediumPills field="schoolMedium" />
          <SaveBtn modalKey="school" />
        </ScrollView>
      </Modal>

      {/* Intermediate */}
      <Modal visible={modals.inter} onClose={() => closeModal("inter")} title="Edit Intermediate Details" size="lg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input label="Hall Ticket No." value={editForm.interHallTicket} onChangeText={(t) => setEditForm({ ...editForm, interHallTicket: t.toUpperCase() })} placeholder="e.g. IHT2024XXXXX" autoCapitalize="characters" />
          <Input label="Percentage (%)"  value={editForm.interPercentage} onChangeText={(t) => setEditForm({ ...editForm, interPercentage: t })}               placeholder="e.g. 96.0" keyboardType="numeric" />
          <MediumPills field="interMedium" />
          <SaveBtn modalKey="inter" />
        </ScrollView>
      </Modal>

      {/* 10th */}
      <Modal visible={modals.tenth} onClose={() => closeModal("tenth")} title="Edit 10th Details" size="lg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input label="10th Hall Ticket Number" value={editForm.tenthHallTicket} onChangeText={(t) => setEditForm({ ...editForm, tenthHallTicket: t.toUpperCase() })} placeholder="e.g. AP12345678" autoCapitalize="characters" />
          <Input label="Percentage (%)" value={editForm.tenthPercentage} onChangeText={(t) => setEditForm({ ...editForm, tenthPercentage: t })} placeholder="e.g. 95.5" keyboardType="numeric" />
          <MediumPills field="tenthMedium" />
          <SaveBtn modalKey="tenth" />
        </ScrollView>
      </Modal>

      {/* EAPCET */}
      <Modal visible={modals.eapcet} onClose={() => closeModal("eapcet")} title="Edit EAPCET Details" size="lg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input label="Hall Ticket No." value={editForm.eapcetHallTicket} onChangeText={(t) => setEditForm({ ...editForm, eapcetHallTicket: t.toUpperCase() })} placeholder="e.g. EAPCET2024XXXXX" autoCapitalize="characters" />
          <Input label="Rank"            value={editForm.eapcetRank}        onChangeText={(t) => setEditForm({ ...editForm, eapcetRank: t })}                    placeholder="e.g. 12345" keyboardType="numeric" />
          <SaveBtn modalKey="eapcet" />
        </ScrollView>
      </Modal>

      {/* JEE Mains */}
      <Modal visible={modals.jee} onClose={() => closeModal("jee")} title="Edit JEE Mains Details" size="lg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input label="Hall Ticket No." value={editForm.jeeHallTicket} onChangeText={(t) => setEditForm({ ...editForm, jeeHallTicket: t.toUpperCase() })} placeholder="e.g. JEEMAINS2024XXXX" autoCapitalize="characters" />
          <Input label="Rank"            value={editForm.jeeRank}        onChangeText={(t) => setEditForm({ ...editForm, jeeRank: t })}                    placeholder="e.g. 45000" keyboardType="numeric" />
          <Input label="Percentile"      value={editForm.jeePercentile}  onChangeText={(t) => setEditForm({ ...editForm, jeePercentile: t })}              placeholder="e.g. 87.50" keyboardType="numeric" />
          <SaveBtn modalKey="jee" />
        </ScrollView>
      </Modal>

      {/* Parent */}
      <Modal visible={modals.parent} onClose={() => closeModal("parent")} title="Edit Parent Details" size="lg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input label="Father's Name"       value={editForm.fatherName}       onChangeText={(t) => setEditForm({ ...editForm, fatherName: t })}       placeholder="Father's name" />
          <Input label="Father's Phone"      value={editForm.fatherPhone}      onChangeText={(t) => setEditForm({ ...editForm, fatherPhone: t })}      placeholder="Father's phone" keyboardType="phone-pad" />
          <Input label="Father's Profession" value={editForm.fatherProfession} onChangeText={(t) => setEditForm({ ...editForm, fatherProfession: t })} placeholder="e.g. Farmer, Teacher" />
          <Input label="Mother's Name"       value={editForm.motherName}       onChangeText={(t) => setEditForm({ ...editForm, motherName: t })}       placeholder="Mother's name" />
          <Input label="Mother's Phone"      value={editForm.motherPhone}      onChangeText={(t) => setEditForm({ ...editForm, motherPhone: t })}      placeholder="Mother's phone" keyboardType="phone-pad" />
          <Input label="Mother's Profession" value={editForm.motherProfession} onChangeText={(t) => setEditForm({ ...editForm, motherProfession: t })} placeholder="e.g. Housewife, Teacher" />
          <SaveBtn modalKey="parent" />
        </ScrollView>
      </Modal>

      {/* General Info */}
      <Modal visible={modals.general} onClose={() => closeModal("general")} title="Student Interest" size="lg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input label="Hobbies"          value={editForm.hobbies}        onChangeText={(t) => setEditForm({ ...editForm, hobbies: t })}        placeholder="e.g. Reading, Gaming" multiline />
          <Input label="Skills & Values"  value={editForm.skillsValues}   onChangeText={(t) => setEditForm({ ...editForm, skillsValues: t })}   placeholder="e.g. Leadership, Coding" multiline />
          <Input label="Short-term Goals" value={editForm.goalsShortTerm} onChangeText={(t) => setEditForm({ ...editForm, goalsShortTerm: t })} placeholder="e.g. Get an internship" multiline />
          <Input label="Long-term Goals"  value={editForm.goalsLongTerm}  onChangeText={(t) => setEditForm({ ...editForm, goalsLongTerm: t })}  placeholder="e.g. Become a software engineer" multiline />
          <SaveBtn modalKey="general" />
        </ScrollView>
      </Modal>

      {/* Sports */}
      <Modal visible={modals.sports} onClose={() => closeModal("sports")} title="Sports Details" size="lg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input label="Sport Name"      value={editForm.sportName}     onChangeText={(t) => setEditForm({ ...editForm, sportName: t })}     placeholder="e.g. Cricket, Kabaddi" />
          <Input label="Role in Sports"  value={editForm.sportRole}     onChangeText={(t) => setEditForm({ ...editForm, sportRole: t })}     placeholder="e.g. Captain, Player" />
          <Input label="Tournaments Won" value={editForm.tournamentWon} onChangeText={(t) => setEditForm({ ...editForm, tournamentWon: t })} placeholder="e.g. District Level 2023" multiline />
          <Input label="Position"        value={editForm.sportPosition} onChangeText={(t) => setEditForm({ ...editForm, sportPosition: t })} placeholder="e.g. 1st, 2nd, 3rd" />
          <SaveBtn modalKey="sports" />
        </ScrollView>
      </Modal>

      {/* Career Interest */}
      <Modal visible={modals.career} onClose={() => closeModal("career")} title="Career Interest" size="lg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.modalLabel}>I am interested in</Text>
          <View style={styles.pillRow}>
            {[{ val: "placement", label: "🏢 Placements" }, { val: "higher_education", label: "🎓 Higher Education" }].map((o) => (
              <TouchableOpacity key={o.val} style={[styles.pill, styles.pillFlex, editForm.careerInterest === o.val && styles.pillActive]} onPress={() => setEditForm({ ...editForm, careerInterest: o.val })}>
                <Text style={[styles.pillText, editForm.careerInterest === o.val && styles.pillTextActive]}>{o.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {editForm.careerInterest === "placement" && (
            <Input label="Domain of Interest" value={editForm.placementDomain} onChangeText={(t) => setEditForm({ ...editForm, placementDomain: t })} placeholder="e.g. Software, Data Science, Core" />
          )}
          {editForm.careerInterest === "higher_education" && (
            <>
              <Text style={styles.modalLabel}>Location</Text>
              <View style={styles.pillRow}>
                {[{ val: "india", label: "🇮🇳 India" }, { val: "abroad", label: "🌍 Abroad" }].map((o) => (
                  <TouchableOpacity key={o.val} style={[styles.pill, styles.pillFlex, editForm.higherStudiesCountry === o.val && styles.pillActive]} onPress={() => setEditForm({ ...editForm, higherStudiesCountry: o.val })}>
                    <Text style={[styles.pillText, editForm.higherStudiesCountry === o.val && styles.pillTextActive]}>{o.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {editForm.higherStudiesCountry === "abroad" && (
                <Input label="Which Country?" value={editForm.higherStudiesCountryDetail} onChangeText={(t) => setEditForm({ ...editForm, higherStudiesCountryDetail: t })} placeholder="e.g. USA, UK, Germany" />
              )}
              <Input label="Degree Aspired" value={editForm.higherStudiesDegree} onChangeText={(t) => setEditForm({ ...editForm, higherStudiesDegree: t })} placeholder="e.g. MTech, MBA, MS" />
              <Input label="Sector"         value={editForm.higherStudiesSector} onChangeText={(t) => setEditForm({ ...editForm, higherStudiesSector: t })} placeholder="e.g. AI, Finance, Management" />
            </>
          )}
          <SaveBtn modalKey="career" />
        </ScrollView>
      </Modal>

      {/* Document Upload */}
      <Modal
        visible={modals.docUpload}
        onClose={() => { closeModal("docUpload"); setSelectedDoc(null); }}
        title={selectedDoc?.title || "Upload Document"}
        subtitle="Select a file from your device"
        icon="📤" size="md"
      >
        {selectedDoc && (
          <DocumentUploader
            documentTitle={selectedDoc.title}
            documentId={selectedDoc.id}
            existingFileUri={getDocFileUri(selectedDoc.id)}
            onUploadSuccess={handleUploadSuccess}
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

  // Header
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, backgroundColor: "#FFFFFF" },
  headerLeft: { flex: 1, marginRight: 12 },
  greeting:    { fontSize: 13, color: "#94A3B8", fontWeight: "500" },
  studentName: { fontSize: 22, fontWeight: "800", color: "#0F172A", marginTop: 2 },
  rollNumber:  { fontSize: 12, color: "#64748B", marginTop: 2 },
  avatar:      { width: 48, height: 48, borderRadius: 24, backgroundColor: "#DBEAFE", justifyContent: "center", alignItems: "center" },
  avatarText:  { fontSize: 16, fontWeight: "800", color: "#1D4ED8" },

  // Stats card
  statsCard: { marginHorizontal: 16, marginTop: 16, backgroundColor: "#FFFFFF", borderRadius: 14, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statsCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  statsCardTitle:  { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  viewAllLink:     { fontSize: 14, color: "#1D4ED8", fontWeight: "600" },
  statsRow:        { flexDirection: "row", gap: 8 },
  statChip:        { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, backgroundColor: "#FFFFFF" },
  statValue:       { fontSize: 20, fontWeight: "800" },
  statLabel:       { fontSize: 10, color: "#64748B", marginTop: 2, fontWeight: "500" },

  // Attention
  attentionBox:      { marginTop: 16, marginHorizontal: 16 },
  attentionTitle:    { fontSize: 16, fontWeight: "700", color: "#0F172A", marginBottom: 10 },
  attentionCard:     { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFBEB", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#FDE68A", gap: 12, marginBottom: 8 },
  attentionIcon:     { fontSize: 24 },
  attentionDocTitle: { fontSize: 14, fontWeight: "600", color: "#1E293B" },
  attentionDocStatus:{ fontSize: 12, color: "#92400E", marginTop: 2 },
  attentionArrow:    { fontSize: 22, color: "#CBD5E1" },
  viewAllBtn:        { alignItems: "center", marginTop: 8, paddingVertical: 8 },
  viewAllBtnText:    { color: "#1D4ED8", fontWeight: "600", fontSize: 14 },

  // Card
  card: { marginHorizontal: 16, marginTop: 16, backgroundColor: "#FFFFFF", borderRadius: 14, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  cardHeaderRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  cardTitle:       { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  editLink:        { fontSize: 14, color: "#1D4ED8", fontWeight: "600" },

  // Sub-section (inside card)
  subSection: { borderTopWidth: 1, borderTopColor: "#F1F5F9", paddingTop: 12 },
  subSectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  subSectionTitle:  { fontSize: 14, fontWeight: "700", color: "#334155" },

  // Details grid
  grid:           { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  detailItem:     { width: "47%" },
  detailItemFull: { width: "100%", marginTop: 8 },
  detailLabel:    { fontSize: 11, color: "#94A3B8", fontWeight: "500", marginBottom: 2 },
  detailValue:    { fontSize: 14, fontWeight: "600", color: "#0F172A" },

  // Doc section title
  docSectionTitle: { fontSize: 13, fontWeight: "600", color: "#64748B", marginTop: 14, marginBottom: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#F1F5F9" },

  // Doc row
  docRow:         { flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC", padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: "#E2E8F0" },
  docRowUploaded: { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" },
  docRowIcon:     { fontSize: 20, marginRight: 12 },
  docRowInfo:     { flex: 1 },
  docRowTitle:    { fontSize: 14, fontWeight: "600", color: "#0F172A" },
  docRowStatus:   { fontSize: 12, color: "#64748B", marginTop: 2 },
  statusGreen:    { color: "#16A34A" },
  statusRed:      { color: "#DC2626" },
  docArrow:       { fontSize: 20, color: "#94A3B8" },

  // Optional tag
  optionalTag:     { backgroundColor: "#F0FDF4", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  optionalTagText: { fontSize: 10, fontWeight: "700", color: "#16A34A" },

  // Career tag
  careerTag:     { backgroundColor: "#F0FDF4", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, alignSelf: "flex-start", marginBottom: 10 },
  careerTagText: { fontSize: 13, fontWeight: "700", color: "#16A34A" },
  notSet:        { fontSize: 14, color: "#94A3B8" },

  // Modal styles
  modalLabel: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 8, marginTop: 8 },
  pillRow:    { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  pill: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, backgroundColor: "#F1F5F9", borderWidth: 1, borderColor: "#E2E8F0" },
  pillFlex:       { flex: 1, alignItems: "center", paddingVertical: 12 },
  pillActive:     { backgroundColor: "#1D4ED8", borderColor: "#1D4ED8" },
  pillText:       { fontSize: 13, fontWeight: "600", color: "#64748B" },
  pillTextActive: { color: "#FFFFFF" },
  saveBtn:        { marginTop: 20, marginBottom: 20 },
});

export default StudentDashboard;