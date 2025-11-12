// src/services/api.js
import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------------------------
// POSTS API
// ------------------------

// Get all posts
export const getPosts = async () => {
  const res = await api.get("/posts");
  return res.data;
};

// Get single post by ID
export const getPostById = async (id) => {
  const res = await api.get(`/posts/${id}`);
  return res.data;
};

// Create a new post
export const createPost = async (title, body) => {
  const res = await api.post("/posts", { title, body });
  return res.data;
};

// Update a post by ID
export const updatePost = async (id, title, body) => {
  const res = await api.put(`/posts/${id}`, { title, body });
  return res.data;
};

// Delete a post by ID
export const deletePost = async (id) => {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
};

// ------------------------
// TEMPORARY AUTH STUBS
// ------------------------

// Fake registration
export const registerUserAPI = async (name, email, password) => {
  // TODO: replace with real API call when backend ready
  return { token: "FAKE.JWT.TOKEN" };
};

// Fake login
export const loginUserAPI = async (email, password) => {
  // TODO: replace with real API call when backend ready
  return { token: "FAKE.JWT.TOKEN" };
};
