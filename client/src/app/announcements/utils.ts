// --- MODIFICATION: Updated function with a new, cohesive blue-themed palette ---
export const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    // For primary, general events
    case "news":
      return "bg-sky-500 text-white"; // A bright, welcoming blue (like your theme's primary)

    // For more formal or internal announcements
    case "meeting":
      return "bg-indigo-600 text-white"; // A deeper, more corporate blue-purple

    // For celebratory or positive news
    case "achievement":
      return "bg-teal-500 text-white"; // A sophisticated, positive blue-green

    // A fallback that still fits the theme
    default:
      return "bg-slate-500 text-white";
  }
};

// No changes needed for formatDate
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};
