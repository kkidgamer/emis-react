import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('https://emis-sh54.onrender.com/api/booking', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
        setFilteredBookings(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  const handleCancel = async (id) => {
    if (window.confirm("Cancel this booking?")) {
      try {
        await axios.put(`https://emis-sh54.onrender.com/api/booking/${id}/cancel`,{}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Booking cancelled");
        const updated = bookings.filter(b => b._id !== id);
        setBookings(updated);
        setFilteredBookings(updated);
      } catch (err) {
        toast.info(err.response?.data?.message || "Failed to cancel booking");
      }
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    if (keyword) {
      const filtered = bookings.filter(b =>
        b.serviceId?.title?.toLowerCase().includes(keyword) ||
        b.workerId?.name?.toLowerCase().includes(keyword) ||
        b.status?.toLowerCase().includes(keyword)
      );
      setFilteredBookings(filtered);
      setCurrentPage(1);
      toast.success(`${filtered.length} booking(s) found`);
    } else {
      setFilteredBookings(bookings);
    }
  };

  const handleStartChat = async (booking) => {
    try {
      // Optional: create a first message if none exists yet
      await axios.post(
        `https://emis-sh54.onrender.com/api/message`,
        {
          receiverId: booking.workerId._id, // chat with the worker
          bookingId: booking._id,
          content: "Hello, I'd like to discuss this booking"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      // ignore if conversation already exists
      console.log("Chat may already exist:", err.response?.data?.message);
    }

    // Navigate to Messages page with booking pre-selected
    navigate('/user-dashboard/messages', { state: { booking } });
  };

  // Pagination
  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  if (loading) return <div className="text-center mt-5">Loading bookings...</div>;

  return (
    <div className="container mt-4">
      <h3 className="text-success mb-4">My Bookings</h3>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search bookings..."
          className="form-control"
          value={search}
          onChange={handleSearch}
        />
      </div>

      {currentBookings.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Service</th>
                <th>Worker</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map(b => (
                <tr key={b._id}>
                  <td>{b.serviceId?.title}</td>
                  <td>{b.workerId?.name}</td>
                  <td>{new Date(b.date).toLocaleDateString()}</td>
                  <td>{b.status}</td>
                  <td>
                    {b.status === 'pending' && (
                      <button
                        className="btn btn-sm btn-danger me-2"
                        onClick={() => handleCancel(b._id)}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleStartChat(b)}
                    >
                      Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted">No bookings found.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default MyBookings;
