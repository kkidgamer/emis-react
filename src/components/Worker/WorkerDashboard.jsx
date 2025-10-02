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

  const renderItems = (items, type) => {
    if (items.length === 0) return null;

    if (type === 'booking') {
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-sm hidden md:table">
            <thead>
              <tr className="bg-white/5">
                <th className="p-3 text-left text-gray-300">Client</th>
                <th className="p-3 text-left text-gray-300">Service</th>
                <th className="p-3 text-left text-gray-300">Date</th>
                <th className="p-3 text-left text-gray-300">Status</th>
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
                      className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r ${getStatusColor(item.status)} text-white`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Mobile Cards for Bookings */}
          <div className="md:hidden space-y-3">
            {items.map((item) => (
              <div key={item._id} className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-200 text-sm font-medium">{item.clientId?.name || 'Unknown'}</span>
                    <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getStatusColor(item.status)} text-white`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs">{item.serviceId?.title || 'Unknown'}</p>
                  <p className="text-gray-400 text-xs">{formatDate(item.startTime)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      // Reviews
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="group relative p-3 sm:p-4 rounded-2xl transition-all duration-300 hover:scale-105 bg-white/5 border border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-2xl group-hover:from-yellow-500/30 group-hover:to-amber-500/30 transition-colors duration-300"></div>
              <div className="relative z-10 space-y-2">
                <div className="flex justify-between items-start">
                  <h6 className="font-bold text-sm sm:text-base text-white truncate">{item.reviewerId?.name || 'Anonymous'}</h6>
                  <span
                    className="inline-block px-2 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-yellow-500 to-amber-500 text-white"
                  >
                    {item.rating}/5 <i className="fas fa-star ml-1"></i>
                  </span>
                </div>
                <p className="text-gray-300 text-xs sm:text-sm italic leading-relaxed line-clamp-3">{item.comment || 'No comment provided'}</p>
                <p className="text-gray-400 text-xs">{formatDateTime(item.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <AnimatedBackground className="min-h-screen py-4 sm:py-6 px-2 sm:px-4">
      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh] p-4">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-3xl text-white mb-4"></i>
            <p className="text-white text-lg">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-sm sm:text-base text-gray-300">Here's what's happening with your services</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { value: data.workerServices, label: 'Services', icon: 'fas fa-list', color: 'from-blue-500 to-cyan-500' },
              { value: data.activeBookings, label: 'Active', icon: 'fas fa-calendar-check', color: 'from-green-500 to-emerald-500' },
              { value: data.completedBookings, label: 'Completed', icon: 'fas fa-check-circle', color: 'from-purple-500 to-pink-500' },
              { value: `$${data.totalEarnings}`, label: 'Earnings', icon: 'fas fa-dollar-sign', color: 'from-yellow-500 to-amber-500' },
              { value: data.averageRating, label: 'Avg Rating', icon: 'fas fa-star', color: 'from-orange-500 to-red-500' },
              { value: data.unreadMessages, label: 'Messages', icon: 'fas fa-envelope', color: 'from-indigo-500 to-violet-500' },
            ].map((stat, index) => (
              <Link
                key={index}
                to={stat.label === 'Messages' ? '/worker/messages' : '#'}
                className="group relative p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/5 group-hover:to-white/20 rounded-xl transition-colors duration-300"></div>
                <div className="flex flex-col items-center space-y-2 text-center relative z-10">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                    <i className={`${stat.icon} text-white text-sm sm:text-base`}></i>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-white text-sm sm:text-base">{stat.value}</p>
                    <p className="text-gray-400 text-xs">{stat.label}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Sections */}
          <div className="space-y-6 sm:space-y-8">
            {/* Recent Bookings */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
                <i className="fas fa-calendar mr-2 text-blue-400"></i>
                Recent Bookings
                {data.recentBookings.length > 0 && (
                  <Link to="/worker/bookings" className="ml-auto text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    View All <i className="fas fa-arrow-right ml-1"></i>
                  </Link>
                )}
              </h3>
              {renderItems(data.recentBookings, 'booking')}
            </div>

            {/* Recent Reviews */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
                <i className="fas fa-star mr-2 text-yellow-400"></i>
                Recent Reviews
                {data.recentReviews.length > 0 && (
                  <Link to="/worker/reviews" className="ml-auto text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
                    View All <i className="fas fa-arrow-right ml-1"></i>
                  </Link>
                )}
              </h3>
              {renderItems(data.recentReviews, 'review')}
            </div>
          </div>

          {/* No Data State */}
          {(!data.recentBookings.length && !data.recentReviews.length) && (
            <div className="text-center py-12">
              <i className="fas fa-chart-line text-5xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-bold text-gray-300 mb-2">Get Started</h3>
              <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto">
                Add your first service or check for new bookings to see activity here.
              </p>
              <Link
                to="/worker/services"
                className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
              >
                Add Service
              </Link>
            </div>
          )}
        </div>
      )}
    </AnimatedBackground>
  );
};

export default WorkerDashboard;