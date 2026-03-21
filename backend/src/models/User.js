const db = require('../config/db');

const User = {
  // Create a new student user and return the created row
  create: async ({ name, parentPhone, interhallTicket, dob, passwordHash, uniqueId, branchCode }) => {
    const { rows } = await db.query(
      `INSERT INTO users
         (name, parent_phone, interhall_ticket, dob, password_hash, unique_id, branch_code, verification_status, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'pending', NOW())
       RETURNING id, unique_id, name, parent_phone, interhall_ticket, dob, branch_code, verification_status, created_at`,
      [name, parentPhone, interhallTicket, dob, passwordHash, uniqueId, branchCode]
    );
    return rows[0];
  },

  findByUniqueId: async (uniqueId) => {
    const { rows } = await db.query(
      'SELECT * FROM users WHERE unique_id = $1', [uniqueId]
    );
    return rows[0] || null;
  },

  findById: async (id) => {
    const { rows } = await db.query(
      `SELECT id, unique_id, name, parent_phone, interhall_ticket, dob,
              first_name, last_name, email, phone, address,
              tenth_percentage, inter_college, inter_hallticket, inter_marks,
              hostel_type, transport_type,
              father_name, father_phone, father_profession,
              mother_name, mother_phone, mother_profession,
              emacet_hall_ticket, emacet_rank,
              higher_studies_interest, higher_studies_country, higher_studies_country_detail, higher_studies_program,
              hobbies, skills_values, goals_short_term, goals_long_term,
              books_newspaper, sport_name, sport_role, tournament_won,
              placement_domain, photo_url, verification_status, branch_code, created_at
       FROM users WHERE id = $1`, [id]
    );
    return rows[0] || null;
  },

  update: async (id, fields) => {
    const allowed = [
      'first_name','last_name','email','phone','address',
      'tenth_percentage','inter_college','inter_hallticket','inter_marks',
      'hostel_type','transport_type',
      'father_name','father_phone','father_profession',
      'mother_name','mother_phone','mother_profession',
      'emacet_hall_ticket','emacet_rank',
      'higher_studies_interest','higher_studies_country','higher_studies_country_detail','higher_studies_program',
      'hobbies','skills_values','goals_short_term','goals_long_term',
      'books_newspaper','sport_name','sport_role','tournament_won','placement_domain',
    ];
    const keys   = Object.keys(fields).filter(k => allowed.includes(k));
    if (!keys.length) throw new Error('No valid fields to update');

    const sets   = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values = keys.map(k => fields[k]);
    values.push(id);

    const { rows } = await db.query(
      `UPDATE users SET ${sets}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values
    );
    return rows[0];
  },

  updatePhoto: async (id, photoUrl) => {
    const { rows } = await db.query(
      'UPDATE users SET photo_url = $1, updated_at = NOW() WHERE id = $2 RETURNING photo_url',
      [photoUrl, id]
    );
    return rows[0];
  },

  updatePassword: async (id, passwordHash) => {
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [passwordHash, id]
    );
  },

  getNextCounter: async () => {
    const { rows } = await db.query('SELECT COUNT(*) AS cnt FROM users');
    return parseInt(rows[0].cnt) + 1;
  },
};

module.exports = User;

