const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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
