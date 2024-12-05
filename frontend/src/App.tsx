"use client";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/NavBar";
import Login from "./components/Login";
import Register from "./components/Register";
import Timeline from "./components/Timeline";
import Profile from "./components/Profile";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {isAuthenticated && <Navbar />}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/timeline"
              element={
                isAuthenticated ? <Timeline /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/profile/:userId"
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
