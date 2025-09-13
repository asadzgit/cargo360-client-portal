import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, tokenUtils } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem('truckBookingUser');
      const accessToken = tokenUtils.getAccessToken();
      
      if (savedUser && accessToken) {
        try {
          // Verify token is still valid by fetching user profile
          const response = await authAPI.getProfile();
          setUser(response.user);
        } catch (error) {
          // Token is invalid, clear stored data
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      console.log(response)
      // Store tokens
      tokenUtils.setTokens(response.accessToken, response.refreshToken);
      
      // Store user data
      setUser(response.user);
      localStorage.setItem('truckBookingUser', JSON.stringify(response.user));
      
      return response.user;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const confirmAccount = async (token) => {
    try {
      const response = await authAPI.verifyEmail(token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await authAPI.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authAPI.forgotPassword(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const resendVerification = async (email) => {
    try {
      const response = await authAPI.resendVerification(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('truckBookingUser');
    tokenUtils.clearTokens();
  };

  const value = {
    user,
    loading,
    login,
    signup,
    confirmAccount,
    resetPassword,
    forgotPassword,
    resendVerification,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}