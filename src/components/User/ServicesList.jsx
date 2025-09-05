// Updated ServicesList.jsx
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 6;
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('https://emis-sh54.onrender.com/api/service', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.data.length === 0) {
          toast.info('No services available at the moment.', {
            style: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '16px',
            },
          });
        }
        setServices(res.data);
        setFilteredServices(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch services.', {
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

    fetchServices();
  }, [token]);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    if (keyword) {
      const filtered = services.filter(
        (s) =>
          s.title.toLowerCase().includes(keyword) ||
          s.description?.toLowerCase().includes(keyword) ||
          s.workerId?.name?.toLowerCase().includes(keyword)
      );
      setFilteredServices(filtered);
      setCurrentPage(1);
      toast.success(`${filtered.length} service(s) found`, {
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '16px',
        },
      });
    } else {
      setFilteredServices(services);
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * servicesPerPage;
  const indexOfFirst = indexOfLast - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

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
        <i className="fas fa-list text-blue-400 mr-2"></i>
        Available Services
      </h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search services..."
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors duration-300"
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentServices.map((service) => (
          <div key={service._id} className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-colors duration-300"></div>
            <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-all duration-300"></div>
            <div className="relative z-10 p-4">
              <img
                src={service.image || 'https://unsplash.com/photos/a-person-using-one-of-tools-while-repairing-or-fixing-parts-of-pipes-e2twQyucgbI'}
                className="w-full h-48 object-cover rounded-2xl mb-4"
                alt={service.title}
              />
              <h5 className="text-xl font-bold text-white mb-2">{service.title}</h5>
              <p className="text-gray-300 text-sm mb-2">{service.description?.slice(0, 60)}...</p>
              <p className="text-green-400 font-bold mb-2">
                {service.price ? `KES ${service.price}` : 'Price on request'}
              </p>
              <small className="text-gray-400">By {service.workerId?.name || 'Unknown Worker'}</small>
              <Link
                to={`/user-dashboard/services/details/${service._id}`}
                className="group/btn relative block w-full px-4 py-2 mt-4 font-semibold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 no-underline"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">View Details</span>
              </Link>
            </div>
          </div>
        ))}
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

export default ServicesList;