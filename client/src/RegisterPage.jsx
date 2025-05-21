


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await fetch(`${backendURL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 201) {
        alert("Registered Successfully! Please login.");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="container">
      <div className="popup">
        <h2>Register</h2>
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email ID"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label>
          <input
            type="checkbox"
            onChange={() => setShowPassword(!showPassword)}
          />{" "}
          Show Password
        </label>
        <button className="btn" onClick={handleRegister}>
          Register
        </button>
        <p>
          Already have an account?{" "}
          <span className="link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
