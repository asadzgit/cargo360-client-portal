import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTruck, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './AuthScreen.css';

function ResetPasswordScreen() {
  const [step, setStep] = useState(1); // 1: Email, 2: Code & Password
  const [formData, setFormData] = useState({
    email: '',
    code: ['', '', '', '', '', ''],
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword, forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...formData.code];
    newCode[index] = value;
    setFormData(prev => ({ ...prev, code: newCode }));
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[data-index="${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !formData.code[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    
    try {
      // Normalize email to lowercase for case-insensitive handling
      const normalizedEmail = formData.email.toLowerCase().trim();
      await forgotPassword(normalizedEmail);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    
    const resetCode = formData.code.join('');
    if (resetCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(resetCode, formData.password);
      alert('Password reset successfully! You can now login with your new password.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          <FaLock style={{ fontSize: '48px', color: 'var(--accent-color)', marginBottom: '16px' }} />
          <h2>Reset Password</h2>
          <p>
            {step === 1 
              ? "Enter your email to receive a reset code"
              : "Enter the code and your new password"
            }
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-large"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner" />
                  Sending Code...
                </>
              ) : (
                'Send Reset Code'
              )}
            </button>

            <div className="auth-footer">
              <p>
                Remember your password?{' '}
                <Link to="/login" className="link">
                  Back to login
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            
            {/* <div className="demo-credentials">
              <p><strong>Demo Reset Code:</strong> 123456</p>
            </div> */}

            <div className="form-group">
              <label className="form-label">Confirmation Code</label>
              <div className="confirmation-code-group">
                {formData.code.map((digit, index) => (
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
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input password-input"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="form-help">
                Password must be at least 6 characters long
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="form-input password-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-large"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>

            <div className="auth-footer">
              <p>
                Remember your password?{' '}
                <Link to="/login" className="link">
                  Back to login
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordScreen;