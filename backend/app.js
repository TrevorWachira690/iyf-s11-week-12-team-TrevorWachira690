// GROUP LEADER — Shared / Wiring
//
// Copy your working code here.
// Sets up Express itself: middleware, CORS, rate limiting, and mounts all route files.
//
// Paste your code below this line:
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');

const app = express();

// Connect to MongoDB. In a serverless environment (Vercel) this fires on
// "cold start" and mongoose reuses the connection across warm invocations.
connectDB();

// --- Middleware ---
const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : '*',
  })
);
// Raised from Express's 100kb default because posts/avatars can include a
// base64-encoded image. The frontend compresses images before upload, but
// this gives headroom. Tune down if your MongoDB plan is very storage-limited.
app.use(express.json({ limit: '6mb' }));

// Basic rate limiting on auth routes to slow down brute force login attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { message: 'Too many attempts. Please try again later.' },
});
app.use('/api/auth', authLimiter);

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
// Comments are nested under posts: /api/posts/:postId/comments
app.use('/api/posts', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Fallback 404
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));

module.exports = app;

