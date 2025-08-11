import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { toast } from 'react-toastify';

const LandingPage = () => {
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactMessage, setContactMessage] = useState('');

    const handleContactSubmit = (e) => {
        e.preventDefault();
        toast.success('Thank you for your message! We will get back to you soon.');
        setContactName('');
        setContactEmail('');
        setContactMessage('');
    };

    return (
        <div className="homepage">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-success">
                <div className="container">
                    <Link className="navbar-brand" to="/">EMIS</Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a href="#about" className="nav-link">About</a>
                            </li>
                            <li className="nav-item">
                                <a href="#services" className="nav-link">Services</a>
                            </li>
                            <li className="nav-item">
                                <a href="#how-it-works" className="nav-link">How It Works</a>
                            </li>
                            <li className="nav-item">
                                <a href="#testimonials" className="nav-link">Testimonials</a>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero position-relative text-white">
                <img
                    src="images/banner2.jpeg"
                    alt="banner"
                    className="w-100 img-fluid"
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
                <div className="hero-content position-absolute top-50 start-50 translate-middle text-center bg-dark p-5 rounded bg-opacity-75">
                    <h1>Connecting Households with Skilled Workers</h1>
                    <p className="lead">Find reliable household help or rewarding job opportunities with EMIS.</p>
                    <div className="d-flex justify-content-center gap-3">
                        <a href="#services" className="btn btn-success">Explore Services</a>
                        <Link to="/login" className="btn btn-outline-light">Login Now</Link>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-5">
                <div className="container">
                    <h2 className="text-center mb-4 text-success">About EMIS</h2>
                    <p className="text-center">
                        EMIS is your trusted platform for connecting households with skilled workers. Whether you're a client seeking professional household services like cleaning, gardening, or childcare, or a worker looking for meaningful employment, EMIS streamlines the process with a user-friendly interface and verified professionals.
                    </p>
                    <p className="text-center">
                        Our mission is to empower households with reliable support and provide workers with fair job opportunities tailored to their skills.
                    </p>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="bg-light py-5">
                <div className="container">
                    <h2 className="text-center mb-4 text-success">Our Services</h2>
                    <p className="text-center mb-5">
                        EMIS offers a wide range of household services to meet your needs, delivered by skilled professionals.
                    </p>
                    <div className="row">
                        <div className="col-md-3 mb-4">
                            <div className="card h-100 text-center">
                                <img src="images/cleaning-icon.png" alt="Cleaning" className="card-img-top mx-auto mt-3" style={{ width: '50px' }} />
                                <div className="card-body">
                                    <h4 className="card-title">House Cleaning</h4>
                                    <p className="card-text">Professional cleaning services for a spotless home.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-4">
                            <div className="card h-100 text-center">
                                <img src="images/gardening-icon.png" alt="Gardening" className="card-img-top mx-auto mt-3" style={{ width: '50px' }} />
                                <div className="card-body">
                                    <h4 className="card-title">Gardening</h4>
                                    <p className="card-text">Expert landscaping and garden maintenance.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-4">
                            <div className="card h-100 text-center">
                                <img src="images/childcare-icon.png" alt="Childcare" className="card-img-top mx-auto mt-3" style={{ width: '50px' }} />
                                <div className="card-body">
                                    <h4 className="card-title">Childcare</h4>
                                    <p className="card-text">Trusted nannies for your family's needs.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-4">
                            <div className="card h-100 text-center">
                                <img src="images/assistance-icon.png" alt="Assistance" className="card-img-top mx-auto mt-3" style={{ width: '50px' }} />
                                <div className="card-body">
                                    <h4 className="card-title">Personal Assistance</h4>
                                    <p className="card-text">Support for daily tasks and errands.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-5">
                <div className="container">
                    <h2 className="text-center mb-4 text-success">How It Works</h2>
                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <h4>For Clients</h4>
                            <ol className="list-group list-group-numbered">
                                <li className="list-group-item">Register as a client on EMIS.</li>
                                <li className="list-group-item">Browse verified workers and their profiles.</li>
                                <li className="list-group-item">Book a service that fits your needs.</li>
                                <li className="list-group-item">Enjoy reliable household support.</li>
                            </ol>
                        </div>
                        <div className="col-md-6 mb-4">
                            <h4>For Workers</h4>
                            <ol className="list-group list-group-numbered">
                                <li className="list-group-item">Sign up as a worker with your skills and experience.</li>
                                <li className="list-group-item">Get verified through our secure process.</li>
                                <li className="list-group-item">Connect with clients seeking your services.</li>
                                <li className="list-group-item">Start working and build your reputation.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Workers Section */}
            <section id="featured-workers" className="bg-light py-5">
                <div className="container">
                    <h2 className="text-center mb-4 text-success">Meet Our Workers</h2>
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className="card h-100 text-center">
                                <img src="images/worker1.jpg" alt="Worker 1" className="card-img-top rounded-circle mx-auto mt-3" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                <div className="card-body">
                                    <h4 className="card-title">Jane Doe</h4>
                                    <p className="card-text">Professional Cleaner with 5 years of experience.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card h-100 text-center">
                                <img src="images/worker2.jpg" alt="Worker 2" className="card-img-top rounded-circle mx-auto mt-3" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                <div className="card-body">
                                    <h4 className="card-title">John Smith</h4>
                                    <p className="card-text">Expert Gardener specializing in landscaping.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card h-100 text-center">
                                <img src="images/worker3.jpg" alt="Worker 3" className="card-img-top rounded-circle mx-auto mt-3" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                <div className="card-body">
                                    <h4 className="card-title">Mary Johnson</h4>
                                    <p className="card-text">Certified Nanny with a passion for childcare.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-5">
                <div className="container">
                    <h2 className="text-center mb-4 text-success">What Our Users Say</h2>
                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <p className="card-text">"EMIS made finding a reliable cleaner so easy! The platform is user-friendly, and the workers are professional."</p>
                                    <p className="card-text"><strong>- Sarah K., Client</strong></p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <p className="card-text">"As a worker, EMIS helped me find steady jobs that match my skills. I highly recommend it!"</p>
                                    <p className="card-text"><strong>- James M., Worker</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="text-center py-5 bg-light">
                <div className="container">
                    <h2 className="text-success mb-4">Get in Touch with EMIS</h2>
                    <p>Have questions or ready to start? Contact us or join EMIS today!</p>
                    <div className="card shadow bg-light p-4 rounded mb-4" style={{ maxWidth: '500px', margin: 'auto' }}>
                        <form onSubmit={handleContactSubmit}>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Enter your name"
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                required
                            />
                            <input
                                type="email"
                                className="form-control mb-3"
                                placeholder="Enter your email"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                required
                            />
                            <textarea
                                className="form-control mb-3"
                                placeholder="Your message"
                                value={contactMessage}
                                onChange={(e) => setContactMessage(e.target.value)}
                                rows="4"
                                required
                            ></textarea>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-success">Send Message</button>
                            </div>
                        </form>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6 d-grid">
                            <Link to="/register/worker" className="btn btn-success mb-2">Find Work</Link>
                        </div>
                        <div className="col-md-6 d-grid">
                            <Link to="/register/user" className="btn btn-success mb-2">Book a Service</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-dark text-light text-center py-4">
                <div className="container">
                    <p className="mb-2">&copy; {new Date().getFullYear()} EMIS. All Rights Reserved.</p>
                    <p className="mb-2">Email: support@emis.com | Phone: +123-456-7890</p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to='https://facebook.com' className='bi bi-facebook text-light'></Link>
                        <Link to='https://twitter.com' className='bi bi-twitter-x text-light'></Link>
                        <Link to='https://linkedin.com' className='bi bi-linkedin text-light'></Link>
                        <Link to='https://instagram.com' className='bi bi-instagram text-light'></Link>
                        
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
