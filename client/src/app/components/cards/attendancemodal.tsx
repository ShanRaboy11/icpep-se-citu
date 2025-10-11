"use client";

import CouncilOfficersCard from "./attendancecard";
import { motion } from "framer-motion";

interface AttendanceCardProps {
  title: string;
  subtitle?: string;
  officers: { title: string; name: string }[];
  onClose?: () => void;
}

export default function AttendanceModalCard({
  title,
  subtitle,
  officers,
  onClose,
}: AttendanceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="font-rubik text-xl sm:text-3xl font-bold text-primary3 mt-2">
            {title}
          </h2>
          {subtitle && (
            <p className="font-raleway text-gray-600 text-sm md:text-base mt-4">
              {subtitle}
            </p>
          )}
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg cursor-pointer transition-transform duration-200 hover:scale-130"
          >
            ✕
          </button>
        )}
      </div>

      {/* Council Officers */}
      <div className="mt-6">
        <CouncilOfficersCard officers={officers} />
      </div>
    </motion.div>
  );
}
