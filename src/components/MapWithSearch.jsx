import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import './MapWithSearch.css';

/**
 * MapWithSearch Component
 * 
 * Features:
 * - Interactive Google Map with draggable marker
 * - Search box with autocomplete
 * - Returns selected location coordinates and address
 * 
 * Props:
 * @param {Function} onLocationSelect - Callback when location is selected
 *   Receives: { lat, lng, address, placeId }
 * @param {Object} initialLocation - Initial map center { lat, lng }
 * @param {String} initialAddress - Initial address string
 * @param {Number} height - Map height in pixels (default: 400)
 * @param {String} placeholder - Search box placeholder
 */
const MapWithSearch = ({
  onLocationSelect,
  initialLocation = { lat: 31.5204, lng: 74.3587 }, // Default: Lahore, Pakistan
  initialAddress = '',
  height = 400,
  placeholder = 'Search for a location...'
}) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);
  const searchInputRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [address, setAddress] = useState(initialAddress);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const isInitializedRef = useRef(false);

  // Initialize map (only once)
  useEffect(() => {
    if (window.google && window.google.maps && !map && !isInitializedRef.current) {
      isInitializedRef.current = true;
      
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: initialLocation,
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      });

      // Create initial marker
      const markerInstance = new window.google.maps.Marker({
        position: initialLocation,
        map: mapInstance,
        draggable: true,
        title: 'Drag to select location',
        animation: window.google.maps.Animation.DROP,
      });

      // Handle marker drag end
      markerInstance.addListener('dragend', () => {
        const position = markerInstance.getPosition();
        const lat = position.lat();
        const lng = position.lng();
        
        // Reverse geocode to get address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const newAddress = results[0].formatted_address;
            setAddress(newAddress);
            onLocationSelect?.({ lat, lng, address: newAddress, placeId: results[0].place_id });
          }
        });
      });

      // Handle map click to move marker
      mapInstance.addListener('click', (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        markerInstance.setPosition({ lat, lng });
        
        // Reverse geocode
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const newAddress = results[0].formatted_address;
            setAddress(newAddress);
            onLocationSelect?.({ lat, lng, address: newAddress, placeId: results[0].place_id });
          }
        });
      });

      setMap(mapInstance);
      setMarker(markerInstance);
      setIsMapReady(true);
    } else if (!window.google && !isInitializedRef.current) {
      // Retry if Google Maps hasn't loaded yet
      const timer = setTimeout(() => {
        if (window.google && window.google.maps && !isInitializedRef.current) {
          // Force re-render by resetting flag
          isInitializedRef.current = false;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [map, initialLocation, onLocationSelect]);

  // Initialize autocomplete
  useEffect(() => {
    if (isMapReady && searchInputRef.current && window.google && window.google.maps && window.google.maps.places && !autocomplete) {
      const autocompleteInstance = new window.google.maps.places.Autocomplete(
        searchInputRef.current,
        {
          // Remove types restriction to get all results (addresses, businesses, establishments, etc.)
          // types: ['geocode'], // Removed to get more comprehensive results
          fields: ['geometry', 'formatted_address', 'place_id', 'name', 'address_components'],
          // Optionally restrict to specific countries if needed
          // componentRestrictions: { country: ['pk'] }, // Uncomment to restrict to Pakistan only
        }
      );

      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        
        if (!place.geometry || !place.geometry.location) {
          console.warn('No details available for the selected place');
          return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const newAddress = place.formatted_address || address;

        // Update map center and marker position
        if (map) {
          map.setCenter({ lat, lng });
          map.setZoom(15);
        }

        if (marker) {
          marker.setPosition({ lat, lng });
        }

        setAddress(newAddress);
        onLocationSelect?.({
          lat,
          lng,
          address: newAddress,
          placeId: place.place_id,
        });
      });

      setAutocomplete(autocompleteInstance);
    }
  }, [isMapReady, map, marker, address, onLocationSelect, autocomplete]);

  // Update address when initialAddress changes
  useEffect(() => {
    if (initialAddress) {
      setAddress(initialAddress);
    }
  }, [initialAddress]);

  // Function to get current location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Update marker position
        if (marker) {
          marker.setPosition({ lat, lng });
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
          // Stop bounce after 2 seconds
          setTimeout(() => {
            if (marker) {
              marker.setAnimation(null);
            }
          }, 2000);
        }

        // Update map center and zoom
        if (map) {
          map.setCenter({ lat, lng });
          map.setZoom(15);
        }

        // Reverse geocode to get address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          setIsGettingLocation(false);
          
          if (status === 'OK' && results[0]) {
            const newAddress = results[0].formatted_address;
            setAddress(newAddress);
            onLocationSelect?.({
              lat,
              lng,
              address: newAddress,
              placeId: results[0].place_id,
            });
          } else {
            // If geocoding fails, still update with coordinates
            const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            setAddress(fallbackAddress);
            onLocationSelect?.({
              lat,
              lng,
              address: fallbackAddress,
              placeId: null,
            });
          }
        });
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = 'Failed to get your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting your location.';
            break;
        }
        
        setLocationError(errorMessage);
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [marker, map, onLocationSelect]);

  return (
    <div className="map-with-search-container">
      <div className="map-search-box">
        <input
          ref={searchInputRef}
          type="text"
          placeholder={placeholder}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="map-search-input"
        />
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isGettingLocation || !isMapReady}
          className="get-location-button"
          title="Get your current location"
        >
          {isGettingLocation ? (
            <>
              <FaSpinner className="spinner-icon" />
              <span>Locating...</span>
            </>
          ) : (
            <>
              <FaMapMarkerAlt />
              <span>My Location</span>
            </>
          )}
        </button>
      </div>
      {locationError && (
        <div className="location-error">
          <p>{locationError}</p>
          <button
            type="button"
            onClick={() => setLocationError(null)}
            className="error-close-button"
          >
            ×
          </button>
        </div>
      )}
      <div
        ref={mapRef}
        className="map-container"
        style={{ height: `${height}px` }}
      />
      <div className="map-instructions">
        <p>💡 Click on the map, drag the marker, or use "My Location" to select a location</p>
      </div>
    </div>
  );
};

export default MapWithSearch;

