// Council officers and admins can manage any post; everyone else only their own.
export const canManagePost = (
  user: { id: string; role: string } | undefined,
  authorId: unknown,
): boolean =>
  !!user &&
  (user.role === "admin" ||
    user.role === "council-officer" ||
    String(authorId) === user.id);
