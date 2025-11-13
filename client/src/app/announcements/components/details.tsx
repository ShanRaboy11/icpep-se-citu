import { getTypeColor, formatDate } from "../utils/announcements";

type AnnouncementLike = {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  content?: string;
  type?: string;
  imageUrl?: string | null;
  publishDate?: string;
  date?: string;
  agenda?: string[];
  awardees?: Array<{ name: string; year?: string; award: string }>;
};

interface AnnouncementDetailsProps {
  announcement?: AnnouncementLike | null;
}

export default function AnnouncementDetails({ announcement }: AnnouncementDetailsProps) {
  if (!announcement) return null;

  // Normalize the date field. Prefer `date` (static samples), then `publishDate`.
  const announcementType = announcement.type?.toLowerCase() || "";

  // Determine if we should show agenda (only for meetings)
  const showAgenda = announcementType === "meeting" && announcement.agenda;
  
  // Determine if we should show awardees (only for awards)
  const showAwardees = announcementType === "award" && announcement.awardees;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg">
      <div className="pb-6 mb-6 border-b border-gray-200">
        <div className="mb-4">
          <span
            className={`inline-block px-4 py-1.5 rounded-lg text-sm font-rubik font-semibold text-white ${getTypeColor(
              announcement.type ?? ""
            )}`}
          >
            {announcement.type}
          </span>
        </div>
        <h1 className="font-rubik text-2xl sm:text-4xl font-bold text-primary3 mb-3">
          {announcement.title}
        </h1>
        <div className="flex flex-col gap-1">
          {announcement.publishDate && (
            <p className="text-sm text-gray-500">Posted on {formatDate(announcement.publishDate as string)}</p>
          )}
        </div>
      </div>

      <div>
        <p className="font-raleway text-gray-700 leading-relaxed text-base mb-8">
          {announcement.content ?? announcement.description}
        </p>
      </div>

      {showAgenda && (
        <div>
          <h3 className="font-rubik text-lg sm:text-xl font-bold text-primary3 mb-4">
            Agenda
          </h3>
          <ul className="space-y-2 font-raleway">
            {announcement.agenda!.map((item, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="text-primary1 mr-3 mt-1 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showAwardees && (
        <div>
          <h3 className="font-rubik text-lg sm:text-xl font-bold text-primary3 mb-4">
            Award Recipients
          </h3>
          <div className="space-y-3">
            {announcement.awardees!.map((awardee, index) => (
              <div
                key={index}
                className="border-l-4 border-primary1 bg-blue-50 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-rubik font-bold text-primary3 text-base sm:text-lg">
                    {awardee.name}
                  </h4>
                  {awardee.year && (
                    <span className="font-raleway text-xs bg-primary1 text-white px-3 py-1 rounded-full font-semibold">
                      {awardee.year}
                    </span>
                  )}
                </div>
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