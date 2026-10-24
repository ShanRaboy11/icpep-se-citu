"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Upload } from "lucide-react";
import SearchSelect from "@/app/components/ui/search-select";
import Button from "@/app/components/ui/button";
import RemovableTag from "@/app/components/ui/removable-tag";
import officerService, { type Officer } from "@/app/services/officer";
import { formatOfficerName } from "@/app/utils/officers/format-name";
import { shortDepartmentName, shortPositionTitle } from "@/app/utils/department";
import { matchRows, readListRows } from "@/app/utils/announcements/attendance-import";
import { shortPosition } from "@/app/utils/announcements/attendance";

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

const lastName = (attendee: Attendee) => attendee.name.split(",")[0].trim();

const tagLabel = (attendee: Attendee, all: Attendee[]) => {
  const last = lastName(attendee);
  const shared = all.filter((other) => lastName(other).toLowerCase() === last.toLowerCase()).length > 1;
  const first = attendee.name.split(",")[1]?.trim().split(" ")[0];
  return shared && first ? `${last}, ${first}` : last;
};

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
  const [importNote, setImportNote] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

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

  const importList = async (file: File) => {
    try {
      const rows = await readListRows(file);
      const { people, unmatched } = matchRows(rows, officers);
      const found = people.map(toAttendee).filter((attendee) => !value.some((chosen) => sameAttendee(chosen, attendee)));
      onChange([...value, ...found]);
      const added = `${found.length} ${found.length === 1 ? "officer" : "officers"} added`;
      setImportNote(unmatched > 0 ? `${added}. ${unmatched} ${unmatched === 1 ? "row" : "rows"} had no match.` : `${added}.`);
    } catch {
      setImportNote("That file could not be read. Use a .csv, .xlsx or .txt list of names.");
    }
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

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.txt,.xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) importList(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="heroOutline"
          disabled={loading}
          onClick={() => fileRef.current?.click()}
          className="px-4 py-2 text-xs sm:px-4 sm:py-2 sm:text-xs"
        >
          <Upload size={12} />
          Upload attendance list
        </Button>
        <span className="font-raleway text-xs text-gray-400">.csv, .xlsx or .txt with one name per row</span>
      </div>

      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((attendee) => (
            <li key={`${attendee.name}|${attendee.position}`}>
              <RemovableTag
                label={tagLabel(attendee, value)}
                detail={shortPosition(attendee.position)}
                icon={false}
                title={attendee.name}
                removeLabel={`Remove ${attendee.name}`}
                onRemove={() => onChange(value.filter((chosen) => !sameAttendee(chosen, attendee)))}
              />
            </li>
          ))}
        </ul>
      )}

      <p className="font-raleway text-xs text-gray-400">
        {importNote ? `${importNote} ` : ""}{value.length === 0 ? "No one added yet." : `${value.length} ${value.length === 1 ? "officer" : "officers"} marked present.`}
      </p>
    </div>
  );
}
