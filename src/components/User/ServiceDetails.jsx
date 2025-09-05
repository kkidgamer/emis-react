// Updated ServiceDetails.jsx
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
        toast.error(err.response?.data?.message || 'Failed to load service details', {
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
    fetchService();
  }, [id, token]);

  const handleBookNow = () => {
    if (!token) {
      toast.warning('Please login to book this service.', {
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '16px',
        },
      });
      navigate('/login');
    } else {
      navigate(`/user-dashboard/book/${id}`);
    }
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

      {service ? (
        <div className="group relative p-6 rounded-3xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-colors duration-300"></div>
          <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-3xl transition-all duration-300"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">{service.title}</h2>
            <img
              src={service.image || 'https://via.placeholder.com/600x300'}
              alt={service.title}
              className="w-full h-64 object-cover rounded-2xl mb-4"
            />
            <p className="text-gray-300 mb-4">{service.description}</p>
            <p className="text-green-400 font-bold mb-2">
              {service.price ? `KES ${service.price}` : 'Price on request'}
            </p>
            <p className="text-gray-300 mb-6">
              <strong>Worker:</strong> {service.workerId?.name || 'Unknown'}
            </p>
            <button
              className="group relative px-6 py-3 font-semibold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
              onClick={handleBookNow}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10"><i className="fas fa-book-open mr-2"></i>Book Now</span>
            </button>

            {/* Reviews */}
            <div className="mt-8">
              <h5 className="text-2xl font-bold text-white mb-4">Reviews</h5>
              {service.reviews && service.reviews.length > 0 ? (
                <div className="space-y-4">
                  {service.reviews.map((r) => (
                    <div
                      key={r._id}
                      className="group relative p-4 rounded-2xl transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-2xl group-hover:from-yellow-500/30 group-hover:to-amber-500/30 transition-colors duration-300"></div>
                      <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-2xl transition-all duration-300"></div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                          <h6 className="font-bold text-lg text-white">{r.reviewerId?.name || 'Anonymous'}</h6>
                          <span className="inline-block px-2 py-1 rounded-lg text-sm font-semibold bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
                            {r.rating} <i className="fas fa-star ml-1"></i>
                          </span>
                        </div>
                        <p className="text-gray-300 text-base italic">{r.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <i className="fas fa-exclamation-circle text-5xl mb-4"></i>
          <p className="text-lg">Service not found.</p>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;