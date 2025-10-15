import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';
import './AuthScreen.css';

function VerificationFailure() {
  return (
    <div className="auth-screen">
      <div className="verify-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{background: '#fff', borderRadius: '2rem', padding: '3rem'}}>
            <div className="auth-header">
            <h1>Cargo360</h1>
            </div>

            <FaTimesCircle style={{ fontSize: '48px', color: 'var(--danger-color)', marginBottom: '16px' }} />
            <h2>Verification Failed</h2>
            <p>
            The verification link is invalid or has expired. Please request a new verification
            email and try again.
            </p>

            {/* <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <Link to="/confirm-account" className="btn btn-primary btn-large">
                Go back to confirm Account page
            </Link>
            <Link to="/login" className="btn btn-secondary btn-large">
                Back to Login
            </Link>
            </div> */}
        </div>
      </div>
    </div>
  );
}

export default VerificationFailure;