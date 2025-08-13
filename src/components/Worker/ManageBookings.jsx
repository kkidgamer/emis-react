import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
        toast.success('Bookings loaded successfully!');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch bookings.');
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
      toast.success('Booking confirmed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to confirm booking.');
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
        toast.success('Booking cancelled successfully!');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to cancel booking.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'ongoing': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
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
      {loading && <div className="alert alert-info" role="alert">Loading...</div>}
      <h2 className="text-success mb-4">
        <i className="bi bi-calendar-check me-2"></i>Manage Bookings
      </h2>
      <div className="card shadow">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0"><i className="bi bi-calendar-check me-2"></i>Bookings</h5>
        </div>
        <div className="card-body">
          {bookings.length ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Amount ($)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.clientId?.name || 'Unknown'}</td>
                      <td>{booking.serviceId?.title || 'Unknown'}</td>
                      <td>{formatDate(booking.startTime)}</td>
                      <td>{formatDate(booking.endTime)}</td>
                      <td>{booking.totalAmount}</td>
                      <td>
                        <span className={`badge bg-${getStatusColor(booking.status)}`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {booking.status === 'pending' && (
                          <>
                            <button
                              className="btn btn-outline-success btn-sm me-2"
                              onClick={() => handleConfirm(booking._id)}
                              disabled={loading}
                            >
                              <i className="bi bi-check-circle"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleCancel(booking._id)}
                              disabled={loading}
                            >
                              <i className="bi bi-x-circle"></i>
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
            <div className="text-center py-4">
              <i className="bi bi-calendar-x display-1 text-muted"></i>
              <p className="text-muted mt-3">No bookings found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;