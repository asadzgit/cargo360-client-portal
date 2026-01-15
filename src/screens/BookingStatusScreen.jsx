import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRoute,FaMapMarkerAlt,FaClipboardList, FaFilter, FaEye, FaTruck, FaArrowRight, FaClock, FaCheckCircle, FaSearch, FaTimes, FaWhatsapp } from 'react-icons/fa';
import { useBooking } from '../context/BookingContext';
import './BookingStatusScreen.css';
import { ClientFooter } from '../components/ClientFooter';
import { humanize } from '../utils/helpers';

function BookingStatusScreen() {
  const navigate = useNavigate();
  const { bookings, loading, error, fetchBookings, cancelBooking } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedCancelReason, setSelectedCancelReason] = useState('');
  const [customCancelReason, setCustomCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const statusFromUrl = urlParams.get('status');
  const initialStatusFilter = statusFromUrl ? statusFromUrl : 'all';
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  
  useEffect(() => {
    fetchBookings();
  }, []);

  // Format date as DD/MM/YYYY
 // Format any date into DD/MM/YYYY (supports ISO & DD/MM/YYYY & DD/MM/YYYY hh:mm AM/PM)
const formatDate = (dateString) => {
  if (!dateString) return "Not set";

  // If date is ISO (e.g. "2025-11-14T05:01:42.390Z")
  if (dateString.includes("T")) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  // If date is "DD/MM/YYYY" or "DD/MM/YYYY hh:mm" or "DD/MM/YYYY hh:mm AM/PM"
  const [datePart] = dateString.split(" ");
  const parts = datePart.split("/");

  if (parts.length !== 3) return "Invalid date";

  const [day, month, year] = parts;

  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
};


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

  const handleCancelBooking = (bookingId) => {
    // Open cancel reason modal
    setSelectedBookingId(bookingId);
    setShowCancelReasonModal(true);
    setSelectedCancelReason('');
    setCustomCancelReason('');
  };

  const handleCloseCancelReasonModal = () => {
    setShowCancelReasonModal(false);
    setSelectedBookingId(null);
    setSelectedCancelReason('');
    setCustomCancelReason('');
  };

  const handleSubmitCancelReason = async () => {
    // Validate that a reason is selected or custom reason is entered
    if (!selectedCancelReason) {
      alert('Please select a cancellation reason.');
      return;
    }

    if (selectedCancelReason === 'Others' && !customCancelReason.trim()) {
      alert('Please enter your cancellation reason.');
      return;
    }

    if (!selectedBookingId) {
      alert('Booking ID is missing.');
      return;
    }

    try {
      setCancelling(true);
      
      // Prepare cancel reason
      const cancelReason = selectedCancelReason === 'Others' 
        ? customCancelReason.trim() 
        : selectedCancelReason;
      
      // Close modal
      setShowCancelReasonModal(false);
      
      // Call cancelBooking with reason
      await cancelBooking(selectedBookingId, cancelReason);
      
      // Reset state
      setSelectedBookingId(null);
      setSelectedCancelReason('');
      setCustomCancelReason('');
    } catch (error) {
      alert(error?.message || 'Failed to cancel booking. Please try again.');
      setShowCancelReasonModal(true); // Reopen modal on error
    } finally {
      setCancelling(false);
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
                {statusFilter === 'all' && searchTerm === '' 
                    ? 
                    <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/book-truck')}
                >
                  <FaTruck /> Book Your First Vehicle
                </button>
                    : <></>
                  }
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
                        {formatDate(booking.createdAt)}
                      </div>
                    </div>
                    
                    {/* inside filteredBookings.map */}
<div className="booking-content">
  <div className="booking-info">
    <div className="info-row">
      <div className="info-item">
        <strong>Booking Date:</strong>
        <span>{formatDate(booking.createdAt)}</span>
      </div>
      <div className="info-item">
        <strong>Delivery Date:</strong>
        <span>{formatDate(booking.deliveryDate)}</span>
      </div>
    </div>
    <div className="info-row">
      <div className="info-item">
        <strong>Vehicle Type:</strong>
        <span>{humanize(booking.vehicleType)}</span>
      </div>
      <div className="info-item">
        <strong>Cargo Type:</strong>
        <span>{humanize(booking.cargoType)}</span>
      </div>
    </div>

    {(booking?.Trucker || booking?.trucker) && (
      <div className="info-row">
        <div className="info-item">
          <strong>Broker:</strong>
          <span>{booking?.Trucker?.name || booking?.trucker?.name}</span>
        </div>
        <div className="info-item">
          <strong>Phone:</strong>
          <span>{booking?.Trucker?.phone || booking?.trucker?.phone}</span>
        </div>
      </div>
    )}
    <div className="info-row">
      {booking.cargoWeight && (
        <div className="info-item">
          <strong>Weight:</strong>
          <span>{booking.cargoWeight} kg</span>
        </div>
      )}
    </div>

     {/* <div className="info-row">
      <div className='info-item'><strong>Insurance:</strong> <span>{booking.insurance ? "Yes" : "No"}</span></div>
      <div className='info-item'><strong>Sales Tax Invoice:</strong> {booking.salesTax ? "Yes" : "No"}</div>
    </div> */}
  </div>

  {/* RIGHT COLUMN: date -> status-card -> actions */}
  <div className="booking-right">
    <div className="date-compact">
      {formatDate(booking.createdAt)}
    </div>

    <div className="status-card">
      <div className="card-header">
        <h3> Route Information</h3>
      </div>
      <div className="card-body">
        <div className="route-display">
          <div className="location-item pickup">
            <FaMapMarkerAlt className="location-icon" />
            <div className="location-details">
              <label>Pickup Location</label>
              <value>
                {booking.pickupLocation.length > 50
                  ? booking.pickupLocation.substring(0, 50).concat('...')
                  : booking.pickupLocation}
              </value>
            </div>
          </div>

          <div className="route-line"></div>
{/*  */}
          <div className="location-item delivery">
            <FaMapMarkerAlt className="location-icon" />
            <div className="location-details">
              <label>Drop Off Location</label>
              <value>
                {booking.dropLocation.length > 50
                  ? booking.dropLocation.substring(0, 50).concat('...')
                  : booking.dropLocation}
              </value>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="booking-actions">
      <div className='view-btn'>
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
      </div>
        {booking.status === 'pending' && (
          <button
            className="btn btn-cancel-outline"
            onClick={() => handleCancelBooking(booking.id)}
          >
            <FaTimes /> Cancel
          </button>
        )}
      </div>
    </div>
    {/* --- */}
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

      {/* Cancel Reason Modal */}
      {showCancelReasonModal && (
        <div className="modal-overlay" onClick={handleCloseCancelReasonModal}>
          <div className="modal-content cancel-reason-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header cancel-reason-modal-header">
              <h3><FaTimes /> Cancel Booking</h3>
              <button className="modal-close" onClick={handleCloseCancelReasonModal}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <h4 className="cancel-reason-title">Why are you cancelling this booking?</h4>
              <p className="cancel-reason-subtitle">Please select a reason for cancellation *</p>

              {/* Cancel Reason Options */}
              <div className="cancel-reason-options">
                <button
                  className={`cancel-reason-option ${selectedCancelReason === 'Not satisfied with the rates' ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedCancelReason('Not satisfied with the rates');
                    setCustomCancelReason('');
                  }}
                >
                  Not satisfied with the rates
                </button>

                <button
                  className={`cancel-reason-option ${selectedCancelReason === "Don't need Booking anymore" ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedCancelReason("Don't need Booking anymore");
                    setCustomCancelReason('');
                  }}
                >
                  Don't need Booking anymore
                </button>

                <button
                  className={`cancel-reason-option ${selectedCancelReason === 'Others' ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedCancelReason('Others');
                  }}
                >
                  Others
                </button>
              </div>

              {/* Custom Reason Input - Show when "Others" is selected */}
              {selectedCancelReason === 'Others' && (
                <div className="custom-reason-container">
                  <label className="custom-reason-label">Please specify your reason *</label>
                  <textarea
                    className="custom-reason-input"
                    placeholder="Enter your cancellation reason"
                    rows={4}
                    value={customCancelReason}
                    onChange={(e) => setCustomCancelReason(e.target.value)}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="cancel-reason-modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseCancelReasonModal}
                  disabled={cancelling}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmitCancelReason}
                  disabled={cancelling}
                  style={{
                    opacity: cancelling ? 0.6 : 1,
                    cursor: cancelling ? 'not-allowed' : 'pointer'
                  }}
                >
                  {cancelling ? 'Cancelling...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/923337766609"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Contact us on WhatsApp"
      >
        <FaWhatsapp />
      </a>
    </>
  );
}

export default BookingStatusScreen;