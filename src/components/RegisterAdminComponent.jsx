import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AnimatedBackground from './AnimatedBackground';

const RegisterAdminComponent = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        secretKey: ''
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
        setLoading('Registering admin account');
        try {
            const data = { formData, role: 'admin' };
            const res = await axios.post("https://emis-sh54.onrender.com/api/user/register", data);
            if (res.data.newUser) {
                setLoading('');
                setSuccess(res.data.message);
                console.log(res.data);
                alert('Admin account created successfully. You will be redirected to login page');
                navigate('/login/admin');
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
          <div className="relative z-20 flex items-center justify-center px-4 sm:px-6 min-h-screen py-20">
            <div className="relative bg-white/10 backdrop-blur-xl p-8 max-w-md w-full rounded-3xl border border-white/20 shadow-2xl">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-75"></div>
                    <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                      <i className="fas fa-home text-2xl text-white"></i>
                    </div>
                  </div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                    EMIS
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Register Admin</h2>
                <p className="text-gray-200">Create your admin account</p>
              </div>
    
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: 'name', icon: 'fas fa-user', placeholder: 'Enter your name', type: 'text' },
                  { name: 'email', icon: 'fas fa-envelope', placeholder: 'Enter your email', type: 'email' },
                  { name: 'password', icon: 'fas fa-lock', placeholder: 'Enter your password', type: 'password' },
                  { name: 'secretKey', icon: 'fas fa-key', placeholder: 'Enter your secret key', type: 'password' }
                ].map((field) => (
                  <div key={field.name} className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <i className={`${field.icon} text-gray-300`}></i>
                    </div>
                    <input
                      type={field.type}
                      name={field.name}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 
                                focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 
                                transition-all duration-300 placeholder-gray-300 text-white"
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ))}
    
                <button 
                  type="submit" 
                  className="w-full group relative py-4 font-bold text-white rounded-2xl overflow-hidden 
                            transform transition-all duration-300 hover:scale-105 mt-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 text-lg">Register</span>
                </button>
    
                <div className="text-center pt-4">
                  <p className="text-gray-200">
                    Already have an account?{' '}
                    <Link to="/login/admin" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-semibold">
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

export default RegisterAdminComponent;