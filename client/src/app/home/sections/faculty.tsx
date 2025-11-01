"use client";

import { motion } from "framer-motion";
import FacultyOfficerCard from "@/app/home/components/faculty-officer-card";

export function FacultyOfficersSection() {
  const facultyAndOfficers = [
    {
      name: "Dr. Maria L. Dizon",
      title: "Faculty Adviser",
      image: "/faculty.png",
    },
    {
      name: "Engr. Rafael P. Cruz",
      title: "Co-Adviser",
      image: "/faculty.png",
    },
    {
      name: "Gio Christian Macatual",
      title: "President",
      image: "/faculty.png",
    },
    {
      name: "Alyssa Mae Reyes",
      title: "Vice President",
      image: "/faculty.png",
    },
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
    {
      name: "Mikael Dela Cruz",
      title: "Program Officer",
      image: "/faculty.png",
    },
    { name: "Cheska Uy", title: "Finance Officer", image: "/faculty.png" },
    {
      name: "Jordan Pascual",
      title: "Research Coordinator",
      image: "/faculty.png",
    },
    { name: "Kyla Fernandez", title: "Technical Lead", image: "/faculty.png" },
  ];

  const MINIMUM_BASE_LENGTH = 15;
  let extendedList = [...facultyAndOfficers];

  if (extendedList.length > 0 && extendedList.length < MINIMUM_BASE_LENGTH) {
    const repeatsNeeded = Math.ceil(MINIMUM_BASE_LENGTH / extendedList.length);
    extendedList = Array.from(
      { length: repeatsNeeded },
      () => facultyAndOfficers
    ).flat();
  }

  const duplicated = [...extendedList, ...extendedList];

  return (
    <section className="light-dark-background relative pt-28 pb-16 sm:pt-36 sm:pb-20">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12 md:mb-16 text-center">
          <h1 className="relative font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight">
            Council Officers & Faculty
          </h1>
          <p className="relative font-raleway text-base sm:text-lg text-bodytext mt-2 max-w-lg mx-auto">
            Meet the framework of our community.
          </p>
        </div>
      </div>

      <div className="relative z-10 w-full overflow-hidden">
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

        <motion.div
          className="flex w-max gap-6 p-5 cursor-grab active:cursor-grabbing -mt-5"
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
  );
}
