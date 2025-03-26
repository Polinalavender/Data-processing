import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    language: "en",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/register`, formData);
      const { user, token, refreshToken } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      navigate("/subscription");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <form className="bg-gray-800 p-8 rounded-lg shadow-lg w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6">Create Account</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="w-full p-2 mb-4 bg-gray-700 rounded"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="w-full p-2 mb-4 bg-gray-700 rounded"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 mb-4 bg-gray-700 rounded"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 mb-4 bg-gray-700 rounded"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select
          name="language"
          className="w-full p-2 mb-4 bg-gray-700 rounded"
          value={formData.language}
          onChange={handleChange}
        >
          <option value="en">English</option>
          <option value="bn">বাংলা</option>
        </select>

        <button
          className="w-full bg-red-600 p-2 rounded hover:bg-red-700"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-red-500 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
