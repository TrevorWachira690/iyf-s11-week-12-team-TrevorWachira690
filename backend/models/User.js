const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // never returned by default in queries
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
    // Stored as a base64 data URI string (e.g. "data:image/jpeg;base64,...").
    // Kept modest in size by the frontend, which compresses/resizes images
    // before upload.
    avatar: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash the password automatically whenever it is created or changed.
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Helper used at login time to compare a plain text password to the stored hash.
userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
