import * as XLSX from "xlsx";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const containsWords = (haystack: string, needle: string) => ` ${haystack} `.includes(` ${needle} `);

export async function readListRows(file: File): Promise<string[]> {
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, blankrows: false });
  return rows
    .map((row) => row.map((cell) => String(cell ?? "").trim()).filter(Boolean).join(" "))
    .filter(Boolean);
}

export interface NamedPerson {
  firstName: string;
  lastName: string;
}

export function matchRows<T extends NamedPerson>(rows: string[], people: T[]) {
  const keys = people.map((person) => ({
    person,
    last: normalize(person.lastName),
    first: normalize(person.firstName).split(" ")[0] ?? "",
  }));
  const matched = new Map<T, true>();
  let unmatched = 0;
  for (const [index, row] of rows.entries()) {
    const text = normalize(row);
    const hit = keys
      .filter(({ last, first }) => last && first && containsWords(text, last) && containsWords(text, first))
      .sort((a, b) => b.last.length + b.first.length - (a.last.length + a.first.length))[0];
    if (hit) matched.set(hit.person, true);
    else if (!(index === 0 && /name|officer|attend|position/i.test(row))) unmatched++;
  }
  return { people: [...matched.keys()], unmatched };
}
