import StatusPill from "@/app/components/ui/status-pill";

interface Props {
  status?: "Upcoming" | "Ongoing" | "Ended";
  title: string;
}

const STATUS = {
  Ended: { label: "Registration Closed", dot: "bg-red-400" },
  Ongoing: { label: "Event in Progress", dot: "bg-sky-300 animate-pulse" },
  Upcoming: { label: "Registration Open", dot: "bg-green-400" },
};

export default function EventHeader({ status, title }: Props) {
  const current = status ? STATUS[status] : null;

  return (
    <div>
      {current && <StatusPill label={current.label} dotClassName={current.dot} className="mb-4" />}
      <h1 className="font-rubik text-3xl font-bold leading-tight text-white sm:text-4xl">{title}</h1>
    </div>
  );
}
