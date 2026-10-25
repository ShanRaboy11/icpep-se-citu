export interface User {
  id: string;
  studentNumber: string;
  lastName: string;
  firstName: string;
  middleName?: string | null;
  fullName: string;
  role: 'student' | 'council-officer' | 'committee-officer' | 'faculty' | 'admin';
  yearLevel?: number;
  membershipStatus: {
    isMember: boolean;
    membershipType: 'local' | 'regional' | 'both' | null;
    validUntil?: Date;
  };
  profilePicture?: string | null;
  gender?: 'male' | 'female' | null;
  isActive: boolean;
  firstLogin?: boolean;
  firstLoginCodeStatus?: 'pending' | 'sent' | 'failed' | 'no-email' | null;
  firstLoginCodeExpires?: string | null;
  registeredBy?: {
    id: string;
    fullName: string;
    role?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

