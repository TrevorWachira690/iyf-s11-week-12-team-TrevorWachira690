const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Post');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// GET /api/users - list all users (for "start a conversation" / directory).
// Excludes the logged-in user themself. Public info only.
router.get('/', requireAuth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select('name email avatar')
      .sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Could not load users.', error: err.message });
  }
});

// GET /api/users/:id - a public profile + that user's posts
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email bio avatar createdAt');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .select('content image likes createdAt');

    const shapedPosts = posts.map((p) => ({
      _id: p._id,
      content: p.content,
      image: p.image,
      likeCount: (p.likes || []).length,
      createdAt: p.createdAt,
    }));

    res.json({ user, posts: shapedPosts });
  } catch (err) {
    res.status(400).json({ message: 'Invalid user id.' });
  }
});

// PUT /api/users/me - update your own bio/avatar (and optionally name)
router.put(
  '/me',
  requireAuth,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('bio').optional({ nullable: true }).isString().isLength({ max: 300 }),
    body('avatar')
      .optional({ nullable: true })
      .isString()
      .custom((value) => !value || value.startsWith('data:image/'))
      .withMessage('Avatar must be a valid image data URI'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found.' });

      if (typeof req.body.name === 'string') user.name = req.body.name;
      if (typeof req.body.bio === 'string') user.bio = req.body.bio;
      if (typeof req.body.avatar !== 'undefined') user.avatar = req.body.avatar || null;

      await user.save();

      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
      });
    } catch (err) {
      res.status(500).json({ message: 'Could not update profile.', error: err.message });
    }
  }
);

module.exports = router;
