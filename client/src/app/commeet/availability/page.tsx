"use client";

import Header from "../../components/header";
import Footer from "../../components/footer";
import { FunctionComponent, useCallback } from 'react';
// useRouter is not used in this specific content, so it can be removed if not needed elsewhere
// import { useRouter } from 'next/navigation';

const CommeetPage: FunctionComponent = () => {

    const onAddBtnContainerClick = useCallback(() => {
        // Add your code here for when "Add availability" is clicked
        console.log("Add availability clicked!");
    }, []);

    // Placeholder data for display based on the image. These are not editable on this page.
    const meetingNameDisplay = "Name of the meeting";
    const meetingTopicPlaceholder = "Topic discussed";

    // Date and time information for display in the calendar
    const currentDateInfo = {
        monthName: "October",
        year: 2025,
        dayOfWeek: "Tue",
        day: 7,
        timeZone: "(PST)"
    };

    // Helper to generate an array of 30-minute intervals from 9 am to 2 pm
    const generateTimeSlots = (startHour: number, endHour: number) => {
        const slots = [];
        for (let hour = startHour; hour <= endHour; hour++) {
            slots.push(`${hour % 12 === 0 ? 12 : hour % 12} ${hour < 12 ? 'am' : 'pm'}`);
            if (hour < endHour) { // Only add 30-min slot if there's a next hour
                slots.push(`${hour % 12 === 0 ? 12 : hour % 12}:30 ${hour < 12 ? 'am' : 'pm'}`);
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots(9, 14); // 9 am to 2 pm (inclusive of 2 pm)

    // Using a single day for the calendar grid as per the reference image
    const days = [`${currentDateInfo.dayOfWeek}\n${currentDateInfo.day}`]; // Use \n for line break in text

    return (
        <div className="w-full relative bg-white overflow-hidden text-center text-[16px] text-black font-raleway min-h-screen flex flex-col">
            <Header />

            {/* Main Content Area */}
            {/* The outer container div for the commmeet title and other sections */}
            <div className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 self-stretch">
                <div className="max-w-7xl w-full flex flex-col items-start space-y-8 lg:space-y-0 lg:space-x-12 px-[75px]"> {/* Added padding to match title alignment */}

                    {/* Commeet Title Section */}
                    <div className="flex-shrink-0 text-left">
                        <h1 className="text-6xl sm:text-7xl font-rubik leading-tight mt-12">
                            <span className="text-sky-500 font-bold">com</span>
                            <span className="text-gray-900 font-bold">meet</span>
                        </h1>
                    </div>

                    {/* Meeting Details Section */}
                    <div className="w-[1180px] text-left mt-12"> {/* Adjusted width and margin */}
                        <div className="pb-4 border-b-[1px] border-solid border-gray-300">
                            <div className="text-[36px] tracking-num-0_01 leading-[100%] font-semibold text-gray-900">{meetingNameDisplay}</div>
                            <div className="mt-4 text-[24px] tracking-num-0_01 leading-[100%] text-gray-700">{meetingTopicPlaceholder}</div>
                        </div>
                    </div>

                    {/* Availabilities Section */}
                    <div className="w-[1180px] mt-12 text-left"> {/* Adjusted width and margin */}
                        <div className="flex justify-between items-center mb-8">
                            <div className="text-[30px] tracking-num-0_01 leading-[100%] font-semibold text-gray-900">Availabilities</div>
                            <button
                                className="flex items-center gap-2 px-6 py-3 rounded-[10px] bg-sky-400 text-white text-[24px] cursor-pointer hover:bg-sky-500 transition-colors"
                                onClick={onAddBtnContainerClick}
                            >
                                <span>Add availability</span>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex gap-8 mt-4">
                            {/* Date and Time Column */}
                            <div className="flex flex-col items-end pr-4 min-w-[100px]">
                                <div className="text-[25px] font-medium text-gray-900 mb-[22px]"> {/* Adjusted margin for alignment */}
                                    {currentDateInfo.monthName} {currentDateInfo.year}
                                </div>
                                {timeSlots.map((time, index) => (
                                    <div key={index} className="h-[25px] flex items-center text-[20px] font-medium text-gray-700">
                                        {/* Only show full hours as per reference image */}
                                        {time.includes(':30') ? '' : time}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid - Adjusted for single day and gray background */}
                            <div className="flex-1">
                                <div className="grid grid-cols-1 gap-0"> {/* Single column for the day header */}
                                    {days.map((day, index) => (
                                        <div key={index} className="text-[20px] font-medium text-gray-700 text-center pb-2 border-b border-l border-r border-black whitespace-pre-line">
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 gap-0 border-b border-l border-r border-gray-200"> {/* Grid for time slots */}
                                    {days.map((day, dayIndex) => (
                                        <div key={dayIndex} className="flex flex-col">
                                            {timeSlots.map((_, timeIndex) => (
                                                <div
                                                    key={`${dayIndex}-${timeIndex}`}
                                                    className="h-[25px] border-t border-gray-200 bg-white" // Gray background
                                                >
                                                    {/* Content for each time slot goes here (e.g., clickable availability blocks) */}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-[14px] text-gray-600 mt-2 text-center">Shown in local time {currentDateInfo.timeZone}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer to push footer down */}
            <div className="flex-1"></div>

            <Footer />
        </div>
    );
};

export default CommeetPage;