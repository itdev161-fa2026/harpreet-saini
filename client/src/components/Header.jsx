import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // <- import toast

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!"); // <- show toast
    navigate("/");
  };

  return (
    <header>
      <h1>My Blog</h1>
      <nav>
        {user ? (
          <>
            <span>Hello, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
        {/* Dark Mode Toggle Button */}
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </nav>
    </header>
  );
};

export default Header;
