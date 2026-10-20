import { Calendar, MapPin, Clock, Users, Monitor } from "lucide-react";
import { Announcement } from "../utils/announcements";
import { formatDate, formatTime } from "../utils/announcements";

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
  <div className="flex items-center gap-4 rounded-2xl bg-buttonbg1/60 p-3.5">
    <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-primary1 text-white">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="font-raleway font-semibold text-primary3 leading-tight">
        {label}
      </p>
      <p className="font-raleway text-bodytext leading-tight wrap-break-word">{value}</p>
    </div>
  </div>
);

export default function DetailsSidebar({ announcement }: DetailsSidebarProps) {
  if (!announcement) return null;

  const isOnline =
    announcement.location &&
    /zoom|google meet|gmeet|meet|ms teams|teams|online|discord|webinar/i.test(
      announcement.location,
    );

  const locationLabel = isOnline ? "Platform" : "Location";

  return (
    <div className="rounded-3xl border border-primary1/15 bg-white p-5 shadow-lg sm:p-6">
      <h3 className="mb-5 flex items-center gap-3 font-rubik text-xl font-bold text-primary3 sm:text-2xl">
        <span className="h-6 w-1.5 rounded-full bg-primary1" />
        {announcement.type} Details
      </h3>

      <div className="space-y-3">
        <DetailRow
          icon={<Calendar className="h-6 w-6" />}
          label="Date"
          value={formatDate(announcement.date)}
        />

        {announcement.time && (
          <DetailRow
            icon={<Clock className="h-6 w-6" />}
            label="Time"
            value={formatTime(announcement.time)}
          />
        )}

        {announcement.location && (
          <DetailRow
            icon={
              isOnline ? (
                <Monitor className="h-6 w-6" />
              ) : (
                <MapPin className="h-6 w-6" />
              )
            }
            label={locationLabel}
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
