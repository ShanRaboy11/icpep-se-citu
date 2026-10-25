export default function CountBadge({ count, className = "" }: { count: number; className?: string }) {
  if (count <= 0) return null;

  return (
    <span
      className={`inline-flex min-w-6 items-center justify-center rounded-full bg-primary1 px-2 py-0.5 font-rubik text-xs font-bold leading-none text-white ${className}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
