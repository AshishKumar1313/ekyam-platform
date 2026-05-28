// ============================
// Third-party modules
// ============================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// ============================
// Custom modules
// ============================

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import collaborationRoutes from './routes/collaborationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

// ============================
// Config
// ============================

dotenv.config();
connectDB();

const app = express();

// ============================
// Allowed Frontend Origins
// ============================

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://ekyam-platform.vercel.app'
];

// ============================
// CORS Configuration
// ============================

const corsOptions = {
  origin: function (origin, callback) {

    console.log('Request Origin:', origin);

    // Allow requests with no origin
    // (Postman, mobile apps, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    // Allow localhost + Vercel deployments
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }

    return callback(
      new Error(`CORS blocked for origin: ${origin}`)
    );
  },

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ],

  credentials: true,

  optionsSuccessStatus: 200
};

// ============================
// Apply CORS Middleware
// ============================

app.use(cors(corsOptions));

// IMPORTANT: Handle preflight requests
app.options('*', cors(corsOptions));

// ============================
// Body Parser
// ============================

app.use(express.json());

// ============================
// Health Route
// ============================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'EKYAM API is running'
  });
});

// ============================
// API Routes
// ============================

app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/collaborations', collaborationRoutes);
app.use('/api/admin', adminRoutes);

// ============================
// Error Handling Middleware
// ============================

app.use((err, req, res, next) => {

  console.error('ERROR:', err.message);

  // CORS errors
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: err.message
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

// ============================
// Start Server
// ============================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`EKYAM server running on port ${PORT}`);
});

// ============================
// Server Error Handling
// ============================

server.on('error', (err) => {

  if (err.code === 'EADDRINUSE') {

    console.error(`\nPort ${PORT} is already in use.`);
    console.error(`Run this command:`);

    console.error(`netstat -ano | findstr :${PORT}`);
    console.error(`taskkill /PID <pid> /F\n`);

  } else {
    console.error(err);
  }

  process.exit(1);
});