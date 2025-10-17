import { getTypeColor, formatDate } from "../utils/announcements"; // Adjust path if necessary
import { Announcement } from "../utils/announcements"; // Assuming the interface is also in this file

// The props interface can be simplified if you are passing the whole object
interface AnnouncementCardProps extends Announcement {
  onClick?: () => void;
}

export function AnnouncementCard({
  title,
  description,
  date,
  type,
  imageUrl,
  onClick,
}: AnnouncementCardProps) {
  return (
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
        <div className="md:w-1/3 h-48 md:h-full">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:w-2/3 p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="mb-3 sm:mb-4">
              <span
                // This now uses the IMPORTED getTypeColor function
                className={`inline-block px-3 py-1 sm:px-4 sm:py-2 rounded-[10px] text-xs sm:text-sm font-raleway font-medium ${getTypeColor(
                  type
                )}`}
              >
                {type}
              </span>
            </div>

            <h3 className="mb-2 sm:mb-3 text-primary3 text-lg sm:text-xl font-rubik font-bold line-clamp-2">
              {title}
            </h3>

            {/* MODIFICATION 3: Increased line-clamp for description */}
            <p className="font-raleway text-gray-700 text-sm sm:text-base mb-2 sm:mb-4 leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>

          <div className="mt-2">
            <p className="font-raleway text-primary1 font-medium text-sm sm:text-base">
              {/* This now uses the IMPORTED formatDate function */}
              {formatDate(date)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
