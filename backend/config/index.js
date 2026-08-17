// SHARED FILE - used by everyone
// See: docs/TEAM_DIVISION.md
//
// Loads settings like the database connection string and secret keys
// from the .env file.

require("dotenv").config();

const config = {
    mongodbUrl: process.env.MONGODB_URL,
    jwtSecret: process.env.JWT_SECRET,
    port: process.env.PORT || 5000
};

module.exports = config;