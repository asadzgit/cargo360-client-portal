import React, { useState } from "react";
import FileUpload from "./FileUpload.jsx";

function ImportsForm({ onSubmit }) {
  // State for imports form data
  const [formData, setFormData] = useState({
    city: "LHR",
    transportMode: "air",
    containerType: "LCL",
    port: "",
    files: {},
  });

  // State for validation errors
  const [errors, setErrors] = useState({});

  // ✅ New state for upload success messages
  const [uploadSuccess, setUploadSuccess] = useState({});

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required files
    const newErrors = {};

    if (!formData.files.commonInvoices) {
      newErrors.commonInvoices = "Commercial Invoices is required";
    }

    if (!formData.files.packingLists) {
      newErrors.packingLists = "Packing Lists is required";
    }

    if (!formData.files.billOfLading) {
      newErrors.billOfLading = "Bill Of Lading is required";
    }

    // If there are errors, update state and don't submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors and submit
    setErrors({});
    onSubmit(formData);
  };

  // Handle file uploads
  const handleFileChange = (fileType, file) => {
    setFormData((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [fileType]: file,
      },
    }));

    // Clear error for this field when file is selected
    if (errors[fileType]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fileType];
        return newErrors;
      });
    }

    // ✅ Show success message
    if (file) {
      setUploadSuccess((prev) => ({
        ...prev,
        [fileType]: "File uploaded successfully ✅",
      }));
    } else {
      // Remove success message if file removed
      setUploadSuccess((prev) => {
        const newSuccess = { ...prev };
        delete newSuccess[fileType];
        return newSuccess;
      });
    }
  };

  // Ensure FCL is disabled if city = LHR
  const handleCityChange = (city) => {
    setFormData((prev) => ({
      ...prev,
      city,
      containerType: city === "LHR" ? "LCL" : prev.containerType, // force LCL if LHR
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 frm-elem">
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center space-x-2">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>Import Documentation</span>
        </h3>

        {/* City Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Select City
          </label>

          <div className="city-toggle-container">
            <button
              type="button"
              onClick={() => handleCityChange("LHR")}
              className={`city-toggle-btn ${
                formData.city === "LHR" ? "active" : ""
              }`}
            >
              LHR
            </button>

            <button
              type="button"
              onClick={() => handleCityChange("KHI")}
              className={`city-toggle-btn ${
                formData.city === "KHI" ? "active" : ""
              }`}
            >
              KHI
            </button>
          </div>
        </div>

        {/* Transport Mode */}
        <div className="mb-6 trns-mode">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Transport Mode
          </label>
          {formData.city === "LHR" ? (
            <div className="radio-option">
              <input
                type="radio"
                id="exp-air-only"
                name="exp-transport"
                value="air"
                checked={formData.transportMode === "air"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    transportMode: e.target.value,
                  }))
                }
              />
              <label htmlFor="exp-air-only">By air only</label>
            </div>
          ) : (
            <div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="exp-air"
                  name="exp-transport"
                  value="air"
                  checked={formData.transportMode === "air"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      transportMode: e.target.value,
                    }))
                  }
                />
                <label htmlFor="exp-air">By Air</label>
              </div>

              <div className="radio-option">
                <input
                  type="radio"
                  id="exp-sea"
                  name="exp-transport"
                  value="sea"
                  checked={formData.transportMode === "sea"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      transportMode: e.target.value,
                    }))
                  }
                />
                <label htmlFor="exp-sea">By Sea</label>
              </div>
            </div>
          )}
        </div>

        {/* Container Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Shipment Type
          </label>

          <div className="city-toggle-container">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, containerType: "LCL" }))
              }
              className={`city-toggle-btn ${
                formData.containerType === "LCL" ? "active" : ""
              }`}
            >
              LCL
            </button>

            <button
              type="button"
              disabled={formData.city === "LHR"} // disable FCL for LHR
              onClick={() =>
                setFormData((prev) => ({ ...prev, containerType: "FCL" }))
              }
              className={`city-toggle-btn ${
                formData.containerType === "FCL" ? "active" : ""
              } ${
                formData.city === "LHR" ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              FCL
            </button>
          </div>
        </div>

        {/* Port Selection (Only for KHI) */}
        {formData.city === "KHI" && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Port
            </label>
            <select
              value={formData.port}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, port: e.target.value }))
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              style={{ padding: "8px 10px" }}
            >
              <option value="">Select a port/Airport</option>
              <option value="KGT/PICT">KGT/PICT</option>
              <option value="KICT">KICT</option>
              <option value="SAPT">SAPT</option>
              <option value="Port Qasim">Port Qasim</option>
              <option value="NLC">NLC</option>
              <option value="Burwa Oil">Burwa Oil</option>
              <option value="Al Hamad">Al Hamad</option>
              <option value="Pak Scaleen">Pak Scaleen</option>
              <option value="ODT">ODT</option>
              <option value="Airport">Airport</option>
            </select>
          </div>
        )}

        {/* File Uploads */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            Required Documents
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Commercial Invoices */}
            <div>
              <FileUpload
                required
                label="Commercial Invoices"
                onChange={(file) => handleFileChange("commonInvoices", file)}
                selectedFile={formData.files.commonInvoices}
              />
              {errors.commonInvoices && (
                <p className="text-red-600 text-sm mt-1 error-msg" style={{color:'red'}}>
                  {errors.commonInvoices}
                </p>
              )}
              {uploadSuccess.commonInvoices && (
                <p className="text-green-600 text-sm mt-1 success-msge" style={{color:'green'}}>
                  {uploadSuccess.commonInvoices}
                </p>
              )}
            </div>

            {/* Packing Lists */}
            <div>
              <FileUpload
                required
                label="Packing Lists"
                onChange={(file) => handleFileChange("packingLists", file)}
                selectedFile={formData.files.packingLists}
              />
              {errors.packingLists && (
                <p className="text-red-600 text-sm mt-1 error-msg" style={{color:'red'}}>
                  {errors.packingLists}
                </p>
              )}
              {uploadSuccess.packingLists && (
                <p className="text-green-600 text-sm mt-1 success-msge" style={{color:'green'}}>
                  {uploadSuccess.packingLists}
                </p>
              )}
            </div>

            {/* Bill Of Lading */}
            <div>
              <FileUpload
                required
                label="Bill Of Lading"
                onChange={(file) => handleFileChange("billOfLading", file)}
                selectedFile={formData.files.billOfLading}
              />
              {errors.billOfLading && (
                <p className="text-red-600 text-sm mt-1 error-msg" style={{color:'red'}}>
                  {errors.billOfLading}
                </p>
              )}
              {uploadSuccess.billOfLading && (
                <p className="text-green-600 text-sm mt-1 success-msge" style={{color:'green'}}>
                  {uploadSuccess.billOfLading}
                </p>
              )}
            </div>

            {/* Insurance */}
            <div>
              <FileUpload
                label="Insurance"
                onChange={(file) => handleFileChange("insurance", file)}
                selectedFile={formData.files.insurance}
              />
              {uploadSuccess.insurance && (
                <p className="text-green-600 text-sm mt-1 success-msge" style={{color:'green'}}>
                  {uploadSuccess.insurance}
                </p>
              )}
            </div>

            {/* Others */}
            <div>
              <FileUpload
                label="Others"
                onChange={(file) => handleFileChange("others", file)}
                selectedFile={formData.files.others}
              />
              {uploadSuccess.others && (
                <p className="text-green-600 text-sm mt-1 success-msge" style={{color:'green'}}>
                  {uploadSuccess.others}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full btn-modal-sub hover:bg-slate-800 text-white py-3 px-6 rounded-lg transition-all duration-200 font-medium"
        >
          Submit Import Documentation
        </button>
      </div>
    </form>
  );
}

export default ImportsForm;
