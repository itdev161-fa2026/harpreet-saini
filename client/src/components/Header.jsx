import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider"; // make sure path matches
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  // Safe fallback using optional chaining
  const context = useContext(AuthContext);
  const user = context?.user;
  const logout = context?.logout;

  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) logout();
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
      </nav>
    </header>
  );
};

export default Header;
