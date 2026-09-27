import type { Metadata } from "next";
import { DEFAULT_FAQS, type DefaultFaq } from "./utils/default-faqs";
import { pageMetadata } from "@/app/utils/site";

export const metadata: Metadata = pageMetadata(
  "Home",
  "The official chapter of ICpEP.SE (Institute of Computer Engineers of the Philippines — Student Edition) at Cebu Institute of Technology — University.",
  "/home",
);

const API_URL = (() => {
  const base = String(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
})();

// The FAQs admins actually publish, so the structured data matches what
// visitors see; falls back to the built-in defaults (what the page shows
// while loading or when the list is empty).
async function fetchFaqs(): Promise<DefaultFaq[]> {
  try {
    const res = await fetch(`${API_URL}/faqs`, { next: { revalidate: 300 } });
    if (!res.ok) return DEFAULT_FAQS;
    const json = await res.json();
    const items = Array.isArray(json?.data) ? json.data : [];
    const faqs = items.filter(
      (f: DefaultFaq) => typeof f?.question === "string" && typeof f?.answer === "string",
    );
    return faqs.length > 0 ? faqs : DEFAULT_FAQS;
  } catch {
    return DEFAULT_FAQS;
  }
}

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const faqs = await fetchFaqs();
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
