import React from 'react';
import { FaTruck, FaGlobe, FaFileAlt, FaPaperPlane, FaAddressBook, FaEnvelope } from 'react-icons/fa';
import { FaBuilding, FaBoxes, FaPhone, FaMapMarkerAlt, FaClock, FaShieldAlt, FaDollarSign } from 'react-icons/fa';
import {  FaUserTie, FaHome } from 'react-icons/fa';

import logo from '../assets/cargo-360.png';
import { Link } from 'react-router-dom';
function HomePage() {
  return (
    <div className="booking-status-screen">
      {/* Navigation */}
     <nav
  className="tab-navigation"
  style={{
    top: 0,
    height: '12%',
    borderBottom: '1px solid var(--border-color)',
  }}
>
  <div className="tab-container" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
    {/* Logo Section */}
    <div className="logo-container">
      <img src={logo} alt="logo" className='brand-logo' />
    </div>

    {/* Links Section */}
    <div className="links-container" style={{ display: 'flex', gap: '20px' }}>
      <a style={{ color: '#6b7280' }} href="/home">
        <button className="tab-item">
          <FaHome className="tab-icon" />
          <span className="tab-label">Home</span>
        </button>
      </a>
      <a style={{ color: '#6b7280' }} href="#about">
        <button className="tab-item">
          <FaBuilding className="tab-icon" />
          <span className="tab-label">About</span>
        </button>
      </a>
      <a style={{ color: '#6b7280' }} href="#services">
        <button className="tab-item">
          <FaBoxes className="tab-icon" />
          <span className="tab-label">Services</span>
        </button>
      </a>
      <a style={{ color: '#6b7280' }} href="#contact">
        <button className="tab-item">
          <FaAddressBook className="tab-icon" />
          <span className="tab-label">Contact Us</span>
        </button>
      </a>
      <a style={{ color: '#6b7280' }} href="/book-truck">
        <button className="tab-item">
          <FaUserTie className="tab-icon" />
          <span className="tab-label">Client Login</span>
        </button>
      </a>
    </div>
  </div>
</nav>


      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="container">
        <div className="hero-content">
            <h1>From Port to Door - Seamless Every Step</h1>
            <p>Reliable, efficient, and hassle-free logistics solutions for your business.</p>
            <Link to="/book-truck" style={{ textDecoration: 'none' }}>
            <button
              className="btn btn btn-accent btn-large"
              style={{ textDecoration: 'none' }}
            >
                <FaTruck /> Request a Booking
            </button>
            </Link>
        </div>
        </div>

      </section>

        <section id="about" className="about-section">
            <div className="container">
            <div className="about-content">
                <div className="about-text">
                <h2>About Cargo360</h2>
                <p>
                    We're the leading platform connecting businesses and individuals with reliable 
                    truck transportation services. Our network of professional drivers and modern 
                    fleet ensures your cargo reaches its destination safely and on time.
                </p>
                <div className="about-features">
                    <div className="feature-item">
                    <FaShieldAlt className="feature-icon" />
                    <div>
                        <h4>Secure Transport</h4>
                        <p>All our vehicles are insured and tracked in real-time</p>
                    </div>
                    </div>
                    <div className="feature-item">
                    <FaDollarSign className="feature-icon" />
                    <div>
                        <h4>Competitive Rates</h4>
                        <p>Get the best prices for your transportation needs</p>
                    </div>
                    </div>
                    <div className="feature-item">
                    <FaClock className="feature-icon" />
                    <div>
                        <h4>24/7 Support</h4>
                        <p>Our customer service team is always here to help</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>

        <section id="services" className="services-section">
            <div className="container">
            <h2>Our Services</h2>
            <div className="services-grid">
                <div className="service-card card">
                <div className="service-icon">
                    <FaTruck />
                </div>
               <h3>Logistics Solutions</h3>
            <p>Reliable & efficient transportation services worldwide.</p>
                </div>
                <div className="service-card card">
                <div className="service-icon">
                    <FaFileAlt />
                </div>
                <h3>Import Clearance</h3>
            <p>Hassle-free customs & documentation support.</p>
                </div>
                <div className="service-card card">
                <div className="service-icon">
                    <FaPaperPlane />
                </div>
                <h3>Export Forwarding</h3>
                <p>Smooth handling of global export operations.</p>
                </div>
            </div>
            </div>
        </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
             <div className="container">
               <h2>Contact Us</h2>
               <div className="contact-grid">
                 <div className="contact-info">
                   <div className="contact-item">
                     <FaPhone className="contact-icon" />
                     <div>
                       <h4>Phone</h4>
                       <p>+92 333 7766609</p>
                     </div>
                   </div>
                   <div className="contact-item">
                     <FaEnvelope className="contact-icon" />
                     <div>
                       <h4>Email</h4>
                       <p>info@cargo360pk.com</p>
                     </div>
                   </div>
                   <div className="contact-item">
                     <FaMapMarkerAlt className="contact-icon" />
                     <div>
                       <h4>Address</h4>
                       <p>Plaza # 146, 5th Floor. Sector C commercial area<br />Bahria Town Lahore</p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </section>

      {/* Footer */}
      <footer className="container screen-footer" style={{ textAlign: 'center', marginTop: 40 }}>
        <small>© {new Date().getFullYear()} CARGO 360. All rights reserved.</small>
      </footer>
    </div>
  );
}

export default HomePage;