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
    { path: '/admin-dashboard/users', icon: 'bi-people', label: 'Manage Users' },
    { path: '/admin-dashboard/workers', icon: 'bi-person-workspace', label: 'Manage Workers' },
    { path: '/admin-dashboard/reports', icon: 'bi-bar-chart', label: 'Reports' },
    { path: '/admin-dashboard/settings', icon: 'bi-gear', label: 'Settings' },
  ];

  return (
    <div
      className={`bg-success text-white vh-100 d-flex flex-column`}
      style={{
        width: expanded ? '250px' : '70px',
        transition: 'width 0.3s ease',
      }}
      onMouseEnter={() => window.innerWidth < 768 && setExpanded(true)}
      onMouseLeave={() => window.innerWidth < 768 && setExpanded(false)}
    >
      {/* Logo / Toggle */}
      <div className="d-flex align-items-center justify-content-between p-3">
        {expanded && <span className="fs-5">EMIS</span>}
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => setExpanded(!expanded)}
        >
          <i className={`bi ${expanded ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
        </button>
      </div>

      {/* Navigation */}
      <ul className="nav nav-pills flex-column mb-auto">
        {navItems.map((item) => (
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
