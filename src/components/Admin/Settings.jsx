import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from '../context/AuthContext';


const Settings = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token, user } = useContext(AuthContext)

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.put(
        `https://emis-sh54.onrender.com/api/user/${user._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Profile updated successfully.');
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
      setLoading(false);
    }
  };

  return (
  <div className='container mt-3'>
    
      <h1 className="text-success mb-4">Settings</h1>

      {loading && <div className="alert alert-info" role="alert">Updating profile...</div>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {success && <div className="alert alert-success" role="alert">{success}</div>}

      <div className="card shadow" style={{ maxWidth: '500px' }}>
        <div className="card-body">
          <h4 className="card-title text-success">Update Admin Profile</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-success">Update Profile</button>
            </div>
          </form>
        </div>
      </div>
                
    </div>
  );
};

export default Settings;