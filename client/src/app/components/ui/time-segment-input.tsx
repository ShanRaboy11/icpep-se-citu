"use client";

import type { ChangeEvent, FocusEvent, MouseEvent } from "react";

type Segment = "hour" | "minute" | "period";

interface TimeSegmentInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  type: Segment;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

const MAX: Record<"hour" | "minute", number> = { hour: 12, minute: 59 };
const MIN: Record<"hour" | "minute", number> = { hour: 1, minute: 0 };

export default function TimeSegmentInput({
  id,
  value,
  onChange,
  options,
  type,
  activeId,
  setActiveId,
}: TimeSegmentInputProps) {
  const isOpen = activeId === id;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (type === "period") {
      const lower = val.toLowerCase();
      const next = lower.includes("p") ? "PM" : lower.includes("a") ? "AM" : null;
      if (next) {
        onChange(next);
        setTimeout(() => e.target.select(), 0);
      }
      return;
    }
    if (val !== "" && !/^\d*$/.test(val)) return;
    if (val.length > 2) return;
    if (val !== "" && parseInt(val) > MAX[type]) return;
    onChange(val);
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (!isOpen) setActiveId(id);
    e.target.select();
  };

  const handleMouseDown = (e: MouseEvent<HTMLInputElement>) => {
    if (document.activeElement !== e.currentTarget) return;
    setActiveId(isOpen ? null : id);
    e.preventDefault();
    e.currentTarget.select();
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (activeId === id) setActiveId(null);
    }, 200);
    if (type === "period") {
      if (value !== "AM" && value !== "PM") onChange("AM");
      return;
    }
    const num = Math.min(MAX[type], Math.max(MIN[type], parseInt(value || "0")));
    onChange(num.toString().padStart(2, "0"));
  };

  return (
    <div className="relative flex-1 h-full group">
      <input
        type="text"
        className="w-full h-full text-center bg-transparent outline-none font-rubik text-base text-gray-700 font-medium placeholder-gray-300 transition-colors cursor-pointer caret-transparent focus:text-primary1 selection:bg-transparent selection:text-primary1"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onMouseDown={handleMouseDown}
        onBlur={handleBlur}
        maxLength={2}
        autoComplete="off"
      />
      {isOpen && (
        <div
          className="absolute z-30 w-full min-w-20 mt-2 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden left-1/2 -translate-x-1/2 text-center"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex flex-col gap-1 p-2 max-h-56 overflow-y-auto overflow-x-hidden themed-scrollbar">
            {options.map((opt) => (
              <div
                key={opt}
                className={`flex items-center justify-center px-3 py-2 rounded-xl cursor-pointer transition-colors font-rubik text-sm font-medium ${
                  value === opt ? "bg-primary1/5 text-primary1" : "hover:bg-gray-50 text-gray-700"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(opt);
                  setActiveId(null);
                }}
              >
                <span>{opt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
