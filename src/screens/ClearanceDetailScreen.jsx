import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaFileAlt, FaCalendarAlt, FaCheckCircle, FaClock, FaExclamationCircle, FaTimes, FaEdit } from 'react-icons/fa';
import { clearanceAPI } from '../services/api';
import { ClientFooter } from '../components/ClientFooter';
import './ClearanceDetailScreen.css';
import Modal from '../components/Modal';

function ClearanceDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);
  const [selectedCancelReason, setSelectedCancelReason] = useState('');
  const [customCancelReason, setCustomCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const loadRequest = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await clearanceAPI.get(id);
        const container = response?.data || response;
        const req = container?.request || container;
        setRequest(req || null);
      } catch (err) {
        console.error('Failed to load clearance request:', err);
        setError(err?.message || 'Failed to load clearance request');
      } finally {
        setLoading(false);
      }
    };

    loadRequest();
  }, [id]);

  // Check if edit mode is requested via query param
  useEffect(() => {
    if (searchParams.get('edit') === 'true' && request && (request.status || '').toLowerCase() === 'pending') {
      setIsEditModalOpen(true);
      setSearchParams({}); // Clear the query param
    }
  }, [searchParams, request, setSearchParams]);

  const handleCancelRequest = () => {
    setShowCancelReasonModal(true);
    setSelectedCancelReason('');
    setCustomCancelReason('');
  };

  const handleCloseCancelReasonModal = () => {
    setShowCancelReasonModal(false);
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

    try {
      setCancelling(true);
      
      // Prepare cancel reason
      const cancelReason = selectedCancelReason === 'Others' 
        ? customCancelReason.trim() 
        : selectedCancelReason;
      
      // Close modal
      setShowCancelReasonModal(false);
      
      // Update the clearance request status to 'cancelled' instead of deleting
      await clearanceAPI.update(id, {
        status: 'cancelled',
        cancelReason: cancelReason
      });
      
      // Reset state
      setSelectedCancelReason('');
      setCustomCancelReason('');
      
      // Navigate back to list
      navigate('/clearance');
    } catch (error) {
      console.error('Failed to cancel clearance request:', error);
      alert(error?.message || 'Failed to cancel clearance request. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    // Reload the request
    const loadRequest = async () => {
      try {
        const response = await clearanceAPI.get(id);
        const container = response?.data || response;
        const req = container?.request || container;
        setRequest(req || null);
      } catch (err) {
        console.error('Failed to reload clearance request:', err);
      }
    };
    loadRequest();
  };

  const formatDateTime = (value) => {
    if (!value) return '—';
    try {
      const d = new Date(value);
      return d.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return String(value);
    }
  };

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
      case 'cancelled':
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
      case 'cancelled':
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

  const renderMetaRow = (label, value) => (
    <div className="meta-row">
      <label>{label}</label>
      <value>{value ?? '—'}</value>
    </div>
  );

  if (loading) {
    return (
      <div className="clearance-detail-screen">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading clearance request details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!request || error) {
    return (
      <div className="clearance-detail-screen">
        <div className="container">
          <div className="error-state">
            <h2>Clearance Request Not Found</h2>
            <p>{error || "The clearance request you're looking for doesn't exist or has been removed."}</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/clearance')}
            >
              Back to Clearance Requests
            </button>
          </div>
        </div>
      </div>
    );
  }

  const docs = Array.isArray(request.Documents) ? request.Documents : [];

  return (
    <>
      <div className="clearance-detail-screen">
        <div className="container">
          {/* Header */}
          <div className="detail-header">
            <button 
              className="back-button"
              onClick={() => navigate('/clearance')}
            >
              <FaArrowLeft /> Back to Clearance Requests
            </button>
            
            <div className="clearance-title">
              <h1>Clearance Request Details</h1>
              <div className="clearance-id-status">
                <h2>C360-PK-{request.id || request._id}</h2>
                <span 
                  className={`status-badge status-${(request.status || '').toLowerCase()}`}
                  style={{ color: getStatusColor(request.status) }}
                >
                  {getStatusIcon(request.status)}
                  {(request.status || 'pending').charAt(0).toUpperCase() + (request.status || 'pending').slice(1).replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="detail-content">
            <div className="detail-grid">
              {/* Overview */}
              <div className="detail-card">
                <div className="card-header">
                  <h3><FaFileAlt /> Overview</h3>
                </div>
                <div className="card-body">
                  <div className="info-grid">
                    {renderMetaRow('Request ID', `C360-PK-${request.id || request._id}`)}
                    {renderMetaRow('Type', getRequestTypeLabel(request.requestType))}
                    {renderMetaRow('Status', (request.status || 'pending').charAt(0).toUpperCase() + (request.status || 'pending').slice(1).replace('_', ' '))}
                    {renderMetaRow('City', request.city)}
                    {renderMetaRow('Container Type', request.containerType)}
                    {renderMetaRow('Transport Mode', request.transportMode)}
                    {renderMetaRow('Clearing Agent Number', request.clearingAgentNum || 'Not provided')}
                    {renderMetaRow('Created At', formatDateTime(request.createdAt))}
                    {request.updatedAt && renderMetaRow('Last Updated', formatDateTime(request.updatedAt))}
                  </div>
                </div>
              </div>

              {/* Shipment Details */}
              <div className="detail-card">
                <div className="card-header">
                  <h3><FaFileAlt /> Shipment Details</h3>
                </div>
                <div className="card-body">
                  <div className="info-grid">
                    {renderMetaRow('Port of Loading (POL)', request.pol)}
                    {renderMetaRow('Port of Discharge (POD)', request.pod)}
                    {renderMetaRow('Product', request.product)}
                    {renderMetaRow('Incoterms', request.incoterms)}
                    {renderMetaRow('CBM', request.cbm)}
                    {renderMetaRow('Packages', request.packages)}
                    {renderMetaRow('Container Size', request.containerSize)}
                    {renderMetaRow('No. of Containers', request.numberOfContainers)}
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="detail-card">
                <div className="card-header">
                  <h3><FaFileAlt /> Documents</h3>
                </div>
                <div className="card-body">
                  {docs.length === 0 ? (
                    <p className="muted-text">No documents linked to this request.</p>
                  ) : (
                    <div className="documents-list">
                      {docs.map((doc) => (
                        <div key={doc.id || doc._id} className="doc-item">
                          <div className="doc-icon">
                            <FaCheckCircle />
                          </div>
                          <div className="doc-content">
                            <div className="doc-title">{doc.documentType || 'Document'}</div>
                            <div className="doc-subtitle">{doc.fileName || doc.name || 'No filename'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="detail-card">
                <div className="card-header">
                  <h3><FaCalendarAlt /> Timeline</h3>
                </div>
                <div className="card-body">
                  <div className="info-grid">
                    {renderMetaRow('Created At', formatDateTime(request.createdAt))}
                    {request.updatedAt && renderMetaRow('Last Updated', formatDateTime(request.updatedAt))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="detail-actions">
            {(request.status || '').toLowerCase() === 'pending' && (
              <>
                <button 
                  className="btn btn-accent"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <FaEdit /> Edit Clearance Request
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleCancelRequest}
                >
                  <FaTimes /> Cancel Clearance Request
                </button>
              </>
            )}
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/clearance')}
            >
              Back to Clearance Requests
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          handleEditSuccess();
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

      <ClientFooter/>
    </>
  );
}

export default ClearanceDetailScreen;

