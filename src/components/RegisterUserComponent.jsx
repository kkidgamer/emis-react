import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/register.css'
import AnimatedBackground from "./AnimatedBackground";

const RegisterUserComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      const data = { ...formData, role: "client" };
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
    <AnimatedBackground>
      <div className="relative z-20 flex items-center justify-center px-4 sm:px-6 min-h-screen py-12 sm:py-20">
        <div className="relative bg-white/10 backdrop-blur-xl p-6 sm:p-8 max-w-md w-full rounded-3xl border border-white/20 shadow-2xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-1.5 sm:p-2 rounded-lg">
                  <i className="fas fa-home text-xl sm:text-2xl text-white"></i>
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                EMIS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Register Client</h2>
            <p className="text-sm sm:text-base text-gray-200">Create your client account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {[
              { name: 'name', icon: 'fas fa-user', placeholder: 'Enter your name', type: 'text' },
              { name: 'email', icon: 'fas fa-envelope', placeholder: 'Enter your email', type: 'email' },
              { name: 'phone', icon: 'fas fa-phone', placeholder: 'Enter your phone number', type: 'tel' },
              { name: 'address', icon: 'fas fa-home', placeholder: 'Enter your address', type: 'text' }
            ].map((field) => (
              <div key={field.name} className="relative">
                <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <i className={`${field.icon} text-gray-300 text-sm sm:text-base`}></i>
                </div>
                <input
                  type={field.type}
                  name={field.name}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-2xl bg-white/10 border border-white/20 
                            focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 
                            transition-all duration-300 placeholder-gray-300 text-white text-sm sm:text-base h-12"
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <div className="relative">
              <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 z-10">
                <i className="fas fa-lock text-gray-300 text-sm sm:text-base"></i>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 rounded-2xl bg-white/10 border border-white/20 
                          focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 
                          transition-all duration-300 placeholder-gray-300 text-white text-sm sm:text-base h-12"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors duration-300"
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-sm sm:text-base`}></i>
              </button>
            </div>

            <button 
              type="submit" 
              className="w-full group relative py-3 sm:py-4 font-bold text-white rounded-2xl overflow-hidden 
                        transform transition-all duration-300 hover:scale-105 mt-4 sm:mt-6 h-12"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 text-base sm:text-lg">Register</span>
            </button>

            <div className="text-center pt-3 sm:pt-4">
              <p className="text-sm sm:text-base text-gray-200">
                Already have an account?{' '}
                <Link to="/login/user" className="text-green-400 hover:text-green-300 transition-colors duration-300 font-semibold">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default RegisterUserComponent;