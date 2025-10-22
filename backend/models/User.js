import { getDB } from '../config/database.js';
import bcrypt from 'bcryptjs';

export class User {
  static async create(userData) {
    const db = getDB();
    const { username, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    try {
      const [result] = await db.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
      
      return result.insertId;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('User already exists with this email or username');
      }
      throw error;
    }
  }

  static async findByEmail(email) {
    const db = getDB();
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findByUsername(username) {
    const db = getDB();
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  static async findById(id) {
    const db = getDB();
    const [rows] = await db.execute(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}