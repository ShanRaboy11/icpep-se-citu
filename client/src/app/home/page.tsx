"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import Hero from "./sections/hero";
import Footer from "../components/footer";
import { AboutSection } from "./sections/about";
import { WhyJoinSection } from "./sections/join";
import { AnnouncementsSection } from "./sections/announcement";
import { EventsSection } from "./sections/events";
import { TestimonialsSection } from "./sections/testimonials";
import { FacultyOfficersSection } from "./sections/faculty";
import { PartnersSection } from "./sections/partner";
import { FAQSection } from "./sections/faq";
import { LoadingScreen } from "../components/loading";

export default function LandingPage() {
  const router = useRouter();
  // null = still checking localStorage, true/false = decided. Keeps a
  // logged-in visitor from ever seeing the public landing page flash
  // before being sent to their dashboard.
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (token && role) {
      router.replace("/dashboard");
      return;
    }

    setCheckingSession(false);
  }, [router]);

  if (checkingSession) {
    return <LoadingScreen showEntrance={false} />;
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-transparent">
      <Header />

      <main className="relative z-10 pt-20 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <section id="hero">
          <Hero />
        </section>

        <section id="about">
          <AboutSection />
        </section>

        <section id="why-join">
          <WhyJoinSection />
        </section>

        <section id="announcements">
          <AnnouncementsSection />
        </section>

        <section id="events">
          <EventsSection />
        </section>

        <section id="testimonials">
          <TestimonialsSection />
        </section>

        <section id="faculty-officers">
          <FacultyOfficersSection />
        </section>

        <section id="partners">
          <PartnersSection />
        </section>

        <section id="faq">
          <FAQSection />
        </section>
      </main>

      <div className="-mt-8.75 md:-mt-20">
        <Footer />
      </div>
    </div>
  );
}
