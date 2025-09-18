import express from "express";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import User from "./models/User.js";
import connectDatabase from "./config/db.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDatabase();

// --------------------
// User Registration
// --------------------
app.post(
  "/api/users",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6+ characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email: email.toLowerCase() });
      if (user) return res.status(400).json({ msg: "User already exists" });

      // Create new user
      user = new User({ name, email: email.toLowerCase(), password });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save to DB
      await user.save();

      // Create JWT payload
      const payload = { user: { id: user.id } };

      // Sign token
      jwt.sign(
        payload,
        process.env.JWT_SECRET || "defaultsecret",
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.json({ msg: "User registered successfully", token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// --------------------
// User Login
// --------------------
app.post(
  "/api/auth",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      // Check if user exists
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(400).json({ msg: "Invalid credentials" });

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      // Create JWT payload
      const payload = { user: { id: user.id } };

      // Sign token
      jwt.sign(
        payload,
        process.env.JWT_SECRET || "defaultsecret",
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.json({ msg: "User logged in successfully", token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// --------------------
// Start server
// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
