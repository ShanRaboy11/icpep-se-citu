"use client";

import type { ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { ListSkeleton } from "@/app/components/feedback/skeleton-cards";

interface ManageListCardProps {
  title: string;
  count: number;
  singular: string;
  plural: string;
  status?: string;
  loading: boolean;
  onRefresh: () => void;
  emptyIcon: ReactNode;
  emptyTitle: string;
  emptyHint: string;
  columns: string[];
  minWidth?: string;
  children: ReactNode;
}

const HEAD_CELL = "py-3.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway";

export default function ManageListCard({
  title,
  count,
  singular,
  plural,
  status = "active",
  loading,
  onRefresh,
  emptyIcon,
  emptyTitle,
  emptyHint,
  columns,
  minWidth = "min-w-160",
  children,
}: ManageListCardProps) {
  return (
    <div className="bg-white rounded-4xl border transition-all duration-300 shadow-md hover:shadow-primary1/40 hover:-translate-y-2 border-gray-200 overflow-hidden">
      <div className="px-6 sm:px-8 py-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-rubik text-primary3">{title}</h2>
          <p className="text-gray-400 text-xs font-raleway mt-0.5 tracking-wide">
            {count} {status} {count === 1 ? singular : plural}
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 text-xs font-bold font-rubik text-primary1 border border-primary1/20 hover:border-primary1/50 hover:bg-primary1/5 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading ? (
        <ListSkeleton />
      ) : count === 0 ? (
        <div className="py-20 flex flex-col items-center gap-4 text-gray-300">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">{emptyIcon}</div>
          <div className="text-center">
            <p className="text-sm font-bold font-rubik text-gray-400">{emptyTitle}</p>
            <p className="text-xs font-raleway mt-0.5">{emptyHint}</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto themed-scrollbar">
          <table className={`responsive-table w-full text-left ${minWidth}`}>
            <thead>
              <tr className="bg-gray-50/80">
                {columns.map((column, index) => {
                  const first = index === 0;
                  const last = index === columns.length - 1;
                  const padding = first ? "px-6 sm:px-8" : last ? "px-6 sm:px-8 text-right" : "px-4";
                  return (
                    <th key={column} className={`${padding} ${HEAD_CELL}`}>
                      {column}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>{children}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
