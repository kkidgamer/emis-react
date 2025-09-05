// Sidebar.jsx
import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(true);

  const navItems = [
    { path: '/admin-dashboard', icon: 'bi-house-door', label: 'Dashboard' },
    { path: '/admin-dashboard/users', icon: 'bi-people', label: 'Users' },
    { path: '/admin-dashboard/workers', icon: 'bi-person-workspace', label: 'Workers' },
    { path: '/admin-dashboard/reports', icon: 'bi-bar-chart', label: 'Reports' },
    { path: '/admin-dashboard/settings', icon: 'bi-gear', label: 'Settings' },
  ];

  return (
    <div
      className="d-flex flex-column bg-white border-end shadow-sm"
      style={{
        width: expanded ? '250px' : '70px',
        transition: 'width 0.3s ease',
        minHeight: '100vh',
      }}
    >
      {/* Top Section */}
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
        {expanded && <span className="fw-bold text-success">EMIS</span>}
        <button
          className="btn btn-light btn-sm"
          onClick={() => setExpanded(!expanded)}
        >
          <i className={`bi ${expanded ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
        </button>
      </div>

      {/* Navigation */}
      <ul className="nav nav-pills flex-column mb-auto mt-3">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`nav-link d-flex align-items-center px-3 ${
                location.pathname === item.path ? 'active bg-success text-white' : 'text-dark'
              }`}
            >
              <i className={`bi ${item.icon} me-2`}></i>
              {expanded && <span>{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto p-3 border-top">
        <button
          onClick={logout}
          className="btn btn-outline-danger w-100 d-flex align-items-center"
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          {expanded && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
