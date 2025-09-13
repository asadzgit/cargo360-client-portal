// Dummy data for the application
export const vehicleTypes = [
  { id: 'pickup', name: 'Pickup Truck', capacity: '1-2 tons', price: '$150/day' },
  { id: 'box-truck', name: 'Box Truck', capacity: '3-5 tons', price: '$250/day' },
  { id: 'flatbed', name: 'Flatbed Truck', capacity: '5-10 tons', price: '$350/day' },
  { id: 'semi', name: 'Semi Truck', capacity: '15-40 tons', price: '$500/day' },
  { id: 'refrigerated', name: 'Refrigerated Truck', capacity: '5-20 tons', price: '$400/day' }
];

export const loadTypes = [
  'General Cargo',
  'Furniture',
  'Electronics',
  'Food & Beverages',
  'Construction Materials',
  'Automotive Parts',
  'Fragile Items',
  'Hazardous Materials',
  'Perishable Goods',
  'Other'
];

export const cities = [
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'San Jose, CA',
  'Austin, TX',
  'Jacksonville, FL',
  'Fort Worth, TX',
  'Columbus, OH',
  'Charlotte, NC',
  'San Francisco, CA',
  'Indianapolis, IN',
  'Seattle, WA',
  'Denver, CO',
  'Boston, MA'
];

// Dummy bookings data
export const dummyBookings = [
  {
    id: 'BK001',
    vehicleType: 'Box Truck',
    loadType: 'Furniture',
    fromLocation: 'New York, NY',
    toLocation: 'Philadelphia, PA',
    pickupDate: '2024-01-15',
    deliveryDate: '2024-01-16',
    weight: '3.5 tons',
    description: 'Office furniture relocation including desks, chairs, and filing cabinets',
    status: 'Pending',
    createdAt: '2024-01-10T10:30:00Z',
    price: '$250',
    driverName: null,
    driverPhone: null,
    estimatedDuration: '6 hours',
    distance: '95 miles'
  },
  {
    id: 'BK002',
    vehicleType: 'Pickup Truck',
    loadType: 'Electronics',
    fromLocation: 'Los Angeles, CA',
    toLocation: 'San Diego, CA',
    pickupDate: '2024-01-12',
    deliveryDate: '2024-01-12',
    weight: '1.2 tons',
    description: 'Computer equipment and monitors for office setup',
    status: 'Accepted',
    createdAt: '2024-01-08T14:15:00Z',
    price: '$150',
    driverName: 'Mike Johnson',
    driverPhone: '+1-555-0123',
    estimatedDuration: '3 hours',
    distance: '120 miles'
  },
  {
    id: 'BK003',
    vehicleType: 'Semi Truck',
    loadType: 'Construction Materials',
    fromLocation: 'Houston, TX',
    toLocation: 'Dallas, TX',
    pickupDate: '2024-01-08',
    deliveryDate: '2024-01-09',
    weight: '25 tons',
    description: 'Steel beams and construction materials for building project',
    status: 'Completed',
    createdAt: '2024-01-05T09:00:00Z',
    price: '$500',
    driverName: 'Sarah Williams',
    driverPhone: '+1-555-0456',
    estimatedDuration: '8 hours',
    distance: '240 miles'
  }
];

// Helper functions
export const getBookingById = (id) => {
  return dummyBookings.find(booking => booking.id === id);
};

export const getBookingsByStatus = (status) => {
  return dummyBookings.filter(booking => booking.status === status);
};

export const addNewBooking = (bookingData) => {
  const newBooking = {
    id: 'BK' + String(Date.now()).slice(-3),
    ...bookingData,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    driverName: null,
    driverPhone: null
  };
  
  dummyBookings.unshift(newBooking);
  return newBooking;
};