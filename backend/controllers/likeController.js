const Like = require("../models/likeModel");
const Post = require("../models/postModel");
const User = require("../models/userModel");

const createLike = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const like = new Like({
      user: userId,
      post: postId,
    });

    await like.save();

    if (post.author && post.author._id.toString() !== userId) {
      const likingUser = await User.findById(userId);
      
      const io = req.app.get("socketio");
      
      if (io) {
        const postContent = typeof post.content === 'string' 
          ? post.content.substring(0, 30) + (post.content.length > 30 ? "..." : "") 
          : "Ce post";
        
        const notificationContent = {
          type: "like",
          postId: post._id,
          postContent: postContent,
          userId: likingUser._id,
          userDisplayName: likingUser.firstname || likingUser.username,
          message: `${likingUser.firstname || likingUser.username} liked your post`,
          timestamp: new Date()
        };

        io.to(`user:${post.author._id}`).emit("notification", notificationContent);
        console.log(`Notification like sent to user:${post.author._id}`);
      }
    }

    res.status(201).json(like);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Post already liked" });
    }
    res.status(400).json({ error: "Error creating like" });
  }
};

const deleteLike = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id;

    const like = await Like.findOneAndDelete({ user: userId, post: postId });

    if (!like) {
      return res.status(404).json({ error: "Like not found" });
    }

    res.status(200).json({ message: "Like deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting like" });
  }
};

const getUserLikes = async (req, res) => {
  try {
    const userId = req.user.id;

    const likes = await Like.find({ user: userId }).populate("post");
    res.status(200).json(likes);
  } catch (error) {
    res.status(400).json({ error: "Error fetching likes" });
  }
};

const checkLikeStatus = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const like = await Like.findOne({
      user: userId,
      post: postId,
    });

    res.status(200).json({ isLiked: !!like });
  } catch (error) {
    console.error("Error checking like status:", error);
    res.status(400).json({ error: "Error checking like status" });
  }
};

const getLikeCount = async (req, res) => {
  try {
    const { postId } = req.params;

    const count = await Like.countDocuments({ post: postId });

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting likes:", error);
    res.status(400).json({ error: "Error counting likes" });
  }
};

module.exports = {
  createLike,
  deleteLike,
  getUserLikes,
  checkLikeStatus,
  getLikeCount,
};
