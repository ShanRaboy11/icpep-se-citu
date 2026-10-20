import { Event } from "../utils/event";
import RichContent from "@/app/components/rich-content";

interface Props {
  title: string;
  description: string;
  details: Event["details"];
  content?: string;
}

export default function EventDetails({
  description,
  details,
  content,
}: Props) {
  return (
    <div className="rounded-3xl border border-primary1/15 bg-white p-6 shadow-lg sm:p-8">
      <h2 className="mb-5 flex items-center gap-3 font-rubik text-xl font-bold text-primary3 sm:text-2xl">
        <span className="h-6 w-1.5 rounded-full bg-primary1" />
        Details
      </h2>

      <div className="space-y-4 font-raleway text-sm leading-relaxed text-bodytext sm:text-base">
        <p>{description}</p>

        {content && (
          <section className="mt-6 space-y-3">
            <h3 className="font-rubik text-lg font-semibold text-primary3">Content</h3>

            <RichContent
              value={content}
              className="font-raleway leading-relaxed text-bodytext"
            />
          </section>
        )}
      </div>

      {Array.isArray(details) && details.length > 0 && (
        <div className="mt-6 space-y-4">
          {details.map((section, idx) => (
            <div key={idx} className="rounded-2xl bg-buttonbg1/60 p-4 sm:p-5">
              <p className="font-rubik text-base font-semibold text-primary3">
                {section.title}
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 font-raleway text-bodytext marker:text-primary1">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
