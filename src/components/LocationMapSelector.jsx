import React, { useState, useEffect } from 'react';
import { FaTimes, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';
import MapWithSearch from './MapWithSearch';
import './LocationMapSelector.css';

/**
 * LocationMapSelector Component
 * 
 * Responsive component that shows map in:
 * - Modal (full screen) on mobile
 * - Expandable section on desktop
 * 
 * Props:
 * @param {Boolean} isOpen - Whether selector is open
 * @param {Function} onClose - Callback when closed
 * @param {Function} onSelect - Callback when location is selected (receives { lat, lng, address, placeId })
 * @param {String} locationType - 'pickup' or 'drop' - for display purposes
 * @param {String} currentAddress - Current address value to show on map
 */
const LocationMapSelector = ({
  isOpen,
  onClose,
  onSelect,
  locationType = 'pickup',
  currentAddress = ''
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Detect mobile/desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedLocation(null);
    }
  }, [isOpen]);

  const handleLocationSelect = (locationData) => {
    setSelectedLocation(locationData);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelect(selectedLocation);
      onClose();
    }
  };

  if (!isOpen) return null;

  const locationLabel = locationType === 'pickup' ? 'Pickup' : 'Drop Off';
  const initialLocation = currentAddress 
    ? null // Will use geocoding if address provided
    : { lat: 31.5204, lng: 74.3587 }; // Default: Lahore

  // Mobile: Full screen modal
  if (isMobile) {
    return (
      <div className="location-map-selector-mobile">
        <div className="location-map-selector-overlay" onClick={onClose} />
        <div className="location-map-selector-content-mobile">
          <div className="location-map-selector-header">
            <h3>
              <FaMapMarkerAlt /> Select {locationLabel} Location
            </h3>
            <button 
              className="location-map-selector-close"
              onClick={onClose}
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="location-map-selector-body">
            <MapWithSearch
              onLocationSelect={handleLocationSelect}
              initialLocation={initialLocation}
              initialAddress={currentAddress}
              height={window.innerHeight - 200}
              placeholder={`Search for ${locationLabel.toLowerCase()} location...`}
            />
          </div>

          <div className="location-map-selector-footer">
            {selectedLocation && (
              <div className="selected-location-preview">
                <FaMapMarkerAlt />
                <span>{selectedLocation.address}</span>
              </div>
            )}
            <div className="location-map-selector-actions">
              <button 
                className="btn-cancel"
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm"
                onClick={handleConfirm}
                disabled={!selectedLocation}
              >
                <FaCheck /> Confirm Location
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop: Right-side drawer (like Material-UI)
  return (
    <>
      <div className="location-map-selector-overlay-desktop" onClick={onClose} />
      <div className="location-map-selector-drawer">
        <div className="location-map-selector-header-desktop">
          <h4>
            <FaMapMarkerAlt /> Select {locationLabel} Location
          </h4>
          <button 
            className="location-map-selector-close"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="location-map-selector-body-desktop">
          <MapWithSearch
            onLocationSelect={handleLocationSelect}
            initialLocation={initialLocation}
            initialAddress={currentAddress}
            height={500}
            placeholder={`Search for ${locationLabel.toLowerCase()} location...`}
          />
        </div>

        <div className="location-map-selector-footer-desktop">
          {selectedLocation && (
            <div className="selected-location-preview">
              <FaMapMarkerAlt />
              <span>{selectedLocation.address}</span>
            </div>
          )}
          <div className="location-map-selector-actions">
            <button 
              className="btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="btn-confirm"
              onClick={handleConfirm}
              disabled={!selectedLocation}
            >
              <FaCheck /> Use This Location
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationMapSelector;

