import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from '../context/AuthContext';


const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('https://emis-sh54.onrender.com/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users.');
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await axios.put(
        `https://emis-sh54.onrender.com/api/user/${userId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(user =>
        user._id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`https://emis-sh54.onrender.com/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  return (
    <div>
      <h1 className="text-success mb-4">Manage Users</h1>

      {loading && <div className="alert alert-info" role="alert">Loading users...</div>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="card shadow">
        <div className="card-body">
          <h4 className="card-title text-success">User List</h4>
          {users.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.status}</td>
                      <td>
                        <button
                          className={`btn btn-sm ${user.status === 'active' ? 'btn-warning' : 'btn-success'} me-2`}
                          onClick={() => handleStatusToggle(user._id, user.status)}
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(user._id)}
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
            <p className="text-muted">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;