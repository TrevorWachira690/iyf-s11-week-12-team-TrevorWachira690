const express = require('express');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// GET /api/posts/:postId/comments - list comments for a post
router.get('/:postId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ createdAt: 1 })
      .populate('author', 'name email avatar');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Could not load comments.', error: err.message });
  }
});

// POST /api/posts/:postId/comments - add a comment (must be logged in)
router.post(
  '/:postId/comments',
  requireAuth,
  [body('text').trim().notEmpty().withMessage('Comment text is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const post = await Post.findById(req.params.postId);
      if (!post) return res.status(404).json({ message: 'Post not found.' });

      const comment = await Comment.create({
        text: req.body.text,
        author: req.user.id,
        post: post._id,
      });
      const populated = await comment.populate('author', 'name email avatar');
      res.status(201).json(populated);
    } catch (err) {
      res.status(500).json({ message: 'Could not add comment.', error: err.message });
    }
  }
);

// DELETE /api/posts/:postId/comments/:commentId - delete own comment
router.delete('/:postId/comments/:commentId', requireAuth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own comments.' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete comment.', error: err.message });
  }
});

module.exports = router;
