import React, { useState, useEffect } from 'react';
import { FaTimes, FaTruck } from 'react-icons/fa';
import './VehicleTypeSelector.css';

/**
 * VehicleTypeSelector Component
 * 
 * Side modal that shows vehicle options based on selected category
 * Similar to LocationMapSelector pattern
 * 
 * Props:
 * @param {Boolean} isOpen - Whether selector is open
 * @param {Function} onClose - Callback when closed
 * @param {Function} onSelect - Callback when vehicle is selected (receives vehicle object)
 * @param {String} category - Selected category name (Mazda, Truck, Trailer, etc.)
 */
const VehicleTypeSelector = ({
  isOpen,
  onClose,
  onSelect,
  category = ''
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Vehicle data structure
  const vehicleData = {
    Suzuki: [
      { id: 'suzuki_vehicle', name: 'Suzuki', capacity: '50.0 kg – 800 kg' },
    ],
    Shehzore: [
      { id: 'shehzore_vehicle', name: 'Shehzore', capacity: '100.0 kg – 2.2 tons' },
    ],
    Mazda: [
      { id: 'mazda_mini_12_open', name: 'Mazda Mini 12\' Open', capacity: '500.0 kg – 5.0 tons' },
      { id: 'mazda_mini_14_open', name: 'Mazda Mini 14\' Open', capacity: '500.0 kg – 8.0 tons' },
      { id: 'mazda_mini_16_open', name: 'Mazda Mini 16\' Open', capacity: '500.0 kg – 8.0 tons' },
      { id: 'mazda_t3500_17_open', name: 'Mazda T3500 17\' Open', capacity: '500.0 kg – 8.0 tons' },
      { id: 'mazda_t3500_18_open', name: 'Mazda T3500 18\' Open', capacity: '500.0 kg – 8.0 tons' },
      { id: 'mazda_long_22_open', name: 'Mazda LONG 22\' Open', capacity: '500.0 kg – 6.0 tons' },
      { id: 'mazda_mini_16_container', name: 'Mazda Mini 16\' Container', capacity: '500.0 kg – 6.0 tons' },
      { id: 'mazda_t3500_17_container', name: 'Mazda T3500 17\' Container', capacity: '500.0 kg – 6.0 tons' },
      { id: 'mazda_t3500_18_container', name: 'Mazda T3500 18\' Container', capacity: '500.0 kg – 6.0 tons' },
      { id: 'mazda_t3500_20_container', name: 'Mazda T3500 20\' Container', capacity: '500.0 kg – 6.0 tons' },
      { id: 'mazda_long_22_container', name: 'Mazda LONG 22\' Container', capacity: '500.0 kg – 3.5 tons' },
      { id: 'mazda_long_24_container', name: 'Mazda LONG 24\' Container', capacity: '500.0 kg – 3.5 tons' },
      { id: 'mazda_long_26_container', name: 'Mazda LONG 26\' Container', capacity: '500.0 kg – 3.5 tons' },
      { id: 'mazda_long_32_container', name: 'Mazda LONG 32\' Container', capacity: '500.0 kg – 3.5 tons' },
      { id: 'mazda_long_34_container', name: 'Mazda LONG 34\' Container', capacity: '500.0 kg – 3.5 tons' },
    ],
    Truck: [
      { id: 'truck_6_wheeler_high_wall', name: 'Truck 6-Wheeler High wall', capacity: '4.0 tons – 12.0 tons' },
      { id: 'truck_6_wheeler_fb_hino', name: 'Truck 6-Wheeler FB Hino', capacity: '4.0 tons – 15.0 tons' },
      { id: 'truck_10_wheeler_high_wall', name: 'Truck 10-Wheeler High wall', capacity: '8.0 tons – 25.0 tons' },
    ],
    Trailer: [
      { id: 'trailer_20_feet', name: 'Trailer 20 Feet', capacity: '4.0 tons – 2.5 tons' },
      { id: 'trailer_30_feet', name: 'Trailer 30 feet', capacity: '6.0 tons – 30.0 tons' },
      { id: 'trailer_40_feet', name: 'Trailer 40 feet', capacity: '8.0 tons – 50.0 tons' },
      { id: 'trailer_42_feet', name: 'Trailer 42 feet', capacity: '10.0 tons – 50.0 tons' },
      { id: 'trailer_45_feet', name: 'Trailer 45 feet', capacity: '10.0 tons – 50.0 tons' },
      { id: 'trailer_20_feet_containerized', name: 'Trailer 20 feet Containerized', capacity: '3.0 tons – 25.0 tons' },
      { id: 'trailer_40_feet_containerized', name: 'Trailer 40 feet Containerized', capacity: '3.0 tons – 50.0 tons' },
      { id: 'trailer_44_feet_containerized', name: 'Trailer 44 feet Containerized', capacity: '8.0 tons – 45.0 tons' },
      { id: 'trailer_45_feet_containerized', name: 'Trailer 45 feet Containerized', capacity: '10.0 tons – 50.0 tons' },
      { id: 'trailer_50_feet_containerized', name: 'Trailer 50 feet containerized', capacity: '10.0 tons – 50.0 tons' },
      { id: 'trailer_16_feet_reefer_containerized', name: 'Trailer 16 feet Reefer Containerized', capacity: '' },
      { id: 'trailer_18_feet_reefer_containerized', name: 'Trailer 18 feet Reefer Containerized', capacity: '2.0 tons – 6.0 tons' },
      { id: 'trailer_20_feet_reefer_containerized', name: 'Trailer 20 feet Reefer Containerized', capacity: '5.0 tons – 2.5.0 tons' },
      { id: 'trailer_21_feet_reefer_containerized', name: 'Trailer 21 feet Reefer Containerized', capacity: '3.0 tons – 15.0 tons' },
      { id: 'trailer_40_feet_reefer_containerized', name: 'Trailer 40 feet Reefer Containerized', capacity: '8.0 tons – 40.0 tons' },
      { id: 'trailer_30_feet_low_bed', name: 'Trailer 30 feet Low Bed', capacity: '10.0 tons – 30.0 tons' },
      { id: 'trailer_40_feet_low_bed', name: 'Trailer 40 feet Low Bed', capacity: '20.0 tons – 60.0 tons' },
      { id: 'trailer_50_feet_semi_low_bed', name: 'Trailer 50 feet Semi Low Bed', capacity: '50.0 tons – 120.0 tons' },
      { id: 'trailer_52_low_bed', name: 'Trailer 52 Low Bed', capacity: '5.0 tons – 65.0 tons' },
      { id: 'trailer_55_feet_semi_low_bed', name: 'Trailer 55 feet Semi Low Bed', capacity: '50.0 tons – 120.0 tons' },
      { id: 'trailer_60_feet_semi_low_bed', name: 'Trailer 60 feet Semi Low Bed', capacity: '50.0 tons – 120.0 tons' },
      { id: 'trailer_70_feet_low_bed', name: 'Trailer 70 feet Low Bed', capacity: '5.0 tons – 85.0 tons' },
      { id: 'trailer_20_feet_flat_bed', name: 'Trailer 20 feet Flat Bed', capacity: '4.0 tons – 25.0 tons' },
      { id: 'trailer_40_feet_flat_bed', name: 'Trailer 40 feet Flat Bed', capacity: '3.0 tons – 50.0 tons' },
      { id: 'trailer_42_feet_flat_bed', name: 'Trailer 42 feet Flat Bed', capacity: '10.0 tons – 50.0 tons' },
      { id: 'trailer_52_feet_flat_bed', name: 'Trailer 52 feet Flat Bed', capacity: '10.0 tons – 50.0 tons' },
      { id: 'trailer_40_feet_half_body', name: 'Trailer 40 feet Half Body', capacity: '10.0 tons – 35.0 tons' },
      { id: 'trailer_42_feet_half_body', name: 'Trailer 42 feet Half Body', capacity: '10.0 tons – 35.0 tons' },
      { id: 'trailer_48_feet_half_body', name: 'Trailer 48 feet Half Body', capacity: '10.0 tons – 35.0 tons' },
      { id: 'trailer_50_feet_half_body', name: 'Trailer 50 feet Half Body', capacity: '10.0 tons – 35.0 tons' },
    ],
  };

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
      setSelectedVehicle(null);
    }
  }, [isOpen]);

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleConfirm = () => {
    if (selectedVehicle) {
      onSelect(selectedVehicle);
      onClose();
    }
  };

  if (!isOpen) return null;

  const vehicles = vehicleData[category] || [];

  // Reusable Close Button Component
  const CloseButton = () => (
    <button 
      className="vehicle-type-selector-close"
      onClick={onClose}
      aria-label="Close"
      type="button"
    >
      <FaTimes />
    </button>
  );

  // Mobile: Full screen modal
  if (isMobile) {
    return (
      <div className="vehicle-type-selector-mobile">
        <div className="vehicle-type-selector-overlay" onClick={onClose} />
        <div className="vehicle-type-selector-content-mobile">
          <div className="vehicle-type-selector-header">
            <h3>
              <FaTruck /> Select {category} Vehicle
            </h3>
            <CloseButton />
          </div>
          
          <div className="vehicle-type-selector-body">
            {vehicles.length === 0 ? (
              <div className="no-vehicles-message">
                <p>No vehicles available for {category}</p>
              </div>
            ) : (
              <div className="vehicle-list">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={`vehicle-item ${selectedVehicle?.id === vehicle.id ? 'selected' : ''}`}
                    onClick={() => handleVehicleSelect(vehicle)}
                  >
                    <div className="vehicle-item-content">
                      <h4>{vehicle.name}</h4>
                      {vehicle.capacity && (
                        <p className="vehicle-capacity">
                          <strong>Capacity:</strong> {vehicle.capacity}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="vehicle-type-selector-footer">
            {selectedVehicle && (
              <div className="selected-vehicle-preview">
                <FaTruck />
                <span>{selectedVehicle.name}</span>
              </div>
            )}
            <div className="vehicle-type-selector-actions">
              <button 
                className="btn-cancel"
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm"
                onClick={handleConfirm}
                disabled={!selectedVehicle}
              >
                Select Vehicle
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
      <div className="vehicle-type-selector-overlay-desktop" onClick={onClose} />
      <div className="vehicle-type-selector-drawer">
        <div className="vehicle-type-selector-header-desktop">
          <h4>
            <FaTruck /> Select {category} Vehicle
          </h4>
          <CloseButton />
        </div>
        
        <div className="vehicle-type-selector-body-desktop">
          {vehicles.length === 0 ? (
            <div className="no-vehicles-message">
              <p>No vehicles available for {category}</p>
            </div>
          ) : (
            <div className="vehicle-list">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={`vehicle-item ${selectedVehicle?.id === vehicle.id ? 'selected' : ''}`}
                  onClick={() => handleVehicleSelect(vehicle)}
                >
                  <div className="vehicle-item-content">
                    <h4>{vehicle.name}</h4>
                    {vehicle.capacity && (
                      <p className="vehicle-capacity">
                        <strong>Capacity:</strong> {vehicle.capacity}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="vehicle-type-selector-footer-desktop">
          {selectedVehicle && (
            <div className="selected-vehicle-preview">
              <FaTruck />
              <span>{selectedVehicle.name}</span>
            </div>
          )}
          <div className="vehicle-type-selector-actions">
            <button 
              className="btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="btn-confirm"
              onClick={handleConfirm}
              disabled={!selectedVehicle}
            >
              Select Vehicle
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleTypeSelector;

