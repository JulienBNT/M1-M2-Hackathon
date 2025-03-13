const Post = require('../models/postModel');
const Repost = require('../models/repostModel');

const createRepost = async (req, res) => {
  try {
    const { content, originalPostId } = req.body;
    const author = req.user.id;

    const originalPost = await Post.findById(originalPostId).populate('author');
    if (!originalPost) {
      return res.status(404).json({ error: 'Original post not found' });
    }

    const repost = new Repost({
      content,
      author,
      originalPost: originalPostId,
    });

    await repost.save();

    originalPost.reposts.push(repost._id);
    await originalPost.save();

    // WebSocket notification
    const io = req.app.get('socketio');
    if (originalPost.author._id.toString() !== author) {
      io.to(originalPost.author._id.toString()).emit('notification', {
        message: `User ${req.user.username} reposted your post`,
        postId: originalPost._id,
      });
    }

    res.status(201).json(repost);
  } catch (error) {
    res.status(400).json({ error: 'Error creating repost' });
  }
};

const getReposts = async (req, res) => {
  try {
    const reposts = await Repost.find()
      .populate('author', 'username')
      .populate('originalPost');
    res.status(200).json(reposts);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching reposts' });
  }
};

const deleteRepost = async (req, res) => {
  try {
    const repost = await Repost.findById(req.params.id);

    if (!repost) {
      return res.status(404).json({ error: 'Repost not found' });
    }

    if (repost.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await repost.deleteOne();
    res.status(200).json({ message: 'Repost deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting repost' });
  }
};

const viewRepost = async (req, res) => {
  try {
    const repost = await Repost.findById(req.params.id)
      .populate('author', 'username')
      .populate('originalPost');

    if (!repost) {
      return res.status(404).json({ error: 'Repost not found' });
    }

    res.status(200).json(repost);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching repost' });
  }
};

const modifyRepost = async (req, res) => {
  try {
    const { content } = req.body;
    const repost = await Repost.findById(req.params.id);

    if (!repost) {
      return res.status(404).json({ error: 'Repost not found' });
    }

    if (repost.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    repost.content = content;
    await repost.save();
    res.status(200).json(repost);
  } catch (error) {
    res.status(400).json({ error: 'Error updating repost' });
  }
};

module.exports = { createRepost, getReposts, deleteRepost, viewRepost, modifyRepost };