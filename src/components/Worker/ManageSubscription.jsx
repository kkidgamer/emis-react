// Updated ManageSubscription.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ManageSubscription = () => {
  const [worker, setWorker] = useState({ subscriptionStatus: 'inactive', subscriptionEndDate: null });
  const [paymentAmount, setPaymentAmount] = useState(20);
  const [loading, setLoading] = useState(false);
  const { token, user } = useContext(AuthContext);
  const API_URL = 'https://emis-sh54.onrender.com/api';

  useEffect(() => {
    const fetchWorker = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/worker/${user.worker}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorker(response.data);
        toast.success('Profile loaded successfully!', {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch profile.', {
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
    fetchWorker();
  }, [token, user.worker]);

  const handleSubscriptionPayment = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/worker/sub/${user.worker}`,
        { paymentAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorker(response.data.worker);
      toast.success('Subscription activated successfully!', {
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '16px',
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process payment.', {
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'from-green-500 to-emerald-500' : 'from-gray-500 to-gray-600';
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
        <i className="fas fa-credit-card text-blue-400 mr-2"></i>
        Subscription Management
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          {/* Current Subscription */}
          <div className="group relative mb-6 p-6 rounded-3xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-colors duration-300"></div>
            <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-3xl transition-all duration-300"></div>
            <div className="relative z-10">
              <h5 className="text-2xl font-bold text-white mb-4">Current Subscription</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-300">
                    <strong>Status:</strong>
                    <span
                      className={`inline-block px-2 py-1 rounded-lg text-sm font-semibold bg-gradient-to-r ${getStatusColor(worker.subscriptionStatus)} text-white ml-2`}
                    >
                      {worker.subscriptionStatus?.toUpperCase()}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-300"><strong>Plan:</strong> Monthly Premium</p>
                  <p className="text-gray-300"><strong>Price:</strong> ${paymentAmount}/month</p>
                  {worker.subscriptionEndDate && (
                    <p className="text-gray-300"><strong>Next Billing:</strong> {formatDate(worker.subscriptionEndDate)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Activate Subscription */}
          {worker.subscriptionStatus !== 'active' && (
            <div className="group relative p-6 rounded-3xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-amber-600/20 rounded-3xl group-hover:from-yellow-600/30 group-hover:to-amber-600/30 transition-colors duration-300"></div>
              <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-3xl transition-all duration-300"></div>
              <div className="relative z-10">
                <h5 className="text-2xl font-bold text-yellow-300 mb-4">
                  <i className="fas fa-exclamation-triangle mr-2"></i>Activate Subscription
                </h5>
                <p className="text-gray-300 mb-4">
                  Activate your subscription to start receiving bookings and managing your services.
                </p>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 font-medium">Payment Amount</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-gray-300 bg-white/5 border border-r-0 border-white/10 rounded-l-lg">$</span>
                    <input
                      type="number"
                      className="flex-grow bg-white/5 border border-white/10 rounded-r-lg p-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                </div>
                <button
                  className="group relative px-6 py-3 font-semibold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  onClick={handleSubscriptionPayment}
                  disabled={loading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">
                    {loading ? (
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                    ) : (
                      <i className="fas fa-credit-card mr-2"></i>
                    )}
                    Pay & Activate Subscription
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Premium Benefits */}
        <div className="lg:col-span-4">
          <div className="group relative p-6 rounded-3xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-3xl group-hover:from-green-600/30 group-hover:to-emerald-600/30 transition-colors duration-300"></div>
            <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-3xl transition-all duration-300"></div>
            <div className="relative z-10">
              <h5 className="text-2xl font-bold text-white mb-4">
                <i className="fas fa-check-circle mr-2 text-green-400"></i>Premium Benefits
              </h5>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-2"></i>Receive client bookings</li>
                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-2"></i>Manage unlimited services</li>
                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-2"></i>24/7 customer support</li>
                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-2"></i>Analytics dashboard</li>
                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-2"></i>Enhanced profile visibility</li>
                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-2"></i>Priority listing in search</li>
                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-2"></i>Mobile app access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSubscription;