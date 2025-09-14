import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaWeight, FaClock, FaPhone, FaUser, FaRoute, FaDollarSign, FaClipboardCheck, FaTimes, FaCar } from 'react-icons/fa';
import { useBooking } from '../context/BookingContext';
import LocationTrackingModal from '../components/LocationTrackingModal';
import './BookingDetailScreen.css';

function BookingDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchBooking, cancelBooking, loading, error } = useBooking();
  const [booking, setBooking] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const bookingData = await fetchBooking(id);
        setBooking(bookingData);
      } catch (error) {
        console.error('Failed to load booking:', error);
      }
    };

    loadBooking();
  }, [id]);

  const handleCancelBooking = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(id);
        navigate('/bookings');
      } catch (error) {
        alert('Failed to cancel booking: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="booking-detail-screen">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!booking || error) {
    return (
      <div className="booking-detail-screen">
        <div className="container">
          <div className="error-state">
            <h2>Booking Not Found</h2>
            <p>The booking you're looking for doesn't exist or has been removed.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/bookings')}
            >
              Back to Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'var(--warning-color)';
      case 'accepted': return 'var(--success-color)';
      case 'picked_up': return 'var(--info-color)';
      case 'in_transit': return 'var(--info-color)';
      case 'delivered': return 'var(--primary-color)';
      case 'cancelled': return 'var(--danger-color)';
      default: return 'var(--text-light)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <FaClock />;
      case 'accepted':
        return <FaTruck />;
      case 'picked_up':
        return <FaTruck />;
      case 'in_transit':
        return <FaTruck />;
      case 'delivered':
        return <FaClipboardCheck />;
      case 'cancelled':
        return <FaTimes />;
      default:
        return <FaClock />;
    }
  };

  return (
    <div className="booking-detail-screen">
      <div className="container">
        {/* Header */}
        <div className="detail-header">
          <button 
            className="back-button"
            onClick={() => navigate('/bookings')}
          >
            <FaArrowLeft /> Back to Bookings
          </button>
          
          <div className="booking-title">
            <h1>Booking Details</h1>
            <div className="booking-id-status">
              <h2>{booking.id}</h2>
              <span 
                className={`status-badge status-${booking.status.toLowerCase()}`}
                style={{ color: getStatusColor(booking.status) }}
              >
                {getStatusIcon(booking.status)}
                {booking.status}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="detail-content">
          <div className="detail-grid">
            {/* Vehicle & Load Information */}
            <div className="detail-card">
              <div className="card-header">
                <h3><FaTruck /> Vehicle & Load Information</h3>
              </div>
              <div className="card-body">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Vehicle Type</label>
                    <value>{booking.vehicleType}</value>
                  </div>
                  <div className="info-item">
                    <label>Cargo Type</label>
                    <value>{booking.cargoType}</value>
                  </div>
                  {booking.cargoWeight && (
                    <div className="info-item">
                      <label>Weight</label>
                      <value><FaWeight /> {booking.cargoWeight} kg</value>
                    </div>
                  )}
                  {/* {booking.cargoSize && (
                    <div className="info-item">
                      <label>Cargo Size</label>
                      <value>{booking.cargoSize}</value>
                    </div>
                  )} */}
                </div>
                <div className="info-item full-width">
                  <label>Cargo Description</label>
                  <value>{booking.description}</value>
                </div>
              </div>
            </div>

            {/* Route Information */}
            <div className="detail-card">
              <div className="card-header">
                <h3><FaRoute /> Route Information</h3>
              </div>
              <div className="card-body">
                <div className="route-display">
                  <div className="location-item pickup">
                    <FaMapMarkerAlt className="location-icon" />
                    <div className="location-details">
                      <label>Pickup Location</label>
                      <value>{booking.pickupLocation}</value>
                    </div>
                  </div>
                  
                  <div className="route-line">
                    <div className="distance-info">
                      Route
                    </div>
                  </div>
                  
                  <div className="location-item delivery">
                    <FaMapMarkerAlt className="location-icon" />
                    <div className="location-details">
                      <label>Delivery Location</label>
                      <value>{booking.dropLocation}</value>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Information */}
            {/* <div className="detail-card">
              <div className="card-header">
                <h3><FaCalendarAlt /> Schedule</h3>
              </div>
              <div className="card-body">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Pickup Date</label>
                    <value>{new Date(booking.pickupDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</value>
                  </div>
                  <div className="info-item">
                    <label>Delivery Date</label>
                    <value>{new Date(booking.deliveryDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</value>
                  </div>
                  <div className="info-item">
                    <label>Booking Created</label>
                    <value>{new Date(booking.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })} at {new Date(booking.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</value>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Trucker Information */}
            {booking.Trucker && (
              <div className="detail-card">
                <div className="card-header">
                  <h3><FaUser /> Trucker Information</h3>
                </div>
                <div className="card-body">
                  <div className="driver-info">
                    <div className="driver-avatar">
                      <FaUser />
                    </div>
                    <div className="driver-details">
                      <div className="info-item">
                        <label>Trucker Name</label>
                        <value>{booking.Trucker.name}</value>
                      </div>
                      <div className="info-item">
                        <label>Contact Number</label>
                        <value>
                          <a href={`tel:${booking.Trucker.phone}`} className="phone-link">
                            <FaPhone /> {booking.Trucker.phone}
                          </a>
                        </value>
                      </div>
                      <div className="info-item">
                        <label>Email</label>
                        <value>{booking.Trucker.email}</value>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Timeline */}
            <div className="detail-card">
              <div className="card-header">
                <h3><FaCalendarAlt /> Booking Timeline</h3>
              </div>
              <div className="card-body">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Booking Created</label>
                    <value>{new Date(booking.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</value>
                  </div>
                  <div className="info-item">
                    <label>Last Updated</label>
                    <value>{new Date(booking.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</value>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="detail-card pricing-card">
              <div className="card-header">
                <h3><FaDollarSign /> Pricing</h3>
              </div>
              <div className="card-body">
                <div className="pricing-breakdown">
                  {booking.budget && (
                    <div className="price-item total">
                      <label>Budget</label>
                      <value>${booking.budget}</value>
                    </div>
                  )}
                  {!booking.budget && (
                    <div className="price-item">
                      <label>Pricing</label>
                      <value>To be negotiated with trucker</value>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="detail-actions">
          {booking.status.toLowerCase() === 'pending' && (
            <button 
              className="btn btn-secondary"
              onClick={handleCancelBooking}
            >
              <FaTimes /> Cancel Booking
            </button>
          )}
          
          {/* {booking.Trucker && ['accepted', 'picked_up', 'in_transit'].includes(booking.status.toLowerCase()) && (
            <button className="btn btn-accent">
              <FaPhone /> Call Trucker
            </button>
          )} */}

          {['picked_up', 'in_transit'].includes(booking.status.toLowerCase()) && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowLocationModal(true)}
            >
              <FaCar /> See Driver Location
            </button>
          )}
          
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/book-truck')}
          >
            <FaTruck /> Book Another Vehicle
          </button>
        </div>

        {/* Location Tracking Modal */}
        <LocationTrackingModal 
          booking={booking}
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
        />
      </div>
    </div>
  );
}

export default BookingDetailScreen;