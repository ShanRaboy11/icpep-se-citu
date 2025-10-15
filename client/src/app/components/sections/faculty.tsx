"use client";

import { motion } from "framer-motion";
import FacultyOfficerCard from "@/app/components/cards/facultyofficercard";

export function FacultyOfficersSection() {
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

  const duplicated = [...facultyAndOfficers, ...facultyAndOfficers];

  return (
    <section className="w-full py-16 overflow-hidden mb-20">
      <div className="text-center mb-10">
        <h2 className="font-rubik text-3xl md:text-4xl font-extrabold mb-4 text-black">
          COUNCIL OFFICERS & FACULTIES
        </h2>
        <p className="font-raleway text-base sm:text-lg text-gray-600 mt-5 max-w-2xl mx-auto">
          Meet the council officers, who lead the community, and the faculty,
          who provide direction and support.
        </p>
      </div>

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
  );
}