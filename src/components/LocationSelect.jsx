import React, { useState, useCallback } from 'react';
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

  // Debounced function to search locations
  const searchLocations = useCallback(
    debounce(async (inputValue) => {
      if (!inputValue || inputValue.length < 3) {
        setOptions([]);
        return;
      }

      setIsLoading(true);
      try {
        // Using Nominatim (OpenStreetMap) free geocoding API
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputValue)}&countrycodes=pk&limit=10&addressdetails=1`
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
      } catch (error) {
        console.error('Error fetching locations:', error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleInputChange = (inputValue) => {
    searchLocations(inputValue);
  };

  const handleChange = (selectedOption) => {
    onChange(selectedOption ? selectedOption.value : '', name);
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

  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <Select
        value={currentValue}
        onChange={handleChange}
        onInputChange={handleInputChange}
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
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default LocationSelect;
