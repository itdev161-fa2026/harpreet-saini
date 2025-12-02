import { useState } from "react";
import Login from "../components/Login";

const LoginPage = () => {
  const [error, setError] = useState("");

  const handleLogin = async (email, password) => {
    try {
      // TODO: Replace this with your actual login API call
      console.log("Logging in user:", { email, password });

      // Clear error if successful
      setError("");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return <Login onLogin={handleLogin} error={error} />;
};

export default LoginPage;
