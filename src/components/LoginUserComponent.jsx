import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import { toast } from 'react-toastify';
import AnimatedBackground from './AnimatedBackground';
// import './system-ui.css';

// Add Font Awesome CSS
const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.rel = 'stylesheet';
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
if (!document.querySelector('link[href*="font-awesome"]')) {
  document.head.appendChild(fontAwesomeLink);
}

const LoginUserComponent = () => {
  const { setToken, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const data = { email, password, role: 'client' };
      const res = await axios.post('https://emis-sh54.onrender.com/api/user', data);
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
        navigate('/user-dashboard');
      } else {
        toast.dismiss();
        toast.error(res.data.message, {
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
    <AnimatedBackground>
      <div className="relative z-20 flex items-center justify-center px-4 sm:px-6 min-h-screen">
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
            <h2 className="text-3xl font-bold text-white mb-2">Client Login</h2>
            <p className="text-gray-200">Access your client dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <i className="fas fa-envelope text-gray-300"></i>
              </div>
              <input
                type="email"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 
                          focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 
                          transition-all duration-300 placeholder-gray-300 text-white"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <i className="fas fa-lock text-gray-300"></i>
              </div>
              <input
                type="password"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 
                          focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 
                          transition-all duration-300 placeholder-gray-300 text-white"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full group relative py-4 font-bold text-white rounded-2xl overflow-hidden 
                        transform transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 text-lg">Login</span>
            </button>

            <div className="text-center">
              <p className="text-gray-200">
                Don't have an account?{' '}
                <Link to="/register/user" className="text-green-400 hover:text-green-300 transition-colors duration-300 font-semibold">
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default LoginUserComponent;