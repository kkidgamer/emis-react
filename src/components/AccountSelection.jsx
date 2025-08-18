import React from 'react';

const AccountSelection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-6">
      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-10 justify-center">
        
        {/* Worker Account Card */}
        <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-10 flex-1 border border-gray-700 
                        shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 mb-6 bg-gray-700/70 rounded-full flex items-center justify-center 
                            border border-blue-400/30">
              <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4
                         a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14
                         a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10
                         a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Worker Account</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Manage tasks, view schedules, and track progress from your worker dashboard.
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold 
                               hover:bg-blue-500 transition-colors duration-300
                               shadow-md hover:shadow-blue-500/50">
              Select Worker
            </button>
          </div>
        </div>

        {/* User Account Card */}
        <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-10 flex-1 border border-gray-700 
                        shadow-lg hover:shadow-green-500/20 transition-all duration-300 hover:-translate-y-2">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 mb-6 bg-gray-700/70 rounded-full flex items-center justify-center 
                            border border-green-400/30">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M5.121 17.804A13.937 13.937 0 0112 16
                         c2.5 0 4.847.655 6.879 1.804M15 10
                         a3 3 0 11-6 0 3 3 0 016 0zm6 2
                         a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">User Account</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Explore services, manage your bookings, and view your history as a user.
            </p>
            <button className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold 
                               hover:bg-green-500 transition-colors duration-300
                               shadow-md hover:shadow-green-500/50">
              Select User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSelection;
