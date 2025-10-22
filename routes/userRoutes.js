import express from 'express';
const router = express.Router();

// GET route
router.get('/', (req, res) => {
  res.send('User route is working!');
});

// POST route
router.post('/', (req, res) => {
  console.log('Received body:', req.body); // Debugging

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  res.status(201).json({
    message: 'User created successfully',
    user: { name, email }
  });
});

// ✅ Export the router (MUST HAVE THIS)
export default router;
