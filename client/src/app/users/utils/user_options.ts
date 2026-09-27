export interface Option {
  value: string;
  label: string;
}

export const YEAR_OPTIONS: Option[] = [
  { value: "1", label: "1st Year" },
  { value: "2", label: "2nd Year" },
  { value: "3", label: "3rd Year" },
  { value: "4", label: "4th Year" },
  { value: "5", label: "5th Year" },
];

export const ROLE_OPTIONS: Option[] = [
  { value: "student", label: "Student" },
  { value: "council-officer", label: "Council Officer" },
  { value: "committee-officer", label: "Committee Officer" },
  { value: "faculty", label: "Faculty" },
  { value: "admin", label: "Admin" },
];

export const MEMBERSHIP_OPTIONS: Option[] = [
  { value: "non-member", label: "Non-Member" },
  { value: "local", label: "Local Member" },
  { value: "regional", label: "Regional Member" },
  { value: "both", label: "Both (Local & Regional)" },
];

// Split into a non-scrolling outer wrapper (owns the rounding/border/
// shadow) and a scrolling inner container, so the scrollbar never pokes
// past the rounded corners.
export const dropdownOuterStyle =
  "absolute z-30 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden";
export const dropdownInnerStyle =
  "flex flex-col gap-1 p-2 max-h-56 overflow-y-auto themed-scrollbar";
export const dropdownItemStyle =
  "flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-colors font-rubik text-sm font-medium";
export const dropdownItemSelectedStyle = "bg-primary1/5 text-primary1";
export const dropdownItemHoverStyle = "hover:bg-gray-50 text-gray-700";
