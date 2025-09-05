import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import AnimatedBackground from './AnimatedBackground';

const WorkerLoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {setToken,setUser}= useContext(AuthContext)
    
    // User interaction
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading('Logging in...');
        try {
            const data = { email, password, role: 'worker' };
            const res = await axios.post('https://emis-sh54.onrender.com/api/user', data);
            if (res.data.user) {
                setLoading('');
                setSuccess(res.data.message);
                
                const { token, user } = res.data
                setToken(token)
                setUser(user)
                localStorage.setItem("token",token)
                localStorage.setItem("user",JSON.stringify(user))

                alert('Login successful. You will be redirected to the dashboard');
                navigate('/worker/dashboard');
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
                <h2 className="text-3xl font-bold text-white mb-2">Worker Login</h2>
                <p className="text-gray-200">Access your worker dashboard</p>
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
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 text-lg">Login</span>
                </button>
    
                <div className="text-center">
                  <p className="text-gray-200">
                    Don't have an account?{' '}
                    <Link to="/register/worker" className="text-purple-400 hover:text-purple-300 transition-colors duration-300 font-semibold">
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

export default WorkerLoginComponent;