import React, { createContext, useContext, useState } from 'react';
import { bookingAPI } from '../services/api';

const BookingContext = createContext();

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create a new booking
  const createBooking = async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingAPI.createBooking(bookingData);
      
      // Add the new booking to the list
      setBookings(prev => [response.data.shipment, ...prev]);
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch all user's bookings
  const fetchBookings = async (status = null) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingAPI.getMyBookings(status);
      setBookings(response.data.shipments);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single booking
  const fetchBooking = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingAPI.getBooking(id);
      return response.data.shipment;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update a booking
  const updateBooking = async (id, bookingData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingAPI.updateBooking(id, bookingData);
      
      // Update the booking in the list
      setBookings(prev => 
        prev.map(booking => 
          booking.id === id ? response.data.shipment : booking
        )
      );
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cancel a booking
  const cancelBooking = async (id, reason = null) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingAPI.cancelBooking(id, reason);
      
      // Update the booking status in the list
      setBookings(prev => 
        prev.map(booking => 
          booking.id === id ? { ...booking, status: 'cancelled' } : booking
        )
      );
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Clear bookings (useful for logout)
  const clearBookings = () => {
    setBookings([]);
    setError(null);
  };

  const value = {
    bookings,
    loading,
    error,
    createBooking,
    fetchBookings,
    fetchBooking,
    updateBooking,
    cancelBooking,
    clearError,
    clearBookings,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}
