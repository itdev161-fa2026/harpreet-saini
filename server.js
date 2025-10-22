import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDatabase from './config/db.js';
import userRoutes from './routes/userRoutes.js';      // User routes
import postRoutes from './routes/postRoutes.js';      // Post routes

dotenv.config();

connectDatabase(); // Connect to MongoDB

const app = express();

app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Basic root endpoint
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Use post routes for all /api/posts requests
app.use('/api/posts', postRoutes);

// Use user routes for all /api/users requests
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
