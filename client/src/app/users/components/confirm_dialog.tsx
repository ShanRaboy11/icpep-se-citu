"use client";

import { AlertTriangle, Info, AlertCircle } from "lucide-react";
import Button from "../../components/button";
import { useBodyScrollLock } from "@/app/utils/use-body-scroll-lock";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
}: ConfirmDialogProps) {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          bg: "bg-red-50",
          icon: "text-red-500",
          buttonVariant: "heroDanger" as const,
          IconComponent: AlertTriangle,
        };
      case "warning":
        return {
          bg: "bg-amber-50",
          icon: "text-amber-500",
          buttonVariant: "heroWarning" as const,
          IconComponent: AlertCircle,
        };
      case "info":
        return {
          bg: "bg-blue-50",
          icon: "text-blue-500",
          buttonVariant: "hero" as const,
          IconComponent: Info,
        };
    }
  };

  const styles = getTypeStyles();
  const IconComponent = styles.IconComponent;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center animate-scale-in">
        <div
          className={`w-14 h-14 ${styles.bg} rounded-2xl flex items-center justify-center mx-auto mb-5`}
        >
          <IconComponent className={`w-6 h-6 ${styles.icon}`} />
        </div>
        <h3 className="text-xl font-bold text-primary3 font-rubik mb-2">
          {title}
        </h3>
        <p className="text-gray-400 text-sm font-raleway mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3">
          <Button
            variant="heroOutline"
            onClick={onClose}
            className="flex-1 py-2 sm:py-3"
          >
            {cancelText}
          </Button>
          <Button
            variant={styles.buttonVariant}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2 sm:py-3"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
