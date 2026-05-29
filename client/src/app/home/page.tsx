"use client";

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

export default function LandingPage() {
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

        <section id="about">
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

      <div className="mt-[-35px] md:mt-[-80px]">
        <Footer />
      </div>
    </div>
  );
}
