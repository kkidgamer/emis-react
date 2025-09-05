// Updated WorkerSidebar.jsx
import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const WorkerSidebar = () => {
  const { logout } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(true);

  const navItems = [
    { path: '/worker/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/worker/bookings', icon: 'fas fa-calendar-check', label: 'Bookings' },
    { path: '/worker/services', icon: 'fas fa-list', label: 'Services' },
    { path: '/worker/messages', icon: 'fas fa-envelope', label: 'Messages' },
    { path: '/worker/reviews', icon: 'fas fa-star', label: 'Reviews' },
    { path: '/worker/subscription', icon: 'fas fa-credit-card', label: 'Subscription' },
  ];

  return (
    <div
      className="bg-gradient-to-b from-blue-900 to-purple-900 text-white vh-100 d-flex flex-column shadow-2xl"
      style={{ width: expanded ? '250px' : '70px', transition: 'width 0.3s ease' }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-white/10">
        {expanded && <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Worker Panel</span>}
        <button
          className="btn p-0 text-white opacity-75 hover:opacity-100 transition-opacity"
          onClick={() => setExpanded(!expanded)}
        >
          <i className={`fas ${expanded ? 'fa-chevron-left' : 'fa-chevron-right'} text-xl`}></i>
        </button>
      </div>

      <ul className="nav flex-column mb-auto">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `group relative d-flex align-items-center px-4 py-3 transition-all duration-300 hover:bg-white/10 no-underline ${
                  isActive ? 'bg-white/20 border-l-4 border-blue-400' : ''
                }`
              }
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors duration-300"></div>
              <i className={`fas ${item.icon} text-xl text-blue-300 group-hover:text-white me-${expanded ? '3' : '0'} transition-colors duration-300`}></i>
              {expanded && <span className="text-white font-medium">{item.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      <hr className="border-white/10 mx-3" />

      <button
        onClick={logout}
        className="group relative d-flex align-items-center px-4 py-3 transition-all duration-300 hover:bg-white/10 no-underline"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-rose-500/0 group-hover:from-red-500/20 group-hover:to-rose-500/20 transition-colors duration-300"></div>
        <i className="fas fa-sign-out-alt text-xl text-red-300 group-hover:text-white me-3 transition-colors duration-300"></i>
        {expanded && <span className="text-white font-medium">Logout</span>}
      </button>
    </div>
  );
};

export default WorkerSidebar;