"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { useDropdownDismiss } from "@/app/hooks/use-dropdown-dismiss";

export interface DropdownOption {
  value: string;
  label: string;
}

export const dropdownOuterStyle =
  "absolute z-30 min-w-full w-max max-w-[90vw] mt-2 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden";
export const dropdownInnerStyle =
  "flex flex-col gap-1 p-2 max-h-56 overflow-y-auto themed-scrollbar";
export const dropdownItemStyle =
  "flex items-center justify-between gap-3 whitespace-nowrap px-4 py-2.5 rounded-xl cursor-pointer transition-colors font-rubik text-sm font-medium";
export const dropdownItemSelectedStyle = "bg-primary1/5 text-primary1";
export const dropdownItemHoverStyle = "hover:bg-gray-50 text-gray-700";

const PANEL_STYLE =
  "fixed z-100001 w-max max-w-[90vw] bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden";

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  invalid?: boolean;
  variant?: "filter" | "field" | "pill";
  align?: "left" | "right";
  className?: string;
}

const TRIGGER_BASE =
  "w-full border cursor-pointer flex items-center justify-between gap-2 text-left transition-all";
const TRIGGER_VARIANT = {
  filter: "rounded-2xl bg-white px-4 py-2.5 text-gray-700 hover:bg-gray-50",
  field: "rounded-2xl bg-gray-50 px-4 py-3 text-gray-800 hover:bg-white",
  pill: "rounded-full bg-white px-3 py-2 text-primary1 hover:bg-primary1/5",
};
const TEXT_VARIANT = {
  filter: "text-sm font-medium",
  field: "text-base",
  pill: "text-xs font-bold",
};

interface Position {
  top: number;
  left: number;
  minWidth: number;
}

export default function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select",
  invalid = false,
  variant = "filter",
  align = "left",
  className = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDropdownDismiss(open, close);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    const place = () => {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;

      const rect = trigger.getBoundingClientRect();
      const height = panel.offsetHeight;
      const width = panel.offsetWidth;
      const below = window.innerHeight - rect.bottom;
      const up = below < height + 16 && rect.top > below;
      const left = align === "right" ? rect.right - width : rect.left;

      setPosition({
        top: up ? Math.max(8, rect.top - height - 8) : rect.bottom + 8,
        left: Math.max(8, Math.min(left, window.innerWidth - width - 8)),
        minWidth: rect.width,
      });
    };

    const onScroll = (event: Event) => {
      if (!panelRef.current?.contains(event.target as Node)) place();
    };

    place();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", place);
    };
  }, [open, align]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const selected = options.find((option) => option.value === value);
  const borderStyle = invalid
    ? "border-red-300 ring-2 ring-red-100"
    : open
      ? "border-primary1 ring-4 ring-primary1/10"
      : variant === "pill"
        ? "border-primary1/20"
        : "border-gray-200";

  return (
    <div data-dropdown className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`${TRIGGER_BASE} ${TRIGGER_VARIANT[variant]} ${borderStyle}`}
      >
        <span className={`font-rubik truncate ${TEXT_VARIANT[variant]} ${selected ? "" : "text-gray-400"}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
            variant === "pill" ? "text-primary1" : "text-gray-400"
          } ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            data-dropdown
            style={{
              top: position?.top ?? 0,
              left: position?.left ?? 0,
              minWidth: position?.minWidth,
              visibility: position ? "visible" : "hidden",
            }}
            className={PANEL_STYLE}
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
          </div>,
          document.body,
        )}
    </div>
  );
}
