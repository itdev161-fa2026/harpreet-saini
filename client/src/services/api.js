import axios from "axios";

const API_URL = "http://localhost:3000/api";
const api = axios.create({ baseURL: API_URL });

// Add token to headers
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers["x-auth-token"] = token;
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Auth API
export const registerUser = async (name, email, password) => {
  const res = await api.post("/users", { name, email, password });
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await api.post("/auth", { email, password });
  return res.data;
};

// Posts API
export const getPosts = async () => (await api.get("/posts")).data;
export const getPostById = async (id) => (await api.get(`/posts/${id}`)).data;
