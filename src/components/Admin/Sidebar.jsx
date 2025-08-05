import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: 'bi-house-door', label: 'Dashboard' },
    { path: '/admin/users', icon: 'bi-people', label: 'Manage Users' },
    { path: '/admin/workers', icon: 'bi-person-workspace', label: 'Manage Workers' },
    { path: '/admin/reports', icon: 'bi-bar-chart', label: 'Reports' },
    { path: '/admin/settings', icon: 'bi-gear', label: 'Settings' },
  ];

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-success text-white h-100" style={{ width: '250px' }}>
      <Link to="/dashboard" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4">EMIS Admin</span>
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
        <Link
          to="/logout"
          className="d-flex align-items-center text-white text-decoration-none"
        >
          <i className="bi bi-box-arrow-left me-2"></i>
          <strong>Logout</strong>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;