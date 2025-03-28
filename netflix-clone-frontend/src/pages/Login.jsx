import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MAX_FAILED_ATTEMPTS = 3;
const LOCK_TIME = 15 * 60 * 1000;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockTime, setLockTime] = useState(null);
  const navigate = useNavigate();

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setLockTime(null);  // Reset lock time

    const failedAttempts = parseInt(localStorage.getItem("failedAttempts") || "0", 10);
    const storedLockTime = parseInt(localStorage.getItem("lockTime") || "0", 10);

    // Check if the account is locked
    if (storedLockTime > new Date().getTime()) {
      const timeRemaining = Math.ceil((storedLockTime - new Date().getTime()) / 1000);
      setLockTime(timeRemaining); // Set remaining lock time in seconds
      setLoading(false);
      return;
    }

    // If the account is not locked, proceed with login attempt
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
        email,
        password,
      });

      const { user, token, refreshToken } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Reset failed attempts on successful login
      localStorage.setItem("failedAttempts", "0");

      navigate("/subscription");
    } catch (err) {
      // Increment failed login attempts and check if the user needs to be locked
      if (failedAttempts + 1 >= MAX_FAILED_ATTEMPTS) {
        const lockUntil = new Date().getTime() + LOCK_TIME;
        localStorage.setItem("lockTime", lockUntil.toString()); // Set lock time for 15 minutes
      }

      // Increment failed attempts count
      localStorage.setItem("failedAttempts", (failedAttempts + 1).toString());

      setError(
        err.response?.data?.emailOrPassword || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <form
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-96"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {lockTime && (
          <p className="text-yellow-500 mb-4">
            Your account is temporarily locked. Please try again in {lockTime} seconds.
          </p>
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 bg-gray-700 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 bg-gray-700 rounded pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "👁️" : "🙈"}
          </span>
        </div>
        <button
          className="w-full bg-red-600 p-2 rounded hover:bg-red-700"
          disabled={loading || lockTime}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-sm text-gray-400 mt-4 text-center">
          Don't have an account?{" "}
          <span
            className="text-red-500 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
