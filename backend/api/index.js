// Vercel entry point. Vercel treats every file in /api as a serverless
// function. Because vercel.json routes all requests to this one file, our
// existing Express app (with all its routes) handles them exactly as it
// does locally — no route code had to change.
const app = require('../app');

module.exports = app;
