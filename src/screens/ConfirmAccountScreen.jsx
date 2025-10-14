import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTruck, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './AuthScreen.css';

function ConfirmAccountScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { confirmAccount } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const pendingEmail = localStorage.getItem('pendingConfirmationEmail');
    if (!pendingEmail) {
      navigate('/signup');
      return;
    }
    setEmail(pendingEmail);
  }, [navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);


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
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <div className="brand-logo">
            <FaTruck className="brand-icon" />
            <h1>Cargo360</h1>
          </div>
          <FaCheckCircle style={{ fontSize: '48px', color: 'var(--success-color)', marginBottom: '16px' }} />
          <h2>Confirm Your Email</h2>
          <p>We've sent you an email with a link to verify your account:</p>
          <p style={{ fontWeight: '600', color: 'var(--primary-color)', marginTop: '8px' }}>
            {email}
          </p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="resend-code">
          <p style={{ color: 'var(--text-light)', marginBottom: '8px' }}>
            Didn't receive the email?
          </p>
          <button
            type="button"
            className="resend-button"
            onClick={handleResendCode}
            disabled={resendLoading || resendCooldown > 0}
          >
            {resendLoading ? (
              'Sending...'
            ) : resendCooldown > 0 ? (
              `Resend in ${resendCooldown}s`
            ) : (
              'Resend Email'
            )}
          </button>
        </div>
        <div className="auth-footer">
          <p>
            Want to use a different email?{' '}
            <Link to="/signup" className="link">
              Go back to signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ConfirmAccountScreen;