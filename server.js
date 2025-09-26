// server.js
import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/db.js";

// Import routes
import authRoutes from "./routes/auth.js";
import Post from "./models/Post.js";
import auth from "./middleware/auth.js";
import { check, validationResult } from "express-validator";

dotenv.config();
connectDatabase();

const app = express();
app.use(express.json());

// Root test
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// AUTH ROUTES
app.use("/api/auth", authRoutes);

// POSTS ROUTES

// GET all posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createDate: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// GET single post
app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user", "name");
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// CREATE post
app.post(
  "/api/posts",
  [
    auth,
    check("title", "Title is required").not().isEmpty(),
    check("body", "Body is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { title, body } = req.body;
      const newPost = new Post({ user: req.user.id, title, body });
      const post = await newPost.save();
      await post.populate("user", "name");
      res.json(post);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

// UPDATE post
app.put(
  "/api/posts/:id",
  [
    auth,
    check("title", "Title is required").not().isEmpty(),
    check("body", "Body is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ msg: "Post not found" });
      if (post.user.toString() !== req.user.id)
        return res.status(401).json({ msg: "User not authorized" });

      post.title = req.body.title;
      post.body = req.body.body;
      await post.save();
      await post.populate("user", "name");
      res.json(post);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

// DELETE post
app.delete("/api/posts/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not authorized" });

    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: "Post removed" });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
