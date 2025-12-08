"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  LayoutGrid,
  List,
  Clock,
  Calendar,
  CalendarX,
} from "lucide-react";

// Define the Meeting Interface based on your API response
type Meeting = {
  _id: string;
  title: string;
  agenda: string;
  departments: string[];
  selectedDates: string[]; // ISO strings
  startTime: string;
  endTime: string;
};

const CommeetPage: FunctionComponent = () => {
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // State for fetching data
  const [upcoming, setUpcoming] = useState<Meeting[]>([]);

  const router = useRouter();

  // --- FETCH DATA ---
  useEffect(() => {
    (async () => {
      try {
        console.log("Attempting to fetch meetings...");
        const { listMeetings } = await import("../services/meeting");

        // Try fetching WITHOUT the filter first to see if ANYTHING exists
        const allItems = await listMeetings({});
        console.log("RAW DB DUMP (All Meetings):", allItems);

        // Then try with the upcoming filter
        const upcomingItems = await listMeetings({ upcoming: true });
        console.log("Filtered Upcoming Meetings:", upcomingItems);

        setUpcoming(upcomingItems);
      } catch (err) {
        console.error("CRITICAL FAILURE LOADING MEETINGS:", err);
      }
    })();
  }, []);

  // --- HANDLERS ---
  const onLetsMeetBtnClick = useCallback(() => {
    const datesParam = Array.from(selectedDates).join(",");
    router.push(
      `/commeet/meet-information${datesParam ? `?dates=${datesParam}` : ""}`
    );
  }, [router, selectedDates]);

  const formatDateDisplay = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDateClick = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 1. Check if the date is valid within the month view
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const dayIndex = day + firstDayOfMonth - 1;

    if (dayIndex < firstDayOfMonth) return;
    if (day > totalDaysInMonth) return;

    // --- NEW LOGIC START: Prevent past dates ---
    
    // Create a date object for the clicked day (set to midnight)
    const clickedDate = new Date(year, month, day);
    clickedDate.setHours(0, 0, 0, 0);

    // Create a date object for today (set to midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If clicked date is strictly less than today, do nothing.
    if (clickedDate < today) {
      return; 
    }
    // --- NEW LOGIC END ---

    // FIX: Do NOT use padStart. The render loop uses "2025-10-5", not "2025-10-05"
    const dateKey = `${year}-${month + 1}-${day}`;

    setSelectedDates((prevSelectedDates) => {
      const newSelectedDates = new Set(prevSelectedDates);
      if (newSelectedDates.has(dateKey)) {
        newSelectedDates.delete(dateKey);
      } else {
        newSelectedDates.add(dateKey);
      }
      return newSelectedDates;
    });
  };

  // --- CALENDAR LOGIC ---
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
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + 1);
      return newDate;
    });
  };

  const renderDayCell = (
    day: string | number,
    isHeader: boolean = false,
    isInactive: boolean = false,
    isSelected: boolean = false,
    onClick?: (day: number) => void
  ) => {
    if (isHeader) {
      return (
        <div className="flex items-center justify-center h-10 w-full text-xs sm:text-sm font-bold text-primary3/60 font-raleway uppercase tracking-wider">
          {day}
        </div>
      );
    }

    const baseClasses =
      "flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 text-sm sm:text-base font-rubik font-medium rounded-xl transition-all duration-200 ease-out";

    let stateClasses = "";
    if (isInactive) {
      stateClasses = "text-gray-300 cursor-default";
    } else if (isSelected) {
      stateClasses =
        "bg-primary1 text-white shadow-lg shadow-primary1/30 scale-105 font-bold";
    } else {
      stateClasses =
        "text-gray-700 hover:bg-primary1/10 hover:text-primary1 cursor-pointer hover:scale-105 active:scale-95";
    }

    const clickableProps =
      !isInactive && onClick && typeof day === "number"
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

  const currentMonthName = currentDate.toLocaleString("default", {
    month: "long",
  });
  const currentYear = currentDate.getFullYear();

  const pillText = "Schedule";
  const title = "ComMeet";
  const subtitle =
    "Select the dates you are available to meet with the community.";

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Grid />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-24">
          {/* Header Section */}
          <div className="mb-12 text-center">
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

          {/* Main Layout */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center">
            {/* --- LEFT COLUMN: Calendar --- */}
            <div className="w-full lg:w-1/2 flex flex-col items-center">
              <div className="w-full bg-white rounded-[2rem] border border-gray-200 shadow-lg transition-all duration-300 ease-in-out hover:shadow-primary1/40 hover:-translate-y-1 p-6 sm:p-8">
                {/* Calendar Controls */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-primary3 transition-all active:scale-95 cursor-pointer"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <h2 className="text-xl sm:text-2xl font-rubik font-bold text-primary3 text-center">
                    {currentMonthName}{" "}
                    <span className="text-primary1 font-light">
                      {currentYear}
                    </span>
                  </h2>

                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-primary3 transition-all active:scale-95 cursor-pointer"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 mb-2 border-b border-gray-100 pb-2">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="text-center">
                      {renderDayCell(day, true)}
                    </div>
                  ))}
                </div>

                {/* Dates Grid */}
                <div className="grid grid-cols-7 gap-y-1">
                  {calendarDays.map((date, index) => {
                    const uniqueDateKey = `${currentYear}-${
                      currentDate.getMonth() + 1
                    }-${date.day}`;
                    const isSelected = selectedDates.has(uniqueDateKey);
                    return (
                      <div key={index} className="w-full">
                        {renderDayCell(
                          date.day,
                          false,
                          date.inactive,
                          isSelected,
                          handleDateClick
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Let's Meet Button */}
              <div className="mt-8 w-full">
                <button
                  onClick={onLetsMeetBtnClick}
                  disabled={selectedDates.size === 0}
                  className={`
                    group w-full py-4 rounded-2xl font-rubik font-bold text-white shadow-lg flex items-center justify-center gap-3 transition-all duration-300
                    ${
                      selectedDates.size > 0
                        ? "bg-gradient-to-r from-primary3 to-primary1 hover:shadow-primary1/40 cursor-pointer"
                        : "bg-gray-300 cursor-not-allowed"
                    }
                  `}
                >
                  <span className="text-lg">Let&apos;s Meet</span>
                  <ArrowRight
                    className={`w-5 h-5 transition-transform duration-300 ${
                      selectedDates.size > 0 ? "group-hover:translate-x-1" : ""
                    }`}
                  />
                </button>
                <p className="text-center text-xs font-raleway text-gray-400 mt-3">
                  {selectedDates.size === 0
                    ? "Select dates to proceed"
                    : `${selectedDates.size} date${
                        selectedDates.size > 1 ? "s" : ""
                      } selected`}
                </p>
              </div>
            </div>

            {/* --- RIGHT COLUMN: Upcoming Meetings --- */}
            <div className="w-full lg:w-1/2 flex flex-col h-full">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="font-rubik font-bold text-2xl text-primary3">
                  Upcoming Meetings
                </h3>

                {/* Toggle (Only show if there are meetings) */}
                {upcoming.length > 0 && (
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "list"
                          ? "bg-white text-primary1 shadow-sm"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "grid"
                          ? "bg-white text-primary1 shadow-sm"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Meetings Content or Empty State */}
              {upcoming.length > 0 ? (
                <div
                  className={`
                  ${
                    viewMode === "grid"
                      ? "grid grid-cols-2 gap-3 sm:gap-4"
                      : "flex flex-col gap-2"
                  }
                `}
                >
                  {upcoming.map((meeting) => (
                    <div
                      key={meeting._id}
                      onClick={() =>
                        router.push(
                          `/commeet/availability?meetingId=${meeting._id}`
                        )
                      }
                      className={`
                        bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary1/30 p-4 group cursor-pointer
                        ${
                          viewMode === "list"
                            ? "flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4"
                            : "flex flex-col gap-3 h-full"
                        }
                      `}
                    >
                      {/* Date Badge */}
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary1/10 rounded-lg text-primary1 group-hover:bg-primary1 group-hover:text-white transition-colors duration-300 shrink-0">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <span className="font-raleway font-semibold text-gray-600 text-sm">
                          {meeting.selectedDates[0]
                            ? formatDateDisplay(meeting.selectedDates[0])
                            : "TBD"}
                        </span>
                      </div>

                      {/* Title */}
                      <div
                        className={`${
                          viewMode === "list"
                            ? "sm:flex-1 sm:px-2"
                            : "min-h-[3rem]"
                        }`}
                      >
                        <h4 className="font-rubik font-bold text-base text-primary3 group-hover:text-primary1 transition-colors leading-tight">
                          {meeting.title}
                        </h4>
                      </div>

                      {/* Time */}
                      <div
                        className={`flex items-center gap-2 text-xs text-gray-500 font-raleway ${
                          viewMode === "list" ? "justify-end" : ""
                        }`}
                      >
                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                          <Clock className="w-3 h-3" />
                          <span>
                            {meeting.startTime} - {meeting.endTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* --- EMPTY STATE --- */
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 text-center p-8">
                  <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                    <CalendarX className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-rubik font-bold text-lg text-gray-600 mb-1">
                    No Upcoming Meetings
                  </h4>
                  <p className="font-raleway text-sm text-gray-400 max-w-xs">
                    There are no scheduled meetings at this time. Check back
                    later!
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default CommeetPage;