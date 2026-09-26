import type { Metadata } from "next";
import { Rubik, Raleway } from "next/font/google";
import FirstVisitLoader from "./components/first-visit-loader";
import ApiErrorNotice from "./components/api-error-notice";
import ResponsiveTableToggle from "./components/responsive-table-toggle";
import MaintenanceGate from "./components/maintenance-gate";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SOCIAL_LINKS, DEFAULT_OG_IMAGE } from "./utils/site";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

// Every page inherits this as its link-preview fallback; a page can override
// title/description/images by setting its own openGraph/twitter fields.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  icons: { icon: "/brand/icpep-logo.png" },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_PH",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE.url],
  },
};

// Describes the chapter itself, not any one page — read by search and AI
// answer engines to ground "who is ICpEP.SE CIT-U" style questions.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: "ICpEP.SE CIT-U",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/icpep-logo.png`,
  description: SITE_DESCRIPTION,
  sameAs: SOCIAL_LINKS,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} ${raleway.variable} antialiased`}>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />

        {/* First visit loading with entrance animation */}
        <FirstVisitLoader />

        {/* Regular content - app/loading.jsx handles route changes automatically */}
        <MaintenanceGate>{children}</MaintenanceGate>
        <ApiErrorNotice />
        <ResponsiveTableToggle />
      </body>
    </html>
  );
}
