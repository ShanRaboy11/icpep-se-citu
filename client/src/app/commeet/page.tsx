"use client";

import Header from "../components/header"; 
import Footer from "../components/footer"; 
import { FunctionComponent, useCallback, useState } from 'react'; 
import { useRouter } from 'next/navigation'; // Import useRouter

const CommeetPage = () => {
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set()); 
  const router = useRouter(); // Initialize useRouter

  const onLetsMeetBtnClick = useCallback(() => {
    // Navigate to the next page instead of showing an alert
    router.push('/commeet/meetinfo'); // Replace '/next-page' with the actual path to your next page
  }, []); 

  const handleDateClick = (day: string) => {
    // Only allow selection for active (not inactive) dates
    const dateObject = dates.find(d => d.day === day && !d.inactive);
    if (!dateObject) return; // Do nothing if it's an inactive date

    setSelectedDates(prevSelectedDates => {
      const newSelectedDates = new Set(prevSelectedDates);
      const uniqueDateKey = `2025-10-${day}`; 
      if (newSelectedDates.has(uniqueDateKey)) {
        newSelectedDates.delete(uniqueDateKey); // Deselect
      } else {
        newSelectedDates.add(uniqueDateKey); // Select
      }
      return newSelectedDates;
    });
  };

  // Added isSelected prop and onClick handler prop
  const renderDayCell = (
    day: string,
    isHeader: boolean = false,
    isInactive: boolean = false,
    isSelected: boolean = false, 
    onClick?: (day: string) => void 
  ) => {
    const headerClasses = "font-extrabold text-white bg-sky-500 rounded-xl";
    const baseDayClasses = "flex items-center justify-center h-24 w-24 sm:h-28 sm:w-28 text-3xl font-semibold";
    const inactiveClasses = "text-gray-400 bg-gray-100 rounded-xl";
    const activeClasses = "text-gray-800 bg-white rounded-xl shadow-sm hover:bg-sky-100 cursor-pointer";

    const selectedClasses = "bg-sky-400 text-white rounded-full"; 
    const finalClasses = isHeader
      ? headerClasses
      : isInactive
        ? inactiveClasses
        : isSelected
          ? selectedClasses
          : activeClasses;

    const clickableProps = (!isHeader && !isInactive && onClick)
      ? { onClick: () => onClick(day) }
      : {};

    return (
      <div className={`${baseDayClasses} ${finalClasses}`} {...clickableProps}>
        {day}
      </div>
    );
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dates = [
    { day: "28", inactive: true }, { day: "29", inactive: true }, { day: "30", inactive: true },
    { day: "1", inactive: false }, { day: "2", inactive: false }, { day: "3", inactive: false }, { day: "4", inactive: false },
    { day: "5", inactive: false }, { day: "6", inactive: false }, { day: "7", inactive: false }, { day: "8", inactive: false }, { day: "9", inactive: false }, { day: "10", inactive: false }, { day: "11", inactive: false },
    { day: "12", inactive: false }, { day: "13", inactive: false }, { day: "14", inactive: false }, { day: "15", inactive: false }, { day: "16", inactive: false }, { day: "17", inactive: false }, { day: "18", inactive: false },
    { day: "19", inactive: false }, { day: "20", inactive: false }, { day: "21", inactive: false }, { day: "22", inactive: false }, { day: "23", inactive: false }, { day: "24", inactive: false }, { day: "25", inactive: false },
    { day: "26", inactive: false }, { day: "27", inactive: false }, { day: "28", inactive: false }, { day: "29", inactive: false }, { day: "30", inactive: false }, { day: "31", inactive: false },
    { day: "1", inactive: true }
  ];


  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-gray-50">
      <Header />
      <div className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Main Content Area */}
        <div className="max-w-7xl w-full flex flex-col lg:flex-row lg:justify-between items-start lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
          {/* Left Section - Commeet Intro */}
          <div className="flex-shrink-0 text-center lg:text-left">
            <h1 className="text-6xl sm:text-7xl font-rubik leading-tight mt-12">
              <span className="text-sky-500 font-bold">com</span>
              <span className="text-gray-900 font-bold">meet</span>
            </h1>
            <p className="mt-8 text-2xl sm:text-3xl font-raleway text-gray-700 max-w-lg whitespace-nowrap">
              What days would you like to meet on?
            </p>
          </div>

          {/* Right Section - Let's Meet Button */}
          <div className="flex-shrink-0 mt-8 lg:mt-32">
            <button
              className="px-6 py-3 border-2 border-gray-900 rounded-full font-manrope text-gray-700 font-semibold flex items-center justify-center space-x-2
                         hover:bg-sky-200 hover:text-white hover:border-sky-400 active:bg-sky-600 active:border-sky-600 active:text-white transition-colors duration-200" 
              onClick={onLetsMeetBtnClick}
            >
              <span>Let's meet</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="relative mt-16 mb-12 w-full max-w-5xl p-6 bg-white shadow-xl rounded-2xl border-2 border-gray-300 transform transition-all duration-300">
          {/* Calendar Header */}
          <div className="p-4 bg-sky-500 rounded-lg text-white text-center text-4xl font-extrabold tracking-wide">
            October 2025
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 mt-8">
            {daysOfWeek.map(day => (
              <div key={day}>
                {renderDayCell(day, true)}
              </div>
            ))}
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 mt-4">
            {dates.map((date, index) => {
              const uniqueDateKey = `2025-10-${date.day}`; 
              const isSelected = selectedDates.has(uniqueDateKey); 
              return (
                <div key={index}>
                  {renderDayCell(date.day, false, date.inactive, isSelected, handleDateClick)}
                </div>
              );
            })}
          </div>

        </div>
        {/* Navigation Arrows outside the calendar */}
        <button className="absolute top-1/2 left-4 sm:left-12 lg:left-24 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-sky-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="absolute top-1/2 right-4 sm:right-12 lg:right-24 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-sky-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default CommeetPage as FunctionComponent;