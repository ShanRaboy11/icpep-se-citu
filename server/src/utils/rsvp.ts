const DAY_MS = 24 * 60 * 60 * 1000;

export const isRsvpOpen = (
  event: { eventDate: Date; expiryDate?: Date | null },
  now: Date = new Date()
): boolean => {
  const end = event.expiryDate ?? new Date(event.eventDate.getTime() + DAY_MS - 1);
  return now.getTime() <= end.getTime();
};
