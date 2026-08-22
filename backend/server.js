const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');
const healthRoutes = require('./routes/health');

const app = express();

// CORS: only allow the configured frontend URL(s) to call this API.
const allowedOrigins = config.clientUrl.split(',').map((o) => o.trim());
console.log('[cors] Allowed origins:', allowedOrigins);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn('[cors] Rejected origin:', origin);
      // Reject without throwing, so a bad origin returns a normal
      // "no access" response instead of crashing the whole request.
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '8mb' })); // 8mb to allow base64 image uploads

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

// Serve the built React frontend (single-server deploy).
// The frontend lives at the repo root, so Vite outputs to ../dist
// relative to this file (backend/server.js).
if (config.nodeEnv === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));

  // Any route that isn't /api/* falls through to the React app,
  // so client-side routing (React Router) works on refresh/direct links.
  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'TBM-DeepIn API is running. See /api/health for status.' });
  });
}

app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    if (config.mongoUri) {
      await mongoose.connect(config.mongoUri);
      console.log('[db] Connected to MongoDB');
    } else {
      console.warn('[db] No MONGO_URI set - server will start but DB routes will fail.');
    }

    app.listen(config.port, () => {
      console.log(`[server] Listening on port ${config.port} (${config.nodeEnv})`);
    });
  } catch (err) {
    console.error('[server] Failed to start:', err.message);
    process.exit(1);
  }
}

start();

module.exports = app;
