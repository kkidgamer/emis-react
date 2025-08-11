import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { confirmToast } from '../../utils/confirmToast';


const ManageWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    toast.info('Loading workers...');
    axios.get('https://emis-sh54.onrender.com/api/worker', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setWorkers(res.data);
        toast.dismiss();
      })
      .catch(err => toast.error(err.response?.data?.message || 'Failed to fetch workers.'));
  }, [token]);

  const handleStatusToggle = (id, status) => {
    confirmToast(
      `Are you sure you want to ${status === 'active' ? 'deactivate' : 'activate'} this worker?`,
      async () => {
        try {
          const newStatus = status === 'active' ? 'inactive' : 'active';
          await axios.put(
            `https://emis-sh54.onrender.com/api/worker/${id}`,
            { subscriptionStatus: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setWorkers(w => w.map(worker =>
            worker._id === id ? { ...worker, subscriptionStatus: newStatus } : worker
          ));
          toast.success(`Worker ${newStatus} successfully.`);
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to update status.');
        }
      }
    );
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Worker?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`https://emis-sh54.onrender.com/api/worker/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkers(w => w.filter(worker => worker._id !== id));
      toast.success('Worker deleted.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete worker.');
    }
  };

  return (
    <div>
      <h1 className="text-success mb-4">Manage Workers</h1>
      <div className="card shadow">
        <div className="card-body">
          {workers.length ? (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Skills</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workers.map(w => (
                  <tr key={w._id}>
                    <td>{w.name}</td>
                    <td>{w.email}</td>
                    <td>{w.skills?.join(', ') || 'N/A'}</td>
                    <td>{w.subscriptionStatus}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${w.subscriptionStatus === 'active' ? 'btn-warning' : 'btn-success'} me-2`}
                        onClick={() => handleStatusToggle(w._id, w.subscriptionStatus)}
                      >
                        {w.subscriptionStatus === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(w._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-muted">No workers found.</p>}
        </div>
      </div>
    </div>
  );
};

export default ManageWorkers;
