export interface User {
  id: string;
  studentNumber: string;
  lastName: string;
  firstName: string;
  middleName?: string | null;
  fullName: string;
  role: 'member' | 'non-member' | 'council-officer' | 'committee-officer' | 'faculty';
  yearLevel?: number;
  membershipStatus: {
    isMember: boolean;
    membershipType: 'local' | 'regional' | null;
    validUntil?: Date;
  };
  profilePicture?: string | null;
  isActive: boolean;
  registeredBy?: {
    id: string;
    fullName: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

// Sample data for testing
export const users: User[] = [
  {
    id: "1",
    studentNumber: "2021-00001",
    lastName: "Santos",
    firstName: "Maria",
    middleName: "Cruz",
    fullName: "Maria Cruz Santos",
    role: "council-officer",
    yearLevel: 4,
    membershipStatus: {
      isMember: true,
      membershipType: "regional",
      validUntil: new Date("2025-12-31"),
    },
    profilePicture: null,
    isActive: true,
    registeredBy: null,
    createdAt: "2024-01-15T08:30:00Z",
    updatedAt: "2024-10-20T14:22:00Z",
  },
  {
    id: "2",
    studentNumber: "2022-00045",
    lastName: "Reyes",
    firstName: "Juan",
    middleName: "dela Cruz",
    fullName: "Juan dela Cruz Reyes",
    role: "member",
    yearLevel: 3,
    membershipStatus: {
      isMember: true,
      membershipType: "local",
    },
    profilePicture: null,
    isActive: true,
    registeredBy: {
      id: "1",
      fullName: "Maria Cruz Santos",
    },
    createdAt: "2024-02-10T10:15:00Z",
    updatedAt: "2024-09-05T09:45:00Z",
  },
  {
    id: "3",
    studentNumber: "23-4020-990",
    lastName: "Garcia",
    firstName: "Ana",
    middleName: null,
    fullName: "Ana Garcia",
    role: "member",
    yearLevel: 2,
    membershipStatus: {
      isMember: true,
      membershipType: "local",
    },
    profilePicture: null,
    isActive: true,
    registeredBy: {
      id: "1",
      fullName: "Maria Cruz Santos",
    },
    createdAt: "2024-03-22T11:00:00Z",
    updatedAt: "2024-10-15T16:30:00Z",
  },
  {
    id: "4",
    studentNumber: "2021-00089",
    lastName: "Mendoza",
    firstName: "Carlos",
    middleName: "Lopez",
    fullName: "Carlos Lopez Mendoza",
    role: "faculty",
    yearLevel: undefined,
    membershipStatus: {
      isMember: false,
      membershipType: null,
    },
    profilePicture: null,
    isActive: true,
    registeredBy: null,
    createdAt: "2024-01-08T09:00:00Z",
    updatedAt: "2024-08-12T13:20:00Z",
  },
  {
    id: "5",
    studentNumber: "2023-00234",
    lastName: "Torres",
    firstName: "Sofia",
    middleName: "Ramos",
    fullName: "Sofia Ramos Torres",
    role: "non-member",
    yearLevel: 2,
    membershipStatus: {
      isMember: false,
      membershipType: null,
    },
    profilePicture: null,
    isActive: true,
    registeredBy: {
      id: "1",
      fullName: "Maria Cruz Santos",
    },
    createdAt: "2024-04-18T14:30:00Z",
    updatedAt: "2024-07-25T10:15:00Z",
  },
  {
    id: "6",
    studentNumber: "2022-00078",
    lastName: "Bautista",
    firstName: "Miguel",
    middleName: "Santos",
    fullName: "Miguel Santos Bautista",
    role: "committee-officer",
    yearLevel: 3,
    membershipStatus: {
      isMember: true,
      membershipType: "regional",
    },
    profilePicture: null,
    isActive: true,
    registeredBy: null,
    createdAt: "2024-02-05T08:45:00Z",
    updatedAt: "2024-10-18T11:00:00Z",
  },
  {
    id: "7",
    studentNumber: "2024-00015",
    lastName: "Cruz",
    firstName: "Isabella",
    middleName: null,
    fullName: "Isabella Cruz",
    role: "member",
    yearLevel: 1,
    membershipStatus: {
      isMember: true,
      membershipType: "local",
    },
    profilePicture: null,
    isActive: true,
    registeredBy: {
      id: "6",
      fullName: "Miguel Santos Bautista",
    },
    createdAt: "2024-08-20T07:30:00Z",
    updatedAt: "2024-10-22T15:45:00Z",
  },
  {
    id: "8",
    studentNumber: "2021-00156",
    lastName: "Villanueva",
    firstName: "Ricardo",
    middleName: "Gomez",
    fullName: "Ricardo Gomez Villanueva",
    role: "member",
    yearLevel: 4,
    membershipStatus: {
      isMember: true,
      membershipType: "local",
    },
    profilePicture: null,
    isActive: false,
    registeredBy: {
      id: "1",
      fullName: "Maria Cruz Santos",
    },
    createdAt: "2024-01-25T12:00:00Z",
    updatedAt: "2024-06-30T18:20:00Z",
  },
];