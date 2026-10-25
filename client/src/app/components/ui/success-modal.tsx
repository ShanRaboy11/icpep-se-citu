"use client";

import Button from "./button";

interface SuccessModalProps {
  open: boolean;
  title: string;
  description: string;
  buttonLabel?: string;
  onClose: () => void;
}

export default function SuccessModal({ open, title, description, buttonLabel = "Continue", onClose }: SuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-green-400/20" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-green-400 to-emerald-500 shadow-md">
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-6 text-center">
          <h3 className="font-rubik text-xl font-bold text-primary3">{title}</h3>
          <p className="mt-2 font-raleway text-sm text-gray-400">{description}</p>
        </div>

        <Button variant="hero" onClick={onClose} className="w-full py-2 text-sm sm:py-3">
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}
