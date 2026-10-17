"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useDropdownDismiss } from "@/app/utils/use-dropdown-dismiss";

export interface DropdownOption {
  value: string;
  label: string;
}

const dropdownOuterStyle =
  "absolute z-30 min-w-full w-max max-w-[90vw] mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden";
const dropdownInnerStyle =
  "flex flex-col gap-1 p-2 max-h-56 overflow-y-auto themed-scrollbar";
const dropdownItemStyle =
  "flex items-center justify-between gap-3 whitespace-nowrap px-4 py-2.5 rounded-xl cursor-pointer transition-colors font-rubik text-sm font-medium";
const dropdownItemSelectedStyle = "bg-primary1/5 text-primary1";
const dropdownItemHoverStyle = "hover:bg-gray-50 text-gray-700";

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  invalid?: boolean;
  variant?: "filter" | "field";
  className?: string;
}

const TRIGGER_BASE =
  "w-full border rounded-2xl cursor-pointer flex items-center justify-between gap-2 text-left transition-all";
const TRIGGER_VARIANT = {
  filter: "bg-white px-4 py-2.5 text-gray-700 hover:bg-gray-50",
  field: "bg-gray-50 px-4 py-3 text-gray-800 hover:bg-white",
};

const scrollParent = (element: HTMLElement): HTMLElement | null => {
  let parent = element.parentElement;
  while (parent) {
    const overflowY = getComputedStyle(parent).overflowY;
    if (overflowY === "auto" || overflowY === "scroll") return parent;
    parent = parent.parentElement;
  }
  return null;
};

export default function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select",
  invalid = false,
  variant = "filter",
  className = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useDropdownDismiss(open, () => setOpen(false));

  useEffect(() => {
    if (!open) {
      setDropUp(false);
      return;
    }
    const frame = requestAnimationFrame(() => {
      const root = rootRef.current;
      const panel = panelRef.current;
      if (!root || !panel) return;

      const bounds = scrollParent(root)?.getBoundingClientRect() ?? {
        top: 0,
        bottom: window.innerHeight,
      };
      const rect = panel.getBoundingClientRect();
      const spaceAbove = root.getBoundingClientRect().top - bounds.top;

      if (rect.bottom > bounds.bottom - 8 && spaceAbove > rect.height + 8) {
        setDropUp(true);
      } else {
        panel.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const selected = options.find((option) => option.value === value);
  const borderStyle = invalid
    ? "border-red-300 ring-2 ring-red-100"
    : open
      ? "border-primary1 ring-4 ring-primary1/10"
      : "border-gray-200";

  return (
    <div ref={rootRef} data-dropdown className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`${TRIGGER_BASE} ${TRIGGER_VARIANT[variant]} ${borderStyle}`}
      >
        <span
          className={`font-rubik truncate ${variant === "field" ? "text-base" : "text-sm font-medium"} ${
            selected ? "" : "text-gray-400"
          }`}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          className={`${dropdownOuterStyle} scroll-mb-4 ${dropUp ? "bottom-full mb-2 mt-0!" : ""}`}
        >
          <div role="listbox" className={dropdownInnerStyle}>
            {options.map((option) => (
              <div
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                className={`${dropdownItemStyle} ${
                  option.value === value ? dropdownItemSelectedStyle : dropdownItemHoverStyle
                }`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <span>{option.label}</span>
                {option.value === value && <Check className="w-4 h-4 text-primary1" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
