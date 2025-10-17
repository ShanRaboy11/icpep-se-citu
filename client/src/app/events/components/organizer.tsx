import { Event } from "../utils/event";

interface Props {
  organizer: Event["organizer"];
}

export default function OrganizerCard({ organizer }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 bg-primary1 rounded-full flex items-center justify-center text-white font-rubik text-2xl font-bold flex-shrink-0">
          {organizer.avatarInitial}
        </div>
        <div>
          <h3 className="font-rubik font-bold text-lg text-primary3">
            {organizer.name}
          </h3>
          <p className="font-raleway text-sm text-bodytext">Event Organizer</p>
        </div>
      </div>
      <div className="space-y-3">
        <button className="w-full bg-transparent border border-primary1 text-primary1 hover:bg-primary1 hover:text-white font-raleway font-semibold py-2 px-4 rounded-lg transition-all">
          Contact Host
        </button>
        <button className="w-full bg-transparent border border-gray-400 text-gray-600 hover:bg-gray-100 font-raleway font-semibold py-2 px-4 rounded-lg transition-all">
          Report Event
        </button>
      </div>
    </div>
  );
}
