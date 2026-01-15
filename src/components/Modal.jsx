import { useState, useEffect } from "react";
import ImportsForm from "./ImportsForm.jsx";
import ExportsForm from "./ExportsForm.jsx";
import FreightForm from "./FreightForm.jsx";
import { clearanceAPI } from "../services/api";
import axios from "axios";

/**
 * ✨ Modal Features:
 *  • Glass / blur effect overlay
 *  • Smooth fade + zoom animation
 *  • Gradient header
 *  • Modern pill-style tab buttons with blue active state
 */
function Modal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("imports");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);

  useEffect(() => {
    const checkScreenSize = () => {
      setScreenWidth(window.innerWidth);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const isMobile = screenWidth <= 425;
  const isSmallMobile = screenWidth <= 375;

  // Document type mapping
  const DOCUMENT_TYPE_MAP = {
    commonInvoices: "commercial_invoice",
    packingLists: "packing_list",
    billOfLading: "bill_of_lading",
    insurance: "insurance",
    others: "other",
  };

  // Upload a single document
  const uploadDocument = async (file, documentType) => {
    const token = localStorage.getItem("accessToken");
    const API_BASE_URL = "https://cargo360-api.onrender.com/";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);

    const response = await axios.post(`${API_BASE_URL}documents/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data?.document || response.data.document || response.data;
  };

  // Check if a field is a text field (not a file)
  const isTextField = (field) => {
    return ["pol", "pod", "product", "incoTerms", "cbm", "pkgs", "containerSize", "numberOfContainers"].includes(field);
  };

  const handleSubmit = async (formType, data) => {
    setSubmitting(true);
    setError(null);

    try {
      // Step 1: Upload all files
      const documentUploads = [];
      const fileEntries = Object.entries(data.files || data.fields || {});

      for (const [key, file] of fileEntries) {
        // Skip text fields
        if (isTextField(key)) continue;
        if (!file || !(file instanceof File)) continue;

        const documentType = DOCUMENT_TYPE_MAP[key];
        if (!documentType) {
          console.warn(`Unknown document type for key: ${key}`);
          continue;
        }

        try {
          const document = await uploadDocument(file, documentType);
          documentUploads.push(document);
        } catch (error) {
          console.error(`Failed to upload ${key}:`, error);
          throw new Error(`Failed to upload ${key}. Please try again.`);
        }
      }

      // Step 2: Get document IDs
      const documentIds = documentUploads.map((doc) => doc.id || doc._id);

      // Step 3: Build request payload based on form type
      let requestPayload = {
        shipmentId: null,
        documentIds: documentIds,
        clearingAgentNum: data.clearingAgentNum || null,
      };

      if (formType === "Imports") {
        const transportMode = data.city === "LHR" ? "air_only" : data.transportMode;
        requestPayload = {
          ...requestPayload,
          requestType: "import",
          city: data.city,
          transportMode: transportMode,
          containerType: data.containerType,
          port: data.port || null,
          pol: null,
          pod: null,
          product: null,
          incoterms: null,
        };
      } else if (formType === "Exports") {
        const transportMode = data.city === "LHR" ? "air_only" : data.transportMode;
        requestPayload = {
          ...requestPayload,
          requestType: "export",
          city: data.city,
          transportMode: transportMode,
          containerType: data.containerType,
          port: null,
          pol: data.files?.pol || null,
          pod: data.files?.pod || null,
          product: data.files?.product || null,
          incoterms: data.files?.incoTerms || null,
        };
      } else if (formType === "Freight Forwarding") {
        const { containerType } = data;
        requestPayload = {
          ...requestPayload,
          requestType: "freight_forwarding",
          containerType: containerType,
          pol: data.fields?.pol || null,
          pod: data.fields?.pod || null,
          product: data.fields?.product || null,
          incoterms: data.fields?.incoTerms || null,
        };

        // Add LCL-specific fields
        if (containerType === "LCL") {
          requestPayload.cbm = data.fields?.cbm ? parseFloat(data.fields.cbm) : null;
          requestPayload.packages = data.fields?.pkgs ? parseInt(data.fields.pkgs, 10) : null;
        }

        // Add FCL-specific fields
        if (containerType === "FCL") {
          requestPayload.containerSize = data.fields?.containerSize || null;
          requestPayload.numberOfContainers = data.fields?.numberOfContainers
            ? parseInt(data.fields.numberOfContainers, 10)
            : null;
        }
      }

      // Step 4: Create clearance request
      const response = await clearanceAPI.create(requestPayload);
      const request = response?.data?.request || response?.request || response;

      alert(`${formType} clearance request created successfully!`);
      onClose();
    } catch (err) {
      console.error("Submit error:", err);
      setError(err?.message || "Failed to create clearance request. Please try again.");
      alert(err?.message || "Failed to create clearance request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center
                  transition-all duration-300
                  modal-wrapper
                  ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      style={isMobile ? { 
        alignItems: 'flex-start', 
        paddingTop: isSmallMobile ? '48px' : '40px' 
      } : {}}
    >
      {/* ===== Glassy Overlay ===== */}
      <div
        onClick={onClose}
        className={`fixed inset-0
                    bg-gray-200/20 backdrop-blur-md
                    transition-opacity duration-300 ease-out
                    ${isOpen ? "opacity-100" : "opacity-0"}`}
      />

      {/* ===== Modal Box ===== */}
      <div
        className={`
          relative z-10
          w-full max-w-4xl max-h-[90vh] overflow-y-auto
          bg-white/90 backdrop-blur-sm
          rounded-xl shadow-2xl m-4
          transition-all duration-300 ease-out
          clearance-modal-container
          ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
        style={isMobile ? { marginTop: "0" } : { marginTop: "10%" }}
      >
        {/* ===== Header ===== */}
        <div
          className="flex items-center justify-between p-6 border-b my-gradient clearance-modal-header"
          style={{
            position: "sticky", // keeps header visible when scrolling
            top: 0, // stick to the top of modal
            zIndex: 20, // above modal content
            padding: isMobile ? '18px' : undefined,
          }}
        >
          <h2
            className="font-bold text-white"
            style={{ 
              color: "white", 
              fontSize: isMobile ? "16px" : "26px" 
            }}
          >
            Add Clearance Documentation
          </h2>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer modal-close-btn"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* ===== Tab Navigation ===== */}
        <div className="p-6" style={{ padding: isMobile ? '12px 16px' : undefined }}>
          <div 
            className="flex space-x-1 bg-slate-300 p-2 rounded-lg"
            style={{ 
              padding: isMobile ? '5px' : undefined,
              gap: isMobile ? '2px' : undefined
            }}
          >
            <button
              onClick={() => setActiveTab("imports")}
              className={`tab-btn ${activeTab === "imports" ? "active" : ""}`}
              style={isMobile ? {
                padding: '6px 8px',
                fontSize: '11px',
                marginRight: '2px'
              } : {}}
            >
              Imports
            </button>

            <button
              onClick={() => setActiveTab("exports")}
              className={`tab-btn ${activeTab === "exports" ? "active" : ""}`}
              style={isMobile ? {
                padding: '6px 8px',
                fontSize: '11px',
                marginRight: '2px'
              } : {}}
            >
              Exports
            </button>

            <button
              onClick={() => setActiveTab("freight")}
              className={`tab-btn ${activeTab === "freight" ? "active" : ""}`}
              style={isMobile ? {
                padding: '6px 8px',
                fontSize: '11px',
                marginRight: '2px',
                ...(isSmallMobile ? {
                  display: 'flex',
                  flexDirection: 'column',
                  lineHeight: '1.2'
                } : {})
              } : {}}
            >
              {isSmallMobile ? (
                <>
                  <span>Freight</span>
                  <span>Forwarding</span>
                </>
              ) : (
                'Freight Forwarding'
              )}
            </button>
          </div>
        </div>

        {/* ===== Tab Content ===== */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {activeTab === "imports" && (
            <ImportsForm 
              onSubmit={(data) => handleSubmit("Imports", data)} 
              disabled={submitting}
            />
          )}
          {activeTab === "exports" && (
            <ExportsForm 
              onSubmit={(data) => handleSubmit("Exports", data)} 
              disabled={submitting}
            />
          )}
          {activeTab === "freight" && (
            <FreightForm
              onSubmit={(data) => handleSubmit("Freight Forwarding", data)}
              disabled={submitting}
            />
          )}
          {submitting && (
            <div className="mt-4 text-center">
              <p className="text-blue-600">Submitting clearance request...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
