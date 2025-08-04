import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/register.css'

const RegisterUserComponent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  // User interaction
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading("Registering user account");
    try {
      const data = { name, email, phone, address, password, role: "client" };
      const res = await axios.post("https://emis-sh54.onrender.com/api/client", data);
      if (res.data.client) {
        setLoading("");
        setSuccess("ACCOUNT CREATED SUCCESSFULLY");
        alert("Account created successfully. You will be redirected to login page");
        navigate("/login/user");
      } else {
        setLoading("");
        setError(res.data.message);
      }
    } catch (error) {
      setError(error.message);
      setLoading("");
      setSuccess("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <form onSubmit={handleSubmit} className="card shadow bg-light p-4 rounded-3">
        <h1 className="text-center text-success mb-3">EMIS</h1>
        <h2 className="text-center mb-4 text-success">Register</h2>

        {/* Alerts */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}
        {loading && (
          <div className="alert alert-info" role="alert">
            {loading}
          </div>
        )}

        {/* Inputs with Icons */}
        <div className="input-group mb-3">
          <span className="input-group-text bg-success text-white" id="name-icon">
            <i className="bi bi-person" aria-hidden="true"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-label="Name"
            aria-describedby="name-icon"
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text bg-success text-white" id="email-icon">
            <i className="bi bi-envelope" aria-hidden="true"></i>
          </span>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email"
            aria-describedby="email-icon"
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text bg-success text-white" id="phone-icon">
            <i className="bi bi-telephone" aria-hidden="true"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            aria-label="Phone number"
            aria-describedby="phone-icon"
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text bg-success text-white" id="address-icon">
            <i className="bi bi-house" aria-hidden="true"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            aria-label="Address"
            aria-describedby="address-icon"
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text bg-success text-white" id="password-icon">
            <i className="bi bi-lock" aria-hidden="true"></i>
          </span>
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
            aria-describedby="password-icon"
          />
          <button
            type="button"
            className="btn btn-outline-success password-toggle"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
          </button>
        </div>

        <div className="d-grid mb-3">
          <button type="submit" className="btn btn-success btn-lg">
            Register
          </button>
        </div>
        <div className="text-center">
          <p>
            Already have an account?{" "}
            <Link to="/login/user" className="text-decoration-none text-success fw-bold">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterUserComponent;