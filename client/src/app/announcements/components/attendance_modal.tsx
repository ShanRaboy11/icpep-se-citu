import { X } from "lucide-react";
import { Officer, Committee } from "../types";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AttendanceModal({
  isOpen,
  onClose,
}: AttendanceModalProps) {
  const councilOfficers: Officer[] = [
    { title: "President", name: "Maria Elena Santos" },
    { title: "VP - Internal", name: "John Rafael Cruz" },
    { title: "VP - External", name: "Patricia Anne Villanueva" },
    { title: "Secretary", name: "Sarah Mae Rodriguez" },
    { title: "Treasurer", name: "Miguel Angelo Fernandez" },
    { title: "Auditor", name: "Ana Gabriela Reyes" },
    { title: "PIO", name: "Carlos David Mendoza" },
  ];

  const committees = [
    {
      name: "Internal Affairs",
      color: "#00A7EE",
      bgColor: "bg-[#00A7EE]/5",
      members: [
        { title: "Head", name: "Lisa Marie Gonzales" },
        { title: "Asst. Head", name: "Mark Anthony Torres" },
        { title: "Secretary", name: "Jerome Paul Castro" },
        { title: "Member", name: "Michelle Anne Dela Cruz" },
        { title: "Member", name: "Kenneth James Rivera" },
      ],
    },
    {
      name: "External Affairs",
      color: "#9333ea",
      bgColor: "bg-purple-50",
      members: [
        { title: "Head", name: "Rachel Anne Delgado" },
        { title: "Asst. Head", name: "Alexander James Morales" },
        { title: "Secretary", name: "Kristine Mae Perez" },
        { title: "Member", name: "Daniel Jose Aquino" },
      ],
    },
    {
      name: "Training & Seminar",
      color: "#16a34a",
      bgColor: "bg-green-50",
      members: [
        { title: "Head", name: "Anthony Carl Valdez" },
        { title: "Asst. Head", name: "Jasmine Rose Garcia" },
        { title: "Secretary", name: "Benedict Paul Ramos" },
        { title: "Member", name: "Sophia Jane Herrera" },
        { title: "Member", name: "Christopher Mark Luna" },
      ],
    },
    {
      name: "Public Relations",
      color: "#ea580c",
      bgColor: "bg-orange-50",
      members: [
        { title: "Head", name: "Isabella Marie Santos" },
        { title: "Asst. Head", name: "Gabriel Luis Mendez" },
        { title: "Secretary", name: "Nicole Faith Castillo" },
        { title: "Member", name: "Adrian Jose Flores" },
      ],
    },
    {
      name: "Research & Dev.",
      color: "#2563eb",
      bgColor: "bg-blue-50",
      members: [
        { title: "Head", name: "Emmanuel Jose Rivera" },
        { title: "Asst. Head", name: "Angelica Mae Torres" },
        { title: "Secretary", name: "Francisco Paul Moreno" },
        { title: "Member", name: "Vanessa Joy Diaz" },
        { title: "Member", name: "Roberto Miguel Aguilar" },
      ],
    },
    {
      name: "Finance",
      color: "#ca8a04",
      bgColor: "bg-yellow-50",
      members: [
        { title: "Head", name: "Victoria Grace Tan" },
        { title: "Asst. Head", name: "Joshua Daniel Lim" },
        { title: "Secretary", name: "Stephanie Rose Ong" },
        { title: "Member", name: "Michael Andre Chua" },
      ],
    },
    {
      name: "Sports & Cultural",
      color: "#dc2626",
      bgColor: "bg-red-50",
      members: [
        { title: "Head", name: "Christian Mark Velasco" },
        { title: "Asst. Head", name: "Amanda Faith Salazar" },
        { title: "Secretary", name: "Lucas James Navarro" },
        { title: "Member", name: "Samantha Rose Cruz" },
        { title: "Member", name: "Matthew Jose Reyes" },
      ],
    },
    {
      name: "Media & Documentation",
      color: "#4f46e5",
      bgColor: "bg-indigo-50",
      members: [
        { title: "Head", name: "Catherine Joy Mendoza" },
        { title: "Asst. Head", name: "Rafael Antonio Santos" },
        { title: "Secretary", name: "Gabrielle Marie Pascual" },
        { title: "Member", name: "Nathan Carl Domingo" },
        { title: "Member", name: "Arianna Faith Bautista" },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-white/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#003599] to-[#0055cc] text-white p-8 flex justify-between items-start">
          <div>
            {/* --- FONT: Rubik --- */}
            <h2 className="font-rubik text-3xl font-bold mb-2">
              Complete Meeting Attendance
            </h2>
            {/* --- FONT: Raleway --- */}
            <p className="font-raleway text-blue-200 text-lg">
              ICpEP.SE CIT-U Chapter - Quarterly Board Meeting
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
          {/* Council Officers */}
          <div className="bg-[#003599]/5 rounded-xl p-4">
            {/* --- FONT: Rubik --- */}
            <h3 className="font-rubik text-base font-semibold text-[#003599] mb-3 flex items-center">
              <span className="w-2.5 h-2.5 bg-[#003599] rounded-full mr-2"></span>
              Council Officers
            </h3>
            <div className="space-y-2">
              {councilOfficers.map((officer, index) => (
                // --- FONT: Raleway ---
                <div
                  key={index}
                  className="font-raleway flex items-center justify-between p-2.5 bg-white rounded-lg shadow-sm border-l-4 border-[#003599]"
                >
                  <span className="font-medium text-[#003599] text-sm min-w-[90px]">
                    {officer.title}
                  </span>
                  <span className="text-gray-700 text-right text-sm">
                    {officer.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Committees */}
          {committees.map((committee, idx) => (
            <div key={idx} className={`${committee.bgColor} rounded-xl p-4`}>
              {/* --- FONT: Rubik --- */}
              <h3
                className="font-rubik text-base font-semibold mb-3 flex items-center"
                style={{ color: committee.color }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full mr-2"
                  style={{ backgroundColor: committee.color }}
                ></span>
                {committee.name}
              </h3>
              <div className="space-y-2">
                {committee.members.map((member, index) => (
                  // --- FONT: Raleway ---
                  <div
                    key={index}
                    className="font-raleway flex items-center justify-between p-2.5 bg-white rounded-lg shadow-sm border-l-4"
                    style={{ borderLeftColor: committee.color }}
                  >
                    <span
                      className="font-medium text-sm min-w-[90px]"
                      style={{ color: committee.color }}
                    >
                      {member.title}
                    </span>
                    <span className="text-gray-700 text-right text-sm">
                      {member.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
