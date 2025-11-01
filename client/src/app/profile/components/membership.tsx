interface MembershipBadgeProps {
  type: "both" | "local" | "regional";
}

export function MembershipBadge({ type }: MembershipBadgeProps) {
  const styles = {
    both: "bg-yellow-400 text-black",
    local: "bg-green-500 text-white",
    regional: "bg-orange-500 text-white",
  };

  const label = {
    both: "Both",
    local: "Local",
    regional: "Regional",
  };

  return (
    <span
      className={`px-4 py-1 text-md sm:mr-10 rounded-xl font-medium ${styles[type]}`}
    >
      {label[type]}
    </span>
  );
}
