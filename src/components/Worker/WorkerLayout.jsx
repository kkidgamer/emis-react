import React from 'react';
import WorkerSidebar from './WorkerSidebar';
import AnimatedBackground from '../AnimatedBackground'; // Adjust path as needed
import { Outlet } from 'react-router-dom';

// Add Font Awesome CSS if not already loaded globally
const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.rel = 'stylesheet';
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
if (!document.querySelector('link[href*="font-awesome"]')) {
  document.head.appendChild(fontAwesomeLink);
}

const WorkerLayout = () => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar with higher z-index */}
      <div className="position-relative" style={{ zIndex: 30, maxHeight: '100vh', overflowY: 'hidden' }}>
        <WorkerSidebar />
      </div>
      {/* Content Area */}
      <div className="flex-grow-1 position-relative" style={{ zIndex: 10, overflowY: 'auto' }}>
        <AnimatedBackground className="py-12 px-6" style={{ pointerEvents: 'none' }}>
          <div className="relative z-20 max-w-7xl mx-auto" style={{ pointerEvents: 'auto' }}>
            <Outlet />
          </div>
        </AnimatedBackground>
      </div>
    </div>
  );
};

export default WorkerLayout;