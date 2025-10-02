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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'from-yellow-500 to-amber-500';
      case 'confirmed':
        return 'from-blue-500 to-cyan-500';
      case 'ongoing':
        return 'from-green-500 to-emerald-500';
      case 'completed':
        return 'from-green-500 to-emerald-500';
      case 'cancelled':
        return 'from-red-500 to-rose-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-white mb-4"></i>
          <p className="text-white text-lg">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
          Manage Bookings
        </h2>
        <p className="text-sm sm:text-base text-gray-300">View and manage your upcoming and past bookings</p>
      </div>

      {/* Bookings List - Cards on Mobile, Table on Desktop */}
      {bookings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm sm:text-base hidden md:table">
            <thead>
              <tr className="bg-white/5">
                <th className="p-3 text-left text-gray-300">Client</th>
                <th className="p-3 text-left text-gray-300">Service</th>
                <th className="p-3 text-left text-gray-300">Start Time</th>
                <th className="p-3 text-left text-gray-300">End Time</th>
                <th className="p-3 text-left text-gray-300">Amount</th>
                <th className="p-3 text-left text-gray-300">Status</th>
                <th className="p-3 text-left text-gray-300">Actions</th>
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
                      className={`inline-block px-2 py-1 rounded-lg text-xs sm:text-sm font-semibold bg-gradient-to-r ${getStatusColor(booking.status)} text-white`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3">
                    {booking.status === 'pending' && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          className="group relative px-3 py-2 font-semibold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 min-h-[44px]"
                          onClick={() => handleConfirm(booking._id)}
                          disabled={loading}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="relative z-10 flex items-center justify-center">
                            <i className="fas fa-check"></i> Confirm
                          </span>
                        </button>
                        <button
                          className="group relative px-3 py-2 font-semibold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 min-h-[44px]"
                          onClick={() => handleCancel(booking._id)}
                          disabled={loading}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="relative z-10 flex items-center justify-center">
                            <i className="fas fa-times"></i> Cancel
                          </span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-xl"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white text-sm">{booking.clientId?.name || 'Unknown'}</h3>
                    <span
                      className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r ${getStatusColor(booking.status)} text-white`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">Service: {booking.serviceId?.title || 'Unknown'}</p>
                  <p className="text-gray-300 text-sm">Start: {formatDate(booking.startTime)}</p>
                  <p className="text-gray-300 text-sm">End: {formatDate(booking.endTime)}</p>
                  <p className="text-gray-300 text-sm">Amount: ${booking.totalAmount}</p>
                  {booking.status === 'pending' && (
                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        className="group relative py-2 font-semibold text-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 min-h-[44px]"
                        onClick={() => handleConfirm(booking._id)}
                        disabled={loading}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 block w-full text-center">
                          <i className="fas fa-check mr-1"></i> Confirm
                        </span>
                      </button>
                      <button
                        className="group relative py-2 font-semibold text-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 min-h-[44px]"
                        onClick={() => handleCancel(booking._id)}
                        disabled={loading}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 block w-full text-center">
                          <i className="fas fa-times mr-1"></i> Cancel
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <i className="fas fa-calendar-times text-4xl sm:text-5xl text-gray-400 mb-4"></i>
          <p className="text-gray-400 text-base sm:text-lg">No bookings found.</p>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;