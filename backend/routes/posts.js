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

router.get("/", async (req, res) => {
    try {
        const {search, category, page = 1, limit = 10} = req.query;

        const query = {};

        // search by title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // filter by category
        if (category) {
            query.category = category;
        }

        // pagination
        const skip = (page - 1) * limit;

        const posts = await Post.find(query)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

        const totalPosts = await Post.countDocuments(query);

        res.json({
            posts,
            currentPage: Number(page),
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch posts",
            error: error.message
        });
    }
});

router.get("/:id", getPost);

// Protected routes
router.post("/", requireAuth, createPost);
router.put("/:id", requireAuth, updatePost);
router.delete("/:id", requireAuth, deletePost);

module.exports = router;