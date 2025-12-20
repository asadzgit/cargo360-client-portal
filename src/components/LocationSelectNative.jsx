import React, { useEffect, useRef, useState } from 'react';

/**
 * LocationSelect component using Google Maps NEW PlaceAutocompleteElement
 * Uses the latest Google Maps API (recommended as of March 2025)
 */
const LocationSelectNative = ({ 
  value, 
  onChange, 
  placeholder = "Search for a location...", 
  name,
  error,
  label 
}) => {
  const containerRef = useRef(null);
  const autocompleteElementRef = useRef(null);
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    // Update input when value prop changes
    if (value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  useEffect(() => {
    const initializeAutocomplete = async () => {
      if (window.google && window.google.maps && window.google.maps.places && containerRef.current) {
        try {
          // Import the Places Library
          const { PlaceAutocompleteElement } = await window.google.maps.importLibrary("places");
          
          // Create the new PlaceAutocompleteElement
          const autocompleteElement = new PlaceAutocompleteElement({
            componentRestrictions: { country: ['pk'] }, // Restrict results to Pakistan only
            types: ['geocode'], // Only return geocoded locations
          });

          // Set placeholder
          autocompleteElement.placeholder = placeholder;

          // Add custom styling to match your form inputs
          autocompleteElement.style.width = '100%';
          autocompleteElement.style.height = '44px';
          autocompleteElement.style.fontSize = '16px';
          
          // Clear container and append the element
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(autocompleteElement);
          
          autocompleteElementRef.current = autocompleteElement;

          // Listen for place selection
          autocompleteElement.addEventListener('gmp-placeselect', async ({ place }) => {
            await place.fetchFields({
              fields: ['displayName', 'formattedAddress', 'location']
            });

            const selectedAddress = place.formattedAddress || place.displayName;
            setInputValue(selectedAddress);
            onChange(selectedAddress, name, {
              formatted_address: place.formattedAddress,
              name: place.displayName,
              geometry: {
                location: place.location
              }
            });
          });

          console.log('Google Places PlaceAutocompleteElement initialized (NEW API)');
        } catch (error) {
          console.error('Error initializing PlaceAutocompleteElement:', error);
          // Fallback: If new API fails, show a regular input
          containerRef.current.innerHTML = `
            <input 
              type="text" 
              class="form-input" 
              placeholder="${placeholder}"
              value="${value || ''}"
            />
          `;
        }
      } else {
        // Retry if Google Maps hasn't loaded yet
        setTimeout(initializeAutocomplete, 100);
      }
    };

    initializeAutocomplete();

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [name, onChange, placeholder]);

  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <div 
        ref={containerRef}
        className={error ? 'error' : ''}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default LocationSelectNative;

