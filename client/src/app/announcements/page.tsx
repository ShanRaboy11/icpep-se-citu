'use client';

import { useState } from 'react';
import { AnnouncementCard } from '../components/cards/announcement_card';
import AnnouncementDetail from '../components/cards/announcement_detail';
import Header from '../components/header_guest';
import Footer from '../components/footer';
import { ArrowLeft } from 'lucide-react';

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
  awardees?: {
    name: string;
    program: string;
    year: string;
    award: string;
  }[];
}

const announcements: Announcement[] = [
  {
    id: '1',
    title: 'Annual Innovation Conference 2024',
    description: 'Join us for our biggest innovation conference of the year featuring keynote speakers from leading tech companies, interactive workshops, and networking opportunities. Discover the latest trends in technology and connect with industry leaders.',
    fullDescription: 'Join us for our biggest innovation conference of the year featuring keynote speakers from leading tech companies, interactive workshops, and networking opportunities. Discover the latest trends in technology, artificial intelligence, digital transformation, and sustainable business practices. This two-day event will bring together industry leaders, entrepreneurs, and innovators to share insights, collaborate on solutions, and shape the future of technology. Network with like-minded professionals, attend hands-on workshops, and gain valuable knowledge that will drive your organization forward.',
    date: '2024-12-15',
    time: '9:00 AM - 6:00 PM',
    location: 'Grand Convention Center, Main Auditorium',
    organizer: 'Innovation Department',
    contact: 'innovation@organization.com',
    attendees: '500+ attendees',
    type: 'Event',
    imageUrl: '/meeting.png',
    agenda: [
      '9:00 AM - Registration & Welcome Coffee',
      '10:00 AM - Keynote: Future of AI in Business',
      '11:30 AM - Panel: Digital Transformation Strategies',
      '1:00 PM - Networking Lunch',
      '2:30 PM - Workshop: Implementing Innovation Frameworks',
      '4:00 PM - Startup Pitch Competition',
      '5:30 PM - Closing Remarks & Awards'
    ]
  },
  {
    id: '2',
    title: 'Excellence Awards Ceremony',
    description: 'Celebrating outstanding achievements and recognizing exceptional performance across all departments. Join us as we honor our top performers and their contributions to organizational success.',
    fullDescription: 'Join us for our annual Excellence Awards Ceremony, where we celebrate the outstanding achievements and exceptional performance of our CPE students and faculty members. This prestigious event recognizes individuals who have demonstrated excellence, innovation, and dedication throughout the year.',
    date: '2024-11-28',
    time: '7:00 PM - 10:00 PM',
    location: 'Ballroom, Executive Hotel',
    organizer: 'ICpEP SE CIT-U Chapter',
    contact: 'awards@icpep-cituc.org',
    attendees: '200+ members and guests',
    type: 'Award',
    imageUrl: '/meeting.png',
    awardees: [
      {
        name: 'Maria Santos',
        program: '',
        year: '4th Year',
        award: 'Outstanding Academic Excellence'
      },
      {
        name: 'John Rafael Cruz',
        program: '', 
        year: '3rd Year',
        award: 'Leadership Excellence Award'
      },
      {
        name: 'Sarah Mae Rodriguez',
        program: '',
        year: '4th Year', 
        award: 'Innovation and Research Award'
      },
      {
        name: 'Miguel Angelo Fernandez',
        program: '',
        year: '2nd Year',
        award: 'Community Service Excellence'
      }
    ]
  },
  {
    id: '3',
    title: 'Digital Transformation Workshop',
    description: 'Learn about the latest digital tools and strategies that can transform your workflow. This hands-on workshop will cover automation, AI integration, and digital best practices for modern organizations.',
    fullDescription: 'Learn about the latest digital tools and strategies that can transform your workflow in this comprehensive hands-on workshop. Discover how to leverage automation, artificial intelligence, and digital best practices to streamline processes, increase efficiency, and drive innovation within your department. Our expert facilitators will guide you through practical exercises, real-world case studies, and interactive demonstrations. You will leave with actionable insights and a roadmap for implementing digital transformation initiatives in your work.',
    date: '2024-11-20',
    time: '1:00 PM - 5:00 PM',
    location: 'Training Center, Room 301',
    organizer: 'Digital Innovation Team',
    contact: 'training@organization.com',
    attendees: '30 participants',
    type: 'Workshop',
    imageUrl: '/meeting.png',    
    agenda: [
      '1:00 PM - Welcome & Digital Transformation Overview',
      '1:30 PM - Automation Tools & Implementation',
      '2:30 PM - Break',
      '2:45 PM - AI Integration Workshop',
      '3:45 PM - Hands-on Practice Session',
      '4:30 PM - Action Planning & Next Steps',
      '5:00 PM - Q&A and Wrap-up'
    ]
  },
  {
    id: '4',
    title: 'Quarterly Chapter Board Meeting',
    description: 'Comprehensive review of chapter activities, upcoming initiatives, and planning for next quarter. All board members and committee heads are invited to participate in this important strategic session.',
    fullDescription: 'Join us for our quarterly chapter board meeting where we will conduct a comprehensive review of our chapter activities and performance. This strategic session will cover membership growth, event outcomes, financial status, and upcoming initiatives for the next quarter. We will discuss chapter priorities, resource allocation, and goal setting to ensure continued success of ICpEP SE CIT-U Chapter.',
    date: '2024-11-15',
    time: '10:00 AM - 3:00 PM',
    location: 'CIT-U Conference Room A',
    organizer: 'Chapter Board',
    contact: 'board@icpep-cituc.org',
    attendees: 'Board members & committee heads',
    type: 'Meeting',
    imageUrl: '/meeting.png',
    agenda: [
      'Chapter Performance Review',
      'Membership Growth & Engagement',
      'Financial Status & Budget Planning',
      'Working Lunch & Networking',
      'Strategic Initiatives Planning', 
      'Committee Updates & Reports',
      'Action Items & Next Steps'
    ]
  },
  {
    id: '5',
    title: 'Leadership Development Seminar',
    description: 'Enhance your leadership skills with expert trainers and interactive sessions. This seminar focuses on modern leadership techniques, team building, and effective communication strategies for managers.',
    fullDescription: 'Enhance your leadership skills with expert trainers and interactive sessions in this comprehensive seminar designed for current and aspiring leaders. This full-day program focuses on modern leadership techniques, emotional intelligence, team building, and effective communication strategies. Learn how to motivate teams, manage change, resolve conflicts, and create a positive work environment. The seminar includes case studies, group exercises, and practical tools you can immediately apply in your role.',
    date: '2024-11-08',
    time: '9:00 AM - 4:00 PM',
    location: 'Learning & Development Center',
    organizer: 'Human Resources Department',
    contact: 'leadership@organization.com',
    attendees: '50 managers and leaders',
    type: 'Seminar',
    imageUrl: '/meeting.png',
    agenda: [
      '9:00 AM - Modern Leadership Principles',
      '10:30 AM - Emotional Intelligence in Leadership',
      '12:00 PM - Lunch Break',
      '1:00 PM - Team Building Strategies',
      '2:30 PM - Effective Communication Techniques',
      '3:30 PM - Leadership Action Planning'
    ]
  },
  {
    id: '6',
    title: 'Team Achievement Recognition',
    description: 'Celebrating the remarkable success of our development team for achieving a 25% increase in project delivery efficiency and maintaining 99.9% system uptime throughout the quarter.',
    fullDescription: 'We are proud to celebrate the remarkable success of our development team for their outstanding achievements this quarter. The team has demonstrated exceptional performance by achieving a 25% increase in project delivery efficiency while maintaining an impressive 99.9% system uptime. This achievement reflects their dedication, technical expertise, and commitment to excellence. Their innovative approaches to problem-solving and collaborative teamwork have set new standards for our organization.',
    date: '2024-10-30',
    time: '3:00 PM - 4:00 PM',
    location: 'Development Team Office',
    organizer: 'CTO Office',
    contact: 'recognition@organization.com',
    attendees: 'Development team & management',
    type: 'Achievement',
    imageUrl: '/meeting.png',
  }
];

export default function App() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  
  // Sort announcements by date in descending order (most recent first)
  const sortedAnnouncements = [...announcements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleAnnouncementClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
  };

  const handleBackToList = () => {
    setSelectedAnnouncement(null);
  };

  // Show detail view if an announcement is selected
  if (selectedAnnouncement) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FEFEFF' }}>
        <Header />
        <div className="flex-1">
          <AnnouncementDetail 
            announcement={selectedAnnouncement} 
            onBack={handleBackToList}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFEFF' }}>
      <Header />
      
      <div className="flex-1" style={{ backgroundColor: '#FEFEFF' }}>
        {/* Page Title Section */}
        <div className="py-12 px-6 lg:px-12 xl:px-16">
          {/* Back to Home Navigation */}
          <div className="mb-6">
            <button className="flex items-center text-[#00A7EE] hover:text-[#003599] transition-colors font-medium">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
          </div>
          
          <div>
            <h1 className="text-5xl text-[#003599] mb-4">
              Announcements
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Stay updated with the latest news, events, and achievements from ICpEP SE CIT-U Chapter
            </p>
          </div>
        </div>

        {/* Announcements List */}
        <div className="px-6 lg:px-12 xl:px-16 pb-8">
          <div className="space-y-6">
            {sortedAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                id={announcement.id}
                title={announcement.title}
                description={announcement.description}
                date={announcement.date}
                type={announcement.type}
                imageUrl='/gle.png'
                onClick={() => handleAnnouncementClick(announcement)}
              />
            ))}
          </div>

          {/* Empty State */}
          {sortedAnnouncements.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl text-gray-600 mb-2">No announcements yet</h3>
              <p className="text-gray-500">Check back later for updates and news.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}