import React, { useState } from 'react';
import { FaHome, FaBuilding, FaBoxes, FaAddressBook, FaUserTie, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/cargo-360.png';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav
      className="tab-navigation"
      style={{
        top: 0,
        height: '72px',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div className="tab-container" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <div className="logo-container">
          <img src={logo} alt="logo" style={{ width: 120 }} />
        </div>

        {/* Hamburger icon for mobile */}
        <div className="mobile-menu-icon" onClick={toggleMenu}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

        {/* Links */}
        <div className={`links-container ${isOpen ? 'open' : ''}`}>
          <a href="/home">
            <button className="tab-item">
              <FaHome className="tab-icon" />
              <span className="tab-label">Home</span>
            </button>
          </a>
          <a href="#about">
            <button className="tab-item">
              <FaBuilding className="tab-icon" />
              <span className="tab-label">About</span>
            </button>
          </a>
          <a href="#services">
            <button className="tab-item">
              <FaBoxes className="tab-icon" />
              <span className="tab-label">Services</span>
            </button>
          </a>
          <a href="#contact">
            <button className="tab-item">
              <FaAddressBook className="tab-icon" />
              <span className="tab-label">Contact Us</span>
            </button>
          </a>
          <a href="/client-home">
            <button className="tab-item">
              <FaUserTie className="tab-icon" />
              <span className="tab-label">Client Login</span>
            </button>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
