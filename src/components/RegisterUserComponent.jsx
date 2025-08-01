import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterUserComponent = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');

    // User interaction
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading('Registering user account');
        try {
            const data = { name, email, phone, address, password, role: 'client' };
            const res = await axios.post("https://emis-sh54.onrender.com/api/client", data);
            console.log(res.data)
            if (res.data.client) {
                setLoading('');
                setSuccess("ACCOUNT CREATED SUCCESSFULLY");
                console.log(res.data);
                alert('Account created successfully. You will be redirected to login page');
                navigate('/login/user');
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
                <h2 className='text-center mb-4 text-success'>Register</h2>

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
                    type="text"
                    className='form-control mb-3'
                    placeholder='Enter your phone number'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <input
                    type="text"
                    className='form-control mb-3'
                    placeholder='Enter your address'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
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
                    <button type="submit" className='btn btn-success'>Register</button>
                </div>
                <div className="text-center">
                    <p>Already have an account? {' '}
                        <Link to={'/login/user'} className='text-decoration-none'>Login</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default RegisterUserComponent;