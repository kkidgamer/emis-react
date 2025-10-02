import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import { toast } from 'react-toastify';
// import './system-ui.css';

// Add Font Awesome CSS
const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.rel = 'stylesheet';
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
if (!document.querySelector('link[href*="font-awesome"]')) {
  document.head.appendChild(fontAwesomeLink);
}

const LoginAdminComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.info('Logging in...', {
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '16px',
      },
    });
    try {
      const data = { email, password, role: 'admin' };
      const res = await axios.post('https://emis-sh54.onrender.com/api/user/admin', data);
      if (res.data.user) {
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        toast.dismiss();
        toast.success('Login successful! Redirecting...', {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        });
        navigate('/admin-dashboard');
      } else {
        toast.dismiss();
        toast.error(res.data.message || 'Login failed.', {
          style: {
            background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        });
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || error.message, {
        style: {
          background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
          color: 'white',
          borderRadius: '16px',
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 pt-12 sm:pt-20 sm:pt-24 md:pt-28">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
        <div className="absolute w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-3xl animate-pulse" style={{ left: '20%', top: '20%', transform: 'translate(-50%, -50%)' }}></div>
        <div className="absolute w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000" style={{ right: '20%', bottom: '20%' }}></div>
      </div>
      <div className="relative glass-card p-4 sm:p-6 sm:p-8 max-w-md w-full z-10">
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
        <h2 className="text-xl sm:text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="mb-0">
            <div className="relative">
              <i className="fas fa-envelope absolute left-3 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-200 text-sm sm:text-base"></i>
              <input
                type="email"
                className="w-full pl-8 sm:pl-10 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 placeholder-gray-300 text-gray-100 text-sm sm:text-base h-12"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-0">
            <div className="relative">
              <i className="fas fa-lock absolute left-3 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-200 text-sm sm:text-base"></i>
              <input
                type="password"
                className="w-full pl-8 sm:pl-10 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 placeholder-gray-300 text-gray-100 text-sm sm:text-base h-12"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="gradient-button w-full text-base sm:text-lg h-12">
            Login
          </button>
          <div className="text-center mt-3 sm:mt-4">
            <p className="text-gray-200 text-xs sm:text-sm sm:text-base">
              Don't have an account?{' '}
              <Link to="/register/admin" className="text-blue-300 hover:text-gray-100 transition-colors duration-300 no-underline">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginAdminComponent;