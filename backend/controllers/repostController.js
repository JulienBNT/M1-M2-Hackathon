const Post = require('../models/postModel');
const Repost = require('../models/repostModel');

const createRepost = async (req, res) => {
  try {
    const { content, originalPostId, author } = req.body;

    // // Remettre dés que le middleware d'authentification est en place
    // const { content, originalPostId } = req.body;
    // const author = req.user.id;

    // Find the original post
    const originalPost = await Post.findById(originalPostId);
    if (!originalPost) {
      return res.status(404).json({ error: 'Original post not found' });
    }

    // Create the repost
    const repost = new Repost({
      content,
      author,
      originalPost: originalPostId,
    });

    await repost.save();

    // Add the repost to the original post's reposts array
    originalPost.reposts.push(repost._id);
    await originalPost.save();

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

        // Enlever cette ligne dés que le middleware d'authentification est en place
      req.user = { id: '67cf055df341c617ffe64da9' };
  
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
  
        // Enlever cette ligne dés que le middleware d'authentification est en place
      req.user = { id: '67cf055df341c617ffe64da9' };

      console.log('Repost author:', repost.author.toString());
      console.log('Request user ID:', req.user.id);
  
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