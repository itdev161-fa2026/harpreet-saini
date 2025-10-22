import express from 'express';

const router = express.Router();

// Temporary in-memory posts store
const posts = [];

// GET all posts
router.get('/', (req, res) => {
  res.json(posts);
});

// POST a new post
router.post('/', (req, res) => {
  const newPost = req.body;

  // Basic validation
  if (!newPost.title || !newPost.content || !newPost.author) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  posts.push(newPost);
  res.status(201).json(newPost);
});

export default router;
