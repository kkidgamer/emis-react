import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ServiceDetails = () => {
  const { id } = useParams(); // Get service ID from URL params
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`https://emis-sh54.onrender.com/api/service/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setService(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load service details');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id, token]); // Include token in dependencies in case it changes

  const handleBookNow = () => {
    if (!token) {
      toast.warning('Please login to book this service.');
      navigate('/login');
    } else {
      navigate(`/user-dashboard/book/${id}`);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading service...</div>;
  if (!service) return <div className="text-center mt-5">Service not found.</div>;

  return (
    <div className="container mt-4">
      <h2 className="text-success">{service.title}</h2>
      <img
        src={service.image || 'https://via.placeholder.com/600x300'}
        alt={service.title}
        className="img-fluid my-3"
        style={{ maxHeight: '300px', objectFit: 'cover' }}
      />
      <p>{service.description}</p>
      <p className="fw-bold text-success">
        {service.price ? `KES ${service.price}` : 'Price on request'}
      </p>
      <p>
        <strong>Worker:</strong> {service.workerId?.name || 'Unknown'}
      </p>

      <button className="btn btn-success" onClick={handleBookNow}>
        Book Now
      </button>

      {/* Reviews */}
      <div className="mt-4">
        <h5>Reviews</h5>
        {service.reviews && service.reviews.length > 0 ? (
          <ul className="list-group">
            {service.reviews.map((r) => (
              <li key={r._id} className="list-group-item">
                <strong>{r.reviewerId?.name || 'Anonymous'}:</strong> {r.comment}
                <span className="text-warning"> ★ {r.rating}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ServiceDetails;