"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import Button from "../ui/button";
import { CHAPTER_FOUNDED_YEAR } from "@/app/utils/site";

export const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const FILTER_YEARS = Array.from(
  { length: Math.max(1, new Date().getFullYear() - CHAPTER_FOUNDED_YEAR + 1) },
  (_, i) => new Date().getFullYear() - i,
);

export interface FilterCategory {
  name: string;
  icon: ReactNode;
}

interface DateSelection {
  years: number[];
  months: number[];
}

export const matchesDateFilter = (value: string, { years, months }: DateSelection) => {
  const date = new Date(value);
  if (years.length > 0 && !years.includes(date.getFullYear())) return false;
  if (months.length > 0 && !months.includes(date.getMonth())) return false;
  return true;
};

const toggle = (list: number[], value: number) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

const groupRanges = (items: number[], getLabel: (value: number) => string) => {
  if (items.length === 0) return [];
  const sorted = [...items].sort((a, b) => a - b);
  const ranges: { label: string; original: number[] }[] = [];
  let start = sorted[0];
  let end = sorted[0];
  for (let i = 1; i <= sorted.length; i++) {
    if (i < sorted.length && sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      ranges.push({
        label: start === end ? getLabel(start) : `${getLabel(start)} - ${getLabel(end)}`,
        original: sorted.filter((n) => n >= start && n <= end),
      });
      if (i < sorted.length) {
        start = sorted[i];
        end = sorted[i];
      }
    }
  }
  return ranges;
};

const POPOVER =
  "absolute top-[125%] right-0 w-64 bg-white rounded-3xl shadow-lg border border-gray-100 z-50 p-5 animate-in fade-in zoom-in-95 duration-200";
const TRIGGER =
  "flex items-center justify-center h-13 w-13 bg-white border-2 rounded-2xl transition-all hover:border-primary1 cursor-pointer";
const RESET_BUTTON =
  "flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 rounded-full transition-colors group cursor-pointer";
const CHIP =
  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold font-rubik border";

function ResetLabel({ label }: { label: string }) {
  return (
    <>
      <RotateCcw className="h-3 w-3 text-red-500 group-hover:-rotate-45 transition-transform" />
      <span className="font-raleway text-[9px] font-bold text-red-500 uppercase tracking-wider">{label}</span>
    </>
  );
}

function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return { open, setOpen, ref };
}

function DateFilter({
  selection,
  onChange,
}: {
  selection: DateSelection;
  onChange: (selection: DateSelection) => void;
}) {
  const { open, setOpen, ref } = usePopover();
  const [step, setStep] = useState<"year" | "month">("year");
  const active = selection.years.length > 0 || selection.months.length > 0;
  const items = step === "year" ? FILTER_YEARS : SHORT_MONTHS;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen(!open);
          setStep("year");
        }}
        aria-label="Filter by date"
        className={clsx(TRIGGER, open || active ? "border-primary1 bg-primary1/5 shadow-sm shadow-primary1/10" : "border-primary1/20")}
      >
        <Calendar className="h-5 w-5 text-primary1" />
      </button>

      {open && (
        <div className={POPOVER}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              {step === "month" && (
                <button
                  onClick={() => setStep("year")}
                  aria-label="Back to year selection"
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors text-primary1 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}
              <span className="font-rubik font-bold text-primary3 text-sm">
                {step === "year" ? "Select Year" : "Select Month"}
              </span>
            </div>
            <button onClick={() => onChange({ years: [], months: [] })} className={RESET_BUTTON}>
              <ResetLabel label="Clear" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {items.map((item, idx) => {
              const selected = step === "year" ? selection.years.includes(item as number) : selection.months.includes(idx);
              return (
                <button
                  key={item}
                  onClick={() =>
                    onChange(
                      step === "year"
                        ? { ...selection, years: toggle(selection.years, item as number) }
                        : { ...selection, months: toggle(selection.months, idx) },
                    )
                  }
                  className={clsx(
                    "relative py-2.5 rounded-xl text-xs font-bold font-rubik transition-all duration-200 border-2 overflow-hidden cursor-pointer active:scale-95",
                    selected
                      ? "bg-primary1 text-white border-primary1 shadow-md shadow-primary1/30 scale-[0.96]"
                      : "bg-white text-gray-500 border-gray-50 hover:border-primary1/30 hover:bg-primary1/5 hover:text-primary1",
                  )}
                >
                  {item}
                  {selected && <span className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full" />}
                </button>
              );
            })}
          </div>

          <Button
            variant="hero"
            className="mt-5 w-full py-2.5 text-xs sm:px-5 sm:py-2.5 sm:text-sm"
            onClick={() => (step === "year" ? setStep("month") : setOpen(false))}
          >
            {step === "year" ? (
              <>
                Next <ChevronRight className="ml-1 inline h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Apply <Check className="ml-1 inline h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

function CategoryFilter({
  categories,
  active,
  onChange,
}: {
  categories: FilterCategory[];
  active: string;
  onChange: (name: string) => void;
}) {
  const { open, setOpen, ref } = usePopover();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Filter by category"
        className={clsx(TRIGGER, open || active !== "All" ? "border-primary1 bg-primary1/5 shadow-sm shadow-primary1/10" : "border-primary1/20")}
      >
        <Filter className="h-5 w-5 text-primary1" />
      </button>

      {open && (
        <div className={POPOVER}>
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="font-rubik font-bold text-primary3 text-sm">Category</span>
            <button onClick={() => onChange("All")} className={RESET_BUTTON}>
              <ResetLabel label="Reset" />
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => {
                  onChange(category.name);
                  setOpen(false);
                }}
                className={clsx(
                  "w-full py-2.5 px-4 rounded-xl text-sm transition-all duration-200 text-left flex items-center gap-3 font-rubik cursor-pointer active:scale-[0.98] transform-gpu backface-hidden",
                  active === category.name
                    ? "bg-primary1 text-white shadow-md shadow-primary1/25 font-semibold"
                    : "text-gray-600 hover:bg-primary1/5 hover:text-primary1 hover:translate-x-1",
                )}
              >
                <span className={active === category.name ? "text-white" : "text-primary1"}>{category.icon}</span>
                {category.name}
                {active === category.name && <Check className="h-3.5 w-3.5 ml-auto" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export interface ListFilterState {
  query: string;
  years: number[];
  months: number[];
  category: string;
}

export const INITIAL_FILTERS: ListFilterState = { query: "", years: [], months: [], category: "All" };

export function ListFilterBar({
  placeholder,
  categories,
  filters,
  onChange,
}: {
  placeholder: string;
  categories: FilterCategory[];
  filters: ListFilterState;
  onChange: (filters: ListFilterState) => void;
}) {
  return (
    <div className="mb-10 max-w-4xl mx-auto flex gap-4 items-center">
      <div className="relative grow">
        <div className="flex items-center w-full bg-white border-2 border-primary1/20 rounded-2xl px-5 py-3 transition-all duration-300 hover:border-primary1 focus-within:border-primary1">
          <Search className="h-5 w-5 text-primary1 shrink-0" />
          <input
            type="text"
            placeholder={placeholder}
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            className="w-full bg-transparent ml-3 outline-none font-rubik font-medium text-primary3 placeholder:text-gray-400 placeholder:font-normal"
          />
          {filters.query && (
            <button
              onClick={() => onChange({ ...filters, query: "" })}
              aria-label="Clear search"
              className="ml-2 text-gray-400 hover:text-primary1 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <DateFilter
        selection={{ years: filters.years, months: filters.months }}
        onChange={({ years, months }) => onChange({ ...filters, years, months })}
      />
      <CategoryFilter
        categories={categories}
        active={filters.category}
        onChange={(category) => onChange({ ...filters, category })}
      />
    </div>
  );
}

export function ResultsBar({
  shown,
  total,
  filters,
  onChange,
}: {
  shown: number;
  total: number;
  filters: ListFilterState;
  onChange: (filters: ListFilterState) => void;
}) {
  const yearRanges = groupRanges(filters.years, (year) => year.toString());
  const monthRanges = groupRanges(filters.months, (month) => SHORT_MONTHS[month]);

  return (
    <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="font-raleway text-sm text-gray-400">
        Showing <span className="font-bold text-primary3">{shown}</span> out of{" "}
        <span className="font-bold text-primary3">{total}</span> results
      </div>

      <div className="flex flex-wrap md:justify-end gap-2">
        {filters.category !== "All" && (
          <div className={clsx(CHIP, "bg-primary1/10 text-primary1 border-primary1/20")}>
            Category: {filters.category}
            <button
              onClick={() => onChange({ ...filters, category: "All" })}
              aria-label="Remove category filter"
              className="hover:text-primary3 transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        {yearRanges.map((range) => (
          <div key={`y-${range.label}`} className={clsx(CHIP, "bg-primary1/10 text-primary1 border-primary1/20")}>
            {range.label}
            <button
              onClick={() => onChange({ ...filters, years: filters.years.filter((y) => !range.original.includes(y)) })}
              aria-label={`Remove ${range.label}`}
              className="hover:text-primary3 transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {monthRanges.map((range) => (
          <div key={`m-${range.label}`} className={clsx(CHIP, "bg-primary3/10 text-primary3 border-primary3/20")}>
            {range.label}
            <button
              onClick={() => onChange({ ...filters, months: filters.months.filter((m) => !range.original.includes(m)) })}
              aria-label={`Remove ${range.label}`}
              className="hover:text-primary1 transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const stepButton =
    "w-10 h-10 flex items-center justify-center rounded-xl border-2 border-primary1/20 text-primary1 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary1 transition-all cursor-pointer";

  return (
    <div className="mt-16 flex flex-col items-center gap-6">
      <div className="flex items-center gap-2">
        <button onClick={() => onChange(Math.max(page - 1, 1))} disabled={page === 1} aria-label="Previous page" className={stepButton}>
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => onChange(pageNumber)}
              className={clsx(
                "w-10 h-10 rounded-xl text-sm font-bold font-rubik transition-all border-2 cursor-pointer",
                page === pageNumber
                  ? "bg-primary1 text-white border-primary1"
                  : "border-primary1/20 text-primary1 hover:border-primary1 hover:bg-primary1/5",
              )}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        <button
          onClick={() => onChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          aria-label="Next page"
          className={stepButton}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
