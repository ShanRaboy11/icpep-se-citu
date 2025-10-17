import { Event } from "../data/event";

interface Props {
  title: string;
  description: string;
  details: Event["details"];
}

export default function EventDetails({ title, description, details }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
      <h2 className="font-rubik text-2xl font-bold text-primary3 mb-4 pb-2 border-b border-gray-100">
        Details
      </h2>
      <div className="prose prose-lg max-w-none font-raleway text-bodytext">
        <p>
          <strong>{title}</strong> {description}
        </p>
        {details.map((section) => (
          <div key={section.title}>
            <p className="mt-4 font-semibold">{section.title}:</p>
            <ul className="mt-0">
              {section.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
