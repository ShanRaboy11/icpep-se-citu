"use client";

import { motion } from "framer-motion";

interface Officer {
  title: string;
  name: string;
}

interface CouncilOfficersCardProps {
  officers: Officer[];
  title?: string;
  onClick?: () => void; // optional click handler if you want full card clickable
}

export default function CouncilOfficersCard({
  officers,
  title = "Council Officers",
  onClick,
}: CouncilOfficersCardProps) {
  return (
    <motion.div
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="w-full max-w-md mx-auto cursor-default"
    >
      <div className="shadow-lg rounded-2xl bg-buttonbg1/40 hover:shadow-xl transition-shadow">
        <div className="p-6">
          <h2 className="font-rubik text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            {title}
          </h2>

          <div className="flex flex-col gap-2">
            {officers.map((officer, index) => (
              <div
                key={index}
                className="shadow-md font-raleway flex flex-col sm:flex-row sm:justify-between items-start sm:items-center bg-white hover:bg-blue-50 border-l-4 border-blue-600 rounded-md px-3 py-2 transition-colors"
              >
                <p className="text-sm font-medium text-gray-800">
                  {officer.title}
                </p>
                <p className="text-sm text-gray-600">{officer.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
