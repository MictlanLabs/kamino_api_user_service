import { pool } from '../../../config/database.config.js';
import { User } from '../../../../domain/entities/User.js';

export class PostgresUserRepository {
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    
    if (result.rows.length === 0) return null;
    
    return new User({
      id: result.rows[0].id,
      email: result.rows[0].email,
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name,
      password: result.rows[0].password,
      role: result.rows[0].role,
      isActive: result.rows[0].is_active,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at
    });
  }

  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) return null;
    
    return new User({
      id: result.rows[0].id,
      email: result.rows[0].email,
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name,
      password: result.rows[0].password,
      role: result.rows[0].role,
      isActive: result.rows[0].is_active,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at
    });
  }

  async save(user) {
    const query = `
      INSERT INTO users (email, password, first_name, last_name, role, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `;
    
    const values = [
      user.email,
      user.password,
      user.firstName,
      user.lastName,
      user.role,
      user.isActive
    ];
    
    const result = await pool.query(query, values);
    
    return new User({
      id: result.rows[0].id,
      email: result.rows[0].email,
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name,
      password: result.rows[0].password,
      role: result.rows[0].role,
      isActive: result.rows[0].is_active,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at
    });
  }

  async saveRefreshToken(userId, token) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const query = `
      INSERT INTO refresh_tokens (user_id, token, expires_at, created_at)
      VALUES ($1, $2, $3, NOW())
    `;
    await pool.query(query, [userId, token, expiresAt]);
  }

  async deleteRefreshToken(token) {
    const query = 'DELETE FROM refresh_tokens WHERE token = $1';
    await pool.query(query, [token]);
  }

  async findRefreshToken(token) {
    const query = 'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()';
    const result = await pool.query(query, [token]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  
async findAll() {
  const query = 'SELECT * FROM users ORDER BY created_at DESC';
  const result = await pool.query(query);

  return result.rows.map(row => new User({
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    password: row.password,
    role: row.role,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

  async updateProfilePicture(userId, buffer) {
    const query = 'UPDATE users SET profile_picture = $1 WHERE id = $2 RETURNING id';
    const result = await pool.query(query, [buffer, userId]);
    return result.rowCount > 0;
  }

  async deleteProfilePicture(userId) {
    const query = 'UPDATE users SET profile_picture = NULL WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [userId]);
    return result.rowCount > 0;
  }

  async getProfilePicture(userId) {
    const query = 'SELECT profile_picture FROM users WHERE id = $1';
    const result = await pool.query(query, [userId]);
    if (result.rows.length === 0) return null;
    return result.rows[0].profile_picture || null;
  }
}

