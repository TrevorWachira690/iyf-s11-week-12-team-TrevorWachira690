const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const requireAuth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

const router = express.Router();

// Turns a Mongoose post doc into the JSON shape the frontend expects:
// a likeCount, and whether the current viewer (if logged in) liked it.
// Guards against "likes" being missing on documents read before that field
// existed on the schema.
function shapePost(post, viewerId) {
  const obj = post.toObject();
  const likes = obj.likes || [];
  obj.likeCount = likes.length;
  obj.likedByMe = viewerId ? likes.some((id) => id.toString() === viewerId) : false;
  delete obj.likes; // don't ship the full list of liker ids to the client
  return obj;
}

// A post needs at least a caption or an image - not necessarily both.
function requireContentOrImage(req, res, next) {
  const hasContent = typeof req.body.content === 'string' && req.body.content.trim().length > 0;
  const hasImage = typeof req.body.image === 'string' && req.body.image.length > 0;
  if (!hasContent && !hasImage) {
    return res.status(400).json({ message: 'Add some text, an image, or both.' });
  }
  next();
}

// GET /api/posts - list all posts (newest first). Public.
router.get('/', optionalAuth, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name email avatar');
    res.json(posts.map((p) => shapePost(p, req.user?.id)));
  } catch (err) {
    res.status(500).json({ message: 'Could not load posts.', error: err.message });
  }
});

// GET /api/posts/:id - a single post
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email avatar');
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    res.json(shapePost(post, req.user?.id));
  } catch (err) {
    res.status(400).json({ message: 'Invalid post id.' });
  }
});

// POST /api/posts - create a post (must be logged in).
// Either "content" (caption text) or "image" (base64 data URI) is required -
// but not both. This supports text-only, image-only, and mixed posts.
router.post(
  '/',
  requireAuth,
  [
    body('content').optional({ nullable: true }).trim().isLength({ max: 5000 }),
    body('image')
      .optional({ nullable: true })
      .isString()
      .custom((value) => !value || value.startsWith('data:image/'))
      .withMessage('Image must be a valid image data URI'),
  ],
  requireContentOrImage,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const post = await Post.create({
        content: req.body.content || '',
        image: req.body.image || null,
        author: req.user.id,
      });
      const populated = await post.populate('author', 'name email avatar');
      res.status(201).json(shapePost(populated, req.user.id));
    } catch (err) {
      res.status(500).json({ message: 'Could not create post.', error: err.message });
    }
  }
);

// PUT /api/posts/:id - edit a post (only the original author can edit)
router.put(
  '/:id',
  requireAuth,
  [
    body('content').optional({ nullable: true }).trim().isLength({ max: 5000 }),
  ],
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found.' });

      if (post.author.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You can only edit your own posts.' });
      }

      if (typeof req.body.content === 'string') post.content = req.body.content;
      if (typeof req.body.image !== 'undefined') post.image = req.body.image || null;

      if (!post.content.trim() && !post.image) {
        return res.status(400).json({ message: 'A post needs some text, an image, or both.' });
      }

      await post.save();

      const populated = await post.populate('author', 'name email avatar');
      res.json(shapePost(populated, req.user.id));
    } catch (err) {
      res.status(500).json({ message: 'Could not update post.', error: err.message });
    }
  }
);

// DELETE /api/posts/:id - delete a post (only the original author) + its comments
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own posts.' });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.json({ message: 'Post deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete post.', error: err.message });
  }
});

// POST /api/posts/:id/like - toggle like/unlike for the logged-in user.
// Returns the authoritative post-toggle state so the frontend can reconcile
// with the server instead of trusting its own optimistic guess.
router.post('/:id/like', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    if (!Array.isArray(post.likes)) post.likes = [];

    const alreadyLiked = post.likes.some((id) => id.toString() === req.user.id);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json({ likeCount: post.likes.length, likedByMe: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ message: 'Could not update like.', error: err.message });
  }
});

module.exports = router;
