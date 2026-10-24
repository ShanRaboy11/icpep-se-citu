"use client";

import { useEffect, useMemo, useState } from "react";
import SearchSelect from "@/app/components/ui/search-select";
import RemoveButton from "@/app/components/ui/remove-button";
import officerService, { type Officer } from "@/app/services/officer";
import { formatOfficerName } from "@/app/utils/officers/format-name";
import { shortDepartmentName, shortPositionTitle } from "@/app/utils/department";

export interface Attendee {
  name: string;
  position: string;
}

const describe = (officer: Officer) => {
  const parts: string[] = [];
  if (officer.councilPosition) parts.push(officer.councilPosition);
  if (officer.committeeTitle) {
    const department = shortDepartmentName(officer.committeeDepartment);
    parts.push(`${shortPositionTitle(officer.committeeTitle)}${department ? `, ${department}` : ""}`);
  }
  return parts.join(" · ");
};

const toAttendee = (officer: Officer): Attendee => ({
  name: formatOfficerName(officer.firstName, officer.lastName, officer.middleName),
  position: describe(officer),
});

const sameAttendee = (a: Attendee, b: Attendee) =>
  a.name.toLowerCase() === b.name.toLowerCase() && a.position.toLowerCase() === b.position.toLowerCase();

export default function AttendancePicker({
  value,
  onChange,
}: {
  value: Attendee[];
  onChange: (attendees: Attendee[]) => void;
}) {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    officerService
      .getOfficers()
      .then(setOfficers)
      .catch(() => setOfficers([]))
      .finally(() => setLoading(false));
  }, []);

  const options = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return officers
      .map((officer) => ({ id: officer._id, attendee: toAttendee(officer) }))
      .filter(({ attendee }) => !value.some((chosen) => sameAttendee(chosen, attendee)))
      .filter(({ attendee }) => !needle || `${attendee.name} ${attendee.position}`.toLowerCase().includes(needle))
      .sort((a, b) => a.attendee.name.localeCompare(b.attendee.name))
      .slice(0, 12);
  }, [officers, value, query]);

  const add = (id: string) => {
    const match = options.find((option) => option.id === id);
    if (!match) return;
    onChange([...value, match.attendee]);
    setQuery("");
  };

  return (
    <div className="space-y-3">
      <SearchSelect
        query={query}
        onQueryChange={setQuery}
        loading={loading}
        placeholder="Search officers who attended"
        results={options.map(({ id, attendee }) => ({ id, label: attendee.name, detail: attendee.position }))}
        onSelect={add}
      />

      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((attendee) => (
            <li
              key={`${attendee.name}|${attendee.position}`}
              className="flex items-center gap-2 rounded-full border border-primary1/20 bg-primary1/5 py-1 pl-4 pr-1.5"
            >
              <span className="font-rubik text-xs font-semibold text-primary3">
                {attendee.name}
                {attendee.position && <span className="ml-1.5 font-normal text-gray-500">{attendee.position}</span>}
              </span>
              <RemoveButton
                variant="icon"
                label={`Remove ${attendee.name}`}
                onClick={() => onChange(value.filter((chosen) => !sameAttendee(chosen, attendee)))}
                className="h-6 w-6 border-0 p-0"
              />
            </li>
          ))}
        </ul>
      )}

      <p className="font-raleway text-xs text-gray-400">
        {value.length === 0 ? "No one added yet." : `${value.length} ${value.length === 1 ? "officer" : "officers"} marked present.`}
      </p>
    </div>
  );
}
