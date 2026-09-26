"use client";

import { FC } from "react";
import DepartmentHeadCard from "../components/department-head-card";
import FacultyMemberCard from "../components/faculty-member-card";

interface FacultyMember {
  name: string;
  position: string;
  imageUrl: string;
}

interface FacultySectionProps {
  faculty: FacultyMember[];
}

const FacultySection: FC<FacultySectionProps> = ({ faculty }) => {
  // The center-stage highlight should always be whoever holds the
  // "Department Head" position, regardless of where they land in the list —
  // fall back to the first entry if no one has that title yet.
  const headIndex = faculty.findIndex((member) =>
    member.position?.toLowerCase().includes("department head"),
  );
  const departmentHead = faculty[headIndex >= 0 ? headIndex : 0];
  const otherFaculty = faculty
    .filter((_, i) => i !== (headIndex >= 0 ? headIndex : 0))
    .sort((a, b) => a.name.trim().localeCompare(b.name.trim()));

  return (
    <section className="mt-48">
      <div className="w-full max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-20">
          <h2 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 mb-6">
            CPE Department Faculty
          </h2>
          <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            The esteemed faculty members of the Computer Engineering department
            who mentor and inspire the next generation.
          </p>
        </div>

        {departmentHead && (
          <div className="flex justify-center mb-12 sm:mb-20">
            <DepartmentHeadCard {...departmentHead} />
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 gap-y-6 sm:gap-x-6 sm:gap-y-10">
          {otherFaculty.map((member) => (
            <FacultyMemberCard key={member.name} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacultySection;
