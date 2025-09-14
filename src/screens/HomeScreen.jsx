import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTruck, FaClipboardList, FaShippingFast, FaUsers, FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import { FaGlobe, FaFileAlt, FaPaperPlane, FaAddressBook } from 'react-icons/fa';
import { FaBuilding, FaBoxes, FaPhone, FaMapMarkerAlt, FaClock, FaMoneyBill } from 'react-icons/fa';
import {  FaUserTie, FaHome } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import './HomeScreen.css';

function HomeScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { bookings, loading, fetchBookings } = useBooking();

  useEffect(() => {
    fetchBookings();
  }, []);

  const recentBookings = bookings.slice(0, 3);

  // Calculate stats from actual bookings
  const pendingCount = bookings.filter(b => b.status.toLowerCase() === 'pending').length;
  const activeCount = bookings.filter(b => ['accepted', 'picked_up', 'in_transit'].includes(b.status.toLowerCase())).length;
  const completedCount = bookings.filter(b => b.status.toLowerCase() === 'delivered').length;

  return (
    <div className="home-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome back, {user?.name || 'User'}!</h1>
            {/* <p>Ready to manage your cargo transportation needs?</p> */}
            <p>Book a vehicle or check your existing bookings below.</p>
            <div className="hero-actions">
              <button 
                className="btn btn-accent btn-large"
                onClick={() => navigate('/book-truck')}
              >
                <FaTruck /> Book a Vehicle
              </button>
              <button 
                className="btn btn-large"
                onClick={() => navigate('/bookings')}
              >
                <FaClipboardList /> View Bookings
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon pending">
                <FaClock />
              </div>
              <div className="stat-content">
                <h3>{pendingCount}</h3>
                <p>Pending Bookings</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon accepted">
                <FaShippingFast />
              </div>
              <div className="stat-content">
                <h3>{activeCount}</h3>
                <p>Active Shipments</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon completed">
                <FaClipboardList />
              </div>
              <div className="stat-content">
                <h3>{completedCount}</h3>
                <p>Completed Jobs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Bookings */}
      <section className="recent-bookings-section">
        <div className="container">
          <div className="section-header">
            <h2>Recent Bookings</h2>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/bookings')}
            >
              View All
            </button>
          </div>
          <div className="bookings-grid">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner" />
                <p>Loading recent bookings...</p>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="empty-state">
                <FaClipboardList className="empty-icon" />
                <h3>No bookings yet</h3>
                <p>Start by booking your first vehicle!</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/book-truck')}
                >
                  <FaTruck /> Book Now
                </button>
              </div>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking.id} className="booking-card card">
                  <div className="card-header">
                    <div className="booking-header">
                      <h4>#{booking.id}</h4>
                      <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="booking-details">
                      <p><strong>Vehicle:</strong> {booking.vehicleType}</p>
                      <p><strong>Cargo:</strong> {booking.cargoType}</p>
                      <p><strong>Route:</strong> {booking.pickupLocation} → {booking.dropLocation}</p>
                      <p><strong>Created:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button 
                      className="btn btn-outline"
                      onClick={() => navigate(`/booking/${booking.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
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
                  <FaMoneyBill className="feature-icon" />
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

      {/* Services Section */}
      <section className="services-section">
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
                          <h3>Import/Export Clearance</h3>
                      <p>Hassle-free customs & documentation support.</p>
                          </div>
                          <div className="service-card card">
                          <div className="service-icon">
                              <FaPaperPlane />
                          </div>
                          <h3>Freight Forwarding</h3>
                          <p>Smooth handling of global export operations.</p>
                          </div>
                      </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
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
    </div>
  );
}

export default HomeScreen;