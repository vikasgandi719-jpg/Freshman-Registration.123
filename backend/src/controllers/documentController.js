const Document = require('../models/Document');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/storageService');
const { success, error } = require('../utils/responseHelper');

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ALLOWED_DOC_TYPES = new Set([
  'passport_photo','aadhar_card','school_bonafide',
  'inter_hall_ticket','inter_memo','inter_bonafide',
  'tenth_memo','tenth_bonafide',
  'eapcet_hall_ticket','eapcet_rank_card',
  'jee_hall_ticket','jee_rank_card',
  'caste_certificate','income_certificate',
]);

// Handles either a UUID (documents.id) or a slug (documents.document_type)
// without letting a non-UUID string blow up the UUID column query.
const findDocFlex = async (idOrType, studentId) => {
  if (UUID_RE.test(idOrType)) {
    const byId = await Document.findById(idOrType);
    if (byId) return byId;
  }
  if (studentId && ALLOWED_DOC_TYPES.has(idOrType)) {
    return Document.findByStudentAndType(studentId, idOrType);
  }
  return null;
};

exports.getDocuments = async (req, res, next) => {
  try {
    // This route is student-authenticated only — always scope to the
    // caller's own id. A client-supplied studentId must never override
    // this, or any student could read any other student's documents.
    const docs = await Document.findByStudent(req.user.id);
    return success(res, { data: docs });
  } catch (err) {
    next(err);
  }
};

exports.getDocumentById = async (req, res, next) => {
  try {
    const doc = await findDocFlex(req.params.id, req.user?.id);
    if (!doc) return error(res, 'Document not found', 404);
    return success(res, { data: doc });
  } catch (err) {
    next(err);
  }
};

exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) return error(res, 'No file uploaded', 400);

    const { documentType } = req.params;
    if (!ALLOWED_DOC_TYPES.has(documentType)) {
      return error(res, 'Unknown document type', 400);
    }

    const studentId = req.user.id;

    // Per-type size caps — passport photos are much smaller than PDFs.
    const maxBytes = documentType === 'passport_photo' ? 200 * 1024 : 5 * 1024 * 1024;
    if (req.file.size > maxBytes) {
      return error(
        res,
        documentType === 'passport_photo'
          ? 'Passport photo must be under 200KB'
          : 'File must be under 5MB',
        413,
      );
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: `bvritn/documents/${studentId}`,
      public_id: `${studentId}_${documentType}`,
      overwrite: true,
      resource_type: 'auto',
    });

    const doc = await Document.upsert({
      studentId,
      documentType,
      title: req.body.title || documentType,
      fileUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    });

    return success(res, { document: doc }, 'Document uploaded successfully', 201);
  } catch (err) {
    next(err);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const doc = await findDocFlex(req.params.id, req.user?.id);
    if (!doc) return error(res, 'Document not found', 404);
    if (doc.student_id !== req.user.id) return error(res, 'Forbidden', 403);

    // Prefer stored public_id; fall back to URL parsing for legacy rows.
    const publicId =
      doc.cloudinary_public_id ||
      (doc.file_url
        ? doc.file_url
            .split('/')
            .slice(-2)
            .join('/')
            .replace(/\.[^/.]+$/, '')
        : null);

    if (publicId) {
      await deleteFromCloudinary(publicId).catch(() => {});
    }

    await Document.delete(doc.id);
    return success(res, {}, 'Document deleted');
  } catch (err) {
    next(err);
  }
};

exports.getDocumentStatus = async (req, res, next) => {
  try {
    const doc = await findDocFlex(req.params.id, req.user?.id);
    if (!doc) return error(res, 'Document not found', 404);
    return success(res, {
      status: doc.status,
      rejectionReason: doc.rejection_reason,
    });
  } catch (err) {
    next(err);
  }
};
