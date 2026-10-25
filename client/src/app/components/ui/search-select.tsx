"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { LoadingIndicator } from "@/app/components/feedback/loading";
import { useDropdownDismiss } from "@/app/hooks/use-dropdown-dismiss";
import {
  dropdownOuterStyle,
  dropdownInnerStyle,
  dropdownItemStyle,
  dropdownItemHoverStyle,
} from "./dropdown";

export interface SearchOption {
  id: string;
  label: string;
  detail?: string;
}

interface SearchSelectProps {
  query: string;
  onQueryChange: (query: string) => void;
  results: SearchOption[];
  onSelect: (id: string) => void;
  placeholder?: string;
  invalid?: boolean;
  loading?: boolean;
}

export default function SearchSelect({
  query,
  onQueryChange,
  results,
  onSelect,
  placeholder = "Search",
  invalid = false,
  loading = false,
}: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  useDropdownDismiss(open, () => setOpen(false));

  return (
    <div data-dropdown className="relative">
      <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          onQueryChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className={`w-full rounded-2xl border bg-gray-50 py-3 pl-12 pr-4 font-rubik text-base text-gray-800 outline-none transition-all placeholder-gray-400 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10 ${
          invalid ? "border-red-300 ring-2 ring-red-100" : "border-gray-200"
        }`}
      />
      {loading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <LoadingIndicator size="sm" />
        </div>
      )}

      {open && results.length > 0 && (
        <div className={dropdownOuterStyle}>
          <div role="listbox" className={dropdownInnerStyle}>
            {results.map((result) => (
              <div
                key={result.id}
                role="option"
                aria-selected={false}
                className={`${dropdownItemStyle} ${dropdownItemHoverStyle}`}
                onClick={() => {
                  onSelect(result.id);
                  setOpen(false);
                }}
              >
                <span>{result.label}</span>
                {result.detail && <span className="font-raleway text-xs text-gray-400">{result.detail}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
