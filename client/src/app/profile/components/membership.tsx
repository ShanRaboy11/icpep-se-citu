interface MembershipBadgeProps {
  type: "both" | "local" | "regional";
}

export function MembershipBadge({ type }: MembershipBadgeProps) {
  const styles = {
    both: "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border-purple-300 shadow-sm",
    local: "bg-gradient-to-r from-secondary2/10 to-secondary2/5 text-secondary2 border-secondary2/30 shadow-sm",
    regional: "bg-gradient-to-r from-cyan-100 to-cyan-50 text-cyan-700 border-cyan-300 shadow-sm",
  };

  const label = {
    both: "Local & Regional Member",
    local: "Local",
    regional: "Regional",
  };

  return (
    <span
      className={`px-5 py-2 text-md sm:mr-10 rounded-xl font-semibold border ${styles[type]} transition-all duration-200 hover:scale-105`}
    >
      {label[type]}
    </span>
  );
}