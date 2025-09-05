// Updated ManageReviews.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

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
        toast.success('Reviews loaded successfully!', {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch reviews.', {
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
        <i className="fas fa-star text-blue-400 mr-2"></i>
        Manage Reviews
      </h2>

      {/* Reviews List */}
      <div className="group relative p-6 rounded-3xl transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-colors duration-300"></div>
        <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-3xl transition-all duration-300"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
              <i className="fas fa-star text-white text-lg"></i>
            </div>
            <h5 className="text-2xl font-bold text-white">Reviews</h5>
          </div>
          {reviews.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="group relative p-4 rounded-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-2xl group-hover:from-yellow-500/30 group-hover:to-amber-500/30 transition-colors duration-300"></div>
                  <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-2xl transition-all duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <h6 className="font-bold text-lg text-white">{review.reviewerId?.name || 'Anonymous'}</h6>
                      <span
                        className="inline-block px-2 py-1 rounded-lg text-sm font-semibold bg-gradient-to-r from-yellow-500 to-amber-500 text-white"
                      >
                        {review.rating}/5 <i className="fas fa-star ml-1"></i>
                      </span>
                    </div>
                    <p className="text-gray-300 text-base italic">{review.comment || 'No comment provided'}</p>
                    <p className="text-gray-400 text-sm mt-2">{formatDateTime(review.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-star text-5xl text-gray-400 mb-4"></i>
              <p className="text-gray-400 text-lg">No reviews found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageReviews;