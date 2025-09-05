// Updated UserDashboard.jsx
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
        toast.error(err.response?.data?.message || "Failed to load dashboard", {
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

    fetchStats();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'from-blue-500 to-cyan-500';
      case 'pending':
        return 'from-yellow-500 to-amber-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
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
        <i className="fas fa-tachometer-alt text-blue-400 mr-2"></i>
        My Dashboard
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Total Bookings"
          value={stats.total}
          icon="fas fa-book"
          color="from-green-500 to-emerald-500"
        />
        <DashboardCard
          title="Pending"
          value={stats.pending}
          icon="fas fa-clock"
          color="from-yellow-500 to-amber-500"
        />
        <DashboardCard
          title="Completed"
          value={stats.completed}
          icon="fas fa-check-circle"
          color="from-blue-500 to-cyan-500"
        />
      </div>

      {/* Recent Bookings */}
      <div className="group relative p-6 rounded-3xl transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-colors duration-300"></div>
        <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-3xl transition-all duration-300"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
              <i className="fas fa-history text-white text-lg"></i>
            </div>
            <h5 className="text-2xl font-bold text-white">Recent Bookings</h5>
          </div>
          {stats.recent.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-300">
                    <th className="p-3">Service</th>
                    <th className="p-3">Worker</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent.map((b) => (
                    <tr
                      key={b._id}
                      className="border-t border-white/10 hover:bg-white/5 transition-colors duration-300"
                    >
                      <td className="p-3 text-gray-200">{b.serviceId?.title}</td>
                      <td className="p-3 text-gray-200">{b.workerId?.name}</td>
                      <td className="p-3 text-gray-200">{new Date(b.date).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-lg text-sm font-semibold bg-gradient-to-r ${getStatusColor(b.status)} text-white`}
                        >
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-history text-5xl text-gray-400 mb-4"></i>
              <p className="text-gray-400 text-lg">No recent bookings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, icon, color }) => (
  <div className="group relative p-6 rounded-3xl transition-all duration-500 hover:scale-105">
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 rounded-3xl transition-opacity duration-300`}></div>
    <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 rounded-3xl backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-all duration-300"></div>
    <div className="relative z-10 text-center">
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <i className={`${icon} text-xl text-white`}></i>
      </div>
      <h5 className="text-xl font-bold text-white mb-2">{title}</h5>
      <h2 className="text-3xl font-black text-gray-200">{value}</h2>
    </div>
  </div>
);

export default UserDashboard;