import React from "react";

function FileUpload({ label, onChange, selectedFile, required }) {
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onChange(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {/* Hidden file input */}
        <input
          type="file"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Visible upload area */}
        <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 transition-colors bg-slate-50 hover:bg-slate-100">
          <div className="text-center">
            {/* Upload icon */}
            <svg
              className="mx-auto h-6 w-6 text-slate-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>

            {/* Display file name or default message */}
            <p className="text-sm text-slate-600">
              {selectedFile ? selectedFile.name : "Click to upload"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
