import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTruck, FaClipboardList, FaUser, FaHome, FaIdBadge, FaFileAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './TabNavigation.css';

function TabNavigation() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { path: '/client-home', icon: FaHome, label: 'Home' },
    { path: '/book-truck', icon: FaTruck, label: 'Book Truck' },
    { path: '/bookings', icon: FaClipboardList, label: 'My Bookings' },
    { path: '/clearance', icon: FaFileAlt, label: 'Clearance' },
    { path: '/profile', icon: FaIdBadge, label: 'Profile' },
  ];

  const defaultTabs = [
    { path: '/home', icon: FaHome, label: 'Home' },
    { path: '/client-home', icon: FaUser, label: 'Client Area Login' },
  ];

  const selectedTabs = user ? tabs : defaultTabs;

  return (
    <>
      {user ? (
        <nav className="tab-navigation">
          <div className="tab-container">
            {selectedTabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) => 
                  `tab-item ${isActive ? 'active' : ''}`
                }
              >
                <tab.icon className="tab-icon" />
                <span className="tab-label">{tab.label}</span>
              </NavLink>
            ))}
            
            <button onClick={handleLogout} className="tab-item logout-tab">
              <FaUser className="tab-icon" />
              <span className="tab-label">Logout</span>
            </button>
          </div>
        </nav>
      ) : (
        <div></div>
      )}
    </>
  );
}

export default TabNavigation;