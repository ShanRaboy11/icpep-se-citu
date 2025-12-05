"use client";

import { FC } from "react";

interface FacultyMember {
  name: string;
  position: string;
  imageUrl: string;
}

const DepartmentHeadCard: FC<FacultyMember> = ({
  name,
  position,
  imageUrl,
}) => {
  return (
    <div className="flex flex-col items-center text-center relative group cursor-default">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 bg-primary1/20 blur-[40px] sm:blur-[60px] rounded-full -z-10 transition-all duration-500 group-hover:bg-primary1/30"></div>

      <div className="relative mb-3 sm:mb-5">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary1 to-primary3 blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>

        <div className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-full border-4 border-white shadow-xl overflow-hidden">
          <img
            src={imageUrl}
            alt={`Profile of ${name}`}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </div>
      </div>

      <h3 className="font-rubik text-2xl sm:text-3xl font-bold text-primary3 mb-1 sm:mb-2">
        {name}
      </h3>
      <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-primary1/10 text-primary1 font-raleway font-bold text-xs sm:text-sm tracking-wide">
        {position}
      </span>
    </div>
  );
};

const FacultyMemberCard: FC<FacultyMember> = ({ name, imageUrl }) => {
  return (
    <div className="group relative w-full flex flex-col items-center bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-300 ease-in-out hover:shadow-primary1/40 hover:-translate-y-1 overflow-hidden p-3 sm:p-8">
      <div className="relative mb-3 sm:mb-6 flex justify-center items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 flex items-center justify-center pointer-events-none">
          <div className="absolute w-[90px] h-[90px] sm:w-[180px] sm:h-[180px] rounded-full border border-gray-100 opacity-100"></div>
          <div className="absolute w-[120px] h-[120px] sm:w-[240px] sm:h-[240px] rounded-full border border-gray-100 opacity-80"></div>
          <div className="absolute w-[150px] h-[150px] sm:w-[300px] sm:h-[300px] rounded-full border border-gray-50 opacity-60"></div>
          <div className="absolute w-[180px] h-[180px] sm:w-[360px] sm:h-[360px] rounded-full border border-gray-50 opacity-40"></div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-primary1/40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110 pointer-events-none"></div>

        <div className="relative w-20 h-20 sm:w-36 sm:h-36 p-1 sm:p-1.5 bg-white rounded-full border-2 border-primary1/40 shadow-sm z-10 group-hover:shadow-md group-hover:border-primary1 transition-all duration-300">
          <img
            src={imageUrl}
            alt={`Profile of ${name}`}
            className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      <div className="relative z-10 text-center">
        <h4 className="font-rubik font-bold text-sm sm:text-xl text-primary3 mb-1 sm:mb-2 leading-tight">
          {name}
        </h4>
        <p className="font-raleway text-[10px] sm:text-sm font-bold text-primary1 uppercase tracking-wider">
          Instructor
        </p>
      </div>
    </div>
  );
};

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

        {/* Department Head Layout */}
        {departmentHead && (
          <div className="flex justify-center mb-12 sm:mb-20">
            <DepartmentHeadCard {...departmentHead} />
          </div>
        )}

        {/* Other Faculty Grid Layout */}
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
