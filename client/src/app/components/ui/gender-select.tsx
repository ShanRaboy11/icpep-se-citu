export type GenderValue = "male" | "female" | "";

const OPTIONS: { value: GenderValue; label: string }[] = [
  { value: "", label: "Auto" },
  { value: "male", label: "Man" },
  { value: "female", label: "Woman" },
];

interface GenderSelectProps {
  value: GenderValue;
  onChange: (value: GenderValue) => void;
}

export default function GenderSelect({ value, onChange }: GenderSelectProps) {
  return (
    <div className="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={`cursor-pointer whitespace-nowrap rounded-xl px-4 py-1.5 font-raleway text-sm font-semibold transition-all ${
            value === option.value
              ? "bg-white text-primary1 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
