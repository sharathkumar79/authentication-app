// Post.js

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  // Add more fields as needed
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
