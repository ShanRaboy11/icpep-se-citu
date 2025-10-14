'use client';
import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
//import Autoplay from "embla-carousel-autoplay";

import Header from "../../components/header_guest";
import Hero from "../../components/hero";
import Footer from "../../components/footer";
import Image from 'next/image';
import Button from "@/app/components/button";
import AnnounceCardBig from "@/app/components/cards/announcecardbig";
import AnnounceCardSmall from "@/app/components/cards/announcecardsmall";
import EventCard from "@/app/components/cards/eventcard";
import TestimonialCard from "@/app/components/cards/testimonialcard";



const testimonials = [
  {
    name: "Alyssa Cruz",
    title: "President, ICpEP.SE",
    imageSrc: "/faculty.png",
    testimonial:
      "Being part of ICpEP.SE has helped me build confidence, leadership, and technical skills that go beyond the classroom.",
  },
  {
    name: "Joshua Tan",
    title: "Member",
    imageSrc: "/faculty.png",
    testimonial:
      "Through ICpEP.SE, I met amazing people who share the same passion for innovation and technology.",
  },
  {
    name: "Rina Lopez",
    title: "Event Organizer",
    imageSrc: "/faculty.png",
    testimonial:
      "Organizing events under ICpEP.SE allowed me to grow as both a professional and a student leader.",
  },
  {
    name: "Mark Dela Cruz",
    title: "Treasurer",
    imageSrc: "/faculty.png",
    testimonial:
      "ICpEP.SE taught me how collaboration and discipline can build a strong tech community.",
  },
];

export default function LandingPage() {

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: false, align: "center" },
    []
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <section className="-mt-10 flex flex-col items-center justify-center px-6 py-20 md:px-16 lg:px-28 space-y-28">
      {/*======= ABOUT US =======*/}
      <div className="text-center max-w-3xl">
        <h2 className="font-rubik text-4xl sm:text-5xl font-extrabold mb-4">ABOUT US</h2>
        <p className="font-raleway text-gray-700 leading-relaxed text-md md:text-xl mb-8 my-10">
          The Institute of Computer Engineers of the Philippines Student Edition (ICpEP.SE)
          CIT-U Chapter is a recognized organization of Computer Engineering students
          that fosters learning, collaboration, and innovation through seminars,
          workshops, and student-led initiatives.
        </p>
        <Button className="bg-primary3 text-white rounded-full px-8 py-3 border-primary3 hover:border-primary1 text-sm md:text-base">Learn more</Button>
      </div>

      {/*======= WHY JOIN =======*/}
      <div className="mt-50 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
        {/* IMAGE */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <Image
            src="/whyicpep.png" 
            alt="ICpEP.SE Members"
            width={450}
            height={550}
            className="rounded-2xl object-cover w-full max-w-md"
          />
        </div>

        {/* TEXT CONTENT */}
        <div className="w-full lg:w-1/2">
          <h2 className="font-rubik text-3xl sm:text-4xl font-extrabold mb-5">WHY JOIN ICPEP.SE?</h2>
          <p className="font-raleway text-gray-700 mb-6 text-xl sm:text-2xl">
            Discover the opportunities that await you as part of a community dedicated to
            Computer Engineering students.
          </p>

          <ul className=" mt-15 space-y-10">
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full border-3 border-primary3 mt-1 mr-3"></div>
              <div>
                <p className="font-rubik font-bold text-xl">Build Connections & Networks</p>
                <p className="font-raleway text-gray-600 text-lg">
                  Be part of a community where your passion connects you to growth and opportunity.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full border-3 border-primary3 mt-1 mr-3"></div>
              <div>
                <p className="font-rubik font-bold text-xl">Level Up Your Skills</p>
                <p className="font-raleway text-gray-600 text-lg">
                  Join exclusive seminars, trainings, and workshops that make learning fun and practical.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full border-3 border-primary3 mt-1 mr-3"></div>
              <div>
                <p className="font-rubik font-bold text-xl">Step into Leadership</p>
                <p className="font-raleway text-gray-600 text-lg">
                  Take the chance to lead projects, events, and teams while developing real-world leadership skills.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    {/*======= Announcements =======*/}
    <section className="w-full bg-sky-400/90 py-12 px-4 sm:px-8 md:px-40 text-black rounded-t-3xl shadow-inner mt-30">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-15">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-black">
          LATEST ANNOUNCEMENTS
        </h2>
        <Button
          variant="outline"
          className="mt-4 sm:mt-0 px-5 py-2 text-white border-2 border-white hover:bg-buttonbg1 transition-all"
        >
          View All
        </Button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-8 items-start sm:-ml-15">
        {/* LEFT SIDE (Big Announcement) */}
        <AnnounceCardBig
          category="Event"
          title="Acquaintance Party"
          date="September 10, 2025"
          description="The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog."
          image="/gle.png"
        />

        {/* RIGHT SIDE (3 Small Announcements) */}
        <div className="flex flex-col gap-2 lg:-ml-15 md:ml-0 ">
          <AnnounceCardSmall
            category="Seminar"
            title="Acquaintance Party"
            date="September 10, 2025"
            description="The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog."
            image="/gle.png"
          />
          <AnnounceCardSmall
            category="Achievement"
            title="Acquaintance Party"
            date="September 10, 2025"
            description="The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog."
            image="/gle.png"
          />
          <AnnounceCardSmall
            category="Event"
            title="Acquaintance Party"
            date="September 10, 2025"
            description="The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog."
            image="/gle.png"
          />
        </div>
      </div>
    </section>

    {/*======= Events  =======*/}
    <section className="w-full py-16 px-4 md:px-40 bg-white text-center mt-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-15">
        <h2 className="font-rubik text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-black">
          UPCOMING EVENTS
        </h2>
        <p className="font-raleway text-gray-700 text-base md:text-lg leading-relaxed mt-5">
          Stay informed and engage in initiatives that foster collaboration,
          build connections, and promote continuous learning within the community.
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch">
        <EventCard
          image="/gle.png"
          title="COMPyesta"
          description="The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog."
        />
        <EventCard
          image="/gle.png"
          title="Why Choose this Biatch?"
          description="The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog."
        />
        <EventCard
          image="/gle.png"
          title="Why Choose this Biatch?"
          description="The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog."
        />
      </div>

      {/* View All Button */}
      <div className="mt-15">
        <Button
          variant="outline"
          className="rounded-full px-8 py-2 text-primary3 border-2 border-primary3 hover:bg-primary1 hover:text-white hover:border-primary1 transition-all"
        >
          View All
        </Button>
      </div>
    </section>

    {/*======= Testimonials =======*/}
    <section className="relative overflow-hidden py-20">
      {/* Moving gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-sky-200 via-sky-400 to-sky-200 animate-gradient-x opacity-70 blur-2xl"></div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-black">
          TESTIMONIALS
        </h2>
        <p className="text-gray-700 text-base md:text-lg mb-12 max-w-2xl">
          Discover how ICpEP.SE has impacted students through their stories and feedback.
        </p>

        {/* Horizontal scroll snap container */}
        <div
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory justify-start w-full max-w-6xl px-6 md:px-12 pb-6"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
          }}
        >
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="flex-shrink-0 snap-center w-[90%] sm:w-[70%] md:w-[50%] lg:w-[33%] transition-transform duration-300 ease-in-out hover:scale-105"
            >
              <TestimonialCard
                name={t.name}
                title={t.title}
                imageSrc={t.imageSrc}
                testimonial={t.testimonial}
              />
            </div>
          ))}
        </div>
      </div>
    </section>

      <Footer />
    </div>
  );
}