const db = require('../config/db');

const Document = {
  // Get all documents for a student
  findByStudent: async (studentId) => {
    const { rows } = await db.query(
      `SELECT id, student_id, document_type, title, description,
              status, file_url, file_type, file_size,
              rejection_reason, uploaded_at, verified_at
       FROM documents WHERE student_id = $1 ORDER BY document_type`,
      [studentId]
    );
    return rows;
  },

  findById: async (id) => {
    const { rows } = await db.query(
      'SELECT * FROM documents WHERE id = $1', [id]
    );
    return rows[0] || null;
  },

  upsert: async ({ studentId, documentType, title, fileUrl, fileType, fileSize }) => {
    const { rows } = await db.query(
      `INSERT INTO documents
         (student_id, document_type, title, file_url, file_type, file_size, status, uploaded_at)
       VALUES ($1,$2,$3,$4,$5,$6,'pending', NOW())
       ON CONFLICT (student_id, document_type)
       DO UPDATE SET
         file_url = EXCLUDED.file_url,
         file_type = EXCLUDED.file_type,
         file_size = EXCLUDED.file_size,
         status = 'pending',
         rejection_reason = NULL,
         uploaded_at = NOW()
       RETURNING *`,
      [studentId, documentType, title, fileUrl, fileType, fileSize]
    );
    return rows[0];
  },

  updateStatus: async (id, status, rejectionReason = null) => {
    const { rows } = await db.query(
      `UPDATE documents SET status = $1, rejection_reason = $2, verified_at = NOW()
       WHERE id = $3 RETURNING *`,
      [status, rejectionReason, id]
    );
    return rows[0];
  },

  delete: async (id) => {
    await db.query('DELETE FROM documents WHERE id = $1', [id]);
  },

  getSummary: async (studentId) => {
    const { rows } = await db.query(
      `SELECT
         COUNT(*)                                     AS total,
         COUNT(*) FILTER (WHERE status = 'approved')  AS approved,
         COUNT(*) FILTER (WHERE status = 'pending')   AS pending,
         COUNT(*) FILTER (WHERE status = 'rejected')  AS rejected
       FROM documents WHERE student_id = $1`,
      [studentId]
    );
    return rows[0];
  },
};

module.exports = Document;

