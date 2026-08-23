const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, password } = req.body;

    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: 'An account with that email already exists.' });
      }

      const user = await User.create({ name, email, password });
      const token = signToken(user);

      res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, bio: user.bio, avatar: user.avatar },
      });
    } catch (err) {
      res.status(500).json({ message: 'Registration failed.', error: err.message });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
      // password has "select: false" on the schema, so it must be explicitly requested here
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const match = await user.comparePassword(password);
      if (!match) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const token = signToken(user);

      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, bio: user.bio, avatar: user.avatar },
      });
    } catch (err) {
      res.status(500).json({ message: 'Login failed.', error: err.message });
    }
  }
);

module.exports = router;

