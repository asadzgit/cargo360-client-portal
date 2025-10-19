import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaTrash, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ClientFooter } from '../components/ClientFooter';
import './AuthScreen.css';

function PublicAccountDeletionScreen() {
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Token validation states
  const [tokenValidated, setTokenValidated] = useState(false);
  const [validatingToken, setValidatingToken] = useState(false);

  // Mobile deletion API calls
  const validateDeletionToken = async (token) => {
    const response = await fetch('https://cargo360-api.onrender.com/auth/deletion/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token }),
    });
    if (response.status === 204) return { success: true };
    const errorData = await response.json();
    throw new Error(errorData.error || 'Token validation failed');
  };

  const confirmMobileDeletion = async (password) => {
    const response = await fetch('https://cargo360-api.onrender.com/auth/deletion/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });
    if (response.ok) return await response.json();
    const errorData = await response.json();
    throw new Error(errorData.error || 'Account deletion failed');
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('token=')) {
      const tokenMatch = hash.match(/token=([^&]+)/);
      if (tokenMatch) {
        validateTokenAndSetup(tokenMatch[1]);
      }
    } else {
      // No token found, redirect to login or show error
      setError('Invalid access. This page requires a valid deletion token from the mobile app.');
    }
  }, []);

  const validateTokenAndSetup = async (token) => {
    try {
      setValidatingToken(true);
      setError('');
      await validateDeletionToken(token);
      setTokenValidated(true);
      // Remove token from URL for security
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      setError(err?.message || 'Invalid or expired deletion link. Please try again from your mobile app.');
    } finally {
      setValidatingToken(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!password) {
      setError('Password is required to delete your account');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await confirmMobileDeletion(password);
      setSuccess(true);
      
    } catch (err) {
      setError(err?.message || 'Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen while validating token
  if (validatingToken) {
    return (
      <>
        <div style={{ padding: '2rem', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="auth-card" style={{ maxWidth: '500px', margin: 'auto', textAlign: 'center' }}>
            <h2>Validating Deletion Request...</h2>
            <p>Please wait while we verify your deletion request from the mobile app.</p>
          </div>
        </div>
        <ClientFooter />
      </>
    );
  }

  // Show success screen after deletion
  if (success) {
    return (
      <>
        <div style={{ padding: '2rem', minHeight: '80vh' }}>
          <div className="auth-card" style={{ maxWidth: '500px', margin: 'auto', textAlign: 'center' }}>
            <div style={{ color: '#28a745', marginBottom: '20px' }}>
              <h2>✅ Account Successfully Deleted</h2>
            </div>
            
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#d4edda', 
              border: '1px solid #c3e6cb', 
              borderRadius: '8px', 
              marginBottom: '20px' 
            }}>
              <p style={{ color: '#155724', marginBottom: '10px' }}>
                Your account has been permanently deleted. All your data has been removed from our servers.
              </p>
              <p style={{ color: '#155724' }}>
                You can now close this browser and return to your mobile device.
              </p>
            </div>
            
            <button 
              className="btn btn-secondary" 
              onClick={() => window.close()}
            >
              Close Browser
            </button>
          </div>
        </div>
        <ClientFooter />
      </>
    );
  }

  // Show error screen if token validation failed or no token
  if (!tokenValidated && !validatingToken) {
    return (
      <>
        <div style={{ padding: '2rem', minHeight: '80vh' }}>
          <div className="auth-card" style={{ maxWidth: '500px', margin: 'auto' }}>
            <div className="auth-header">
              <h2 style={{ color: '#dc3545' }}>
                <FaExclamationTriangle /> Invalid Deletion Link
              </h2>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f8d7da', 
              border: '1px solid #f5c6cb', 
              borderRadius: '8px', 
              marginBottom: '20px' 
            }}>
              <p style={{ color: '#721c24', textAlign: 'center' }}>
                The deletion link you used is invalid, expired, or missing. 
                Please return to your mobile app and try the account deletion process again.
              </p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => window.close()}
              >
                Close Browser
              </button>
            </div>
          </div>
        </div>
        <ClientFooter />
      </>
    );
  }

  // Show password confirmation form
  return (
    <>
      <div style={{ padding: '2rem', minHeight: '80vh' }}>
        <div className="auth-card" style={{ maxWidth: '500px', margin: 'auto' }}>
          <div className="auth-header">
            <h2 style={{ color: '#dc3545' }}>
              <FaTrash /> Confirm Account Deletion
            </h2>
          </div>

          <div style={{ 
            padding: '20px', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            <h4 style={{ color: '#856404', marginBottom: '10px' }}>
              <FaShieldAlt /> Final Step
            </h4>
            <p style={{ color: '#856404', lineHeight: '1.6' }}>
              You're about to permanently delete your account. This action cannot be undone and will remove all your data from our servers.
            </p>
          </div>

          <p style={{ marginBottom: '20px', textAlign: 'center' }}>
            Enter your password to confirm account deletion:
          </p>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => window.close()}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="btn btn-danger" 
              onClick={handleDeleteAccount}
              disabled={loading || !password}
            >
              <FaTrash /> {loading ? 'Deleting Account...' : 'Delete My Account Forever'}
            </button>
          </div>
        </div>
      </div>
      <ClientFooter />
    </>
  );
}

export default PublicAccountDeletionScreen;
