"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/layout/header";
import Hero from "../components/home/sections/hero";
import Footer from "../components/layout/footer";
import { AboutSection } from "../components/home/sections/about";
import { WhyJoinSection } from "../components/home/sections/join";
import { AnnouncementsSection } from "../components/home/sections/announcement";
import { EventsSection } from "../components/home/sections/events";
import { TestimonialsSection } from "../components/home/sections/testimonials";
import { FacultyOfficersSection } from "../components/home/sections/faculty";
import { PartnersSection } from "../components/home/sections/partner";
import { FAQSection } from "../components/home/sections/faq";
import { getSessionRole } from "@/app/utils/session";

export default function LandingPage() {
  const router = useRouter();
  // null = still checking localStorage, true/false = decided. Keeps a
  // logged-in visitor from ever seeing the public landing page flash
  // before being sent to their dashboard.
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const role = getSessionRole();

    if (role) {
      router.replace("/dashboard");
      return;
    }

    setCheckingSession(false);
  }, [router]);

  if (checkingSession) {
    return <div className="min-h-screen bg-white" />;
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
