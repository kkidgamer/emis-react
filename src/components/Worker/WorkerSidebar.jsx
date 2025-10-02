// Updated WorkerSidebar.jsx
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const WorkerSidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useContext(AuthContext);

  const navItems = [
    { path: '/worker/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/worker/bookings', icon: 'fas fa-calendar-check', label: 'Bookings' },
    { path: '/worker/services', icon: 'fas fa-list', label: 'Services' },
    { path: '/worker/messages', icon: 'fas fa-envelope', label: 'Messages' },
    { path: '/worker/reviews', icon: 'fas fa-star', label: 'Reviews' },
    { path: '/worker/subscription', icon: 'fas fa-credit-card', label: 'Subscription' },
  ];

  return (
    <>
      {/* Mobile Overlay: closes the sidebar when clicked */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-blue-900 to-purple-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64 w-80 h-full ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-3 border-b border-white/10 h-16 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <i className="fas fa-home text-xl text-blue-300"></i>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Worker Panel
            </span>
          </div>
          {/* This button is now only for closing the sidebar on mobile */}
          <button
            className="p-1 text-white hover:text-gray-300 transition-colors md:hidden"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `group relative flex items-center px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 no-underline ${
                      isActive ? 'bg-white/20 border border-blue-400' : ''
                    }`
                  }
                  onClick={() => setIsOpen(false)} // Close on mobile after navigation
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 rounded-lg transition-colors duration-300"></div>
                  <i className={`fas ${item.icon} text-lg text-blue-300 group-hover:text-white flex-shrink-0 mr-3`}></i>
                  <span className="text-white font-medium text-sm">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-2 flex-shrink-0">
          <button
            onClick={logout}
            className="group relative flex items-center w-full px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 no-underline"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-rose-500/0 group-hover:from-red-500/20 group-hover:to-rose-500/20 rounded-lg transition-colors duration-300"></div>
            <i className="fas fa-sign-out-alt text-lg text-red-300 group-hover:text-white flex-shrink-0 mr-3"></i>
            <span className="text-white font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default WorkerSidebar;