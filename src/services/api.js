import axios from 'axios';

// Hardcoded API base URL - change this manually for development/production
const API_BASE_URL = 'https://cargo360-api.onrender.com/';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for automatic token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        // Update stored tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        // Retry original request
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient.request(error.config);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('truckBookingUser');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await apiClient({
      url: endpoint,
      ...options,
    });
    return response.data;
  } catch (error) {
    // Extract error message from axios error structure
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message || 
                        error.message || 
                        'An error occurred';
    throw new Error(errorMessage);
  }
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Authentication API calls
export const authAPI = {
  // User signup
  signup: async (userData) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      data: {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        role: 'customer', // Always customer for this frontend
      },
    });
  },

  // User login
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      data: { email, password },
    });
  },

  // Get user profile
  getProfile: async () => {
    return apiRequest('/auth/me', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
      data: { refreshToken },
    });
  },

  // Verify email
  verifyEmail: async (token) => {
    return apiRequest(`/auth/verify-email?token=${token}`, {
      method: 'GET',
    });
  },

  // Resend verification email
  resendVerification: async (email) => {
    return apiRequest('/auth/resend-verification', {
      method: 'POST',
      data: { email },
    });
  },

  // Forgot password
  forgotPassword: async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      data: { email },
    });
  },

  // Reset password
  resetPassword: async (code, password) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      data: { code, password },
    });
  },
};

export const userAPI = {
  updateMe: async (payload) => {
    // payload may contain any of: { name, phone, currentPassword, newPassword }
    return apiRequest('/users/me', {
      method: 'PATCH',
      headers: getAuthHeaders(),
      data: payload,
    });
  },

  // Delete user account and all associated data
  deleteAccount: async (password) => {
    return apiRequest('/users/me', {
      method: 'DELETE',
      headers: getAuthHeaders(),
      data: { password },
    });
  },
};

// Shipment/Booking API calls
export const bookingAPI = {
  // Create a new booking (shipment)
  createBooking: async (bookingData) => {
    return apiRequest('/shipments', {
      method: 'POST',
      headers: getAuthHeaders(),
      data: {
        pickupLocation: bookingData.pickupLocation,
        dropLocation: bookingData.dropLocation,
        cargoType: bookingData.cargoType,
        description: bookingData.description,
        vehicleType: bookingData.vehicleType,
        cargoWeight: bookingData.cargoWeight,
        cargoSize: bookingData.cargoSize,
        budget: bookingData.budget,
      },
    });
  },

  // Get customer's bookings
  getMyBookings: async (status = null) => {
    const queryParam = status ? `?status=${status}` : '';
    return apiRequest(`/shipments/mine${queryParam}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  // Get single booking
  getBooking: async (id) => {
    return apiRequest(`/shipments/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  // Update booking
  updateBooking: async (id, bookingData) => {
    return apiRequest(`/shipments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      data: bookingData,
    });
  },

  // Cancel booking
  cancelBooking: async (id) => {
    return apiRequest(`/shipments/${id}/cancel`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
  },

  // Get current location of driver for a shipment
  getCurrentLocation: async (id) => {
    return apiRequest(`/location/shipments/${id}/current`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  // Create a discount request for a shipment
  createDiscountRequest: async (id, requestAmount) => {
    return apiRequest(`/shipments/${id}/discount-request`, {
      method: 'POST',
      headers: getAuthHeaders(),
      data: { requestAmount },
    });
  },
};

// Token management utilities
export const tokenUtils = {
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },

  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },

  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  // Auto-refresh token if needed
  refreshTokenIfNeeded: async () => {
    const refreshToken = tokenUtils.getRefreshToken();
    if (refreshToken) {
      try {
        const response = await authAPI.refreshToken(refreshToken);
        tokenUtils.setTokens(response.accessToken, response.refreshToken);
        return response.accessToken;
      } catch (error) {
        tokenUtils.clearTokens();
        throw error;
      }
    }
    throw new Error('No refresh token available');
  },
};
