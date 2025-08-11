import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const BookService = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date: '',
    notes: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'https://emis-sh54.onrender.com/api/bookings',
        { serviceId: id, ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Service booked successfully!");
      navigate('/user-dashboard/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '500px' }}>
      <h3 className="text-success">Book Service</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Date</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Notes</label>
          <textarea
            className="form-control"
            name="notes"
            rows="3"
            value={form.notes}
            onChange={handleChange}
          ></textarea>
        </div>
        <button className="btn btn-success w-100" type="submit">
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookService;
