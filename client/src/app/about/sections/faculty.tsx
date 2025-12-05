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
  const departmentHead = faculty[0];
  const otherFaculty = faculty.slice(1);

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
