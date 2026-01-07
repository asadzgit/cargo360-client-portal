import React, { useState, useEffect } from 'react';
import { FaTimes, FaTruck, FaMapMarkerAlt, FaWeight, FaClipboardList, FaCheckCircle } from 'react-icons/fa';
import { useBooking } from '../context/BookingContext';
import LocationSelect from './LocationSelect';
import LocationMapSelector from './LocationMapSelector';
import './EditBookingModal.css';

function EditBookingModal({ booking, isOpen, onClose, onSuccess }) {
  const { updateBooking, loading } = useBooking();
  const [formData, setFormData] = useState({
    vehicleType: '',
    cargoType: '',
    pickupLocation: '',
    dropLocation: '',
    cargoWeight: '',
    cargoSize: '',
    description: '',
    budget: '',
    customVehicleType: '',
    insurance: false,   
    salesTax: false,
    clearingAgentNum: ''
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [mapSelectorOpen, setMapSelectorOpen] = useState({ pickup: false, drop: false });
  const [mapSelectorType, setMapSelectorType] = useState('pickup');

  // Vehicle types (same as BookTruckScreen)
  const vehicleTypes = [
    { id: 'shahzor_9ft_open', name: 'Shahzor-9Ft Open', capacity: 'Up to 1.5 tons' },
    { id: 'mazda_12_14ft', name: 'Mazda- 12/14 Ft', capacity: 'Up to 3 tons' },
    { id: 'mazda_16_17_18ft_open', name: 'Mazda-16/17/18 Ft Open', capacity: 'Up to 5 tons' },
    { id: 'mazda_19_20ft_open', name: 'Mazda-19/20Ft Open', capacity: 'Up to 6 tons' },
    { id: 'mazda_flat_bed_25x8', name: 'Mazda Flat Bed-25 x 8 (LHR only)', capacity: 'Up to 8 tons' },
    { id: 'mazda_14_16_containerized', name: 'Mazda-14/16(Containerized)', capacity: 'Up to 4 tons' },
    { id: 'mazda_17ft_containerized', name: 'Mazda-17Ft (Containerized)', capacity: 'Up to 5 tons' },
    { id: 'flat_bed_20ft_6wheeler', name: 'Flat Bed-20Ft (6 Wheeler)', capacity: 'Up to 10 tons' },
    { id: 'flat_bed_40ft_14wheeler', name: 'Flat Bed-40Ft (14 Wheeler)', capacity: 'Up to 25 tons' },
    { id: 'boom_truck_16ft', name: 'Boom Truck-16Ft', capacity: 'Up to 5 tons' },
    { id: 'container_20ft_standard', name: '20Ft Container-Standard', capacity: 'Up to 20 tons' },
    { id: 'container_40ft_standard', name: '40Ft Container- Standard', capacity: 'Up to 30 tons' },
    { id: 'wheeler_22_half_body', name: '22 Wheeler (Half Body)', capacity: 'Up to 35 tons' },
    { id: 'mazda_12ton', name: 'Mazda - 12Ton', capacity: 'Up to 12 tons' },
    { id: 'wheeler_10_open_body', name: '10 Wheeler Open Body', capacity: 'Up to 15 tons' },
    { id: 'flat_bed_40ft_18wheeler', name: 'Flat Bed-40Ft (18 Wheeler)', capacity: 'Up to 30 tons' },
    { id: 'flat_bed_40ft_22wheeler', name: 'Flat Bed-40Ft (22 Wheeler)', capacity: 'Up to 35 tons' },
    { id: 'low_bed_25ft_10wheeler', name: 'Low Bed- 25Ft (10 wheeler)', capacity: 'Up to 20 tons' },
    { id: 'single_hino_6wheeler', name: 'Single Hino (6 Wheeler) [6 Natti]', capacity: 'Up to 8 tons' },
    { id: 'mazda_20ft_containerized', name: 'Mazda-20Ft (Containerized)', capacity: 'Up to 6 tons' },
    { id: 'mazda_22ft_containerized', name: 'Mazda-22Ft (Containerized)', capacity: 'Up to 7 tons' },
    { id: 'container_40ft_hc', name: '40Ft HC Container', capacity: 'Up to 30 tons' },
    { id: 'low_bed_40ft_22wheeler', name: 'Low Bed- 40Ft (22 wheeler)', capacity: 'Up to 40 tons' },
    { id: 'mazda_32ft_container', name: 'Mazda - 32Ft Container (Punjab&KPK)', capacity: 'Up to 10 tons' },
    { id: 'shahzor_9ft_container', name: 'Shahzor- 9ft Container', capacity: 'Up to 1.5 tons' },
    { id: 'ravi_pickup_open', name: 'Ravi Pick Up (Open)', capacity: 'Up to 1 ton' },
    { id: 'dumper_10wheeler', name: 'Dumper - 10 Wheeler', capacity: 'Up to 15 tons' },
    { id: 'trailer_40ft_single', name: '40Ft single Trailer', capacity: 'Up to 30 tons' },
    { id: 'trailer_40ft_double_20', name: '40Ft - Double 20 Trailer', capacity: 'Up to 40 tons' },
    { id: 'truck_20ft_single', name: '20Ft Single Truck', capacity: 'Up to 10 tons' },
    { id: 'low_bed_30ft_10wheeler', name: 'Low Bed- 30Ft (10 wheeler)', capacity: 'Up to 25 tons' },
    { id: 'mazda_17ft_container', name: '17Ft Mazda Container', capacity: 'Up to 5 tons' },
    { id: 'mazda_24ft_container', name: '24Ft Mazda Container', capacity: 'Up to 8 tons' },
    { id: 'mazda_16_18ft_tow_truck', name: 'Mazda 16/18Ft Tow Truck', capacity: 'Up to 5 tons' },
    { id: 'mazda_26ft_container', name: 'Mazda 26Ft Container', capacity: 'Up to 9 tons' },
    { id: 'crane_25ton', name: 'Crane -25 Ton', capacity: 'Up to 25 tons' },
    { id: 'container_50ft_hc', name: '50ft HC Container', capacity: 'Up to 35 tons' },
    { id: 'container_45ft_hc', name: '45ft HC Container', capacity: 'Up to 32 tons' },
    { id: 'container_20ft_reefer', name: '20Ft Reefer Container', capacity: 'Up to 20 tons' },
    { id: 'other', name: 'Other (Please Specify)', capacity: 'Custom' }
  ];

  // Populate form with booking data when modal opens
  useEffect(() => {
    if (isOpen && booking) {
      // Check if vehicleType is a custom one (not in predefined list)
      const isCustomVehicle = !vehicleTypes.find(v => v.id === booking.vehicleType);
      
      setFormData({
        vehicleType: isCustomVehicle ? 'other' : booking.vehicleType,
        cargoType: booking.cargoType || '',
        pickupLocation: booking.pickupLocation || '',
        dropLocation: booking.dropLocation || '',
        cargoWeight: booking.cargoWeight || '',
        cargoSize: booking.cargoSize || '',
        description: booking.description || '',
        budget: booking.budget || '',
        customVehicleType: isCustomVehicle ? booking.vehicleType : '',
        numContainers: booking.numContainers !== undefined && booking.numContainers !== null ? booking.numContainers : '',
        insurance: booking.insurance || false,
        salesTax: booking.salesTax || false,
        clearingAgentNum: booking.clearingAgentNum || ''
      });
      setErrors({});
      setShowSuccess(false);
    }
  }, [isOpen, booking]);

  const selectedVehicle = vehicleTypes.find(v => v.id === formData.vehicleType);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "numContainers") {
    if (value && parseInt(value) > 100) {
      setErrors(prev => ({
        ...prev,
        numContainers: "Number cannot exceed 100"
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        numContainers: ""
      }));
    }
  }

    // ✅ Special validation for clearingAgentNum - only digits, max 11
    if (name === "clearingAgentNum") {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, "");
      // Limit to 11 digits
      const limitedValue = digitsOnly.slice(0, 11);
      
      // Validate length if user has entered something
      if (limitedValue && limitedValue.length !== 11) {
        setErrors(prev => ({
          ...prev,
          clearingAgentNum: "Clearing agent number must be exactly 11 digits"
        }));
      } else if (limitedValue && limitedValue.length === 11) {
        setErrors(prev => ({ ...prev, clearingAgentNum: "" }));
      } else {
        setErrors(prev => ({ ...prev, clearingAgentNum: "" }));
      }

      setFormData(prev => ({
        ...prev,
        [name]: limitedValue,
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If vehicle type changes and it's not 'other', clear custom vehicle type
    if (name === 'vehicleType' && value !== 'other') {
      setFormData(prev => ({
        ...prev,
        vehicleType: value,
        customVehicleType: ''
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleOpenMapSelector = (type) => {
    setMapSelectorType(type);
    setMapSelectorOpen({ pickup: type === 'pickup', drop: type === 'drop' });
  };

  const handleCloseMapSelector = () => {
    setMapSelectorOpen({ pickup: false, drop: false });
  };

  const handleMapLocationSelect = (locationData) => {
    const fieldName = mapSelectorType === 'pickup' ? 'pickupLocation' : 'dropLocation';
    handleLocationChange(locationData.address, fieldName);
  };

  const handleLocationChange = (value, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user selects location
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.vehicleType) newErrors.vehicleType = 'Please select a vehicle type';
    if (formData.vehicleType === 'other' && !formData.customVehicleType) {
      newErrors.customVehicleType = 'Please specify the vehicle type';
    }
    if (!formData.cargoType) newErrors.cargoType = 'Please enter cargo type';
    if (!formData.pickupLocation) newErrors.pickupLocation = 'Please enter pickup location';
    if (!formData.dropLocation) newErrors.dropLocation = 'Please enter delivery location';
    
    if (formData.pickupLocation === formData.dropLocation) {
      newErrors.dropLocation = 'Delivery location must be different from pickup location';
    }
    
    if (formData.pickupLocation && formData.pickupLocation.length < 5) {
      newErrors.pickupLocation = 'Pickup location must be at least 5 characters';
    }
    
    if (formData.dropLocation && formData.dropLocation.length < 5) {
      newErrors.dropLocation = 'Delivery location must be at least 5 characters';
    }

    // ✅ Make these required:
    if (!formData.cargoWeight) newErrors.cargoWeight = 'Please enter cargo weight';
    if (!formData.cargoSize) newErrors.cargoSize = 'Please enter cargo size';
    if (!formData.budget) newErrors.budget = 'Please enter budget';

    // ✅ No. of Containers/Vehicles required + Limit check
    if (!formData.numContainers) {
      newErrors.numContainers = 'Please enter number of containers/vehicles';
    } else if (isNaN(parseInt(formData.numContainers))) {
      newErrors.numContainers = 'Please enter a valid number';
    } else if (parseInt(formData.numContainers) > 100) {
      newErrors.numContainers = 'Number cannot exceed 100';
    }

    // ✅ Clearing Agent Number validation - must be exactly 11 digits if provided
    if (formData.clearingAgentNum) {
      const digitsOnly = formData.clearingAgentNum.replace(/\D/g, "");
      if (digitsOnly.length !== 11) {
        newErrors.clearingAgentNum = "Clearing agent number must be exactly 11 digits";
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      const updateData = {
        vehicleType: formData.vehicleType === 'other' ? formData.customVehicleType : formData.vehicleType,
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.dropLocation,
        cargoType: formData.cargoType,
        description: formData.description,
        cargoWeight: formData.cargoWeight ? parseFloat(formData.cargoWeight) : undefined,
        cargoSize: formData.cargoSize || undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        numContainers: formData.numContainers ? parseInt(formData.numContainers, 10) : undefined,
        insurance: formData.insurance, 
        salesTax: formData.salesTax,
        clearingAgentNum: formData.clearingAgentNum && formData.clearingAgentNum.trim() 
          ? formData.clearingAgentNum.trim() 
          : undefined
      };

      await updateBooking(booking.id, updateData);
      setShowSuccess(true);
      
      // Close modal and refresh data after delay
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
      
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content edit-booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaTruck /> Edit Booking C360-PK-{booking?.id}
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {showSuccess ? (
          <div className="success-message">
            <FaCheckCircle className="success-icon" />
            <h4>Booking Updated Successfully!</h4>
            <p>Your booking has been updated. Closing modal...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="edit-booking-form">
            {/* Vehicle Type Selection */}
            <div className="form-section">
              <h4><FaTruck /> Vehicle Information</h4>
              <div className="form-group">
                <label className="form-label">Vehicle Type *</label>
                <select
                  name="vehicleType"
                  className={`form-select ${errors.vehicleType ? 'error' : ''}`}
                  value={formData.vehicleType}
                  onChange={handleChange}
                >
                  <option value="">Select vehicle type</option>
                  {vehicleTypes.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} - {vehicle.capacity}
                    </option>
                  ))}
                </select>
                {errors.vehicleType && <div className="form-error">{errors.vehicleType}</div>}
              </div>

              {/* Custom Vehicle Type Input */}
              {formData.vehicleType === 'other' && (
                <div className="form-group">
                  <label className="form-label">Please Specify Vehicle Type *</label>
                  <input
                    type="text"
                    name="customVehicleType"
                    className={`form-input ${errors.customVehicleType ? 'error' : ''}`}
                    value={formData.customVehicleType}
                    onChange={handleChange}
                    placeholder="Please specify other vehicle type"
                  />
                  {errors.customVehicleType && <div className="form-error">{errors.customVehicleType}</div>}
                </div>
              )}

              {selectedVehicle && formData.vehicleType !== 'other' && (
                <div className="vehicle-details">
                  <h5>{selectedVehicle.name}</h5>
                  <p><strong>Capacity:</strong> {selectedVehicle.capacity}</p>
                </div>
              )}
            </div>

            {/* Location Information */}
            <div className="form-section">
              <h4><FaMapMarkerAlt /> Location Details</h4>
              <div className="location-fields">
                <div className="location-input-wrapper">
                  <LocationSelect
                    label="Pickup Location *"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleLocationChange}
                    placeholder="Search for pickup location..."
                    error={errors.pickupLocation}
                  />
                  <button
                    type="button"
                    className="map-selector-button"
                    onClick={() => handleOpenMapSelector('pickup')}
                    title="Select pickup location on map"
                  >
                    <FaMapMarkerAlt /> Select on Map
                  </button>
                </div>

                <div className="location-input-wrapper">
                  <LocationSelect
                    label="Drop Off Location *"
                    name="dropLocation"
                    value={formData.dropLocation}
                    onChange={handleLocationChange}
                    placeholder="Search for delivery location..."
                    error={errors.dropLocation}
                  />
                  <button
                    type="button"
                    className="map-selector-button"
                    onClick={() => handleOpenMapSelector('drop')}
                    title="Select drop-off location on map"
                  >
                    <FaMapMarkerAlt /> Select on Map
                  </button>
                </div>
              </div>

              {/* Map Selector Component */}
              <LocationMapSelector
                isOpen={mapSelectorOpen.pickup || mapSelectorOpen.drop}
                onClose={handleCloseMapSelector}
                onSelect={handleMapLocationSelect}
                locationType={mapSelectorType}
                currentAddress={mapSelectorType === 'pickup' ? formData.pickupLocation : formData.dropLocation}
              />
            </div>

            {/* Cargo Information */}
            <div className="form-section">
              <h4><FaClipboardList /> Cargo Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Cargo Type *</label>
                  <input
                    type="text"
                    name="cargoType"
                    className={`form-input ${errors.cargoType ? 'error' : ''}`}
                    value={formData.cargoType}
                    onChange={handleChange}
                    placeholder="e.g., Electronics, Furniture, Food Items"
                  />
                  {errors.cargoType && <div className="form-error">{errors.cargoType}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Cargo Weight (kg)*</label>
                  <input
                    type="number"
                    name="cargoWeight"
                    className={`form-input ${errors.cargoWeight ? 'error' : ''}`}
                    value={formData.cargoWeight}
                    onChange={handleChange}
                    placeholder="e.g., 500"
                    min="1"
                  />
                  {errors.cargoWeight && <div className="form-error">{errors.cargoWeight}</div>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Cargo Size*</label>
                  <input
                    type="text"
                    name="cargoSize"
                    className={`form-input ${errors.cargoSize ? 'error' : ''}`}
                    value={formData.cargoSize}
                    onChange={handleChange}
                    placeholder="e.g., Large box, Small package"
                  />
                  {errors.cargoSize && <div className="form-error">{errors.cargoSize}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Budget (PKR)*</label>
                  <input
                    type="number"
                    name="budget"
                    className={`form-input ${errors.budget ? 'error' : ''}`}
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="e.g., 5000"
                    min="0"
                  />
                  {errors.budget && <div className="form-error">{errors.budget}</div>}
                </div>
              </div>

               {/* DESCRIPTION + NUMBER OF CONTAINERS in same row */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Cargo Description</label>
                  <textarea
                    name="description"
                    className={`form-input ${errors.description ? 'error' : ''}`}
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Cargo detail (e.g,electronics, heavy machinery, goods)"
                  />
                  {errors.description && <div className="form-error">{errors.description}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">No. of Containers/Vehicles *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    name="numContainers"
                    className={`form-input ${errors.numContainers ? 'error' : ''}`}
                    value={formData.numContainers}
                    onChange={handleChange}
                    placeholder="Number of containers/vehicles (not more than 100)"
                  />
                  {errors.numContainers && <div className="form-error">{errors.numContainers}</div>}
                </div>
              </div>
            </div>

            {/* Additional Options */}
<div className="form-section">
  <h4>Additional Options</h4>

  <div className="checkbox-group">
    {/* Insurance Checkbox */}
    <label className="checkbox-label">
      <input
        type="checkbox"
        name="insurance"
        checked={formData.insurance}
        onChange={(e) =>
          setFormData(prev => ({
            ...prev,
            insurance: e.target.checked
          }))
        }
      />
      Insurance
    </label>

    {/* Sales Tax Invoice Checkbox */}
    <label className="checkbox-label">
      <input
        type="checkbox"
        name="salesTax"
        checked={formData.salesTax}
        onChange={(e) =>
          setFormData(prev => ({
            ...prev,
            salesTax: e.target.checked
          }))
        }
      />
      Sales Tax Invoice
    </label>
  </div>

  {/* Clearing Agent Number Field */}
  <div className="form-group">
    <label className="form-label">Clearing Agent Number</label>
    <input
      type="text"
      name="clearingAgentNum"
      className={`form-input ${
        errors.clearingAgentNum ? "error" : ""
      }`}
      value={formData.clearingAgentNum}
      onChange={handleChange}
      placeholder="Enter 11-digit clearing agent number"
      maxLength={11}
      inputMode="numeric"
      pattern="[0-9]{11}"
    />
    {errors.clearingAgentNum && (
      <div className="form-error">{errors.clearingAgentNum}</div>
    )}
  </div>
</div>


            


            {errors.submit && <div className="form-error">{errors.submit}</div>}

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Booking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditBookingModal;
