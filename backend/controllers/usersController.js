const User = require('../models/User');
const Post = require('../models/Post');
const { requireAuth } = require('../middleware/auth');

// GET /users/me
// Get the current authenticated user's profile
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        avatar: user.avatar,
        location: user.location,
        businessType: user.businessType,
        whatsappNumber: user.whatsappNumber,
        description: user.description,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /users/:id
// Get a public user profile by ID
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        avatar: user.avatar,
        location: user.location,
        businessType: user.businessType,
        whatsappNumber: user.whatsappNumber,
        description: user.description,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// PUT /users/me
// Update the current authenticated user's profile
const updateMe = async (req, res, next) => {
  try {
    const allowedFields = ['username', 'businessName', 'email', 'avatar', 'location', 'businessType', 'whatsappNumber', 'description'];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        avatar: user.avatar,
        location: user.location,
        businessType: user.businessType,
        whatsappNumber: user.whatsappNumber,
        description: user.description,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /users/export
// Export the current user's data including their listings
const exportData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const listings = await Post.find({ author: req.user._id });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        avatar: user.avatar,
        location: user.location,
        businessType: user.businessType,
        whatsappNumber: user.whatsappNumber,
        description: user.description,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      listings,
      exportedAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
};

// POST /users/import
// Import data for the current user
const importData = async (req, res, next) => {
  try {
    const { user: userData, listings } = req.body;

    if (!userData || !Array.isArray(listings)) {
      return res.status(400).json({ error: 'Invalid import format.' });
    }

    // Update user fields if provided
    const allowedUserFields = ['businessName', 'email', 'avatar', 'location', 'businessType', 'whatsappNumber', 'description'];
    const userUpdates = {};
    for (const field of allowedUserFields) {
      if (userData[field] !== undefined) {
        userUpdates[field] = userData[field];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      userUpdates,
      { new: true, runValidators: true }
    ).select('-password');

    // Import listings
    const importedListings = [];
    for (const listing of listings) {
      const created = await Post.create({
        ...listing,
        author: req.user._id,
      });
      importedListings.push(created);
    }

    res.json({
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        businessName: updatedUser.businessName,
        avatar: updatedUser.avatar,
        location: updatedUser.location,
        businessType: updatedUser.businessType,
        whatsappNumber: updatedUser.whatsappNumber,
        description: updatedUser.description,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
      listings: importedListings,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMe,
  getUser,
  updateMe,
  exportData,
  importData,
};
