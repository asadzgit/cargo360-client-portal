import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTruck, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './AuthScreen.css';

function SignupScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [companyError, setCompanyError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateCompany = (value) => {
    if (!value || value.trim().length === 0) {
      return 'Company name is required';
    }
    if (value.length < 3) {
      return 'Company name must be at least 3 characters';
    }
    // Check if contains invalid characters (only allow letters, digits, spaces)
    if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
      return 'Company name can only contain letters, numbers, and spaces';
    }
    // Count letters in the company name
    const letterCount = (value.match(/[a-zA-Z]/g) || []).length;
    if (letterCount < 3) {
      return 'Company name must contain at least 3 letters';
    }
    // Check if it's only digits
    const isOnlyDigits = /^\d+$/.test(value.replace(/\s/g, ''));
    if (isOnlyDigits) {
      return 'Company name cannot contain only digits';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For company name, allow letters, digits, and spaces
    if (name === 'company') {
      // Check if invalid characters are being typed (only allow letters, digits, spaces)
      const hasInvalidChars = /[^a-zA-Z0-9\s]/.test(value);
      
      // Remove any invalid characters (keep only letters, digits, spaces)
      const sanitized = value.replace(/[^a-zA-Z0-9\s]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: sanitized
      }));
      
      // Show error immediately if invalid characters detected
      if (hasInvalidChars) {
        setCompanyError('Company name can only contain letters, numbers, and spaces');
      } else {
        // Validate immediately and show error
        const error = validateCompany(sanitized);
        setCompanyError(error);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCompanyBlur = (e) => {
    const error = validateCompany(e.target.value);
    setCompanyError(error);
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.company || !formData.phone || !formData.password || !formData.confirmPassword) {
      return 'Please fill in all fields';
    }
    
    if (formData.name.length < 2) {
      return 'Name must be at least 2 characters';
    }

    // Validate company name: minimum 3 characters, at least 3 letters, cannot be only digits
    const companyError = validateCompany(formData.company);
    if (companyError) {
      return companyError;
    }
    
    if (formData.phone.length < 6) {
      return 'Phone number must be at least 6 characters';
    }
    
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate company field
    const companyValidationError = validateCompany(formData.company);
    if (companyValidationError) {
      setCompanyError(companyValidationError);
      setError(companyValidationError);
      return;
    }
    setCompanyError('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Normalize email to lowercase for case-insensitive handling
      const normalizedEmail = formData.email.toLowerCase().trim();
      const response = await signup({
        name: formData.name,
        email: normalizedEmail,
        company: formData.company, // 🔹 Include company in signup data
        phone: formData.phone,
        password: formData.password
      });
      // Store email for confirmation screen
      localStorage.setItem('pendingConfirmationEmail', normalizedEmail);
      navigate('/confirm-account');
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
          <h2>Create Account</h2>
          <p>Join our platform to start booking trucks</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
            />
          </div>

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

          {/* 🔹 Added new Company Name field */}
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              name="company"
              className={`form-input ${companyError ? 'input-error' : ''}`}
              value={formData.company}
              onChange={handleChange}
              onBlur={handleCompanyBlur}
              placeholder="Enter company name"
              autoComplete="organization"
            />
            {companyError && <div className="field-error">{companyError}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              autoComplete="tel"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-input password-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
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
            <label className="form-label">Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                className="form-input password-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
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
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="link">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupScreen;