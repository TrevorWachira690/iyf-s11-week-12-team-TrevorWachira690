const Comment = require('../models/Comment');
const Post = require('../models/Post');

// GET /comments/post/:postId
// Get all comments for a specific post
const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate('author', 'username businessName avatar')
      .sort({ createdAt: -1 });

    res.json({ comments });
  } catch (err) {
    next(err);
  }
};

// POST /comments
// Create a new comment
const createComment = async (req, res, next) => {
  try {
    const { content, postId } = req.body;
    const authorId = req.user._id;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content is required.' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Listing not found.' });
    }

    const comment = await Comment.create({
      content: content.trim(),
      author: authorId,
      post: postId,
    });

    const populated = await Comment.findById(comment._id).populate(
      'author',
      'username businessName avatar'
    );

    res.status(201).json({ comment: populated });
  } catch (err) {
    next(err);
  }
};

// DELETE /comments/:id
// Delete a comment (only by the author)
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own comments.' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment,
};

