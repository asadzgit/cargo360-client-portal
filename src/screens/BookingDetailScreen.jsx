import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaWeight, FaClock,
  FaPhone, FaUser, FaRoute, FaMoneyBill, FaClipboardCheck, FaTimes, 
  FaCar, FaEdit, FaPlus 
} from 'react-icons/fa';
import { useBooking } from '../context/BookingContext';
import LocationTrackingModal from '../components/LocationTrackingModal';
import EditBookingModal from '../components/EditBookingModal';
import { humanize } from '../utils/helpers';
import { bookingAPI } from '../services/api';
import { ClientFooter } from '../components/ClientFooter';
import Modal from '../components/Modal';
import './BookingDetailScreen.css';

function BookingDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchBooking, cancelBooking, loading, error } = useBooking();
  const [booking, setBooking] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // ✅ New States for Cancel Reason Modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const [discountBudget, setDiscountBudget] = useState('');
  const [discountLoading, setDiscountLoading] = useState(false);

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

  const handleEditSuccess = async () => {
    try {
      const bookingData = await fetchBooking(id);
      setBooking(bookingData);
    } catch (error) {
      console.error('Failed to reload booking:', error);
    }
  };

  // ✅ Handle cancel booking (UI only – no backend yet)
  const handleSubmitCancellation = () => {
    const finalReason = cancelReason === "Others" ? customReason : cancelReason;

    if (!finalReason) {
      alert("Please select or enter a cancellation reason.");
      return;
    }

    console.log("Cancellation Reason:", finalReason);

    alert("Booking cancelled (UI only). Reason: " + finalReason);

    setShowCancelModal(false);
  };

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
      case 'pending': return <FaClock />;
      case 'accepted': return <FaTruck />;
      case 'picked_up': return <FaTruck />;
      case 'in_transit': return <FaTruck />;
      case 'delivered': return <FaClipboardCheck />;
      case 'cancelled': return <FaTimes />;
      default: return <FaClock />;
    }
  };

  // ✅ Number to words
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

  return (
    <>
      <div className="booking-detail-screen">
        <div className="container">

          {/* HEADER */}
          <div className="detail-header">
            <button className="back-button" onClick={() => navigate('/bookings')}>
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

          {/* MAIN CONTENT */}
          <div className="detail-content">
            <div className="detail-grid">

              {/* VEHICLE INFORMATION */}
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

                    {booking.cargoWeight && (
                      <div className="info-item">
                        <label>Weight</label>
                        <value><FaWeight /> {booking.cargoWeight} kg</value>
                      </div>
                    )}

                    <div className="info-item">
                      <label>Description</label>
                      <value>{booking.description || "No description provided"}</value>
                    </div>

                    <div className='info-item'>
                      <label>Insurance</label> 
                      <value>{booking.insurance ? "Yes" : "No"}</value>
                    </div>

                    <div className='info-item'>
                      <label>Sales Tax Invoice</label> 
                      <value>{booking.salesTax ? "Yes" : "No"}</value>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROUTE INFORMATION */}
              <div className="detail-card">
                <div className="card-header">
                  <h3><FaRoute /> Route Information</h3>
                </div>

                <div className="card-body">
                  <div className="route-display">
                    <div className="location-item pickup">
                      <FaMapMarkerAlt className="location-icon" />
                      <div className="location-details">
                        <label>Pickup</label>
                        <value>{booking.pickupLocation}</value>
                      </div>
                    </div>

                    <div className="route-line BookingDetailroute-line">
                      <div className="distance-info">Route</div>
                    </div>

                    <div className="location-item delivery">
                      <FaMapMarkerAlt className="location-icon" />
                      <div className="location-details">
                        <label>Drop-Off</label>
                        <value>{booking.dropLocation}</value>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TIMELINE */}
              <div className="detail-card">
                <div className="card-header">
                  <h3><FaCalendarAlt /> Booking Timeline</h3>
                </div>

                <div className="card-body">
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Created</label>
                      <value>
                        {new Date(booking.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </value>
                    </div>

                    <div className="info-item">
                      <label>Last Updated</label>
                      <value>
                        {new Date(booking.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </value>
                    </div>
                  </div>
                </div>
              </div>

              {/* PRICING */}
              <div className="detail-card pricing-card">
                <div className="card-header">
                  <h3><FaMoneyBill /> Pricing</h3>
                </div>

                <div className="card-body">
                  <div className="pricing-breakdown">

                  {booking.budget && (
                    <>
                      <p style={{color:"white"}}>Best price after broker discussion</p>

                      <div className="price-item total">
                        <label>Budget</label>
                        <value>
                          PKR {booking.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </value>
                      </div>

                      <div style={{
                        display:'flex',
                        justifyContent:'space-between',
                        alignItems:'center',
                        marginTop:'-2px',
                        color:'var(--accent-color)',
                        fontWeight:600,
                        fontSize:'15px'
                      }}>
                        <span>Amount in words</span>
                        <span>{numberToWords(booking.budget)}</span>
                      </div>
                    </>
                  )}

                  {!booking.budget && (
                    <div className="price-item">
                      <label>Pricing</label>
                      <value>In Negotiation</value>
                    </div>
                  )}

                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="detail-actions">

            {['pending','accepted'].includes(booking.status.toLowerCase()) && (
              <>
                <button className="btn btn-accent" onClick={() => setShowEditModal(true)}>
                  <FaEdit /> Edit Booking
                </button>

                <button className="btn btn-secondary" onClick={() => setShowCancelModal(true)}>
                  <FaTimes /> Cancel Booking
                </button>
              </>
            )}

            {['picked_up','in_transit'].includes(booking.status.toLowerCase()) && (
              <button className="btn btn-primary" onClick={() => setShowLocationModal(true)}>
                <FaCar /> See Driver Location
              </button>
            )}

            <button className="btn btn-primary" onClick={() => navigate('/book-truck')}>
              <FaTruck /> Book Another Vehicle
            </button>
          </div>

          {/* LOCATION MODAL */}
          <LocationTrackingModal 
            booking={booking}
            isOpen={showLocationModal}
            onClose={() => setShowLocationModal(false)}
          />

          {/* EDIT BOOKING MODAL */}
          <EditBookingModal 
            booking={booking}
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSuccess={handleEditSuccess}
          />

          {/* ✅ CANCEL BOOKING MODAL */}
          {showCancelModal && (
  <div className="modal-overlay fade-in">
    <div className="modal-content scale-in">

      <h2>Cancel Booking</h2>

      <label className="modal-label">Select Reason</label>
      <select
        className="modal-select"
        value={cancelReason}
        onChange={(e) => setCancelReason(e.target.value)}
      >
        <option value="">-- Select Reason --</option>
        <option value="Not satisfied with the rates">Not satisfied with the rates</option>
        <option value="Do not need booking anymore">Do not need booking anymore</option>
        <option value="Others">Others</option>
      </select>

      {/* ✅ Smooth fade-in textarea */}
      <div className={`textarea-wrapper ${cancelReason === "Others" ? "show" : ""}`}>
        <textarea
          className="modal-textarea"
          placeholder="Enter your reason"
          value={customReason}
          onChange={(e) => setCustomReason(e.target.value)}
        />
      </div>

      <div className="modal-buttons">
        <button 
          className="btn btn-secondary"
          onClick={() => setShowCancelModal(false)}
        >
          Close
        </button>

        <button 
          className="btn btn-danger"
          onClick={handleSubmitCancellation}
          style={{color:'white'}}
        >
          Submit Cancellation
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
