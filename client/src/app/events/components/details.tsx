import { Event } from "../utils/event";

interface Props {
  title: string;
  description: string;
  details: Event["details"];
  content?: string;
}

export default function EventDetails({
  title,
  description,
  details,
  content,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg">
      <h2 className="font-rubik text-xl sm:text-2xl font-bold text-primary3 mb-4 pb-2 border-b border-gray-100">
        Details
      </h2>

      <div className="font-raleway text-bodytext text-sm sm:text-base leading-relaxed space-y-4">
        <p>{description}</p>

        {content && (
          <section className="mt-6 space-y-3">
            <h3 className="font-rubik font-semibold text-lg">Content</h3>

            {/<\/?[a-z][\s\S]*>/i.test(content) ? (
              <div
                className="font-raleway text-bodytext leading-relaxed space-y-3"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="font-raleway whitespace-pre-wrap leading-relaxed">
                {content}
              </div>
            )}
          </section>
        )}
      </div>

      <div className="mt-6 space-y-6">
        {Array.isArray(details) &&
          details.map((section, idx) => (
            <div key={idx}>
              <p className="font-rubik font-semibold text-base">
                {section.title}
              </p>
              <ul className="mt-2 list-disc list-inside font-raleway text-bodytext space-y-1">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
}
