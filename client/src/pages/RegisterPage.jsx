import { useState } from "react";
import Register from "../components/Register";

const RegisterPage = () => {
  const [error, setError] = useState("");

  const handleRegister = async (name, email, password) => {
    try {
      // TODO: Replace this with your actual registration API call
      console.log("Registering user:", { name, email, password });
      
      // Clear error if successful
      setError("");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return <Register onRegister={handleRegister} error={error} />;
};

export default RegisterPage;
