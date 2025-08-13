import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const API_URL = 'https://emis-sh54.onrender.com/api';

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/dash/worker`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(response.data.recentReviews);
        toast.success('Reviews loaded successfully!');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch reviews.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [token]);

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
    <div>
      {loading && <div className="alert alert-info" role="alert">Loading...</div>}
      <h2 className="text-success mb-4">
        <i className="bi bi-star me-2"></i>Manage Reviews
      </h2>
      <div className="card shadow">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0"><i className="bi bi-star me-2"></i>Reviews</h5>
        </div>
        <div className="card-body">
          {reviews.length ? (
            <div className="row">
              {reviews.map((review) => (
                <div key={review._id} className="col-md-6 mb-3">
                  <div className="card border-left-warning">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="card-title">{review.reviewerId?.name || 'Anonymous'}</h6>
                        <span className="badge bg-warning text-dark">{review.rating}/5 ⭐</span>
                      </div>
                      <p className="card-text">{review.comment || 'No comment provided'}</p>
                      <small className="text-muted">{formatDateTime(review.createdAt)}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="bi bi-star display-1 text-muted"></i>
              <p className="text-muted mt-3">No reviews found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageReviews