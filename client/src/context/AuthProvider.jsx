// src/context/AuthProvider.jsx
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ Named import
import { registerUserAPI, loginUserAPI } from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken); // ✅ using named import
        // Check token expiration
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
        } else {
          setToken(storedToken);
          setUser(decoded.user || null);
        }
      } catch (err) {
        console.error("Error decoding token:", err);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (name, email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await registerUserAPI(name, email, password);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(jwtDecode(data.token).user || null);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || "Registration failed";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await loginUserAPI(email, password);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(jwtDecode(data.token).user || null);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || "Login failed";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
