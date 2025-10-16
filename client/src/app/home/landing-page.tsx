"use client";

import Header from "../components/header_guest";
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
    <div className="bg-white min-h-screen flex flex-col overflow-hidden">
      <Header />
      
      <main>
        <section id="hero">
          <Hero />
        </section>

        <section id="about" className="-mt-10 flex flex-col items-center justify-center px-6 py-20 md:px-16 lg:px-28 space-y-28 bg">
          <AboutSection />
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