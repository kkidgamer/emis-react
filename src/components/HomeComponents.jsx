import React from "react"

import { Link } from "react-router-dom";


const Landing = () => {
  
  return (
    <div className="">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to EMIS</h1>
          <p className="text-lg md:text-xl mb-8">
            Your all-in-one solution for managing clients, workers, services, bookings, and secure M-Pesa payments.
          </p>
          <div className="space-x-4">
            <button
              
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
            >
              
            </button>
            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose EMIS?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">User-Client relations</h3>
              <p className="text-gray-600">
                Clients and workers can work together seamlessly, with each role having tailored access to features.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Seamless Bookings</h3>
              <p className="text-gray-600">
                Clients can book services effortlessly, while workers confirm bookings to keep operations smooth.
              </p>
            </div>
            
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-200 py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">About EMIS</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-center">
            The Enterprise Management Information System (EMIS) is designed to streamline service-based businesses. Whether you're  a worker managing your services, or a client booking appointments, EMIS provides a user-friendly platform to keep everything organized. Sign up today to experience efficient management and secure payments.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p className="mb-4">Contact us: support@emis.com | +254 123 456 789</p>
          <p>&copy; 2025 EMIS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;