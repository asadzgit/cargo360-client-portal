import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTruck, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './AuthScreen.css';

function ConfirmAccountScreen() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[data-index="${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const confirmationCode = code.join('');
    if (confirmationCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);

    try {
      await confirmAccount(email, confirmationCode);
      localStorage.removeItem('pendingConfirmationEmail');
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          <p>We've sent a 6-digit code to:</p>
          <p style={{ fontWeight: '600', color: 'var(--primary-color)', marginTop: '8px' }}>
            {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="demo-credentials">
            <p><strong>Demo Code:</strong> 123456</p>
          </div>

          <div className="confirmation-code-group">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                className="code-input"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                data-index={index}
                maxLength={1}
                autoComplete="off"
              />
            ))}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-large"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="loading-spinner" />
                Confirming...
              </>
            ) : (
              'Confirm Account'
            )}
          </button>

          <div className="resend-code">
            <p style={{ color: 'var(--text-light)', marginBottom: '8px' }}>
              Didn't receive the code?
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
                'Resend Code'
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
        </form>
      </div>
    </div>
  );
}

export default ConfirmAccountScreen;