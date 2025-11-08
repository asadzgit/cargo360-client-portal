import React, { useState, useCallback, useEffect, useRef } from 'react';
import Select from 'react-select';
import { debounce } from 'lodash';

const LocationSelect = ({ 
  value, 
  onChange, 
  placeholder = "Search for a location...", 
  name,
  error,
  label 
}) => {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const autocompleteServiceRef = useRef(null);

  // Initialize Google Maps Autocomplete Service
  useEffect(() => {
    const initializeAutocomplete = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      } else {
        // Retry if Google Maps hasn't loaded yet
        setTimeout(initializeAutocomplete, 100);
      }
    };

    initializeAutocomplete();
  }, []);

  // Debounced function to search locations
  const searchLocations = useCallback(
    debounce((inputValue) => {
      if (!inputValue || inputValue.length < 3) {
        setOptions([]);
        return;
      }

      setIsLoading(true);

      // Fallback function using Nominatim (OpenStreetMap)
      const searchWithNominatim = async () => {
        try {
          console.log('Using Nominatim fallback for location search');
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputValue)}&limit=10&addressdetails=1`
          );
          const data = await response.json();
          
          const locationOptions = data.map(item => ({
            value: item.display_name,
            label: item.display_name,
            lat: item.lat,
            lon: item.lon,
            place_id: item.place_id
          }));
          
          setOptions(locationOptions);
          setIsLoading(false);
        } catch (error) {
          console.error('Nominatim fallback also failed:', error);
          setOptions([]);
          setIsLoading(false);
        }
      };

      // Try Google Maps first
      if (autocompleteServiceRef.current) {
        try {
          // Using Google Maps Places Autocomplete Service (no CORS issues)
          autocompleteServiceRef.current.getPlacePredictions(
            {
              input: inputValue,
              types: ['geocode']
            },
            (predictions, status) => {
              console.log('Google Maps response:', { status, predictions });
              
              if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                console.log('Google Maps success, predictions count:', predictions.length);
                const locationOptions = predictions.map(item => ({
                  value: item.description,
                  label: item.description,
                  place_id: item.place_id,
                  main_text: item.structured_formatting?.main_text,
                  secondary_text: item.structured_formatting?.secondary_text
                }));
                
                console.log('Mapped options:', locationOptions);
                setOptions(locationOptions);
                setIsLoading(false);
              } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                console.log('Google Maps returned zero results');
                setOptions([]);
                setIsLoading(false);
              } else {
                // Google Maps failed, use Nominatim fallback
                console.warn('Google Maps API error:', status, '- Falling back to Nominatim');
                searchWithNominatim();
              }
            }
          );
        } catch (error) {
          console.error('Error with Google Maps:', error, '- Falling back to Nominatim');
          searchWithNominatim();
        }
      } else {
        // Google Maps not initialized, use Nominatim fallback
        console.warn('Google Maps not initialized - Falling back to Nominatim');
        searchWithNominatim();
      }
    }, 300),
    []
  );

  const handleInputChange = (newInputValue, actionMeta) => {
    console.log('handleInputChange called:', { newInputValue, action: actionMeta.action });
    
    // Update input value state
    setInputValue(newInputValue);
    
    // Only search when user is typing, not when menu closes or input is cleared
    if (actionMeta.action === 'input-change') {
      if (newInputValue && newInputValue.length >= 3) {
        searchLocations(newInputValue);
      } else if (!newInputValue || newInputValue.length < 3) {
        setOptions([]);
      }
    }
    // Don't clear options on other actions like 'menu-close', 'set-value', etc.
  };

  const handleChange = (selectedOption) => {
    console.log('Option selected:', selectedOption);
    onChange(selectedOption ? selectedOption.value : '', name);
    // Clear input and options after selection
    if (selectedOption) {
      setInputValue('');
      setOptions([]);
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: error ? '#ef4444' : state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        borderColor: error ? '#ef4444' : '#3b82f6'
      },
      minHeight: '44px',
      fontSize: '16px'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#3b82f6' 
        : state.isFocused 
        ? '#eff6ff' 
        : 'white',
      color: state.isSelected ? 'white' : '#374151',
      padding: '12px 16px',
      fontSize: '14px'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af',
      fontSize: '16px'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#374151',
      fontSize: '16px'
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    })
  };

  const currentValue = value ? { value, label: value } : null;

  console.log('debug options', options);
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <Select
        value={currentValue}
        onChange={handleChange}
        onInputChange={handleInputChange}
        inputValue={inputValue}
        options={options}
        isLoading={isLoading}
        placeholder={placeholder}
        isClearable
        isSearchable
        styles={customStyles}
        noOptionsMessage={({ inputValue }) => 
          inputValue.length < 3 
            ? "Type at least 3 characters to search..." 
            : "No locations found"
        }
        loadingMessage={() => "Searching locations..."}
        onMenuClose={() => {
          // Don't clear options when menu closes
          console.log('Menu closed, keeping options');
        }}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default LocationSelect;
