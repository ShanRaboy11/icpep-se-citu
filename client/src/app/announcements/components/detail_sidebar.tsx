import { Calendar, MapPin, Clock, Users, Mail } from "lucide-react";
import { Announcement } from "../types";
import { formatDate } from "../utils";

interface DetailsSidebarProps {
  announcement: Announcement;
}

export default function DetailsSidebar({ announcement }: DetailsSidebarProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* --- FONT: Rubik --- */}
      <h3 className="font-rubik text-xl font-bold text-primary3 mb-4">
        {announcement.type} Details
      </h3>
      <div className="space-y-4">
        {/* Date */}
        <div className="flex items-start">
          <Calendar className="w-5 h-5 text-primary1 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            {/* --- FONT: Rubik --- */}
            <p className="font-rubik font-semibold text-gray-900 text-sm">
              Date
            </p>
            {/* --- FONT: Raleway --- */}
            <p className="font-raleway text-gray-600 text-sm">
              {formatDate(announcement.date)}
            </p>
          </div>
        </div>

        {/* Time */}
        {announcement.time && (
          <div className="flex items-start">
            <Clock className="w-5 h-5 text-primary1 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-rubik font-semibold text-gray-900 text-sm">
                Time
              </p>
              <p className="font-raleway text-gray-600 text-sm">
                {announcement.time}
              </p>
            </div>
          </div>
        )}

        {/* Location */}
        {announcement.location && (
          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-primary1 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-rubik font-semibold text-gray-900 text-sm">
                Location
              </p>
              <p className="font-raleway text-gray-600 text-sm">
                {announcement.location}
              </p>
            </div>
          </div>
        )}

        {/* Organizer */}
        {announcement.organizer && (
          <div className="flex items-start">
            <Users className="w-5 h-5 text-primary1 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-rubik font-semibold text-gray-900 text-sm">
                Organizer
              </p>
              <p className="font-raleway text-gray-600 text-sm">
                {announcement.organizer}
              </p>
            </div>
          </div>
        )}

        {/* Contact */}
        {announcement.contact && (
          <div className="flex items-start">
            <Mail className="w-5 h-5 text-primary1 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-rubik font-semibold text-gray-900 text-sm">
                Contact
              </p>
              <p className="font-raleway text-gray-600 text-sm break-all">
                {announcement.contact}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
