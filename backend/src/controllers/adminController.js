const Admin    = require('../models/Admin');
const User     = require('../models/User');
const Document = require('../models/Document');
const Branch   = require('../models/Branch');
const db       = require('../config/db');
const { compare }    = require('../utils/hashPassword');
const { signToken }  = require('../config/jwt');
const { success, error } = require('../utils/responseHelper');

// POST /api/admin/login
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'Email and password are required', 400);

    const admin = await Admin.findByEmail(email);
    if (!admin) return error(res, 'Invalid credentials', 401);

    const valid = await compare(password, admin.password_hash);
    if (!valid) return error(res, 'Invalid credentials', 401);

    const token = signToken({ id: admin.id, email: admin.email, role: 'admin' });

    return success(res, {
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    }, 'Admin login successful');
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/students
exports.getStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, branch, status, search } = req.query;
    const offset = (page - 1) * limit;

    let conditions = [];
    let values     = [];
    let idx        = 1;

    if (branch) { conditions.push(`branch_code = $${idx++}`); values.push(branch); }
    if (status) { conditions.push(`verification_status = $${idx++}`); values.push(status); }
    if (search) {
      conditions.push(`(name ILIKE $${idx} OR unique_id ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRes = await db.query(`SELECT COUNT(*) FROM users ${where}`, values);
    const total    = parseInt(countRes.rows[0].count);

    values.push(limit, offset);
    const { rows } = await db.query(
      `SELECT id, unique_id, name, parent_phone, verification_status, branch_code, created_at
       FROM users ${where}
       ORDER BY created_at DESC
       LIMIT $${idx++} OFFSET $${idx++}`,
      values
    );

    return success(res, {
      data: rows,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/students/:id
exports.getStudentById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return error(res, 'Student not found', 404);

    const docs = await Document.findByStudent(req.params.id);
    return success(res, { data: { ...user, documents: docs } });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/verify/:studentId
exports.verifyStudent = async (req, res, next) => {
  try {
    await db.query(
      `UPDATE users SET verification_status = 'approved', updated_at = NOW() WHERE id = $1`,
      [req.params.studentId]
    );
    return success(res, {}, 'Student verified successfully');
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/reject/:studentId
exports.rejectStudent = async (req, res, next) => {
  try {
    const { reason } = req.body;
    await db.query(
      `UPDATE users SET verification_status = 'rejected', rejection_reason = $1, updated_at = NOW() WHERE id = $2`,
      [reason || null, req.params.studentId]
    );
    return success(res, {}, 'Student rejected');
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/students/:id/reset
exports.resetStudentStatus = async (req, res, next) => {
  try {
    await db.query(
      `UPDATE users SET verification_status = 'pending', rejection_reason = NULL, updated_at = NOW() WHERE id = $1`,
      [req.params.id]
    );
    return success(res, {}, 'Student status reset to pending');
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/stats
exports.getStats = async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT
        COUNT(*)                                           AS "totalStudents",
        COUNT(*) FILTER (WHERE verification_status='approved')  AS "approved",
        COUNT(*) FILTER (WHERE verification_status='pending')   AS "pending",
        COUNT(*) FILTER (WHERE verification_status='rejected')  AS "rejected"
      FROM users
    `);
    return success(res, { data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/branches
exports.getBranches = async (req, res, next) => {
  try {
    const branches = await Branch.findAll();
    return success(res, { data: branches });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/branches/:id
exports.updateBranch = async (req, res, next) => {
  try {
    const updated = await Branch.update(req.params.id, req.body);
    return success(res, { data: updated }, 'Branch updated');
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/documents/:documentId/verify
exports.verifyDocument = async (req, res, next) => {
  try {
    const doc = await Document.updateStatus(req.params.documentId, 'approved');
    return success(res, { data: doc }, 'Document verified');
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/documents/:documentId/reject
exports.rejectDocument = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const doc = await Document.updateStatus(req.params.documentId, 'rejected', reason);
    return success(res, { data: doc }, 'Document rejected');
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/export
exports.exportStudentData = async (req, res, next) => {
  try {
    const { branch, status } = req.body;
    let conditions = [], values = [], idx = 1;
    if (branch) { conditions.push(`branch_code = $${idx++}`); values.push(branch); }
    if (status) { conditions.push(`verification_status = $${idx++}`); values.push(status); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const { rows } = await db.query(
      `SELECT unique_id, name, parent_phone, verification_status, branch_code, created_at
       FROM users ${where} ORDER BY created_at DESC`,
      values
    );
    return success(res, { data: rows, total: rows.length });
  } catch (err) {
    next(err);
  }
};

