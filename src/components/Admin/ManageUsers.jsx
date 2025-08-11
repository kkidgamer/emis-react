import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { confirmToast } from '../../utils/confirmToast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    toast.info('Loading users...');
    axios.get('https://emis-sh54.onrender.com/api/user', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUsers(res.data);
        toast.dismiss();
      })
      .catch(err => toast.error(err.response?.data?.message || 'Failed to fetch users.'));
  }, [token]);

  const handleStatusToggle = (id, status) => {
    confirmToast(
      `Are you sure you want to ${status === 'active' ? 'deactivate' : 'activate'} this user?`,
      async () => {
        try {
          const newStatus = status === 'active' ? 'inactive' : 'active';
          await axios.put(
            `https://emis-sh54.onrender.com/api/user/${id}`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUsers(u => u.map(user =>
            user._id === id ? { ...user, status: newStatus } : user
          ));
          toast.success(`User ${newStatus} successfully.`);
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to update status.');
        }
      }
    );
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete User?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`https://emis-sh54.onrender.com/api/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(u => u.filter(user => user._id !== id));
      toast.success('User deleted.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  return (
    <div>
      <h1 className="text-success mb-4">Manage Users</h1>
      <div className="card shadow">
        <div className="card-body">
          {users.length ? (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.status}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${u.status === 'active' ? 'btn-warning' : 'btn-success'} me-2`}
                        onClick={() => handleStatusToggle(u._id, u.status)}
                      >
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(u._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-muted">No users found.</p>}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
