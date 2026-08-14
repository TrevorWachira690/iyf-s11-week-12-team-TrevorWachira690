// Owned by: Part 1, Person A
// See: docs/part-1-accounts-and-login/person-a-backend.md
//
// This file connects web addresses (like /api/auth/register) to the
// functions in authController.js that actually do the work.

const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, getMe);

module.exports = router;