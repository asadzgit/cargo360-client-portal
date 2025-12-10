import React, { useState } from "react";
import FileUpload from "./FileUpload.jsx";

function FreightForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    tradeType: "Import",
    containerType: "LCL",
    clearingAgentNum: "",
    fields: {},
  });

  const [errors, setErrors] = useState({});
  const [uploadMessages, setUploadMessages] = useState({});

  const getLabel = (docType) => {
    const labels = {
      cbm: "CBM",
      pkgs: "Packages",
      pol: "Port Of Loading",
      pod: "Port Of Discharge",
      product: "Product/Items",
      incoTerms: "Incoterms",
      containerSize: "Size of Container",
      numberOfContainers: "No. of Containers",
      commonInvoices: "Commercial Invoices",
      packingLists: "Packing Lists",
      billOfLading: "Bill of Lading",
      insurance: "Insurance",
      others: "Others",
    };
    return labels[docType] || docType;
  };

  const getFields = () => {
    const { tradeType, containerType } = formData;
    if (tradeType === "Import" && containerType === "LCL") {
      return ["cbm", "pkgs", "pol", "pod", "product", "incoTerms"];
    }
    if (tradeType === "Import" && containerType === "FCL") {
      return [
        "containerSize",
        "numberOfContainers",
        "commonInvoices",
        "packingLists",
        "billOfLading",
        "insurance",
        "others",
      ];
    }
    if (tradeType === "Export" && containerType === "LCL") {
      return [
        "cbm",
        "pkgs",
        "pol",
        "pod",
        "product",
        "incoTerms",
        "commonInvoices",
        "packingLists",
        "insurance",
        "others",
      ];
    }
    if (tradeType === "Export" && containerType === "FCL") {
      return [
        "containerSize",
        "numberOfContainers",
        "pol",
        "pod",
        "product",
        "incoTerms",
        "commonInvoices",
        "packingLists",
        "insurance",
        "others",
      ];
    }
    return [];
  };

  const isTextField = (docType) =>
    [
      "cbm",
      "pkgs",
      "pol",
      "pod",
      "product",
      "incoTerms",
      "containerSize",
      "numberOfContainers",
    ].includes(docType);

  const handleTextChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      fields: { ...prev.fields, [field]: value },
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (field, file) => {
    setFormData((prev) => ({
      ...prev,
      fields: { ...prev.fields, [field]: file },
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));

    if (file) {
      setUploadMessages((prev) => ({
        ...prev,
        [field]: "File uploaded successfully ✅",
      }));
    } else {
      setUploadMessages((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Handle clearing agent number input
  const handleClearingAgentNumChange = (e) => {
    const value = e.target.value;
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, "");
    // Limit to 11 digits
    const limitedValue = digitsOnly.slice(0, 11);
    
    setFormData((prev) => ({
      ...prev,
      clearingAgentNum: limitedValue,
    }));

    // Clear error when user starts typing
    if (errors.clearingAgentNum) {
      setErrors((prev) => ({ ...prev, clearingAgentNum: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentFields = getFields();
    const newErrors = {};

    currentFields.forEach((field) => {
      if (field === "insurance" || field === "others") return;
      if (!formData.fields[field] || formData.fields[field] === "") {
        newErrors[field] = `${getLabel(field)} is required`;
      }
    });

    // Validate clearing agent number if provided
    if (formData.clearingAgentNum) {
      const digitsOnly = formData.clearingAgentNum.replace(/\D/g, "");
      if (digitsOnly.length !== 11) {
        newErrors.clearingAgentNum = "Clearing agent number must be exactly 11 digits";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    onSubmit(formData);
  };

  const fields = getFields();
  const textFields = fields.filter(isTextField);
  const fileFields = fields.filter((f) => !isTextField(f));

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
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          <span>Freight Forwarding</span>
        </h3>

        {/* Trade Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Trade Type
          </label>
          <div className="city-toggle-container">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  tradeType: "Import",
                  fields: {},
                }))
              }
              className={`city-toggle-btn ${
                formData.tradeType === "Import" ? "active" : ""
              }`}
            >
              Import
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  tradeType: "Export",
                  fields: {},
                }))
              }
              className={`city-toggle-btn ${
                formData.tradeType === "Export" ? "active" : ""
              }`}
            >
              Export
            </button>
          </div>
        </div>

        {/* Container Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Container Type
          </label>
          <div className="city-toggle-container">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  containerType: "LCL",
                  fields: {},
                }))
              }
              className={`city-toggle-btn ${
                formData.containerType === "LCL" ? "active" : ""
              }`}
            >
              LCL
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  containerType: "FCL",
                  fields: {},
                }))
              }
              className={`city-toggle-btn ${
                formData.containerType === "FCL" ? "active" : ""
              }`}
            >
              FCL
            </button>
          </div>
        </div>

        {/* Clearing Agent Number */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Clearing Agent Number
          </label>
          <input
            type="text"
            value={formData.clearingAgentNum}
            onChange={handleClearingAgentNumChange}
            placeholder="Enter 11-digit clearing agent number"
            maxLength={11}
            inputMode="numeric"
            pattern="[0-9]{11}"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            style={{ padding: "8px 10px" }}
          />
          {errors.clearingAgentNum && (
            <p className="text-red-500 text-xs mt-1 error-msg" style={{color:'red'}}>
              {errors.clearingAgentNum}
            </p>
          )}
        </div>

        {/* Dynamic Fields */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {textFields.map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {getLabel(field)}
                  {field !== "insurance" && field !== "others" && (
                    <span className="text-red-500"> *</span>
                  )}
                </label>

                {field === "containerSize" ? (
                  <select
                    value={formData.fields[field] || ""}
                    onChange={(e) => handleTextChange(field, e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  >
                    <option value="">Select Size</option>
                    <option value="20 ft">20 ft</option>
                    <option value="40 ft">40 ft</option>
                    <option value="Flat Rack">Flat Rack</option>
                    <option value="Reefer">Reefer</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.fields[field] || ""}
                    onChange={(e) => handleTextChange(field, e.target.value)}
                    placeholder={
                      field === "incoTerms"
                      ? "e.g: FOB, CFR, Ex-Works, etc"
                      : `Enter ${getLabel(field)}`
                    }
                    className="w-full border rounded-lg p-2 text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                )}

                {errors[field] && (
                  <p className="text-red-500 text-xs mt-1 error-msg" style={{color:'red'}}>
                    {errors[field]}
                  </p>
                )}
              </div>
            ))}

            {/* File Fields */}
            {fileFields.map((field) => (
              <div key={field}>
                <FileUpload
                  label={
                    <>
                      {getLabel(field)}
                      {field !== "insurance" && field !== "others" && (
                        <span className="text-red-500"> *</span>
                      )}
                    </>
                  }
                  onChange={(file) => handleFileChange(field, file)}
                  selectedFile={formData.fields[field]}
                />
                {uploadMessages[field] && (
                  <p className="text-green-600 text-sm mt-1 success-msge" style={{color:'green'}}>
                    {uploadMessages[field]}
                  </p>
                )}
                {errors[field] && (
                  <p className="text-red-500 text-xs mt-1 error-msg" style={{color:'red'}}>
                    {errors[field]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn-modal-sub w-full hover:bg-slate-800 text-white py-3 px-6 rounded-lg transition-all duration-200 font-medium"
        >
          Submit Freight Forwarding Details
        </button>
      </div>
    </form>
  );
}

export default FreightForm;
