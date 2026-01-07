/**
 * Example usage of MapWithSearch component
 * 
 * This file shows how to use the MapWithSearch component in your app
 */

import React, { useState } from 'react';
import MapWithSearch from './MapWithSearch';

function ExampleUsage() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationSelect = (locationData) => {
    console.log('Location selected:', locationData);
    // locationData contains: { lat, lng, address, placeId }
    setSelectedLocation(locationData);
    
    // You can use this data to update your form or state
    // Example:
    // setFormData({
    //   ...formData,
    //   pickupLocation: locationData.address,
    //   pickupLat: locationData.lat,
    //   pickupLng: locationData.lng,
    // });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Map with Search Example</h2>
      
      <MapWithSearch
        onLocationSelect={handleLocationSelect}
        initialLocation={{ lat: 31.5204, lng: 74.3587 }} // Lahore, Pakistan
        height={500}
        placeholder="Search for pickup location..."
      />

      {selectedLocation && (
        <div style={{ marginTop: '20px', padding: '16px', background: '#f3f4f6', borderRadius: '8px' }}>
          <h3>Selected Location:</h3>
          <p><strong>Address:</strong> {selectedLocation.address}</p>
          <p><strong>Latitude:</strong> {selectedLocation.lat}</p>
          <p><strong>Longitude:</strong> {selectedLocation.lng}</p>
          <p><strong>Place ID:</strong> {selectedLocation.placeId}</p>
        </div>
      )}
    </div>
  );
}

export default ExampleUsage;

