import { Announcement } from '../types';

interface ActionCardProps {
  announcement: Announcement;
}

export default function ActionCard({ announcement }: ActionCardProps) {
  return (
    // Using theme color primary1 for the background
    <div className="bg-primary1 rounded-2xl shadow-md p-6 text-white">
      {/* --- FONT: Rubik --- */}
      <h3 className="font-rubik text-xl font-bold mb-3">Join This {announcement.type}</h3>
      {/* --- FONT: Raleway --- */}
      <p className="font-raleway mb-4 text-sm">
        {announcement.attendees ? `${announcement.attendees} expected` : 'Limited seats available'}
      </p>
      {/* --- FONT: Rubik --- */}
      <button className="font-rubik w-full bg-white text-primary1 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
        Register Now
      </button>
    </div>
  );
}