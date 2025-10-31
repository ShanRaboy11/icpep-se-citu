"use client";

import React from "react";

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  content: React.ReactNode;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  open,
  onClose,
  content,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] sm:w-[600px] rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-primary1"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold text-primary1 mb-4">Preview</h2>
        <div>{content}</div>
      </div>
    </div>
  );
};

export default PreviewModal;
