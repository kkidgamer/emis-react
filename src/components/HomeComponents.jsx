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

      {/* Hero Section */}
      <section className="relative z-10 pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-6 sm:mb-8 leading-tight">
            Connecting Communities
            <br />
            <span className="text-3xl sm:text-4xl md:text-5xl">with Reliable Services</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            EMIS is your trusted platform for seamless service bookings. From house cleaning to personal assistance, find skilled professionals effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/acc"
              className="group relative px-8 py-4 font-bold text-white rounded-full overflow-hidden transform transition-all duration-300 hover:scale-105 w-full sm:w-auto text-center no-underline"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 text-lg">Get Started</span>
            </Link>
            <Link
              to="/services"
              className="group relative px-8 py-4 font-bold text-white rounded-full overflow-hidden transform transition-all duration-300 hover:scale-105 w-full sm:w-auto text-center border-2 border-white/20 no-underline"
            >
              <span className="relative z-10 text-lg">Explore Services</span>
            </Link>
          </div>
        </div>
        {/* Hero Illustration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-4">
              About EMIS
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              We bridge the gap between everyday needs and skilled professionals, making service discovery simple, secure, and efficient.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center border border-blue-400/30 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <i className="fas fa-users text-white text-xl sm:text-2xl"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Skilled Network</h3>
              <p className="text-gray-200">Access a verified community of experts in various fields.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center border border-green-400/30 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <i className="fas fa-shield-alt text-white text-xl sm:text-2xl"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Secure & Trusted</h3>
              <p className="text-gray-200">End-to-end encryption and verified profiles for peace of mind.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center border border-purple-400/30 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <i className="fas fa-rocket text-white text-xl sm:text-2xl"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Fast & Easy</h3>
              <p className="text-gray-200">Book services in minutes with our intuitive platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Discover top-tier services tailored to your needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: 'fas fa-broom', title: 'House Cleaning', desc: 'Professional deep cleaning for a spotless home.' },
              { icon: 'fas fa-seedling', title: 'Gardening', desc: 'Expert landscaping and maintenance services.' },
              { icon: 'fas fa-child', title: 'Childcare', desc: 'Reliable, caring babysitters for your family.' },
              { icon: 'fas fa-user-tie', title: 'Personal Assistance', desc: 'Dedicated help for daily tasks and errands.' }
            ].map((service, index) => (
              <div key={index} className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-2">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className={`${service.icon} text-white text-lg sm:text-xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-gray-200 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Simple steps to get you started in no time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Sign Up', desc: 'Create your account and choose your role.', icon: 'fas fa-user-plus' },
              { step: '2', title: 'Browse Services', desc: 'Explore available professionals and book easily.', icon: 'fas fa-search' },
              { step: '3', title: 'Get Matched', desc: 'Connect, schedule, and enjoy seamless service.', icon: 'fas fa-check-circle' }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center border-4 border-white/20 group-hover:border-blue-400/50 transition-all duration-300 shadow-2xl">
                  <span className="text-2xl font-bold text-white absolute">{item.step}</span>
                  <i className={`${item.icon} text-white text-xl sm:text-2xl relative z-10`}></i>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-200 leading-relaxed max-w-md mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Hear from those who've experienced the EMIS difference.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { quote: 'EMIS made finding a reliable cleaner effortless. Highly recommend!', name: 'Sarah M.', role: 'Client' },
              { quote: 'As a worker, the platform connects me with great opportunities daily.', name: 'John D.', role: 'Professional' },
              { quote: 'Secure, fast, and user-friendly. Perfect for busy admins like me.', name: 'Admin Team', role: 'Admin' }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl">
                <p className="text-gray-200 italic mb-4 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-user text-white text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Have questions? We'd love to hear from you.
            </p>
          </div>
          <form onSubmit={handleContactSubmit} className="max-w-lg mx-auto space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 placeholder-gray-300 text-white"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 placeholder-gray-300 text-white"
              required
            />
            <textarea
              rows={4}
              placeholder="Your Message"
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 placeholder-gray-300 text-white resize-none"
              required
            />
            <button
              type="submit"
              className="w-full group relative py-3 font-bold text-white rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Send Message</span>
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
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