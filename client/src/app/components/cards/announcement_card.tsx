interface AnnouncementProps {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  imageUrl: string;
  onClick?: () => void;
}

export function AnnouncementCard({
  title,
  description,
  date,
  type,
  imageUrl,
  onClick,
}: AnnouncementProps) {
  const getTypeColor = (type: string) => {
    // ... switch statement remains the same
    switch (type.toLowerCase()) {
      case "event": return "bg-blue-500 text-white";
      case "seminar": return "bg-sky-500 text-white";
      case "achievement": return "bg-green-500 text-white";
      case "workshop": return "bg-purple-500 text-white";
      case "meeting": return "bg-orange-500 text-white";
      case "award": return "bg-yellow-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    // --- MODIFICATION 1: Added new transition and hover effect classes ---
    <div
      className="bg-white rounded-[25px] shadow-lg shadow-gray-300
                 overflow-hidden mb-10 max-w-4xl mx-auto 
                 h-auto md:h-80 cursor-pointer
                 transition-all duration-300 ease-in-out
                 hover:shadow-2xl hover:shadow-primary1/40
                 hover:-translate-y-1 hover:scale-[1.02]
                 hover:ring-2 hover:ring-primary1/50"
      onClick={onClick}
    >
      <div className="md:flex h-full">
        {/* Image Section */}
        <div className="md:w-1/3 h-48 md:h-full">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="md:w-2/3 p-4 sm:p-6 flex flex-col md:justify-between">
          <div>
            {/* Type Badge */}
            <div className="mb-3 sm:mb-4">
              {/* --- MODIFICATION 2: Font changed to Raleway --- */}
              <span
                className={`inline-block px-3 py-1 sm:px-4 sm:py-2 rounded-[10px] text-xs sm:text-sm font-raleway font-medium ${getTypeColor(
                  type
                )}`}
              >
                {type}
              </span>
            </div>

            {/* Title (Remains Rubik) */}
            <h3 className="mb-2 sm:mb-3 text-[#003599] text-lg sm:text-xl font-rubik font-bold line-clamp-2">
              {title}
            </h3>

            {/* Description (Remains Raleway) */}
            <p className="font-raleway text-gray-700 text-sm sm:text-base mb-2 sm:mb-4 leading-relaxed line-clamp-2 sm:line-clamp-3 overflow-hidden">
              {description}
            </p>
          </div>

          {/* Date */}
          <div className="mt-2 md:mt-auto">
            {/* --- MODIFICATION 3: Font changed to Raleway --- */}
            <p className="font-raleway text-[#00A7EE] font-medium text-sm sm:text-base">
              {formatDate(date)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}