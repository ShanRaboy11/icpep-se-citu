"use client";

import { AlertTriangle } from "lucide-react";
import Button from "./button";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="mb-2 font-rubik text-xl font-bold text-primary3">{title}</h3>
        <p className="mb-6 font-raleway text-sm leading-relaxed text-gray-400">{message}</p>
        <div className="flex gap-3">
          <Button variant="heroCancel" onClick={onCancel} className="flex-1 py-2 sm:py-3">
            Cancel
          </Button>
          <Button variant="heroDanger" onClick={onConfirm} className="flex-1 py-2 sm:py-3">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
