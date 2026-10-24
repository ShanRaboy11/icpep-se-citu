import { canManagePost } from './ownership';

// Roles that can see every draft, not just their own.
const DRAFT_ROLES = ['council-officer', 'admin'];

type MaybeUser = { id: string; role: string } | undefined;

// Filter for a public or staff list of events/announcements.
// Anyone who isn't staff gets published items only. A committee officer or
// faculty member also gets their own drafts. Council officers and admins
// see everything, and may filter by isPublished when they ask.
export const listVisibility = (
  user: MaybeUser,
  requestedIsPublished?: string
): Record<string, unknown> => {
  if (!user) return { isPublished: true };
  if (DRAFT_ROLES.includes(user.role)) {
    if (requestedIsPublished === undefined) return {};
    return { isPublished: requestedIsPublished === 'true' };
  }
  return { $or: [{ isPublished: true }, { author: user.id }] };
};

// Whether a single item may be shown. Drafts only go to people who can
// manage that item, and a hidden draft looks the same as a missing one.
export const canViewItem = (
  user: MaybeUser,
  item: { isPublished?: boolean; author?: unknown }
): boolean => {
  if (item.isPublished) return true;
  return canManagePost(user, (item.author as any)?._id ?? item.author);
};
