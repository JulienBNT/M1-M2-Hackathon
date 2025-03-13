const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");
const Repost = require("../models/repostModel");
const Bookmark = require("../models/bookmarkModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../public/uploads/posts");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "post-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images sont autorisées!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

const uploadSingleImage = upload.single("image");

const createPost = async (req, res) => {
  try {
    uploadSingleImage(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ error: `Erreur d'upload: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }

      let { content, hashtags } = req.body;
      const author = req.user.id;

      if (typeof hashtags === "string") {
        try {
          hashtags = JSON.parse(hashtags);
        } catch (e) {
          hashtags = [];
        }
      }

      const postData = {
        content,
        author,
        hashtags: hashtags || [],
      };

      if (req.file) {
        const relativePath = `/uploads/posts/${req.file.filename}`;
        postData.image = relativePath;
      }

      const post = new Post(postData);
      await post.save();

      res.status(201).json(post);
    });
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
    res.status(500).json({ error: "Erreur lors de la création du post" });
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

    // Supprimer l'image associée si elle existe
    if (post.image) {
      const imagePath = path.join(__dirname, "../public", post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
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
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Utiliser multer pour gérer les mises à jour d'image
    uploadSingleImage(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      // Mettre à jour le contenu si fourni
      if (req.body.content) {
        post.content = req.body.content;
      }

      // Mettre à jour les hashtags si fournis
      if (req.body.hashtags) {
        let hashtags = req.body.hashtags;
        if (typeof hashtags === "string") {
          try {
            hashtags = JSON.parse(hashtags);
          } catch (e) {
            hashtags = [];
          }
        }
        post.hashtags = hashtags;
      }

      // Mettre à jour l'image si une nouvelle est fournie
      if (req.file) {
        // Supprimer l'ancienne image si elle existe
        if (post.image) {
          const oldImagePath = path.join(__dirname, "../public", post.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        // Définir le nouveau chemin d'image
        const relativePath = `/uploads/posts/${req.file.filename}`;
        post.image = relativePath;
      }

      post.updatedAt = Date.now();
      await post.save();

      res.status(200).json(post);
    });
  } catch (error) {
    console.error("Error updating post:", error);
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
