import express from 'express';
import mongoose from 'mongoose';
import { check, validationResult } from 'express-validator';
import User from './models/User.js';
import connectDatabase from './config/db.js';

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDatabase();

// Test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Registration route with validation
app.post(
  '/api/users',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6+ characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    return res.json({ name, email, password });
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

