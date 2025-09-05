// AdminDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [data, setData] = useState({});
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error('Please log in first.');
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get('https://emis-sh54.onrender.com/api/dash/admin', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load dashboard.');
      }
    };

    fetchData();
  }, [token, navigate]);

  return (
    <div className="container-fluid p-4">
      <h1 className="mb-4 text-success">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="row g-4 mb-4">
        <StatCard title="Total Users" value={data.totalUsers} icon="bi-people" color="primary" />
        <StatCard title="Active Workers" value={data.activeWorkers} icon="bi-person-workspace" color="success" />
        <StatCard title="Total Bookings" value={data.totalBookings} icon="bi-calendar-check" color="warning" />
      </div>

      {/* Content Row */}
      <div className="row">
        <div className="col-lg-8">
          <RecentList title="Recent Bookings" items={data.recentBookings} type="booking" />
        </div>
        <div className="col-lg-4">
          <RecentList title="Recent Reviews" items={data.recentReviews} type="review" />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="col-md-4">
    <div className={`card shadow-sm border-start border-4 border-${color}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted">{title}</h6>
            <h3>{value || 0}</h3>
          </div>
          <i className={`bi ${icon} display-6 text-${color}`}></i>
        </div>
      </div>
    </div>
  </div>
);

const RecentList = ({ title, items, type }) => (
  <div className="card shadow-sm mb-4">
    <div className="card-header bg-light fw-bold">{title}</div>
    <div className="card-body">
      {items?.length ? (
        <ul className="list-group list-group-flush">
          {items.map((i) => (
            <li key={i._id} className="list-group-item small">
              {type === 'booking'
                ? `${i.clientId?.name || 'Unknown'} booked ${i.serviceId?.title || 'Unknown'} with ${i.workerId?.name || 'Unknown'}`
                : `${i.reviewerId?.name || 'Unknown'} reviewed ${i.reviewedId?.name || 'Unknown'}: ${i.rating}/5`}
              <br />
              <small className="text-muted">{new Date(i.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">No records found.</p>
      )}
    </div>
  </div>
);

export default AdminDashboard;
