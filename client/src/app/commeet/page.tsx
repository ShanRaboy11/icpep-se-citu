"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import { FunctionComponent, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation'; 

const CommeetPage: FunctionComponent = () => {
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)); 
  const router = useRouter(); 

  const onLetsMeetBtnClick = useCallback(() => {
    router.push('/commeet/meetinfo'); 
  }, [router]);

  const handleDateClick = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateKey = `${year}-${month + 1}-${day}`; 

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const dayIndex = day + firstDayOfMonth - 1;

    if (dayIndex < firstDayOfMonth) { // Previous month's inactive days
      return;
    }
    if (day > totalDaysInMonth) { // Next month's inactive days
      return;
    }

    setSelectedDates(prevSelectedDates => {
      const newSelectedDates = new Set(prevSelectedDates);
      if (newSelectedDates.has(dateKey)) {
        newSelectedDates.delete(dateKey); // Deselect
      } else {
        newSelectedDates.add(dateKey); // Select
      }
      return newSelectedDates;
    });
  };

  const renderDayCell = (
    day: string | number, 
    isHeader: boolean = false,
    isInactive: boolean = false,
    isSelected: boolean = false,
    onClick?: (day: number) => void 
  ) => {
    const headerClasses = "font-extrabold text-white bg-sky-500 rounded-lg";
    
    const baseDayClasses = "flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 text-sm sm:text-base font-semibold";
    
    const inactiveClasses = "text-gray-400 bg-gray-100 rounded-lg";
    const activeClasses = "text-gray-800 bg-white rounded-lg shadow-sm hover:bg-sky-100 cursor-pointer";
    const selectedClasses = "bg-sky-400 text-white rounded-full shadow-md";

    const finalClasses = isHeader
      ? headerClasses
      : isInactive
        ? inactiveClasses
        : isSelected
          ? selectedClasses
          : activeClasses;

    const clickableProps = (!isHeader && !isInactive && onClick && typeof day === 'number')
      ? { onClick: () => onClick(day) }
      : {};

    return (
      <div className={`${baseDayClasses} ${finalClasses}`} {...clickableProps}>
        {day}
      </div>
    );
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); 
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate(); 
    const totalDaysInPrevMonth = new Date(year, month, 0).getDate(); 

    const days = [];

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({ day: totalDaysInPrevMonth - i, inactive: true });
    }

    for (let i = 1; i <= totalDaysInMonth; i++) {
      days.push({ day: i, inactive: false });
    }

    const remainingCells = 42 - days.length; 
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: i, inactive: true });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + 1);
      return newDate;
    });
  };

  const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-gray-50">
      <Header />
      <div className="flex-1 flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8">
        {/* Main Content Area */}
        <div className="max-w-7xl w-full flex flex-col lg:flex-row lg:justify-between items-start lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
          <div className="flex-shrink-0 text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl font-rubik leading-tight mt-8">
              <span className="text-sky-500 font-bold">com</span>
              <span className="text-gray-900 font-bold">meet</span>
            </h1>
            <p className="mt-6 text-xl sm:text-2xl font-raleway text-gray-700 max-w-lg whitespace-nowrap">
              What days would you like to meet on?
            </p>
          </div>

          <div className="flex-shrink-0 mt-8 lg:mt-24">
            <button
              className="px-6 py-3 border-2 border-sky-400 rounded-full font-raleway text-sky-400 font-semibold flex items-center justify-center space-x-2
                         hover:bg-sky-200 hover:text-white hover:border-sky-400 active:bg-sky-600 active:border-sky-600 active:text-white transition-colors duration-200"
              onClick={onLetsMeetBtnClick}
            >
              <span>Let&apos;s meet</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="relative mt-12 mb-12 w-full max-w-lg p-4 bg-white shadow-xl rounded-2xl border border-gray-200 transform transition-all duration-300">
          
          <div className="p-2 bg-sky-500 rounded-lg text-white text-center text-xl font-bold tracking-wide flex items-center justify-between">
            <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-sky-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span>{currentMonthName} {currentYear}</span>
            <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-sky-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day of Week Headers - UPDATED: Reduced margin and gap */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-4">
            {daysOfWeek.map(day => (
              <div key={day}>
                {renderDayCell(day, true)}
              </div>
            ))}
          </div>

          {/* Dates Grid - UPDATED: Reduced margin and gap */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-2">
            {calendarDays.map((date, index) => {
              const uniqueDateKey = `${currentYear}-${currentDate.getMonth() + 1}-${date.day}`;
              const isSelected = selectedDates.has(uniqueDateKey);
              return (
                <div key={index}>
                  {renderDayCell(date.day, false, date.inactive, isSelected, handleDateClick)}
                </div>
              );
            })}
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CommeetPage;