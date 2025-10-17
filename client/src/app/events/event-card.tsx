import Link from "next/link";
import { Event } from "./data/event"; // Assuming your types are here

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

  return (
    <Link
      href={`/events/${event.id}`}
      className="group block overflow-hidden rounded-2xl border border-gray-200 shadow-lg transition-all duration-300 ease-in-out hover:shadow-primary1/40 hover:-translate-y-1"
    >
      <div className="h-48 overflow-hidden">
        <img
          src={event.bannerImageUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6 bg-white">
        <p className="font-raleway text-sm font-medium text-primary1">
          {formattedDate}
        </p>
        <h3 className="font-rubik mt-2 text-xl font-bold text-primary3 truncate">
          {event.title}
        </h3>
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
