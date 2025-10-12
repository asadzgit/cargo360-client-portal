import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTruck, FaClipboardList, FaShippingFast, FaUsers, FaEnvelope, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import { FaGlobe, FaFileAlt, FaPaperPlane, FaAddressBook } from 'react-icons/fa';
import { FaBuilding, FaBoxes, FaPhone, FaMapMarkerAlt, FaClock, FaMoneyBill } from 'react-icons/fa';
import {  FaUserTie, FaHome } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import {ClientFooter} from '../components/ClientFooter';
import { humanize } from '../utils/helpers';
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
                style={{backgroundColor: '#ffffff', color: '#000000'}}
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
            <div className="stat-card"  style={{cursor: 'pointer' }}
                  onClick={() => navigate('/bookings?status=pending')}>
              <div className="stat-icon pending">
                <FaClock />
              </div>
              <div className="stat-content">
                <h3>{pendingCount}</h3>
                <p>Pending Bookings</p>
              </div>
            </div>
            <div className="stat-card"  style={{cursor: 'pointer' }}
                  onClick={() => navigate('/bookings?status=active')}>
              <div className="stat-icon accepted">
                <FaShippingFast />
              </div>
              <div className="stat-content">
                <h3>{activeCount}</h3>
                <p>Active Shipments</p>
              </div>
            </div>
            <div className="stat-card"  style={{cursor: 'pointer' }}
                  onClick={() => navigate('/bookings?status=delivered')}>
              <div className="stat-icon completed">
                <FaClipboardList />
              </div>
              <div className="stat-content">
                <h3>{completedCount}</h3>
                <p>Delivered</p>
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
                        {humanize(booking.status)}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="booking-details">
                      <p><strong>Vehicle:</strong> {humanize(booking.vehicleType)}</p>
                      <p><strong>Cargo:</strong> {humanize(booking.cargoType)}</p>
                      <p><strong>Route:</strong> {booking.pickupLocation.substring(0, 25).concat('...')} 
                                                  <span style={{color: 'var(--success-color)'}}> <FaTruck/> <FaArrowRight/> </span>
                                                  {booking.dropLocation.substring(0, 25).concat('...')}</p>
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
      <ClientFooter />
    </div>
  );
}

export default HomeScreen;