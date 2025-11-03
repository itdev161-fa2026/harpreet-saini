// middleware/auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = (req, res, next) => {
  let token;

  // 1️⃣ Try x-auth-token header first
  token = req.header("x-auth-token");

  // 2️⃣ If not present, try Authorization header
  if (!token && req.header("Authorization")) {
    const authHeader = req.header("Authorization"); // e.g., "Bearer <token>"
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]; // Extract token after "Bearer "
    }
  }

  // 3️⃣ No token found
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // attach user payload to request
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

export default auth;
