export interface Officer {
  position: string;
  role?: string;
  name: string;
  image?: string;
}

export interface DepartmentData {
  title: string;
  description: string;
  gradient: string;
  shadow: string;
  officers: Officer[];
}

export type DepartmentsMap = Record<string, DepartmentData>;

export const departments: DepartmentsMap = {
  council: {
    title: "Executive Council",
    description: "Leading the chapter with vision and integrity.",
    gradient: "bg-gradient-to-br from-blue-600 to-sky-400",
    shadow: "hover:shadow-blue-500/40",
    officers: [
      { position: "President", name: "Doe, John" },
      { position: "VP Internal", name: "Smith, Jane" },
      { position: "VP External", name: "Johnson, Michael" },
      { position: "Secretary", name: "Williams, Emily" },
      { position: "Treasurer", name: "Brown, Chris" },
      { position: "Auditor", name: "Davis, Sarah" },
      { position: "PIO", name: "Miller, David" },
      { position: "PRO", name: "Wilson, Jessica" },
      { position: "SSG", role: "Representative", name: "Moore, Daniel" },
      { position: "SSG", role: "Representative", name: "Taylor, Laura" },
      {
        position: "1st Year",
        role: "Batch Representative",
        name: "Anderson, Thomas",
      },
      {
        position: "1st Year",
        role: "Batch Representative",
        name: "Thomas, Lisa",
      },
      {
        position: "2nd Year",
        role: "Batch Representative",
        name: "Jackson, Paul",
      },
      {
        position: "2nd Year",
        role: "Batch Representative",
        name: "White, Kevin",
      },
      {
        position: "3rd Year",
        role: "Batch Representative",
        name: "Harris, Nancy",
      },
      {
        position: "3rd Year",
        role: "Batch Representative",
        name: "Martin, Karen",
      },
      {
        position: "4th Year",
        role: "Batch Representative",
        name: "Thompson, Brian",
      },
      {
        position: "4th Year",
        role: "Batch Representative",
        name: "Garcia, Betty",
      },
    ],
  },
  "internal-affairs": {
    title: "Committee on Internal Affairs",
    description: "Maintaining harmony and order within the organization.",
    gradient: "bg-gradient-to-br from-[#00A7EE] to-blue-600",
    shadow: "hover:shadow-sky-500/40",
    officers: [
      { position: "Committee Head", name: "Roberts, Alex" },
      { position: "Assistant Head", name: "Clark, Ryan" },
      { position: "Secretary", name: "Lewis, Anna" },
      { position: "Member", name: "Walker, Steve" },
      { position: "Member", name: "Hall, Christina" },
    ],
  },
  "external-affairs": {
    title: "Committee on External Affairs",
    description: "Building bridges with other organizations and partners.",
    gradient: "bg-gradient-to-br from-[#9333ea] to-purple-900",
    shadow: "hover:shadow-purple-500/40",
    officers: [
      { position: "Committee Head", name: "Allen, Patrick" },
      { position: "Assistant Head", name: "Young, Joseph" },
      { position: "Secretary", name: "Hernandez, Maria" },
      { position: "Member", name: "King, Charles" },
      { position: "Member", name: "Wright, Scott" },
    ],
  },
  finance: {
    title: "Committee on Finance",
    description: "Ensuring transparency and sustainability of funds.",
    gradient: "bg-gradient-to-br from-[#ca8a04] to-yellow-600",
    shadow: "hover:shadow-yellow-500/40",
    officers: [
      { position: "Committee Head", name: "Lopez, Amy" },
      { position: "Assistant Head", name: "Hill, Gregory" },
      { position: "Secretary", name: "Scott, Larry" },
      { position: "Member", name: "Green, Rachel" },
      { position: "Member", name: "Adams, Samuel" },
    ],
  },
  "public-relations": {
    title: "Committee on Public Relations",
    description: "Managing the image and communication of the chapter.",
    gradient: "bg-gradient-to-br from-[#ea580c] to-red-600",
    shadow: "hover:shadow-orange-500/40",
    officers: [
      { position: "Committee Head", name: "Baker, Michelle" },
      { position: "Assistant Head", name: "Gonzalez, Carlos" },
      { position: "Secretary", name: "Nelson, Amanda" },
      { position: "Member", name: "Carter, Joshua" },
    ],
  },
  "research-and-development": {
    title: "Research & Development Committee",
    description: "Innovating and improving chapter processes.",
    gradient: "bg-gradient-to-br from-[#2563eb] to-indigo-800",
    shadow: "hover:shadow-indigo-500/40",
    officers: [
      { position: "Committee Head", name: "Mitchell, Stephanie" },
      { position: "Assistant Head", name: "Perez, Brandon" },
      { position: "Secretary", name: "Roberts, Justin" },
      { position: "Member", name: "Turner, Melissa" },
      { position: "Member", name: "Phillips, Jonathan" },
    ],
  },
  "training-and-seminar": {
    title: "Training & Seminar Committee",
    description: "Empowering members through knowledge and skills.",
    gradient: "bg-gradient-to-br from-[#16a34a] to-green-800",
    shadow: "hover:shadow-green-500/40",
    officers: [
      { position: "Committee Head", name: "Campbell, Sharon" },
      { position: "Assistant Head", name: "Parker, Nicholas" },
      { position: "Secretary", name: "Evans, Katherine" },
      { position: "Member", name: "Edwards, Matthew" },
    ],
  },
  "sports-and-cultural": {
    title: "Sports & Cultural Committee",
    description: "Promoting camaraderie through holistic activities.",
    gradient: "bg-gradient-to-br from-[#dc2626] to-red-900",
    shadow: "hover:shadow-red-500/40",
    officers: [
      { position: "Committee Head", name: "Collins, Christopher" },
      { position: "Assistant Head", name: "Stewart, Cynthia" },
      { position: "Secretary", name: "Sanchez, Javier" },
      { position: "Member", name: "Morris, Ashley" },
      { position: "Member", name: "Rogers, Jeremy" },
      { position: "Member", name: "Reed, Tiffany" },
    ],
  },
  "media-and-documentation": {
    title: "Media & Documentation Committee",
    description: "Capturing moments and creating visual identity.",
    gradient: "bg-gradient-to-br from-[#4f46e5] to-indigo-900",
    shadow: "hover:shadow-indigo-500/40",
    officers: [
      { position: "Committee Head", name: "Cook, Douglas" },
      { position: "Assistant Head", name: "Morgan, Elizabeth" },
      { position: "Secretary", name: "Bell, Benjamin" },
      { position: "Member", name: "Murphy, Samantha" },
      { position: "Member", name: "Bailey, Andrew" },
    ],
  },
};
