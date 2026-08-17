// Owned by: Part 2, Person A (shared with Part 3 for the like/dislike routes)
// See: docs/part-2-listings-page/
//
// This file connects web addresses (like /api/posts) to the functions
// in postsController.js that actually do the work.

const express = require("express");
const router = express.Router();

const {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
} = require("../controllers/postsController");

const { requireAuth } = require("../middleware/auth");

// Public routes

router.get("/", getPosts);
router.get("/:id", getPost);

// Protected routes
router.post("/", requireAuth, createPost);
router.put("/:id", requireAuth, updatePost);
router.delete("/:id", requireAuth, deletePost);

module.exports = router;