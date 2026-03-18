import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { API } from "../constants/config";

const DEMO_MODE = true;
const PROFILE_STORAGE_KEY = "@student_profile_data";

let storedProfile = null;

const studentService = {
  getProfile: async () => {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (storedProfile) {
        return storedProfile;
      }

      try {
        const savedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (savedProfile) {
          storedProfile = JSON.parse(savedProfile);
          return storedProfile;
        }
      } catch (e) {
        console.log("Error loading profile from storage:", e);
      }

      return {
        id: "1",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        tenthPercentage: "",
        interCollege: "",
        interHallticket: "",
        interMarks: "",
        hostelType: null,
        transportType: "",
        fatherName: "",
        fatherPhone: "",
        fatherProfession: "",
        motherName: "",
        motherPhone: "",
        motherProfession: "",
        emacetHallTicket: "",
        emacetRank: "",
        higherStudiesInterest: null,
        higherStudiesCountry: "",
        higherStudiesCountryDetail: "",
        higherStudiesProgram: "",
        hobbies: "",
        skillsValues: "",
        goalsShortTerm: "",
        goalsLongTerm: "",
        booksNewspaper: "",
        sportName: "",
        sportRole: "",
        tournamentWon: "",
        placementDomain: "",
        verificationStatus: "pending",
        photoUri: null,
      };
    }

    const response = await api.get(API.ENDPOINTS.STUDENT_PROFILE);
    return response;
  },

  updateProfile: async (data) => {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      storedProfile = { ...storedProfile, ...data };

      try {
        await AsyncStorage.setItem(
          PROFILE_STORAGE_KEY,
          JSON.stringify(storedProfile),
        );
      } catch (e) {
        console.log("Error saving profile:", e);
      }

      return {
        success: true,
        message: "Profile updated (Demo)",
        ...storedProfile,
      };
    }

    const payload = {};
    const fields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "tenthPercentage",
      "interPercentage",
      "hostelType",
      "transportType",
      "fatherName",
      "fatherPhone",
      "motherName",
      "motherPhone",
      "emacetHallTicket",
      "emacetRank",
      "higherStudiesInterest",
      "higherStudiesCountry",
      "higherStudiesCountryDetail",
      "hobbies",
      "skillsValues",
      "goalsShortTerm",
      "goalsLongTerm",
      "booksNewspaper",
      "sportName",
      "sportRole",
      "tournamentsAttended",
    ];

    fields.forEach((field) => {
      if (data[field] !== undefined) {
        payload[field] =
          typeof data[field] === "string" ? data[field].trim() : data[field];
      }
    });

    const response = await api.put(API.ENDPOINTS.STUDENT_UPDATE, payload);
    return response;
  },

  initProfile: (userData) => {
    storedProfile = {
      id: userData.id || "1",
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      email: "",
      phone: "",
      address: "",
      tenthPercentage: "",
      interCollege: "",
      interHallticket: "",
      interMarks: "",
      hostelType: null,
      transportType: "",
      fatherName: "",
      fatherPhone: "",
      fatherProfession: "",
      motherName: "",
      motherPhone: "",
      motherProfession: "",
      emacetHallTicket: "",
      emacetRank: "",
      higherStudiesInterest: null,
      higherStudiesCountry: "",
      higherStudiesCountryDetail: "",
      higherStudiesProgram: "",
      hobbies: "",
      skillsValues: "",
      goalsShortTerm: "",
      goalsLongTerm: "",
      booksNewspaper: "",
      sportName: "",
      sportRole: "",
      tournamentWon: "",
      placementDomain: "",
      uniqueId: userData.uniqueId || "",
      verificationStatus: "pending",
      photoUri: null,
    };
  },

  resetProfile: async () => {
    storedProfile = null;
    try {
      await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch (e) {
      console.log("Error clearing profile:", e);
    }
  },

  uploadPhoto: async (formData) => {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { photoUri: "demo://photo.jpg" };
    }

    const response = await api.upload(API.ENDPOINTS.STUDENT_PHOTO, formData);
    return response;
  },

  getStudentById: async (studentId) => {
    if (DEMO_MODE) {
      return { id: studentId, name: "Demo Student" };
    }

    const response = await api.get(
      `${API.ENDPOINTS.STUDENT_PROFILE}/${studentId}`,
    );
    return response;
  },

  getVerificationStatus: async () => {
    if (DEMO_MODE) {
      return { status: "pending", message: "Under review (Demo)" };
    }

    const response = await api.get("/student/verification-status");
    return response;
  },

  getDocumentSummary: async () => {
    if (DEMO_MODE) {
      return { total: 9, approved: 0, pending: 0, rejected: 0, notUploaded: 9 };
    }

    const response = await api.get("/student/document-summary");
    return response;
  },
};

export default studentService;
