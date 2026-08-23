const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    // No longer required - posts can be a caption-only "tweet", an
    // image-only post, or both. There's no separate "title" concept
    // anymore; content is the caption text.
    content: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Base64 data URI, compressed/resized client-side before upload. Optional.
    image: {
      type: String,
      default: null,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
