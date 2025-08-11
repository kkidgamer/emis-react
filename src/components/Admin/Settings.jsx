import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Settings = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.info('Updating profile...');
    try {
      await axios.put(
        `https://emis-sh54.onrender.com/api/user/${user._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.dismiss();
      toast.success('Profile updated successfully.');
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <div className='container mt-3'>
      <h1 className="text-success mb-4">Settings</h1>
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
