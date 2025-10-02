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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-white mb-4"></i>
          <p className="text-white text-lg">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center">
          <i className="fas fa-star text-blue-400 mr-2"></i>
          Manage Reviews
        </h2>
        <p className="text-sm sm:text-base text-gray-300">View feedback from your clients</p>
      </div>

      {/* Reviews Grid - Responsive Cards */}
      <div className="group relative p-4 sm:p-6 rounded-3xl transition-all duration-500 bg-white/5 backdrop-blur-xl border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-colors duration-300"></div>
        <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-3xl transition-all duration-300"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <i className="fas fa-star text-white text-sm sm:text-lg"></i>
            </div>
            <h5 className="text-lg sm:text-2xl font-bold text-white">Reviews</h5>
          </div>
          {reviews.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="group relative p-3 sm:p-4 rounded-2xl transition-all duration-300 hover:scale-105 bg-white/5 backdrop-blur-xl border border-white/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-2xl group-hover:from-yellow-500/30 group-hover:to-amber-500/30 transition-colors duration-300"></div>
                  <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-2xl transition-all duration-300"></div>
                  <div className="relative z-10 space-y-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <h6 className="font-bold text-base sm:text-lg text-white">{review.reviewerId?.name || 'Anonymous'}</h6>
                      <span
                        className="inline-block px-2 py-1 rounded-lg text-xs sm:text-sm font-semibold bg-gradient-to-r from-yellow-500 to-amber-500 text-white"
                      >
                        {review.rating}/5 <i className="fas fa-star ml-1"></i>
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base italic leading-relaxed">{review.comment || 'No comment provided'}</p>
                    <p className="text-gray-400 text-xs sm:text-sm">{formatDateTime(review.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <i className="fas fa-star text-4xl sm:text-5xl text-gray-400 mb-4"></i>
              <p className="text-gray-400 text-base sm:text-lg">No reviews found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageReviews;