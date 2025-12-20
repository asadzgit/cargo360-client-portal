import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaWeight, FaClock, FaPhone, FaUser, FaRoute, FaMoneyBill, FaClipboardCheck, FaTimes, FaCar, FaEdit, FaPlus, FaPrint } from 'react-icons/fa';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import LocationTrackingModal from '../components/LocationTrackingModal';
import EditBookingModal from '../components/EditBookingModal';
import { humanize } from '../utils/helpers';
import { bookingAPI } from '../services/api';
import {ClientFooter} from '../components/ClientFooter';
import Modal from '../components/Modal';
import './BookingDetailScreen.css';

// const PRINTABLE_STATUSES = ['confirmed', 'picked_up', 'in_transit', 'delivered', 'completed'];

function BookingDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchBooking, cancelBooking, loading, error } = useBooking();
  const { user } = useAuth();
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
  // const [invoiceGenerating, setInvoiceGenerating] = useState(false);

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
  
      try {
        const bookingData = await fetchBooking(id);
        setBooking(bookingData);
      } catch {}
    } catch (e) {
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
      
      try {
        const bookingData = await fetchBooking(id);
        setBooking(bookingData);
      } catch {}
      
      setShowConfirmModal(false);
      setAgreedToTerms(false);
      
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

  const formatDeliveryDate = (raw) => {
    if (!raw) return 'Not set';

    if (raw.includes?.('T')) {
      const parsedISO = new Date(raw);
      if (!Number.isNaN(parsedISO.getTime())) {
        return parsedISO.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
    }

    const [datePart, timePart] = raw.split(' ');
    const dateSegments = datePart?.split('/') || [];

    if (dateSegments.length !== 3) return 'Not set';

    const [dayStr, monthStr, yearStr] = dateSegments;
    const day = Number(dayStr);
    const month = Number(monthStr);
    const year = Number(yearStr);

    if ([day, month, year].some(Number.isNaN)) return 'Not set';

    let hours = 0;
    let minutes = 0;

    if (timePart) {
      const [hm, ampm] = timePart.split(/(AM|PM)/i).filter(Boolean);
      if (hm) {
        const [hr, min] = hm.split(':').map(Number);
        hours = Number.isNaN(hr) ? 0 : hr;
        minutes = Number.isNaN(min) ? 0 : min;
      }

      if (ampm) {
        const upper = ampm.toUpperCase();
        if (upper === 'PM' && hours !== 12) hours += 12;
        if (upper === 'AM' && hours === 12) hours = 0;
      }
    }

    const parsed = new Date(year, month - 1, day, hours, minutes);
    if (Number.isNaN(parsed.getTime())) return 'Not set';
    return parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (value, withTime = true) => {
    if (!value) return 'Not set';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Not set';
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    if (withTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    return parsed.toLocaleDateString('en-US', options);
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'PKR 0';
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return `PKR ${value}`;
    return `PKR ${numeric.toLocaleString('en-US')}`;
  };

  const getCustomerField = (bookingField, fallbackUserField, defaultText = '—') => {
    return bookingField || fallbackUserField || defaultText;
  };

  //code to print invoive
  // const generateInvoiceHTML = (currentBooking) => {
  //   const now = new Date();
  //   const invoiceId = `INV-${currentBooking.id}-${now.getTime()}`;
  //   const invoiceDate = now.toLocaleString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //   });
  //   const bookingDate = formatDateTime(currentBooking.createdAt, false);
  //   const deliveryDate = formatDeliveryDate(currentBooking.deliveryDate);
  //   const customerName = getCustomerField(currentBooking?.Customer?.name, user?.name, 'Valued Customer');
  //   const customerCompany = getCustomerField(currentBooking?.Customer?.company, user?.company);
  //   const customerEmail = getCustomerField(currentBooking?.Customer?.email, user?.email);
  //   const customerPhone = getCustomerField(currentBooking?.Customer?.phone, user?.phone);
  //   const driverName = currentBooking?.Trucker?.name || 'Pending Assignment';
  //   const driverPhone = currentBooking?.Trucker?.phone || 'Pending Assignment';
  //   const amountNumeric = Number(currentBooking?.budget) || 0;
  //   const amountWords = numberToWords(amountNumeric);

  //   return `
  //     <!DOCTYPE html>
  //     <html>
  //       <head>
  //         <title>Invoice ${invoiceId}</title>
  //         <style>
  //           body {
  //             font-family: 'Segoe UI', Arial, sans-serif;
  //             margin: 0;
  //             padding: 24px;
  //             color: #111827;
  //             background: #f3f4f6;
  //           }
  //           .invoice-container {
  //             max-width: 820px;
  //             margin: 0 auto;
  //             background: #ffffff;
  //             border-radius: 12px;
  //             padding: 32px;
  //             box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
  //           }
  //           .invoice-header {
  //             display: flex;
  //             justify-content: space-between;
  //             align-items: flex-start;
  //             border-bottom: 2px solid #e5e7eb;
  //             padding-bottom: 24px;
  //             margin-bottom: 24px;
  //           }
  //           .invoice-title {
  //             font-size: 28px;
  //             margin: 0;
  //             color: #111827;
  //           }
  //           .invoice-meta {
  //             text-align: right;
  //             font-size: 14px;
  //             color: #6b7280;
  //           }
  //           .section-title {
  //             font-size: 16px;
  //             font-weight: 600;
  //             margin-bottom: 8px;
  //             color: #111827;
  //           }
  //           .info-grid {
  //             display: grid;
  //             grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  //             gap: 16px;
  //             margin-bottom: 24px;
  //           }
  //           .info-card {
  //             background: #f9fafb;
  //             border-radius: 10px;
  //             padding: 16px;
  //             border: 1px solid #e5e7eb;
  //           }
  //           .info-card label {
  //             display: block;
  //             font-size: 12px;
  //             text-transform: uppercase;
  //             letter-spacing: 0.05em;
  //             color: #6b7280;
  //             margin-bottom: 4px;
  //           }
  //           .info-card span {
  //             font-size: 15px;
  //             font-weight: 600;
  //             color: #111827;
  //           }
  //           table {
  //             width: 100%;
  //             border-collapse: collapse;
  //             margin-top: 8px;
  //             margin-bottom: 16px;
  //           }
  //           th, td {
  //             padding: 12px 16px;
  //             border: 1px solid #e5e7eb;
  //             text-align: left;
  //           }
  //           th {
  //             background: #f3f4f6;
  //             font-size: 14px;
  //             letter-spacing: 0.03em;
  //             text-transform: uppercase;
  //             color: #6b7280;
  //           }
  //           tfoot td {
  //             font-size: 18px;
  //             font-weight: 700;
  //             background: #111827;
  //             color: #ffffff;
  //           }
  //           .footer-note {
  //             margin-top: 32px;
  //             font-size: 13px;
  //             color: #6b7280;
  //           }
  //           .amount-words {
  //             font-style: italic;
  //             margin-top: 4px;
  //             color: #374151;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="invoice-container">
  //           <div class="invoice-header">
  //             <div>
  //               <h1 class="invoice-title">Cargo360 Shipment Invoice</h1>
  //               <p style="margin: 4px 0 0; color: #4b5563;">Booking ID: C360-PK-${currentBooking.id}</p>
  //             </div>
  //             <div class="invoice-meta">
  //               <div><strong>Invoice #:</strong> ${invoiceId}</div>
  //               <div><strong>Date:</strong> ${invoiceDate}</div>
  //             </div>
  //           </div>

  //           <div class="info-grid">
  //             <div class="info-card">
  //               <label>Billed To</label>
  //               <span>${customerName}</span><br/>
  //               <span>${customerCompany}</span><br/>
  //               <span>${customerEmail}</span><br/>
  //               <span>${customerPhone}</span>
  //             </div>
  //             <div class="info-card">
  //               <label>Shipment Summary</label>
  //               <span>Route: ${currentBooking.pickupLocation} → ${currentBooking.dropLocation}</span><br/>
  //               <span>Vehicle: ${humanize(currentBooking.vehicleType)}</span><br/>
  //               <span>Cargo: ${humanize(currentBooking.cargoType)}</span><br/>
  //               <span>Weight: ${currentBooking.cargoWeight || 'N/A'} kg</span>
  //             </div>
  //             <div class="info-card">
  //               <label>Important Dates</label>
  //               <span>Booked: ${bookingDate}</span><br/>
  //               <span>Delivery: ${deliveryDate}</span><br/>
  //               <span>Status: ${humanize(currentBooking.status)}</span>
  //             </div>
  //           </div>

  //           <h3 class="section-title">Service Details</h3>
  //           <table>
  //             <thead>
  //               <tr>
  //                 <th>Description</th>
  //                 <th>Broker</th>
  //                 <th>Driver Contact</th>
  //                 <th>Amount</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               <tr>
  //                 <td>${humanize(currentBooking.vehicleType)} (${humanize(currentBooking.cargoType)})</td>
  //                 <td>${driverName}</td>
  //                 <td>${driverPhone}</td>
  //                 <td>${formatCurrency(amountNumeric)}</td>
  //               </tr>
  //             </tbody>
  //             <tfoot>
  //               <tr>
  //                 <td colspan="3">Grand Total</td>
  //                 <td>${formatCurrency(amountNumeric)}</td>
  //               </tr>
  //             </tfoot>
  //           </table>
  //           <div class="amount-words"><strong>Amount in words:</strong> ${amountWords}</div>

  //           <p class="footer-note">
  //             This invoice is generated for your confirmed Cargo360 shipment. Please retain a copy for your records.
  //             For any questions, contact support@cargo360.com.
  //           </p>
  //         </div>
  //       </body>
  //     </html>
  //   `;
  // };

  // const handlePrintInvoice = () => {
  //   if (!booking) return;
  //   if (typeof window === 'undefined') return;
  //   try {
  //     setInvoiceGenerating(true);
  //     const invoiceWindow = window.open('', '_blank', 'width=900,height=700');
  //     if (!invoiceWindow) {
  //       alert('Please allow pop-ups to print the invoice.');
  //       return;
  //     }
  //     invoiceWindow.document.write(generateInvoiceHTML(booking));
  //     invoiceWindow.document.close();
  //     invoiceWindow.focus();
  //     invoiceWindow.print();
  //     setTimeout(() => {
  //       invoiceWindow.close();
  //     }, 200);
  //   } finally {
  //     setInvoiceGenerating(false);
  //   }
  // };

  // const normalizedStatus = booking.status?.toLowerCase() || '';
  // const canPrintInvoice = Boolean(booking.budget) && PRINTABLE_STATUSES.includes(normalizedStatus);

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
                          <label>Broker</label>
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
                      <div className="info-item ">
                        <label>Cargo Description</label>
                        <value>{booking.description || "No description was given"}</value>
                      </div>
                      <div className='info-item'>
                        <label>Sales Tax Invoice:</label> 
                        <value>{booking.salesTax ? "Yes" : "No"}</value>
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

              {/* Booking Timeline */}
              <div className="detail-card">
                <div className="card-header">
                  <h3><FaCalendarAlt /> Booking Timeline</h3>
                </div>
                <div className="card-body">
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Booking Created</label>
                      <value>{formatDateTime(booking.createdAt)}</value>
                    </div>
                    <div className="info-item">
                      <label>Delivery Date</label>
                      <value>{formatDeliveryDate(booking.deliveryDate)}</value>

                      </div>
                    <div className="info-item">
                      <label>Last Updated</label>
                      <value>{formatDateTime(booking.updatedAt)}</value>
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
                      {/* Estimated Budget - Admin's Original Budget - Always show */}
                      <div className="price-item">
                        <label>Estimated Budget</label>
                        <value>PKR {parseFloat(booking.budget).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</value>
                      </div>

                      {/* Discount Request Section */}
                      {booking.DiscountRequest && booking.DiscountRequest.status === 'pending' && (
                        <div className="price-item" style={{color: '#fbbf24'}}>
                          <label>Your Requested Budget</label>
                          <value>PKR {parseFloat(booking.DiscountRequest.requestAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Pending)</value>
                        </div>
                      )}
                      
                      {/* When discount is accepted, show accepted amount and discount */}
                      {booking.DiscountRequest && booking.DiscountRequest.status === 'accepted' && booking.totalAmount && (
                        <div className="price-item" style={{borderBottom: 'none'}}>
                          <label>Accepted Discount Amount</label>
                          <value>PKR {parseFloat(booking.DiscountRequest.requestAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</value>
                        </div>
                      )}
                      
                      {booking.DiscountRequest && booking.DiscountRequest.status === 'rejected' && (
                        <div className="price-item" style={{color: '#ef4444'}}>
                          <label>Discount Request</label>
                          <value>PKR {parseFloat(booking.DiscountRequest.requestAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Rejected)</value>
                        </div>
                      )}

                      {/* Discount Request Input - Only show if no request exists or request was rejected */}
                      {(!booking.DiscountRequest || booking.DiscountRequest.status === 'rejected') && (
                        <div className='flex align-items-center gap-2' style={{marginTop: '16px', marginBottom: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)'}}>
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

                      {/* Total Budget - Show discount amount if discount accepted, otherwise show original budget */}
                      <div className="price-item total">
                        <label>Total Budget</label>
                        <value>PKR {booking.totalAmount 
                          ? (
                            parseFloat(booking.budget) - parseFloat(booking.totalAmount)
                          ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          : parseFloat(booking.budget).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        }</value>
                      </div>
                      
                      {/* Amount in words */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '16px',
                        paddingTop: '16px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'var(--accent-color)',
                        fontWeight: 600,
                        fontSize: '15px'
                      }}>
                        <span>Amount in words</span>
                        <span>{numberToWords(booking.totalAmount 
                          ? parseFloat(booking.budget) - parseFloat(booking.totalAmount)
                          : parseFloat(booking.budget)
                        )}</span>
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

            {['picked_up', 'in_transit'].includes(booking.status.toLowerCase()) && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowLocationModal(true)}
              >
                <FaCar /> See Driver Location
              </button>
            )}

            {/* {canPrintInvoice && (
              <button
                className="btn btn-secondary"
                onClick={handlePrintInvoice}
                disabled={invoiceGenerating}
              >
                <FaPrint /> {invoiceGenerating ? 'Preparing Invoice...' : 'Print Invoice'}
              </button>
            )} */}
            
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
            <div className="confirm-modal-overlay" onClick={() => setShowConfirmModal(false)}>
              <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-modal-header">
                  <h3 style={{color:'white'}}>
                    <FaClipboardCheck /> Confirm Your Order
                  </h3>
                  <button 
                    style={{color:'black'}}
                    className="confirm-modal-close"
                    onClick={() => {
                      setShowConfirmModal(false);
                      setAgreedToTerms(false);
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="confirm-modal-body">
                  <div className="order-summary-section">
                    <h4>Order Summary</h4>
                    
                    <div className="summary-grid">
                      <div className="summary-item">
                        <strong>Pickup Location:</strong>
                        <div className="summary-value">{booking.pickupLocation}</div>
                      </div>

                      <div className="summary-item">
                        <strong>Drop Off Location:</strong>
                        <div className="summary-value">{booking.dropLocation}</div>
                      </div>

                      <div className="summary-item">
                        <strong>Vehicle Type:</strong>
                        <div className="summary-value">{humanize(booking.vehicleType)}</div>
                      </div>
                      
                      <div className="summary-item">
                        <strong>Cargo Type:</strong>
                        <div className="summary-value">{humanize(booking.cargoType)}</div>
                      </div>
                    </div>

                    {booking.cargoWeight && (
                      <div className="summary-full-item">
                        <strong>Cargo Weight:</strong>
                        <div className="summary-value">
                          <FaWeight /> {booking.cargoWeight} kg
                        </div>
                      </div>
                    )}

                    <div className="budget-section">
                      <div className="budget-header">
                        <strong>Total Budget:</strong>
                        <strong className="budget-amount">
                          PKR {booking.totalAmount 
                            ? parseFloat(booking.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : parseFloat(booking.budget).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          }
                        </strong>
                      </div>
                      <p className="budget-words">
                        {numberToWords(booking.totalAmount ? parseFloat(booking.totalAmount) : parseFloat(booking.budget))}
                      </p>
                    </div>
                  </div>

                  <div className="notices-section">
                    <div className="important-notice">
                      <h5>Important Notice</h5>
                      <p>
                        By confirming this order, you agree that the above details and budget are correct. 
                        Once confirmed, a driver will be assigned to your shipment and you will be notified shortly.
                      </p>
                    </div>

                   {/* Replace this part in BookingDetailScreen JSX */}
<div className="terms-agreement">
  <h5>Terms & Conditions</h5>

  {/* New markup: input inside label for easier styling & accessibility */}
  <label className="terms-checkbox custom" htmlFor="agreeTerms">
    <input
      id="agreeTerms"
      type="checkbox"
      checked={agreedToTerms}
      onChange={(e) => setAgreedToTerms(e.target.checked)}
    />
    <span className="custom-box" aria-hidden="true"></span>
    <span className="terms-text">
      I confirm that all the details are correct and I agree to the terms and conditions.
      I understand that once confirmed, the order cannot be cancelled without charges.
    </span>
  </label>
</div>

                  </div>
                </div>

                <div className="confirm-modal-footer">
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
                    className="btn btn-primary confirm-order-btn"
                    onClick={handleConfirmOrder}
                    disabled={!agreedToTerms || confirmLoading}
                  >
                    {confirmLoading ? (
                      <span className="confirm-loading">
                        <div className="loading-spinner-small"></div>
                        Confirming...
                      </span>
                    ) : (
                      'Confirm Order'
                    )}
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