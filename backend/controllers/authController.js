// Owned by: Part 1, Person A
// See: docs/part-1-accounts-and-login/person-a-backend.md
//
// This file handles registering a new account, logging in, and
// checking who's currently logged in.

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

// Creates a signed token that proves who the user is
function generateToken(userId) {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn || '7d',
  });
}

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { username, email, password, role, businessName } = req.body;

    if (role && !['business', 'customer'].includes(role)) {
      return res.status(400).json({ error: 'Role must be "business" or "customer"' });
    }

    if (role === 'business' && !businessName) {
      return res.status(400).json({ error: 'Business accounts must provide a business name' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }

    const user = new User({ username, email, password, role, businessName });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // password has select: false in the schema, so we ask for it explicitly
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me  (requires requireAuth middleware to have run first)
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        businessName: req.user.businessName,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };