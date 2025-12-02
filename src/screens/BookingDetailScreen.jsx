import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaWeight, FaClock, FaPhone, FaUser, FaRoute, FaMoneyBill, FaClipboardCheck, FaTimes, FaCar, FaEdit, FaPlus } from 'react-icons/fa';
import { useBooking } from '../context/BookingContext';
import LocationTrackingModal from '../components/LocationTrackingModal';
import EditBookingModal from '../components/EditBookingModal';
import { humanize } from '../utils/helpers';
import { bookingAPI } from '../services/api';
import {ClientFooter} from '../components/ClientFooter';
import Modal from '../components/Modal';
import './BookingDetailScreen.css';

function BookingDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchBooking, cancelBooking, loading, error } = useBooking();
  const [booking, setBooking] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [discountBudget, setDiscountBudget] = useState('');
  const [discountLoading, setDiscountLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);
  const [selectedCancelReason, setSelectedCancelReason] = useState('');
  const [customCancelReason, setCustomCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const bookingData = await fetchBooking(id);
        setBooking(bookingData);
      } catch (error) {
        console.error('Failed to load booking:', error);
      }
    };
    console.log('hello world')

    loadBooking();
  }, [id]);

  const handleEditSuccess = async () => {
    // Refresh booking data after successful edit
    try {
      const bookingData = await fetchBooking(id);
      setBooking(bookingData);
    } catch (error) {
      console.error('Failed to reload booking:', error);
    }
  };

  const handleCancelBooking = () => {
    const statusKey = (booking?.status || '').toLowerCase();
    if (['delivered', 'completed', 'cancelled'].includes(statusKey)) {
      alert('This booking cannot be cancelled.');
      return;
    }
    // Open cancel reason modal
    setShowCancelReasonModal(true);
    setSelectedCancelReason('');
    setCustomCancelReason('');
  };

  const handleCloseCancelReasonModal = () => {
    setShowCancelReasonModal(false);
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

    try {
      setCancelling(true);
      
      // Prepare cancel reason
      const cancelReason = selectedCancelReason === 'Others' 
        ? customCancelReason.trim() 
        : selectedCancelReason;
      
      // Close modal
      setShowCancelReasonModal(false);
      
      // Call cancelBooking with reason
      await cancelBooking(id, cancelReason);
      
      // Navigate back to bookings
      navigate('/bookings');
    } catch (error) {
      alert(error?.message || 'Failed to cancel booking. Please try again.');
      setShowCancelReasonModal(true); // Reopen modal on error
    } finally {
      setCancelling(false);
    }
  };

  const handleRequestDiscount = async () => {
    const amount = parseFloat(discountBudget);
    if (Number.isNaN(amount) || amount <= 0) {
      alert('Please enter a valid budget amount greater than 0.');
      return;
    }
  
    try {
      setDiscountLoading(true);
      const res = await bookingAPI.createDiscountRequest(id, amount);
      const msg = res?.message || 'Discount request created';
      alert(msg);
  
      // Optional: refresh booking
      try {
        const bookingData = await fetchBooking(id);
        setBooking(bookingData);
      } catch {}
    } catch (e) {
      // Common backend errors:
      // 404 Not Found (not owned or not found)
      // 409 Conflict (request already exists)
      // 400 Validation (invalid amount)
      alert(e?.message || 'Failed to create discount request');
    } finally {
      setDiscountLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions to confirm your order.');
      return;
    }

    try {
      setConfirmLoading(true);
      const res = await bookingAPI.confirmShipment(id);
      
      // Refresh booking to get updated status
      try {
        const bookingData = await fetchBooking(id);
        setBooking(bookingData);
      } catch {}
      
      // Close modal
      setShowConfirmModal(false);
      setAgreedToTerms(false);
      
      // Show success message
      alert('Order Confirmed!\n\nYour shipment has been confirmed successfully. You will be notified shortly after a driver picks up this order.');
    } catch (e) {
      alert(e?.message || 'Failed to confirm order. Please try again.');
    } finally {
      setConfirmLoading(false);
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

  // Converts numbers to words (simple PKR format)
const numberToWords = (num) => {
  if (num === 0) return "Zero Only";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
    "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  const numToWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000)
      return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + numToWords(n % 100) : "");
    if (n < 1000000)
      return numToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + numToWords(n % 1000) : "");
    if (n < 1000000000)
      return numToWords(Math.floor(n / 1000000)) + " Million" + (n % 1000000 ? " " + numToWords(n % 1000000) : "");
    return num.toString();
  };

  return numToWords(num) + " Only";
};

// Just to check the the amount in words is working or not
// const testBudget = 508000; // Try changing this value
// console.log(numberToWords(testBudget));

  return (
    <>
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
                <h2>C360-PK-{booking.id}</h2>
                <span 
                  className={`status-badge status-${booking.status.toLowerCase()}`}
                  style={{ color: getStatusColor(booking.status) }}
                >
                  {getStatusIcon(booking.status)}
                  {humanize(booking.status)}
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
                      <value>{humanize(booking.vehicleType)}</value>
                    </div>
                    <div className="info-item">
                      <label>Cargo Type</label>
                      <value>{humanize(booking.cargoType)}</value>
                    </div>
                    {(booking?.Trucker || booking?.trucker) && (
                      <>
                        <div className="info-item">
                          <label>Trucker</label>
                          <value>{booking?.Trucker?.name || booking?.trucker?.name}</value>
                        </div>
                        <div className="info-item">
                          <label>Phone</label>
                          <value>{booking?.Trucker?.phone || booking?.trucker?.phone}</value>
                        </div>
                      </>
                    )}
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
                      <div className="info-item ">
                        <label>Cargo Description</label>
                        <value>{booking.description || "No description was given"}</value>
                      </div>
                      <div className='info-item'>
                        <label>Insurance:</label> 
                        <value>{booking.insurance ? "Yes" : "No"}</value>
                      </div>
                      <div className='info-item'>
                        <label>Sales Tax Invoice:</label> 
                        <value>{booking.salesTax ? "Yes" : "No"}</value>
                      </div>
                      <div className='info-item'>
                        <label>Clearing Agent Number:</label> 
                        <value>{booking.clearingAgentNum || "Not provided"}</value>
                      </div>
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
                    
                    <div className="route-line BookingDetailroute-line">
                      <div className="distance-info">
                        Route
                      </div>
                    </div>
                    {/* {----} */}
                    
                    <div className="location-item delivery">
                      <FaMapMarkerAlt className="location-icon" />
                      <div className="location-details">
                        <label>Drop Off Location</label>
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
              {/* {booking.Trucker && (
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
              )} */}

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
                  <h3><FaMoneyBill /> Pricing</h3>
                </div>
                <div className="card-body">
                  <div className="pricing-breakdown">
                  {booking.budget && (
                    <>
                      {booking.DiscountRequest && booking.DiscountRequest.status === 'pending' && (
                        <p style={{color: 'white'}}>Discount request pending</p>
                      )}
                      {booking.DiscountRequest && booking.DiscountRequest.status === 'accepted' && (
                        <>
                          <p style={{color: 'orange'}}>Discount request accepted</p>
                          <p style={{color: 'orange'}}>Amount accepted: {booking.DiscountRequest?.requestAmount}</p>
                        </>
                      )}
                      {booking.DiscountRequest && booking.DiscountRequest.status === 'rejected' && (
                        <>
                        <p style={{color: 'red'}}>Discount request rejected</p>
                        <p style={{color: 'red'}}>Amount rejected: {booking.DiscountRequest?.requestAmount}</p>
                        </>
                      )}
                      {booking.DiscountRequest?.status != 'accepted' && booking.DiscountRequest?.status != 'rejected' && (
                        <div className='flex align-items-center gap-2'>
                          <p style={{color: 'white'}}>Want a discount? <br></br> Enter your budget (PKR)</p>
                          <input
                            className='form-input' 
                            style={{width: '30%'}}
                            type='number'
                            placeholder='Your budget'
                            max={99999999}
                            name='discount-budget'
                            value={discountBudget}
                            onChange={(e) => setDiscountBudget(e.target.value)}
                          />
                          <button
                            type="button"
                            className='btn btn-accent'
                            style={{padding: '1%'}}
                            onClick={handleRequestDiscount}
                            disabled={discountLoading}
                          >
                            {discountLoading ? 'Submitting...' : 'Request discount'}
                          </button>
                        </div>
                      )}
                    </>
                  )}

                    {booking.budget && (
  <>
    <p style={{color: 'white'}}>Best price after discussion with several brokers</p>
    <div className="price-item total">
      <label>Budget</label>
      <value>PKR {booking.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</value>
    </div>
    <div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '-2px',
  color: 'var(--accent-color)',
  fontWeight: 600,
  fontSize: '15px'
}}>
  <span>Amount in words</span>
  <span>{numberToWords(booking.budget)}</span>
  {/* <span>{numberToWords(750000)}</span>   Try changing this number */}

</div>

  </>
)}

                    {!booking.budget && (
                      <div className="price-item">
                        <label>Pricing</label>
                        <value>In Negotiation</value>
                      </div>
                    )}

                    {/* Confirm Order Button */}
                    {booking.budget && booking.status !== 'confirmed' && booking.status !== 'completed' && booking.status !== 'cancelled' && (
                      <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #333' }}>
                        <button
                          className="btn btn-primary"
                          style={{ width: '100%', padding: '12px', fontSize: '16px' }}
                          onClick={() => setShowConfirmModal(true)}
                        >
                          <FaClipboardCheck /> Confirm Order
                        </button>
                      </div>
                    )}

                    {/* Show confirmation message if already confirmed */}
                    {booking.status === 'confirmed' && (
                      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#10b981', borderRadius: '8px' }}>
                        <p style={{ color: 'white', margin: 0, textAlign: 'center', fontWeight: '600' }}>
                          ✓ Order Confirmed - Waiting for driver assignment
                        </p>
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
              <>
                <button 
                  className="btn btn-accent"
                  onClick={() => setShowEditModal(true)}
                >
                  <FaEdit /> Edit Booking
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleCancelBooking}
                >
                  <FaTimes /> Cancel Booking
                </button>
              </>
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
            
            {/* for clearance button */}
            {/* <button 
              className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
            >
              <FaPlus />Add Clearance Doc
            </button> */}
            {/* Modal Component */}
            {/* <Modal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
            /> */}
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

          {/* Edit Booking Modal */}
          <EditBookingModal 
            booking={booking}
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSuccess={handleEditSuccess}
          />

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

          {/* Confirm Order Modal */}
          {showConfirmModal && (
            <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                  <h3><FaClipboardCheck /> Confirm Your Order</h3>
                  <button className="modal-close" onClick={() => setShowConfirmModal(false)}>
                    <FaTimes />
                  </button>
                </div>

                <div className="modal-body">
                  <div style={{ backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h4 style={{ color: '#000', marginBottom: '15px' }}>Order Summary</h4>
                    
                    <div style={{ marginBottom: '10px' }}>
                      <strong style={{ color: '#000' }}>Pickup:</strong>
                      <p style={{ color: '#374151', margin: '5px 0' }}>{booking.pickupLocation}</p>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <strong style={{ color: '#000' }}>Drop Off:</strong>
                      <p style={{ color: '#374151', margin: '5px 0' }}>{booking.dropLocation}</p>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <strong style={{ color: '#000' }}>Vehicle Type:</strong>
                      <p style={{ color: '#374151', margin: '5px 0' }}>{booking.vehicleType}</p>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <strong style={{ color: '#000' }}>Cargo Type:</strong>
                      <p style={{ color: '#374151', margin: '5px 0' }}>{booking.cargoType}</p>
                    </div>

                    <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #d1d5db' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: '#000', fontSize: '18px' }}>Total Budget:</strong>
                        <strong style={{ color: '#01304e', fontSize: '22px' }}>
                          PKR {booking.budget?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </strong>
                      </div>
                      <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '5px' }}>
                        {numberToWords(booking.budget)}
                      </p>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#fef3c7', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <p style={{ color: '#92400e', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                      <strong>Important:</strong> By confirming this order, you agree that the above details and budget are correct. 
                      Once confirmed, a driver will be assigned to your shipment and you will be notified shortly.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '20px' }}>
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      style={{ marginTop: '3px', cursor: 'pointer', width: '18px', height: '18px' }}
                    />
                    <label htmlFor="agreeTerms" style={{ color: '#000', fontSize: '14px', cursor: 'pointer', lineHeight: '1.5' }}>
                      I confirm that all the details are correct and I agree to the terms and conditions. 
                      I understand that once confirmed, the order cannot be cancelled without charges.
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setShowConfirmModal(false);
                      setAgreedToTerms(false);
                    }}
                    disabled={confirmLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={handleConfirmOrder}
                    disabled={!agreedToTerms || confirmLoading}
                    style={{ 
                      opacity: (!agreedToTerms || confirmLoading) ? 0.6 : 1,
                      cursor: (!agreedToTerms || confirmLoading) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {confirmLoading ? 'Confirming...' : 'Confirm Order'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ClientFooter/>
    </>
  );
}

export default BookingDetailScreen;