const pool = require('../config/database');

class User {
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async create(name, email, password, token) {
    const query = 'INSERT INTO users (name, email, password, token) VALUES ($1, $2, $3, $4)';
    const values = [name, email, password, token];
    await pool.query(query, values);
  }

  static async verify(email) {
    const query = 'UPDATE users SET is_verified = true WHERE email = $1';
    const values = [email];
    await pool.query(query, values);
  }
}

module.exports = User;