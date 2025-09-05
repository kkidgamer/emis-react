import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import AnimatedBackground from '../AnimatedBackground'; // Import the AnimatedBackground component
import { Link } from 'react-router-dom';

// Add Font Awesome CSS (already handled in AnimatedBackground, but ensure it's loaded)
const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.rel = 'stylesheet';
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
if (!document.querySelector('link[href*="font-awesome"]')) {
  document.head.appendChild(fontAwesomeLink);
}

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
        toast.success('Data loaded successfully!', {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch data.', {
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
    fetchData();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'from-green-500 to-emerald-500';
      case 'pending':
        return 'from-yellow-500 to-amber-500';
      case 'confirmed':
        return 'from-blue-500 to-cyan-500';
      case 'ongoing':
        return 'from-blue-500 to-cyan-500';
      case 'completed':
        return 'from-green-500 to-emerald-500';
      case 'cancelled':
        return 'from-red-500 to-rose-500';
      case 'inactive':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-gray-500 to-gray-600';
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
    <AnimatedBackground className="py-12 px-6">
      {/* Loading Indicator */}
      {loading && (
        <div className="relative z-20 text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            <i className="fas fa-spinner fa-spin text-2xl text-white mr-2"></i>
            <span className="text-white text-lg">Loading...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <h2 className="relative z-20 text-4xl sm:text-5xl font-black mb-8 text-white">
        <i className="fas fa-tachometer-alt text-blue-400 mr-2"></i>
        Worker Dashboard
      </h2>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="group relative p-6 rounded-3xl transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-colors duration-300"></div>
            <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-3xl transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-user text-white text-xl"></i>
                </div>
                <h5 className="text-xl font-bold text-white">Profile</h5>
              </div>
              <div className="space-y-2 text-gray-300 text-base">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p>
                  <strong>Subscription Status:</strong>
                  <span
                    className={`inline-block px-2 py-1 rounded-lg text-sm font-semibold bg-gradient-to-r ${getStatusColor(
                      user.subscriptionStatus
                    )} text-white ml-2`}
                  >
                    {user.subscriptionStatus?.toUpperCase()}
                  </span>
                </p>
                <Link
                  to="/profile"
                  className="inline-block group relative px-4 py-2 mt-4 font-semibold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 no-underline"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <DashboardCard
                title="Services"
                value={data.workerServices}
                icon="fas fa-list"
                color="from-blue-500 to-cyan-500"
              />
              <DashboardCard
                title="Active Bookings"
                value={data.activeBookings}
                icon="fas fa-calendar"
                color="from-cyan-500 to-blue-500"
              />
              <DashboardCard
                title="Completed Bookings"
                value={data.completedBookings}
                icon="fas fa-calendar-check"
                color="from-green-500 to-emerald-500"
              />
              <DashboardCard
                title="Total Earnings"
                value={`$${data.totalEarnings}`}
                icon="fas fa-dollar-sign"
                color="from-yellow-500 to-amber-500"
              />
              <DashboardCard
                title="Average Rating"
                value={data.averageRating.toFixed(1)}
                icon="fas fa-star"
                color="from-red-500 to-rose-500"
              />
              <DashboardCard
                title="Unread Messages"
                value={data.unreadMessages}
                icon="fas fa-envelope"
                color="from-purple-500 to-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Recent Bookings and Reviews */}
        <RecentList
          title="Recent Bookings"
          items={data.recentBookings}
          type="booking"
          formatDate={formatDate}
          getStatusColor={getStatusColor}
        />
        <RecentList
          title="Recent Reviews"
          items={data.recentReviews}
          type="review"
          formatDateTime={formatDateTime}
          getStatusColor={getStatusColor}
        />
      </div>
    </AnimatedBackground>
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
      <h2 className="text-3xl font-black text-gray-200">{value || 0}</h2>
    </div>
  </div>
);

const RecentList = ({ title, items, type, formatDate, formatDateTime, getStatusColor }) => (
  <div className="group relative mt-8 p-6 rounded-3xl transition-all duration-500">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-colors duration-300"></div>
    <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-3xl transition-all duration-300"></div>
    <div className="relative z-10">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
          <i className={`fas ${type === 'booking' ? 'fa-calendar-check' : 'fa-star'} text-white text-lg`}></i>
        </div>
        <h5 className="text-2xl font-bold text-white">{title}</h5>
      </div>
      {items?.length ? (
        type === 'booking' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-300">
                  <th className="p-3">Client</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t border-white/10 hover:bg-white/5 transition-colors duration-300"
                  >
                    <td className="p-3 text-gray-200">{item.clientId?.name || 'Unknown'}</td>
                    <td className="p-3 text-gray-200">{item.serviceId?.title || 'Unknown'}</td>
                    <td className="p-3 text-gray-200">{formatDate(item.startTime)}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-lg text-sm font-semibold bg-gradient-to-r ${getStatusColor(
                          item.status
                        )} text-white`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="group relative p-4 rounded-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-2xl group-hover:from-yellow-500/30 group-hover:to-amber-500/30 transition-colors duration-300"></div>
                <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-2xl transition-all duration-300"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <h6 className="font-bold text-lg text-white">{item.reviewerId?.name || 'Anonymous'}</h6>
                    <span
                      className={`inline-block px-2 py-1 rounded-lg text-sm font-semibold bg-gradient-to-r from-yellow-500 to-amber-500 text-white`}
                    >
                      {item.rating}/5 <i className="fas fa-star ml-1"></i>
                    </span>
                  </div>
                  <p className="text-gray-300 text-base italic">{item.comment || 'No comment provided'}</p>
                  <p className="text-gray-400 text-sm mt-2">{formatDateTime(item.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-8">
          <i
            className={`fas ${type === 'booking' ? 'fa-calendar-xmark' : 'fa-star'} text-5xl text-gray-400 mb-4`}
          ></i>
          <p className="text-gray-400 text-lg">{`No ${type}s found.`}</p>
        </div>
      )}
    </div>
  </div>
);

export default WorkerDashboard;