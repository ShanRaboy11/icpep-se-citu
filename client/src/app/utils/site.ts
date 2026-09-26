// The site's public, canonical origin — used for the sitemap, robots.txt,
// canonical/OG URLs and structured data. Set NEXT_PUBLIC_SITE_URL in
// production if the deployment domain ever changes.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://icpep-se-citu.vercel.app"
).replace(/\/+$/, "");

export const SITE_NAME = "ICpEP.SE CIT-U Chapter";
export const SITE_DESCRIPTION = "Unlocking Potential, One Bit at a Time";

export const SOCIAL_LINKS = [
  "https://www.facebook.com/cituicpep",
  "https://tiktok.com/@icpep.se.citu",
];

// The chapter cover photo, letterboxed to the 1200x630 size link previews
// expect (Messenger, Discord, Slack, X/Twitter, Facebook, ...).
export const DEFAULT_OG_IMAGE = {
  url: "/brand/og-default.jpg",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

// A page's title/description alone isn't enough for a good link preview —
// Next doesn't copy them into openGraph/twitter automatically, so every
// static page layout calls this to get a matching preview card for free.
//
// Setting `openGraph`/`twitter` at all replaces the whole object inherited
// from the root layout rather than merging into it (Next only merges
// metadata objects when a segment leaves a field out entirely), so every
// page has to repeat the site-wide defaults (image, site name, card type)
// alongside its own title/description.
export const pageMetadata = (title: string, description: string, path: string) => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: path,
    siteName: SITE_NAME,
    type: "website" as const,
    locale: "en_PH",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image" as const,
    title,
    description,
    images: [DEFAULT_OG_IMAGE.url],
  },
});
