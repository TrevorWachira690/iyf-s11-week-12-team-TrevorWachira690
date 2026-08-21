const express = require('express');
const router = express.Router();
const {
  getMe,
  getUser,
  updateMe,
  exportData,
  importData,
} = require('../controllers/usersController');
const { requireAuth } = require('../middleware/auth');

// GET /users/me
// Get the current authenticated user's profile
router.get('/me', requireAuth, getMe);

// PUT /users/me
// Update the current authenticated user's profile
router.put('/me', requireAuth, updateMe);

// GET /users/export
// Export the current user's data
router.get('/export', requireAuth, exportData);

// POST /users/import
// Import data for the current user
router.post('/import', requireAuth, importData);

// GET /users/:id
// Get a public user profile by ID
// NOTE: This must come AFTER /me, /export, and /import so those specific
// routes are matched first.
router.get('/:id', getUser);

module.exports = router;
