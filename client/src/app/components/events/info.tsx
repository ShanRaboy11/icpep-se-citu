import InfoRow from "@/app/components/ui/info-row";
import {
  CalendarDaysIcon,
  ComputerDesktopIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

interface Props {
  date: string;
  mode: "Online" | "Onsite";
  location: string;
}

export default function EventInfo({ date, mode, location }: Props) {
  const eventDate = new Date(date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
      <InfoRow
        icon={<CalendarDaysIcon className="h-6 w-6" />}
        label={formattedDate}
        value={formattedTime}
      />
      <InfoRow
        icon={
          mode === "Online" ? (
            <ComputerDesktopIcon className="h-6 w-6" />
          ) : (
            <MapPinIcon className="h-6 w-6" />
          )
        }
        label={mode}
        value={location}
      />
    </div>
  );
}
