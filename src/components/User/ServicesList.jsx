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
          toast.info('No services available at the moment.');
        }
        setServices(res.data);
        setFilteredServices(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch services.');
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
      toast.success(`${filtered.length} service(s) found`);
    } else {
      setFilteredServices(services);
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * servicesPerPage;
  const indexOfFirst = indexOfLast - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  if (loading) return <div className="text-center mt-5">Loading services...</div>;

  return (
    <div className="container my-4">
      <h2 className="text-success mb-4">Available Services</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search services..."
          className="form-control"
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Services Grid */}
      <div className="row">
        {currentServices.map((service) => (
          <div key={service._id} className="col-md-4 col-sm-6 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                src={service.image || 'https://via.placeholder.com/300x200'}
                className="card-img-top"
                alt={service.title}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{service.title}</h5>
                <p className="card-text text-muted">{service.description?.slice(0, 60)}...</p>
                <p className="fw-bold text-success">
                  {service.price ? `KES ${service.price}` : 'Price on request'}
                </p>
                <small className="text-muted">By {service.workerId?.name || 'Unknown Worker'}</small>
                <div className="mt-auto">
                  <Link
                    to={`/user-dashboard/services/details/${service._id}`}
                    className="btn btn-success w-100 mt-3"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
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

export default ServicesList;