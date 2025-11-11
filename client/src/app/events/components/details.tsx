// components/event-details.tsx
import { Event } from "../utils/event";

interface Props {
  title: string;
  description: string;
  details: Event["details"];
}

export default function EventDetails({ title, description, details }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg">
      <h2 className="font-rubik text-xl sm:text-2xl font-bold text-primary3 mb-4 pb-2 border-b border-gray-100">
        Details
      </h2>
      <div className="prose sm:prose-lg max-w-none font-raleway text-bodytext">
        <p>
          <strong>{title}</strong> {description}
        </p>

        {Array.isArray(details) &&
          details.map((section, idx) => (
            <div key={idx} className="mt-4">
              <p className="font-semibold">{section.title}</p>
              <ul className="mt-2 list-disc list-inside">
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