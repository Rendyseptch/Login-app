import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'auth_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let connectionPool;
let isConnected = false;

export const connectDB = async () => {
  try {
    console.log('Connecting to MySQL...');
    
    // Connect without database first to create it
    const adminConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    console.log(' Connected to MySQL server');

    // Create database if not exists
    await adminConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    console.log(` Database '${dbConfig.database}' ready`);

    await adminConnection.end();

    // Connect with database
    connectionPool = mysql.createPool(dbConfig);

    // Test connection
    const testConn = await connectionPool.getConnection();
    console.log(' Database pool connected successfully');
    testConn.release();

    // Create tables
    await createTables();
    
    isConnected = true;
    console.log(' Database initialization completed!');
    
  } catch (error) {
    console.error(' Database connection failed:', error.message);
    process.exit(1);
  }
};

const createTables = async () => {
  try {
    await connectionPool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log(' Users table ready');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

export const getDB = () => {
  if (!connectionPool || !isConnected) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return connectionPool;
};

export const isDBConnected = () => isConnected;