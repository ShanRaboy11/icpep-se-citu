import { Announcement } from '../types';

interface ActionCardProps {
  announcement: Announcement;
}

export default function ActionCard({ announcement }: ActionCardProps) {
  return (
    <div className="bg-blue-500 rounded-2xl shadow-md p-6 text-white">
      <h3 className="text-xl font-bold mb-3">Join This {announcement.type}</h3>
      <p className="mb-4 text-sm">
        {announcement.attendees ? `${announcement.attendees} expected` : 'Limited seats available'}
      </p>
      <button className="w-full bg-white text-blue-500 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
        Register Now
      </button>
    </div>
  );
}