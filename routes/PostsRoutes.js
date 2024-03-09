// postsRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('./Authmiddleware');
const Post = require('../models/Posts');

// GET paginated posts
router.get('/posts', authMiddleware, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;

  try {
    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / pageSize);

    const posts = await Post.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({ posts, totalPages });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
