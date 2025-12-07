"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import { FunctionComponent, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, CalendarCheck } from "lucide-react";

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

    if (dayIndex < firstDayOfMonth) return; // Prev month padding
    if (day > totalDaysInMonth) return; // Next month padding

    setSelectedDates(prevSelectedDates => {
      const newSelectedDates = new Set(prevSelectedDates);
      if (newSelectedDates.has(dateKey)) {
        newSelectedDates.delete(dateKey);
      } else {
        newSelectedDates.add(dateKey);
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
    // Header Cells (Mon, Tue, etc.)
    if (isHeader) {
      return (
        <div className="flex items-center justify-center h-10 w-full text-xs sm:text-sm font-bold text-primary3/60 font-raleway uppercase tracking-wider">
          {day}
        </div>
      );
    }

    // Interactive Day Cells
    const baseClasses = "flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 text-sm sm:text-base font-rubik font-medium rounded-xl transition-all duration-200 ease-out";
    
    let stateClasses = "";
    if (isInactive) {
      stateClasses = "text-gray-300 cursor-default";
    } else if (isSelected) {
      stateClasses = "bg-primary1 text-white shadow-lg shadow-primary1/30 scale-105 font-bold";
    } else {
      stateClasses = "text-gray-700 hover:bg-primary1/10 hover:text-primary1 cursor-pointer hover:scale-105 active:scale-95";
    }

    const clickableProps = (!isInactive && onClick && typeof day === 'number')
      ? { onClick: () => onClick(day) }
      : {};

    return (
      <div className="flex justify-center items-center p-1">
        <div className={`${baseClasses} ${stateClasses}`} {...clickableProps}>
          {day}
        </div>
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

  // Page Content Constants
  const pillText = "Schedule";
  const title = "ComMeet";
  const subtitle = "Select the dates you are available to meet with the community.";

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Grid />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-24">
          
          {/* Header Section */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
              <div className="h-2 w-2 rounded-full bg-primary1"></div>
              <span className="font-raleway text-sm font-semibold text-primary1">
                {pillText}
              </span>
            </div>

            <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
              {title}
            </h1>

            <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>

          {/* Calendar Content */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-xl bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-6 sm:p-10 transform transition-all hover:shadow-primary1/5">
              
              {/* Calendar Controls */}
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={handlePrevMonth} 
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-primary3 transition-all active:scale-95"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <h2 className="text-xl sm:text-2xl font-rubik font-bold text-primary3 text-center">
                  {currentMonthName} <span className="text-primary1 font-light">{currentYear}</span>
                </h2>
                
                <button 
                  onClick={handleNextMonth} 
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-primary3 transition-all active:scale-95"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 mb-4 border-b border-gray-100 pb-2">
                {daysOfWeek.map(day => (
                  <div key={day} className="text-center">
                    {renderDayCell(day, true)}
                  </div>
                ))}
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-7 gap-y-2">
                {calendarDays.map((date, index) => {
                  const uniqueDateKey = `${currentYear}-${currentDate.getMonth() + 1}-${date.day}`;
                  const isSelected = selectedDates.has(uniqueDateKey);
                  return (
                    <div key={index} className="w-full">
                      {renderDayCell(date.day, false, date.inactive, isSelected, handleDateClick)}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Action Section */}
              <div className="mt-10 flex flex-col items-center gap-4">
                <div className="h-px w-full bg-gray-100 mb-2"></div>
                <button
                  onClick={onLetsMeetBtnClick}
                  disabled={selectedDates.size === 0}
                  className={`
                    w-full sm:w-auto px-8 py-3.5 rounded-full font-rubik font-semibold text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-300
                    ${selectedDates.size > 0 
                      ? "bg-gradient-to-r from-primary3 to-primary1 hover:shadow-primary1/30 hover:-translate-y-1 cursor-pointer" 
                      : "bg-gray-300 cursor-not-allowed"}
                  `}
                >
                  <span>Let&apos;s Meet</span>
                  <CalendarCheck className="w-5 h-5" />
                </button>
                <p className="text-xs font-raleway text-gray-400">
                  {selectedDates.size === 0 
                    ? "Select at least one date to proceed" 
                    : `${selectedDates.size} date${selectedDates.size > 1 ? 's' : ''} selected`}
                </p>
              </div>

            </div>
          </div>

        </main>

        <Footer />
      </div>
    </div>
  );
};

export default CommeetPage;