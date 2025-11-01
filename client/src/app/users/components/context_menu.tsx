"use client";

import { useEffect, useRef } from "react";
import {
  Trash2,
  Edit,
  UserCheck,
  UserX,
  MoreVertical,
  Eye,
  AlertCircle,
} from "lucide-react";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onView: () => void;
  isActive: boolean;
  userName: string;
}

export default function UserContextMenu({
  x,
  y,
  onClose,
  onEdit,
  onDelete,
  onToggleActive,
  onView,
  isActive,
  userName,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>

      {/* Context Menu */}
      <div
        ref={menuRef}
        className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 min-w-[200px] animate-in fade-in duration-100"
        style={{
          top: `${y}px`,
          left: `${x}px`,
        }}
      >
        {/* Header */}
        <div className="px-4 py-2 border-b border-gray-100">
          <p className="font-raleway text-xs font-semibold text-gray-500 uppercase">
            Actions
          </p>
          <p className="font-raleway text-sm text-gray-700 truncate mt-1">
            {userName}
          </p>
        </div>

        {/* Menu Items */}
        <div className="py-1">
          {/* View Details */}
          <button
            onClick={() => {
              onView();
              onClose();
            }}
            className="w-full px-4 py-2 text-left font-raleway text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <Eye className="w-4 h-4 text-gray-500" />
            View Details
          </button>

          {/* Edit */}
          <button
            onClick={() => {
              onEdit();
              onClose();
            }}
            className="w-full px-4 py-2 text-left font-raleway text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <Edit className="w-4 h-4 text-blue-500" />
            Edit User
          </button>

          {/* Divider */}
          <div className="my-1 border-t border-gray-100"></div>

          {/* Toggle Active/Inactive */}
          <button
            onClick={() => {
              onToggleActive();
              onClose();
            }}
            className="w-full px-4 py-2 text-left font-raleway text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            {isActive ? (
              <>
                <UserX className="w-4 h-4 text-orange-500" />
                Mark as Inactive
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 text-green-500" />
                Mark as Active
              </>
            )}
          </button>

          {/* Divider */}
          <div className="my-1 border-t border-gray-100"></div>

          {/* Delete */}
          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="w-full px-4 py-2 text-left font-raleway text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete User
          </button>
        </div>
      </div>
    </>
  );
}
