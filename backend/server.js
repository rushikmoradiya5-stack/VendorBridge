const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
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
  try {
    const dbRes = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    res.json({
      status: 'success',
      message: 'Database connected successfully',
      data: dbRes.rows[0]
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to connect to database',
      error: err.message
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
