import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AnimatedBackground from './AnimatedBackground';

const RegisterWorkerComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profession: '',
    nationalId: '',
    experience: '',
    address: '',
    password: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // User interaction
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading('Registering worker account');
    try {
      const data = { ...formData, role: 'worker' };
      const res = await axios.post("https://emis-sh54.onrender.com/api/worker", data);
      if (res.data.worker) {
        setLoading('');
        setSuccess(res.data.message);
        console.log(res.data);
        alert('Worker account created successfully. You will be redirected to login page');
        navigate('/login/worker');
      } else {
        setLoading('');
        setError(res.data.message);
      }
    } catch (error) {
      setError(error.message);
      setLoading('');
      setSuccess('');
    }
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
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Register Worker</h2>
            <p className="text-sm sm:text-base text-gray-200">Join our network of skilled professionals</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {[
              { name: 'name', icon: 'fas fa-user', placeholder: 'Enter your name', type: 'text' },
              { name: 'email', icon: 'fas fa-envelope', placeholder: 'Enter your email', type: 'email' },
              { name: 'phone', icon: 'fas fa-phone', placeholder: 'Enter your phone number', type: 'tel' },
              { name: 'profession', icon: 'fas fa-briefcase', placeholder: 'Enter your profession', type: 'text' },
              { name: 'nationalId', icon: 'fas fa-id-card', placeholder: 'Enter your national ID', type: 'text' },
              { name: 'experience', icon: 'fas fa-clock', placeholder: 'Years of experience', type: 'number' },
              { name: 'address', icon: 'fas fa-map-marker-alt', placeholder: 'Enter your address', type: 'text' },
              { name: 'password', icon: 'fas fa-lock', placeholder: 'Enter your password', type: 'password' }
            ].map((field) => (
              <div key={field.name} className="relative">
                <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <i className={`${field.icon} text-gray-300 text-sm sm:text-base`}></i>
                </div>
                <input
                  type={field.type}
                  name={field.name}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3 rounded-2xl bg-white/10 border border-white/20 
                            focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 
                            transition-all duration-300 placeholder-gray-300 text-white text-sm sm:text-base h-12"
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <button 
              type="submit" 
              className="w-full group relative py-3 sm:py-4 font-bold text-white rounded-2xl overflow-hidden 
                        transform transition-all duration-300 hover:scale-105 mt-4 sm:mt-6 h-12"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 text-base sm:text-lg">Register</span>
            </button>

            <div className="text-center pt-3 sm:pt-4">
              <p className="text-sm sm:text-base text-gray-200">
                Already have an account?{' '}
                <Link to="/login/worker" className="text-purple-400 hover:text-purple-300 transition-colors duration-300 font-semibold">
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

export default RegisterWorkerComponent;