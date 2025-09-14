import React, { useState } from 'react';
import {
  FaHome,
  FaBuilding,
  FaBoxes,
  FaAddressBook,
  FaUserTie,
  FaUser,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import logo from '../assets/cargo-360.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <style>{`
        /* Reset and base */
        * {
          box-sizing: border-box;
        }
        a {
          text-decoration: none;
          color: #6b7280;
        }
        button {
          background: none;
          border: none;
          cursor: pointer;
          font: inherit;
          color: inherit;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 6px;
          transition: background-color 0.3s ease;
        }
        button:hover,
        button:focus {
          background-color: #e5e7eb;
          outline: none;
        }

        nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 6rem;
          border-bottom: 1px solid var(--border-color, #d1d5db);
          background-color: white;
          z-index: 1000;
          display: flex;
          align-items: center;
          padding: 0 24px;
          justify-content: space-between;
        }

        .logo-container img {
          height: 8rem;
          margin: 1% 0;
          width: auto;
          user-select: none;
        }

        .links-container {
          display: flex;
          gap: 24px;
          align-items: center;
        }

        .tab-item {
          flex-direction: row;
        }

        .tab-icon {
          font-size: 20px;
        }

        .tab-label {
          font-size: 16px;
          font-weight: 500;
          white-space: nowrap;
        }

        /* Mobile menu button */
        .menu-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #6b7280;
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          nav {
            padding: 0 16px;
            height: 56px;
          }

          .logo-container img {
            height: 5rem;
          }

          .links-container {
            position: fixed;
            top: 56px;
            left: 0;
            right: 0;
            background-color: white;
            flex-direction: column;
            gap: 0;
            border-top: 1px solid var(--border-color, #d1d5db);
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            z-index: 999;
          }

          .links-container.open {
            max-height: 300px; /* enough to show all links */
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }

          .tab-item {
            width: 100%;
            justify-content: flex-start;
            padding: 12px 24px;
            border-bottom: 1px solid #e5e7eb;
          }

          .tab-item:last-child {
            border-bottom: none;
          }

          .tab-icon {
            font-size: 18px;
          }

          .tab-label {
            font-size: 18px;
          }

          .menu-toggle {
            display: block;
          }
        }
      `}</style>

      <nav>
        <div className="logo-container">
          <img src={logo} alt="logo" />
        </div>

        <button
          className="menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={toggleMenu}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`links-container ${menuOpen ? 'open' : ''}`}>
          <a href="/home" onClick={() => setMenuOpen(false)}>
            <button className="tab-item" type="button">
              <FaHome className="tab-icon" />
              <span className="tab-label">Home</span>
            </button>
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            <button className="tab-item" type="button">
              <FaBuilding className="tab-icon" />
              <span className="tab-label">About</span>
            </button>
          </a>
          <a href="#services" onClick={() => setMenuOpen(false)}>
            <button className="tab-item" type="button">
              <FaBoxes className="tab-icon" />
              <span className="tab-label">Services</span>
            </button>
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            <button className="tab-item" type="button">
              <FaAddressBook className="tab-icon" />
              <span className="tab-label">Contact Us</span>
            </button>
          </a>
          <a href="/book-truck" onClick={() => setMenuOpen(false)}>
            <button className="tab-item" type="button">
              <FaUser Tie className="tab-icon" />
              <span className="tab-label">Client Login</span>
            </button>
          </a>
        </div>
      </nav>
    </>
  );
};

export default Navbar;