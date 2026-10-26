import InfoRow from "@/app/components/ui/info-row";
import SectionHeading from "@/app/components/ui/section-heading";
import {
  CalendarDaysIcon,
  ClockIcon,
  ComputerDesktopIcon,
  MapPinIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Announcement } from "../../utils/announcements/announcements";
import { formatDate, formatTime } from "../../utils/announcements/announcements";

interface DetailsSidebarProps {
  announcement?: Announcement;
}

export default function DetailsSidebar({ announcement }: DetailsSidebarProps) {
  if (!announcement) return null;

  const isOnline =
    announcement.location &&
    /zoom|google meet|gmeet|meet|ms teams|teams|online|discord|webinar/i.test(
      announcement.location,
    );

  const locationLabel = isOnline ? "Platform" : "Location";

  return (
    <div className="rounded-3xl border border-primary1/15 bg-white p-5 shadow-md sm:p-6">
      <SectionHeading as="h3" className="mb-5">{announcement.type} Details</SectionHeading>

      <div className="space-y-3">
        <InfoRow tone="tile"
          icon={<CalendarDaysIcon className="h-7 w-7" />}
          label="Date"
          value={formatDate(announcement.date)}
        />

        {announcement.time && (
          <InfoRow tone="tile"
            icon={<ClockIcon className="h-7 w-7" />}
            label="Time"
            value={formatTime(announcement.time)}
          />
        )}

        {announcement.location && (
          <InfoRow tone="tile"
            icon={
              isOnline ? (
                <ComputerDesktopIcon className="h-7 w-7" />
              ) : (
                <MapPinIcon className="h-7 w-7" />
              )
            }
            label={locationLabel}
            value={announcement.location}
          />
        )}

        {announcement.organizer && (
          <InfoRow tone="tile"
            icon={<UserGroupIcon className="h-7 w-7" />}
            label="Organizer"
            value={announcement.organizer}
          />
        )}
      </div>
    </div>
  );
}
