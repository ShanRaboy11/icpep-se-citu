import SectionHeading from "@/app/components/ui/section-heading";
import { Event } from "../../utils/events/event";
import RichContent from "@/app/components/content/rich-content";

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
    <div className="rounded-3xl border border-primary1/15 bg-white p-6 shadow-md sm:p-8">
      <SectionHeading className="mb-5">Details</SectionHeading>

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
