import { councilOfficers } from "../utils/announcements";

interface MeetingAttendanceCardProps {
  onViewFull: () => void;
  attendanceLink?: string | null;
}

export default function MeetingAttendanceCard({
  onViewFull,
  attendanceLink,
}: MeetingAttendanceCardProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary3 to-secondary1 p-6 text-white shadow-lg">
      <h3 className="font-rubik text-xl font-bold text-white mb-4 pb-4 border-b border-white/20">
        Meeting Attendance
      </h3>

      <div className="bg-white/10 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
        <div className="space-y-3">
          <div>
            <h4 className="font-rubik text-sm font-semibold text-white/90 mb-2">
              Council Officers
            </h4>
            
            {councilOfficers.slice(0, 4).map((officer, index) => (
              <div
                key={index}
                className="font-raleway flex justify-between py-1.5 text-sm"
              >
                <span className="text-white/70">{officer.title}</span>
                <span className="font-medium text-white">{officer.name}</span>
              </div>
            ))}
            <p className="font-raleway text-xs text-white/60 mt-2">
              +{councilOfficers.length - 4} more officers
            </p>
          </div>
        </div>
      </div>

      {attendanceLink && (
        <div className="mt-4 mb-3">
          <a
            href={attendanceLink}
            target="_blank"
            rel="noreferrer"
            className="inline-block w-full text-center rounded-md bg-white/10 hover:bg-white/20 px-4 py-2 text-sm font-medium"
          >
            Open attendance link
          </a>
        </div>
      )}

      <button
        onClick={onViewFull}
        className="font-rubik w-full rounded-lg border border-white/50 bg-transparent 
                   py-3 px-6 font-semibold text-white 
                   transition-all duration-300 ease-in-out 
                   hover:bg-white hover:text-primary3 active:scale-95 cursor-pointer"
      >
        View Full Attendance
      </button>
    </div>
  );
}
