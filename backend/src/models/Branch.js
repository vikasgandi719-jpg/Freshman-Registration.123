const db = require('../config/db');

const Branch = {
  findAll: async () => {
    const { rows } = await db.query(
      'SELECT id, name, code, seats, intake, hod_name FROM branches ORDER BY name'
    );
    return rows;
  },

  findById: async (id) => {
    const { rows } = await db.query(
      'SELECT * FROM branches WHERE id = $1', [id]
    );
    return rows[0] || null;
  },

  update: async (id, data) => {
    const { name, seats, hodName } = data;
    const { rows } = await db.query(
      'UPDATE branches SET name=$1, seats=$2, hod_name=$3, updated_at=NOW() WHERE id=$4 RETURNING *',
      [name, seats, hodName, id]
    );
    return rows[0];
  },
};

module.exports = Branch;

