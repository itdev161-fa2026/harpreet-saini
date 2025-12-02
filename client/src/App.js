import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext"; // <- import ThemeProvider
import { Toaster } from "react-hot-toast"; // <- import Toaster

// Pages
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

// Components
import Header from "./components/Header";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider> {/* <- wrap everything in ThemeProvider */}
        <Router>
          <Toaster position="top-right" /> {/* <- toast notifications */}
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
