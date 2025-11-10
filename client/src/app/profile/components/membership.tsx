//membership.tsx
interface MembershipBadgeProps {
  type: "both" | "local" | "regional";
}

export function MembershipBadge({ type }: MembershipBadgeProps) {
  const styles = {
    both: "bg-purple-100 text-purple-700 border-purple-200",
    local: "bg-secondary2/10 text-secondary2 border-secondary2/30",
    regional: "bg-cyan-100 text-cyan-700 border-cyan-200",
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
