import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Input from "../../components/common/Input";
import DatePicker from "../../components/auth/DatePicker";
import { SCREENS } from "../../constants/config";
import useAuthHook from "../../hooks/useAuth";
import { useAuth } from "../../context/AuthContext";

// ─── Step Config ───────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, title: "Basic Info",        icon: "👤" },
  { id: 2, title: "10th Details",      icon: "🏫" },
  { id: 3, title: "Inter Details",     icon: "🎓" },
  { id: 4, title: "EAPCET Details",    icon: "📝" },
  { id: 5, title: "General Info",      icon: "💡" },
];

const INTER_MEDIUM_OPTIONS = ["Telugu Medium", "English Medium", "Urdu Medium", "Hindi Medium"];
const TENTH_MEDIUM_OPTIONS  = ["Telugu Medium", "English Medium", "Urdu Medium", "Hindi Medium"];

const RegisterScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    // Step 1 — Basic Info
    name: "",
    parentPhone: "",
    dob: null,

    // Step 2 — 10th Details
    tenthHallTicket: "",
    tenthPercentage: "",
    tenthMedium: "",

    // Step 3 — Inter Details
    interHallTicket: "",
    interPercentage: "",
    interMedium: "",

    // Step 4 — EAPCET Details
    eapcetHallTicket: "",
    eapcetRank: "",

    // Step 5 — General Info
    hobbies: "",
    skillsValues: "",
    goalsShortTerm: "",
    goalsLongTerm: "",
    careerInterest: "placement",           // "placement" | "higher_education"
    placementDomain: "",
    higherStudiesCountry: "india",         // "india" | "abroad"
    higherStudiesCountryDetail: "",
    higherStudiesDegree: "",
    higherStudiesSector: "",
    sportName: "",
    sportRole: "",
    tournamentWon: "",
    sportPosition: "",
  });

  const [errors, setErrors] = useState({});
  const { register, isSubmitting } = useAuthHook();
  const { error: authError, clearError } = useAuth();

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  // ─── Validate per step ────────────────────────────────────────────────────
  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!form.name?.trim())        e.name = "Student name is required.";
      if (!form.parentPhone?.trim()) e.parentPhone = "Parent's phone is required.";
      else if (!/^[6-9]\d{9}$/.test(form.parentPhone))
        e.parentPhone = "Enter a valid 10-digit number.";
      if (!form.dob)                 e.dob = "Date of birth is required.";
    }
    if (step === 2) {
      if (!form.tenthHallTicket?.trim())  e.tenthHallTicket = "Hall ticket is required.";
      if (!form.tenthPercentage?.trim())  e.tenthPercentage = "Percentage is required.";
      else if (isNaN(form.tenthPercentage) || +form.tenthPercentage < 0 || +form.tenthPercentage > 100)
        e.tenthPercentage = "Enter a valid percentage (0-100).";
      if (!form.tenthMedium)              e.tenthMedium = "Please select medium.";
    }
    if (step === 3) {
      if (!form.interHallTicket?.trim())  e.interHallTicket = "Hall ticket is required.";
      if (!form.interPercentage?.trim())  e.interPercentage = "Percentage is required.";
      else if (isNaN(form.interPercentage) || +form.interPercentage < 0 || +form.interPercentage > 100)
        e.interPercentage = "Enter a valid percentage (0-100).";
      if (!form.interMedium)              e.interMedium = "Please select medium.";
    }
    if (step === 4) {
      if (!form.eapcetHallTicket?.trim()) e.eapcetHallTicket = "Hall ticket is required.";
      if (!form.eapcetRank?.trim())       e.eapcetRank = "Rank is required.";
    }
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

    const registerData = {
      name: form.name.trim(),
      parentPhone: form.parentPhone.trim(),
      dob: form.dob,
      password: dobFormatted,

      tenthHallTicket: form.tenthHallTicket.trim().toUpperCase(),
      tenthPercentage: form.tenthPercentage.trim(),
      tenthMedium: form.tenthMedium,

      interHallTicket: form.interHallTicket.trim().toUpperCase(),
      interPercentage: form.interPercentage.trim(),
      interMedium: form.interMedium,

      eapcetHallTicket: form.eapcetHallTicket.trim().toUpperCase(),
      eapcetRank: form.eapcetRank.trim(),

      hobbies: form.hobbies.trim(),
      skillsValues: form.skillsValues.trim(),
      goalsShortTerm: form.goalsShortTerm.trim(),
      goalsLongTerm: form.goalsLongTerm.trim(),
      careerInterest: form.careerInterest,
      placementDomain: form.placementDomain.trim(),
      higherStudiesCountry: form.higherStudiesCountry,
      higherStudiesCountryDetail: form.higherStudiesCountryDetail.trim(),
      higherStudiesDegree: form.higherStudiesDegree.trim(),
      higherStudiesSector: form.higherStudiesSector.trim(),
      sportName: form.sportName.trim(),
      sportRole: form.sportRole.trim(),
      tournamentWon: form.tournamentWon.trim(),
      sportPosition: form.sportPosition.trim(),
    };

    const result = await register(registerData);
    if (result.success) {
      const generatedId = result.data?.uniqueId || "2026-BVRITN-1a-0001";
      navigation.replace(SCREENS.REGISTRATION_SUCCESS, {
        uniqueId: generatedId,
        password: dobFormatted,
        name: form.name.trim(),
      });
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };

  // ─── Progress Bar ─────────────────────────────────────────────────────────
  const renderProgress = () => (
    <View style={styles.progressContainer}>
      {STEPS.map((s) => (
        <View key={s.id} style={styles.stepWrapper}>
          <View style={[styles.stepDot, step >= s.id && styles.stepDotActive, step === s.id && styles.stepDotCurrent]}>
            {step > s.id
              ? <Text style={styles.stepDotCheck}>✓</Text>
              : <Text style={[styles.stepDotText, step >= s.id && styles.stepDotTextActive]}>{s.id}</Text>}
          </View>
          {s.id < STEPS.length && (
            <View style={[styles.stepLine, step > s.id && styles.stepLineActive]} />
          )}
        </View>
      ))}
    </View>
  );

  // ─── Medium selector ──────────────────────────────────────────────────────
  const MediumSelector = ({ field, options, error }) => (
    <View style={styles.selectorBlock}>
      <Text style={styles.selectorLabel}>Medium of Instruction *</Text>
      <View style={styles.optionRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.optionBtn, form[field] === opt && styles.optionBtnActive]}
            onPress={() => setField(field, opt)}
          >
            <Text style={[styles.optionText, form[field] === opt && styles.optionTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={styles.fieldError}>{error}</Text>}
    </View>
  );

  // ─── Step Renderers ───────────────────────────────────────────────────────
  const renderStep1 = () => (
    <>
      <Input
        label="Student Name"
        value={form.name}
        onChangeText={(t) => setField("name", t)}
        placeholder="Enter your full name"
        icon="👤"
        error={errors.name}
        required
      />
      <Input
        label="Parent's Phone Number"
        value={form.parentPhone}
        onChangeText={(t) => setField("parentPhone", t)}
        placeholder="10-digit mobile number"
        icon="📞"
        error={errors.parentPhone}
        required
        keyboardType="phone-pad"
        maxLength={10}
      />
      <DatePicker
        label="Date of Birth"
        value={form.dob}
        onChange={(d) => setField("dob", d)}
        placeholder="Select your date of birth"
        maximumDate={new Date()}
        error={errors.dob}
      />
      {form.dob && (
        <View style={styles.passwordInfo}>
          <Text style={styles.passwordInfoTitle}>🔑 Your Default Password</Text>
          <Text style={styles.passwordInfoValue}>{formatDOB(form.dob)}</Text>
          <Text style={styles.passwordInfoHint}>Format: DD/MM/YYYY — you can change it later</Text>
        </View>
      )}
    </>
  );

  const renderStep2 = () => (
    <>
      <View style={styles.stepInfoBanner}>
        <Text style={styles.stepInfoIcon}>🏫</Text>
        <Text style={styles.stepInfoText}>10th / SSC Details</Text>
      </View>
      <Input
        label="Hall Ticket Number"
        value={form.tenthHallTicket}
        onChangeText={(t) => setField("tenthHallTicket", t.toUpperCase())}
        placeholder="e.g. AP12345678"
        icon="🎫"
        error={errors.tenthHallTicket}
        required
        autoCapitalize="characters"
      />
      <Input
        label="Percentage (%)"
        value={form.tenthPercentage}
        onChangeText={(t) => setField("tenthPercentage", t)}
        placeholder="e.g. 95.5"
        icon="📊"
        error={errors.tenthPercentage}
        required
        keyboardType="numeric"
      />
      <MediumSelector field="tenthMedium" options={TENTH_MEDIUM_OPTIONS} error={errors.tenthMedium} />
      <View style={styles.uploadNote}>
        <Text style={styles.uploadNoteText}>
          📌 You'll upload: Memo, Bonafide Certificate after registration.
        </Text>
      </View>
    </>
  );

  const renderStep3 = () => (
    <>
      <View style={styles.stepInfoBanner}>
        <Text style={styles.stepInfoIcon}>🎓</Text>
        <Text style={styles.stepInfoText}>Intermediate / MPC Details</Text>
      </View>
      <Input
        label="Inter Hall Ticket Number"
        value={form.interHallTicket}
        onChangeText={(t) => setField("interHallTicket", t.toUpperCase())}
        placeholder="e.g. IHT2024XXXXX"
        icon="🎫"
        error={errors.interHallTicket}
        required
        autoCapitalize="characters"
      />
      <Input
        label="Inter Percentage (%)"
        value={form.interPercentage}
        onChangeText={(t) => setField("interPercentage", t)}
        placeholder="e.g. 96.0"
        icon="📊"
        error={errors.interPercentage}
        required
        keyboardType="numeric"
      />
      <MediumSelector field="interMedium" options={INTER_MEDIUM_OPTIONS} error={errors.interMedium} />
      <View style={styles.uploadNote}>
        <Text style={styles.uploadNoteText}>
          📌 You'll upload: Hall Ticket, Memo, Bonafide after registration.
        </Text>
      </View>
    </>
  );

  const renderStep4 = () => (
    <>
      <View style={styles.stepInfoBanner}>
        <Text style={styles.stepInfoIcon}>📝</Text>
        <Text style={styles.stepInfoText}>EAPCET Details</Text>
      </View>
      <Input
        label="EAPCET Hall Ticket Number"
        value={form.eapcetHallTicket}
        onChangeText={(t) => setField("eapcetHallTicket", t.toUpperCase())}
        placeholder="e.g. EAPCET2024XXXXX"
        icon="🎟️"
        error={errors.eapcetHallTicket}
        required
        autoCapitalize="characters"
      />
      <Input
        label="EAPCET Rank"
        value={form.eapcetRank}
        onChangeText={(t) => setField("eapcetRank", t)}
        placeholder="e.g. 12345"
        icon="🏆"
        error={errors.eapcetRank}
        required
        keyboardType="numeric"
      />
      <View style={styles.uploadNote}>
        <Text style={styles.uploadNoteText}>
          📌 You'll upload: Hall Ticket & Rank Card after registration.
        </Text>
      </View>
    </>
  );

  const renderStep5 = () => (
    <>
      {/* Student Interest */}
      <Text style={styles.sectionTitle}>🎯 Student Interest</Text>

      <Input
        label="Hobbies"
        value={form.hobbies}
        onChangeText={(t) => setField("hobbies", t)}
        placeholder="e.g. Reading, Gaming, Painting"
        multiline
      />
      <Input
        label="Skills & Values"
        value={form.skillsValues}
        onChangeText={(t) => setField("skillsValues", t)}
        placeholder="e.g. Leadership, Teamwork, Coding"
        multiline
      />
      <Input
        label="Short Term Goals"
        value={form.goalsShortTerm}
        onChangeText={(t) => setField("goalsShortTerm", t)}
        placeholder="e.g. Get an internship, learn React"
        multiline
      />
      <Input
        label="Long Term Goals"
        value={form.goalsLongTerm}
        onChangeText={(t) => setField("goalsLongTerm", t)}
        placeholder="e.g. Become a software engineer"
        multiline
      />

      {/* Sports */}
      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>🏅 Sports (Professional)</Text>
      <Input label="Sport Name"        value={form.sportName}     onChangeText={(t) => setField("sportName", t)}     placeholder="e.g. Cricket, Kabaddi" />
      <Input label="Role in Sports"    value={form.sportRole}     onChangeText={(t) => setField("sportRole", t)}     placeholder="e.g. Captain, Player" />
      <Input label="Tournaments Won"   value={form.tournamentWon} onChangeText={(t) => setField("tournamentWon", t)} placeholder="e.g. District Level 2023" multiline />
      <Input label="Position"          value={form.sportPosition} onChangeText={(t) => setField("sportPosition", t)} placeholder="e.g. 1st, 2nd, 3rd" />

      {/* Career Interest */}
      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>💼 Career Interest</Text>
      <View style={styles.optionRow}>
        <TouchableOpacity
          style={[styles.optionBtn, styles.optionBtnWide, form.careerInterest === "placement" && styles.optionBtnActive]}
          onPress={() => setField("careerInterest", "placement")}
        >
          <Text style={[styles.optionText, form.careerInterest === "placement" && styles.optionTextActive]}>
            🏢 Placements
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionBtn, styles.optionBtnWide, form.careerInterest === "higher_education" && styles.optionBtnActive]}
          onPress={() => setField("careerInterest", "higher_education")}
        >
          <Text style={[styles.optionText, form.careerInterest === "higher_education" && styles.optionTextActive]}>
            🎓 Higher Studies
          </Text>
        </TouchableOpacity>
      </View>

      {form.careerInterest === "placement" && (
        <Input
          label="Domain of Interest"
          value={form.placementDomain}
          onChangeText={(t) => setField("placementDomain", t)}
          placeholder="e.g. Software, Data Science, Core"
        />
      )}

      {form.careerInterest === "higher_education" && (
        <>
          <Text style={styles.subLabel}>Preferred Location</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[styles.optionBtn, styles.optionBtnWide, form.higherStudiesCountry === "india" && styles.optionBtnActive]}
              onPress={() => setField("higherStudiesCountry", "india")}
            >
              <Text style={[styles.optionText, form.higherStudiesCountry === "india" && styles.optionTextActive]}>🇮🇳 India</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, styles.optionBtnWide, form.higherStudiesCountry === "abroad" && styles.optionBtnActive]}
              onPress={() => setField("higherStudiesCountry", "abroad")}
            >
              <Text style={[styles.optionText, form.higherStudiesCountry === "abroad" && styles.optionTextActive]}>🌍 Abroad</Text>
            </TouchableOpacity>
          </View>
          {form.higherStudiesCountry === "abroad" && (
            <Input
              label="Which Country?"
              value={form.higherStudiesCountryDetail}
              onChangeText={(t) => setField("higherStudiesCountryDetail", t)}
              placeholder="e.g. USA, UK, Germany"
            />
          )}
          <Input label="Degree Aspired" value={form.higherStudiesDegree}  onChangeText={(t) => setField("higherStudiesDegree", t)}  placeholder="e.g. MTech, MBA, MS" />
          <Input label="Sector"         value={form.higherStudiesSector}  onChangeText={(t) => setField("higherStudiesSector", t)}  placeholder="e.g. AI, Finance, Management" />
        </>
      )}
    </>
  );

  // ─── UI ───────────────────────────────────────────────────────────────────
  const currentStep = STEPS[step - 1];

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={step === 1 ? () => navigation.goBack() : handleBack}>
            <Text style={styles.backBtnText}>‹ {step === 1 ? "Login" : STEPS[step - 2].title}</Text>
          </TouchableOpacity>

          {/* Header */}
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Step {step} of {STEPS.length} — {currentStep.icon} {currentStep.title}</Text>

          {/* Progress */}
          {renderProgress()}

          {/* Auth error */}
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
          </View>

          {/* Actions */}
          {step < STEPS.length ? (
            <TouchableOpacity style={styles.submitBtn} onPress={handleNext} activeOpacity={0.85}>
              <Text style={styles.submitBtnText}>Continue →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleRegister}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting
                ? <ActivityIndicator color="#FFFFFF" size="small" />
                : <Text style={styles.submitBtnText}>Create Account ✓</Text>}
            </TouchableOpacity>
          )}

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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  backBtn: { marginTop: 16, marginBottom: 8, alignSelf: "flex-start" },
  backBtnText: { fontSize: 16, color: "#1D4ED8", fontWeight: "600" },
  title: { fontSize: 26, fontWeight: "800", color: "#0F172A", marginTop: 8 },
  subtitle: { fontSize: 14, color: "#64748B", marginTop: 4, marginBottom: 20 },

  // Progress
  progressContainer: { flexDirection: "row", alignItems: "center", marginBottom: 28, paddingHorizontal: 4 },
  stepWrapper: { flexDirection: "row", alignItems: "center", flex: 1 },
  stepDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "#E2E8F0", justifyContent: "center", alignItems: "center",
  },
  stepDotActive:   { backgroundColor: "#1D4ED8" },
  stepDotCurrent:  { backgroundColor: "#1D4ED8", shadowColor: "#1D4ED8", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 4, elevation: 4 },
  stepDotText:     { fontSize: 11, fontWeight: "700", color: "#94A3B8" },
  stepDotTextActive: { color: "#FFFFFF" },
  stepDotCheck:    { fontSize: 11, fontWeight: "800", color: "#FFFFFF" },
  stepLine:        { flex: 1, height: 2, backgroundColor: "#E2E8F0", marginHorizontal: 2 },
  stepLineActive:  { backgroundColor: "#1D4ED8" },

  errorBanner: {
    backgroundColor: "#FFF1F2", borderRadius: 10, padding: 12,
    marginBottom: 16, borderLeftWidth: 4, borderLeftColor: "#F43F5E",
  },
  errorBannerText: { fontSize: 13, color: "#BE123C", fontWeight: "500" },

  form: { marginBottom: 20 },

  // Step info banner
  stepInfoBanner: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#EFF6FF", borderRadius: 10, padding: 12, marginBottom: 16,
  },
  stepInfoIcon: { fontSize: 20 },
  stepInfoText: { fontSize: 15, fontWeight: "700", color: "#1D4ED8" },

  // Password info
  passwordInfo: {
    backgroundColor: "#EFF6FF", borderRadius: 10, padding: 14,
    marginTop: 8, borderLeftWidth: 4, borderLeftColor: "#1D4ED8",
  },
  passwordInfoTitle: { fontSize: 12, color: "#64748B", fontWeight: "600", marginBottom: 4 },
  passwordInfoValue: { fontSize: 18, fontWeight: "800", color: "#1D4ED8" },
  passwordInfoHint:  { fontSize: 11, color: "#94A3B8", marginTop: 4 },

  // Medium / option selectors
  selectorBlock: { marginBottom: 12 },
  selectorLabel: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 8 },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  optionBtn: {
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8,
    backgroundColor: "#F1F5F9", borderWidth: 1, borderColor: "#E2E8F0",
  },
  optionBtnWide: { flex: 1, alignItems: "center", paddingVertical: 12 },
  optionBtnActive: { backgroundColor: "#1D4ED8", borderColor: "#1D4ED8" },
  optionText: { fontSize: 13, fontWeight: "600", color: "#64748B" },
  optionTextActive: { color: "#FFFFFF" },
  fieldError: { fontSize: 12, color: "#EF4444", marginTop: 4 },

  subLabel: { fontSize: 13, color: "#64748B", marginBottom: 8, marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#1D4ED8", marginBottom: 12 },

  uploadNote: {
    backgroundColor: "#FFFBEB", borderRadius: 8, padding: 10,
    borderLeftWidth: 3, borderLeftColor: "#F59E0B", marginTop: 8,
  },
  uploadNoteText: { fontSize: 12, color: "#92400E", fontWeight: "500" },

  // Submit
  submitBtn: {
    backgroundColor: "#1D4ED8", borderRadius: 14, paddingVertical: 16,
    alignItems: "center", marginBottom: 20,
    shadowColor: "#1D4ED8", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  submitBtnDisabled: { backgroundColor: "#93C5FD", shadowOpacity: 0 },
  submitBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  loginRow: { flexDirection: "row", justifyContent: "center" },
  loginLabel: { fontSize: 14, color: "#64748B" },
  loginLink: { fontSize: 14, color: "#1D4ED8", fontWeight: "700" },
});

export default RegisterScreen;