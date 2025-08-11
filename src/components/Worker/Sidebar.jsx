import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from '../context/AuthContext';

const WorkerSidebar = () => {
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);

  const navItems = [
    { path: '/worker-dashboard', icon: 'bi-house-door', label: 'Dashboard' },
    { path: '/worker-dashboard/bookings', icon: 'bi-calendar-check', label: 'Bookings' },
    { path: '/worker-dashboard/reviews', icon: 'bi-star', label: 'Reviews' },
    { path: '/worker-dashboard/services', icon: 'bi-briefcase', label: 'Manage Services' }, // New link
    { path: '/worker-dashboard/settings', icon: 'bi-gear', label: 'Settings' },
  ];

  if (!user || user.role !== 'worker') {
    return null;
  }

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-success text-white vh-100" style={{ width: '250px' }}>
      <Link to="/worker-dashboard" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4">EMIS Worker</span>
      </Link>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        {navItems.map((item) => (
          <li className="nav-item" key={item.path}>
            <Link
              to={item.path}
              className={`nav-link text-white ${location.pathname === item.path ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon} me-2`}></i>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <hr />
      <div className="dropdown">
        <button
          onClick={logout}
          className="d-flex align-items-center text-white text-decoration-none border-0 bg-transparent"
        >
          <i className="bi bi-box-arrow-left me-2"></i>
          <strong>Logout</strong>
        </button>
      </div>
    </div>
  );
};

export default WorkerSidebar;