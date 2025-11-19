"use client";

import { FC } from "react";
import YearCard from "../components/year-card";

interface OfficerTerm {
  term: string;
}

interface StudentLeadersSectionProps {
  history: OfficerTerm[];
}

const StudentLeadersSection: FC<StudentLeadersSectionProps> = ({ history }) => {
  return (
    <section className="mt-40">
      <div className="w-full max-w-7xl mx-auto px-6 text-center">
        <h2 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 mb-4">
          Our Student Leaders
        </h2>
        <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl mx-auto mb-16">
          A legacy of leadership upheld by the councils and committees whose
          commitment continues to inspire our chapter’s journey.
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {history.map((termData) => (
          <YearCard key={termData.term} termData={termData} />
        ))}
      </div>
    </section>
  );
};

export default StudentLeadersSection;
