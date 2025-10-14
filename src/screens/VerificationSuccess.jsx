import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './AuthScreen.css';

function VerificationSuccess() {
    const handleResendCode = async () => {
        setResendLoading(true);
        setError('');
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          setResendCooldown(60);
          alert('Confirmation code sent to your email');
        } catch (err) {
          setError('Failed to resend code. Please try again.');
        } finally {
          setResendLoading(false);
        }
      };
  return (
    <div className="auth-screen">
      <div className="verify-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{background: '#fff', borderRadius: '2rem', padding: '3rem'}}>
            <div className="auth-header">
            <h1>Cargo360</h1>
            </div>

            <FaCheckCircle style={{ fontSize: '48px', color: 'var(--success-color)', marginBottom: '16px' }} />
            <h2>Email Verified</h2>
            <p>Your account has been successfully verified. You can log in now.</p>

            <div style={{ marginTop: 16 }}>
            <Link to="/login" className="btn btn-primary btn-full btn-large">
                Go to Login
            </Link>
            </div>

            <div className="auth-footer" style={{ marginTop: 16 }}>
            <p>
                Didn’t mean to verify this account?{' '}
                <Link to="/signup" className="link">
                Create a different account
                </Link>
            </p>
            </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationSuccess;