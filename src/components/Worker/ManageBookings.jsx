// Updated ManageBookings.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const API_URL = 'https://emis-sh54.onrender.com/api';

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/booking`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data);
        toast.success('Bookings loaded successfully!', {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch bookings.', {
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
    fetchBookings();
  }, [token]);

  const handleConfirm = async (id) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/booking/confirm/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(bookings.map((b) => (b._id === id ? response.data : b)));
      toast.success('Booking confirmed successfully!', {
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '16px',
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to confirm booking.', {
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

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setLoading(true);
      try {
        const response = await axios.put(
          `${API_URL}/booking/cancel/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookings(bookings.map((b) => (b._id === id ? response.data : b)));
        toast.success('Booking cancelled successfully!', {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to cancel booking.', {
          style: {
            background: 'linear-gradient(135deg, #ff6b6b 0%, #c0392b 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
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
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        <i className="fas fa-calendar-check text-blue-400 mr-2"></i>
        Manage Bookings
      </h2>

      {/* Bookings List */}
      <div className="group relative p-6 rounded-3xl transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-colors duration-300"></div>
        <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-3xl transition-all duration-300"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
              <i className="fas fa-calendar-check text-white text-lg"></i>
            </div>
            <h5 className="text-2xl font-bold text-white">Bookings</h5>
          </div>
          {bookings.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-300">
                    <th className="p-3">Client</th>
                    <th className="p-3">Service</th>
                    <th className="p-3">Start Time</th>
                    <th className="p-3">End Time</th>
                    <th className="p-3">Amount ($)</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-t border-white/10 hover:bg-white/5 transition-colors duration-300"
                    >
                      <td className="p-3 text-gray-200">{booking.clientId?.name || 'Unknown'}</td>
                      <td className="p-3 text-gray-200">{booking.serviceId?.title || 'Unknown'}</td>
                      <td className="p-3 text-gray-200">{formatDate(booking.startTime)}</td>
                      <td className="p-3 text-gray-200">{formatDate(booking.endTime)}</td>
                      <td className="p-3 text-gray-200">{booking.totalAmount}</td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-lg text-sm font-semibold bg-gradient-to-r ${getStatusColor(booking.status)} text-white`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              className="group relative px-3 py-1 font-semibold text-white rounded-full overflow-hidden me-2 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                              onClick={() => handleConfirm(booking._id)}
                              disabled={loading}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600"></div>
                              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <span className="relative z-10"><i className="fas fa-check"></i></span>
                            </button>
                            <button
                              className="group relative px-3 py-1 font-semibold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50"
                              onClick={() => handleCancel(booking._id)}
                              disabled={loading}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600"></div>
                              <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <span className="relative z-10"><i className="fas fa-times"></i></span>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-calendar-times text-5xl text-gray-400 mb-4"></i>
              <p className="text-gray-400 text-lg">No bookings found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;