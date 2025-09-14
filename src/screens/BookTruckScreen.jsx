import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaWeight, FaCheckCircle } from 'react-icons/fa';
import { useBooking } from '../context/BookingContext';
import './BookTruckScreen.css';

function BookTruckScreen() {
  const navigate = useNavigate();
  const { createBooking, loading: bookingLoading, error: bookingError } = useBooking();
  const [formData, setFormData] = useState({
    vehicleType: '',
    cargoType: '',
    pickupLocation: '',
    dropLocation: '',
    cargoWeight: '',
    cargoSize: '',
    description: '',
    budget: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Vehicle types according to API contract
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
    { id: 'container_20ft_reefer', name: '20Ft Reefer Container', capacity: 'Up to 20 tons' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
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
    if (!formData.cargoType) newErrors.cargoType = 'Please enter cargo type';
    if (!formData.pickupLocation) newErrors.pickupLocation = 'Please enter pickup location';
    if (!formData.dropLocation) newErrors.dropLocation = 'Please enter delivery location';
    if (!formData.description) newErrors.description = 'Please provide cargo description';
    
    if (formData.pickupLocation === formData.dropLocation) {
      newErrors.dropLocation = 'Delivery location must be different from pickup location';
    }
    
    if (formData.pickupLocation && formData.pickupLocation.length < 5) {
      newErrors.pickupLocation = 'Pickup location must be at least 5 characters';
    }
    
    if (formData.dropLocation && formData.dropLocation.length < 5) {
      newErrors.dropLocation = 'Drop location must be at least 5 characters';
    }
    
    if (formData.cargoType && formData.cargoType.length < 2) {
      newErrors.cargoType = 'Cargo type must be at least 2 characters';
    }
    
    if (formData.description && formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (formData.cargoWeight && isNaN(parseFloat(formData.cargoWeight))) {
      newErrors.cargoWeight = 'Please enter a valid weight';
    }
    
    if (formData.budget && isNaN(parseFloat(formData.budget))) {
      newErrors.budget = 'Please enter a valid budget amount';
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
    
    setLoading(true);
    setErrors({});
    
    try {
      const bookingData = {
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.dropLocation,
        cargoType: formData.cargoType,
        description: formData.description,
        vehicleType: formData.vehicleType,
        cargoWeight: formData.cargoWeight ? parseFloat(formData.cargoWeight) : undefined,
        cargoSize: formData.cargoSize || undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined
      };

      const response = await createBooking(bookingData);
      setShowSuccess(true);
      
      // Reset form after delay and navigate
      setTimeout(() => {
        navigate('/client-home');
      }, 3000);
      
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to submit booking. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const selectedVehicle = vehicleTypes.find(v => v.id === formData.vehicleType);

  if (showSuccess) {
    return (
      <div className="book-truck-screen">
        <div className="container">
          <div className="success-container fade-in">
            <div className="success-icon">
              <FaCheckCircle />
            </div>
            <h2>Booking Submitted Successfully!</h2>
            <p>
              Your truck booking request has been submitted and is now pending approval. 
              We'll notify you once a driver accepts your request.
            </p>
            <div className="success-details">
              <p><strong>Booking ID:</strong> Will be provided via email</p>
              <p><strong>Vehicle:</strong> {selectedVehicle?.name}</p>
              <p><strong>Route:</strong> {formData.pickupLocation} → {formData.dropLocation}</p>
              <p><strong>Cargo Type:</strong> {formData.cargoType}</p>
            </div>
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate('/client-home')}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-truck-screen">
      <div className="container">
        <div className="screen-header">
          <h1><FaTruck /> Book a Vehicle</h1>
          <p>Fill out the details below to request a vehicle for your cargo transportation needs</p>
        </div>

        <div className="booking-form-container">
          <form onSubmit={handleSubmit} className="booking-form">
            {errors.submit && (
              <div className="error-message">{errors.submit}</div>
            )}

            {/* Vehicle Type Selection */}
            <div className="form-section">
              <h3>Vehicle Information</h3>
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

              {selectedVehicle && (
                <div className="vehicle-details">
                  <h4>{selectedVehicle.name}</h4>
                  <p><strong>Capacity:</strong> {selectedVehicle.capacity}</p>
                </div>
              )}
            </div>

            {/* Cargo Information */}
            <div className="form-section">
              <h3>Cargo Information</h3>
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
                  <label className="form-label">Cargo Weight (kg)</label>
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
                {/* <div className="form-group">
                  <label className="form-label">Cargo Size</label>
                  <input
                    type="text"
                    name="cargoSize"
                    className={`form-input ${errors.cargoSize ? 'error' : ''}`}
                    value={formData.cargoSize}
                    onChange={handleChange}
                    placeholder="e.g., Large, Medium, Small"
                  />
                  {errors.cargoSize && <div className="form-error">{errors.cargoSize}</div>}
                </div> */}

                {/* <div className="form-group">
                  <label className="form-label">Budget ($)</label>
                  <input
                    type="number"
                    name="budget"
                    className={`form-input ${errors.budget ? 'error' : ''}`}
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="e.g., 1200"
                    min="0"
                    step="0.01"
                  />
                  {errors.budget && <div className="form-error">{errors.budget}</div>}
                </div> */}
              </div>

              <div className="form-group">
                <label className="form-label">Cargo Description *</label>
                <textarea
                  name="description"
                  className={`form-input ${errors.description ? 'error' : ''}`}
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe your cargo in detail (e.g., fragile electronics, heavy machinery, perishable goods)"
                />
                {errors.description && <div className="form-error">{errors.description}</div>}
              </div>
            </div>

            {/* Location Information */}
            <div className="form-section">
              <h3><FaMapMarkerAlt /> Location Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Pickup Location *</label>
                  <input 
                    type="text"
                    name="pickupLocation"
                    className={`form-input ${errors.pickupLocation ? 'error' : ''}`}
                    value={formData.pickupLocation}
                    placeholder="Enter detailed pickup address"
                    onChange={handleChange}
                  />
                  {errors.pickupLocation && <div className="form-error">{errors.pickupLocation}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Delivery Location *</label>
                  <input 
                    type="text"
                    name="dropLocation"
                    className={`form-input ${errors.dropLocation ? 'error' : ''}`}
                    value={formData.dropLocation}
                    placeholder="Enter detailed delivery address"
                    onChange={handleChange}
                  />
                  {errors.dropLocation && <div className="form-error">{errors.dropLocation}</div>}
                </div>
              </div>
            </div>

            {/* Date Information */}
            {/* <div className="form-section">
              <h3><FaCalendarAlt /> Schedule</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Pickup Date *</label>
                  <input
                    type="date"
                    name="pickupDate"
                    className={`form-input ${errors.pickupDate ? 'error' : ''}`}
                    value={formData.pickupDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.pickupDate && <div className="form-error">{errors.pickupDate}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Delivery Date *</label>
                  <input
                    type="date"
                    name="deliveryDate"
                    className={`form-input ${errors.deliveryDate ? 'error' : ''}`}
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                  />
                  {errors.deliveryDate && <div className="form-error">{errors.deliveryDate}</div>}
                </div>
              </div>
            </div> */}

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary btn-large"
                onClick={() => navigate('/client-home')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <FaTruck />
                    Submit Booking Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookTruckScreen;