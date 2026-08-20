// Owned by: Part 1, Person A
// See: docs/part-1-accounts-and-login/person-a-backend.md
//
// This file describes what information gets saved about a user
// (username, email, password, role, etc.).

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['business', 'customer'],
      default: 'customer',
    },
    businessName: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Scramble the password right before saving, but only if it changed
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare a typed-in password against the scrambled one we saved
userSchema.methods.comparePassword = async function (candidatePassword) {
return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);