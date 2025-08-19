import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    language: "en",
    referredBy: "", // string in UI; we coerce to number|null before sending
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState([]); // <-- plain JS
  const [loading, setLoading] = useState(false);

  // Prefill referral from ?ref=
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) setFormData((p) => ({ ...p, referredBy: ref }));
  }, []);

  const handleChange = (e) => {
    setError("");
    setFieldErrors([]);
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors([]);
    setLoading(true);

    // quick client validation
    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const language = formData.language;

    const errs = [];
    if (!firstName) errs.push("First name is required.");
    if (!lastName) errs.push("Last name is required.");
    if (!email) errs.push("Email is required.");
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.push("Email format is invalid.");
    if (!password || password.length < 8) errs.push("Password must be at least 8 characters.");

    if (errs.length) {
      setFieldErrors(errs);
      setLoading(false);
      return;
    }

    // coerce referredBy to number|null
    let referredByToSend = null;
    if (formData.referredBy && String(formData.referredBy).trim() !== "") {
      const n = Number(String(formData.referredBy).trim());
      referredByToSend = Number.isFinite(n) ? n : null;
    }

    const payload = {
      firstName,
      lastName,
      email,
      password,
      language,
      referredBy: referredByToSend,
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/api/users/register`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const { user, token, refreshToken } = res.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      navigate("/subscription");
    } catch (err) {
      console.error(err);
      const data = err?.response?.data;
      const msg =
        (data && (data.message || data?.error?.message)) ||
        (Array.isArray(data?.errors) ? data.errors.join(", ") : null) ||
        "Registration failed.";

      setError(msg);

      if (Array.isArray(data?.errors)) {
        setFieldErrors(
          data.errors.map((x) => (typeof x === "string" ? x : x.message || JSON.stringify(x)))
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <form className="bg-gray-800 p-8 rounded-lg shadow-lg w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6">Create Account</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {fieldErrors.length > 0 && (
          <ul className="text-red-400 text-sm mb-3 list-disc list-inside space-y-1">
            {fieldErrors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        )}

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
          placeholder="Password (min 8 chars)"
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
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
        </select>

        {/* Referral Code (Optional) */}
        <input
          type="text"
          name="referredBy"
          placeholder="Referral Code (User ID)"
          className="w-full p-2 mb-4 bg-gray-700 rounded"
          value={formData.referredBy}
          onChange={handleChange}
        />

        <button className="w-full bg-red-600 p-2 rounded hover:bg-red-700" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <span className="text-red-500 hover:underline cursor-pointer" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
