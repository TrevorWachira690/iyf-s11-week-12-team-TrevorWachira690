// GILBERT — Backend: Messaging
// Handles listing conversations, viewing messages with one person, sending a message :

const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const User = require('../models/User');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// GET /api/messages/conversations - one row per person you've messaged with,
// showing their info, the last message, and how many are unread from them.
router.get('/conversations', requireAuth, async (req, res) => {
  try {
    const myId = new mongoose.Types.ObjectId(req.user.id);

    const conversations = await Message.aggregate([
      { $match: { $or: [{ sender: myId }, { recipient: myId }] } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ['$sender', myId] }, '$recipient', '$sender'],
          },
          lastMessage: { $first: '$text' },
          lastMessageAt: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$recipient', myId] }, { $eq: ['$read', false] }] }, 1, 0],
            },
          },
        },
      },
      { $sort: { lastMessageAt: -1 } },
    ]);

    const userIds = conversations.map((c) => c._id);
    const users = await User.find({ _id: { $in: userIds } }).select('name avatar');
    const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), u]));

    const shaped = conversations
      .filter((c) => userMap[c._id.toString()]) // skip if the other user was deleted
      .map((c) => ({
        user: userMap[c._id.toString()],
        lastMessage: c.lastMessage,
        lastMessageAt: c.lastMessageAt,
        unreadCount: c.unreadCount,
      }));

    res.json(shaped);
  } catch (err) {
    res.status(500).json({ message: 'Could not load conversations.', error: err.message });
  }
});

// GET /api/messages/:userId - full thread with one specific user.
// Marks any messages they sent you as read.
router.get('/:userId', requireAuth, async (req, res) => {
  try {
    const otherId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: otherId },
        { sender: otherId, recipient: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    await Message.updateMany(
      { sender: otherId, recipient: req.user.id, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (err) {
    res.status(400).json({ message: 'Invalid user id.' });
  }
});

// POST /api/messages/:userId - send a message to a specific user
router.post(
  '/:userId',
  requireAuth,
  [body('text').trim().notEmpty().withMessage('Message cannot be empty')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    if (req.params.userId === req.user.id) {
      return res.status(400).json({ message: "You can't message yourself." });
    }

    try {
      const recipient = await User.findById(req.params.userId);
      if (!recipient) return res.status(404).json({ message: 'Recipient not found.' });

      const message = await Message.create({
        sender: req.user.id,
        recipient: req.params.userId,
        text: req.body.text,
      });

      res.status(201).json(message);
    } catch (err) {
      res.status(500).json({ message: 'Could not send message.', error: err.message });
    }
  }
);

module.exports = router;

