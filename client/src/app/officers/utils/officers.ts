// Cosmetic metadata per department/committee (title, description, branding
// colors). Actual officer rosters are fetched live from the database —
// either the current live roster, or a specific academic year's archive —
// see officers/[slug]/page.tsx.
export interface DepartmentMeta {
  title: string;
  description: string;
  gradient: string;
  shadow: string;
}

export type DepartmentsMap = Record<string, DepartmentMeta>;

export const departments: DepartmentsMap = {
  council: {
    title: "Executive Council",
    description: "Leading the chapter with vision and integrity.",
    gradient: "bg-linear-to-br from-blue-600 to-sky-400",
    shadow: "hover:shadow-blue-500/40",
  },
  "internal-affairs": {
    title: "Committee on Internal Affairs",
    description: "Maintaining harmony and order within the organization.",
    gradient: "bg-linear-to-br from-[#00A7EE] to-blue-600",
    shadow: "hover:shadow-sky-500/40",
  },
  "external-affairs": {
    title: "Committee on External Affairs",
    description: "Building bridges with other organizations and partners.",
    gradient: "bg-linear-to-br from-[#9333ea] to-purple-900",
    shadow: "hover:shadow-purple-500/40",
  },
  finance: {
    title: "Committee on Finance",
    description: "Ensuring transparency and sustainability of funds.",
    gradient: "bg-linear-to-br from-[#ca8a04] to-yellow-600",
    shadow: "hover:shadow-yellow-500/40",
  },
  "public-relations": {
    title: "Committee on Public Relations",
    description: "Managing the image and communication of the chapter.",
    gradient: "bg-linear-to-br from-[#ea580c] to-red-600",
    shadow: "hover:shadow-orange-500/40",
  },
  "research-and-development": {
    title: "Research and Development Committee",
    description: "Innovating and improving chapter processes.",
    gradient: "bg-linear-to-br from-[#2563eb] to-indigo-800",
    shadow: "hover:shadow-indigo-500/40",
  },
  "training-and-seminar": {
    title: "Training and Seminar Committee",
    description: "Empowering members through knowledge and skills.",
    gradient: "bg-linear-to-br from-[#16a34a] to-green-800",
    shadow: "hover:shadow-green-500/40",
  },
  "sports-and-cultural": {
    title: "Sports and Cultural Committee",
    description: "Promoting camaraderie through holistic activities.",
    gradient: "bg-linear-to-br from-[#dc2626] to-red-900",
    shadow: "hover:shadow-red-500/40",
  },
  "media-and-documentation": {
    title: "Media and Documentation Committee",
    description: "Capturing moments and creating visual identity.",
    gradient: "bg-linear-to-br from-[#4f46e5] to-indigo-900",
    shadow: "hover:shadow-indigo-500/40",
  },
};
