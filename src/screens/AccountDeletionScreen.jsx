import React, { useState } from 'react';
import { FaExclamationTriangle, FaTrash, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ClientFooter } from '../components/ClientFooter';
import './AuthScreen.css';

function AccountDeletionScreen() {
  const navigate = useNavigate();
  const { logout } = useAuth?.() || {};
  
  const [step, setStep] = useState(1); // 1: Warning, 2: Confirmation, 3: Password
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleDeleteAccount = async () => {
    if (!password) {
      setError('Password is required to delete your account');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await userAPI.deleteAccount(password);
      
      // Clear all local storage and logout
      localStorage.clear();
      if (logout) logout();
      
      // Redirect to a goodbye page or login
      navigate('/login', { 
        state: { 
          message: 'Your account has been successfully deleted. All your data has been permanently removed.' 
        }
      });
      
    } catch (err) {
      setError(err?.message || 'Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="auth-card" style={{ maxWidth: '600px', margin: 'auto' }}>
      {/* <div className="auth-header">
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/profile')}
          style={{ marginRight: 'auto' }}
        >
          <FaArrowLeft /> Back to Profile
        </button>
        <h2 style={{ color: '#dc3545', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaExclamationTriangle /> Delete Account
        </h2>
      </div> */}

      <div style={{ padding: '20px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', marginBottom: '20px' }}>
        <h3 style={{ color: '#856404', marginBottom: '15px' }}>
          <FaShieldAlt /> Data Deletion Policy
        </h3>
        <p style={{ color: '#856404', lineHeight: '1.6', marginBottom: '10px' }}>
          In compliance with Google Play Store policies, we want to ensure you understand what happens when you delete your account:
        </p>
        <ul style={{ color: '#856404', paddingLeft: '20px', lineHeight: '1.6' }}>
          <li><strong>Complete Data Removal:</strong> All your personal information, bookings, and account data will be permanently deleted from our servers.</li>
          <li><strong>Immediate Effect:</strong> This action cannot be undone. Your account will be immediately deactivated.</li>
          <li><strong>Data Retention:</strong> We do not retain any personal data after account deletion, except as required by law.</li>
          {/* <li><strong>Third-party Services:</strong> Any data shared with payment processors or logistics partners will be handled according to their respective privacy policies.</li> */}
          <li><strong>Third-party Services:</strong> Any data shared with third-party services or partners will be handled according to their respective privacy policies.</li>
        </ul>
      </div>

      <div style={{ padding: '20px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '8px', marginBottom: '20px' }}>
        <h4 style={{ color: '#721c24', marginBottom: '15px' }}>⚠️ Warning: This Action is Permanent</h4>
        <p style={{ color: '#721c24', lineHeight: '1.6' }}>
          Once you delete your account, you will lose access to:
        </p>
        <ul style={{ color: '#721c24', paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>All your booking history and shipment records</li>
          {/* <li>Saved addresses and preferences</li> */}
          <li>Any pending or active shipments</li>
          <li>Your user profile and account settings</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
          <span>I understand that this action is permanent and cannot be undone</span>
        </label>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/profile')}
        >
          Cancel
        </button>
        <button 
          className="btn btn-danger" 
          onClick={() => setStep(2)}
          disabled={!agreedToTerms}
        >
          Continue with Deletion
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="auth-card" style={{ maxWidth: '500px', margin: 'auto' }}>
      <div className="auth-header">
        <h2 style={{ color: '#dc3545' }}>Confirm Account Deletion</h2>
      </div>

      <p style={{ marginBottom: '20px', textAlign: 'center' }}>
        To confirm deletion, please type <strong>"DELETE MY ACCOUNT"</strong> in the box below:
      </p>

      <div className="form-group">
        <input
          className="form-input"
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Type: DELETE MY ACCOUNT"
          style={{ textAlign: 'center', fontWeight: 'bold' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button 
          className="btn btn-secondary" 
          onClick={() => setStep(1)}
        >
          Back
        </button>
        <button 
          className="btn btn-danger" 
          onClick={() => setStep(3)}
          disabled={confirmText !== 'DELETE MY ACCOUNT'}
        >
          Proceed to Final Step
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="auth-card" style={{ maxWidth: '500px', margin: 'auto' }}>
      <div className="auth-header">
        <h2 style={{ color: '#dc3545' }}>Final Confirmation</h2>
      </div>

      <p style={{ marginBottom: '20px', textAlign: 'center' }}>
        Enter your password to permanently delete your account:
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
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button 
          className="btn btn-secondary" 
          onClick={() => setStep(2)}
          disabled={loading}
        >
          Back
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
  );

  return (
    <>
      <div style={{ padding: '2rem', minHeight: '80vh' }}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
      <ClientFooter />
    </>
  );
}

export default AccountDeletionScreen;
