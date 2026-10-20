import { formatDate } from "../utils/announcements";
import RichContent from "@/app/components/rich-content";

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

const formatYearLevel = (year: string) => {
  if (year.toLowerCase().includes("year")) return year;

  const num = parseInt(year);
  if (isNaN(num)) return year;

  const suffix = (n: number) => {
    if (n >= 11 && n <= 13) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${num}${suffix(num)} Year`;
};

export default function AnnouncementDetails({
  announcement,
}: AnnouncementDetailsProps) {
  if (!announcement) return null;

  const announcementType = announcement.type?.toLowerCase() || "";

  const showAgenda = announcementType === "meeting" && announcement.agenda;

  const showAwardees =
    (announcementType === "award" || announcementType === "achievement") &&
    announcement.awardees;

  return (
    <div className="overflow-hidden rounded-3xl border border-primary1/15 bg-white shadow-lg">
      <div className="relative overflow-hidden bg-linear-to-br from-primary1 to-primary3 px-6 py-7 sm:px-8 sm:py-8">
        <div className="relative">
          <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 font-rubik text-sm font-semibold text-white backdrop-blur-sm">
            {announcement.type}
          </span>
          <h1 className="font-rubik text-2xl font-bold leading-tight text-white sm:text-4xl">
            {announcement.title}
          </h1>
          {announcement.publishDate && (
            <p className="mt-3 font-raleway text-sm text-white/80">
              Posted on {formatDate(announcement.publishDate as string)}
            </p>
          )}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <RichContent
          value={announcement.content ?? announcement.description ?? ""}
          className="font-raleway text-gray-700 leading-relaxed text-base mb-8"
        />

      {showAgenda && (
        <div>
          <h3 className="mb-4 flex items-center gap-3 font-rubik text-lg font-bold text-primary3 sm:text-xl">
            <span className="h-6 w-1.5 rounded-full bg-primary1" />
            Agenda
          </h3>
          <ul className="space-y-2 font-raleway">
            {announcement.agenda!.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-3 rounded-2xl bg-buttonbg1/60 px-4 py-3 text-gray-700"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary1 font-rubik text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span className="pt-0.5">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showAwardees && (
        <div>
          <h3 className="mb-4 flex items-center gap-3 font-rubik text-lg font-bold text-primary3 sm:text-xl">
            <span className="h-6 w-1.5 rounded-full bg-primary1" />
            Award Recipients
          </h3>
          <div className="space-y-3">
            {announcement.awardees!.map((awardee, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 rounded-2xl border border-primary1/15 bg-linear-to-r from-buttonbg1/60 to-white px-5 py-4 transition-colors hover:border-primary1/40"
              >
                <div className="min-w-0">
                  <h4 className="font-rubik text-base font-bold leading-snug text-primary3 sm:text-lg">
                    {awardee.name}
                  </h4>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span className="font-raleway text-sm font-medium text-gray-500 sm:text-primary2">
                      {awardee.award}
                    </span>
                    {awardee.year && (
                      <span className="flex items-center gap-2 font-raleway text-sm text-gray-500 sm:hidden">
                        <span className="h-1 w-1 rounded-full bg-primary1" />
                        {formatYearLevel(awardee.year)}
                      </span>
                    )}
                  </div>
                </div>
                {awardee.year && (
                  <span className="hidden shrink-0 rounded-full border border-primary1/30 bg-white px-3.5 py-1 font-raleway text-xs font-semibold text-primary1 sm:inline-block">
                    {formatYearLevel(awardee.year)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
