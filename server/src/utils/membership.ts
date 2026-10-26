export const NON_MEMBER = { isMember: false, membershipType: null } as const;

export const usesMembership = (role?: string) => role !== "faculty";
