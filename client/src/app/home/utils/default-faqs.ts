// Fallback FAQs shown while the admin-managed list loads (or if it's empty).
// Also the source for the home page's FAQPage structured data — keep these
// in sync with whatever ships as the default, since that JSON-LD is only
// ever generated from this file, not the live API response.
export interface DefaultFaq {
  question: string;
  answer: string;
}

export const DEFAULT_FAQS: DefaultFaq[] = [
  {
    question: "What is the ICpEP SE CIT-U website for?",
    answer:
      "The website serves as the official platform for membership registration, announcements, events, and organization updates—making it easier for students to stay informed and connected.",
  },
  {
    question: "How do I register as a member?",
    answer:
      "You can register directly through the Membership page. Fill out the form, upload the required documents, and wait for verification from the Registrar.",
  },
  {
    question: "How do I check my membership status?",
    answer:
      "After registering, you can view your membership status on your profile page. Status updates (Pending, Verified, or Expired) are handled by the officers.",
  },
  {
    question: "Can I still join events even if I’m not a member?",
    answer:
      "Some events are open to all, while others are exclusive to verified ICpEP SE members. Event details will indicate whether membership is required.",
  },
];
