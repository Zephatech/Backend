const pool = require('../config/database');

class User {
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async create(firstName, lastName, email, password, token, isVerified) {
    const query = 'INSERT INTO users (firstName, lastName, email, password, token, isVerified) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [firstName, lastName, email, password, token, isVerified];
    await pool.query(query, values); 
  }

  static async verify(email) {
    const query = 'UPDATE users SET is_verified = true WHERE email = $1';
    const values = [email];
    await pool.query(query, values);
  }
}

module.exports = User;