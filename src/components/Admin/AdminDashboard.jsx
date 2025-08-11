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
      toast.info('Loading dashboard...');
      try {
        const res = await axios.get('https://emis-sh54.onrender.com/api/dash/admin', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
        toast.dismiss();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load dashboard.');
      }
    };

    fetchData();
  }, [token, navigate]);

  return (
    <div>
      <h1 className="text-success mb-4">Admin Dashboard</h1>
      <div className="row">
        <DashboardCard title="Total Users" value={data.totalUsers} icon="bi-people" link="/admin-dashboard/users" />
        <DashboardCard title="Active Workers" value={data.activeWorkers} icon="bi-person-workspace" link="/admin-dashboard/workers" />
        <DashboardCard title="Total Bookings" value={data.totalBookings} icon="bi-calendar-check" link="/admin-dashboard/reports" />
      </div>
      <RecentList title="Recent Bookings" items={data.recentBookings} type="booking" />
      <RecentList title="Recent Reviews" items={data.recentReviews} type="review" />
    </div>
  );
};

const DashboardCard = ({ title, value, icon, link }) => (
  <div className="col-md-4 mb-4">
    <div className="card shadow h-100 text-center">
      <div className="card-body">
        <i className={`bi ${icon} display-4 text-success mb-3`}></i>
        <h4>{title}</h4>
        <p className="fs-3">{value || 0}</p>
        <Link to={link} className="btn btn-success">View</Link>
      </div>
    </div>
  </div>
);

const RecentList = ({ title, items, type }) => (
  <div className="card shadow mt-4">
    <div className="card-body">
      <h4 className="text-success">{title}</h4>
      {items?.length ? (
        <ul className="list-group">
          {items.map(i => (
            <li key={i._id} className="list-group-item">
              {type === 'booking'
                ? `${i.clientId?.name || 'Unknown'} booked ${i.serviceId?.title || 'Unknown'} with ${i.workerId?.name || 'Unknown'}`
                : `${i.reviewerId?.name || 'Unknown'} reviewed ${i.reviewedId?.name || 'Unknown'}: ${i.rating}/5`
              }
              <small className="text-muted"> ({new Date(i.createdAt).toLocaleString()})</small>
            </li>
          ))}
        </ul>
      ) : <p className="text-muted">No data found.</p>}
    </div>
  </div>
);

export default AdminDashboard;
