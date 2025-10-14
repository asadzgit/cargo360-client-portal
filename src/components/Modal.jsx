import { useState } from "react";
import ImportsForm from "./ImportsForm.jsx";
import ExportsForm from "./ExportsForm.jsx";
import FreightForm from "./FreightForm.jsx";

/**
 * ✨ Modal Features:
 *  • Glass / blur effect overlay
 *  • Smooth fade + zoom animation
 *  • Gradient header
 *  • Modern pill-style tab buttons with blue active state
 */
function Modal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("imports");

  const handleSubmit = (formType, data) => {
    alert(`${formType} form submitted successfully!`);
    console.log(`${formType} Data:`, data);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center
                  transition-all duration-300
                  ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
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
          ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
        style={{ marginTop: "10%" }}
      >
        {/* ===== Header ===== */}
        <div
          className="flex items-center justify-between p-6 border-b my-gradient"
          style={{
            position: "sticky", // keeps header visible when scrolling
            top: 0, // stick to the top of modal
            zIndex: 20, // above modal content
          }}
        >
          <h2
            className="font-bold text-white"
            style={{ color: "white", fontSize: "26px" }}
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
        <div className="p-6">
          <div className="flex space-x-1 bg-slate-300 p-2 rounded-lg">
            <button
              onClick={() => setActiveTab("imports")}
              className={`tab-btn ${activeTab === "imports" ? "active" : ""}`}
            >
              Imports
            </button>

            <button
              onClick={() => setActiveTab("exports")}
              className={`tab-btn ${activeTab === "exports" ? "active" : ""}`}
            >
              Exports
            </button>

            <button
              onClick={() => setActiveTab("freight")}
              className={`tab-btn ${activeTab === "freight" ? "active" : ""}`}
            >
              Freight Forwarding
            </button>
          </div>
        </div>

        {/* ===== Tab Content ===== */}
        <div className="p-6">
          {activeTab === "imports" && (
            <ImportsForm onSubmit={(data) => handleSubmit("Imports", data)} />
          )}
          {activeTab === "exports" && (
            <ExportsForm onSubmit={(data) => handleSubmit("Exports", data)} />
          )}
          {activeTab === "freight" && (
            <FreightForm
              onSubmit={(data) => handleSubmit("Freight Forwarding", data)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
