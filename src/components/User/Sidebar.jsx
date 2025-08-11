import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(true);

  const navItems = [
    { path: '/user-dashboard', icon: 'bi-house-door', label: 'Dashboard' },
    { path: '/user-dashboard/services', icon: 'bi-list-task', label: 'Services' },
    { path: '/user-dashboard/bookings', icon: 'bi-calendar-check', label: 'My Bookings' },
    { path: '/user-dashboard/settings', icon: 'bi-gear', label: 'Settings' },
  ];

  return (
    <div
      className="bg-success text-white vh-100 d-flex flex-column"
      style={{ width: expanded ? '250px' : '70px', transition: 'width 0.3s' }}
    >
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between p-3">
        {expanded && <span className="fs-5">User Panel</span>}
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => setExpanded(!expanded)}
        >
          <i className={`bi ${expanded ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
        </button>
      </div>

      {/* Navigation */}
      <ul className="nav nav-pills flex-column mb-auto">
        {navItems.map(item => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`nav-link text-white d-flex align-items-center ${location.pathname === item.path ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon} me-${expanded ? '2' : '0'} fs-5`}></i>
              {expanded && <span>{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>

      <hr className="text-white" />

      {/* Logout */}
      <button
        onClick={logout}
        className="btn btn-link text-white d-flex align-items-center"
      >
        <i className="bi bi-box-arrow-left fs-5"></i>
        {expanded && <span className="ms-2">Logout</span>}
      </button>
    </div>
  );
};

export default Sidebar;
