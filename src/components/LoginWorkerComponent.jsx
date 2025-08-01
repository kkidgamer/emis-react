import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const WorkerLoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
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
                console.log(res.data);
                alert('Login successful. You will be redirected to the dashboard');
                navigate('/worker-dashboard');
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
        <div className='container mt-5' style={{ maxWidth: '500px' }}>
            <form onSubmit={handleSubmit} className='card shadow bg-light p-4 rounded'>
                <h1 className='text-center text-success'>EMIS</h1>
                <h2 className='text-center mb-4 text-success'>Worker Login</h2>

                {/* Alerts */}
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                {success && <div className="alert alert-success" role="alert">{success}</div>}
                {loading && <div className="alert alert-info" role="alert">{loading}</div>}

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
                        <Link to={'/register/worker'} className='text-decoration-none'>Register</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default WorkerLoginComponent;