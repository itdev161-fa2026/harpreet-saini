import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // updated import
import { registerUser as registerUserAPI, loginUser as loginUserAPI } from "../services/api";

export const AuthContext = createContext();

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
        const decoded = jwtDecode(storedToken);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
        } else {
          setToken(storedToken);
          setUser(decoded.user);
        }
      } catch (err) {
        console.error("Error decoding token:", err);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await registerUserAPI(name, email, password);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(jwtDecode(data.token).user);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || "Registration failed";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await loginUserAPI(email, password);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(jwtDecode(data.token).user);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || "Login failed";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
