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
      toast.warning('Please login to book a service.');
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
        toast.error(err.response?.data?.message || 'Failed to load service details.');
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
    toast.error('Authentication required. Please login.');
    navigate('/login');
    return;
  }

  // Parse input values directly from datetime-local fields
  const start = new Date(form.startTime);
  const end = new Date(form.endTime);
  const now = new Date();

  // Validation checks
  if (end <= start) {
    toast.error('End time must be after start time.');
    return;
  }
  if (start < now) {
    toast.error('Cannot book a time slot in the past.');
    return;
  }
  if (start.getHours() < 8 || end.getHours() > 18) {
    toast.error('Bookings are only allowed between 8:00 AM and 6:00 PM.');
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
      toast.success('Service booked successfully!');
      navigate('/user-dashboard/bookings');
    } else {
      toast.error(response.data.message);
    }
  } catch (err) {
    console.error('Booking error:', err);
    toast.info(err.response?.data?.message || 'Booking failed.');
  } finally {
    setLoading(false);
  }
};


  if (serviceLoading) {
    return (
      <div className="text-center mt-5">
        <span className="spinner-border spinner-border-sm text-success" role="status"></span>
        <span className="ms-2">Loading service details...</span>
      </div>
    );
  }

  return (
    <div className="container mt-4" style={{ maxWidth: '500px' }}>
      <h3 className="text-success">Book Service</h3>
      {service && (
        <div className="mb-3">
          <h4>Booking: {service.title}</h4>
          <p className="text-muted">{service.description?.slice(0, 100)}...</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {/* <div className="mb-3">
          <label htmlFor="date" className="form-label">
            Date
          </label>
          <input
            type="date"
            className="form-control"
            id="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]} // Prevent past dates
          />
        </div> */}
        <div className="mb-3">
          <label htmlFor="startTime" className="form-label">
            Start Time
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="startTime"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
            step="900" // 15-minute intervals
          />
        </div>
        <div className="mb-3">
          <label htmlFor="endTime" className="form-label">
            End Time
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="endTime"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
            step="900" // 15-minute intervals
          />
        </div>
        {/* <div className="mb-3">
          <label htmlFor="notes" className="form-label">
            Notes
          </label>
          <textarea
            className="form-control"
            id="notes"
            name="notes"
            rows="3"
            value={form.notes}
            onChange={handleChange}
            placeholder="Any additional details or requests..."
          />
        </div> */}
        <button
          className="btn btn-success w-100"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Booking...
            </>
          ) : (
            'Confirm Booking'
          )}
        </button>
      </form>
    </div>
  );
};

export default BookService;