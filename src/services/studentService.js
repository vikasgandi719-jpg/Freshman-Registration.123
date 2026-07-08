import api from "./api";
import { API } from "../constants/config";

// Backend rows are snake_case; the rest of the app was built around
// camelCase (matches the old demo shape). Map once here so every screen
// keeps working without a rewrite.
export const mapUserFromApi = (row) => {
  if (!row) return row;
  return {
    id: row.id,
    uniqueId: row.unique_id,
    name: row.name,
    firstName: row.first_name || "",
    lastName: row.last_name || "",
    email: row.email || "",
    phone: row.phone || "",
    address: row.address || "",
    parentPhone: row.parent_phone,
    interhallTicket: row.interhall_ticket,
    dob: row.dob,

    tenthPercentage: row.tenth_percentage || "",
    interCollege: row.inter_college || "",
    interHallticket: row.inter_hallticket || "",
    interMarks: row.inter_marks || "",

    hostelType: row.hostel_type,
    transportType: row.transport_type || "",

    fatherName: row.father_name || "",
    fatherPhone: row.father_phone || "",
    fatherProfession: row.father_profession || "",
    motherName: row.mother_name || "",
    motherPhone: row.mother_phone || "",
    motherProfession: row.mother_profession || "",

    emacetHallTicket: row.emacet_hall_ticket || "",
    emacetRank: row.emacet_rank || "",

    higherStudiesInterest: row.higher_studies_interest,
    higherStudiesCountry: row.higher_studies_country || "",
    higherStudiesCountryDetail: row.higher_studies_country_detail || "",
    higherStudiesProgram: row.higher_studies_program || "",

    hobbies: row.hobbies || "",
    skillsValues: row.skills_values || "",
    goalsShortTerm: row.goals_short_term || "",
    goalsLongTerm: row.goals_long_term || "",
    booksNewspaper: row.books_newspaper || "",
    sportName: row.sport_name || "",
    sportRole: row.sport_role || "",
    tournamentWon: row.tournament_won || "",
    placementDomain: row.placement_domain || "",

    photoUri: row.photo_url || null,
    verificationStatus: row.verification_status || "pending",
    branchCode: row.branch_code,
    createdAt: row.created_at,
  };
};

const UPDATE_FIELDS = [
  "firstName", "lastName", "email", "phone", "address",
  "tenthPercentage", "interMarks", "interCollege", "interHallticket",
  "hostelType", "transportType",
  "fatherName", "fatherPhone", "fatherProfession",
  "motherName", "motherPhone", "motherProfession",
  "emacetHallTicket", "emacetRank",
  "higherStudiesInterest", "higherStudiesCountry",
  "higherStudiesCountryDetail", "higherStudiesProgram",
  "hobbies", "skillsValues", "goalsShortTerm", "goalsLongTerm",
  "booksNewspaper", "sportName", "sportRole", "tournamentWon", "placementDomain",
];

const studentService = {
  getProfile: async () => {
    const response = await api.get(API.ENDPOINTS.STUDENT_PROFILE);
    return mapUserFromApi(response?.data || response);
  },

  updateProfile: async (data) => {
    const payload = {};
    UPDATE_FIELDS.forEach((field) => {
      if (data[field] !== undefined) {
        payload[field] =
          typeof data[field] === "string" ? data[field].trim() : data[field];
      }
    });

    const response = await api.put(API.ENDPOINTS.STUDENT_UPDATE, payload);
    return mapUserFromApi(response?.data || response);
  },

  // No-op kept for backward compatibility — profile now always comes from
  // the server via getProfile(), called on mount by the profile/dashboard screens.
  initProfile: () => {},
  resetProfile: async () => {},

  uploadPhoto: async (formData) => {
    const response = await api.upload(API.ENDPOINTS.STUDENT_PHOTO, formData);
    return { photoUri: response?.photoUri || response?.data?.photoUri };
  },

  getVerificationStatus: async () => {
    const response = await api.get("/student/verification-status");
    return { status: response?.status };
  },

  getDocumentSummary: async () => {
    const response = await api.get("/student/document-summary");
    const s = response?.data || response || {};
    return {
      total: Number(s.total) || 0,
      approved: Number(s.approved) || 0,
      pending: Number(s.pending) || 0,
      rejected: Number(s.rejected) || 0,
    };
  },
};

export default studentService;
