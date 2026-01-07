import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ConfirmAccountScreen from './screens/ConfirmAccountScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import BookTruckScreen from './screens/BookTruckScreen';
import BookingStatusScreen from './screens/BookingStatusScreen';
import BookingDetailScreen from './screens/BookingDetailScreen';
import ClearanceStatusScreen from './screens/ClearanceStatusScreen';
import ClearanceDetailScreen from './screens/ClearanceDetailScreen';
import TabNavigation from './components/TabNavigation';
import VerificationSuccess from './screens/VerificationSuccess';
import VerificationFailure from './screens/VerificationFailure';
import PrivacyPolicy from './screens/PrivacyPolicy';
import ProfileScreen from './screens/ProfileScreen';
import AccountDeletionScreen from './screens/AccountDeletionScreen';
import MapTestScreen from './screens/MapTestScreen';

import './App.css';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/client-home" />;
}

function AppContent() {
  const { user } = useAuth();
  
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/client-home" : "/login"} />} />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginScreen />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <SignupScreen />
            </PublicRoute>
          } 
        />
        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />
        <Route
          path="/test-map"
          element={<MapTestScreen />}
        />
        <Route
          path="/verification-success"
          element={
            <PublicRoute>
              <VerificationSuccess />
            </PublicRoute>
          }
        />
        <Route
          path="/verification-failure"
          element={
            <PublicRoute>
              <VerificationFailure />
            </PublicRoute>
          }
        />
        <Route 
          path="/confirm-account" 
          element={
            <PublicRoute>
              <ConfirmAccountScreen />
            </PublicRoute>
          } 
        />
        <Route 
          path="/reset-password" 
          element={
            <PublicRoute>
              <ResetPasswordScreen />
            </PublicRoute>
          } 
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div className="main-content">
                <ProfileScreen />
                <TabNavigation />
              </div>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/client-home" 
          element={
            <ProtectedRoute>
              <div className="main-content">
                <HomeScreen />
                <TabNavigation />
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/book-truck" 
          element={
            <ProtectedRoute>
              <div className="main-content">
                <BookTruckScreen />
                <TabNavigation />
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/bookings" 
          element={
            <ProtectedRoute>
              <div className="main-content">
                <BookingStatusScreen />
                <TabNavigation />
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/booking/:id" 
          element={
            <ProtectedRoute>
              <div className="main-content">
                <BookingDetailScreen />
                <TabNavigation />
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/clearance" 
          element={
            <ProtectedRoute>
              <div className="main-content">
                <ClearanceStatusScreen />
                <TabNavigation />
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/clearance/:id" 
          element={
            <ProtectedRoute>
              <div className="main-content">
                <ClearanceDetailScreen />
                <TabNavigation />
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/delete-account" 
          element={
            <ProtectedRoute>
              <div className="main-content">
                <AccountDeletionScreen />
                <TabNavigation />
              </div>
            </ProtectedRoute>
          } 
        />
        </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <AppContent />
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;