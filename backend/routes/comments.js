const express = require('express');
const router = express.Router();
const {
  getComments,
  createComment,
  deleteComment,
} = require('../controllers/commentsController');
const { requireAuth } = require('../middleware/auth');

// GET /comments/post/:postId
// Get all comments for a specific post
router.get('/post/:postId', getComments);

// POST /comments
// Create a new comment (requires authentication)
router.post('/', requireAuth, createComment);

// DELETE /comments/:id
// Delete a comment (requires authentication, author only)
router.delete('/:id', requireAuth, deleteComment);

module.exports = router;
