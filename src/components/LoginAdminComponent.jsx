import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import { toast } from 'react-toastify';

const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setToken, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.info('Logging in...');
        try {
            const data = { email, password, role: 'admin' };
            const res = await axios.post("https://emis-sh54.onrender.com/api/user/admin", data);
            if (res.data.user) {
                const { token, user } = res.data;
                setToken(token);
                setUser(user);
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                toast.dismiss();
                toast.success('Login successful! Redirecting...');
                navigate('/admin-dashboard');
            } else {
                toast.dismiss();
                toast.error(res.data.message || 'Login failed.');
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className='container mt-5' style={{ maxWidth: '500px' }}>
            <form onSubmit={handleSubmit} className='card shadow bg-light p-4 rounded'>
                <h1 className='text-center text-success'>EMIS</h1>
                <h2 className='text-center mb-4 text-success'>Login</h2>

                {/* Inputs */}
                <input
                    type="email"
                    className='form-control mb-3'
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className='form-control mb-3'
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div className="d-grid mb-3">
                    <button type="submit" className='btn btn-success'>Login</button>
                </div>
                <div className="text-center">
                    <p>Don't have an account? {' '}
                        <Link to={'/register/admin'} className='text-decoration-none'>Register</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginComponent;
