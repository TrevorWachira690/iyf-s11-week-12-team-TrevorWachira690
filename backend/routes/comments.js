const express = require('express');
const router = express.Router();

let comments = [
  { id: 1, postId: 1, author: "Alice", text: "Great post!", createdAt: new Date() }
];

let postLikes = { 1: 5 };

// GET comments for a post
router.get('/posts/:postId/comments', (req, res) => {
  const postId = parseInt(req.params.postId);
  const postComments = comments.filter(c => c.postId === postId);
  res.json(postComments);
});

// POST a new comment
router.post('/posts/:postId/comments', (req, res) => {
  const postId = parseInt(req.params.postId);
  const { author, text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Comment text is required" });
  }

  const newComment = {
    id: Date.now(),
    postId,
    author: author || "Anonymous",
    text,
    createdAt: new Date()
  };

  comments.push(newComment);
  res.status(201).json(newComment);
});

// DELETE a comment
router.delete('/comments/:id', (req, res) => {
  const commentId = parseInt(req.params.id);
  comments = comments.filter(c => c.id !== commentId);
  res.json({ message: "Comment deleted successfully", id: commentId });
});

// POST increment like
router.post('/posts/:postId/like', (req, res) => {
  const postId = parseInt(req.params.postId);
  postLikes[postId] = (postLikes[postId] || 0) + 1;
  res.json({ postId, likes: postLikes[postId] });
});

// GET total likes for a post
router.get('/posts/:postId/likes', (req, res) => {
  const postId = parseInt(req.params.postId);
  res.json({ postId, likes: postLikes[postId] || 0 });
});

module.exports = router;