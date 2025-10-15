import { ArrowLeft } from 'lucide-react';
import { Announcement } from '../types';
import { getTypeColor, formatDate } from '../utils';

interface DetailHeaderProps {
  announcement: Announcement;
  onBack: () => void;
}

export default function DetailHeader({ announcement, onBack }: DetailHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-500 hover:text-blue-700 transition-colors mb-4 font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Announcements
        </button>
        
        <div className="mb-4">
          <span className={`inline-block px-4 py-1.5 rounded-lg text-sm font-semibold text-white ${getTypeColor(announcement.type)}`}>
            {announcement.type}
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-3">
          {announcement.title}
        </h1>
        
        <p className="text-blue-500 font-medium text-lg">
          {formatDate(announcement.date)}
        </p>
      </div>
    </div>
  );
}