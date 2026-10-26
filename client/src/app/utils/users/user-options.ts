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
