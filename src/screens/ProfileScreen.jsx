import React, { useEffect, useState } from 'react';
import { FaPen, FaSave, FaTimes, FaKey, FaTrash, FaWhatsapp } from 'react-icons/fa';
import { authAPI } from '../services/api';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ClientFooter } from '../components/ClientFooter';

import './AuthScreen.css'; // reuse basic styles

function ProfileScreen() {
  const navigate = useNavigate();
  const { user: ctxUser, setUser: setCtxUser } = useAuth?.() || {};
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [profile, setProfile] = useState(null);

  // Edit profile form
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  // Change password form
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await authAPI.getProfile(); // GET /auth/me
        // data may be either { user: {...} } or the user itself, depending on backend serializer.
        const u = data?.user ?? data;
        setProfile(u);
        setEditName(u?.name || '');
        setEditCompany(u?.company || '');
        setEditPhone(u?.phone || '');
        setEditCompany(u?.company || '');
      } catch (e) {
        setFetchError(e?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const beginEdit = () => {
    setUpdateError('');
    setUpdateSuccess('');
    setIsEditing(true);
    setEditName(profile?.name || '');
    setEditCompany(profile?.company || '');
    setEditPhone(profile?.phone || '');
    setEditCompany(profile?.company || '');
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditName(profile?.name || '');
    setEditCompany(profile?.company || '');
    setEditPhone(profile?.phone || '');
    setEditCompany(profile?.company || '');
    setUpdateError('');
    setUpdateSuccess('');
  };

  const submitProfile = async () => {
    setUpdateError('');
    setUpdateSuccess('');
    const payload = {};
    if (editName !== profile?.name) payload.name = editName.trim();
    if (editCompany !== profile?.company) payload.company = editCompany.trim();
    if (editPhone !== profile?.phone) payload.phone = editPhone.trim();
    if (editCompany !== profile?.company) payload.company = editCompany.trim();
    if (Object.keys(payload).length === 0) {
      setUpdateError('No changes to update.');
      return;
    }
    try {
      setUpdateLoading(true);
      const res = await userAPI.updateMe(payload); // PATCH /users/me
      const updatedUser = res?.user ?? res;
      setProfile(updatedUser);
      setIsEditing(false);
      setUpdateSuccess('Profile updated successfully.');
      // Update context user if available
      if (setCtxUser) setCtxUser(updatedUser);
    } catch (e) {
      setUpdateError(e?.message || 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Auto-hide success message after a short delay
  useEffect(() => {
    if (!updateSuccess) return;
    const timer = setTimeout(() => setUpdateSuccess(''), 3000);
    return () => clearTimeout(timer);
  }, [updateSuccess]);

  const submitPassword = async () => {
    setPwdError('');
    setPwdSuccess('');
    if (!currentPassword || !newPassword) {
      setPwdError('Current and new password are required.');
      return;
    }
    try {
      setPwdLoading(true);
      const res = await userAPI.updateMe({
        currentPassword,
        newPassword,
      }); // PATCH /users/me requires both
      setPwdSuccess(res?.message || 'Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (e) {
      setPwdError(e?.message || 'Failed to change password');
    } finally {
      setPwdLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="error-message">{fetchError}</div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <>
        <div className="" style={{padding: '4rem'}}>
        <div className="">
            <div className="auth-header">
            <h2>My Profile</h2>
            {!isEditing ? (
                <button className="btn btn-accent" onClick={beginEdit}>
                <FaPen /> Edit Profile
                </button>
            ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary" onClick={submitProfile} disabled={updateLoading}>
                    <FaSave /> {updateLoading ? 'Updating...' : 'Update'}
                </button>
                <button className="btn btn-secondary" onClick={cancelEdit} disabled={updateLoading}>
                    <FaTimes /> Cancel
                </button>
                </div>
            )}
            </div>

            {updateError && <div className="error-message">{updateError}</div>}
            {updateSuccess && <div className="success-message">{updateSuccess}</div>}

            <div className="info-grid" style={{ display: 'flex', flexDirection: 'column', marginTop: 12 }}>
            <div className="info-item">
                <label>Name</label>
                {!isEditing ? (
                <value>{profile.name}</value>
                ) : (
                <input
                    className="form-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your name"
                />
                )}
            </div>

            <div className="info-item">
                <label>Email</label>
                <value>{profile.email}</value>
            </div>

             {/* ✅ ADDED — SHOW COMPANY UNDER EMAIL */}
            <div className="info-item">
              <label>Company</label>
              {!isEditing ? (
                <value>{profile.company || '-'}</value>
              ) : (
                <input
                  className="form-input"
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  placeholder="Company name"
                />
              )}
            </div>

            <div className="info-item">
                <label>Phone</label>
                {!isEditing ? (
                <value>{profile.phone || '-'}</value>
                ) : (
                <input
                    className="form-input"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Your phone"
                />
                )}
            </div>

            {/* <div className="info-item">
                <label>Role</label>
                <value>{profile.role}</value>
            </div>

            <div className="info-item">
                <label>Approved</label>
                <value>{String(profile.isApproved)}</value>
            </div>

            <div className="info-item">
                <label>Email Verified</label>
                <value>{String(profile.isEmailVerified)}</value>
            </div> */}
            </div>

            <hr style={{ margin: '16px 0', opacity: 0.2 }} />

            <div className="auth-header" style={{ justifyContent: 'space-between' }}>
            <h3>
                <FaKey style={{display: 'inline-flex'}} /> Change Password
            </h3>
            <button
                className="btn btn-outline"
                onClick={() => {
                setShowPasswordForm((s) => !s);
                setPwdError('');
                setPwdSuccess('');
                }}
            >
                {showPasswordForm ? 'Cancel' : 'Change Password'}
            </button>
            </div>

            {pwdError && <div className="error-message">{pwdError}</div>}
            {pwdSuccess && <div className="success-message">{pwdSuccess}</div>}

            {showPasswordForm && (
            <div className="" style={{display: 'flex', flexDirection: 'column', gap: 8,
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    width: '50%',
                    margin: 'auto',
            }}>
                <div className="info-item">
                <label>Current Password</label>
                <input
                    className="form-input"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                />
                </div>

                <div className="info-item">
                <label>New Password</label>
                <input
                    className="form-input"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                />
                </div>

                <div className="info-item" style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary" onClick={submitPassword} disabled={pwdLoading}>
                    {pwdLoading ? 'Updating...' : 'Update Password'}
                </button>
                </div>
            </div>
            )}
        </div>
    </div>
    <hr style={{ margin: '16px 0', opacity: 0.2 }} />

    <div className="auth-header" style={{ justifyContent: 'space-between' }}>
      <h3 style={{ color: '#dc3545' }}>
        <FaTrash style={{display: 'inline-flex'}} /> Delete Account
      </h3>
    </div>
    
    <div style={{ 
      padding: '1rem', 
      backgroundColor: '#f8d7da', 
      border: '1px solid #f5c6cb', 
      borderRadius: '8px', 
      marginBottom: '1rem' 
    }}>
      <p style={{ color: '#721c24', marginBottom: '1rem' }}>
        ⚠️ <strong>Warning:</strong> This action will permanently delete your account and all associated data. This cannot be undone.
      </p>
      <button 
        className="btn btn-danger" 
        onClick={() => navigate('/delete-account')}
      >
        <FaTrash /> Delete My Account
      </button>
    </div>

    <ClientFooter/>

    {/* WhatsApp Floating Button */}
    <a
      href="https://wa.me/923337766609"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Contact us on WhatsApp"
    >
      <FaWhatsapp />
    </a>
    </>
  );
}

export default ProfileScreen;