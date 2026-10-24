import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export default function Checkbox({
  checked,
  onChange,
  label,
  className = "",
}: CheckboxProps) {
  return (
    <span
      className={`relative inline-flex h-5 w-5 shrink-0 items-center justify-center ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={label}
        className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
      />
      <span className="h-5 w-5 rounded-md border-2 border-gray-300 bg-white transition-all peer-hover:border-primary1 peer-checked:border-primary1 peer-checked:bg-primary1 peer-focus-visible:ring-4 peer-focus-visible:ring-primary1/20" />
      <Check
        strokeWidth={3}
        className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
      />
    </span>
  );
}
