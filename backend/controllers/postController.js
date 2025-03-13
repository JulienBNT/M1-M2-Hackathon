const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");
const Repost = require("../models/repostModel");
const Bookmark = require("../models/bookmarkModel");

const createPost = async (req, res) => {
  try {
    const { content, hashtags } = req.body;
    const author = req.user.id;

    const post = new Post({
      content,
      author,
      hashtags,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: "Error creating post" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting post" });
  }
};

const viewPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username",
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: "Error fetching post" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username firstname lastname profilePicture")
      .sort("-createdAt");
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ error: "Error fetching posts" });
  }
};

const getAllPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId }).populate(
      "author",
      "username firstname lastname profilePicture",
    );

    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ error: "Error fetching posts" });
  }
};

const modifyPost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    post.content = content;
    post.updatedAt = Date.now();
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: "Error updating post" });
  }
};

const getPostCountByUser = async (req, res) => {
  try {
    const count = await Post.countDocuments({ author: req.params.userId });
    res.status(200).json({ count });
  } catch (error) {
    res.status(400).json({ error: "Error counting posts" });
  }
};

const getHashtagsByPostId = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ hashtags: post.hashtags || [] });
  } catch (error) {
    console.error("Error fetching hashtags:", error);
    res.status(400).json({ error: "Error fetching hashtags" });
  }
};

module.exports = {
  createPost,
  deletePost,
  viewPost,
  getAllPosts,
  modifyPost,
  getAllPostsByUser,
  getPostCountByUser,
  getHashtagsByPostId,
};
