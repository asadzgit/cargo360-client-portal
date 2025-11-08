import React from "react";
import { FaSquareEnvelope, FaSquarePhone } from "react-icons/fa6";
import { Link } from "react-router-dom";
export const ClientFooter = () => (
  <footer className="footer">
  <div className="footer-content">
    <p className="support-text">Contact support:</p>
    <div className="contact-info">
      <div className="contact-item">
        <span className="icon">✉️</span>
        <a href="mailto:info@cargo360pk.com">info@cargo360pk.com</a>
      </div>
      <div className="contact-item">
        <span className="icon">📞</span>
        <a href="tel:+923337766609">+92 333 7766609</a>
      </div>
    </div>
    <p className="copyright">© 2025 CARGO 360. All rights reserved.</p>
    <p><Link to="/privacy-policy" className="link">Privacy Policy</Link></p>
  </div>
</footer>

);