import { Announcement } from '../types';

interface AboutSectionProps {
  announcement: Announcement;
}

export default function AboutSection({ announcement }: AboutSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">
        About This {announcement.type}
      </h2>
      <p className="text-gray-700 leading-relaxed text-base mb-6">
        {announcement.fullDescription || announcement.description}
      </p>

      {/* Agenda */}
      {announcement.agenda && announcement.type.toLowerCase() !== 'award' && (
        <div>
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            {announcement.type.toLowerCase() === 'meeting' ? 'Agenda' : 'Schedule'}
          </h3>
          <ul className="space-y-2">
            {announcement.agenda.map((item, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="text-blue-500 mr-3 mt-1 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Awardees */}
      {announcement.awardees && announcement.type.toLowerCase() === 'award' && (
        <div>
          <h3 className="text-xl font-bold text-blue-900 mb-4">Award Recipients</h3>
          <div className="space-y-3">
            {announcement.awardees.map((awardee, index) => (
              <div key={index} className="border-l-4 border-blue-500 bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-blue-900 text-lg">{awardee.name}</h4>
                    <p className="text-sm text-gray-600">{awardee.program}</p>
                  </div>
                  <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full font-semibold">
                    {awardee.year}
                  </span>
                </div>
                <p className="text-sm text-blue-700 font-medium mt-2">{awardee.award}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}