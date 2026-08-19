// SHARED FILE - used by everyone
// See: docs/TEAM_DIVISION.md
//
// Catches errors from anywhere in the backend and turns them into a
// clean response instead of crashing the server.

function errorHandler(err, req, res, next) {
  console.error(err.stack);

  // Mongoose validation errors (like minlength, required, enum)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }

  // Duplicate key error (unique: true on username/email)
  if (err.code === 11000) {
    return res.status(400).json({ error: 'That value is already in use.' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong on the server.',
  });
}

module.exports = errorHandler;