import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from '../context/AuthContext';

const WorkerDashboard = () => {
  const [data, setData] = useState({
    profile: { name: '', email: '', skills: [], subscriptionStatus: '' },
    bookings: [],
    reviews: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !user || user.role !== 'worker') {
        setError('Unauthorized access. Please log in as a worker.');
        setLoading(false);
        navigate('/login/worker');
        return;
      }

      setLoading(true);
      setError('');
      try {
        const response = await axios.get('https://emis-sh54.onrender.com/api/dash/worker', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API Response:', response.data); // Debug log
        setData({
          profile: {
            name: response.data.name || user.name || '',
            email: response.data.email || user.email || '',
            skills: response.data.skills || [],
            subscriptionStatus: response.data.subscriptionStatus || 'N/A',
          },
          bookings: response.data.bookings || [],
          reviews: response.data.reviews || [],
        });
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.response?.data?.message || 'Failed to fetch worker data.');
        setLoading(false);
      }
    };
    fetchData();
  }, [token, user, navigate]);

  return (
    <div>
      <h1 className="text-success mb-4">Worker Dashboard</h1>

      {loading && <div className="alert alert-info" role="alert">Loading data...</div>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {!loading && !error && (
        <>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card shadow h-100">
                <div className="card-body text-center">
                  <i className="bi bi-person display-4 text-success mb-3"></i>
                  <h4 className="card-title">Profile</h4>
                  <p className="card-text"><strong>Name:</strong> {data.profile.name}</p>
                  <p className="card-text"><strong>Email:</strong> {data.profile.email}</p>
                  <p className="card-text"><strong>Skills:</strong> {data.profile.skills.join(', ') || 'N/A'}</p>
                  <p className="card-text"><strong>Status:</strong> {data.profile.subscriptionStatus}</p>
                  <Link to="/worker-dashboard/settings" className="btn btn-success">Update Profile</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card shadow h-100">
                <div className="card-body text-center">
                  <i className="bi bi-calendar-check display-4 text-success mb-3"></i>
                  <h4 className="card-title">Total Bookings</h4>
                  <p className="card-text fs-3">{data.bookings.length}</p>
                  <Link to="/worker-dashboard/bookings" className="btn btn-success">View Bookings</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card shadow h-100">
                <div className="card-body text-center">
                  <i className="bi bi-star display-4 text-success mb-3"></i>
                  <h4 className="card-title">Average Rating</h4>
                  <p className="card-text fs-3">
                    {data.reviews.length > 0
                      ? (data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length).toFixed(1)
                      : 'N/A'}
                  </p>
                  <Link to="/worker-dashboard/reviews" className="btn btn-success">View Reviews</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow mt-4">
            <div className="card-body">
              <h4 className="card-title text-success">Recent Bookings</h4>
              {data.bookings.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {data.bookings.slice(0, 5).map((booking) => (
                    <li key={booking._id} className="list-group-item">
                      {booking.clientId?.name || 'Unknown Client'} booked {booking.serviceId?.title || 'Unknown Service'}
                      <small className="text-muted"> ({new Date(booking.createdAt).toLocaleString()})</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No recent bookings.</p>
              )}
            </div>
          </div>

          <div className="card shadow mt-4">
            <div className="card-body">
              <h4 className="card-title text-success">Recent Reviews</h4>
              {data.reviews.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {data.reviews.slice(0, 5).map((review) => (
                    <li key={review._id} className="list-group-item">
                      {review.reviewerId?.name || 'Unknown Reviewer'}: {review.rating}/5 - {review.comment || 'No comment'}
                      <small className="text-muted"> ({new Date(review.createdAt).toLocaleString()})</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No recent reviews.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkerDashboard;