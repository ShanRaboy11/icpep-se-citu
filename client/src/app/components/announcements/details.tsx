import StatusPill from "@/app/components/ui/status-pill";
import SectionHeading from "@/app/components/ui/section-heading";
import { formatDate } from "../../utils/announcements/announcements";
import RichContent from "@/app/components/content/rich-content";

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

  const typeDot =
    announcementType === "meeting"
      ? "bg-indigo-300"
      : announcementType === "achievement" || announcementType === "award"
        ? "bg-teal-300"
        : "bg-sky-300";

  const showAgenda = announcementType === "meeting" && announcement.agenda;

  const showAwardees =
    (announcementType === "award" || announcementType === "achievement") &&
    announcement.awardees;

  return (
    <div className="overflow-hidden rounded-3xl border border-primary1/15 bg-white shadow-md">
      <div className="bg-linear-to-br from-primary1 to-primary3 px-6 py-7 sm:px-8 sm:py-8">
        <div>
          <StatusPill label={announcement.type ?? ""} dotClassName={typeDot} className="mb-4" />
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
          <SectionHeading as="h3" size="md" className="mb-4">Agenda</SectionHeading>
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
          <SectionHeading as="h3" size="md" className="mb-4">Award Recipients</SectionHeading>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {announcement.awardees!.map((awardee, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 rounded-2xl border border-primary1/15 bg-linear-to-br from-buttonbg1/70 to-white p-4 transition-colors hover:border-primary1/40"
              >
                <div className="min-w-0">
                  <h4 className="font-rubik text-base font-bold leading-snug text-primary3">
                    {awardee.name}
                  </h4>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 font-raleway text-sm font-medium text-gray-500 sm:text-primary2">
                    <span>{awardee.award}</span>
                    {awardee.year && (
                      <span className="flex items-center gap-2 sm:hidden">
                        <span className="h-1 w-1 rounded-full bg-primary1" />
                        {formatYearLevel(awardee.year)}
                      </span>
                    )}
                  </p>
                </div>
                {awardee.year && (
                  <span className="hidden shrink-0 rounded-full border border-primary1/30 bg-white px-3 py-1 font-raleway text-xs font-semibold text-primary1 sm:inline-block">
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
