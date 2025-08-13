import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const WorkerDashboard = () => {
  const [data, setData] = useState({
    workerServices: 0,
    activeBookings: 0,
    completedBookings: 0,
    totalEarnings: 0,
    averageRating: 0,
    unreadMessages: 0,
    recentBookings: [],
    recentReviews: [],
  });
  const [loading, setLoading] = useState(false);
  const { token, user } = useContext(AuthContext);
  const API_URL = 'https://emis-sh54.onrender.com/api';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/dash/worker`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
        toast.success('Data loaded successfully!');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'ongoing': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      case 'inactive': return 'secondary';
      default: return 'secondary';
    }
  };

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

  return (
    <div>
      {loading && <div className="alert alert-info" role="alert">Loading...</div>}
      <h2 className="text-success mb-4">
        <i className="bi bi-house-door me-2"></i>Dashboard
      </h2>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-person me-2"></i>Profile
              </h5>
            </div>
            <div className="card-body">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p>
                <strong>Subscription Status:</strong>
                <span className={`badge bg-${getStatusColor(user.subscriptionStatus)} ms-2`}>
                  {user.subscriptionStatus?.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="row">
            <DashboardCard title="Services" value={data.workerServices} icon="bi-list-task" color="text-primary" />
            <DashboardCard title="Active Bookings" value={data.activeBookings} icon="bi-calendar-event" color="text-info" />
            <DashboardCard title="Completed Bookings" value={data.completedBookings} icon="bi-calendar-check" color="text-success" />
            <DashboardCard title="Total Earnings" value={`$${data.totalEarnings}`} icon="bi-currency-dollar" color="text-warning" />
            <DashboardCard title="Average Rating" value={data.averageRating.toFixed(1)} icon="bi-star" color="text-danger" />
            <DashboardCard title="Unread Messages" value={data.unreadMessages} icon="bi-envelope" color="text-secondary" />
          </div>
        </div>
      </div>
      <RecentList title="Recent Bookings" items={data.recentBookings} type="booking" formatDate={formatDate} getStatusColor={getStatusColor} />
      <RecentList title="Recent Reviews" items={data.recentReviews} type="review" formatDateTime={formatDateTime} />
    </div>
  );
};

const DashboardCard = ({ title, value, icon, color }) => (
  <div className="col-md-6 mb-4">
    <div className="card text-center shadow">
      <div className="card-body">
        <i className={`bi ${icon} display-4 ${color} mb-3`}></i>
        <h5 className="card-title">{title}</h5>
        <h2 className="card-text">{value || 0}</h2>
      </div>
    </div>
  </div>
);

const RecentList = ({ title, items, type, formatDate, formatDateTime, getStatusColor }) => (
  <div className="card shadow mt-4">
    <div className="card-header bg-success text-white">
      <h5 className="mb-0">
        <i className={`bi ${type === 'booking' ? 'bi-calendar-check' : 'bi-star'} me-2`}></i>{title}
      </h5>
    </div>
    <div className="card-body">
      {items?.length ? (
        type === 'booking' ? (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.clientId?.name || 'Unknown'}</td>
                    <td>{item.serviceId?.title || 'Unknown'}</td>
                    <td>{formatDate(item.startTime)}</td>
                    <td>
                      <span className={`badge bg-${getStatusColor(item.status)}`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="row">
            {items.map((item) => (
              <div key={item._id} className="col-md-6 mb-3">
                <div className="card border-left-warning">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="card-title">{item.reviewerId?.name || 'Anonymous'}</h6>
                      <span className="badge bg-warning text-dark">{item.rating}/5 ⭐</span>
                    </div>
                    <p className="card-text">{item.comment || 'No comment provided'}</p>
                    <small className="text-muted">{formatDateTime(item.createdAt)}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-4">
          <i className={`bi ${type === 'booking' ? 'bi-calendar-x' : 'bi-star'} display-1 text-muted`}></i>
          <p className="text-muted mt-3">{`No ${type}s found.`}</p>
        </div>
      )}
    </div>
  </div>
);

export default WorkerDashboard;