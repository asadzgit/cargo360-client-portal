import React, { useState, useEffect } from 'react';
import { FaTimes, FaCar, FaMapMarkerAlt, FaSpinner, FaExternalLinkAlt } from 'react-icons/fa';
import { bookingAPI } from '../services/api';
import './LocationTrackingModal.css';

function LocationTrackingModal({ booking, isOpen, onClose }) {
  const [locationData, setLocationData] = useState(null);
  const [translatedAddress, setTranslatedAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && booking) {
      fetchDriverLocation();
    }
  }, [isOpen, booking]);

  const fetchDriverLocation = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await bookingAPI.getCurrentLocation(booking.id);
      const location = response.data;
      const address = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${location.currentLocation.latitude.toFixed(6)}&lon=${location.currentLocation.longitude.toFixed(6)}&apiKey=43b48c16d2084b809197aaa6db21d937`);
      const data = await address.json();
      console.log(data)
      const formatAddress = data.features[0].properties.formatted;
      setTranslatedAddress(formatAddress);
      setLocationData(location);
    } catch (err) {
      setError(err.message || 'Failed to fetch driver location');
    } finally {
      setLoading(false);
    }
  };

  const getGoogleMapsUrl = () => {
    if (!locationData?.currentLocation || !booking) return null;
    
    const { latitude, longitude } = locationData.currentLocation;
    const pickup = encodeURIComponent(booking.pickupLocation || '');
    const drop = encodeURIComponent(booking.dropLocation || '');
    
    // Create a multi-marker Google Maps URL with pickup, current location, and destination
    return `https://www.google.com/maps/dir/${pickup}/${latitude},${longitude}/${drop}`;
  };

  const getDirectionsUrl = () => {
    if (!booking) return null;
    
    const pickup = encodeURIComponent(booking.pickupLocation || '');
    const drop = encodeURIComponent(booking.dropLocation || '');
    
    if (locationData?.currentLocation) {
      const { latitude, longitude } = locationData.currentLocation;
      return `https://www.google.com/maps/dir/${pickup}/${latitude},${longitude}/${drop}`;
    }
    
    return `https://www.google.com/maps/dir/${pickup}/${drop}`;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content location-modal"
            style={{height: '80%'}}
            onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaCar /> Driver Location - #{booking.id}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          {loading && (
            <div className="loading-container">
              <FaSpinner className="loading-spinner" />
              <p>Fetching driver location...</p>
            </div>
          )}

          {error && (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button className="btn btn-secondary" onClick={fetchDriverLocation}>
                Retry
              </button>
            </div>
          )}

          {!loading && !error && locationData && (
            <div className="location-content">
              {locationData.currentLocation ? (
                <>
                  {/* Booking Info */}
                  <div className="booking-info">
                    <div className="info-card">
                      <h4>Booking Information</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Booking ID:</span>
                          <span className="value">#{booking.id}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Status:</span>
                          <span className="value status">{booking.status?.toUpperCase()}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Vehicle:</span>
                          <span className="value">{booking.vehicleType}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Route Information */}
                  <div className="route-info">
                    <h4>Route Information</h4>
                    <div className="route-details">
                      <div className="route-item pickup">
                        <div className="route-marker pickup-marker"></div>
                        <div>
                          <span className="label">Pickup Location</span>
                          <span className="location">{booking.pickupLocation}</span>
                        </div>
                      </div>
                      <div className="route-item drop">
                        <div className="route-marker drop-marker"></div>
                        <div>
                          <span className="label">Drop Location</span>
                          <span className="location">{booking.dropLocation}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Current Location */}
                  <div className="current-location">
                    <h4>Current Location</h4>
                    <div className="location-details">
                      <div className="driver-location">
                        <div className="driver-marker"></div>
                        <div>
                          <span className="label">Driver Location</span>
                          <span className="coordinates">
                            {translatedAddress}
                          </span>
                        </div>
                      </div>
                      
                      {locationData.currentLocation.driver && (
                        <div className="driver-info">
                          <h5>Driver Information</h5>
                          <div className="driver-details">
                            <div>Name: {locationData.currentLocation.driver.name}</div>
                            <div>Phone: {locationData.currentLocation.driver.phone}</div>
                          </div>
                        </div>
                      )}

                      <div className="location-stats">
                        {locationData.currentLocation.speed && (
                          <div className="stat">
                            <span className="label">Speed</span>
                            <span className="value">{locationData.currentLocation.speed} km/h</span>
                          </div>
                        )}
                        {locationData.currentLocation.heading && (
                          <div className="stat">
                            <span className="label">Heading</span>
                            <span className="value">{locationData.currentLocation.heading}°</span>
                          </div>
                        )}
                        <div className="stat">
                          <span className="label">Last Updated</span>
                          <span className="value">
                            {new Date(locationData.currentLocation.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {locationData.currentLocation.accuracy && (
                          <div className="stat">
                            <span className="label">Accuracy</span>
                            <span className="value">{locationData.currentLocation.accuracy}m</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Map Actions */}
                  <div className="map-actions">
                    {locationData?.currentLocation && (
                      <a
                        href={getGoogleMapsUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary map-btn"
                      >
                        <FaExternalLinkAlt /> View Complete Route with Current Location
                      </a>
                    )}
                    {/* <a
                      href={getDirectionsUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary map-btn"
                    >
                      <FaMapMarkerAlt /> View Directions Only
                    </a> */}
                  </div>
                </>
              ) : (
                <div className="no-location">
                  <FaMapMarkerAlt className="no-location-icon" />
                  <h4>No Location Data Available</h4>
                  <p>{locationData.message || 'The driver has not shared their location yet.'}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={fetchDriverLocation} disabled={loading}>
            Refresh Location
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocationTrackingModal;
