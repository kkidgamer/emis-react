import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Mock AuthContext - replace with your actual implementation
const AuthContext = React.createContext({
  token: 'mock-token',
  user: { _id: '1', name: 'John Worker', email: 'worker.john@example.com', role: 'worker' },
});

const WorkerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({
    profile: { name: '', email: '', skills: [], subscriptionStatus: '' },
    bookings: [],
    reviews: [],
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    duration: '',
  });
  const [editingService, setEditingService] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(20);

  useEffect(() => {
    fetchWorkerData();
    fetchServices();
  }, [token, user, navigate]);

  const handleTokenExpiration = (err) => {
    if (err.response?.status === 401) {
      setError('Session expired. Please log in again.');
      navigate('/login/worker');
    }
  };

  const fetchWorkerData = async () => {
    if (!token || !user || user.role !== 'worker') {
      setError('Unauthorized access. Please log in as a worker.');
      setLoading(false);
      navigate('/login/worker');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://emis-sh54.onrender.com/api/dash/worker', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData({
        profile: {
          name: response.data.name || user.name || '',
          email: response.data.email || user.email || '',
          skills: response.data.skills || [],
          subscriptionStatus: response.data.subscriptionStatus || 'N/A',
        },
        bookings: response.data.bookings || [],
        reviews: response.data.reviews || [],
      });
      setLoading(false);
    } catch (err) {
      console.error('API Error:', err);
      handleTokenExpiration(err);
      setError(err.response?.data?.message || 'Failed to fetch worker data.');
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('https://emis-sh54.onrender.com/api/service', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(response.data || []);
    } catch (err) {
      console.error('Services fetch error:', err);
      handleTokenExpiration(err);
      setError(err.response?.data?.message || 'Failed to fetch services.');
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.category || !serviceForm.description) {
      setError('Please fill in all required fields.');
      return;
    }
    if (Number(serviceForm.price) <= 0 || Number(serviceForm.duration) <= 0) {
      setError('Price and duration must be positive numbers.');
      return;
    }
    try {
      if (editingService) {
        await axios.put(
          `https://emis-sh54.onrender.com/api/service/${editingService._id}`,
          serviceForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Service updated successfully');
        setEditingService(null);
      } else {
        await axios.post(
          'https://emis-sh54.onrender.com/api/service',
          serviceForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Service created successfully');
      }
      setServiceForm({ title: '', description: '', category: '', price: '', duration: '' });
      setError('');
      fetchServices();
    } catch (error) {
      console.error('Service save error:', error);
      handleTokenExpiration(error);
      setError(error.response?.data?.message || 'Failed to save service.');
    }
  };

  const handleEditService = (service) => {
    setServiceForm({
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price.toString(),
      duration: service.duration.toString(),
    });
    setEditingService(service);
    setActiveTab('services');
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`https://emis-sh54.onrender.com/api/service/${serviceId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Service deleted successfully');
        fetchServices();
      } catch (error) {
        console.error('Service delete error:', error);
        handleTokenExpiration(error);
        setError(error.response?.data?.message || 'Failed to delete service.');
      }
    }
  };

  const handleSubscriptionPayment = async () => {
    try {
      console.log('Processing payment...');
      const workerResponse = await axios.get('https://emis-sh54.onrender.com/api/dash/worker', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const workerId = workerResponse.data._id;
      await axios.put(
        `https://emis-sh54.onrender.com/api/worker/${workerId}/subscription`,
        { paymentAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Subscription activated successfully!');
      fetchWorkerData();
    } catch (error) {
      console.error('Payment failed:', error);
      handleTokenExpiration(error);
      setError(error.response?.data?.message || 'Failed to process payment.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      case 'inactive':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  // Helper functions for date formatting
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-success text-white p-0">
          <div className="d-flex flex-column vh-100">
            <div className="p-3">
              <h4 className="mb-0">Worker Panel</h4>
              <small>EMIS</small>
            </div>
            <nav className="nav nav-pills flex-column px-3 flex-grow-1">
              <button
                className={`nav-link text-white mb-2 ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
                aria-label="Go to Overview"
              >
                <i className="bi bi-house-door me-2"></i>
                Overview
              </button>
              <button
                className={`nav-link text-white mb-2 ${activeTab === 'services' ? 'active' : ''}`}
                onClick={() => setActiveTab('services')}
                aria-label="Go to Services"
              >
                <i className="bi bi-tools me-2"></i>
                My Services
              </button>
              <button
                className={`nav-link text-white mb-2 ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
                aria-label="Go to Bookings"
              >
                <i className="bi bi-calendar-check me-2"></i>
                Bookings
              </button>
              <button
                className={`nav-link text-white mb-2 ${activeTab === 'subscription' ? 'active' : ''}`}
                onClick={() => setActiveTab('subscription')}
                aria-label="Go to Subscription"
              >
                <i className="bi bi-credit-card me-2"></i>
                Subscription
              </button>
            </nav>
            <div className="p-3 border-top">
              <div className="d-flex align-items-center">
                <i className="bi bi-person-circle fs-4 me-2"></i>
                <div>
                  <div className="fw-bold">{data.profile.name}</div>
                  <small>{data.profile.skills.join(', ') || 'No skills listed'}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 bg-light p-4">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {activeTab === 'overview' && (
            <div>
              <h2 className="text-success mb-4">Dashboard Overview</h2>

              {/* Stats Cards */}
              <div className="row mb-4">
                <div className="col-md-3 mb-3">
                  <div className="card h-100 text-center">
                    <div className="card-body">
                      <i className="bi bi-person display-4 text-success mb-3"></i>
                      <h5>Profile Status</h5>
                      <span className={`badge bg-${getStatusColor(data.profile.subscriptionStatus)} fs-6`}>
                        {data.profile.subscriptionStatus.toUpperCase()}
                      </span>
                      <div className="mt-2">
                        <Link to="/worker-dashboard/settings" className="btn btn-sm btn-success">
                          Update
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card h-100 text-center">
                    <div className="card-body">
                      <i className="bi bi-tools display-4 text-primary mb-3"></i>
                      <h5>My Services</h5>
                      <h3 className="text-primary">{services.length}</h3>
                      <div className="mt-2">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setActiveTab('services')}
                          aria-label="Manage Services"
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card h-100 text-center">
                    <div className="card-body">
                      <i className="bi bi-calendar-check display-4 text-warning mb-3"></i>
                      <h5>Total Bookings</h5>
                      <h3 className="text-warning">{data.bookings.length}</h3>
                      <div className="mt-2">
                        <Link to="/worker-dashboard/bookings" className="btn btn-sm btn-warning">
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card h-100 text-center">
                    <div className="card-body">
                      <i className="bi bi-star display-4 text-info mb-3"></i>
                      <h5>Average Rating</h5>
                      <h3 className="text-info">
                        {data.reviews.length > 0
                          ? (data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length).toFixed(1)
                          : 'N/A'}
                      </h3>
                      <div className="mt-2">
                        <Link to="/worker-dashboard/reviews" className="btn btn-sm btn-info">
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Card */}
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Profile Information</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p>
                        <strong>Name:</strong> {data.profile.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {data.profile.email}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Skills:</strong> {data.profile.skills.join(', ') || 'N/A'}
                      </p>
                      <p>
                        <strong>Status:</strong>
                        <span className={`badge bg-${getStatusColor(data.profile.subscriptionStatus)} ms-2`}>
                          {data.profile.subscriptionStatus}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Recent Bookings</h5>
                  {data.bookings.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {data.bookings.slice(0, 5).map((booking) => {
                        const bookingDate = new Date(booking.createdAt);
                        const isToday = bookingDate.toDateString() === new Date().toDateString();
                        return (
                          <div key={booking._id} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="mb-1">{booking.serviceId?.title || 'Unknown Service'}</h6>
                                <p className="mb-1">Client: {booking.clientId?.name || 'Unknown Client'}</p>
                                <small className="text-muted">
                                  {formatDateTime(booking.createdAt)}
                                  {isToday && <span className="badge bg-info ms-2">Today</span>}
                                </small>
                              </div>
                              <span className={`badge bg-${getStatusColor(booking.status)}`}>{booking.status}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted">No recent bookings.</p>
                  )}
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Recent Reviews</h5>
                  {data.reviews.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {data.reviews.slice(0, 5).map((review) => (
                        <div key={review._id} className="list-group-item">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-1">{review.reviewerId?.name || 'Unknown Reviewer'}</h6>
                              <p className="mb-1">{review.comment || 'No comment'}</p>
                              <small className="text-muted">{formatDateTime(review.createdAt)}</small>
                            </div>
                            <span className="badge bg-warning">{review.rating}/5 ⭐</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No recent reviews.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-success">My Services</h2>
              </div>

              {/* Service Form */}
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">{editingService ? 'Edit Service' : 'Add New Service'}</h5>
                  <form onSubmit={handleServiceSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label" htmlFor="service-title">
                          Title
                        </label>
                        <input
                          id="service-title"
                          type="text"
                          className="form-control"
                          value={serviceForm.title}
                          onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                          required
                          aria-required="true"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label" htmlFor="service-category">
                          Category
                        </label>
                        <select
                          id="service-category"
                          className="form-select"
                          value={serviceForm.category}
                          onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                          required
                          aria-required="true"
                        >
                          <option value="">Select Category</option>
                          <option value="Home Services">Home Services</option>
                          <option value="Repair & Maintenance">Repair & Maintenance</option>
                          <option value="Installation">Installation</option>
                          <option value="Cleaning">Cleaning</option>
                          <option value="Electrical">Electrical</option>
                          <option value="Plumbing">Plumbing</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label" htmlFor="service-price">
                          Price ($)
                        </label>
                        <input
                          id="service-price"
                          type="number"
                          className="form-control"
                          value={serviceForm.price}
                          onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                          required
                          min="0.01"
                          step="0.01"
                          aria-required="true"
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label" htmlFor="service-duration">
                          Duration (minutes)
                        </label>
                        <input
                          id="service-duration"
                          type="number"
                          className="form-control"
                          value={serviceForm.duration}
                          onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                          required
                          min="1"
                          aria-required="true"
                        />
                      </div>
                      <div className="col-md-12 mb-3">
                        <label className="form-label" htmlFor="service-description">
                          Description
                        </label>
                        <textarea
                          id="service-description"
                          className="form-control"
                          rows="3"
                          value={serviceForm.description}
                          onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                          required
                          aria-required="true"
                        ></textarea>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-success">
                        {editingService ? 'Update Service' : 'Add Service'}
                      </button>
                      {editingService && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            setEditingService(null);
                            setServiceForm({ title: '', description: '', category: '', price: '', duration: '' });
                          }}
                          aria-label="Cancel Editing"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* Services List */}
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Your Services</h5>
                  {services.length ? (
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {services.map((service) => (
                            <tr key={service._id}>
                              <td>{service.title}</td>
                              <td>{service.category}</td>
                              <td>${service.price}</td>
                              <td>{service.duration} min</td>
                              <td>
                                <span className={`badge bg-${getStatusColor(service.status)}`}>
                                  {service.status}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => handleEditService(service)}
                                  aria-label={`Edit ${service.title}`}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteService(service._id)}
                                  aria-label={`Delete ${service.title}`}
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
                    <p className="text-muted">No services found. Create your first service above.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-success mb-4">My Bookings</h2>

              <div className="card">
                <div className="card-body">
                  {data.bookings.length ? (
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Client</th>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.bookings.map((booking) => (
                            <tr key={booking._id}>
                              <td>
                                <div>
                                  <div className="fw-bold">{booking.clientId?.name || 'Unknown'}</div>
                                  <small className="text-muted">{booking.clientId?.email || 'N/A'}</small>
                                </div>
                              </td>
                              <td>{booking.serviceId?.title || 'Unknown Service'}</td>
                              <td>{formatDate(booking.createdAt)}</td>
                              <td>
                                <span className={`badge bg-${getStatusColor(booking.status)}`}>
                                  {booking.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted">No bookings found.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div>
              <h2 className="text-success mb-4">Subscription Management</h2>

              <div className="row">
                <div className="col-md-8">
                  <div className="card mb-4">
                    <div className="card-body">
                      <h5 className="card-title">Current Subscription</h5>
                      <div className="row">
                        <div className="col-md-6">
                          <p>
                            <strong>Status:</strong>
                            <span className={`badge bg-${getStatusColor(data.profile.subscriptionStatus)} ms-2`}>
                              {data.profile.subscriptionStatus?.toUpperCase()}
                            </span>
                          </p>
                        </div>
                        <div className="col-md-6">
                          <p>
                            <strong>Plan:</strong> Monthly Premium
                          </p>
                          <p>
                            <strong>Price:</strong> ${paymentAmount}/month
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {data.profile.subscriptionStatus !== 'active' && (
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Activate Subscription</h5>
                        <p className="text-muted">
                          Activate your subscription to start receiving bookings and managing your services.
                        </p>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="payment-amount">
                            Payment Amount
                          </label>
                          <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                              id="payment-amount"
                              type="number"
                              className="form-control"
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(Number(e.target.value))}
                              min="1"
                              aria-required="true"
                            />
                          </div>
                        </div>
                        <button
                          className="btn btn-success btn-lg"
                          onClick={handleSubscriptionPayment}
                          aria-label="Pay and Activate Subscription"
                        >
                          <i className="bi bi-credit-card me-2"></i>
                          Pay & Activate Subscription
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Benefits</h5>
                      <ul className="list-unstyled">
                        <li>
                          <i className="bi bi-check-circle text-success me-2"></i>Receive client bookings
                        </li>
                        <li>
                          <i className="bi bi-check-circle text-success me-2"></i>Manage unlimited services
                        </li>
                        <li>
                          <i className="bi bi-check-circle text-success me-2"></i>Customer support
                        </li>
                        <li>
                          <i className="bi bi-check-circle text-success me-2"></i>Analytics dashboard
                        </li>
                        <li>
                          <i className="bi bi-check-circle text-success me-2"></i>Profile visibility
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;