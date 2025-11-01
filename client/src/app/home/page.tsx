"use client";

import Header from "../components/header";
import Hero from "../components/hero";
import Footer from "../components/footer";
import { AboutSection } from "./sections/about";
import { WhyJoinSection } from "./sections/join";
import { AnnouncementsSection } from "./sections/announcement";
import { EventsSection } from "./sections/events";
import { TestimonialsSection } from "./sections/testimonials";
import { FacultyOfficersSection } from "./sections/faculty";
import { PartnersSection } from "./sections/partner";
import { FAQSection } from "./sections/faq";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Header />

      <main className="pt-20" style={{ backgroundColor: "#FEFEFF" }}>
        <section id="hero">
          <Hero />
        </section>

        <section id="about">
          <AboutSection />
        </section>

        <section id="about">
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
