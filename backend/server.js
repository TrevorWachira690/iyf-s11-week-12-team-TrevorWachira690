const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const config = require('./config');
const { errorHandler, notFound } = require('./middleware/errorHandler');

require('./config/passport');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');
const healthRoutes = require('./routes/health');

const app = express();

// CORS: only allow the configured frontend URL(s) to call this API.
const allowedOrigins = config.clientUrl.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile apps, health checks)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '8mb' })); // 8mb to allow base64 image uploads

app.use(
  session({
    secret: config.jwtSecret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'TBM-DeepIn API is running. See /api/health for status.' });
});

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
