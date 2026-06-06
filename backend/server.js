const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

let dbType = 'postgresql';
let dbInstance = null;
let pgPool = null;

// Initialize PostgreSQL Pool
pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection and fallback to SQLite if PostgreSQL fails
pgPool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('PostgreSQL database connection failed. Falling back to SQLite.');
    console.error('Error info:', err.message);
    
    // Fallback to SQLite
    dbType = 'sqlite';
    const dbPath = path.join(__dirname, 'local_database.db');
    dbInstance = new sqlite3.Database(dbPath, (sqliteErr) => {
      if (sqliteErr) {
        console.error('Failed to initialize local SQLite database:', sqliteErr.message);
      } else {
        console.log(`Database connected successfully using local SQLite database at: ${dbPath}`);
        // Create a test table in SQLite
        dbInstance.run(`
          CREATE TABLE IF NOT EXISTS system_info (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            value TEXT
          )
        `, (createErr) => {
          if (!createErr) {
            dbInstance.run("INSERT INTO system_info (name, value) VALUES ('db_created', ?) ON CONFLICT(id) DO UPDATE SET value=?", [new Date().toISOString(), new Date().toISOString()]);
          }
        });
      }
    });
  } else {
    console.log('PostgreSQL database connected successfully at:', res.rows[0].now);
    dbInstance = pgPool;
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Basic API healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'VendorBridge Backend API is running smoothly',
    timestamp: new Date()
  });
});

// Database health check route
app.get('/api/db-test', async (req, res) => {
  if (dbType === 'postgresql') {
    try {
      const dbRes = await pgPool.query('SELECT NOW() as current_time, version() as pg_version');
      res.json({
        status: 'success',
        database: 'PostgreSQL',
        message: 'Database connected successfully',
        data: dbRes.rows[0]
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        database: 'PostgreSQL',
        message: 'Failed to query database',
        error: err.message
      });
    }
  } else if (dbType === 'sqlite' && dbInstance) {
    dbInstance.get("SELECT datetime('now') as current_time, sqlite_version() as sqlite_version", (err, row) => {
      if (err) {
        res.status(500).json({
          status: 'error',
          database: 'SQLite',
          message: 'Failed to query local database',
          error: err.message
        });
      } else {
        res.json({
          status: 'success',
          database: 'SQLite (Local Fallback)',
          message: 'Database connected successfully',
          data: row
        });
      }
    });
  } else {
    res.status(503).json({
      status: 'error',
      message: 'No active database connection'
    });
  }
});

// Mock login route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    res.json({
      success: true,
      token: 'mock-jwt-token-vendorbridge',
      user: {
        email,
        name: 'Demo Admin User',
        role: 'Administrator'
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
