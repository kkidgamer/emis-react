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
    date: '',
    startTime: '',
    endTime: '',
    notes: '',
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

    // Validate date
    const selectedDate = new Date(form.date);
    const now = new Date(); // Current date and time: 2025-08-13 10:33 AM EAT
    now.setHours(0, 0, 0, 0); // Reset time for date comparison
    if (form.date && selectedDate < now) {
      toast.error('Cannot book a service for a past date.');
      return;
    }

    // Validate startTime and endTime
    if (form.date && form.startTime && form.endTime) {
      const start = new Date(`${form.date}T${form.startTime}:00+03:00`);
      const end = new Date(`${form.date}T${form.endTime}:00+03:00`);

      // Check if endTime is after startTime
      if (end <= start) {
        toast.error('End time must be after start time.');
        return;
      }

      // Check if booking is in the past (for same-day bookings)
      if (selectedDate.toDateString() === now.toDateString() && start <= now) {
        toast.error('Cannot book a time slot in the past.');
        return;
      }

      // Validate business hours (8:00 AM to 6:00 PM)
      const startHour = start.getHours();
      const endHour = end.getHours();
      if (startHour < 8 || endHour > 18) {
        toast.error('Bookings are only allowed between 8:00 AM and 6:00 PM.');
        return;
      }
    }

    // Format startTime and endTime as ISO 8601 with EAT timezone
    const startTimeISO = form.date && form.startTime ? `${form.date}T${form.startTime}:00+03:00` : undefined;
    const endTimeISO = form.date && form.endTime ? `${form.date}T${form.endTime}:00+03:00` : undefined;

    setLoading(true);
    try {
      const response = await axios.post(
        'https://emis-sh54.onrender.com/api/booking',
        {
          serviceId: id,
          startTime: startTimeISO,
          endTime: endTimeISO,
          notes: form.notes.trim() || undefined, // Send undefined if notes are empty
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message || 'Service booked successfully!');
      navigate('/user-dashboard/bookings');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Booking failed. Please try again.';
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (err.response?.status === 403) {
        toast.error('You do not have permission to book this service.');
      } else {
        toast.error(errorMessage);
      }
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
        <div className="mb-3">
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
        </div>
        <div className="mb-3">
          <label htmlFor="startTime" className="form-label">
            Start Time
          </label>
          <input
            type="time"
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
            type="time"
            className="form-control"
            id="endTime"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
            step="900" // 15-minute intervals
          />
        </div>
        <div className="mb-3">
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
        </div>
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