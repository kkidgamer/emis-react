import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
// import './system-ui.css';

// Add Font Awesome CSS
const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.rel = 'stylesheet';
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
if (!document.querySelector('link[href*="font-awesome"]')) {
  document.head.appendChild(fontAwesomeLink);
}

const NotFoundComponent = () => {
  const navigate = () => console.log('Navigate back');

  return (
    <AnimatedBackground>
      <div className="relative z-20 flex flex-col items-center justify-center px-4 sm:px-6 text-center min-h-screen">
        <div className="relative bg-white/10 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-white/20 shadow-2xl max-w-lg w-full">
          {/* 404 Number with glow effect */}
          <div className="relative mb-6 sm:mb-8">
            <div className="absolute inset-0 text-4xl sm:text-6xl sm:text-8xl font-black text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text blur-sm opacity-50"></div>
            <h1 className="relative text-4xl sm:text-6xl sm:text-8xl font-black text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text">
              404
            </h1>
          </div>
          
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Page Not Found</h2>
            <p className="text-sm sm:text-lg text-gray-200 leading-relaxed px-2">
              The page you're looking for seems to have wandered off into the digital void.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={navigate}
              className="group relative px-4 sm:px-6 py-3 font-bold text-white rounded-full overflow-hidden 
                        transform transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 h-12 w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <i className="fas fa-arrow-left relative z-10 text-sm sm:text-base"></i>
              <span className="relative z-10 text-sm sm:text-base">Go Back</span>
            </button>
            
            <Link
              to="/"
              className="group relative px-4 sm:px-6 py-3 font-bold text-white rounded-full overflow-hidden 
                        transform transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 h-12 w-full sm:w-auto no-underline"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <i className="fas fa-home relative z-10 text-sm sm:text-base"></i>
              <span className="relative z-10 text-sm sm:text-base">Home</span>
            </Link>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default NotFoundComponent;