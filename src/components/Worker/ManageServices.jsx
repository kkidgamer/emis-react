// Updated ManageServices.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
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
      setShowForm(false);
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
      description: service.description,
      category: service.category,
      price: service.price,
      duration: service.duration,
      status: service.status
    });
    setEditingService(service);
    setShowForm(true);
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
    switch (status) {
      case 'active':
        return 'from-green-500 to-emerald-500';
      case 'inactive':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (loading && !services.length) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-white mb-4"></i>
          <p className="text-white text-lg">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            Manage Services
          </h2>
          <p className="text-sm sm:text-base text-gray-300">Create, edit, or delete your offered services</p>
        </div>
        <button
          onClick={() => {
            setFormData({ title: '', description: '', category: '', price: '', duration: '', status: 'active' });
            setEditingService(null);
            setShowForm(!showForm);
          }}
          className="group relative px-4 sm:px-6 py-2 sm:py-3 font-semibold text-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 self-start sm:self-auto min-h-[44px]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 flex items-center">
            <i className={`fas fa-${showForm ? 'times' : 'plus'} mr-1`}></i>
            {showForm ? 'Cancel' : 'Add Service'}
          </span>
        </button>
      </div>

      {/* Form - Full screen on mobile */}
      {showForm && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 space-y-4 sm:space-y-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <input
                type="text"
                name="title"
                placeholder="Service Title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 placeholder-gray-300 text-white text-sm min-h-[44px]"
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 placeholder-gray-300 text-white text-sm min-h-[44px]"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price ($)"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 placeholder-gray-300 text-white text-sm min-h-[44px]"
                required
              />
              <input
                type="number"
                name="duration"
                placeholder="Duration (minutes)"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 placeholder-gray-300 text-white text-sm min-h-[44px]"
                required
              />
            </div>
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 placeholder-gray-300 text-white text-sm resize-none min-h-[80px]"
              required
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 text-white text-sm min-h-[44px]"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="w-full group relative py-3 font-bold text-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 min-h-[44px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">{editingService ? 'Update Service' : 'Create Service'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Services List - Cards on Mobile, Table on Desktop */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm hidden md:table">
          <thead>
            <tr className="bg-white/5">
              <th className="p-3 text-left text-gray-300">Title</th>
              <th className="p-3 text-left text-gray-300">Category</th>
              <th className="p-3 text-left text-gray-300">Price ($)</th>
              <th className="p-3 text-left text-gray-300">Duration (min)</th>
              <th className="p-3 text-left text-gray-300">Status</th>
              <th className="p-3 text-left text-gray-300">Actions</th>
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
                    className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r ${getStatusColor(service.status)} text-white`}
                  >
                    {service.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    className="group relative px-3 py-2 font-semibold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 min-h-[44px]"
                    onClick={() => handleEdit(service)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center h-full">
                      <i className="fas fa-edit"></i>
                    </span>
                  </button>
                  <button
                    className="group relative px-3 py-2 font-semibold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 min-h-[44px]"
                    onClick={() => handleDelete(service._id)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center h-full">
                      <i className="fas fa-trash"></i>
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-xl space-y-3"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-white text-base">{service.title}</h3>
                <span
                  className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r ${getStatusColor(service.status)} text-white`}
                >
                  {service.status.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-300 text-sm">Category: {service.category}</p>
              <p className="text-gray-300 text-sm">Price: ${service.price}</p>
              <p className="text-gray-300 text-sm">Duration: {service.duration} min</p>
              <div className="flex gap-2 pt-2">
                <button
                  className="group relative flex-1 py-2 font-semibold text-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 min-h-[44px]"
                  onClick={() => handleEdit(service)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 block w-full text-center">
                    <i className="fas fa-edit mr-1"></i> Edit
                  </span>
                </button>
                <button
                  className="group relative px-3 py-2 font-semibold text-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 min-h-[44px]"
                  onClick={() => handleDelete(service._id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center justify-center h-full">
                    <i className="fas fa-trash"></i>
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {services.length === 0 && !loading && (
        <div className="text-center py-8 sm:py-12">
          <i className="fas fa-list text-4xl sm:text-5xl text-gray-400 mb-4"></i>
          <p className="text-gray-400 text-base sm:text-lg">No services found. Add one to get started!</p>
        </div>
      )}
    </div>
  );
};

export default ManageServices;