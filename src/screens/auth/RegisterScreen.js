import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from "react-native";
import Input      from "../../components/common/Input";
import DatePicker from "../../components/auth/DatePicker";
import { SCREENS } from "../../constants/config";
import useAuthHook  from "../../hooks/useAuth";
import { useAuth }  from "../../context/AuthContext";

// ─── Constants ─────────────────────────────────────────────────────────────────
const MEDIUM_OPTIONS = ["English", "Telugu", "Urdu", "Hindi"];

const STEPS = [
  { id: 1, title: "Basic Info",        icon: "👤" },
  { id: 2, title: "Schooling",         icon: "🏫" },
  { id: 3, title: "10th Details",      icon: "📄" },
  { id: 4, title: "EAPCET Details",    icon: "📝" },
  { id: 5, title: "JEE Mains",         icon: "🎓" },
  { id: 6, title: "General Info",      icon: "💡" },
];

// ─── Component ─────────────────────────────────────────────────────────────────
const RegisterScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    // Step 1
    name: "",
    parentPhone: "",
    dob: null,

    // Step 2 — Schooling (School + Intermediate)
    schoolName:       "",
    schoolMedium:     "",
    interHallTicket:  "",
    interPercentage:  "",
    interMedium:      "",

    // Step 3 — 10th Documentation
    tenthHallTicket: "",
    tenthPercentage: "",
    tenthMedium:     "",

    // Step 4 — EAPCET
    eapcetHallTicket: "",
    eapcetRank:       "",

    // Step 5 — JEE Mains (optional)
    jeeHallTicket: "",
    jeeRank:        "",
    jeePercentile:  "",

    // Step 6 — General Info
    hobbies:                    "",
    skillsValues:               "",
    goalsShortTerm:             "",
    goalsLongTerm:              "",
    sportName:                  "",
    sportRole:                  "",
    tournamentWon:              "",
    sportPosition:              "",
    careerInterest:             "placement",
    placementDomain:            "",
    higherStudiesCountry:       "india",
    higherStudiesCountryDetail: "",
    higherStudiesDegree:        "",
    higherStudiesSector:        "",
  });

  const [errors, setErrors]         = useState({});
  const { register, isSubmitting }  = useAuthHook();
  const { error: authError, clearError } = useAuth();

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  // ── Validation per step ───────────────────────────────────────────────────
  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!form.name?.trim())        e.name        = "Student name is required.";
      if (!form.parentPhone?.trim()) e.parentPhone = "Parent's phone is required.";
      else if (!/^[6-9]\d{9}$/.test(form.parentPhone))
        e.parentPhone = "Enter a valid 10-digit number.";
      if (!form.dob)                 e.dob         = "Date of birth is required.";
    }
    if (step === 2) {
      if (!form.schoolName?.trim())      e.schoolName      = "School name is required.";
      if (!form.schoolMedium)            e.schoolMedium    = "Please select medium.";
      if (!form.interHallTicket?.trim()) e.interHallTicket = "Hall ticket is required.";
      if (!form.interPercentage?.trim()) e.interPercentage = "Percentage is required.";
      else if (isNaN(form.interPercentage) || +form.interPercentage < 0 || +form.interPercentage > 100)
        e.interPercentage = "Enter a valid percentage (0–100).";
      if (!form.interMedium) e.interMedium = "Please select medium.";
    }
    if (step === 3) {
      if (!form.tenthHallTicket?.trim()) e.tenthHallTicket = "Hall ticket number is required.";
      if (!form.tenthPercentage?.trim()) e.tenthPercentage = "Percentage is required.";
      else if (isNaN(form.tenthPercentage) || +form.tenthPercentage < 0 || +form.tenthPercentage > 100)
        e.tenthPercentage = "Enter a valid percentage (0–100).";
      if (!form.tenthMedium) e.tenthMedium = "Please select medium.";
    }
    if (step === 4) {
      if (!form.eapcetHallTicket?.trim()) e.eapcetHallTicket = "Hall ticket is required.";
      if (!form.eapcetRank?.trim())       e.eapcetRank       = "Rank is required.";
    }
    // Step 5 (JEE) is optional — no required validation
    // Step 6 — no required validation
    return e;
  };

  const handleNext = () => {
    const e = validateStep();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const formatDOB = (dob) => {
    if (!dob) return "";
    return `${String(dob.getDate()).padStart(2,"0")}/${String(dob.getMonth()+1).padStart(2,"0")}/${dob.getFullYear()}`;
  };

  const handleRegister = async () => {
    const e = validateStep();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    clearError();
    setErrors({});

    const dobFormatted = form.dob
      ? `${String(form.dob.getDate()).padStart(2,"0")}${String(form.dob.getMonth()+1).padStart(2,"0")}${form.dob.getFullYear()}`
      : "";

    const result = await register({
      name: form.name.trim(), parentPhone: form.parentPhone.trim(),
      dob: form.dob, password: dobFormatted,

      schoolName:   form.schoolName.trim(),
      schoolMedium: form.schoolMedium,

      interHallTicket: form.interHallTicket.trim().toUpperCase(),
      interPercentage: form.interPercentage.trim(),
      interMedium:     form.interMedium,

      tenthHallTicket: form.tenthHallTicket.trim().toUpperCase(),
      tenthPercentage: form.tenthPercentage.trim(),
      tenthMedium:     form.tenthMedium,

      eapcetHallTicket: form.eapcetHallTicket.trim().toUpperCase(),
      eapcetRank:       form.eapcetRank.trim(),

      jeeHallTicket: form.jeeHallTicket.trim().toUpperCase(),
      jeeRank:       form.jeeRank.trim(),
      jeePercentile: form.jeePercentile.trim(),

      hobbies:                    form.hobbies.trim(),
      skillsValues:               form.skillsValues.trim(),
      goalsShortTerm:             form.goalsShortTerm.trim(),
      goalsLongTerm:              form.goalsLongTerm.trim(),
      sportName:                  form.sportName.trim(),
      sportRole:                  form.sportRole.trim(),
      tournamentWon:              form.tournamentWon.trim(),
      sportPosition:              form.sportPosition.trim(),
      careerInterest:             form.careerInterest,
      placementDomain:            form.placementDomain.trim(),
      higherStudiesCountry:       form.higherStudiesCountry,
      higherStudiesCountryDetail: form.higherStudiesCountryDetail.trim(),
      higherStudiesDegree:        form.higherStudiesDegree.trim(),
      higherStudiesSector:        form.higherStudiesSector.trim(),
    });

    if (result.success) {
      navigation.replace(SCREENS.REGISTRATION_SUCCESS, {
        uniqueId: result.data?.uniqueId || "2026-BVRITN-1a-0001",
        password: dobFormatted,
        name: form.name.trim(),
      });
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };

  // ── Sub-components ────────────────────────────────────────────────────────
  const MediumPills = ({ field, error }) => (
    <View style={styles.pillBlock}>
      <Text style={styles.fieldLabel}>Medium of Instruction *</Text>
      <View style={styles.pillRow}>
        {MEDIUM_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.pill, form[field] === opt && styles.pillActive]}
            onPress={() => setField(field, opt)}
          >
            <Text style={[styles.pillText, form[field] === opt && styles.pillTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={styles.fieldError}>{error}</Text>}
    </View>
  );

  const SectionBanner = ({ icon, text, color = "#1D4ED8", bg = "#EFF6FF" }) => (
    <View style={[styles.sectionBanner, { backgroundColor: bg }]}>
      <Text style={styles.sectionBannerIcon}>{icon}</Text>
      <Text style={[styles.sectionBannerText, { color }]}>{text}</Text>
    </View>
  );

  const UploadNote = ({ text }) => (
    <View style={styles.uploadNote}>
      <Text style={styles.uploadNoteText}>📌 {text}</Text>
    </View>
  );

  // ── Step renderers ────────────────────────────────────────────────────────
  const renderStep1 = () => (
    <>
      <Input label="Student Name" value={form.name} onChangeText={(t) => setField("name", t)}
        placeholder="Enter your full name" icon="👤" error={errors.name} required />
      <Input label="Parent's Phone" value={form.parentPhone} onChangeText={(t) => setField("parentPhone", t)}
        placeholder="10-digit mobile number" icon="📞" error={errors.parentPhone} required
        keyboardType="phone-pad" maxLength={10} />
      <DatePicker label="Date of Birth" value={form.dob} onChange={(d) => setField("dob", d)}
        placeholder="Select your date of birth" maximumDate={new Date()} error={errors.dob} />
      {form.dob && (
        <View style={styles.passwordBox}>
          <Text style={styles.passwordBoxLabel}>🔑 Your Default Password</Text>
          <Text style={styles.passwordBoxValue}>{formatDOB(form.dob)}</Text>
          <Text style={styles.passwordBoxHint}>Format DD/MM/YYYY — change after login</Text>
        </View>
      )}
    </>
  );

  const renderStep2 = () => (
    <>
      {/* School */}
      <SectionBanner icon="🏫" text="School Details" />
      <Input label="School Name" value={form.schoolName} onChangeText={(t) => setField("schoolName", t)}
        placeholder="e.g. Narayana High School" error={errors.schoolName} required />
      <MediumPills field="schoolMedium" error={errors.schoolMedium} />
      <UploadNote text="You'll upload: School Memo & Bonafide after registration." />

      {/* Intermediate */}
      <SectionBanner icon="🎓" text="Intermediate Details" color="#7C3AED" bg="#F5F3FF" />
      <Input label="Inter Hall Ticket No." value={form.interHallTicket}
        onChangeText={(t) => setField("interHallTicket", t.toUpperCase())}
        placeholder="e.g. IHT2024XXXXX" error={errors.interHallTicket} required autoCapitalize="characters" />
      <Input label="Inter Percentage (%)" value={form.interPercentage}
        onChangeText={(t) => setField("interPercentage", t)}
        placeholder="e.g. 96.0" error={errors.interPercentage} required keyboardType="numeric" />
      <MediumPills field="interMedium" error={errors.interMedium} />
      <UploadNote text="You'll upload: Inter Hall Ticket, Memo & Bonafide after registration." />
    </>
  );

  const renderStep3 = () => (
    <>
      <SectionBanner icon="📄" text="10th / SSC Details" />
      <Input label="10th Hall Ticket Number" value={form.tenthHallTicket}
        onChangeText={(t) => setField("tenthHallTicket", t.toUpperCase())}
        placeholder="e.g. AP12345678" error={errors.tenthHallTicket} required autoCapitalize="characters" />
      <Input label="10th Percentage (%)" value={form.tenthPercentage}
        onChangeText={(t) => setField("tenthPercentage", t)}
        placeholder="e.g. 95.5" error={errors.tenthPercentage} required keyboardType="numeric" />
      <MediumPills field="tenthMedium" error={errors.tenthMedium} />
      <UploadNote text="You'll upload: 10th Memo & Bonafide after registration." />
    </>
  );

  const renderStep4 = () => (
    <>
      <SectionBanner icon="📝" text="EAPCET Details" />
      <Input label="EAPCET Hall Ticket No." value={form.eapcetHallTicket}
        onChangeText={(t) => setField("eapcetHallTicket", t.toUpperCase())}
        placeholder="e.g. EAPCET2024XXXXX" error={errors.eapcetHallTicket} required autoCapitalize="characters" />
      <Input label="EAPCET Rank" value={form.eapcetRank}
        onChangeText={(t) => setField("eapcetRank", t)}
        placeholder="e.g. 12345" error={errors.eapcetRank} required keyboardType="numeric" />
      <UploadNote text="You'll upload: EAPCET Hall Ticket & Rank Card after registration." />
    </>
  );

  const renderStep5 = () => (
    <>
      <SectionBanner icon="🎓" text="JEE Mains (Optional)" color="#059669" bg="#F0FDF4" />
      <View style={styles.optionalBadge}>
        <Text style={styles.optionalBadgeText}>Skip this step if you haven't appeared for JEE Mains</Text>
      </View>
      <Input label="JEE Hall Ticket No." value={form.jeeHallTicket}
        onChangeText={(t) => setField("jeeHallTicket", t.toUpperCase())}
        placeholder="e.g. JEEMAINS2024XXXX" autoCapitalize="characters" />
      <Input label="JEE Rank" value={form.jeeRank}
        onChangeText={(t) => setField("jeeRank", t)}
        placeholder="e.g. 45000" keyboardType="numeric" />
      <Input label="JEE Percentile" value={form.jeePercentile}
        onChangeText={(t) => setField("jeePercentile", t)}
        placeholder="e.g. 87.50" keyboardType="numeric" />
      <UploadNote text="You'll upload: JEE Hall Ticket & Rank Card after registration." />
    </>
  );

  const renderStep6 = () => (
    <>
      {/* Student Interest */}
      <SectionBanner icon="🎯" text="Student Interest" />
      <Input label="Hobbies" value={form.hobbies} onChangeText={(t) => setField("hobbies", t)}
        placeholder="e.g. Reading, Gaming, Painting" multiline />
      <Input label="Skills & Values" value={form.skillsValues} onChangeText={(t) => setField("skillsValues", t)}
        placeholder="e.g. Leadership, Teamwork, Coding" multiline />
      <Input label="Short-term Goals" value={form.goalsShortTerm} onChangeText={(t) => setField("goalsShortTerm", t)}
        placeholder="e.g. Get an internship, learn a new skill" multiline />
      <Input label="Long-term Goals" value={form.goalsLongTerm} onChangeText={(t) => setField("goalsLongTerm", t)}
        placeholder="e.g. Become a software engineer" multiline />

      {/* Sports */}
      <SectionBanner icon="🏅" text="Sports — Professional" color="#C2410C" bg="#FFF7ED" />
      <Input label="Sport Name"      value={form.sportName}     onChangeText={(t) => setField("sportName", t)}     placeholder="e.g. Cricket, Kabaddi" />
      <Input label="Role in Sports"  value={form.sportRole}     onChangeText={(t) => setField("sportRole", t)}     placeholder="e.g. Captain, Player" />
      <Input label="Tournaments Won" value={form.tournamentWon} onChangeText={(t) => setField("tournamentWon", t)} placeholder="e.g. District Level 2023" multiline />
      <Input label="Position"        value={form.sportPosition} onChangeText={(t) => setField("sportPosition", t)} placeholder="e.g. 1st, 2nd, 3rd" />

      {/* Career Interest */}
      <SectionBanner icon="💼" text="Career Interest" color="#1D4ED8" bg="#EFF6FF" />
      <View style={styles.pillRow}>
        {[{ val: "placement", label: "🏢 Placements" }, { val: "higher_education", label: "🎓 Higher Education" }].map((o) => (
          <TouchableOpacity
            key={o.val}
            style={[styles.pill, styles.pillFlex, form.careerInterest === o.val && styles.pillActive]}
            onPress={() => setField("careerInterest", o.val)}
          >
            <Text style={[styles.pillText, form.careerInterest === o.val && styles.pillTextActive]}>{o.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {form.careerInterest === "placement" && (
        <Input label="Domain of Interest" value={form.placementDomain}
          onChangeText={(t) => setField("placementDomain", t)}
          placeholder="e.g. Software, Data Science, Core" />
      )}

      {form.careerInterest === "higher_education" && (
        <>
          <Text style={styles.subLabel}>Preferred Location</Text>
          <View style={styles.pillRow}>
            {[{ val: "india", label: "🇮🇳 India" }, { val: "abroad", label: "🌍 Abroad" }].map((o) => (
              <TouchableOpacity key={o.val}
                style={[styles.pill, styles.pillFlex, form.higherStudiesCountry === o.val && styles.pillActive]}
                onPress={() => setField("higherStudiesCountry", o.val)}>
                <Text style={[styles.pillText, form.higherStudiesCountry === o.val && styles.pillTextActive]}>{o.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {form.higherStudiesCountry === "abroad" && (
            <Input label="Which Country?" value={form.higherStudiesCountryDetail}
              onChangeText={(t) => setField("higherStudiesCountryDetail", t)}
              placeholder="e.g. USA, UK, Germany" />
          )}
          <Input label="Degree Aspired" value={form.higherStudiesDegree}
            onChangeText={(t) => setField("higherStudiesDegree", t)} placeholder="e.g. MTech, MBA, MS" />
          <Input label="Sector" value={form.higherStudiesSector}
            onChangeText={(t) => setField("higherStudiesSector", t)} placeholder="e.g. AI, Finance, Management" />
        </>
      )}
    </>
  );

  // ── Progress bar ──────────────────────────────────────────────────────────
  const renderProgress = () => (
    <View style={styles.progressRow}>
      {STEPS.map((s, idx) => (
        <React.Fragment key={s.id}>
          <View style={[styles.stepDot, step >= s.id && styles.stepDotActive, step === s.id && styles.stepDotCurrent]}>
            {step > s.id
              ? <Text style={styles.stepCheck}>✓</Text>
              : <Text style={[styles.stepNum, step >= s.id && styles.stepNumActive]}>{s.id}</Text>}
          </View>
          {idx < STEPS.length - 1 && (
            <View style={[styles.stepLine, step > s.id && styles.stepLineActive]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  // ── Main render ───────────────────────────────────────────────────────────
  const currentStep = STEPS[step - 1];

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={step === 1 ? () => navigation.goBack() : handleBack}>
            <Text style={styles.backBtnText}>‹ {step === 1 ? "Login" : STEPS[step - 2].title}</Text>
          </TouchableOpacity>

          {/* Header */}
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Step {step} of {STEPS.length} — {currentStep.icon} {currentStep.title}</Text>

          {/* Progress */}
          {renderProgress()}

          {/* Error banner */}
          {authError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>⚠ {authError}</Text>
            </View>
          )}

          {/* Step content */}
          <View style={styles.form}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
            {step === 6 && renderStep6()}
          </View>

          {/* Navigation buttons */}
          {step < STEPS.length ? (
            <TouchableOpacity style={styles.primaryBtn} onPress={handleNext} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>Continue →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.primaryBtn, isSubmitting && styles.primaryBtnDisabled]}
              onPress={handleRegister} disabled={isSubmitting} activeOpacity={0.85}
            >
              {isSubmitting
                ? <ActivityIndicator color="#FFFFFF" size="small" />
                : <Text style={styles.primaryBtnText}>Create Account ✓</Text>}
            </TouchableOpacity>
          )}

          {/* Sign in link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginLabel}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate(SCREENS.LOGIN)}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: "#F8FAFC" },
  container: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },

  backBtn:     { marginTop: 16, marginBottom: 8, alignSelf: "flex-start" },
  backBtnText: { fontSize: 16, color: "#1D4ED8", fontWeight: "600" },
  title:       { fontSize: 26, fontWeight: "800", color: "#0F172A", marginTop: 8 },
  subtitle:    { fontSize: 14, color: "#64748B", marginTop: 4, marginBottom: 20 },

  // Progress
  progressRow: { flexDirection: "row", alignItems: "center", marginBottom: 28 },
  stepDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "#E2E8F0", justifyContent: "center", alignItems: "center",
  },
  stepDotActive:  { backgroundColor: "#1D4ED8" },
  stepDotCurrent: { backgroundColor: "#1D4ED8", shadowColor: "#1D4ED8", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 4, elevation: 4 },
  stepNum:        { fontSize: 11, fontWeight: "700", color: "#94A3B8" },
  stepNumActive:  { color: "#FFFFFF" },
  stepCheck:      { fontSize: 11, fontWeight: "800", color: "#FFFFFF" },
  stepLine:       { flex: 1, height: 2, backgroundColor: "#E2E8F0", marginHorizontal: 2 },
  stepLineActive: { backgroundColor: "#1D4ED8" },

  errorBanner:     { backgroundColor: "#FFF1F2", borderRadius: 10, padding: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: "#F43F5E" },
  errorBannerText: { fontSize: 13, color: "#BE123C", fontWeight: "500" },

  form: { marginBottom: 20 },

  // Section banner
  sectionBanner: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 10, padding: 12, marginBottom: 14, marginTop: 8 },
  sectionBannerIcon: { fontSize: 18 },
  sectionBannerText: { fontSize: 15, fontWeight: "700" },

  // Password box
  passwordBox:      { backgroundColor: "#EFF6FF", borderRadius: 10, padding: 14, marginTop: 8, borderLeftWidth: 4, borderLeftColor: "#1D4ED8" },
  passwordBoxLabel: { fontSize: 12, color: "#64748B", fontWeight: "600", marginBottom: 4 },
  passwordBoxValue: { fontSize: 18, fontWeight: "800", color: "#1D4ED8" },
  passwordBoxHint:  { fontSize: 11, color: "#94A3B8", marginTop: 4 },

  // Optional badge
  optionalBadge:     { backgroundColor: "#F0FDF4", borderRadius: 8, padding: 10, marginBottom: 12 },
  optionalBadgeText: { fontSize: 12, color: "#15803D", fontWeight: "600", textAlign: "center" },

  // Pills
  pillBlock: { marginBottom: 12 },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 8 },
  pillRow:    { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  pill: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8,
    backgroundColor: "#F1F5F9", borderWidth: 1, borderColor: "#E2E8F0",
  },
  pillFlex:       { flex: 1, alignItems: "center", paddingVertical: 12 },
  pillActive:     { backgroundColor: "#1D4ED8", borderColor: "#1D4ED8" },
  pillText:       { fontSize: 13, fontWeight: "600", color: "#64748B" },
  pillTextActive: { color: "#FFFFFF" },
  fieldError:     { fontSize: 12, color: "#EF4444", marginTop: 4 },

  subLabel: { fontSize: 13, color: "#64748B", marginBottom: 8, marginTop: 4 },

  uploadNote:     { backgroundColor: "#FFFBEB", borderRadius: 8, padding: 10, borderLeftWidth: 3, borderLeftColor: "#F59E0B", marginTop: 4, marginBottom: 12 },
  uploadNoteText: { fontSize: 12, color: "#92400E", fontWeight: "500" },

  primaryBtn:         { backgroundColor: "#1D4ED8", borderRadius: 14, paddingVertical: 16, alignItems: "center", marginBottom: 20, shadowColor: "#1D4ED8", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  primaryBtnDisabled: { backgroundColor: "#93C5FD", shadowOpacity: 0 },
  primaryBtnText:     { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },

  loginRow:  { flexDirection: "row", justifyContent: "center" },
  loginLabel: { fontSize: 14, color: "#64748B" },
  loginLink:  { fontSize: 14, color: "#1D4ED8", fontWeight: "700" },
});

export default RegisterScreen;