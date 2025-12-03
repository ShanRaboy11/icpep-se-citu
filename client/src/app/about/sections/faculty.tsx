"use client";

import { FC } from "react";

// --- TYPE DEFINITION ---
interface FacultyMember {
  name: string;
  position: string;
  imageUrl: string;
}

// --- CARD COMPONENT FOR THE DEPARTMENT HEAD ---
const DepartmentHeadCard: FC<FacultyMember> = ({
  name,
  position,
  imageUrl,
}) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-4">
        <img
          src={imageUrl}
          alt={`Profile of ${name}`}
          className="w-40 h-40 object-cover rounded-full ring-4 ring-primary1/50 p-1"
        />
      </div>
      <h3 className="font-rubik text-2xl font-bold text-primary3">{name}</h3>
      <p className="font-raleway text-primary1 font-semibold">{position}</p>
    </div>
  );
};

// --- CARD COMPONENT FOR OTHER FACULTY MEMBERS ---
const FacultyMemberCard: FC<FacultyMember> = ({ name, position, imageUrl }) => {
  return (
    <div className="w-full text-center bg-white/50 backdrop-blur-sm border border-gray-200/50 p-6 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1">
      <img
        src={imageUrl}
        alt={`Profile of ${name}`}
        className="w-28 h-28 object-cover rounded-full mx-auto mb-4 border-4 border-gray-100"
      />
      <h4 className="font-rubik font-bold text-lg text-primary3">{name}</h4>
      <p className="font-raleway text-sm text-gray-500">{position}</p>
    </div>
  );
};

// --- MAIN SECTION COMPONENT ---
interface FacultySectionProps {
  faculty: FacultyMember[];
}

const FacultySection: FC<FacultySectionProps> = ({ faculty }) => {
  // Assume the first person in the array is the department head
  const departmentHead = faculty[0];
  const otherFaculty = faculty.slice(1);

  return (
    <section className="mt-48">
      <div className="w-full max-w-7xl mx-auto px-6 pb-24">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 mb-4">
            CPE Department Faculty
          </h2>
          <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
            The esteemed faculty members of the Computer Engineering department
            who mentor and inspire the next generation.
          </p>
        </div>

        {/* Department Head Layout */}
        {departmentHead && (
          <div className="flex justify-center mb-16">
            <DepartmentHeadCard {...departmentHead} />
          </div>
        )}

        {/* Other Faculty Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherFaculty.map((member) => (
            <FacultyMemberCard key={member.name} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacultySection;
