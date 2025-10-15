"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

import Header from "../../components/header_guest";
import Hero from "../../components/hero";
import Footer from "../../components/footer";
import Image from 'next/image';
import Button from "@/app/components/button";
import AnnounceCardBig from "@/app/components/cards/announcecardbig";
import AnnounceCardSmall from "@/app/components/cards/announcecardsmall";
import EventCard from "@/app/components/cards/eventcard";
import TestimonialCard from "@/app/components/cards/testimonialcard";
import FacultyOfficerCard from "@/app/components/cards/facultyofficercard";


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

const facultyAndOfficers = [
  { name: "Dr. Maria L. Dizon", title: "Faculty Adviser", image: "/faculty.png" },
  { name: "Engr. Rafael P. Cruz", title: "Co-Adviser", image: "/faculty.png" },
  { name: "Gio Christian Macatual", title: "President", image: "/faculty.png" },
  { name: "Alyssa Mae Reyes", title: "Vice President", image: "/faculty.png" },
  { name: "Daniel Perez", title: "Secretary", image: "/faculty.png" },
  { name: "Hannah Lopez", title: "Treasurer", image: "/faculty.png" },
  { name: "Kevin Torres", title: "Auditor", image: "/faculty.png" },
  { name: "Isabelle Ramos", title: "PRO", image: "/faculty.png" },
  { name: "Luis Mendoza", title: "PIO", image: "/faculty.png" },
  { name: "Rachel Tan", title: "Assistant Secretary", image: "/faculty.png" },
  { name: "Mark Villanueva", title: "Logistics Head", image: "/faculty.png" },
  { name: "Jessa Lim", title: "Creative Director", image: "/faculty.png" },
  { name: "Ethan Cruz", title: "Events Coordinator", image: "/faculty.png" },
  { name: "Nina Santos", title: "Outreach Head", image: "/faculty.png" },
  { name: "Mikael Dela Cruz", title: "Program Officer", image: "/faculty.png" },
  { name: "Cheska Uy", title: "Finance Officer", image: "/faculty.png" },
  { name: "Jordan Pascual", title: "Research Coordinator", image: "/faculty.png" },
  { name: "Kyla Fernandez", title: "Technical Lead", image: "/faculty.png" },
];

const partners = [
  { id: 1, name: "Google", logo: "/icpep logo.png", tier: "gold" },
  { id: 2, name: "Microsoft", logo: "/icpep logo.png", tier: "silver" },
  { id: 3, name: "Amazon", logo: "/icpep logo.png", tier: "gold" },
  { id: 4, name: "IBM", logo: "/icpep logo.png", tier: "bronze" },
  { id: 5, name: "Intel", logo: "/icpep logo.png", tier: "silver" },
  { id: 6, name: "Adobe", logo: "/icpep logo.png", tier: "bronze" },
  { id: 7, name: "Meta", logo: "/icpep logo.png", tier: "gold" },
  { id: 8, name: "Apple", logo: "/icpep logo.png", tier: "silver" },
];

const tierStyles = {
  gold: {
    border: "border-yellow-400",
    glow: "shadow-[0_0_20px_rgba(255,215,0,0.1)]",
    size: 110,
  },
  silver: {
    border: "border-gray-300",
    glow: "shadow-[0_0_20px_rgba(200,200,200,0.1)]",
    size: 95,
  },
  bronze: {
    border: "border-amber-700",
    glow: "shadow-[0_0_20px_rgba(205,127,50,0.1)]",
    size: 85,
  },
};

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Lorem ipsum dolor sit amet consectetur adipiscing elit?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    question: "Ut enim ad minim veniam, quis nostrud exercitation?",
    answer:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    question: "Excepteur sint occaecat cupidatat non proident?",
    answer:
      "Sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    question: "Aliquip ex ea commodo consequat?",
    answer:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
];

export default function LandingPage() {

  const containerRef = useRef<HTMLDivElement>(null);
  const duplicated = [...facultyAndOfficers, ...facultyAndOfficers];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Make scroll-based scaling smooth
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cards = container.querySelectorAll<HTMLDivElement>(".testimonial-card");
      const center = container.scrollLeft + container.clientWidth / 2;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(center - (card.offsetLeft + card.offsetWidth / 2));
        const maxDistance = container.clientWidth / 2;
        const scale = Math.max(0.8, 1.10 - distance / maxDistance);
        card.style.transform = `scale(${scale})`;
        card.style.zIndex = String(scale > 1.0 ? 10 : 1);
      });
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Infinite illusion: duplicate start & end cards
  const extendedTestimonials = [
    testimonials[testimonials.length - 1],
    ...testimonials,
    testimonials[0],
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
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
      <div className="mt-50 flex mb-10 flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
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
    <section className="relative w-full py-12 px-4 sm:px-8 md:px-40 text-black rounded-t-3xl  mt-30 overflow-hidden bg-primary1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-10 mb-15">
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
      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-8 items-start sm:-ml-15 mb-15">
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
    <section className="w-full py-16 px-4 md:px-40 text-center mt-20 mb-20">
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
    <section className="relative w-full flex flex-col items-center py-12 overflow-visible mb-20">
    <div className="absolute inset-0 -z-10 overflow-visible">
  <div className="blob bg-primary1 top-[-10%] left-[-10%] animate-blob-slow" />
  <div className="blob bg-steel-blue-200 top-[-15%] right-[15%] animate-blob-medium" />
  <div className="blob bg-secondary2 top-1/3 left-1/3 animate-blob-fast" />
  <div className="blob bg-primary1 bottom-[-20%] left-[-10%] animate-blob-medium" />
  <div className="blob bg-steel-blue-200 bottom-[-15%] right-[1%] animate-blob-slow" />
  <div className="blob bg-secondary2 top-[40%] right-[35%] opacity-40 animate-blob-fast" />
</div>
        <div className="text-center max-w-4xl mx-auto mb-15">
        <h2 className="font-rubik text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-black">
        TESTIMONIALS
        </h2>
        <p className="font-raleway text-gray-700 text-base md:text-lg leading-relaxed mt-5">
        Discover how ICpEP.SE has impacted students through their stories and feedback.
        </p>
      </div>

      <div
        ref={containerRef}
        className="flex gap-8 h-120 items-center overflow-x-auto scroll-smooth snap-x snap-mandatory px-10 md:px-20 pb-8 hide-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {extendedTestimonials.map((t, index) => (
          <div
            key={index}
            className="flex-shrink-0 snap-center w-[80%] sm:w-[60%] md:w-[33%] flex justify-center items-center"
          >
            <div className="testimonial-card transition-transform duration-300 ease-in-out origin-center">
              <TestimonialCard
                name={t.name}
                title={t.title}
                imageSrc={t.imageSrc}
                testimonial={t.testimonial}
              />
            </div>
          </div>
        ))}
      </div>
    </section>

    {/*======= Faculty & Officers =======*/}
    <section className="w-full py-16 overflow-hidden mb-20">
      <div className="text-center mb-10">
        <h2 className="font-rubik text-3xl md:text-4xl font-extrabold mb-4">
          COUNCIL OFFICERS & FACULTIES
        </h2>
        <p className="font-raleway text-base sm:text-lg text-gray-600 mt-5 max-w-2xl mx-auto">
          Meet the council officers, who lead the community, and the faculty,
          who provide direction and support.
        </p>
      </div>

      {/* Moving wrapper */}
      <div className="overflow-hidden">
        <motion.div
          className="flex w-max gap-6 p-5 cursor-grab active:cursor-grabbing"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
        >
          {duplicated.map((o, i) => (
            <div key={i} className="flex-shrink-0">
              <FacultyOfficerCard
                name={o.name}
                title={o.title}
                image={o.image}
                onClick={() => alert(`${o.name} clicked`)}
              />
            </div>
          ))}
        </motion.div>
      </div>
      <div className="-mt-5 overflow-hidden">
        <motion.div
          className="flex w-max gap-6 p-5 cursor-grab active:cursor-grabbing"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
        >
          {duplicated.map((o, i) => (
            <div key={i} className="flex-shrink-0">
              <FacultyOfficerCard
                name={o.name}
                title={o.title}
                image={o.image}
                onClick={() => alert(`${o.name} clicked`)}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    {/*======= Our Partners =======*/}
    <section className="w-full py-24 px-6 flex flex-col items-center text-center sm:mb-60">
      {/* Title and description */}
      <div className="max-w-2xl mx-auto mb-20">
        <h2 className="font-rubik text-3xl md:text-4xl font-bold text-gray-900">
          Our Partners
        </h2>
        <p className="font-raleway text-gray-600 mt-3 text-sm md:text-base">
          Building meaningful collaborations that make an impact on students
          and the community.
        </p>
      </div>

      {/* Partners logos */}
      <div className="flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12 mb-12">
        {partners.map((partner, index) => {
          const tier = tierStyles[partner.tier];
          const delay = index * 0.3; // stagger the bounce timing for variety

          return (
            <motion.div
              key={partner.id}
              className="flex flex-col items-center group"
              initial={{ y: 0 }}
              animate={{
                y: [0, -10, 0], // bounce up-down animation
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
                delay,
              }}
            >
              <div
                className={`flex items-center justify-center rounded-full bg-white border ${tier.border} ${tier.glow} transition-transform duration-300 group-hover:scale-110`}
                style={{
                  width: `${tier.size}px`,
                  height: `${tier.size}px`,
                }}
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={tier.size * 0.45}
                  height={tier.size * 0.45}
                  className="object-contain"
                />
              </div>

              {/* Name appears on hover */}
              <motion.span
                className="text-gray-700 mt-3 text-sm opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform translate-y-2 transition-all duration-300"
              >
                {partner.name}
              </motion.span>
            </motion.div>
          );
        })}
      </div>

      {/* Explore button */}
      <Button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 text-sm md:text-base rounded-full">
        Explore Partnership
      </Button>
    </section>
    
    {/*======= Faqs =======*/}
    <section className="relative flex flex-col md:flex-row justify-between items-start w-full max-w-7xl mx-auto px-6 md:px-12 py-40 mb-20">
      {/* Blurred question mark background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/question.svg"
          alt="question mark"
          width={300}
          height={300}
          className="absolute top-[-10%] left-[-5%] rotate-[-20deg] blur-xl opacity-60"
        />
        <Image
          src="/question.svg"
          alt="question mark"
          width={250}
          height={250}
          className="absolute top-[-30%] right-[30%] rotate-[15deg] blur-xl opacity-70"
        />
        <Image
          src="/question.svg"
          alt="question mark"
          width={350}
          height={350}
          className="absolute bottom-[-10%] right-[-15%] rotate-[-15deg] blur-[10px] opacity-80"
        />
        <Image
          src="/question.svg"
          alt="question mark"
          width={200}
          height={200}
          className="absolute bottom-[-30%] left-[30%] rotate-[10deg] blur-[5px] opacity-60"
        />
      </div>

      {/* Left side - Title and buttons */}
      <div className="w-full md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
        <h2 className="font-rubik text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Any questions? <br /> We got you.
        </h2>
        <p className="font-raleway text-gray-700 mb-6 text-base md:text-lg max-w-md">
          Explore our FAQs or reach out for personalized support—our team is here to help you.
        </p>
        <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
          <Button className="bg-primary3 border-primary3 hover:bg-primary2 hover:border-primary2 text-white px-6 py-3 rounded-full">
            Contact Us
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-full"
          >
            More FAQs <span className="text-lg font-bold">+</span>
          </Button>
        </div>
      </div>

      {/* Right side - FAQ accordion */}
      <div className="w-full md:w-1/2 space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-gray-300 pb-4 cursor-pointer transition-all"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-rubik text-gray-900 text-xl font-semibold">
                {faq.question}
              </h3>
              <span className="text-2xl font-bold text-blue-600">
                {openIndex === index ? "−" : "+"}
              </span>
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ${
                openIndex === index
                  ? "max-h-40 mt-3 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <p className="font-raleway text-gray-700 text-sm md:text-base leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
      <Footer />
    </div>
  );
}