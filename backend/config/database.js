const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'villagework_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Test the connection
pool.on('connect', () => {
  console.log('📦 Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Database connection wrapper
const db = {
  connect: async () => {
    try {
      const client = await pool.connect();
      client.release();
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  },

  query: async (text, params) => {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('📊 Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('❌ Query error:', error);
      throw error;
    }
  },

  getClient: () => {
    return pool.connect();
  },

  end: async () => {
    await pool.end();
    console.log('🔌 Database connection pool closed');
  }
};

module.exports = db; 