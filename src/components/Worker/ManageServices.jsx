// Updated ManageServices.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    status: 'active'
  });
  const [editingService, setEditingService] = useState(null);
  const { token } = useContext(AuthContext);
  const API_URL = 'https://emis-sh54.onrender.com/api';

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/service/worker`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(response.data);
        toast.success('Services loaded successfully!', {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch services.', {
          style: {
            background: 'linear-gradient(135deg, #ff6b6b 0%, #c0392b 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingService) {
        await axios.put(
          `${API_URL}/service/${editingService._id}`,
          { ...formData, price: Number(formData.price), duration: Number(formData.duration) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setServices(services.map((s) => (s._id === editingService._id ? { ...s, ...formData } : s)));
        toast.success('Service updated successfully!', {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        });
      } else {
        const response = await axios.post(
          `${API_URL}/service`,
          { ...formData, price: Number(formData.price), duration: Number(formData.duration) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setServices([...services, response.data.service]);
        toast.success('Service created successfully!', {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        });
      }
      setFormData({ title: '', description: '', category: '', price: '', duration: '', status: 'active' });
      setEditingService(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save service.', {
        style: {
          background: 'linear-gradient(135deg, #ff6b6b 0%, #c0392b 100%)',
          color: 'white',
          borderRadius: '16px',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setFormData({
      title: service.title,
      description: service.description || '',
      category: service.category,
      status: service.status,
      price: service.price.toString(),
      duration: service.duration.toString(),
    });
    setEditingService(service);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setLoading(true);
      try {
        await axios.delete(`${API_URL}/service/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(services.filter((s) => s._id !== id));
        toast.success('Service deleted successfully!', {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete service.', {
          style: {
            background: 'linear-gradient(135deg, #ff6b6b 0%, #c0392b 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'from-green-500 to-emerald-500' : 'from-gray-500 to-gray-600';
  };

  return (
    <div>
      {/* Loading Indicator */}
      {loading && (
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            <i className="fas fa-spinner fa-spin text-2xl text-white mr-2"></i>
            <span className="text-white text-lg">Loading...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <h2 className="text-4xl sm:text-5xl font-black mb-8 text-white">
        <i className="fas fa-list text-blue-400 mr-2"></i>
        Manage Services
      </h2>

      {/* Form Card */}
      <div className="group relative mb-8 p-6 rounded-3xl transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-colors duration-300"></div>
        <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-3xl transition-all duration-300"></div>
        <div className="relative z-10">
          <h5 className="text-2xl font-bold text-white mb-6">{editingService ? 'Edit Service' : 'Add New Service'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Title</label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Category</label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-blue-400 focus:outline-none transition-colors duration-300"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {['plumbing', 'electrical', 'cooking', 'cleaning', 'carpentry', 'other'].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 font-medium">Description</label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Price ($)</label>
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Duration (minutes)</label>
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Status</label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-blue-400 focus:outline-none transition-colors duration-300"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Status</option>
                  {['active', 'inactive'].map((stat) => (
                    <option key={stat} value={stat}>
                      {stat.charAt(0).toUpperCase() + stat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="group relative px-6 py-3 font-semibold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 me-3 disabled:opacity-50"
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">
                {loading ? (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fas fa-save mr-2"></i>
                )}
                {editingService ? 'Update' : 'Create'} Service
              </span>
            </button>
            {editingService && (
              <button
                type="button"
                className="group relative px-6 py-3 font-semibold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
                onClick={() => {
                  setFormData({ title: '', description: '', category: '', price: '', duration: '', status: 'active' });
                  setEditingService(null);
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10"><i className="fas fa-times mr-2"></i>Cancel</span>
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Services List */}
      <div className="group relative p-6 rounded-3xl transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-colors duration-300"></div>
        <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-3xl transition-all duration-300"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
              <i className="fas fa-list text-white text-lg"></i>
            </div>
            <h5 className="text-2xl font-bold text-white">Services</h5>
          </div>
          {services.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-300">
                    <th className="p-3">Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price ($)</th>
                    <th className="p-3">Duration (min)</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr
                      key={service._id}
                      className="border-t border-white/10 hover:bg-white/5 transition-colors duration-300"
                    >
                      <td className="p-3 text-gray-200">{service.title}</td>
                      <td className="p-3 text-gray-200">{service.category}</td>
                      <td className="p-3 text-gray-200">{service.price}</td>
                      <td className="p-3 text-gray-200">{service.duration}</td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-lg text-sm font-semibold bg-gradient-to-r ${getStatusColor(service.status)} text-white`}
                        >
                          {service.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          className="group relative px-3 py-1 font-semibold text-white rounded-full overflow-hidden me-2 transition-all duration-300 hover:scale-105"
                          onClick={() => handleEdit(service)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="relative z-10"><i className="fas fa-edit"></i></span>
                        </button>
                        <button
                          className="group relative px-3 py-1 font-semibold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
                          onClick={() => handleDelete(service._id)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="relative z-10"><i className="fas fa-trash"></i></span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-list text-5xl text-gray-400 mb-4"></i>
              <p className="text-gray-400 text-lg">No services found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageServices;