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
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 bg-buttonbg1 rounded-lg flex items-center justify-center text-primary1 flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="font-raleway font-semibold text-primary3 leading-tight">
        {line1}
      </p>
      <p className="font-raleway text-bodytext leading-tight">{line2}</p>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <InfoDetailRow
        icon={<CalendarDaysIcon className="h-7 w-7" />}
        line1={formattedDate}
        line2={formattedTime}
      />
      <InfoDetailRow
        icon={
          mode === "Online" ? (
            <ComputerDesktopIcon className="h-7 w-7" />
          ) : (
            <MapPinIcon className="h-7 w-7" />
          )
        }
        line1={mode}
        line2={location}
      />
    </div>
  );
}
