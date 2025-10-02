// Updated WorkerLayout.jsx
import React, { useState } from 'react';
import WorkerSidebar from './WorkerSidebar';
import AnimatedBackground from '../AnimatedBackground'; // Adjust path as needed
import { Outlet } from 'react-router-dom';

// Note: It's generally better practice to include global stylesheets
// like Font Awesome in your main `public/index.html` file.
const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.rel = 'stylesheet';
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
if (!document.querySelector('link[href*="font-awesome"]')) {
  document.head.appendChild(fontAwesomeLink);
}

const WorkerLayout = () => {
  // State for sidebar visibility is "lifted up" to the parent layout.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Pass state and setter down to the sidebar as props */}
      <WorkerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 relative z-10 overflow-hidden flex flex-col">
        {/* Mobile-only Header with Hamburger Menu */}
        <header className="md:hidden flex items-center justify-between bg-gray-900/50 backdrop-blur-sm p-3 text-white sticky top-0 z-30 shadow-lg">
            <div className="flex items-center space-x-2">
                <i className="fas fa-home text-xl text-blue-300"></i>
                <span className="text-lg font-bold">Worker Panel</span>
            </div>
            {/* This button opens the sidebar on mobile */}
            <button onClick={() => setIsSidebarOpen(true)} className="p-2" aria-label="Open menu">
                <i className="fas fa-bars text-xl"></i>
            </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <AnimatedBackground className="min-h-full py-4 sm:py-6 px-2 sm:px-4 md:px-6">
            <div className="relative z-20 max-w-7xl mx-auto w-full">
              <Outlet />
            </div>
          </AnimatedBackground>
        </div>
      </div>
    </div>
  );
};

export default WorkerLayout;