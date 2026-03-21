const User    = require('../models/User');
const Document = require('../models/Document');
const { uploadToCloudinary } = require('../services/storageService');
const { success, error }     = require('../utils/responseHelper');

// Camel → snake mapping for profile update
const FIELD_MAP = {
  firstName: 'first_name', lastName: 'last_name', email: 'email', phone: 'phone',
  address: 'address', tenthPercentage: 'tenth_percentage',
  interCollege: 'inter_college', interHallticket: 'inter_hallticket', interMarks: 'inter_marks',
  hostelType: 'hostel_type', transportType: 'transport_type',
  fatherName: 'father_name', fatherPhone: 'father_phone', fatherProfession: 'father_profession',
  motherName: 'mother_name', motherPhone: 'mother_phone', motherProfession: 'mother_profession',
  emacetHallTicket: 'emacet_hall_ticket', emacetRank: 'emacet_rank',
  higherStudiesInterest: 'higher_studies_interest',
  higherStudiesCountry: 'higher_studies_country',
  higherStudiesCountryDetail: 'higher_studies_country_detail',
  higherStudiesProgram: 'higher_studies_program',
  hobbies: 'hobbies', skillsValues: 'skills_values',
  goalsShortTerm: 'goals_short_term', goalsLongTerm: 'goals_long_term',
  booksNewspaper: 'books_newspaper', sportName: 'sport_name',
  sportRole: 'sport_role', tournamentWon: 'tournament_won',
  placementDomain: 'placement_domain',
};

// GET /api/students/profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return error(res, 'User not found', 404);
    return success(res, { data: user });
  } catch (err) {
    next(err);
  }
};

// PUT /api/students/update
exports.updateProfile = async (req, res, next) => {
  try {
    const snakeFields = {};
    for (const [camel, snake] of Object.entries(FIELD_MAP)) {
      if (req.body[camel] !== undefined) {
        snakeFields[snake] = typeof req.body[camel] === 'string'
          ? req.body[camel].trim()
          : req.body[camel];
      }
    }

    if (!Object.keys(snakeFields).length) {
      return error(res, 'No valid fields provided', 400);
    }

    const updated = await User.update(req.user.id, snakeFields);
    return success(res, { data: updated }, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
};

// POST /api/students/photo
exports.uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) return error(res, 'No file uploaded', 400);

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'bvritn/photos',
      public_id: `student_${req.user.id}`,
      overwrite: true,
      transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
    });

    const updated = await User.updatePhoto(req.user.id, result.secure_url);
    return success(res, { photoUri: updated.photo_url }, 'Photo uploaded successfully');
  } catch (err) {
    next(err);
  }
};

// GET /api/students/verification-status
exports.getVerificationStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return error(res, 'User not found', 404);
    return success(res, { status: user.verification_status });
  } catch (err) {
    next(err);
  }
};

// GET /api/students/document-summary
exports.getDocumentSummary = async (req, res, next) => {
  try {
    const summary = await Document.getSummary(req.user.id);
    return success(res, { data: summary });
  } catch (err) {
    next(err);
  }
};
