import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterAdminComponent = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secretKey, setSecretKey] = useState('');


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
            const data = { name, email, password, secretKey, role: 'admin' };
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
        <div className='container mt-5' style={{ maxWidth: '500px' }}>
            <form onSubmit={handleSubmit} className='card shadow bg-light p-4 rounded'>
                <h1 className='text-center text-success'>EMIS</h1>
                <h2 className='text-center mb-4 text-success'>Register Admin</h2>

                {/* Alerts */}
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                {success && <div className="alert alert-success" role="alert">{success}</div>}
                {loading && <div className="alert alert-info" role="alert">{loading}</div>}

                {/* Inputs */}
                <input
                    type="text"
                    className='form-control mb-3'
                    placeholder='Enter your name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                <input
                    type="password"
                    className='form-control mb-3'
                    placeholder='Enter your secret key'
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    required
                />
                <div className="d-grid mb-3">
                    <button type="submit" className='btn btn-success'>Register</button>
                </div>
                <div className="text-center">
                    <p>Already have an account? {' '}
                        <Link to={'/login/admin'} className='text-decoration-none'>Login</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default RegisterAdminComponent;