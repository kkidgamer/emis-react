import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    status:'active'
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
        toast.success('Services loaded successfully!');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch services.');
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
        toast.success('Service updated successfully!');
      } else {
        const response = await axios.post(
          `${API_URL}/service`,
          { ...formData, price: Number(formData.price), duration: Number(formData.duration) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setServices([...services, response.data.service]);
        toast.success('Service created successfully!');
      }
      setFormData({ title: '', description: '', category: '', price: '', duration: '' });
      setEditingService(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save service.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setFormData({
      title: service.title,
      description: service.description || '',
      category: service.category,
      status:service.status,
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
        toast.success('Service deleted successfully!');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete service.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      {loading && <div className="alert alert-info" role="alert">Loading...</div>}
      <h2 className="text-success mb-4">
        <i className="bi bi-list-task me-2"></i>Manage Services
      </h2>
      <div className="card shadow mb-4">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">{editingService ? 'Edit Service' : 'Add New Service'}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {['plumbing', 'electrical', 'cooking', 'cleaning', 'carpentry', 'other'].map((cat) => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
              ></textarea>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Price ($)</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Duration (minutes)</label>
                <input
                  type="number"
                  className="form-control"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Status</option>
                  {['active', 'inactive'].map((cat) => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving...
                </>
              ) : (
                <><i className="bi bi-save me-2"></i>{editingService ? 'Update' : 'Create'} Service</>
              )}
            </button>
            {editingService && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setFormData({ title: '', description: '', category: '', price: '', duration: '' });
                  setEditingService(null);
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>
      <div className="card shadow">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0"><i className="bi bi-list-task me-2"></i>Services</h5>
        </div>
        <div className="card-body">
          {services.length ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price ($)</th>
                    <th>Duration (min)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service._id}>
                      <td>{service.title}</td>
                      <td>{service.category}</td>
                      <td>{service.price}</td>
                      <td>{service.duration}</td>
                      <td>
                        <span className={`badge bg-${service.status === 'active' ? 'success' : 'secondary'}`}>
                          {service.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => handleEdit(service)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(service._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="bi bi-list-task display-1 text-muted"></i>
              <p className="text-muted mt-3">No services found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageServices;