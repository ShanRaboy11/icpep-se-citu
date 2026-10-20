interface Props {
  status?: "Upcoming" | "Ongoing" | "Ended";
  title: string;
}

export default function EventHeader({ status, title }: Props) {
  const isEventOver = status === "Ended";
  const isOngoing = status === "Ongoing";

  const statusText = isEventOver
    ? "Registration Closed"
    : isOngoing
      ? "Event in Progress"
      : "Registration Open";

  const dot = isEventOver
    ? "bg-red-400"
    : isOngoing
      ? "bg-sky-300 animate-pulse"
      : "bg-green-400";

  return (
    <div>
      {status && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-primary3/40 px-4 py-1.5 font-raleway text-sm font-semibold text-white">
          <div className={`h-2 w-2 rounded-full ${dot}`} />
          {statusText}
        </div>
      )}
      <h1 className="font-rubik text-3xl font-bold leading-tight text-white sm:text-4xl">
        {title}
      </h1>
    </div>
  );
}
