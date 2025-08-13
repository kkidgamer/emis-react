import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    recent: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('https://emis-sh54.onrender.com/api/booking', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const allBookings = res.data;
        const pending = allBookings.filter(b => b.status === 'pending').length;
        const completed = allBookings.filter(b => b.status === 'completed').length;

        setStats({
          total: allBookings.length,
          pending,
          completed,
          recent: allBookings.slice(0, 5) // last 5 bookings
        });

      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) return <div className="text-center mt-5">Loading dashboard...</div>;

  return (
    <div className="container mt-4">
      <h2 className="text-success mb-4">My Dashboard</h2>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4 col-sm-6 mb-3">
          <div className="card shadow-sm text-center p-3">
            <h5>Total Bookings</h5>
            <p className="fs-3 text-success">{stats.total}</p>
          </div>
        </div>
        <div className="col-md-4 col-sm-6 mb-3">
          <div className="card shadow-sm text-center p-3">
            <h5>Pending</h5>
            <p className="fs-3 text-warning">{stats.pending}</p>
          </div>
        </div>
        <div className="col-md-4 col-sm-6 mb-3">
          <div className="card shadow-sm text-center p-3">
            <h5>Completed</h5>
            <p className="fs-3 text-primary">{stats.completed}</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="text-success">Recent Bookings</h5>
          {stats.recent.length > 0 ? (
            <div className="table-responsive mt-3">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Worker</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent.map(b => (
                    <tr key={b._id}>
                      <td>{b.serviceId?.title}</td>
                      <td>{b.workerId?.name}</td>
                      <td>{new Date(b.date).toLocaleDateString()}</td>
                      <td className={`fw-bold ${
                        b.status === 'completed' ? 'text-primary' :
                        b.status === 'pending' ? 'text-warning' :
                        'text-danger'
                      }`}>
                        {b.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted mt-3">No recent bookings.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
