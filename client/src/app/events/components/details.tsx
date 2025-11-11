// components/event-details.tsx
import { Event } from "../utils/event";

interface Props {
  title: string;
  description: string;
  details: string; // Event["details"] is a string, not an array
}

export default function EventDetails({ title, description, details }: Props) {
  // Parse details string if it contains structured content
  const renderDetails = () => {
    // If details is plain text, render it as paragraphs
    if (!details) {
      return <p>{description}</p>;
    }

    // Split by double newlines for paragraphs or check for markdown-like structure
    const paragraphs = details.split('\n\n').filter(p => p.trim());
    
    return (
      <>
        <p>
          <strong>{title}</strong> {description}
        </p>
        {paragraphs.map((paragraph, index) => {
          // Check if it looks like a heading (ends with colon)
          if (paragraph.includes(':') && paragraph.indexOf(':') < 50) {
            const [heading, ...content] = paragraph.split(':');
            return (
              <div key={index} className="mt-4">
                <p className="font-semibold">{heading}:</p>
                <p className="mt-1">{content.join(':').trim()}</p>
              </div>
            );
          }
          
          // Check if it looks like a list (starts with - or *)
          if (paragraph.includes('\n-') || paragraph.includes('\n*')) {
            const lines = paragraph.split('\n');
            const title = lines[0];
            const items = lines.slice(1).filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'));
            
            if (items.length > 0) {
              return (
                <div key={index} className="mt-4">
                  {title && !title.startsWith('-') && !title.startsWith('*') && (
                    <p className="font-semibold">{title}</p>
                  )}
                  <ul className="mt-1 list-disc list-inside">
                    {items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item.replace(/^[-*]\s*/, '')}</li>
                    ))}
                  </ul>
                </div>
              );
            }
          }
          
          // Regular paragraph
          return (
            <p key={index} className="mt-4">
              {paragraph}
            </p>
          );
        })}
      </>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg">
      <h2 className="font-rubik text-xl sm:text-2xl font-bold text-primary3 mb-4 pb-2 border-b border-gray-100">
        Details
      </h2>
      <div className="prose sm:prose-lg max-w-none font-raleway text-bodytext">
        {renderDetails()}
      </div>
    </div>
  );
}