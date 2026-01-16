import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaFilter, FaEye, FaClock, FaCheckCircle, FaSearch, FaTimes, FaExclamationCircle, FaPlus } from 'react-icons/fa';
import { clearanceAPI } from '../services/api';
import './ClearanceStatusScreen.css';
import { ClientFooter } from '../components/ClientFooter';
import WhatsAppButton from '../components/WhatsAppButton';
import { humanize } from '../utils/helpers';
import Modal from '../components/Modal';

function ClearanceStatusScreen() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedCancelReason, setSelectedCancelReason] = useState('');
  const [customCancelReason, setCustomCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clearanceAPI.list({ limit: 50, offset: 0 });
      const container = response?.data || response;
      const list = Array.isArray(container?.requests)
        ? container.requests
        : Array.isArray(container)
        ? container
        : [];

      // Sort by newest first
      const sorted = [...list].sort((a, b) => {
        const da = new Date(a.createdAt || 0).getTime();
        const db = new Date(b.createdAt || 0).getTime();
        return db - da;
      });

      setRequests(sorted);
    } catch (err) {
      console.error('Failed to load clearance requests', err);
      setError(err?.message || 'Failed to load clearance requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = (requestId) => {
    setSelectedRequestId(requestId);
    setShowCancelReasonModal(true);
    setSelectedCancelReason('');
    setCustomCancelReason('');
  };

  const handleCloseCancelReasonModal = () => {
    setShowCancelReasonModal(false);
    setSelectedRequestId(null);
    setSelectedCancelReason('');
    setCustomCancelReason('');
  };

  const handleSubmitCancelReason = async () => {
    // Validate that a reason is selected or custom reason is entered
    if (!selectedCancelReason) {
      alert('Please select a cancellation reason.');
      return;
    }

    if (selectedCancelReason === 'Others' && !customCancelReason.trim()) {
      alert('Please enter your cancellation reason.');
      return;
    }

    if (!selectedRequestId) {
      alert('Request ID is missing.');
      return;
    }

    try {
      setCancelling(true);
      
      // Prepare cancel reason
      const cancelReason = selectedCancelReason === 'Others' 
        ? customCancelReason.trim() 
        : selectedCancelReason;
      
      // Close modal
      setShowCancelReasonModal(false);
      
      // Update the clearance request status to 'cancelled' instead of deleting
      await clearanceAPI.update(selectedRequestId, {
        status: 'cancelled',
        cancelReason: cancelReason
      });
      
      // Reset state
      setSelectedRequestId(null);
      setSelectedCancelReason('');
      setCustomCancelReason('');
      
      // Refresh the list
      await fetchRequests();
    } catch (error) {
      console.error('Failed to cancel clearance request:', error);
      alert(error?.message || 'Failed to cancel clearance request. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  // Format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return String(dateString);
    }
  };

  // Filter requests
  const filteredRequests = requests
    .filter(request => {
      const matchesStatus = statusFilter === 'all' || (request.status || '').toLowerCase() === statusFilter.toLowerCase();
      const matchesType = typeFilter === 'all' || (request.requestType || '').toLowerCase() === typeFilter.toLowerCase();
      const requestId = request.id || request._id;
      const formattedId = requestId ? `C360-PK-${requestId}` : '';
      const matchesSearch = 
        formattedId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.id?.toString() || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.containerType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.requestType || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesType && matchesSearch;
    });

  const getStatusIcon = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending':
        return <FaClock />;
      case 'under_review':
        return <FaExclamationCircle />;
      case 'approved':
        return <FaCheckCircle />;
      case 'rejected':
        return <FaTimes />;
      default:
        return <FaClock />;
    }
  };

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending':
        return 'var(--warning-color)';
      case 'under_review':
        return 'var(--info-color)';
      case 'approved':
        return 'var(--success-color)';
      case 'rejected':
        return 'var(--danger-color)';
      default:
        return 'var(--text-light)';
    }
  };

  const getRequestTypeLabel = (type) => {
    switch (type) {
      case 'freight_forwarding':
        return 'Freight Forwarding';
      case 'import':
        return 'Import Clearance';
      case 'export':
        return 'Export Clearance';
      default:
        return type || 'Clearance Request';
    }
  };

  const statusCounts = {
    all: requests.length,
    pending: requests.filter(r => (r.status || '').toLowerCase() === 'pending').length,
    under_review: requests.filter(r => (r.status || '').toLowerCase() === 'under_review').length,
    approved: requests.filter(r => (r.status || '').toLowerCase() === 'approved').length,
    rejected: requests.filter(r => (r.status || '').toLowerCase() === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="clearance-status-screen">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading clearance requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="clearance-status-screen">
        <div className="container">
          <div className="screen-header">
            <h1><FaFileAlt /> Clearance Requests</h1>
            <p>Track all your import, export and freight forwarding requests</p>
          </div>

          {error && (
            <div className="error-message">
              <p>Error loading clearance requests: {error}</p>
              <button onClick={() => fetchRequests()} className="btn btn-primary">
                Retry
              </button>
            </div>
          )}

          {/* Stats Overview */}
          <div className="clearance-stats">
            <div className="stat-item">
              <h3>{statusCounts.all}</h3>
              <p>Total Requests</p>
            </div>
            <div className="stat-item">
              <h3>{statusCounts.pending}</h3>
              <p>Pending</p>
            </div>
            <div className="stat-item">
              <h3>{statusCounts.under_review}</h3>
              <p>Under Review</p>
            </div>
            <div className="stat-item">
              <h3>{statusCounts.approved}</h3>
              <p>Approved</p>
            </div>
            <div className="stat-item">
              <h3>{statusCounts.rejected}</h3>
              <p>Rejected</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="clearance-controls">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by ID, city, container type, or request type..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <div className="filter-controls">
                <div className="filter-group">
                  <label className="filter-label">
                    <FaFilter /> Status:
                  </label>
                  <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">Type:</label>
                  <select
                    className="filter-select"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="import">Import</option>
                    <option value="export">Export</option>
                    <option value="freight_forwarding">Freight Forwarding</option>
                  </select>
                </div>
              </div>
              
              {/* Add Clearance Doc Button - Right side, same row as filters */}
              <button 
                className="btn text-black add-clearance-btn"
                style={{
                  backgroundColor: 'white', 
                  color: '#000000', 
                  whiteSpace: 'nowrap',
                  border: '2px solid var(--primary-color)',
                  boxShadow: '0 2px 8px rgba(1, 48, 78, 0.15)'
                }}
                onClick={() => setIsModalOpen(true)}
              >
                <FaPlus /> Add Clearance Doc
              </button>
            </div>
          </div>

          {/* Requests List */}
          <div className="clearance-container">
            {filteredRequests.length === 0 ? (
              <div className="empty-state">
                <FaFileAlt className="empty-icon" />
                <h3>No clearance requests found</h3>
                <p>
                  {statusFilter === 'all' && typeFilter === 'all' && searchTerm === ''
                    ? "You haven't submitted any clearance requests yet."
                    : "No requests match your current filters."
                  }
                </p>
              </div>
            ) : (
              <div className="clearance-list">
                {filteredRequests.map((request) => {
                  const id = request.id || request._id;
                  const docsCount = Array.isArray(request.Documents) ? request.Documents.length : 0;

                  return (
                    <div key={id} className="clearance-item card fade-in">
                      <div className="clearance-header">
                        <div className="clearance-id">
                          <h4>{getRequestTypeLabel(request.requestType)}</h4>
                          <span className={`status-badge status-${(request.status || '').toLowerCase().replace('_', '-')}`}>
                            {getStatusIcon(request.status)}
                            {humanize(request.status || 'pending')}
                          </span>
                        </div>
                        <div className="clearance-date">
                          {formatDate(request.createdAt)}
                        </div>
                      </div>
                      
                      <div className="clearance-content">
                        <div className="clearance-info">
                          <div className="info-row">
                            <div className="info-item">
                              <strong>Request ID:</strong>
                              <span>C360-PK-{id}</span>
                            </div>
                            <div className="info-item">
                              <strong>City:</strong>
                              <span>{request.city || '—'}</span>
                            </div>
                          </div>

                          <div className="info-row">
                            <div className="info-item">
                              <strong>Container Type:</strong>
                              <span>{request.containerType || '—'}</span>
                            </div>
                            <div className="info-item">
                              <strong>Transport Mode:</strong>
                              <span>{request.transportMode || '—'}</span>
                            </div>
                          </div>

                          <div className="info-row">
                            <div className="info-item">
                              <strong>Created:</strong>
                              <span>{formatDate(request.createdAt)}</span>
                            </div>
                            <div className="info-item">
                              <strong>Documents:</strong>
                              <span>{docsCount} document{docsCount === 1 ? '' : 's'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="clearance-actions">
                          <button
                            className="btn btn-outline"
                            onClick={() => navigate(`/clearance/${id}`)}
                          >
                            <FaEye /> View Details
                          </button>
                          {(request.status || '').toLowerCase() === 'pending' && (
                            <button
                              className="btn btn-cancel-outline"
                              onClick={() => handleCancelRequest(id)}
                            >
                              <FaTimes /> Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <ClientFooter/>

      {/* Add Clearance Doc Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          // Refresh requests list after modal closes (in case a new request was added)
          fetchRequests();
        }} 
      />

      {/* Cancel Reason Modal */}
      {showCancelReasonModal && (
        <div className="modal-overlay" onClick={handleCloseCancelReasonModal}>
          <div className="modal-content cancel-reason-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header cancel-reason-modal-header">
              <h3><FaTimes /> Cancel Clearance Request</h3>
              <button className="modal-close" onClick={handleCloseCancelReasonModal}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <h4 className="cancel-reason-title">Why are you cancelling this clearance request?</h4>
              <p className="cancel-reason-subtitle">Please select a reason for cancellation *</p>

              {/* Cancel Reason Options */}
              <div className="cancel-reason-options">
                <button
                  className={`cancel-reason-option ${selectedCancelReason === 'Not satisfied with the rates' ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedCancelReason('Not satisfied with the rates');
                    setCustomCancelReason('');
                  }}
                >
                  Not satisfied with the rates
                </button>

                <button
                  className={`cancel-reason-option ${selectedCancelReason === "Don't need Request anymore" ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedCancelReason("Don't need Request anymore");
                    setCustomCancelReason('');
                  }}
                >
                  Don't need Request anymore
                </button>

                <button
                  className={`cancel-reason-option ${selectedCancelReason === 'Others' ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedCancelReason('Others');
                  }}
                >
                  Others
                </button>
              </div>

              {/* Custom Reason Input - Show when "Others" is selected */}
              {selectedCancelReason === 'Others' && (
                <div className="custom-reason-container">
                  <label className="custom-reason-label">Please specify your reason *</label>
                  <textarea
                    className="custom-reason-input"
                    placeholder="Enter your cancellation reason"
                    rows={4}
                    value={customCancelReason}
                    onChange={(e) => setCustomCancelReason(e.target.value)}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="cancel-reason-modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseCancelReasonModal}
                  disabled={cancelling}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmitCancelReason}
                  disabled={cancelling}
                  style={{
                    opacity: cancelling ? 0.6 : 1,
                    cursor: cancelling ? 'not-allowed' : 'pointer'
                  }}
                >
                  {cancelling ? 'Cancelling...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </>
  );
}

export default ClearanceStatusScreen;

