import React from 'react';
import { FaTimes, FaPrint } from 'react-icons/fa';
import { humanize } from '../utils/helpers';
import { printInvoiceStyles } from './invoicePrintStyles';
import './InvoiceModal.css';

function InvoiceModal({ isOpen, onClose, booking, user }) {
  if (!isOpen || !booking) return null;

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
      return n.toString();
    };

    return numToWords(num) + " Only";
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

  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'PKR 0';
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return `PKR ${value}`;
    return `PKR ${numeric.toLocaleString('en-US')}`;
  };

  const getCustomerField = (bookingField, fallbackUserField, defaultText = '—') => {
    return bookingField || fallbackUserField || defaultText;
  };

  // Helper functions for generating HTML elements
  const createInfoItem = (label, value) => {
    if (!value) return '';
    return `<div class="info-item">
      <label>${label}</label>
      <span>${value}</span>
    </div>`;
  };

  const createCardSection = (title, items) => {
    const itemsHTML = items
      .map(item => createInfoItem(item.label, item.value))
      .filter(Boolean)
      .join('');
    
    return `<div class="card-section">
      <h3 class="section-title">${title}</h3>
      ${itemsHTML}
    </div>`;
  };

  const createAmountRow = (label, value, isTotal = false, isDiscount = false) => {
    const totalClass = isTotal ? ' total' : '';
    const discountClass = isDiscount ? ' discount' : '';
    return `<div class="amount-row${totalClass}">
      <span class="amount-label">${label}</span>
      <span class="amount-value${discountClass}">${value}</span>
    </div>`;
  };

  const createInvoiceHeader = (invoiceId, invoiceDate) => {
    return `<div class="invoice-header">
      <div>
        <h1 class="invoice-title">Cargo360 Shipment Invoice</h1>
        <p class="invoice-booking-id">Booking ID: C360-PK-${booking.id}</p>
      </div>
      <div class="invoice-meta">
        <div><strong>Invoice #:</strong> ${invoiceId}</div>
        <div><strong>Date:</strong> ${invoiceDate}</div>
      </div>
    </div>`;
  };

  const createCardsSection = (customerData, vehicleData, locationData) => {
    const customerCard = createCardSection('Customer Information', [
      { label: 'Name', value: customerData.name },
      { label: 'Company', value: customerData.company },
      { label: 'Email', value: customerData.email },
      { label: 'Phone', value: customerData.phone },
    ]);

    const vehicleCard = createCardSection('Vehicle Information', [
      { label: 'Vehicle Type', value: humanize(booking.vehicleType) },
      { label: 'Cargo Type', value: humanize(booking.cargoType) },
      { label: 'Cargo Weight (kg)', value: vehicleData.cargoWeight },
      { label: 'Cargo Description', value: vehicleData.description },
    ]);

    const locationCard = createCardSection('Location Details', [
      { label: 'Pickup Location', value: booking.pickupLocation },
      { label: 'Drop Off Location', value: booking.dropLocation },
      { label: 'Booking Date', value: locationData.bookingDate },
      { label: 'Delivery Date', value: locationData.deliveryDate },
      { label: 'Status', value: humanize(booking.status) },
    ]);

    return `<div class="three-card-layout">
      ${customerCard}
      ${vehicleCard}
      ${locationCard}
    </div>`;
  };

  const createServiceDetailsSection = (amountData) => {
    const amountRows = [
      createAmountRow('Estimated Amount:', formatCurrency(amountData.estimatedAmount)),
      amountData.discountAmount > 0 
        ? createAmountRow('Discount:', `-${formatCurrency(amountData.discountAmount)}`, false, true)
        : '',
      createAmountRow('Sales Tax Invoice:', amountData.isSalesTaxApplicable ? 'Yes' : 'No'),
      createAmountRow('Grand Total:', `${formatCurrency(amountData.finalAmount)} + sales Tax`, true),
    ].filter(Boolean).join('');

    return `<div class="service-details-section">
      <h3 class="section-title">Service Details</h3>
      <div class="amount-summary">
        ${amountRows}
      </div>
      <div class="amount-words">
        <strong>Amount in words:</strong> ${amountData.amountWords}
      </div>
    </div>`;
  };

  const generateInvoiceHTML = () => {
    // Calculate invoice metadata
    const now = new Date();
    const invoiceId = `INV-${booking.id}-${now.getTime()}`;
    const invoiceDate = now.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Prepare data
    const customerData = {
      name: getCustomerField(booking?.Customer?.name, user?.name, 'Valued Customer'),
      company: getCustomerField(booking?.Customer?.company, user?.company),
      email: getCustomerField(booking?.Customer?.email, user?.email),
      phone: getCustomerField(booking?.Customer?.phone, user?.phone),
    };

    const vehicleData = {
      cargoWeight: booking.cargoWeight ? `${booking.cargoWeight} kg` : null,
      description: booking.description,
    };

    const locationData = {
      bookingDate: formatDateTime(booking.createdAt, false),
      deliveryDate: formatDeliveryDate(booking.deliveryDate),
    };

    const estimatedAmount = Number(booking?.budget) || 0;
    const finalAmount = booking.totalAmount 
      ? parseFloat(booking.budget) - parseFloat(booking.totalAmount)
      : estimatedAmount;
    const discountAmount = booking.totalAmount ? parseFloat(booking.totalAmount) : 0;
    const isSalesTaxApplicable = booking?.salesTax === true || booking?.salesTax === 'true';

    const amountData = {
      estimatedAmount,
      finalAmount,
      discountAmount,
      isSalesTaxApplicable,
      amountWords: numberToWords(finalAmount),
    };

    // Build HTML sections
    const headerHTML = createInvoiceHeader(invoiceId, invoiceDate);
    const cardsHTML = createCardsSection(customerData, vehicleData, locationData);
    const serviceDetailsHTML = createServiceDetailsSection(amountData);

    // Assemble complete HTML document
    return `<!DOCTYPE html>
<html>
  <head>
    <title>Invoice ${invoiceId}</title>
    <style>${printInvoiceStyles}</style>
  </head>
  <body>
    <div class="invoice-container">
      ${headerHTML}
      ${cardsHTML}
      ${serviceDetailsHTML}
      <p class="footer-note">
        This invoice is generated for your confirmed Cargo360 shipment. Please retain a copy for your records.
        For any questions, contact info@cargo360pk.com.
      </p>
    </div>
  </body>
</html>`;
  };

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    try {
      const invoiceWindow = window.open('', '_blank', 'width=900,height=700');
      if (!invoiceWindow) {
        alert('Please allow pop-ups to print the invoice.');
        return;
      }
      invoiceWindow.document.write(generateInvoiceHTML());
      invoiceWindow.document.close();
      invoiceWindow.focus();
      invoiceWindow.print();
      setTimeout(() => {
        invoiceWindow.close();
      }, 200);
    } catch (error) {
      alert('Failed to print invoice. Please try again.');
    }
  };


  const now = new Date();
  const invoiceId = `INV-${booking.id}-${now.getTime()}`;
  const invoiceDate = now.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const bookingDate = formatDateTime(booking.createdAt, false);
  const deliveryDate = formatDeliveryDate(booking.deliveryDate);
  const customerName = getCustomerField(booking?.Customer?.name, user?.name, 'Valued Customer');
  const customerCompany = getCustomerField(booking?.Customer?.company, user?.company);
  const customerEmail = getCustomerField(booking?.Customer?.email, user?.email);
  const customerPhone = getCustomerField(booking?.Customer?.phone, user?.phone);
  const driverName = booking?.Trucker?.name || booking?.trucker?.name || 'Pending Assignment';
  const driverPhone = booking?.Trucker?.phone || booking?.trucker?.phone || 'Pending Assignment';
  const estimatedAmount = Number(booking?.budget) || 0;
  const finalAmount = booking.totalAmount 
    ? parseFloat(booking.budget) - parseFloat(booking.totalAmount)
    : estimatedAmount;
  const discountAmount = booking.totalAmount 
    ? parseFloat(booking.totalAmount) 
    : 0;
  const isSalesTaxApplicable = booking?.salesTax === true || booking?.salesTax === 'true';
  const amountNumeric = finalAmount;
  const amountWords = numberToWords(amountNumeric);

  return (
    <div
      className={`modal-overlay ${isOpen ? 'active' : ''}`}
      onClick={onClose}
    >
      <div
        className="modal-content invoice-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header invoice-modal-header">
          <h3>Cargo360 Shipment Invoice</h3>
          <div className="invoice-header-actions">
            <button 
              className="modal-close invoice-print-btn" 
              onClick={handlePrint}
              title="Print Invoice"
            >
              <FaPrint />
            </button>
            <button className="modal-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="modal-body invoice-modal-body">
          <div className="invoice-container-modal">
            <div className="invoice-header-modal">
              <div>
                <h1 className="invoice-title-modal">Cargo360 Shipment Invoice</h1>
                <p className="invoice-booking-id">Booking ID: C360-PK-{booking.id}</p>
              </div>
              <div className="invoice-meta-modal">
                <div><strong>Invoice #:</strong> {invoiceId}</div>
                <div><strong>Date:</strong> {invoiceDate}</div>
              </div>
            </div>

            {/* Three Card Layout */}
            <div className="invoice-four-card-layout">
              {/* Card 1: Customer Information */}
              <div className="invoice-card-section">
                <h3 className="invoice-card-section-title">Customer Information</h3>
                <div className="invoice-info-item">
                  <label>Name</label>
                  <span>{customerName}</span>
                </div>
                {customerCompany && (
                  <div className="invoice-info-item">
                    <label>Company</label>
                    <span>{customerCompany}</span>
                  </div>
                )}
                <div className="invoice-info-item">
                  <label>Email</label>
                  <span>{customerEmail}</span>
                </div>
                {customerPhone && (
                  <div className="invoice-info-item">
                    <label>Phone</label>
                    <span>{customerPhone}</span>
                  </div>
                )}
              </div>

              {/* Card 2: Vehicle Information */}
              <div className="invoice-card-section">
                <h3 className="invoice-card-section-title">Vehicle Information</h3>
                <div className="invoice-info-item">
                  <label>Vehicle Type</label>
                  <span>{humanize(booking.vehicleType)}</span>
                </div>
                <div className="invoice-info-item">
                  <label>Cargo Type</label>
                  <span>{humanize(booking.cargoType)}</span>
                </div>
                {booking.cargoWeight && (
                  <div className="invoice-info-item">
                    <label>Cargo Weight (kg)</label>
                    <span>{booking.cargoWeight} kg</span>
                  </div>
                )}
                {booking.description && (
                  <div className="invoice-info-item">
                    <label>Cargo Description</label>
                    <span>{booking.description}</span>
                  </div>
                )}
              </div>

              {/* Card 3: Location Details */}
              <div className="invoice-card-section">
                <h3 className="invoice-card-section-title">Location Details</h3>
                <div className="invoice-info-item">
                  <label>Pickup Location</label>
                  <span>{booking.pickupLocation}</span>
                </div>
                <div className="invoice-info-item">
                  <label>Drop Off Location</label>
                  <span>{booking.dropLocation}</span>
                </div>
                <div className="invoice-info-item">
                  <label>Booking Date</label>
                  <span>{bookingDate}</span>
                </div>
                <div className="invoice-info-item">
                  <label>Delivery Date</label>
                  <span>{deliveryDate}</span>
                </div>
                <div className="invoice-info-item">
                  <label>Status</label>
                  <span>{humanize(booking.status)}</span>
                </div>
              </div>
            </div>

            {/* Service Details - Amount Summary */}
            <div className="invoice-service-details-section">
              <h3 className="invoice-section-title">Service Details</h3>
              <div className="invoice-amount-summary">
                <div className="invoice-amount-row">
                  <span className="invoice-amount-label">Estimated Amount:</span>
                  <span className="invoice-amount-value">{formatCurrency(estimatedAmount)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="invoice-amount-row">
                    <span className="invoice-amount-label">Discount:</span>
                    <span className="invoice-amount-value discount">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="invoice-amount-row">
                  <span className="invoice-amount-label">Sales Tax Invoice:</span>
                  <span className="invoice-amount-value">{isSalesTaxApplicable ? 'Yes' : 'No'}</span>
                </div>
                <div className="invoice-amount-row total">
                  <span className="invoice-amount-label">Grand Total:</span>
                  <span className="invoice-amount-value">{formatCurrency(finalAmount)} + sales Tax</span>
                </div>
              </div>
              <div className="invoice-amount-words">
                <strong>Amount in words:</strong> {amountWords}
              </div>
            </div>

            <p className="invoice-footer-note">
              This invoice is generated for your confirmed Cargo360 shipment. Please retain a copy for your records.
              For any questions, contact info@cargo360pk.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceModal;
