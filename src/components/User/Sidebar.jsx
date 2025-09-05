// Updated Sidebar.jsx
import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(true);

  const navItems = [
    { path: '/user-dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/user-dashboard/services', icon: 'fas fa-list', label: 'Services' },
    { path: '/user-dashboard/messages', icon: 'fas fa-envelope', label: 'Messages' },
    { path: '/user-dashboard/bookings', icon: 'fas fa-calendar-check', label: 'My Bookings' },
    { path: '/user-dashboard/settings', icon: 'fas fa-cog', label: 'Settings' },
  ];

  const toggleSidebar = () => setExpanded(!expanded);

  return (
    <div
      className="bg-gradient-to-b from-blue-900 to-purple-900 text-white d-flex flex-column position-sticky top-0"
      style={{ width: expanded ? '250px' : '70px', transition: 'width 0.3s ease', minHeight: '100vh', zIndex: 30 }}
    >
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-white/10">
        {expanded && (
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            User Panel
          </span>
        )}
        <button
          className="btn p-0 text-white opacity-75 hover:opacity-100 transition-opacity"
          onClick={toggleSidebar}
        >
          <i className={`fas ${expanded ? 'fa-chevron-left' : 'fa-chevron-right'} text-xl`}></i>
        </button>
      </div>

      <ul className="nav flex-column mb-auto">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`group relative d-flex align-items-center px-4 py-3 transition-all duration-300 hover:bg-white/10 no-underline ${
                location.pathname === item.path ? 'bg-white/20 border-l-4 border-blue-400' : ''
              }`}
              style={{ pointerEvents: 'auto' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors duration-300"></div>
              <i className={`fas ${item.icon} text-xl text-blue-300 group-hover:text-white me-${expanded ? '3' : '0'} transition-colors duration-300`}></i>
              {expanded && <span className="text-white font-medium">{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>

      <hr className="border-white/10 mx-3" />

      <button
        onClick={logout}
        className="group relative d-flex align-items-center px-4 py-3 transition-all duration-300 hover:bg-white/10 no-underline"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-rose-500/0 group-hover:from-red-500/20 group-hover:to-rose-500/20 transition-colors duration-300"></div>
        <i className="fas fa-sign-out-alt text-xl text-red-300 group-hover:text-white me-3 transition-colors duration-300"></i>
        {expanded && <span className="text-white font-medium">Logout</span>}
      </button>
    </div>
  );
};

export default Sidebar;