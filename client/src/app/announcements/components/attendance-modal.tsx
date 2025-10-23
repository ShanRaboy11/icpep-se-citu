import Image from "next/image";
import { X } from "lucide-react";
import {
  Announcement,
  Officer,
  Committee,
  councilOfficers,
  committees,
} from "../utils/announcements";

const lightenColor = (hex: string, percent: number) => {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
};

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: Announcement | null;
}

export default function AttendanceModal({
  isOpen,
  onClose,
  announcement,
}: AttendanceModalProps) {
  if (!isOpen || !announcement) return null;

  const formattedDate = new Date(announcement.date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const subtitleParts = [formattedDate];
  if (announcement.time) {
    subtitleParts.push(announcement.time);
  }
  if (announcement.location) {
    subtitleParts.push(announcement.location);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative flex flex-col w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white text-gray-800 shadow-2xl">
        {/* --- inverted Light Header --- */}
        <div className="relative flex flex-col items-center justify-center p-8 text-center border-b border-gray-200">
          <Image
            src="/icpep logo.png"
            alt="ICpEP Logo"
            width={64}
            height={64}
            className="mb-4 rounded-full"
          />
          <h2 className="font-rubik text-3xl font-bold text-primary3">
            {`${announcement.title}`}
          </h2>
          <p className="font-raleway text-gray-500 text-lg">
            {subtitleParts.join(" • ")}
          </p>

          <button
            onClick={onClose}
            className="group absolute top-4 right-4 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 cursor-pointer"
          >
            <X className="h-6 w-6 transition-transform duration-300 ease-in-out group-hover:rotate-90" />
          </button>
        </div>

        {/* Modal Content */}
        {/* provides the needed bottom space --- */}
        <div className="themed-scrollbar flex-1 space-y-6 overflow-y-auto bg-gray-50 p-8">
          {/* Council Officers with Gradient */}
          <div
            className="rounded-xl p-4 text-white"
            style={{
              background: `linear-gradient(to right, ${lightenColor(
                "#003599",
                15
              )}, #003599)`,
            }}
          >
            <h3 className="font-rubik mb-3 flex items-center text-base font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-white/70 mr-2"></span>
              Council Officers
            </h3>
            <div className="space-y-2">
              {councilOfficers.map((officer, index) => (
                <div
                  key={index}
                  className="font-raleway flex items-center justify-between rounded-lg bg-black/20 p-2.5"
                >
                  <span className="text-sm font-medium text-white min-w-[90px]">
                    {officer.title}
                  </span>
                  <span className="text-right text-sm">{officer.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Committees */}
          {committees.map((committee, idx) => (
            <div
              key={idx}
              className="rounded-xl p-4 text-white"
              style={{
                background: `linear-gradient(to right, ${lightenColor(
                  committee.color,
                  25
                )}, ${committee.color})`,
              }}
            >
              <h3 className="font-rubik mb-3 flex items-center text-base font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-white/70 mr-2"></span>
                {committee.name}
              </h3>
              <div className="space-y-2">
                {committee.members.map((member, index) => (
                  <div
                    key={index}
                    className="font-raleway flex items-center justify-between rounded-lg bg-black/20 p-2.5"
                  >
                    <span className="text-sm font-medium text-white min-w-[90px]">
                      {member.title}
                    </span>
                    <span className="text-right text-sm">{member.name}</span>
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
