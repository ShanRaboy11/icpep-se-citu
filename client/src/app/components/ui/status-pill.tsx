interface StatusPillProps {
  label: string;
  dotClassName: string;
  className?: string;
}

export default function StatusPill({ label, dotClassName, className = "" }: StatusPillProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-white/30 bg-primary3/40 px-4 py-1.5 font-raleway text-sm font-semibold text-white ${className}`}
    >
      <div className={`h-2 w-2 rounded-full ${dotClassName}`} />
      {label}
    </div>
  );
}
