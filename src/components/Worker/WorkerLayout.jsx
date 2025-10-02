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
    <div className="flex min-h-screen bg-black">
      {/* Sidebar - Fixed on mobile, relative on desktop */}
      <WorkerSidebar />
      
      {/* Main Content */}
      <div className="flex-1 relative z-10 md:ml-0 overflow-y-auto">
        <AnimatedBackground className="min-h-screen py-4 sm:py-6 px-2 sm:px-4 md:px-6">
          <div className="relative z-20 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </AnimatedBackground>
      </div>
    </div>
  );
};

export default WorkerLayout;