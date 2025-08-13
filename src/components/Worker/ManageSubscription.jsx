import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
        toast.success('Profile loaded successfully!');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch profile.');
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
      toast.success('Subscription activated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process payment.');
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

  return (
    <div>
      {loading && <div className="alert alert-info" role="alert">Loading...</div>}
      <h2 className="text-success mb-4">
        <i className="bi bi-credit-card me-2"></i>Subscription Management
      </h2>
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Current Subscription</h5>
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Status:</strong>
                    <span className={`badge bg-${worker.subscriptionStatus === 'active' ? 'success' : 'secondary'} ms-2`}>
                      {worker.subscriptionStatus?.toUpperCase()}
                    </span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p><strong>Plan:</strong> Monthly Premium</p>
                  <p><strong>Price:</strong> ${paymentAmount}/month</p>
                  {worker.subscriptionEndDate && (
                    <p><strong>Next Billing:</strong> {formatDate(worker.subscriptionEndDate)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {worker.subscriptionStatus !== 'active' && (
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>Activate Subscription
                </h5>
                <p className="text-muted">
                  Activate your subscription to start receiving bookings and managing your services.
                </p>
                <div className="mb-3">
                  <label className="form-label">Payment Amount</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                </div>
                <button
                  className="btn btn-success btn-lg"
                  onClick={handleSubscriptionPayment}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-credit-card me-2"></i>
                      Pay & Activate Subscription
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="col-md-4">
          <div className="card border-success shadow-sm">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-check-circle me-2"></i>Premium Benefits
              </h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Receive client bookings</li>
                <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Manage unlimited services</li>
                <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>24/7 customer support</li>
                <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Analytics dashboard</li>
                <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Enhanced profile visibility</li>
                <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Priority listing in search</li>
                <li><i className="bi bi-check-circle text-success me-2"></i>Mobile app access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSubscription;