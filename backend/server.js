// SHARED FILE - used by everyone
// See: docs/TEAM_DIVISION.md
//
// The main backend file that starts the server and connects
// everything together. The group leader reviews changes to this file.

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);

// Keep this LAST — it catches errors from every route above
app.use(errorHandler);

mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });