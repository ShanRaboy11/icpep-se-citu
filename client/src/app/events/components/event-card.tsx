import Link from "next/link";
import { Event } from "../utils/event";

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const getStatusStyles = (status: Event["status"]) => {
    switch (status) {
      case "Upcoming":
        return "bg-green-100 text-green-800 ring-green-600/20";
      case "Ongoing":
        return "bg-blue-100 text-blue-800 ring-blue-600/20";
      case "Ended":
        return "bg-red-100 text-red-800 ring-red-600/20";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 shadow-lg transition-all duration-300 ease-in-out hover:shadow-primary1/40 hover:-translate-y-1"
    >
      <div className="relative h-48 flex-shrink-0 overflow-hidden">
        <img
          src={event.bannerImageUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-rubik font-semibold ring-1 ring-inset ${getStatusStyles(
            event.status
          )}`}
        >
          {event.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 bg-white">
        <div>
          <p className="font-raleway text-sm font-medium text-primary1">
            {formattedDate}
          </p>
          <h3 className="font-rubik mt-2 text-xl font-bold text-primary3">
            {event.title}
          </h3>
          <p className="font-raleway mt-3 text-sm text-gray-600 line-clamp-2">
            {event.description}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {event.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-buttonbg1 px-2 py-1 text-xs font-raleway font-semibold text-primary3"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
