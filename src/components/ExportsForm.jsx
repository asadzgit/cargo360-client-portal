import React, { useState } from "react";
import FileUpload from "./FileUpload.jsx";

function ExportsForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    city: "LHR",
    transportMode: "air",
    containerType: "LCL",
    files: {},
  });

  const [errors, setErrors] = useState({});
  const [uploadMessages, setUploadMessages] = useState({});

  // Required fields
  const requiredFields = [
    "commonInvoices",
    "packingLists",
    "pol",
    "pod",
    "product",
    "exWorks",
  ];

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData.files[field] || formData.files[field] === "") {
        newErrors[field] = `${getLabel(field)} is required`;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSubmit(formData);
  };

  // File input change
  const handleFileChange = (fileType, file) => {
    setFormData((prev) => ({
      ...prev,
      files: { ...prev.files, [fileType]: file },
    }));
    setErrors((prev) => ({ ...prev, [fileType]: "" }));

    if (file) {
      setUploadMessages((prev) => ({
        ...prev,
        [fileType]: "File uploaded successfully ✅",
      }));
    }
  };

  // Text input change
  const handleTextChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      files: { ...prev.files, [field]: value },
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Document list
  const getDocumentList = () => [
    "commonInvoices",
    "packingLists",
    "insurance",
    "pol",
    "pod",
    "product",
    "exWorks",
  ];

  // ✅ Updated Labels
  const getLabel = (docType) => {
    const labels = {
      commonInvoices: "Commercial Invoices",
      packingLists: "Packing Lists",
      insurance: "Insurance",
      pol: "Port of Loading",
      pod: "Port of Discharge",
      product: "Product/Items",
      exWorks: "Ex-works",
      others: "Others",
    };
    return labels[docType] || docType;
  };

  // Distinguish text vs file fields
  const isTextField = (docType) =>
    ["pol", "pod", "product", "exWorks"].includes(docType);

  const textFields = getDocumentList().filter(isTextField);
  const fileFields = getDocumentList().filter((doc) => !isTextField(doc));

  const requiredFieldsSet = new Set(requiredFields);

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
          <span>Export Documentation</span>
        </h3>

        {/* --- City Selection --- */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Select City
          </label>
          <div className="city-toggle-container">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  city: "LHR",
                  containerType: "LCL",
                  transportMode: "air",
                }))
              }
              className={`city-toggle-btn ${
                formData.city === "LHR" ? "active" : ""
              }`}
            >
              LHR
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, city: "KHI" }))}
              className={`city-toggle-btn ${
                formData.city === "KHI" ? "active" : ""
              }`}
            >
              KHI
            </button>
          </div>
        </div>

        {/* --- Transport Mode --- */}
        <div className="mb-6">
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

        {/* --- Container Type --- */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Container Type
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
              disabled={formData.city === "LHR"}
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

        {/* --- Document Uploads --- */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            Required Documents
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {textFields.map((docType) => (
              <div key={docType}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {getLabel(docType)}
                  {requiredFieldsSet.has(docType) && (
                    <span className="text-red-500"> *</span>
                  )}
                </label>
                <input
                  type="text"
                  value={formData.files[docType] || ""}
                  onChange={(e) => handleTextChange(docType, e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder={`Enter ${getLabel(docType)}`}
                />
                {errors[docType] && (
                  <p className="text-red-500 text-xs mt-1 error-msg" style={{color:'red'}}>
                    {errors[docType]}
                  </p>
                )}
              </div>
            ))}

            {fileFields.map((docType) => (
              <div key={docType}>
                <FileUpload
                  label={
                    <>
                      {getLabel(docType)}
                      {requiredFieldsSet.has(docType) && (
                        <span className="text-red-500"> *</span>
                      )}
                    </>
                  }
                  onChange={(file) => handleFileChange(docType, file)}
                  selectedFile={formData.files[docType]}
                />
                {uploadMessages[docType] && (
                  <p className="text-green-600 text-sm mt-1 success-msge" style={{color:'green'}}>
                    {uploadMessages[docType]}
                  </p>
                )}
                {errors[docType] && (
                  <p className="text-red-500 text-xs mt-1 error-msg" style={{color:'red'}}>
                    {errors[docType]}
                  </p>
                )}
              </div>
            ))}

            <FileUpload
              label={getLabel("others")}
              onChange={(file) => handleFileChange("others", file)}
              selectedFile={formData.files.others}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full btn-modal-sub hover:bg-slate-800 text-white py-3 px-6 rounded-lg transition-all duration-200 font-medium"
        >
          Submit Export Documentation
        </button>
      </div>
    </form>
  );
}

export default ExportsForm;
