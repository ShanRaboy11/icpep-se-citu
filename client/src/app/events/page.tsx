'use client';

import React, { useState } from 'react';
import Header from "../components/header";
import Footer from "../components/footer";

export default function EventPage() {
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [rsvpData, setRsvpData] = useState({
    name: '',
    email: '',
    phone: '',
    affiliation: ''
  });

  const handleRSVP = () => {
    if (rsvpData.name && rsvpData.email) {
      setShowRSVPModal(false);
      setShowSuccessModal(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRsvpData({
      ...rsvpData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* Event Header */}
        <div className="relative">
          <div className="w-full h-96 bg-gradient-to-r from-primary1 to-primary2 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-raleway">
                    AI Workshop
                  </span>
                  <span className="text-sm font-raleway opacity-90">Hosted by START DOST</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-rubik font-bold mb-4">
                  Vibe Coding: OpenXAI Foundations Online Workshop
                </h1>
                <div className="flex items-center gap-6 text-sm font-raleway">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Google Meet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>419 Went</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* RSVP Status */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-red-800 font-raleway font-semibold">Registration Closed</span>
            </div>
            <p className="text-red-700 font-raleway text-sm mt-2">
              This event is not currently taking registrations. You may contact the host or subscribe to receive updates.
            </p>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-rubik font-bold text-primary3 mb-4">About Event</h2>
                <div className="prose prose-gray max-w-none font-raleway">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    The <strong>Vibe Coding: OpenXAI Foundations Workshop</strong> is a <strong>FREE</strong> two-part hands-on training designed for DOST Scholars. This workshop introduces participants to the fundamentals of OpenXAI, its no-code development framework, and practical pathways toward blockchain applications.
                  </p>
                  
                  <h3 className="text-xl font-rubik font-semibold text-primary3 mt-6 mb-3">Topics Covered:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>No-code development approach</li>
                    <li>Introduction to OpenXAI concepts</li>
                    <li>Leveraging and setting up a development environment</li>
                    <li>Hands-on scenario demonstration</li>
                    <li>Pathway to blockchain applications</li>
                  </ul>

                  <h3 className="text-xl font-rubik font-semibold text-primary3 mt-6 mb-3">Schedule:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>1st Session:</strong> September 28, 2025 (7:00 – 10:00 PM) - <em>Sunday</em></li>
                    <li><strong>2nd Session:</strong> October 5, 2025 (7:00 – 10:00 PM) <em>Sunday</em></li>
                  </ul>

                  <h3 className="text-xl font-rubik font-semibold text-primary3 mt-6 mb-3">Participant Requirements:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>A development environment installation will be required before the event. Installation files and instructions will be provided upon the acceptance of your registration.</li>
                    <li>Open to all DOST Scholars</li>
                  </ul>

                  <h3 className="text-xl font-rubik font-semibold text-primary3 mt-6 mb-3">Benefits:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Certificate of recognition as a <strong>Vibe Coder Enthusiast</strong></li>
                    <li>Exposure to blockchain pathways and potential job offerings through OpenXAI</li>
                    <li>Opportunity to participate in an international hackathon</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* RSVP Button */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <button 
                  onClick={() => setShowRSVPModal(true)}
                  className="w-full bg-primary1 hover:bg-primary2 text-white font-raleway font-semibold py-3 px-6 rounded-lg transition-all duration-300 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled
                >
                  Registration Closed
                </button>
                <p className="text-gray-600 text-sm font-raleway mt-3 text-center">
                  Contact the host for more information
                </p>
              </div>

              {/* Event Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-rubik font-semibold text-primary3 mb-4">Event Details</h3>
                <div className="space-y-3 font-raleway text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary1/10 rounded-full flex items-center justify-center">
                      <span className="text-primary1">📅</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">September 28 & October 5, 2025</div>
                      <div className="text-gray-600">7:00 PM - 10:00 PM</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary1/10 rounded-full flex items-center justify-center">
                      <span className="text-primary1">💻</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Google Meet</div>
                      <div className="text-gray-600">Online Event</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary1/10 rounded-full flex items-center justify-center">
                      <span className="text-primary1">👥</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">419 Participants</div>
                      <div className="text-gray-600">DOST Scholars</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Host Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-rubik font-semibold text-primary3 mb-4">Hosted By</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary1 rounded-full flex items-center justify-center">
                    <span className="text-white font-rubik font-bold">SD</span>
                  </div>
                  <div>
                    <div className="font-rubik font-semibold text-gray-900">START DOST</div>
                    <div className="text-gray-600 font-raleway text-sm">Event Organizer</div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <button className="w-full bg-transparent border border-primary1 text-primary1 hover:bg-primary1 hover:text-white font-raleway font-semibold py-2 px-4 rounded-lg transition-all duration-300 cursor-pointer">
                    Contact Host
                  </button>
                  <button className="w-full bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 font-raleway font-semibold py-2 px-4 rounded-lg transition-all duration-300 cursor-pointer">
                    Report Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* RSVP Modal */}
      {showRSVPModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-rubik font-bold text-primary3 mb-4">RSVP to Event</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-raleway font-semibold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={rsvpData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 font-raleway focus:outline-none focus:border-primary1"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-raleway font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={rsvpData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 font-raleway focus:outline-none focus:border-primary1"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-raleway font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={rsvpData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 font-raleway focus:outline-none focus:border-primary1"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-raleway font-semibold text-gray-700 mb-2">Affiliation</label>
                <input
                  type="text"
                  name="affiliation"
                  value={rsvpData.affiliation}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 font-raleway focus:outline-none focus:border-primary1"
                  placeholder="e.g., DOST Scholar, Student"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRSVPModal(false)}
                className="flex-1 bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 font-raleway font-semibold py-2 px-4 rounded-lg transition-all duration-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRSVP}
                className="flex-1 bg-primary1 hover:bg-primary2 text-white font-raleway font-semibold py-2 px-4 rounded-lg transition-all duration-300 cursor-pointer"
              >
                RSVP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <h3 className="text-xl font-rubik font-bold text-primary3 mb-2">RSVP Successful!</h3>
            <p className="text-gray-600 font-raleway mb-6">
              You have successfully registered for the event. You will receive a confirmation email shortly.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-primary1 hover:bg-primary2 text-white font-raleway font-semibold py-2 px-4 rounded-lg transition-all duration-300 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}