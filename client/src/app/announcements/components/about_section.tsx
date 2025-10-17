import { Announcement } from "../types";

interface AboutSectionProps {
  announcement: Announcement;
}

export default function AboutSection({ announcement }: AboutSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
      {/* --- FONT: Rubik --- */}
      <h2 className="font-rubik text-2xl font-bold text-primary3 mb-4">
        About This {announcement.type}
      </h2>
      {/* --- FONT: Raleway --- */}
      <p className="font-raleway text-gray-700 leading-relaxed text-base mb-6">
        {announcement.fullDescription || announcement.description}
      </p>

      {/* Agenda */}
      {announcement.agenda && announcement.type.toLowerCase() !== "award" && (
        <div>
          {/* --- FONT: Rubik --- */}
          <h3 className="font-rubik text-xl font-bold text-primary3 mb-4">
            {announcement.type.toLowerCase() === "meeting"
              ? "Agenda"
              : "Schedule"}
          </h3>
          {/* --- FONT: Raleway --- */}
          <ul className="space-y-2 font-raleway">
            {announcement.agenda.map((item, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="text-primary1 mr-3 mt-1 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Awardees */}
      {announcement.awardees && announcement.type.toLowerCase() === "award" && (
        <div>
          {/* --- FONT: Rubik --- */}
          <h3 className="font-rubik text-xl font-bold text-primary3 mb-4">
            Award Recipients
          </h3>
          <div className="space-y-3">
            {announcement.awardees.map((awardee, index) => (
              <div
                key={index}
                className="border-l-4 border-primary1 bg-blue-50 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    {/* --- FONT: Rubik --- */}
                    <h4 className="font-rubik font-bold text-primary3 text-lg">
                      {awardee.name}
                    </h4>
                    {/* --- FONT: Raleway --- */}
                    <p className="font-raleway text-sm text-gray-600">
                      {awardee.program}
                    </p>
                  </div>
                  {/* --- FONT: Raleway --- */}
                  <span className="font-raleway text-xs bg-primary1 text-white px-3 py-1 rounded-full font-semibold">
                    {awardee.year}
                  </span>
                </div>
                {/* --- FONT: Raleway --- */}
                <p className="font-raleway text-sm text-primary2 font-medium mt-2">
                  {awardee.award}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
