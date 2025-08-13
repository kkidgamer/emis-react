import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const WorkerSidebar = () => {
  const { logout } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(true);

  const navItems = [
    { path: '/worker/dashboard', icon: 'bi-house-door', label: 'Dashboard' },
    { path: '/worker/bookings', icon: 'bi-calendar-check', label: 'Bookings' },
    { path: '/worker/services', icon: 'bi-list-task', label: 'Services' },
    { path: '/worker/reviews', icon: 'bi-star', label: 'Reviews' },
    { path: '/worker/subscription', icon: 'bi-credit-card', label: 'Subscription' },
  ];

  return (
    <div
      className="bg-success text-white vh-100 d-flex flex-column"
      style={{ width: expanded ? '250px' : '70px', transition: 'width 0.3s ease' }}
      onMouseEnter={() => window.innerWidth < 768 && setExpanded(true)}
      onMouseLeave={() => window.innerWidth < 768 && setExpanded(false)}
    >
      <div className="d-flex align-items-center justify-content-between p-3">
        {expanded && <span className="fs-5">Worker Dashboard</span>}
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => setExpanded(!expanded)}
        >
          <i className={`bi ${expanded ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
        </button>
      </div>

      <ul className="nav nav-pills flex-column mb-auto">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-link text-white d-flex align-items-center ${isActive ? 'active' : ''}`
              }
            >
              <i className={`bi ${item.icon} me-${expanded ? '2' : '0'} fs-5`}></i>
              {expanded && <span>{item.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      <hr className="text-white" />

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

export default WorkerSidebar;