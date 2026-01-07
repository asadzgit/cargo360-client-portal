import React, { useState } from 'react';
import MapWithSearch from '../components/MapWithSearch';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import './MapTestScreen.css';

function MapTestScreen() {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);

  const handleLocationSelect = (locationData) => {
    console.log('Location selected:', locationData);
    setSelectedLocation(locationData);
    
    // Add to history
    setLocationHistory(prev => [locationData, ...prev.slice(0, 4)]);
  };

  const clearSelection = () => {
    setSelectedLocation(null);
  };

  return (
    <div className="map-test-screen">
      <div className="map-test-header">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft /> Back
        </button>
        <h1>Map with Search - Test Page</h1>
      </div>

      <div className="map-test-content">
        <div className="map-test-section">
          <h2>Interactive Map Component</h2>
          <p className="test-description">
            Test the map component with draggable marker and location search.
            Try searching for a location, clicking on the map, or dragging the marker.
          </p>

          <MapWithSearch
            onLocationSelect={handleLocationSelect}
            initialLocation={{ lat: 31.5204, lng: 74.3587 }} // Lahore, Pakistan
            height={500}
            placeholder="Search for a location (e.g., 'Lahore', 'Karachi', 'Islamabad')..."
          />
        </div>

        {selectedLocation && (
          <div className="location-info-card">
            <div className="location-info-header">
              <FaCheckCircle className="success-icon" />
              <h3>Selected Location</h3>
              <button className="clear-button" onClick={clearSelection}>
                Clear
              </button>
            </div>
            
            <div className="location-details">
              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{selectedLocation.address}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Latitude:</span>
                <span className="detail-value">{selectedLocation.lat.toFixed(6)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Longitude:</span>
                <span className="detail-value">{selectedLocation.lng.toFixed(6)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Place ID:</span>
                <span className="detail-value small">{selectedLocation.placeId || 'N/A'}</span>
              </div>
            </div>

            <div className="location-actions">
              <button 
                className="action-button"
                onClick={() => {
                  navigator.clipboard.writeText(selectedLocation.address);
                  alert('Address copied to clipboard!');
                }}
              >
                Copy Address
              </button>
              <button 
                className="action-button"
                onClick={() => {
                  navigator.clipboard.writeText(`${selectedLocation.lat}, ${selectedLocation.lng}`);
                  alert('Coordinates copied to clipboard!');
                }}
              >
                Copy Coordinates
              </button>
              <a
                href={`https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="action-button link-button"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        )}

        {locationHistory.length > 0 && (
          <div className="location-history-card">
            <h3>Recent Selections</h3>
            <div className="history-list">
              {locationHistory.map((location, index) => (
                <div key={index} className="history-item">
                  <FaMapMarkerAlt className="history-icon" />
                  <div className="history-content">
                    <div className="history-address">{location.address}</div>
                    <div className="history-coords">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </div>
                  </div>
                  <button
                    className="history-select-button"
                    onClick={() => setSelectedLocation(location)}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="test-instructions">
          <h3>Test Instructions</h3>
          <ul>
            <li>✅ Type in the search box to see autocomplete suggestions</li>
            <li>✅ Click on any suggestion to move the marker</li>
            <li>✅ Click anywhere on the map to place the marker</li>
            <li>✅ Drag the red marker to a new location</li>
            <li>✅ Watch the address update automatically</li>
            <li>✅ Check the console for location data logs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MapTestScreen;

