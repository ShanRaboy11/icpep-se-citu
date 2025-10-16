'use client';

import React from 'react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white -mt-16 z-0">
      
      {/* Floating Elements - in front of everything */}
      {/* 
        Responsive Positioning: 
        - Base classes (e.g., top-[15%]) apply to mobile screens (default).
        - Prefixed classes (e.g., md:top-1/3) override the base classes on medium screens and larger.
      */}
      <div className="absolute inset-0 pointer-events-none z-50">
        {/* Software Development - Top Left */}
        <div className="absolute top-[15%] left-[5%] md:top-1/3 md:left-1/4 transform -translate-y-2/2 animate-float-slow">
          <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-200">
            <span className="text-base md:text-lg font-raleway text-gray-700">💻 Programming</span>
          </div>
        </div>

        {/* UI/UX - Top Right */}
        <div className="absolute top-[20%] right-[5%] md:top-1/3 md:right-1/4 transform -translate-y-1/2 animate-float-medium">
          <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-200">
            <span className="text-base md:text-lg font-raleway text-gray-700">🎨 UI/UX</span>
          </div>
        </div>

        {/* Arduino - Bottom Left */}
        <div className="absolute bottom-[20%] left-[8%] md:bottom-1/3 md:left-1/3 transform translate-y-0/2 animate-float-fast">
          <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-200">
            <span className="text-base md:text-lg font-raleway text-gray-700">⚡ Arduino</span>
          </div>
        </div>

        {/* COMPanions - Bottom Right */}
        <div className="absolute bottom-[15%] right-[8%] md:bottom-1/3 md:right-1/3 transform translate-y-1/2 animate-float-slow">
          <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-200">
            <span className="text-base md:text-lg font-raleway text-gray-700">👥 COMPanions</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto">
        {/* Welcome Text with container */}
        <div className="mb-8">
          <div className="inline-block bg-buttonbg1 border border-primary1/30 rounded-full px-6 py-2">
            <p className="text-primary1 text-sm font-raleway font-medium tracking-wide">
              Welcome to the community
            </p>
          </div>
        </div>

        {/* Main Title with animated gradient */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-rubik font-bold mb-4 leading-tight">
          <span className="bg-gradient-to-r from-black via-primary1 to-black bg-clip-text text-transparent animate-gradient-flow">
            ICpEP SE CIT-U Chapter
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-2xl font-raleway text-bodytext mb-6 max-w-2xl mx-auto leading-relaxed">
          Unlocking Potential, One Bit at a Time
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button className="bg-primary1 hover:bg-primary2 text-white font-raleway font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer">
            Join Community
          </button>
          <button className="bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-buttonbg1 hover:border-primary1 hover:text-primary1 font-raleway font-semibold px-8 py-3 rounded-full transition-all duration-300 cursor-pointer">
            Learn More
          </button>
        </div>

        {/* Achievements */}
        <div className="flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-lg">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-rubik font-bold text-primary1 mb-1">200+</div>
              <div className="text-sm font-raleway text-bodytext">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-rubik font-bold text-primary1 mb-1">15+</div>
              <div className="text-sm font-raleway text-bodytext">Events Hosted</div>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <div className="text-2xl md:text-3xl font-rubik font-bold text-primary1 mb-1">8</div>
              <div className="text-sm font-raleway text-bodytext">Years Active</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;