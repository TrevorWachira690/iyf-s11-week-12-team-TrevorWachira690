const Post = require("../models/Post");

// Create a new post

const createPost = async (req, res) => {
  try {
    const { title, description, price, category, image, images } = req.body;

    const post = await Post.create({
      title,
      description,
      price,
      category,
      image,
      images,
      status: "active",
      author: req.user._id
    });

    res.status(201).json(post);
  }
  catch (error) {
    res.status(400).json({
        message: error.message
    });
  }
};

// Get all listings
const getPosts = async (req, res) => {
        try {
        const {
            search,
            category,
            page = 1,
            limit = 10
        } =req.query;

        const filter = {};

        // search by title or description
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } }
            ];
        }

        // filter by category
        if (category) {
            filter.category = category;
        }

        // pagination
        const skip = (page - 1) * limit;

        const posts = await Post.find(filter)
            .populate("author", "username businessName")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

            const totalPosts = await Post.countDocuments(filter);

            const totalPages = Math.ceil(totalPosts / limit);

                res.status(200).json({
          posts,
            pagination: {
                currentPage: Number(page),
                totalPages,
                totalPosts,
                limit: Number(limit)
            }
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get a single listing
const getPost = async (req, res) => {
    try {
        const post = await 
        Post.findById(req.params.id).populate(
            "author", 
            "username businessName"
        );
        if (!post) {
            return res.status(404).json({
                message: "Listing not found"
            });
        }
        res.status(200).json(post);
    } 
    catch (error) {
        res.status(400).json({
            message: "Invalid listing ID"
        });
    }
};

// Update a listing
const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Listing not found"
            });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can only update your own listings"
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            { 
                new: true,
                runValidators: true
            }
        ).populate("author", "username businessName");

        res.status(200).json(updatedPost);
    } 
    catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// Delete a listing
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Listing not found"
            });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can only delete your own listings"
            });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Listing deleted successfully"
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

module.exports = {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost
};



