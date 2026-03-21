const Document = require('../models/Document');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/storageService');
const { success, error } = require('../utils/responseHelper');

// GET /api/documents  (student sees own; admin can pass ?studentId=)
exports.getDocuments = async (req, res, next) => {
  try {
    const studentId = req.query.studentId || req.user?.id;
    const docs = await Document.findByStudent(studentId);
    return success(res, { data: docs });
  } catch (err) {
    next(err);
  }
};

// GET /api/documents/:id
exports.getDocumentById = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return error(res, 'Document not found', 404);
    return success(res, { data: doc });
  } catch (err) {
    next(err);
  }
};

// POST /api/documents/upload/:documentType
exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) return error(res, 'No file uploaded', 400);

    const { documentType } = req.params;
    const studentId = req.user.id;

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
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    });

    return success(res, { document: doc }, 'Document uploaded successfully', 201);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/documents/:id
exports.deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return error(res, 'Document not found', 404);
    if (doc.student_id !== req.user.id) return error(res, 'Forbidden', 403);

    // Extract cloudinary public_id from URL
    if (doc.file_url) {
      const parts = doc.file_url.split('/');
      const publicId = parts.slice(-2).join('/').replace(/\.[^/.]+$/, '');
      await deleteFromCloudinary(publicId).catch(() => {});
    }

    await Document.delete(req.params.id);
    return success(res, {}, 'Document deleted');
  } catch (err) {
    next(err);
  }
};

// GET /api/documents/status/:id
exports.getDocumentStatus = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return error(res, 'Document not found', 404);
    return success(res, { status: doc.status, rejectionReason: doc.rejection_reason });
  } catch (err) {
    next(err);
  }
};
