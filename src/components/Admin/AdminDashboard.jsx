import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    activeClients: 0,
    activeWorkers: 0,
    totalBookings: 0,
    recentBookings: [],
    recentReviews: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const {token}= useContext(AuthContext)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('https://emis-sh54.onrender.com/api/admin', {
          headers: { Authorization: `Bearer ${token}` }, // Replace getAuthToken with your auth logic
        });
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data. Please try again.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-success mb-4">Admin Dashboard</h1>

      {loading && <div className="alert alert-info" role="alert">Loading data...</div>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card shadow h-100">
            <div className="card-body text-center">
              <i className="bi bi-people display-4 text-success mb-3"></i>
              <h4 className="card-title">Total Users</h4>
              <p className="card-text fs-3">{data.totalUsers}</p>
              <Link to="/admin/users" className="btn btn-success">Manage Users</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card shadow h-100">
            <div className="card-body text-center">
              <i className="bi bi-person-workspace display-4 text-success mb-3"></i>
              <h4 className="card-title">Active Workers</h4>
              <p className="card-text fs-3">{data.activeWorkers}</p>
              <Link to="/admin/workers" className="btn btn-success">Manage Workers</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card shadow h-100">
            <div className="card-body text-center">
              <i className="bi bi-calendar-check display-4 text-success mb-3"></i>
              <h4 className="card-title">Total Bookings</h4>
              <p className="card-text fs-3">{data.totalBookings}</p>
              <Link to="/admin/reports" className="btn btn-success">View Reports</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow mt-4">
        <div className="card-body">
          <h4 className="card-title text-success">Recent Bookings</h4>
          {data.recentBookings.length > 0 ? (
            <ul className="list-group list-group-flush">
              {data.recentBookings.map((booking) => (
                <li key={booking._id} className="list-group-item">
                  {booking.clientId?.name} booked {booking.serviceId?.title} with {booking.workerId?.name}
                  <small className="text-muted"> ({new Date(booking.createdAt).toLocaleString()})</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No recent bookings.</p>
          )}
        </div>
      </div>
      <div className="card shadow mt-4">
        <div className="card-body">
          <h4 className="card-title text-success">Recent Reviews</h4>
          {data.recentReviews.length > 0 ? (
            <ul className="list-group list-group-flush">
              {data.recentReviews.map((review) => (
                <li key={review._id} className="list-group-item">
                  {review.reviewerId?.name} reviewed {review.reviewedId?.name}: {review.rating}/5
                  <small className="text-muted"> ({new Date(review.createdAt).toLocaleString()})</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No recent reviews.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;