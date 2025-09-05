// Updated BookService.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const BookService = () => {
  const { id } = useParams(); // Service ID from URL
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    startTime: '',
    endTime: '',
  });
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serviceLoading, setServiceLoading] = useState(true);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!token) {
      toast.warning('Please login to book a service.', {
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '16px',
        },
      });
      navigate('/login');
    }
  }, [token, navigate]);

  // Fetch service details
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`https://emis-sh54.onrender.com/api/service/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setService(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load service details.', {
          style: {
            background: 'linear-gradient(135deg, #ff6b6b 0%, #c0392b 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        });
        navigate('/user-dashboard/services');
      } finally {
        setServiceLoading(false);
      }
    };
    if (token) fetchService();
  }, [id, token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Authentication required. Please login.', {
        style: {
          background: 'linear-gradient(135deg, #ff6b6b 0%, #c0392b 100%)',
          color: 'white',
          borderRadius: '16px',
        },
      });
      navigate('/login');
      return;
    }

    // Parse input values directly from datetime-local fields
    const start = new Date(form.startTime);
    const end = new Date(form.endTime);
    const now = new Date();

    // Validation checks
    if (end <= start) {
      toast.error('End time must be after start time.', {
        style: {
          background: 'linear-gradient(135deg, #ff6b6b 0%, #c0392b 100%)',
          color: 'white',
          borderRadius: '16px',
        },
      });
      return;
    }
    if (start < now) {
      toast.error('Cannot book a time slot in the past.', {
        style: {
          background: 'linear-gradient(135deg, #ff6b6b 0%, #c0392b 100%)',
          color: 'white',
          borderRadius: '16px',
        },
      });
      return;
    }
    if (start.getHours() < 8 || end.getHours() > 18) {
      toast.error('Bookings are only allowed between 8:00 AM and 6:00 PM.', {
        style: {
          background: 'linear-gradient(135deg, #ff6b6b 0%, #c0392b 100%)',
          color: 'white',
          borderRadius: '16px',
        },
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://emis-sh54.onrender.com/api/booking',
        {
          serviceId: id,
          startTime: form.startTime, // already ISO-like from datetime-local
          endTime: form.endTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.message) {
        toast.success('Service booked successfully!', {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        });
        navigate('/user-dashboard/bookings');
      } else {
        toast.error(response.data.message, {
          style: {
            background: 'linear-gradient(135deg, #ff6b6b 0%, #c0392b 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        });
      }
    } catch (err) {
      console.error('Booking error:', err);
      toast.info(err.response?.data?.message || 'Booking failed.', {
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

  return (
    <div>
      {/* Loading Indicator */}
      {serviceLoading && (
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            <i className="fas fa-spinner fa-spin text-2xl text-white mr-2"></i>
            <span className="text-white text-lg">Loading service details...</span>
          </div>
        </div>
      )}

      <div className="group relative p-6 rounded-3xl transition-all duration-500 max-w-md mx-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-colors duration-300"></div>
        <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-3xl transition-all duration-300"></div>
        <div className="relative z-10">
          <h3 className="text-3xl font-bold text-white mb-4">Book Service</h3>
          {service && (
            <div className="mb-6">
              <h4 className="text-2xl font-bold text-white mb-2">Booking: {service.title}</h4>
              <p className="text-gray-300 text-base">{service.description?.slice(0, 100)}...</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="startTime" className="block text-gray-300 mb-2 font-medium">
                Start Time
              </label>
              <input
                type="datetime-local"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                id="startTime"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
                step="900" // 15-minute intervals
              />
            </div>
            <div className="mb-6">
              <label htmlFor="endTime" className="block text-gray-300 mb-2 font-medium">
                End Time
              </label>
              <input
                type="datetime-local"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                id="endTime"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
                step="900" // 15-minute intervals
              />
            </div>
            <button
              className="group relative w-full px-6 py-3 font-semibold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">
                {loading ? (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                ) : null}
                {loading ? 'Booking...' : 'Confirm Booking'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookService;