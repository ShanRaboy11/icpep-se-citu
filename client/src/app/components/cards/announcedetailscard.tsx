'use client';
import { Calendar, Clock, MapPin, Users, Mail } from 'lucide-react';

interface AnnounceDetailsCardProps {
  title:string;
    date: string;
  time: string;
  location: string;
  organizer: string;
  contact: string;
  onClick?: () => void;
}

const AnnounceDetailsCard: React.FC<AnnounceDetailsCardProps> = ({
  title,
  date,
  time,
  location,
  organizer,
  contact,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md cursor-pointer 
                 p-10 w-full max-w-sm mx-auto border border-gray-100"
    >
      {/* Header */}
      <h2 className="font-rubik text-xl font-bold text-primary3 mb-4">{title}</h2>

      {/* Details */}
      <div className="pt-2 space-y-4 text-gray-700">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-sky-500 mt-1" />
          <div>
            <p className="font-raleway font-semibold text-gray-900">Date</p>
            <p className="font-raleway text-sm text-gray-600">{date}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-sky-500 mt-1" />
          <div>
            <p className="font-raleway font-semibold text-gray-900">Time</p>
            <p className="font-raleway text-sm text-gray-600">{time}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-sky-500 mt-1" />
          <div>
            <p className="font-raleway font-semibold text-gray-900">Location</p>
            <p className="font-raleway text-sm text-gray-600">{location}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-sky-500 mt-1" />
          <div>
            <p className="font-raleway font-semibold text-gray-900">Organizer</p>
            <p className="font-raleway text-sm text-gray-600">{organizer}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-sky-500 mt-1" />
          <div>
            <p className="font-raleway font-semibold text-gray-900">Contact</p>
            <p className="font-raleway text-sm text-gray-600">{contact}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnounceDetailsCard;
