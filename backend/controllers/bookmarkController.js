const Bookmark = require("../models/bookmarkModel");
const Post = require("../models/postModel");
const User = require("../models/userModel");

const addBookmark = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const post = await Post.findById(postId).populate("author");
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const existingBookmark = await Bookmark.findOne({
      user: userId,
      post: postId,
    });

    if (existingBookmark) {
      return res.status(400).json({ error: "Post already bookmarked" });
    }

    const bookmark = new Bookmark({
      user: userId,
      post: postId,
    });

    await bookmark.save();

    if (post.author && post.author._id.toString() !== userId) {
      const bookmarkingUser = await User.findById(userId);
      
      const io = req.app.get("socketio");
      
      if (io) {
        const postContent = typeof post.content === 'string' 
          ? post.content.substring(0, 30) + (post.content.length > 30 ? "..." : "") 
          : "Ce post";
        
        const notificationContent = {
          type: "bookmark",
          postId: post._id,
          postContent: postContent,
          userId: bookmarkingUser._id,
          userDisplayName: bookmarkingUser.firstname || bookmarkingUser.username,
          message: `${bookmarkingUser.firstname || bookmarkingUser.username} bookmarked your post`,
          timestamp: new Date()
        };

        io.to(`user:${post.author._id}`).emit("notification", notificationContent);
        console.log(`Notification sent to user:${post.author._id}`);
      }
    }
    res.status(201).json({ message: "Post bookmarked successfully" });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    res.status(400).json({ error: "Error adding bookmark" });
  }
};

const removeBookmark = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const result = await Bookmark.findOneAndDelete({
      user: userId,
      post: postId,
    });

    if (!result) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    res.status(200).json({ message: "Bookmark removed successfully" });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    res.status(400).json({ error: "Error removing bookmark" });
  }
};

const getUserBookmarks = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    const bookmarks = await Bookmark.find({ user: userId })
      .populate({
        path: "post",
        populate: {
          path: "author",
          select: "username firstname lastname profilePicture",
        },
      })
      .sort("-createdAt");

    const bookmarkedPosts = bookmarks
      .map((bookmark) => {
        if (!bookmark.post) return null;

        return {
          ...bookmark.post._doc,
          isBookmarked: true,
        };
      })
      .filter((post) => post !== null);

    res.status(200).json(bookmarkedPosts);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(400).json({ error: "Error fetching bookmarks" });
  }
};

const checkPostBookmarkStatus = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const bookmark = await Bookmark.findOne({
      user: userId,
      post: postId,
    });

    res.status(200).json({ isBookmarked: !!bookmark });
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    res.status(400).json({ error: "Error checking bookmark status" });
  }
};

const getBookmarkCount = async (req, res) => {
  try {
    const postId = req.params.postId;

    const count = await Bookmark.countDocuments({ post: postId });

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting bookmarks:", error);
    res.status(400).json({ error: "Error counting bookmarks" });
  }
};

module.exports = {
  addBookmark,
  removeBookmark,
  getUserBookmarks,
  checkPostBookmarkStatus,
  getBookmarkCount,
};
