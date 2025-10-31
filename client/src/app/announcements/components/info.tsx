import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Announcement } from "../utils/announcements";
import { formatDate } from "../utils/announcements";

interface DetailsSidebarProps {
  announcement?: Announcement;
}

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-4">
    <div className="flex h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 items-center justify-center rounded-lg bg-primary1/10 text-primary1">
      {icon}
    </div>
    <div>
      <p className="font-raleway font-semibold text-primary3 leading-tight">
        {label}
      </p>
      <p className="font-raleway text-bodytext leading-tight">{value}</p>
    </div>
  </div>
);

export default function DetailsSidebar({ announcement }: DetailsSidebarProps) {
  if (!announcement) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-lg">
      <h3 className="font-rubik text-xl sm:text-2xl font-bold text-primary3 mb-4 pb-2 border-b border-gray-100">
        {announcement.type} Details
      </h3>

      <div className="space-y-4">
        <DetailRow
          icon={<Calendar className="h-6 w-6" />}
          label="Date"
          value={formatDate(announcement.date)}
        />

        {announcement.time && (
          <DetailRow
            icon={<Clock className="h-6 w-6" />}
            label="Time"
            value={announcement.time}
          />
        )}

        {announcement.location && (
          <DetailRow
            icon={<MapPin className="h-6 w-6" />}
            label="Location"
            value={announcement.location}
          />
        )}

        {announcement.organizer && (
          <DetailRow
            icon={<Users className="h-6 w-6" />}
            label="Organizer"
            value={announcement.organizer}
          />
        )}
      </div>
    </div>
  );
}
