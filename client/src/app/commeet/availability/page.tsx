"use client";

import Header from "../../components/header";
import Footer from "../../components/footer";
import { FunctionComponent, useCallback, useState } from 'react';

const CommeetPage: FunctionComponent = () => {
    // State to track selected 30-minute slots
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

    const onAddAvailabilityClick = useCallback(() => {
        console.log("Selected Availability Slots:", selectedSlots);
        // Add submission logic here
    }, [selectedSlots]);

    // Toggle logic for clicking a time slot
    const toggleSlot = (timeKey: string) => {
        setSelectedSlots((prev) => {
            if (prev.includes(timeKey)) {
                return prev.filter((t) => t !== timeKey); // Remove if exists
            } else {
                return [...prev, timeKey]; // Add if not exists
            }
        });
    };

    // Configuration
    const monthYear = "Dec 2025";
    const dayLabel = "FRI";
    const dateLabel = "5";
    
    // Times from 9 AM to 4 PM (16:00)
    const times = [9, 10, 11, 12, 13, 14, 15, 16];

    const formatTime = (hour: number) => {
        const h = hour % 12 === 0 ? 12 : hour % 12;
        const ampm = hour < 12 ? 'AM' : 'PM';
        return `${h} ${ampm}`;
    };

    return (
        <div className="min-h-screen flex flex-col bg-white overflow-hidden font-raleway">
            <Header />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center pt-0 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl w-full">
                    
                    {/* 1. Branding Section */}
                    <div className="flex-shrink-0 text-left mb-10">
                        <h1 className="text-5xl sm:text-6xl font-rubik leading-tight mt-0 pt-4">
                            <span className="text-sky-500 font-bold">com</span>
                            <span className="text-gray-900 font-bold">meet</span>
                        </h1>
                    </div>

                    {/* 2. Meeting Details Section */}
                    <div className="w-full mb-16">
                        <div className="pb-4 border-b border-gray-300">
                            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 font-raleway">
                                Name of the meeting
                            </h2>
                            <p className="mt-2 text-xl text-gray-600 font-raleway">
                                Topic discussed
                            </p>
                        </div>
                    </div>

                    {/* 3. Availabilities Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                        <h3 className="text-xl sm:text-2xl font-normal text-gray-600 tracking-wide font-raleway">
                            Add your availability
                        </h3>

                        <button
                            className="px-6 py-3 border-2 border-sky-400 rounded-full font-manrope text-sky-400 font-semibold flex items-center justify-center space-x-2
                         hover:bg-sky-200 hover:text-white hover:border-sky-400 active:bg-sky-600 active:border-sky-600 active:text-white transition-colors duration-200"
                            onClick={onAddAvailabilityClick}
                        >
                            <span>Add availability</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    </div>

                    {/* Timeline Grid Container */}
                    <div className="w-full">
                        
                        {/* Top Header Area */}
                        <div className="flex w-full">
                            {/* Left Column Headers */}
                            <div className="w-20 sm:w-24 shrink-0 flex flex-col justify-between items-end pr-4 pb-2">
                                <div className="text-xl text-gray-900 font-medium mb-6 whitespace-nowrap">
                                    {monthYear}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">PST</div>
                            </div>
                            
                            {/* Grid Column Header */}
                            <div className="flex-1 flex flex-col items-center justify-end pb-2">
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{dayLabel}</div>
                                <div className="text-2xl text-gray-900 font-normal">{dateLabel}</div>
                            </div>
                        </div>

                        {/* The Grid */}
                        <div className="flex w-full select-none">
                            
                            {/* Left: Time Labels Column */}
                            <div className="w-20 sm:w-24 shrink-0 flex flex-col text-right pr-4 pt-0">
                                {times.map((hour) => (
                                    <div key={hour} className="h-16 relative">
                                        <span className="text-sm text-gray-500 absolute top-0 right-0 transform -translate-y-1/2">
                                            {formatTime(hour)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Right: Grid Lines Column */}
                            <div className="flex-1 border-l border-r border-gray-200">
                                {times.map((hour, index) => {
                                    const slot1 = `${hour}:00`;
                                    const slot2 = `${hour}:30`;

                                    const isSlot1Selected = selectedSlots.includes(slot1);
                                    const isSlot2Selected = selectedSlots.includes(slot2);

                                    return (
                                        <div key={hour} className="h-16 border-t border-gray-200 w-full relative bg-white">
                                            
                                            {/* First 30 Mins (Top Half) */}
                                            <div 
                                                onClick={() => toggleSlot(slot1)}
                                                className={`h-1/2 w-full cursor-pointer transition-colors duration-100 relative
                                                    ${isSlot1Selected 
                                                        ? 'bg-sky-200 hover:bg-sky-300' // White border creates the gap
                                                        : 'hover:bg-gray-50'}`}
                                            >
                                                {/* Left Indicator Bar */}
                                                {isSlot1Selected && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-500"></div>
                                                )}
                                            </div>

                                            {/* Second 30 Mins (Bottom Half) */}
                                            <div 
                                                onClick={() => toggleSlot(slot2)}
                                                className={`h-1/2 w-full cursor-pointer transition-colors duration-100 relative
                                                    ${isSlot2Selected 
                                                        ? 'bg-sky-200 hover:bg-sky-300' 
                                                        : 'hover:bg-gray-50'}`}
                                            >
                                                 {/* Left Indicator Bar */}
                                                 {isSlot2Selected && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-500"></div>
                                                )}
                                            </div>

                                            {/* Bottom border for the very last item to close the grid */}
                                            {index === times.length - 1 && (
                                                <div className="absolute bottom-0 left-0 right-0"></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer Text */}
                        <div className="mt-8 text-center text-gray-400 text-sm font-light font-raleway">
                            Shown in local time (PST)
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CommeetPage;