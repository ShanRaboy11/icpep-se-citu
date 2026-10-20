import {
  CalendarDaysIcon,
  ComputerDesktopIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const InfoDetailRow = ({
  icon,
  line1,
  line2,
}: {
  icon: React.ReactNode;
  line1: string;
  line2: string;
}) => (
  <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3.5 sm:gap-4 sm:p-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white sm:h-12 sm:w-12">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="font-raleway text-sm font-semibold leading-tight text-white sm:text-base">
        {line1}
      </p>
      <p className="font-raleway text-sm leading-tight text-white/80 sm:text-base">
        {line2}
      </p>
    </div>
  </div>
);

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
      <InfoDetailRow
        icon={<CalendarDaysIcon className="h-6 w-6" />}
        line1={formattedDate}
        line2={formattedTime}
      />
      <InfoDetailRow
        icon={
          mode === "Online" ? (
            <ComputerDesktopIcon className="h-6 w-6" />
          ) : (
            <MapPinIcon className="h-6 w-6" />
          )
        }
        line1={mode}
        line2={location}
      />
    </div>
  );
}
