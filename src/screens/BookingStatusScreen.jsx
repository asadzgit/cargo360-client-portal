import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList, FaFilter, FaEye, FaTruck, FaArrowRight, FaClock, FaCheckCircle, FaSearch, FaTimes } from 'react-icons/fa';
import { useBooking } from '../context/BookingContext';
import './BookingStatusScreen.css';
import { ClientFooter } from '../components/ClientFooter';
import { humanize } from '../utils/helpers';

function BookingStatusScreen() {
  const navigate = useNavigate();
  const { bookings, loading, error, fetchBookings, cancelBooking } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const urlParams = new URLSearchParams(window.location.search);
  const statusFromUrl = urlParams.get('status');
  const initialStatusFilter = statusFromUrl ? statusFromUrl : 'all';
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  
  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter and sort bookings

  const filteredBookings = bookings
    .filter(booking => {
      const matchesStatus = statusFilter != 'active' ? statusFilter === 'all' || booking.status.toLowerCase() === statusFilter.toLowerCase() : 
                            !['pending', 'delivered', 'cancelled'].includes(booking.status.toLowerCase());
      const matchesSearch = booking.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.dropLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.cargoType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           `C360-PK-${booking.id}`.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        // case 'pickup-date':
        //   return new Date(a.pickupDate) - new Date(b.pickupDate);
        default:
          return 0;
      }
    });

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
        return <FaCheckCircle />;
      case 'cancelled':
        return <FaTimes />;
      default:
        return <FaClock />;
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId);
      } catch (error) {
        alert('Failed to cancel booking: ' + error.message);
      }
    }
  };

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status.toLowerCase() === 'pending').length,
    accepted: bookings.filter(b => ['accepted', 'picked_up', 'in_transit'].includes(b.status.toLowerCase())).length,
    delivered: bookings.filter(b => ['delivered'].includes(b.status.toLowerCase())).length
  };

  if (loading) {
    return (
      <div className="booking-status-screen">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="booking-status-screen">
        <div className="container">
          <div className="screen-header">
            <h1><FaClipboardList /> My Bookings</h1>
            <p>Track and manage all your booking requests</p>
          </div>

          {error && (
            <div className="error-message">
              <p>Error loading bookings: {error}</p>
              <button onClick={() => fetchBookings()} className="btn btn-primary">
                Retry
              </button>
            </div>
          )}

          {/* Stats Overview */}
          <div className="booking-stats">
            <div className="stat-item">
              <h3>{statusCounts.all}</h3>
              <p>Total Bookings</p>
            </div>
            <div className="stat-item">
              <h3>{statusCounts.pending}</h3>
              <p>Pending</p>
            </div>
            <div className="stat-item">
              <h3>{statusCounts.accepted}</h3>
              <p>Active</p>
            </div>
            <div className="stat-item">
              <h3>{statusCounts.delivered}</h3>
              <p>Delivered</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="booking-controls">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by booking ID, location, or vehicle..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-controls">
              <div className="filter-group">
                <label className="filter-label">
                  <FaFilter /> Status:
                </label>
                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label className="filter-label">Sort by:</label>
                <select
                  className="filter-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  {/* <option value="pickup-date">Pickup Date</option> */}
                </select>
              </div>
            </div>
          </div>

          {/* Booking List */}
          <div className="bookings-container">
            {filteredBookings.length === 0 ? (
              <div className="empty-state">
                <FaClipboardList className="empty-icon" />
                <h3>No bookings found</h3>
                <p>
                  {statusFilter === 'all' && searchTerm === '' 
                    ? "You haven't made any bookings yet."
                    : "No bookings match your current filters."
                  }
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/book-truck')}
                >
                  <FaTruck /> Book Your First Vehicle
                </button>
              </div>
            ) : (
              <div className="bookings-list">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="booking-item card fade-in">
                    <div className="booking-header">
                      <div className="booking-id">
                        <h4>C360-PK-{booking.id}</h4>
                        <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                          {getStatusIcon(booking.status)}
                          {humanize(booking.status)}
                        </span>
                      </div>
                      <div className="booking-date">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="booking-content">
                      <div className="booking-info">
                        <div className="info-row">
                          <div className="info-item">
                            <strong>Vehicle:</strong>
                            <span>{humanize(booking.vehicleType)}</span>
                          </div>
                          <div className="info-item">
                            <strong>Cargo:</strong>
                            <span>{humanize(booking.cargoType)}</span>
                          </div>
                        </div>
                        
                        <div className="info-row">
                          <div className="info-item">
                            <strong>Route:</strong>
                            <span className="route">
                              {booking.pickupLocation.substring(0, 50).concat('...')} 
                              <span style={{color: 'var(--success-color)'}}> <FaTruck/> <FaArrowRight/> </span>
                              {booking.dropLocation.substring(0, 50).concat('...')}
                            </span>
                          </div>
                        </div>
                        
                        <div className="info-row">
                          <div className="info-item">
                            <strong>Created:</strong>
                            <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                          </div>
                          {booking.cargoWeight && (
                            <div className="info-item">
                              <strong>Weight:</strong>
                              <span>{booking.cargoWeight} kg</span>
                            </div>
                          )}
                        </div>

                        {booking.Trucker && (
                          <div className="info-row">
                            <div className="info-item">
                              <strong>Trucker:</strong>
                              <span>{booking.Trucker.name}</span>
                            </div>
                            <div className="info-item">
                              <strong>Phone:</strong>
                              <span>{booking.Trucker.phone}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="booking-actions">
                        {booking.budget && (
                          <div className="booking-price">
                            <strong>PKR {booking.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</strong>
                          </div>
                        )}
                        <div className="action-buttons">
                          <button 
                            className="btn btn-outline"
                            onClick={() => navigate(`/booking/${booking.id}`)}
                          >
                            <FaEye /> View Details
                          </button>
                          {booking.status === 'pending' && (
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              <FaTimes /> Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="screen-footer">
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate('/book-truck')}
            >
              <FaTruck /> Book Another Vehicle
            </button>
          </div>
        </div>
      </div>
      <ClientFooter/>
    </>
  );
}

export default BookingStatusScreen;