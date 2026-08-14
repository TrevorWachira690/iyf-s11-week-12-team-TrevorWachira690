// Owned by: Part 1, Person A
// See: docs/part-1-accounts-and-login/person-a-backend.md
//
// This file checks whether a request is coming from a logged-in user
// before letting it continue.

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = { requireAuth };