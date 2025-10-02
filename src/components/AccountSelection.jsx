import { Link } from "react-router-dom";
import AnimatedBackground from "./AnimatedBackground";

// Account Selection Component
const AccountSelection = () => {
  return (
    <AnimatedBackground>
      <div className="relative z-20 flex items-center justify-center p-4 sm:p-6 min-h-screen">
        <div className="max-w-4xl sm:max-w-5xl w-full flex flex-col md:flex-row gap-6 sm:gap-10 justify-center">
          
          {/* Worker Account Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-10 flex-1 border border-white/10 
                          shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 group">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center 
                              border border-blue-400/30 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4
                           a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14
                           a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10
                           a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">Worker Account</h2>
              <p className="text-sm sm:text-base text-gray-200 mb-4 sm:mb-6 leading-relaxed px-2">
                Manage tasks, view schedules, and track progress from your worker dashboard.
              </p>
              <Link 
                to="/register/worker" 
                className="group relative px-4 sm:px-6 py-3 font-semibold text-white rounded-full overflow-hidden 
                           transform transition-all duration-300 hover:scale-105 block w-full sm:w-auto no-underline"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 text-sm sm:text-base">Select Worker</span>
              </Link>
            </div>
          </div>

          {/* User Account Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-10 flex-1 border border-white/10 
                          shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:-translate-y-2 group">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center 
                              border border-green-400/30 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M5.121 17.804A13.937 13.937 0 0112 16
                           c2.5 0 4.847.655 6.879 1.804M15 10
                           a3 3 0 11-6 0 3 3 0 016 0zm6 2
                           a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">User Account</h2>
              <p className="text-sm sm:text-base text-gray-200 mb-4 sm:mb-6 leading-relaxed px-2">
                Explore services, manage your bookings, and view your history as a user.
              </p>
              <Link 
                to="/register/user" 
                className="group relative px-4 sm:px-6 py-3 font-semibold text-white rounded-full overflow-hidden 
                           transform transition-all duration-300 hover:scale-105 block w-full sm:w-auto no-underline"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 text-sm sm:text-base">Select User</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};
export default AccountSelection;