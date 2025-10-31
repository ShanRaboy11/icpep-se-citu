import Image from "next/image";
import { Event } from "../utils/event";

interface Props {
  organizer: Event["organizer"];
}

export default function OrganizerCard({ organizer }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-4 mb-5">
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={organizer.avatarImageUrl}
            alt={`${organizer.name} logo`}
            layout="fill"
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-rubik font-bold text-base sm:text-lg text-primary3">
            {organizer.name}
          </h3>
          <p className="font-raleway text-sm text-bodytext">Event Organizer</p>
        </div>
      </div>
      <div className="space-y-3">
        <button
          className="w-full bg-transparent border border-primary1 text-primary1 
                     hover:bg-primary1 hover:text-white font-raleway font-semibold text-sm sm:text-base 
                     py-2 px-4 rounded-lg cursor-pointer relative overflow-hidden 
                     transition-all duration-300 ease-in-out active:scale-95 
                     before:absolute before:inset-0 before:bg-gradient-to-r 
                     before:from-transparent before:via-white/40 before:to-transparent 
                     before:translate-x-[-100%] hover:before:translate-x-[100%] 
                     before:transition-transform before:duration-700"
        >
          Contact Host
        </button>
        <button className="w-full bg-transparent border border-gray-400 text-gray-600 hover:bg-gray-100 font-raleway font-semibold text-sm sm:text-base py-2 px-4 rounded-lg transition-all cursor-pointer">
          Report Event
        </button>
      </div>
    </div>
  );
}
