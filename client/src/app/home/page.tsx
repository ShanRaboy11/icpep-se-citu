"use client";

import Header from "../components/header"; // Assuming correct import path
import Hero from "../components/hero";
import Footer from "../components/footer";
import { AboutSection } from "../components/sections/about";
import { WhyJoinSection } from "../components/sections/join";
import { AnnouncementsSection } from "../components/sections/announcement";
import { EventsSection } from "../components/sections/events";
import { TestimonialsSection } from "../components/sections/testimonials";
import { FacultyOfficersSection } from "../components/sections/faculty";
import { PartnersSection } from "../components/sections/partner";
import { FAQSection } from "../components/sections/faq";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Header />

      {/* added className="pt-20" to offset the fixed header */}
      <main className="pt-20" style={{ backgroundColor: "#FEFEFF" }}>
        <section id="hero">
          <Hero />
        </section>

        <section id="about">
          <AboutSection />
        </section>

        <section
          id="about"
        >
          <WhyJoinSection />
        </section>

        <section id="announcements" className="bg-primary1">
          <AnnouncementsSection />
        </section>

        <section id="events" className="bg-white">
          <EventsSection />
        </section>

        <section id="testimonials">
          <TestimonialsSection />
        </section>

        <section id="faculty-officers" className="bg-white">
          <FacultyOfficersSection />
        </section>

        <section id="partners" className="bg-white">
          <PartnersSection />
        </section>

        <section id="faq" className="bg-white">
          <FAQSection />
        </section>
      </main>

      <Footer />
    </div>
  );
}
