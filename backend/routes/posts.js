const express = require('express');
const Post = require('../models/Post');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/posts
// Currently returns all published listings, unpaginated. This works fine for a small
// number of listings but will get slow as the app grows.
//
// TODO(Student 5 - Backend & Data Storage): Add pagination.
// Follow the guided walkthrough in docs/backend-storage.md
// ("Pagination" section) to implement it yourself using
// req.query.page and req.query.limit with .skip() and .limit().
// Expected response shape once done:
//   { listings: [...], page, totalPages, totalListings }
router.get('/', async (req, res, next) => {
  try {
    const listings = await Post.find({ status: 'published' })
      .populate('author', 'username businessName')
      .sort({ createdAt: -1 });

    res.json({ listings });
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/search?q=...
// Search listings by title, description, or category using case-insensitive regex.
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required.' });
    }
    
    // Use regex for case-insensitive search across title, description, and category
    const regex = new RegExp(q, 'i');
    
    const listings = await Post.find({
      status: 'published',
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { category: { $regex: regex } }
      ]
    })
    .populate('author', 'username businessName')
    .sort({ createdAt: -1 });

    res.json({ listings });
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/:id
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username businessName');
    if (!post) {
      return res.status(404).json({ error: 'Listing not found.' });
    }
    res.json({ post });
  } catch (err) {
    next(err);
  }
});

// POST /api/posts (protected)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { title, description, price, category, image, images } = req.body;
    if (!title || !description || price === undefined || !category) {
      return res.status(400).json({ error: 'Title, description, price, and category are all required.' });
    }

    const imageArray = images || (image ? [image] : []);

    const post = await Post.create({
      title,
      description,
      price,
      category,
      image: image || imageArray[0] || '',
      images: imageArray,
      author: req.user._id,
    });

    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
});

// PUT /api/posts/:id (protected, author only)
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Listing not found.' });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only edit your own listings.' });
    }

    const { title, description, price, category, image, images, status } = req.body;
    if (title) post.title = title;
    if (description) post.description = description;
    if (price !== undefined) post.price = price;
    if (category) post.category = category;
    if (image !== undefined) post.image = image;
    if (images !== undefined) {
      post.images = images;
      if (images.length > 0 && !post.image) post.image = images[0];
    }
    if (status) post.status = status;

    await post.save();
    res.json({ post });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/posts/:id (protected, author only)
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Listing not found.' });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own listings.' });
    }

    await post.deleteOne();
    res.json({ message: 'Listing deleted.' });
  } catch (err) {
    next(err);
  }
});

// POST /api/posts/:id/like (protected) - Toggle like
router.post('/:id/like', requireAuth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Listing not found.' });
    }

    const userId = req.user._id;
    const isLiked = post.likedBy.includes(userId);
    const isDisliked = post.dislikedBy.includes(userId);

    if (isLiked) {
      // Remove like
      post.likedBy.pull(userId);
      post.likeCount = Math.max(0, post.likeCount - 1);
    } else {
      // Add like
      post.likedBy.push(userId);
      post.likeCount += 1;
      
      // Remove dislike if user had disliked before
      if (isDisliked) {
        post.dislikedBy.pull(userId);
        post.dislikeCount = Math.max(0, post.dislikeCount - 1);
      }
    }

    await post.save();
    res.json({ 
      post: {
        _id: post._id,
        likeCount: post.likeCount,
        dislikeCount: post.dislikeCount,
        likedBy: post.likedBy,
        dislikedBy: post.dislikedBy,
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/posts/:id/dislike (protected) - Toggle dislike
router.post('/:id/dislike', requireAuth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Listing not found.' });
    }

    const userId = req.user._id;
    const isLiked = post.likedBy.includes(userId);
    const isDisliked = post.dislikedBy.includes(userId);

    if (isDisliked) {
      // Remove dislike
      post.dislikedBy.pull(userId);
      post.dislikeCount = Math.max(0, post.dislikeCount - 1);
    } else {
      // Add dislike
      post.dislikedBy.push(userId);
      post.dislikeCount += 1;
      
      // Remove like if user had liked before
      if (isLiked) {
        post.likedBy.pull(userId);
        post.likeCount = Math.max(0, post.likeCount - 1);
      }
    }

    await post.save();
    res.json({ 
      post: {
        _id: post._id,
        likeCount: post.likeCount,
        dislikeCount: post.dislikeCount,
        likedBy: post.likedBy,
        dislikedBy: post.dislikedBy,
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;


