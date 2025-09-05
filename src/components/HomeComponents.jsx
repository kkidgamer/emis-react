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
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x / 10,
            top: mousePosition.y / 10,
            transform: 'translate(-50%, -50%)',
          }}
        ></div>
        <div 
          className="absolute w-72 h-72 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            right: mousePosition.x / 15,
            bottom: mousePosition.y / 15,
          }}
        ></div>
      </div>

      {/* Navigation */}
      <nav 
        className="fixed w-full z-50 py-4 px-6 transition-all duration-300"
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
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <i className="fas fa-home text-2xl text-white"></i>
              </div>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              EMIS
            </span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {['About', 'Services', 'How It Works', 'Testimonials'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`} 
                className="relative text-white/80 hover:text-white transition-all duration-300 group no-underline"
              >
                <span className="relative z-10">{item}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg scale-0 group-hover:scale-100 transition-all duration-300 -z-10"></div>
              </a>
            ))}
            <Link 
              to="/login" 
              className="relative text-white/80 hover:text-white transition-all duration-300 group no-underline"
            >
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg scale-0 group-hover:scale-100 transition-all duration-300 -z-10"></div>
            </Link>
          </div>
          
          {/* CTA Button and Hamburger */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/acc" 
              className="relative px-6 py-3 font-semibold text-white rounded-full overflow-hidden group hidden sm:block no-underline"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 opacity-100"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Sign In</span>
            </Link>
            
            <button 
              onClick={toggleMobileMenu} 
              className="relative p-2 text-white text-2xl group md:hidden"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg scale-0 group-hover:scale-100 transition-all duration-300"></div>
              <i className={`relative z-10 ${mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}`}></i>
            </button>
          </div>
        </div>
        
        {/* Enhanced Mobile Menu */}
        <div 
          className={`md:hidden fixed top-0 right-0 w-64 h-full transition-transform duration-300 ease-in-out transform ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } z-50`}
          style={{
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="p-6 space-y-4">
            {['About', 'Services', 'How It Works', 'Testimonials', 'Login'].map((item, index) => (
              <a
                key={item}
                href={item === 'Login' ? '/login' : `#${item.toLowerCase().replace(' ', '-')}`}
                className="block py-2 px-4 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-300 no-underline"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={toggleMobileMenu}
              >
                {item}
              </a>
            ))}
            <Link 
              to="/acc" 
              className="block mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-center font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 no-underline"
              onClick={toggleMobileMenu}
            >
              Sign In
            </Link>
          </div>
        </div>
        
        {/* Mobile Menu Overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`} 
          onClick={toggleMobileMenu}
        ></div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 md:pt-28">
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>
        
        <video 
          autoPlay 
          muted 
          loop 
          className="absolute w-full h-full object-cover z-0 opacity-30"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-modern-house-exterior-15800-large.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70 z-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 z-20 text-center">
          <div className="mb-8">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-6 leading-tight">
              <span className="inline-block bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                Connecting
              </span>
              <br />
              <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 bg-clip-text text-transparent">
                Households
              </span>
              <br />
              <span className="text-white">with</span>
              <br />
              <span className="inline-block bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Skilled Workers
              </span>
            </h1>
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-gray-300 leading-relaxed">
            Find reliable household help or rewarding job opportunities with 
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text font-semibold"> EMIS</span>
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <a 
              href="#services" 
              className="group relative px-8 py-4 font-bold text-white rounded-full overflow-hidden transform transition-all duration-300 hover:scale-105 no-underline"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 text-lg">Explore Services</span>
            </a>
            
            <Link 
              to="/acc" 
              className="group relative px-8 py-4 font-bold rounded-full overflow-hidden transform transition-all duration-300 hover:scale-105 no-underline"
            >
              <div className="absolute inset-0 border-2 border-white/30 group-hover:border-white/60 transition-colors duration-300"></div>
              <div className="absolute inset-0 bg-white/5 group-hover:bg-white/20 transition-colors duration-300"></div>
              <span className="relative z-10 text-lg text-white">Join Now</span>
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center cursor-pointer hover:border-white/60 transition-colors duration-300 group">
            <div className="animate-bounce">
              <i className="fas fa-chevron-down text-white text-xl group-hover:text-blue-400 transition-colors duration-300"></i>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black">
                  About <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">EMIS</span>
                </h2>
                <div className="w-24 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
              </div>
              
              <div className="space-y-4 text-base sm:text-lg text-gray-300 leading-relaxed">
                <p>
                  EMIS is your trusted platform for connecting households with skilled workers. Whether you're a client seeking professional household services like cleaning, gardening, or childcare, or a worker looking for meaningful employment, EMIS streamlines the process with a user-friendly interface and verified professionals.
                </p>
                <p>
                  Our mission is to empower households with reliable support and provide workers with fair job opportunities tailored to their skills.
                </p>
              </div>
              
              <Link 
                to="/acc" 
                className="inline-block group relative px-8 py-4 font-bold text-white rounded-full overflow-hidden transform transition-all duration-300 hover:scale-105 no-underline"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Get Started</span>
              </Link>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-3xl backdrop-blur-sm border border-white/10">
                  <img 
                    src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                    alt="EMIS Mission" 
                    className="w-full h-80 object-cover rounded-2xl"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                    <h3 className="text-xl font-bold text-white mb-2">Our Mission</h3>
                    <p className="text-gray-300">Empowering households and workers alike</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
              Our <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Services</span>
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-8"></div>
            <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              EMIS offers a wide range of household services to meet your needs, delivered by skilled professionals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'fas fa-broom', title: 'House Cleaning', desc: 'Professional cleaning services for a spotless home.', color: 'from-blue-500 to-cyan-500' },
              { icon: 'fas fa-leaf', title: 'Gardening', desc: 'Expert landscaping and garden maintenance.', color: 'from-green-500 to-emerald-500' },
              { icon: 'fas fa-baby', title: 'Childcare', desc: 'Trusted nannies for your family\'s needs.', color: 'from-pink-500 to-rose-500' },
              { icon: 'fas fa-user-check', title: 'Personal Assistance', desc: 'Support for daily tasks and errands.', color: 'from-purple-500 to-violet-500' }
            ].map((service, index) => (
              <div 
                key={service.title}
                className="group relative p-6 rounded-3xl transition-all duration-500 hover:scale-105"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-10 group-hover:opacity-20 rounded-3xl transition-opacity duration-300`}></div>
                <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 rounded-3xl backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-all duration-300"></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${service.icon} text-xl text-white`}></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{service.title}</h3>
                  <p className="text-gray-300 text-base leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/listings" 
              className="inline-block group relative px-8 py-4 font-bold text-white rounded-full overflow-hidden transform transition-all duration-300 hover:scale-105 no-underline"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 text-lg">Find Your Service!</span>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 px-6">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 text-white">
              How It <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Works</span>
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-8"></div>
            <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Simple steps to connect clients and workers seamlessly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="group relative p-8 rounded-3xl transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-colors duration-300"></div>
              <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-3xl transition-colors duration-300"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 text-white">For Clients</h3>
                <div className="space-y-4">
                  {[
                    'Register as a client on EMIS.',
                    'Browse verified workers and their profiles.',
                    'Book a service that fits your needs.',
                    'Enjoy reliable household support.'
                  ].map((step, index) => (
                    <div key={index} className="flex items-start group/step">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 group-hover/step:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <p className="text-gray-300 text-base leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="group relative p-8 rounded-3xl transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-colors duration-300"></div>
              <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-3xl transition-colors duration-300"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 text-white">For Workers</h3>
                <div className="space-y-4">
                  {[
                    'Sign up as a worker with your skills and experience.',
                    'Get verified through our secure process.',
                    'Connect with clients seeking your services.',
                    'Start working and build your reputation.'
                  ].map((step, index) => (
                    <div key={index} className="flex items-start group/step">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-3 group-hover/step:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <p className="text-gray-300 text-base leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
              What Our <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Users Say</span>
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-8"></div>
            <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Hear from people who have used our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah K.',
                role: 'Client',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
                text: 'EMIS made finding a reliable cleaner so easy! The platform is user-friendly, and the workers are professional.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                name: 'James M.',
                role: 'Worker',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
                text: 'As a worker, EMIS helped me find steady jobs that match my skills. I highly recommend it!',
                color: 'from-green-500 to-emerald-500'
              },
              {
                name: 'Mary J.',
                role: 'Client',
                image: 'https://images.unsplash.com/photo-1487412729-4226c2b03b97?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
                text: 'The childcare services I found through EMIS were exceptional. Trustworthy and reliable!',
                color: 'from-purple-500 to-pink-500'
              }
            ].map((testimonial, index) => (
              <div 
                key={testimonial.name}
                className="group relative p-6 rounded-3xl transition-all duration-500 hover:scale-105"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-10 group-hover:opacity-20 rounded-3xl transition-opacity duration-300`}></div>
                <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 rounded-3xl backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-all duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-gradient-to-r ${testimonial.color} p-0.5`}>
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white">{testimonial.name}</h4>
                      <p className={`text-transparent bg-gradient-to-r ${testimonial.color} bg-clip-text font-semibold`}>
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-base italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/acc" 
              className="inline-block group relative px-8 py-4 font-bold rounded-full overflow-hidden transform transition-all duration-300 hover:scale-105 no-underline"
            >
              <div className="absolute inset-0 bg-white"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 text-lg text-gray-900 group-hover:text-white transition-colors duration-300">
                Be Part of the Change
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
            Get in Touch with <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">EMIS</span>
          </h2>
          <div className="w-32 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-8"></div>
          <p className="text-lg sm:text-xl text-gray-300 mb-12 leading-relaxed">
            Have questions or ready to start? Contact us or join EMIS today!
          </p>
          
          <div className="relative group max-w-2xl mx-auto mb-12">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative bg-white/5 p-6 rounded-3xl backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-all duration-300">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 placeholder-gray-400"
                    placeholder="Enter your name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <input
                    type="email"
                    className="w-full p-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 placeholder-gray-400"
                    placeholder="Enter your email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <textarea
                    className="w-full p-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/50 transition-all duration-300 placeholder-gray-400 resize-none"
                    placeholder="Your message"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows="4"
                    required
                  ></textarea>
                </div>
                <button 
                  type="button" 
                  onClick={handleContactSubmit}
                  className="w-full group relative px-8 py-3 font-bold text-white rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 text-lg">Send Message</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              to="/register/worker" 
              className="group relative px-8 py-4 font-bold rounded-full overflow-hidden transform transition-all duration-300 hover:scale-105 no-underline"
            >
              <div className="absolute inset-0 bg-white"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 text-lg text-gray-900 group-hover:text-white transition-colors duration-300">
                Find Work
              </span>
            </Link>
            
            <Link 
              to="/register/user" 
              className="group relative px-8 py-4 font-bold rounded-full overflow-hidden transform transition-all duration-300 hover:scale-105 no-underline"
            >
              <div className="absolute inset-0 border-2 border-white/30 group-hover:border-white/60 transition-colors duration-300"></div>
              <div className="absolute inset-0 bg-white/5 group-hover:bg-white/20 transition-colors duration-300"></div>
              <span className="relative z-10 text-lg text-white">Book a Service</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 group cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-1.5 rounded-lg">
                    <i className="fas fa-home text-lg text-white"></i>
                  </div>
                </div>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                  EMIS
                </span>
              </div>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Connecting households with skilled workers for a seamless experience.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-white">Quick Links</h3>
              <div className="space-y-2">
                {['About', 'Services', 'How It Works', 'Testimonials'].map((link) => (
                  <a 
                    key={link}
                    href={`#${link.toLowerCase().replace(' ', '-')}`} 
                    className="block text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base no-underline"
                  >
                    {link}
                  </a>
                ))}
                <Link 
                  to="/login" 
                  className="block text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base no-underline"
                >
                  Login
                </Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-white">Services</h3>
              <div className="space-y-2">
                {['House Cleaning', 'Gardening', 'Childcare', 'Personal Assistance'].map((service) => (
                  <a 
                    key={service}
                    href="#services" 
                    className="block text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base no-underline"
                  >
                    {service}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-white">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-400 group">
                  <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2 group-hover:scale-105 transition-transform duration-300">
                    <i className="fas fa-map-marker-alt text-sm text-white"></i>
                  </div>
                  <span className="text-sm sm:text-base">Nairobi, Kenya</span>
                </div>
                <div className="flex items-center text-gray-400 group">
                  <div className="w-7 h-7 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-2 group-hover:scale-105 transition-transform duration-300">
                    <i className="fas fa-phone text-sm text-white"></i>
                  </div>
                  <span className="text-sm sm:text-base">+123-456-7890</span>
                </div>
                <div className="flex items-center text-gray-400 group">
                  <div className="w-7 h-7 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-2 group-hover:scale-105 transition-transform duration-300">
                    <i className="fas fa-envelope text-sm text-white"></i>
                  </div>
                  <span className="text-sm sm:text-base">support@emis.com</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-white font-semibold text-sm sm:text-base">Follow Us</h4>
                <div className="flex space-x-2 sm:space-x-3">
                  {[
                    { icon: 'fab fa-facebook-f', color: 'from-blue-600 to-blue-700', url: 'https://facebook.com' },
                    { icon: 'fab fa-twitter', color: 'from-sky-500 to-sky-600', url: 'https://twitter.com' },
                    { icon: 'fab fa-instagram', color: 'from-pink-500 to-rose-600', url: 'https://instagram.com' },
                    { icon: 'fab fa-linkedin-in', color: 'from-blue-600 to-indigo-700', url: 'https://linkedin.com' }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className="group relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 no-underline"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${social.color}`}></div>
                      <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-300"></div>
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <i className={`${social.icon} text-white text-sm sm:text-base`}></i>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-white/10 text-center">
            <p className="text-gray-500 text-sm sm:text-base">
              © {new Date().getFullYear()} EMIS. All Rights Reserved. Made with ❤️ for connecting communities.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          to="/acc"
          className="group relative w-14 h-14 rounded-full overflow-hidden transform transition-all duration-300 hover:scale-110 shadow-2xl no-underline"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-spin"></div>
          <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center">
            <i className="fas fa-plus text-white text-lg group-hover:rotate-90 transition-transform duration-300"></i>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;