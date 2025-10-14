import { Calendar, MapPin, Clock, Users, Mail } from 'lucide-react';
import { Announcement } from '../types';
import { formatDate } from '../utils';

interface DetailsSidebarProps {
  announcement: Announcement;
}

export default function DetailsSidebar({ announcement }: DetailsSidebarProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-xl font-bold text-blue-900 mb-4">
        {announcement.type} Details
      </h3>
      <div className="space-y-4">
        <div className="flex items-start">
          <Calendar className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-900 text-sm">Date</p>
            <p className="text-gray-600 text-sm">{formatDate(announcement.date)}</p>
          </div>
        </div>

        {announcement.time && (
          <div className="flex items-start">
            <Clock className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">Time</p>
              <p className="text-gray-600 text-sm">{announcement.time}</p>
            </div>
          </div>
        )}

        {announcement.location && (
          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">Location</p>
              <p className="text-gray-600 text-sm">{announcement.location}</p>
            </div>
          </div>
        )}

        {announcement.organizer && (
          <div className="flex items-start">
            <Users className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">Organizer</p>
              <p className="text-gray-600 text-sm">{announcement.organizer}</p>
            </div>
          </div>
        )}

        {announcement.contact && (
          <div className="flex items-start">
            <Mail className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">Contact</p>
              <p className="text-gray-600 text-sm break-all">{announcement.contact}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}