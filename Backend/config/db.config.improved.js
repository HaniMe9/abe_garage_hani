const mysql = require('mysql2/promise');
require('dotenv').config();

// Enhanced database configuration with better error handling and connection management
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'abe_garage',
  port: process.env.DB_PORT || 3306,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4',
  timezone: '+00:00'
};

// Create connection pool with enhanced configuration
const pool = mysql.createPool(dbConfig);

// Connection health monitoring
let isConnected = false;

// Test initial connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.execute('SELECT 1');
    connection.release();
    isConnected = true;
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    isConnected = false;
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Enhanced query function with better error handling
async function query(sql, params = []) {
  let connection;
  try {
    if (!isConnected) {
      await testConnection();
    }
    
    connection = await pool.getConnection();
    const [rows, fields] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', {
      sql: sql.substring(0, 100) + '...',
      error: error.message,
      code: error.code,
      errno: error.errno
    });
    
    // Handle specific MySQL errors
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      isConnected = false;
      console.log('🔄 Attempting to reconnect to database...');
      await testConnection();
    }
    
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Enhanced getConnection function
async function getConnection() {
  try {
    if (!isConnected) {
      await testConnection();
    }
    return await pool.getConnection();
  } catch (error) {
    console.error('Error getting database connection:', error.message);
    throw error;
  }
}

// Transaction helper
async function transaction(callback) {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Graceful shutdown
async function closePool() {
  try {
    await pool.end();
    console.log('Database pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error.message);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('Received SIGINT, closing database pool...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, closing database pool...');
  await closePool();
  process.exit(0);
});

// Initialize connection test
testConnection();

module.exports = {
  pool,
  query,
  getConnection,
  transaction,
  testConnection,
  closePool,
  isConnected: () => isConnected
};
