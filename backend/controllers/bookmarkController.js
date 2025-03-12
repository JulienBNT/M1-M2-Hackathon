const Bookmark = require('../models/bookmarkModel');
const Post = require('../models/postModel');

const createBookmark = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const bookmark = new Bookmark({
      user: userId,
      post: postId,
    });

    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Post already bookmarked' });
    }
    res.status(400).json({ error: 'Error creating bookmark' });
  }
};

const deleteBookmark = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id;

    const bookmark = await Bookmark.findOneAndDelete({ user: userId, post: postId });

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    res.status(200).json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting bookmark' });
  }
};

const getUserBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookmarks = await Bookmark.find({ user: userId }).populate('post');
    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching bookmarks' });
  }
};

module.exports = { createBookmark, deleteBookmark, getUserBookmarks };