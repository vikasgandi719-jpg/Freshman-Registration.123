const db = require('../config/db');

const Admin = {
  findByEmail: async (email) => {
    const { rows } = await db.query(
      'SELECT * FROM admins WHERE email = $1', [email.toLowerCase().trim()]
    );
    return rows[0] || null;
  },

  findById: async (id) => {
    const { rows } = await db.query(
      'SELECT id, name, email, role FROM admins WHERE id = $1', [id]
    );
    return rows[0] || null;
  },
};

module.exports = Admin;
