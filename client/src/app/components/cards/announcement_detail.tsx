'use client';

import { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Mail, X } from 'lucide-react';

interface Officer {
  title: string;
  name: string;
}

interface Committee {
  name: string;
  color: string;
  members: Officer[];
}

interface Awardee {
  name: string;
  program: string;
  year: string;
  award: string;
}

interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  imageUrl: string;
  fullDescription?: string;
  time?: string;
  location?: string;
  organizer?: string;
  contact?: string;
  attendees?: string;
  agenda?: string[];
  awardees?: Awardee[];
}

interface AnnouncementDetailProps {
  announcement: Announcement;
  onBack: () => void;
}

// Sample data for demonstration
const sampleAnnouncement: Announcement = {
  id: '1',
  title: '2nd Regular Meeting',
  description: 'Quarterly chapter board meeting',
  date: '2024-11-15',
  type: 'Meeting',
  imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop',
  fullDescription: 'Join us for our quarterly chapter board meeting where we will conduct a comprehensive review of our chapter activities and performance. This strategic session will cover membership growth, event outcomes, financial status, and upcoming initiatives for the next quarter.',
  time: '6:00 PM - 10:00 PM',
  location: 'GLE 703',
  organizer: 'Training and Seminar Committee',
  contact: 'trainingandseminar@icpepsecitu.com',
  agenda: [
    'Chapter Performance Review',
    'Membership Growth & Engagement',
    'Financial Status & Budget Planning',
    'Working Lunch & Networking',
    'Strategic Initiatives Planning',
    'Committee Updates & Reports',
    'Action Items & Next Steps'
  ]
};

const councilOfficers: Officer[] = [
  { title: 'President', name: 'Maria Elena Santos' },
  { title: 'VP - Internal', name: 'John Rafael Cruz' },
  { title: 'VP - External', name: 'Patricia Anne Villanueva' },
  { title: 'Secretary', name: 'Sarah Mae Rodriguez' },
  { title: 'Treasurer', name: 'Miguel Angelo Fernandez' },
  { title: 'Auditor', name: 'Ana Gabriela Reyes' },
  { title: 'PIO', name: 'Carlos David Mendoza' }
];

const committees: Committee[] = [
  {
    name: 'Internal Affairs',
    color: 'bg-blue-500',
    members: [
      { title: 'Head', name: 'Lisa Marie Gonzales' },
      { title: 'Asst. Head', name: 'Mark Anthony Torres' },
      { title: 'Secretary', name: 'Jerome Paul Castro' },
      { title: 'Member', name: 'Michelle Anne Dela Cruz' },
      { title: 'Member', name: 'Kenneth James Rivera' }
    ]
  },
  {
    name: 'External Affairs',
    color: 'bg-purple-500',
    members: [
      { title: 'Head', name: 'Rachel Anne Delgado' },
      { title: 'Asst. Head', name: 'Alexander James Morales' },
      { title: 'Secretary', name: 'Kristine Mae Perez' },
      { title: 'Member', name: 'Daniel Jose Aquino' }
    ]
  },
  {
    name: 'Training & Seminar',
    color: 'bg-green-500',
    members: [
      { title: 'Head', name: 'Anthony Carl Valdez' },
      { title: 'Asst. Head', name: 'Jasmine Rose Garcia' },
      { title: 'Secretary', name: 'Benedict Paul Ramos' },
      { title: 'Member', name: 'Sophia Jane Herrera' }
    ]
  }
];

export default function AnnouncementDetail({ 
  announcement = sampleAnnouncement, 
  onBack = () => console.log('Back clicked') 
}: AnnouncementDetailProps) {
  const [showFullAttendance, setShowFullAttendance] = useState(false);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      event: 'bg-blue-500',
      seminar: 'bg-sky-500',
      achievement: 'bg-green-500',
      workshop: 'bg-purple-500',
      meeting: 'bg-orange-500',
      award: 'bg-yellow-500'
    };
    return colors[type.toLowerCase()] || 'bg-gray-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <img
                src={announcement.imageUrl}
                alt={announcement.title}
                className="w-full h-64 sm:h-96 object-cover"
              />
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                About This {announcement.type}
              </h2>
              <p className="text-gray-700 leading-relaxed text-base mb-6">
                {announcement.fullDescription || announcement.description}
              </p>

              {/* Agenda */}
              {announcement.agenda && announcement.type.toLowerCase() !== 'award' && (
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-4">
                    {announcement.type.toLowerCase() === 'meeting' ? 'Agenda' : 'Schedule'}
                  </h3>
                  <ul className="space-y-2">
                    {announcement.agenda.map((item, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <span className="text-blue-500 mr-3 mt-1 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Awardees */}
              {announcement.awardees && announcement.type.toLowerCase() === 'award' && (
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-4">Award Recipients</h3>
                  <div className="space-y-3">
                    {announcement.awardees.map((awardee, index) => (
                      <div key={index} className="border-l-4 border-blue-500 bg-blue-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-blue-900 text-lg">{awardee.name}</h4>
                            <p className="text-sm text-gray-600">{awardee.program}</p>
                          </div>
                          <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full font-semibold">
                            {awardee.year}
                          </span>
                        </div>
                        <p className="text-sm text-blue-700 font-medium mt-2">{awardee.award}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Details Card */}
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

            {/* Meeting Attendance Card */}
            {announcement.type.toLowerCase() === 'meeting' && (
              <div className="bg-blue-900 rounded-2xl shadow-md p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Meeting Attendance</h3>
                
                {/* Preview List */}
                <div className="bg-white/10 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold mb-2 opacity-90">Council Officers</h4>
                      {councilOfficers.slice(0, 4).map((officer, index) => (
                        <div key={index} className="flex justify-between py-1.5 text-sm">
                          <span className="opacity-80">{officer.title}</span>
                          <span className="font-medium">{officer.name}</span>
                        </div>
                      ))}
                      <p className="text-xs opacity-70 mt-2">+ {councilOfficers.length - 4} more officers</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowFullAttendance(true)}
                  className="w-full bg-white text-blue-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  View Full Attendance
                </button>
              </div>
            )}

            {/* Action Card */}
            {(announcement.type.toLowerCase() === 'event' || 
              announcement.type.toLowerCase() === 'seminar' || 
              announcement.type.toLowerCase() === 'workshop') && (
              <div className="bg-blue-500 rounded-2xl shadow-md p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Join This {announcement.type}</h3>
                <p className="mb-4 text-sm">
                  {announcement.attendees ? `${announcement.attendees} expected` : 'Limited seats available'}
                </p>
                <button className="w-full bg-white text-blue-500 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Register Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Attendance Modal */}
      {showFullAttendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-1">Complete Meeting Attendance</h2>
                <p className="text-blue-200 text-sm">ICpEP.SE CIT-U Chapter - Quarterly Board Meeting</p>
              </div>
              <button
                onClick={() => setShowFullAttendance(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-6">
                {/* Council Officers */}
                <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-blue-900">
                  <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-blue-900 rounded-full mr-2"></span>
                    Council Officers
                  </h3>
                  <div className="space-y-2">
                    {councilOfficers.map((officer, index) => (
                      <div key={index} className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                        <span className="font-semibold text-blue-900 text-sm">{officer.title}</span>
                        <span className="text-gray-700 text-sm">{officer.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Committees */}
                {committees.map((committee, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-5 border-l-4 border-gray-400">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <span className={`w-2 h-2 ${committee.color} rounded-full mr-2`}></span>
                      {committee.name}
                    </h3>
                    <div className="space-y-2">
                      {committee.members.map((member, index) => (
                        <div key={index} className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                          <span className="font-semibold text-gray-700 text-sm">{member.title}</span>
                          <span className="text-gray-700 text-sm">{member.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-4 flex justify-end">
              <button
                onClick={() => setShowFullAttendance(false)}
                className="px-6 py-2.5 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}