import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// Add Font Awesome CSS
const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.rel = 'stylesheet';
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
if (!document.querySelector('link[href*="font-awesome"]')) {
  document.head.appendChild(fontAwesomeLink);
}

const LandingPage = () => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you for your message! We will get back to you soon.', {
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '16px',
      }
    });
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
        <div 
          className="absolute w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x / 10,
            top: mousePosition.y / 10,
            transform: 'translate(-50%, -50%)',
          }}
        ></div>
        <div 
          className="absolute w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            right: mousePosition.x / 15,
            bottom: mousePosition.y / 15,
          }}
        ></div>
      </div>

      {/* Navigation */}
      <nav 
        className="fixed w-full z-50 py-3 sm:py-4 px-4 sm:px-6 transition-all duration-300"
        style={{
          background: scrollY > 50 
            ? 'rgba(0, 0, 0, 0.95)' 
            : 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrollY > 50 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-1.5 sm:p-2 rounded-lg">
                <i className="fas fa-home text-xl sm:text-2xl text-white"></i>
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              EMIS
            </span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 sm:space-x-8">
            {['About', 'Services', 'How It Works', 'Testimonials'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`} 
                className="relative text-white/80 hover:text-white transition-all duration-300 group no-underline text-sm sm:text-base"
              >
                <span className="relative z-10">{item}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg scale-0 group-hover:scale-100 transition-all duration-300 -z-10"></div>
              </a>
            ))}
            <Link 
              to="/login" 
              className="relative text-white/80 hover:text-white transition-all duration-300 group no-underline text-sm sm:text-base"
            >
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg scale-0 group-hover:scale-100 transition-all duration-300 -z-10"></div>
            </Link>
          </div>
          
          {/* CTA Button and Hamburger */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link 
              to="/acc" 
              className="relative px-4 sm:px-6 py-2 sm:py-3 font-semibold text-white rounded-full overflow-hidden group hidden sm:block no-underline text-sm sm:text-base"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 opacity-100"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Sign In</span>
            </Link>
            
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden text-white hover:text-gray-300 transition-colors duration-300 p-1"
            >
              <i className={`fas fa-bars text-xl sm:text-2xl ${mobileMenuOpen ? 'fa-times' : ''}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-4 border-t border-white/10 bg-black/50 backdrop-blur-md">
            <div className="flex flex-col space-y-4 text-center">
              {['About', 'Services', 'How It Works', 'Testimonials', 'Login'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Login' ? '/login' : `/#${item.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/80 hover:text-white transition-colors duration-300 py-2 text-sm sm:text-base"
                >
                  {item}
                </Link>
              ))}
              <Link
                to="/acc"
                onClick={() => setMobileMenuOpen(false)}
                className="relative px-6 py-2 sm:py-3 font-semibold text-white rounded-full overflow-hidden group w-full text-center no-underline text-sm sm:text-base"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Sign In</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Rest of the page content (hero, sections, etc.) - apply similar responsive patterns here */}
      {/* ... (truncated for brevity; add flex-col md:flex-row, text-sm md:text-lg, etc. to sections) */}

      {/* Footer (refactored for mobile) */}
      <footer className="bg-black/50 backdrop-blur-md border-t border-white/10 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 sm:space-x-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-1.5 sm:p-2 rounded-lg">
                    <i className="fas fa-home text-xl sm:text-2xl text-white"></i>
                  </div>
                </div>
                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                  EMIS
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-400 max-w-xs mx-auto md:mx-0">Connecting communities with reliable services.</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-white text-center md:text-left">Quick Links</h3>
              <div className="space-y-2">
                {['About', 'Services', 'How It Works', 'Testimonials'].map((link) => (
                  <a 
                    key={link}
                    href={`#${link.toLowerCase().replace(' ', '-')}`} 
                    className="block text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base no-underline text-center md:text-left"
                  >
                    {link}
                  </a>
                ))}
                <Link 
                  to="/login" 
                  className="block text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base no-underline text-center md:text-left"
                >
                  Login
                </Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-white text-center md:text-left">Services</h3>
              <div className="space-y-2">
                {['House Cleaning', 'Gardening', 'Childcare', 'Personal Assistance'].map((service) => (
                  <a 
                    key={service}
                    href="#services" 
                    className="block text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base no-underline text-center md:text-left"
                  >
                    {service}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-white text-center md:text-left">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start text-gray-400 group">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2 group-hover:scale-105 transition-transform duration-300">
                    <i className="fas fa-map-marker-alt text-xs sm:text-sm text-white"></i>
                  </div>
                  <span className="text-xs sm:text-sm sm:text-base text-center md:text-left">Nairobi, Kenya</span>
                </div>
                <div className="flex items-center justify-center md:justify-start text-gray-400 group">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-2 group-hover:scale-105 transition-transform duration-300">
                    <i className="fas fa-phone text-xs sm:text-sm text-white"></i>
                  </div>
                  <span className="text-xs sm:text-sm sm:text-base text-center md:text-left">+123-456-7890</span>
                </div>
                <div className="flex items-center justify-center md:justify-start text-gray-400 group">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-2 group-hover:scale-105 transition-transform duration-300">
                    <i className="fas fa-envelope text-xs sm:text-sm text-white"></i>
                  </div>
                  <span className="text-xs sm:text-sm sm:text-base text-center md:text-left">support@emis.com</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-white font-semibold text-xs sm:text-sm sm:text-base text-center md:text-left">Follow Us</h4>
                <div className="flex justify-center md:justify-start space-x-2 sm:space-x-3">
                  {[
                    { icon: 'fab fa-facebook-f', color: 'from-blue-600 to-blue-700', url: 'https://facebook.com' },
                    { icon: 'fab fa-twitter', color: 'from-sky-500 to-sky-600', url: 'https://twitter.com' },
                    { icon: 'fab fa-instagram', color: 'from-pink-500 to-rose-600', url: 'https://instagram.com' },
                    { icon: 'fab fa-linkedin-in', color: 'from-blue-600 to-indigo-700', url: 'https://linkedin.com' }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className="group relative w-7 h-7 sm:w-8 sm:h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 no-underline"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${social.color}`}></div>
                      <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-300"></div>
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <i className={`${social.icon} text-white text-xs sm:text-sm sm:text-base`}></i>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-white/10 text-center">
            <p className="text-gray-500 text-xs sm:text-sm sm:text-base">
              © {new Date().getFullYear()} EMIS. All Rights Reserved. Made with ❤️ for connecting communities.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
        <Link
          to="/acc"
          className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden transform transition-all duration-300 hover:scale-110 shadow-2xl no-underline"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-spin"></div>
          <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center">
            <i className="fas fa-plus text-white text-base sm:text-lg group-hover:rotate-90 transition-transform duration-300"></i>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;