const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

const createComment = async (req, res) => {
    try {
      const { content, postId, author } = req.body;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Original post not found' });
      }
  
      const comment = new Comment({
        content,
        author,
        post: postId,
      });
  
      await comment.save();
  
      if (!post.comments) {
        post.comments = [];
      }
  
      post.comments.push(comment._id);
      await post.save();
  
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ error: 'Error creating comment' });
    }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('author', 'username')
      .populate('post');
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching comments' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Enlever cette ligne dés que le middleware d'authentification est en place
    req.user = { id: '67cf055df341c617ffe64da9' };

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting comment' });
  }
};

const getCommentsByUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const comments = await Comment.find({ author: userId })
        .populate('author', 'username')
        .populate('post');
      res.status(200).json(comments);
    } catch (error) {
      res.status(400).json({ error: 'Error fetching comments by user' });
    }
  };

const viewComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('author', 'username')
      .populate('post');

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching comment' });
  }
};

const modifyComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Enlever cette ligne dés que le middleware d'authentification est en place
    req.user = { id: '67cf055df341c617ffe64da9' };

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    comment.content = content;
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ error: 'Error updating comment' });
  }
};

module.exports = { createComment, getComments, deleteComment, getCommentsByUser, viewComment, modifyComment };