// Updated MyBookings.jsx
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
        toast.error(err.response?.data?.message || "Failed to load bookings", {
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
    fetchBookings();
  }, [token]);

  const handleCancel = async (id) => {
    if (window.confirm("Cancel this booking?")) {
      try {
        await axios.put(`https://emis-sh54.onrender.com/api/booking/${id}/cancel`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Booking cancelled", {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        });
        const updated = bookings.filter(b => b._id !== id);
        setBookings(updated);
        setFilteredBookings(updated);
      } catch (err) {
        toast.info(err.response?.data?.message || "Failed to cancel booking", {
          style: {
            background: 'linear-gradient(135deg, #ff6b6b 0%, #c0392b 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        });
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
      toast.success(`${filtered.length} booking(s) found`, {
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '16px',
        },
      });
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'from-yellow-500 to-amber-500';
      case 'completed':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-gray-600';
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

      {/* Header */}
      <h2 className="text-4xl sm:text-5xl font-black mb-8 text-white">
        <i className="fas fa-calendar-check text-blue-400 mr-2"></i>
        My Bookings
      </h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search bookings..."
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors duration-300"
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Bookings Table */}
      <div className="group relative p-6 rounded-3xl transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-colors duration-300"></div>
        <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-3xl transition-all duration-300"></div>
        <div className="relative z-10">
          {currentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-300">
                    <th className="p-3">Service</th>
                    <th className="p-3">Worker</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.map((b) => (
                    <tr
                      key={b._id}
                      className="border-t border-white/10 hover:bg-white/5 transition-colors duration-300"
                    >
                      <td className="p-3 text-gray-200">{b.serviceId?.title}</td>
                      <td className="p-3 text-gray-200">{b.workerId?.name}</td>
                      <td className="p-3 text-gray-200">{new Date(b.date).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-lg text-sm font-semibold bg-gradient-to-r ${getStatusColor(b.status)} text-white`}
                        >
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3">
                        {b.status === 'pending' && (
                          <button
                            className="group relative px-3 py-1 font-semibold text-white rounded-full overflow-hidden me-2 transition-all duration-300 hover:scale-105"
                            onClick={() => handleCancel(b._id)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative z-10"><i className="fas fa-times"></i> Cancel</span>
                          </button>
                        )}
                        <button
                          className="group relative px-3 py-1 font-semibold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
                          onClick={() => handleStartChat(b)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="relative z-10"><i className="fas fa-comment-dots"></i> Message</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-calendar-times text-5xl text-gray-400 mb-4"></i>
              <p className="text-gray-400 text-lg">No bookings found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex justify-center mt-8">
          <ul className="flex space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <li key={i}>
                <button
                  className={`group relative px-4 py-2 font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-110 ${
                    currentPage === i + 1 ? 'text-white' : 'text-gray-400'
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-50 group-hover:opacity-100"></div>
                  {currentPage === i + 1 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-100"></div>
                  )}
                  <span className="relative z-10">{i + 1}</span>
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