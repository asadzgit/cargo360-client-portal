import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

/**
 * WhatsApp Floating Button Component
 * 
 * Displays a floating WhatsApp button that links to the specified WhatsApp number.
 * To change the phone number, update the WHATSAPP_NUMBER constant below.
 * 
 * @param {string} phoneNumber - Optional. WhatsApp number in format: country code + number (e.g., "923337766609")
 * @param {string} message - Optional. Pre-filled message for WhatsApp
 * @param {string} className - Optional. Additional CSS classes
 */
function WhatsAppButton({ 
  phoneNumber = "923337766609", 
  message = "",
  className = "" 
}) {
  // Format the WhatsApp URL
  const whatsappUrl = message 
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`whatsapp-float ${className}`}
      aria-label="Contact us on WhatsApp"
    >
      <FaWhatsapp />
    </a>
  );
}

export default WhatsAppButton;
