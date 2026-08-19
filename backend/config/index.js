// SHARED FILE - used by everyone
// See: docs/TEAM_DIVISION.md
//
// Loads settings like the database connection string and secret keys
// from the .env file.

require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/community-hub',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

