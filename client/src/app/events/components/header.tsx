import { Event } from "../data/event";

interface Props {
  status: Event["status"];
  title: string;
}

export default function EventHeader({ status, title }: Props) {
  const isEventOver = status === "Ended";
  return (
    <div>
      <div
        className={`font-raleway font-semibold text-sm inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full ${
          isEventOver
            ? "bg-red-100 text-red-800"
            : "bg-green-100 text-green-800"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            isEventOver ? "bg-red-500" : "bg-green-500"
          }`}
        />
        {isEventOver ? "Event Ended" : "Registration Open"}
      </div>
      <h1 className="font-rubik text-4xl font-bold text-primary3 leading-tight">
        {title}
      </h1>
    </div>
  );
}
