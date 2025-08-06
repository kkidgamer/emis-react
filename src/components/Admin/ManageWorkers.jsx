import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from '../context/AuthContext';

const ManageWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext)
  console.log(token)

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('https://emis-sh54.onrender.com/api/worker', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data)
        setWorkers(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err)
        setError(err.response?.data?.message || 'Failed to fetch workers.');
        setLoading(false);
      }
    };
    fetchWorkers();
  }, [token]);

  const handleStatusToggle = async (workerId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await axios.put(
        `https://emis-sh54.onrender.com/api/worker/${workerId}`,
        { subscriptionStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorkers(workers.map(worker =>
        worker._id === workerId ? { ...worker, subscriptionStatus: newStatus } : worker
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update worker status.');
    }
  };

  const handleDelete = async (workerId) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        await axios.delete(`https://emis-sh54.onrender.com/api/worker/${workerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkers(workers.filter(worker => worker._id !== workerId));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete worker.');
      }
    }
  };

  return (
    <div>
      <h1 className="text-success mb-4">Manage Workers</h1>

      {loading && <div className="alert alert-info" role="alert">Loading workers...</div>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="card shadow">
        <div className="card-body">
          <h4 className="card-title text-success">Worker List</h4>
          {workers.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Skills</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map(worker => (
                    <tr key={worker._id}>
                      <td>{worker.name}</td>
                      <td>{worker.email}</td>
                      <td>{worker.skills?.join(', ') || 'N/A'}</td>
                      <td>{worker.subscriptionStatus}</td>
                      <td>
                        <button
                          className={`btn btn-sm ${worker.subscriptionStatus === 'active' ? 'btn-warning' : 'btn-success'} me-2`}
                          onClick={() => handleStatusToggle(worker._id, worker.subscriptionStatus)}
                        >
                          {worker.subscriptionStatus === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(worker._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No workers found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageWorkers;