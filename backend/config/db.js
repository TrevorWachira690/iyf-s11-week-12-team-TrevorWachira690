// GROUP LEADER — Shared / Wiring
//
// Copy your working code here.
// Connects the backend to MongoDB.
//
// Paste your code below this line:
const mongoose = require('mongoose');

// Tracks whether we've already started connecting, so repeated calls
// (e.g. on every serverless "warm" invocation) don't reconnect needlessly.
let connecting = null;

function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('MONGO_URI is missing. Add it to your .env / Vercel project settings.');
    return Promise.resolve();
  }

  // Already connected (common on warm serverless invocations) - reuse it.
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve();
  }

  if (!connecting) {
    connecting = mongoose
      .connect(uri)
      .then(() => console.log('MongoDB connected:', mongoose.connection.host))
      .catch((err) => {
        connecting = null; // allow retry on next call
        console.error('MongoDB connection failed:', err.message);
        // In local dev it's fine to crash loudly. In serverless, throwing here
        // instead of exiting the process lets the platform return a clean 500.
        if (!process.env.VERCEL) {
          process.exit(1);
        } else {
          throw err;
        }
      });
  }

  return connecting;
}

module.exports = connectDB;

