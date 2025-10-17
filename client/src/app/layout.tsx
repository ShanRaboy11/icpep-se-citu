"use client";

import { useState, useEffect } from "react";
import type { Metadata } from "next";
import { Rubik, Raleway } from "next/font/google";
import { LoadingScreen } from "./components/loading";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showFirstVisit, setShowFirstVisit] = useState(true);

  useEffect(() => {
    // Only show entrance animation on very first load
    const timer = setTimeout(() => {
      setShowFirstVisit(false);
    }, 2500); // Duration for entrance animation

    return () => clearTimeout(timer);
  }, []); // Empty array = only runs once on mount

  return (
    <html lang="en">
      <head>
        <title>ICPEP SE CIT-U Chapter</title>
        <meta name="description" content="Unlocking Potential, One Bit at a Time" />
        <link rel="icon" href="/icpep logo.png" />
      </head>
      <body
        className={`${rubik.variable} ${raleway.variable} antialiased`}
      >
        {/* First visit loading with entrance animation */}
        {showFirstVisit && <LoadingScreen showEntrance={true} />}
        
        {/* Regular content - app/loading.jsx handles route changes automatically */}
        {children}
      </body>
    </html>
  );
}