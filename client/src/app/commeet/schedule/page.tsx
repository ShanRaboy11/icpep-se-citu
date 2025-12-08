"use client";

import Header from "../../components/header";
import Footer from "../../components/footer";
import Grid from "../../components/grid";
import { FunctionComponent, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  Pencil,
} from "lucide-react";

// Backend-driven data
type Meeting = {
  _id: string;
  title: string;
  agenda: string;
  departments: string[];
  selectedDates: string[];
  startTime: string;
  endTime: string;
};

const CommeetPage: FunctionComponent = () => {
  const router = useRouter();

  // --- State ---
  const [isEditing, setIsEditing] = useState(false);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [meeting, setMeeting] = useState<Meeting | null>(null);

  // confirmedSlots: The "saved" state (only updates on Confirm)
  const [confirmedSlots, setConfirmedSlots] = useState<string[]>([]);
  // draftSlots: The "working" state (updates while dragging/clicking)
  const [draftSlots, setDraftSlots] = useState<string[]>([]);

  const [currentStartDate, setCurrentStartDate] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"add" | "remove">("add");

  // --- Configuration ---
  const [times, setTimes] = useState<number[]>([]);
  const timeColWidth = "w-14 sm:w-24";

  // --- Helpers ---
  const visibleDates = (() => {
    if (!meeting) return [] as Date[];
    const dates = meeting.selectedDates.slice(0, 3).map((d) => new Date(d));
    return dates;
  })();
  const formatDateKey = (date: Date) => date.toISOString().split("T")[0];

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  };

  const formatTime = (hour: number) => {
    const h = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? "AM" : "PM";
    return `${h} ${ampm}`;
  };

  // --- Handlers ---
  const handlePrev = () => {};
  const handleNext = () => {};
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("meetingId");
    if (!id) return;
    setMeetingId(id);
    (async () => {
      const { getMeeting } = await import("../../services/meeting");
      const m = await getMeeting(id);
      setMeeting(m);

      // Derive times from start/end time
      const parse = (t: string) => {
        const [hm, ap] = t.split(" ");
        const [hh, mm] = hm.split(":").map(Number);
        let hour = hh % 12;
        if (ap.toUpperCase() === "PM") hour += 12;
        return hour + (mm >= 30 ? 0.5 : 0);
      };
      const startHour = Math.floor(parse(m.startTime));
      const endHour = Math.ceil(parse(m.endTime));
      const arr: number[] = [];
      for (let h = startHour; h < endHour; h++) arr.push(h);
      setTimes(arr);

      // Set currentStartDate to first selected date
      setCurrentStartDate(new Date(m.selectedDates[0]));
    })().catch(console.error);
  }, []);

  // Helper to modify the Draft State
  const updateDraftSlotState = useCallback(
    (key: string, mode: "add" | "remove") => {
      setDraftSlots((prev) => {
        if (mode === "add") {
          return prev.includes(key) ? prev : [...prev, key];
        } else {
          return prev.filter((k) => k !== key);
        }
      });
    },
    []
  );

  const handleMouseDown = (key: string) => {
    if (!isEditing) return;
    setIsDragging(true);
    // Check against DRAFT slots while editing
    const isAlreadySelected = draftSlots.includes(key);
    const mode = isAlreadySelected ? "remove" : "add";
    setDragMode(mode);
    updateDraftSlotState(key, mode);
  };

  const handleMouseEnter = (key: string) => {
    if (!isEditing || !isDragging) return;
    updateDraftSlotState(key, dragMode);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  // --- Action Button Handlers ---
  const onAddAvailabilityClick = () => {
    // Initialize draft with current confirmed slots
    setDraftSlots([...confirmedSlots]);
    setIsEditing(true);
  };

  const onCancelClick = () => {
    // Discard draft, exit edit mode
    setIsEditing(false);
    setIsDragging(false);
  };

  const onConfirmClick = () => {
    // Persist slots to backend, then commit locally
    if (!meetingId) return;
    (async () => {
      try {
        const { saveMyAvailability } = await import(
          "../../services/availability"
        );
        await saveMyAvailability(meetingId, draftSlots);
        setConfirmedSlots([...draftSlots]);
        setIsEditing(false);
        setIsDragging(false);
      } catch (err) {
        console.error("Failed to save availability from schedule", err);
      }
    })();
  };

  const onContinueClick = () => {
    if (!meetingId) return;
    router.push(`/commeet/availability?meetingId=${meetingId}`);
  };

  const hasConfirmedSlots = confirmedSlots.length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden select-none">
      {/* Background Grid Pattern */}
      <Grid />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-[9.5rem] pb-24">
          {/* Back Button */}
          <div className="mb-8 flex justify-start">
            <button
              onClick={() => router.back()}
              title="Go Back"
              className="relative flex h-12 w-12 cursor-pointer items-center justify-center 
                                       rounded-full border-2 border-primary1 text-primary1 
                                       overflow-hidden transition-all duration-300 ease-in-out 
                                       active:scale-95 before:absolute before:inset-0 
                                       before:bg-gradient-to-r before:from-transparent 
                                       before:via-white/40 before:to-transparent 
                                       before:translate-x-[-100%] hover:before:translate-x-[100%] 
                                       before:transition-transform before:duration-700"
            >
              <ArrowLeft className="h-6 w-6 animate-nudge-left translate-x-[2px]" />
            </button>
          </div>

          {/* Centered Content Container */}
          <div className="max-w-4xl mx-auto relative">
            {/* 1. Meeting Details Section */}
            <div className="text-left mb-12">
              <h1 className="font-rubik text-3xl sm:text-4xl font-bold text-primary3 leading-tight mb-6">
                {meeting?.title || "Loading..."}
              </h1>

              <div className="flex flex-col gap-4 text-gray-600 font-raleway text-base">
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
                  <span className="font-bold text-gray-800 w-32 shrink-0 font-rubik">
                    Departments:
                  </span>
                  <span className="text-gray-600 font-medium">
                    {meeting?.departments?.join(", ")}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
                  <span className="font-bold text-gray-800 w-32 shrink-0 font-rubik">
                    Agenda:
                  </span>
                  <span className="leading-relaxed">{meeting?.agenda}</span>
                </div>
              </div>
            </div>

            {/* 2. Availability Action Header */}
            <div className="flex flex-row justify-between items-center mb-6 gap-4">
              <div className="flex flex-col">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 font-rubik leading-tight">
                  {isEditing ? "Select Availability" : "Officer Availability"}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-raleway mt-1 leading-tight">
                  {isEditing
                    ? "Slide to select multiple slots."
                    : hasConfirmedSlots
                    ? "Your schedule is added."
                    : "View or add schedule."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="shrink-0">
                {!isEditing ? (
                  <button
                    // Added sm:min-w-[11.5rem] to ensure same size for Add/Edit states
                    className="group p-2.5 sm:px-6 sm:py-2.5 bg-gradient-to-r from-primary3 to-primary1 rounded-xl font-rubik text-white font-bold text-sm shadow-md shadow-primary1/20 hover:shadow-lg hover:shadow-primary1/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer sm:min-w-[11.5rem]"
                    onClick={onAddAvailabilityClick}
                  >
                    {hasConfirmedSlots ? (
                      <Pencil className="w-5 h-5 stroke-[2.5px]" />
                    ) : (
                      <Plus className="w-5 h-5 stroke-[3px]" />
                    )}
                    <span className="hidden sm:inline">
                      {hasConfirmedSlots
                        ? "Edit Availability"
                        : "Add Availability"}
                    </span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      className="p-2.5 sm:px-6 sm:py-2.5 bg-white border border-gray-200 rounded-xl font-rubik text-gray-500 font-bold text-sm hover:bg-gray-50 hover:text-red-500 hover:border-red-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
                      onClick={onCancelClick}
                    >
                      <X className="w-5 h-5" />
                      <span className="hidden sm:inline ml-2">Cancel</span>
                    </button>

                    <button
                      className={`p-2.5 sm:px-6 sm:py-2.5 rounded-xl font-rubik text-white font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center cursor-pointer
                                                ${
                                                  draftSlots.length > 0
                                                    ? "bg-sky-500 shadow-sky-200 hover:bg-sky-600 hover:shadow-lg hover:-translate-y-0.5"
                                                    : "bg-gray-300 shadow-gray-200 cursor-not-allowed"
                                                }`}
                      onClick={onConfirmClick}
                      disabled={draftSlots.length === 0}
                    >
                      <Check className="w-5 h-5 stroke-[3px]" />
                      <span className="hidden sm:inline ml-2">Confirm</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Timeline Grid Container */}
            <div className="w-full bg-white rounded-[2rem] border border-gray-200 shadow-lg p-4 sm:p-8 transition-all duration-300 hover:shadow-primary1/40 hover:-translate-y-2 relative z-20">
              {/* Header Row 1: [Month Year] ... [ < > ] */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-xl sm:text-2xl text-gray-900 font-bold font-rubik">
                  {currentStartDate ? formatMonthYear(currentStartDate) : ""}
                </div>
                {meeting &&
                  meeting.selectedDates &&
                  meeting.selectedDates.length >= 3 && (
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrev}
                        className="p-2 text-gray-400 hover:text-primary1 hover:bg-primary1/5 rounded-full transition-all cursor-pointer active:scale-90"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="p-2 text-gray-400 hover:text-primary1 hover:bg-primary1/5 rounded-full transition-all cursor-pointer active:scale-90"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  )}
              </div>

              {/* Header Row 2: PST + Date Columns */}
              <div className="flex w-full mb-2">
                {/* PST Label */}
                <div
                  className={`${timeColWidth} shrink-0 flex items-end justify-end pr-3 pb-2`}
                >
                  <div className="text-xs text-gray-400 font-bold font-raleway">
                    PST
                  </div>
                </div>

                {/* Date Columns Headers */}
                <div className="flex-1 flex">
                  {visibleDates.map((dateObj, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center justify-end pb-2"
                    >
                      <div className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-1 font-rubik">
                        {formatDayName(dateObj)}
                      </div>
                      <div
                        className={`text-2xl font-rubik transition-colors duration-300 ${
                          isEditing
                            ? "text-sky-500 font-bold"
                            : "text-gray-800 font-bold"
                        }`}
                      >
                        {dateObj.getDate()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* The Grid Body */}
              <div
                className="flex w-full select-none"
                onMouseLeave={() => setIsDragging(false)}
              >
                {/* Left Column: Time Labels */}
                <div
                  className={`${timeColWidth} shrink-0 flex flex-col text-right pr-3 pt-0`}
                >
                  {times.map((hour) => (
                    <div key={hour} className="h-16 relative">
                      <span className="text-xs sm:text-sm text-gray-400 font-bold font-raleway absolute top-0 right-0 transform -translate-y-1/2">
                        {formatTime(hour)}
                      </span>
                    </div>
                  ))}
                  {/* Final Time Label (Bottom Line) */}
                  <div className="h-0 relative">
                    <span className="text-xs sm:text-sm text-gray-400 font-bold font-raleway absolute top-0 right-0 transform -translate-y-1/2">
                      {formatTime(times[times.length - 1] + 1)}
                    </span>
                  </div>
                </div>

                {/* Right: Interactive Slots */}
                <div className="flex-1 flex">
                  {visibleDates.map((dateObj) => {
                    const dateKey = formatDateKey(dateObj);

                    return (
                      <div
                        key={dateKey}
                        className={`flex-1 border-r border-gray-100 last:border-r-0 ${
                          isEditing ? "cursor-pointer" : "cursor-default"
                        }`}
                      >
                        {times.map((hour, timeIndex) => {
                          const slot1Key = `${hour}:00`;
                          const slot2Key = `${hour}:30`;

                          const fullKey1 = `${dateKey}|${slot1Key}`;
                          const fullKey2 = `${dateKey}|${slot2Key}`;

                          // Use DRAFT slots if editing, CONFIRMED slots if viewing
                          const activeSlots = isEditing
                            ? draftSlots
                            : confirmedSlots;

                          const isSlot1Selected =
                            activeSlots.includes(fullKey1);
                          const isSlot2Selected =
                            activeSlots.includes(fullKey2);

                          return (
                            <div
                              key={hour}
                              className="h-16 border-t border-gray-100 w-full relative bg-white group"
                            >
                              {/* Top Half (:00) */}
                              <div
                                onMouseDown={() => handleMouseDown(fullKey1)}
                                onMouseEnter={() => handleMouseEnter(fullKey1)}
                                className={`h-1/2 w-full transition-colors duration-75 relative border-b border-gray-50 border-dashed
                                                                    ${
                                                                      isSlot1Selected
                                                                        ? "bg-sky-100"
                                                                        : isEditing
                                                                        ? "hover:bg-sky-50"
                                                                        : ""
                                                                    }`}
                              >
                                {isSlot1Selected && (
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]"></div>
                                )}
                              </div>

                              {/* Bottom Half (:30) */}
                              <div
                                onMouseDown={() => handleMouseDown(fullKey2)}
                                onMouseEnter={() => handleMouseEnter(fullKey2)}
                                className={`h-1/2 w-full transition-colors duration-75 relative
                                                                    ${
                                                                      isSlot2Selected
                                                                        ? "bg-sky-100"
                                                                        : isEditing
                                                                        ? "hover:bg-sky-50"
                                                                        : ""
                                                                    }`}
                              >
                                {isSlot2Selected && (
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]"></div>
                                )}
                              </div>

                              {/* Closing Border for last item in column */}
                              {timeIndex === times.length - 1 && (
                                <div className="absolute bottom-0 left-0 right-0 border-b border-gray-100"></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer Text (Inside Card) */}
              <div className="mt-8 text-center text-gray-400 text-xs font-medium font-raleway">
                All times shown in local time (PST)
              </div>

              {/* Continue Button (Inside Card, Below PST Note) */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  confirmedSlots.length > 0 && !isEditing
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="flex justify-center p-6">
                  <button
                    onClick={onContinueClick}
                    className="group relative px-8 py-3.5 bg-gradient-to-r from-primary3 to-primary1 rounded-2xl font-rubik font-bold text-white shadow-lg shadow-primary1/20 hover:shadow-primary1/40 transition-all duration-300 flex items-center gap-3 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
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
