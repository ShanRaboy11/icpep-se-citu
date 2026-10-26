"use client";

import { Check, Globe, Shield, Users } from "lucide-react";
import { labelStyle } from "@/app/components/ui/form-styles";

const VISIBILITY_OPTIONS = [
  {
    value: "public",
    label: "Public",
    sublabel: "Everyone can see this",
    icon: Globe,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  {
    value: "members",
    label: "Members Only",
    sublabel: "Registered members",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  {
    value: "officers",
    label: "Officers Only",
    sublabel: "Organization officers",
    icon: Shield,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    dot: "bg-violet-500",
  },
] as const;

interface VisibilityPickerProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: boolean;
}

export default function VisibilityPicker({ value, onChange, required = false, error = false }: VisibilityPickerProps) {
  return (
    <div className="w-full">
      <label className={labelStyle}>
        Visibility {required && <span className="text-red-500">*</span>}
      </label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {VISIBILITY_OPTIONS.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-200 ${
                active
                  ? `${option.bg} ${option.color} ${option.border}`
                  : "border-gray-100 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-600"
              }`}
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${active ? option.dot : "bg-gray-200"}`} />
              <div className="min-w-0 flex-1">
                <p className="font-rubik text-xs font-bold leading-tight">{option.label}</p>
                <p
                  className={`mt-0.5 truncate font-raleway text-[14px] font-semibold ${active ? "opacity-90" : "text-gray-300"}`}
                >
                  {option.sublabel}
                </p>
              </div>
              {active && <Check size={12} className="shrink-0 opacity-70" />}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1 ml-2 font-raleway text-xs text-red-500">Visibility is required</p>}
    </div>
  );
}
