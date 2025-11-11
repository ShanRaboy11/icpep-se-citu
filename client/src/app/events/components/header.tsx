// components/event-header.tsx
interface Props {
  status?: "Upcoming" | "Ongoing" | "Ended";
  title: string;
}

export default function EventHeader({ status, title }: Props) {
  const isEventOver = status === "Ended";
  const isOngoing = status === "Ongoing";
  
  const getStatusText = () => {
    if (isEventOver) return "Registration Closed";
    if (isOngoing) return "Event in Progress";
    return "Registration Open";
  };
  
  const getStatusStyles = () => {
    if (isEventOver) return {
      container: "bg-red-100 text-red-800",
      dot: "bg-red-500"
    };
    if (isOngoing) return {
      container: "bg-blue-100 text-blue-800",
      dot: "bg-blue-500"
    };
    return {
      container: "bg-green-100 text-green-800",
      dot: "bg-green-500"
    };
  };
  
  const styles = getStatusStyles();
  
  return (
    <div>
      {status && (
        <div
          className={`font-raleway font-semibold text-sm inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full ${styles.container}`}
        >
          <div className={`w-2 h-2 rounded-full ${styles.dot}`} />
          {getStatusText()}
        </div>
      )}
      <h1 className="font-rubik text-3xl sm:text-4xl font-bold text-primary3 leading-tight">
        {title}
      </h1>
    </div>
  );
}