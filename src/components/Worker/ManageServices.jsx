import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from '../context/AuthContext';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    duration: '',
  });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const { token, user } = useContext(AuthContext);

  // Fetch services for the worker
  useEffect(() => {
    const fetchServices = async () => {
      if (!user || user.role !== 'worker') {
        setError('Unauthorized access. Please log in as a worker.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const response = await axios.get('https://emis-sh54.onrender.com/api/service', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch services.');
        setLoading(false);
      }
    };
    fetchServices();
  }, [token, user]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle service creation or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (editingServiceId) {
        // Update existing service
        const response = await axios.put(
          `https://emis-sh54.onrender.com/api/service/${editingServiceId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setServices(services.map((service) =>
          service._id === editingServiceId ? response.data : service
        ));
        setSuccess('Service updated successfully.');
      } else {
        // Create new service
        const response = await axios.post(
          'https://emis-sh54.onrender.com/api/service',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setServices([...services, response.data]);
        setSuccess('Service created successfully.');
      }
      // Reset form
      setFormData({ title: '', description: '', category: '', price: '', duration: '' });
      setEditingServiceId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save service.');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEdit = (service) => {
    setFormData({
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price,
      duration: service.duration,
    });
    setEditingServiceId(service._id);
  };

  // Handle delete button click
  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`https://emis-sh54.onrender.com/api/service/${serviceId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(services.filter((service) => service._id !== serviceId));
        setSuccess('Service deleted successfully.');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete service.');
      }
    }
  };

  return (
    <div>
      <h1 className="text-success mb-4">Manage Services</h1>

      {loading && <div className="alert alert-info" role="alert">Loading...</div>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {success && <div className="alert alert-success" role="alert">{success}</div>}

      {/* Service Creation/Update Form */}
      <div className="card shadow mb-4" style={{ maxWidth: '600px' }}>
        <div className="card-body">
          <h4 className="card-title text-success">
            {editingServiceId ? 'Update Service' : 'Create New Service'}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                className="form-control"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Gardening">Gardening</option>
                <option value="Childcare">Childcare</option>
                <option value="Personal Assistance">Personal Assistance</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price ($)</label>
              <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="duration" className="form-label">Duration (hours)</label>
              <input
                type="number"
                className="form-control"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="0"
                step="0.5"
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {editingServiceId ? 'Update Service' : 'Create Service'}
              </button>
              {editingServiceId && (
                <button
                  type="button"
                  className="btn btn-secondary mt-2"
                  onClick={() => {
                    setFormData({ title: '', description: '', category: '', price: '', duration: '' });
                    setEditingServiceId(null);
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Services List */}
      <div className="card shadow">
        <div className="card-body">
          <h4 className="card-title text-success">Your Services</h4>
          {services.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price ($)</th>
                    <th>Duration (hrs)</th>
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
                      <td>{service.status}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(service)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(service._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No services found. Create one above!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageServices;