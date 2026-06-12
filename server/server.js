// ─── Load environment variables FIRST before anything else ───────────────────
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// ─── Import Routes ────────────────────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const passRoutes = require('./routes/passRoutes');
const securityRoutes = require('./routes/securityRoutes');

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Initialize Express App ───────────────────────────────────────────────────
const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────

// Allow requests from React frontend (localhost:3000)
app.use(
  cors({
    origin: [
      'http://localhost:3000',  // React dev server
      'http://localhost:5173',  // Vite dev server (if using Vite)
       'https://smart-passs.netlify.app' 
    ],
    credentials: true,
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);       // /api/auth/register, /api/auth/login
app.use('/api/passes', passRoutes);     // /api/passes, /api/passes/all, etc.
app.use('/api/security', securityRoutes); // /api/security/verify, /api/security/log

// ─── Health Check Route ───────────────────────────────────────────────────────
// Visit http://localhost:5000/api/health to confirm server is running
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '✅ SmartPass API is running',
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
// Catches any route that doesn't exist
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Catches any unhandled errors from controllers
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});
// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SmartPass server running on http://localhost:${PORT}`);
  console.log(`👉 Also accessible at http://127.0.0.1:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
});