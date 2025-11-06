import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTruck,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaCalendarAlt,
  FaWeight,
  FaDollarSign,
  FaUser,
  FaClipboardList,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import LocationSelect from "../components/LocationSelect";
import { ClientFooter } from "../components/ClientFooter";
import "./BookTruckScreen.css";

function BookTruckScreen() {
  const navigate = useNavigate();
  const {
    createBooking,
    loading: bookingLoading,
    error: bookingError,
  } = useBooking();
  const [formData, setFormData] = useState({
    vehicleType: "",
    cargoType: "",
    pickupLocation: "",
    dropLocation: "",
    cargoWeight: "",
    cargoSize: "",
    description: "",
    budget: "",
    customVehicleType: "",
    numContainers: "",
    bookingDate: new Date().toISOString().split("T")[0], // auto-set to today
    deliveryDate: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- DATE HANDLERS & VALIDATORS ---
const [bookingDateDisplay, setBookingDateDisplay] = useState("");
const [deliveryDateDisplay, setDeliveryDateDisplay] = useState("");

// inside your component
useEffect(() => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const formatted = `${dd}/${mm}/${yyyy}`;

  // Show formatted date in display
  setBookingDateDisplay(formatted);

  // Save in ISO format for backend
  const iso = `${yyyy}-${mm}-${dd}`;
  setFormData((prev) => ({ ...prev, bookingDate: iso }));
}, []);


// Format user input (DD/MM/YYYY) and limit to valid day/month
const formatDateInput = (value) => {
  // Remove everything except numbers and slashes
  const digits = value.replace(/[^\d/]/g, "");
  
  // If user is deleting, return the cleaned value
  if (digits.length < value.length) {
    return digits;
  }

  // Extract numbers only for processing
  const numbers = digits.replace(/\D/g, "");
  
  // Don't auto-complete if user is still typing the first digit
  if (numbers.length === 1) {
    return numbers; // Just return the single digit without auto-completing
  }
  
  const limited = numbers.slice(0, 8);
  
  let day = limited.slice(0, 2);
  let month = limited.slice(2, 4);
  let year = limited.slice(4, 8);

  // ✅ Day limit - only apply when user has entered 2 digits
  if (day.length === 2 && parseInt(day) > 31) day = "31";
  if (day.length === 2 && parseInt(day) < 1) day = "01";

  // ✅ Month limit - only apply when user has entered 2 digits
  if (month.length === 2 && parseInt(month) > 12) month = "12";
  if (month.length === 2 && parseInt(month) < 1) month = "01";

  // ✅ Year validation
  const currentYear = new Date().getFullYear();
  const minYear = currentYear;
  const maxYear = currentYear + 2;

  if (year && year.length === 4) {
    const parsedYear = parseInt(year);
    
    if (parsedYear < minYear || parsedYear > maxYear) {
      year = String(currentYear);
    }
  }

  // ✅ Build formatted string
  let formatted = day;
  
  // Add slash immediately when day is complete (2 digits)
  if (day.length === 2) {
    formatted += "/";
    
    // Add the month part if available
    if (month) {
      formatted += month;
    }
    
    // Add second slash when month is complete (2 digits)
    if (month.length === 2) {
      formatted += "/";
      
      // Add the year part if available
      if (year) {
        formatted += year;
      }
    }
  }

  return formatted;
};


const validateAndConvertDate = (formatted, key) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(formatted);
  if (match) {
    const [, day, month, year] = match;
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      const iso = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      setFormData((prev) => ({ ...prev, [key]: iso }));
      return;
    }
  }
  setFormData((prev) => ({ ...prev, [key]: "" }));
};

const handleBookingDateChange = (e) => {
  const formatted = formatDateInput(e.target.value);
  setBookingDateDisplay(formatted);
  validateAndConvertDate(formatted, "bookingDate");
};
const convertFormattedToISO = (formatted) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(formatted);
  if (!match) return null;

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
};


const handleDeliveryDateChange = (e) => {
  const formatted = formatDateInput(e.target.value);
  setDeliveryDateDisplay(formatted);

  // Convert to ISO (or empty)
  validateAndConvertDate(formatted, "deliveryDate");

  // Live validation: delivery must not be less than booking
  const deliveryISO = convertFormattedToISO(formatted);
  if (deliveryISO && formData.bookingDate) {
    const bDate = new Date(formData.bookingDate);
    const dDate = new Date(deliveryISO);

    if (dDate < bDate) {
      setErrors((prev) => ({
        ...prev,
        deliveryDate: "Delivery date cannot be before booking date",
      }));
    } else {
      setErrors((prev) => ({ ...prev, deliveryDate: "" }));
    }
  }
};



  // Vehicle types according to API contract
  const vehicleTypes = [
    {
      id: "shahzor_9ft_open",
      name: "Shahzor-9Ft Open",
      capacity: "Up to 1.5 tons",
    },
    { id: "mazda_12_14ft", name: "Mazda- 12/14 Ft", capacity: "Up to 3 tons" },
    {
      id: "mazda_16_17_18ft_open",
      name: "Mazda-16/17/18 Ft Open",
      capacity: "Up to 5 tons",
    },
    {
      id: "mazda_19_20ft_open",
      name: "Mazda-19/20Ft Open",
      capacity: "Up to 6 tons",
    },
    {
      id: "mazda_flat_bed_25x8",
      name: "Mazda Flat Bed-25 x 8 (LHR only)",
      capacity: "Up to 8 tons",
    },
    {
      id: "mazda_14_16_containerized",
      name: "Mazda-14/16(Containerized)",
      capacity: "Up to 4 tons",
    },
    {
      id: "mazda_17ft_containerized",
      name: "Mazda-17Ft (Containerized)",
      capacity: "Up to 5 tons",
    },
    {
      id: "flat_bed_20ft_6wheeler",
      name: "Flat Bed-20Ft (6 Wheeler)",
      capacity: "Up to 10 tons",
    },
    {
      id: "flat_bed_40ft_14wheeler",
      name: "Flat Bed-40Ft (14 Wheeler)",
      capacity: "Up to 25 tons",
    },
    {
      id: "boom_truck_16ft",
      name: "Boom Truck-16Ft",
      capacity: "Up to 5 tons",
    },
    {
      id: "container_20ft_standard",
      name: "20Ft Container-Standard",
      capacity: "Up to 20 tons",
    },
    {
      id: "container_40ft_standard",
      name: "40Ft Container- Standard",
      capacity: "Up to 30 tons",
    },
    {
      id: "wheeler_22_half_body",
      name: "22 Wheeler (Half Body)",
      capacity: "Up to 35 tons",
    },
    { id: "mazda_12ton", name: "Mazda - 12Ton", capacity: "Up to 12 tons" },
    {
      id: "wheeler_10_open_body",
      name: "10 Wheeler Open Body",
      capacity: "Up to 15 tons",
    },
    {
      id: "flat_bed_40ft_18wheeler",
      name: "Flat Bed-40Ft (18 Wheeler)",
      capacity: "Up to 30 tons",
    },
    {
      id: "flat_bed_40ft_22wheeler",
      name: "Flat Bed-40Ft (22 Wheeler)",
      capacity: "Up to 35 tons",
    },
    {
      id: "low_bed_25ft_10wheeler",
      name: "Low Bed- 25Ft (10 wheeler)",
      capacity: "Up to 20 tons",
    },
    {
      id: "single_hino_6wheeler",
      name: "Single Hino (6 Wheeler) [6 Natti]",
      capacity: "Up to 8 tons",
    },
    {
      id: "mazda_20ft_containerized",
      name: "Mazda-20Ft (Containerized)",
      capacity: "Up to 6 tons",
    },
    {
      id: "mazda_22ft_containerized",
      name: "Mazda-22Ft (Containerized)",
      capacity: "Up to 7 tons",
    },
    {
      id: "container_40ft_hc",
      name: "40Ft HC Container",
      capacity: "Up to 30 tons",
    },
    {
      id: "low_bed_40ft_22wheeler",
      name: "Low Bed- 40Ft (22 wheeler)",
      capacity: "Up to 40 tons",
    },
    {
      id: "mazda_32ft_container",
      name: "Mazda - 32Ft Container (Punjab&KPK)",
      capacity: "Up to 10 tons",
    },
    {
      id: "shahzor_9ft_container",
      name: "Shahzor- 9ft Container",
      capacity: "Up to 1.5 tons",
    },
    {
      id: "ravi_pickup_open",
      name: "Ravi Pick Up (Open)",
      capacity: "Up to 1 ton",
    },
    {
      id: "dumper_10wheeler",
      name: "Dumper - 10 Wheeler",
      capacity: "Up to 15 tons",
    },
    {
      id: "trailer_40ft_single",
      name: "40Ft single Trailer",
      capacity: "Up to 30 tons",
    },
    {
      id: "trailer_40ft_double_20",
      name: "40Ft - Double 20 Trailer",
      capacity: "Up to 40 tons",
    },
    {
      id: "truck_20ft_single",
      name: "20Ft Single Truck",
      capacity: "Up to 10 tons",
    },
    {
      id: "low_bed_30ft_10wheeler",
      name: "Low Bed- 30Ft (10 wheeler)",
      capacity: "Up to 25 tons",
    },
    {
      id: "mazda_17ft_container",
      name: "17Ft Mazda Container",
      capacity: "Up to 5 tons",
    },
    {
      id: "mazda_24ft_container",
      name: "24Ft Mazda Container",
      capacity: "Up to 8 tons",
    },
    {
      id: "mazda_16_18ft_tow_truck",
      name: "Mazda 16/18Ft Tow Truck",
      capacity: "Up to 5 tons",
    },
    {
      id: "mazda_26ft_container",
      name: "Mazda 26Ft Container",
      capacity: "Up to 9 tons",
    },
    { id: "crane_25ton", name: "Crane -25 Ton", capacity: "Up to 25 tons" },
    {
      id: "container_50ft_hc",
      name: "50ft HC Container",
      capacity: "Up to 35 tons",
    },
    {
      id: "container_45ft_hc",
      name: "45ft HC Container",
      capacity: "Up to 32 tons",
    },
    {
      id: "container_20ft_reefer",
      name: "20Ft Reefer Container",
      capacity: "Up to 20 tons",
    },
    { id: "other", name: "Other (Please Specify)", capacity: "Custom" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ Special validation for numContainers
    if (name === "numContainers") {
      if (value < 1 || value > 100) {
        setErrors((prev) => ({
          ...prev,
          numContainers: "Value must be between 1 and 100",
        }));
      } else {
        setErrors((prev) => ({ ...prev, numContainers: "" }));
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If vehicle type changes and it's not 'other', clear custom vehicle type
    if (name === "vehicleType" && value !== "other") {
      setFormData((prev) => ({
        ...prev,
        vehicleType: value,
        customVehicleType: "",
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleLocationChange = (value, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user selects location
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vehicleType)
      newErrors.vehicleType = "Please select a vehicle type";
    if (formData.vehicleType === "other" && !formData.customVehicleType) {
      newErrors.customVehicleType = "Please specify the vehicle type";
    }
    if (!formData.cargoType) newErrors.cargoType = "Please enter cargo type";
    if (!formData.pickupLocation)
      newErrors.pickupLocation = "Please enter pickup location";
    if (!formData.dropLocation)
      newErrors.dropLocation = "Please enter delivery location";

    if (formData.pickupLocation === formData.dropLocation) {
      newErrors.dropLocation =
        "Delivery location must be different from pickup location";
    }

    if (formData.pickupLocation && formData.pickupLocation.length < 5) {
      newErrors.pickupLocation =
        "Pickup location must be at least 5 characters";
    }

    if (formData.dropLocation && formData.dropLocation.length < 5) {
      newErrors.dropLocation = "Drop location must be at least 5 characters";
    }

    if (formData.cargoType && formData.cargoType.length < 2) {
      newErrors.cargoType = "Cargo type must be at least 2 characters";
    }

    // Booking Date required
  if (!formData.bookingDate) {
    newErrors.bookingDate = "Please select booking date";
  }

  // Delivery Date required
  if (!formData.deliveryDate) {
    newErrors.deliveryDate = "Please select delivery date";
  }

  // Delivery Date cannot be earlier than Booking Date (optional, but recommended)
  if (formData.bookingDate && formData.deliveryDate) {
    const bDate = new Date(formData.bookingDate);
    const dDate = new Date(formData.deliveryDate);
    if (dDate < bDate) {
      newErrors.deliveryDate = "Delivery date cannot be before booking date";
    }
  }


    // ✅ Cargo Weight required
    if (!formData.cargoWeight) {
      newErrors.cargoWeight = "Cargo weight is required";
    } else if (isNaN(parseFloat(formData.cargoWeight))) {
      newErrors.cargoWeight = "Please enter a valid weight";
    }

    // ✅ No. of Containers/Vehicles required
    if (!formData.numContainers) {
      newErrors.numContainers = "Please enter number of containers/vehicles";
    } else if (isNaN(parseInt(formData.numContainers))) {
      newErrors.numContainers = "Please enter a valid number";
    }

    if (formData.budget && isNaN(parseFloat(formData.budget))) {
      newErrors.budget = "Please enter a valid budget amount";
    }

    // if (formData.insurance && !formData.insuranceFile) {
    //   newErrors.insuranceFile = "Please attach the insurance invoice file";
    // }

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
        vehicleType:
          formData.vehicleType === "other"
            ? formData.customVehicleType
            : formData.vehicleType,
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.dropLocation,
        cargoType: formData.cargoType,
        description: formData.description,
        cargoWeight: formData.cargoWeight
          ? parseFloat(formData.cargoWeight)
          : undefined,
        cargoSize: formData.cargoSize || undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        numberOfVehicles: formData.numContainers
          ? parseInt(formData.numContainers)
          : undefined,
        insurance: formData.insurance || undefined,
        salesTax: formData.salesTax || undefined,

        bookingDate: formData.bookingDate,
        deliveryDate: formData.deliveryDate,

      };
      console.log("PAYLOAD SENT TO BACKEND:", bookingData);


      // const response = await createBooking(bookingData);
      setShowSuccess(true);

      // Reset form after delay and navigate
      setTimeout(() => {
        navigate("/client-home");
      }, 3000);
    } catch (error) {
      setErrors({
        submit: error.message || "Failed to submit booking. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedVehicle = vehicleTypes.find(
    (v) => v.id === formData.vehicleType
  );

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
              Your truck booking request has been submitted and is now pending
              approval. We'll notify you once a driver accepts your request.
            </p>
            <div className="success-details">
              <p>
                <strong>Booking ID:</strong> Will be provided via email
              </p>
              <p>
                <strong>Vehicle:</strong> {selectedVehicle?.name}
              </p>
              <p>
                <strong>Route:</strong> {formData.pickupLocation} →{" "}
                {formData.dropLocation}
              </p>
              <p>
                <strong>Cargo Type:</strong> {formData.cargoType}
              </p>
            </div>
            <button
              className="btn btn-primary btn-large"
              onClick={() => navigate("/client-home")}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="book-truck-screen">
        <div className="container">
          <div className="screen-header">
            <h1>
              <FaTruck /> Book a Vehicle
            </h1>
            <p>
              Fill out the details below to request a vehicle for your cargo
              transportation needs
            </p>
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
                    className={`form-select ${
                      errors.vehicleType ? "error" : ""
                    }`}
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
                  {errors.vehicleType && (
                    <div className="form-error">{errors.vehicleType}</div>
                  )}
                </div>

                {/* Custom Vehicle Type Input - Show when "Other" is selected */}
                {formData.vehicleType === "other" && (
                  <div className="form-group">
                    <label className="form-label">
                      Please Specify Vehicle Type *
                    </label>
                    <input
                      type="text"
                      name="customVehicleType"
                      className={`form-input ${
                        errors.customVehicleType ? "error" : ""
                      }`}
                      value={formData.customVehicleType}
                      onChange={handleChange}
                      placeholder="Please specify other vehicle type"
                    />
                    {errors.customVehicleType && (
                      <div className="form-error">
                        {errors.customVehicleType}
                      </div>
                    )}
                  </div>
                )}

                {selectedVehicle && formData.vehicleType !== "other" && (
                  <div className="vehicle-details">
                    <h4>{selectedVehicle.name}</h4>
                    <p>
                      <strong>Capacity:</strong> {selectedVehicle.capacity}
                    </p>
                  </div>
                )}
              </div>

              {/* Cargo Information */}
              <div className="form-section">
                <h3>Cargo Information</h3>
                {/* Row A: Booking Date + Delivery Date (forced 2-per-row) */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Booking Date *</label>
                    <input
    type="text"
    name="bookingDate"
    className={`form-input ${errors.bookingDate ? "error" : ""}`}
    value={bookingDateDisplay}
    onChange={handleBookingDateChange}
    placeholder="DD/MM/YYYY"
    disabled
  />
                    {errors.bookingDate && (
                      <div className="form-error">{errors.bookingDate}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Delivery Date *</label>
                    <input
    type="text"
    name="deliveryDate"
    className={`form-input ${errors.deliveryDate ? "error" : ""}`}
    value={deliveryDateDisplay}
    onChange={handleDeliveryDateChange}
    placeholder="DD/MM/YYYY"
  />
                    {errors.deliveryDate && (
                      <div className="form-error">{errors.deliveryDate}</div>
                    )}
                  </div>
                </div>

                {/* Row B: Cargo Weight + Cargo Type (existing two-per-row) */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Cargo Weight (kg) *</label>
                    <input
                      type="number"
                      name="cargoWeight"
                      className={`form-input ${
                        errors.cargoWeight ? "error" : ""
                      }`}
                      value={formData.cargoWeight}
                      onChange={handleChange}
                      placeholder="e.g., 500"
                      min="1"
                    />
                    {errors.cargoWeight && (
                      <div className="form-error">{errors.cargoWeight}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cargo Type *</label>
                    <input
                      type="text"
                      name="cargoType"
                      className={`form-input ${
                        errors.cargoType ? "error" : ""
                      }`}
                      value={formData.cargoType}
                      onChange={handleChange}
                      placeholder="e.g., Electronics, Furniture, Food Items"
                    />
                    {errors.cargoType && (
                      <div className="form-error">{errors.cargoType}</div>
                    )}
                  </div>
                </div>

                {/* Row C: Description + No. of Containers (existing) */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Cargo Description</label>
                    <textarea
                      name="description"
                      className={`form-input ${
                        errors.description ? "error" : ""
                      }`}
                      value={formData.description}
                      onChange={handleChange}
                      rows="1"
                      placeholder="Describe your cargo details"
                    />
                    {errors.description && (
                      <div className="form-error">{errors.description}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      No. of Containers/Vehicles *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      name="numContainers"
                      className={`form-input ${
                        errors.numContainers ? "error" : ""
                      }`}
                      value={formData.numContainers || ""}
                      onChange={handleChange}
                      placeholder="Number of containers/vehicles"
                    />
                    {errors.numContainers && (
                      <div className="form-error">{errors.numContainers}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="form-section">
                <h3>
                  <FaMapMarkerAlt /> Location Details
                </h3>
                <div className="location-fields">
                  <LocationSelect
                    label="Pickup Location *"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleLocationChange}
                    placeholder="Search for pickup location..."
                    error={errors.pickupLocation}
                  />

                  <LocationSelect
                    label="Drop Off Location *"
                    name="dropLocation"
                    value={formData.dropLocation}
                    onChange={handleLocationChange}
                    placeholder="Search for delivery location..."
                    error={errors.dropLocation}
                  />
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
              {/* Additional Options */}
              <div className="form-section">
                <h3>Additional Options</h3>

                <div className="checkbox-group">
                  {/* Insurance Checkbox */}
                  <label className="checkbox-label">
                    <input
                      // style={{appearance:'none',}}
                      type="checkbox"
                      name="insurance"
                      checked={formData.insurance || false}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          insurance: e.target.checked,
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
                      checked={formData.salesTax || false}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          salesTax: e.target.checked,
                        }))
                      }
                    />
                    Sales Tax Invoice
                  </label>
                </div>

                {/* File upload field appears ONLY when Insurance is checked */}
                {/* {formData.insurance && (
                  <div className="form-group insurance-upload">
                    <label className="form-label">
                      * Attach Insurance Invoice
                    </label>
                    <input
                      type="file"
                      name="insuranceFile"
                      className="form-input"
                      required
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          insuranceFile: e.target.files[0],
                        }))
                      }
                    />
                  </div>
                )}
                {errors.insuranceFile && (
                  <div className="form-error">{errors.insuranceFile}</div>
                )} */}
              </div>
              {/* Submit Button */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-large"
                  onClick={() => navigate("/client-home")}
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
      <ClientFooter />
    </>
  );
}

export default BookTruckScreen;
