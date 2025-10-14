import type { Metadata } from "next";
import { Rubik, Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ICpEP SE CIT-U Chapter",
  icons: '/icpep logo.png',
  description: "Official ICPEP.SE CIT-U Chapter Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rubik.variable} ${raleway.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
