// Local development entry point. Vercel does NOT use this file — it uses
// api/index.js instead, which imports the same Express app from app.js.
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
