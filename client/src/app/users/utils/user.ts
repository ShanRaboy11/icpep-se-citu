export interface User {
  id: string;
  studentNumber: string;
  lastName: string;
  firstName: string;
  middleName?: string | null;
  fullName: string;
  role: 'student' | 'council-officer' | 'committee-officer' | 'faculty';
  yearLevel?: number;
  membershipStatus: {
    isMember: boolean;
    membershipType: 'local' | 'regional' | 'both' | null;
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

