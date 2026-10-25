import type { ReactNode } from "react";

interface InfoRowProps {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: "glass" | "tile";
}

const TONES = {
  glass: {
    row: "bg-white/10 p-3.5 sm:gap-4 sm:p-4",
    icon: "bg-white/15 text-white sm:h-12 sm:w-12",
    label: "text-sm font-semibold text-white sm:text-base",
    value: "text-sm text-white/80 sm:text-base",
  },
  tile: {
    row: "bg-buttonbg1/60 p-3.5 sm:gap-4",
    icon: "bg-primary1 text-white sm:h-11 sm:w-11",
    label: "font-semibold text-primary3",
    value: "text-bodytext",
  },
};

export default function InfoRow({ icon, label, value, tone = "glass" }: InfoRowProps) {
  const styles = TONES[tone];

  return (
    <div className={`flex items-center gap-3 rounded-2xl ${styles.row}`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}>{icon}</div>
      <div className="min-w-0 font-raleway">
        <p className={`leading-tight ${styles.label}`}>{label}</p>
        <p className={`leading-tight wrap-break-word ${styles.value}`}>{value}</p>
      </div>
    </div>
  );
}
