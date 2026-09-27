"use client";

import { FC } from "react";
import YearCard from "../components/year-card";

interface OfficerTerm {
  term: string;
  href: string;
}

interface StudentLeadersSectionProps {
  history: OfficerTerm[];
}

const StudentLeadersSection: FC<StudentLeadersSectionProps> = ({ history }) => {
  if (history.length === 0) return null;

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
        {history.map((termData, i) => {
          // A lone card left over in an odd-count list would otherwise sit
          // in the left column by itself — center it across both instead.
          const isDangling = history.length % 2 !== 0 && i === history.length - 1;
          return (
            <div
              key={termData.term}
              className={isDangling ? "md:col-span-2 md:mx-auto md:w-[calc(50%-1rem)]" : ""}
            >
              <YearCard termData={termData} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StudentLeadersSection;
