import { getDB } from '../config/database.js';

export const createUsersTable = async () => {
  try {
    const db = getDB();
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log(' Users table migrated successfully');
  } catch (error) {
    console.error(' Migration failed:', error.message);
    throw error;
  }
};

export const dropUsersTable = async () => {
  try {
    const db = getDB();
    await db.execute('DROP TABLE IF EXISTS users');
    console.log(' Users table dropped successfully');
  } catch (error) {
    console.error(' Drop table failed:', error.message);
    throw error;
  }
};