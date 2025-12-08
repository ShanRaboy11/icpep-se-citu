"use client";

import Header from "../../components/header";
import Footer from "../../components/footer";
import Grid from "../../components/grid";
import { FunctionComponent, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Pencil,
  Trash2,
  MoreVertical,
  Settings,
  Clock,
  Users,
  AlertTriangle,
} from "lucide-react";

// --- Data Interfaces ---
export interface DepartmentData {
  title: string;
  description: string;
}

// --- Responder Type ---
type Responder = {
  id: string;
  name: string;
  lastName: string;
  role: string;
  initials: string;
  deptKey: string;
  slots: string[];
};

type Meeting = {
  _id: string;
  title: string;
  agenda: string;
  departments: string[];
  selectedDates: string[];
  startTime: string;
  endTime: string;
};

// Unified Avatar Gradient
const AVATAR_GRADIENT =
  "bg-gradient-to-br from-blue-500 to-sky-400 shadow-sky-200";

const AvailabilityPage: FunctionComponent = () => {
  const router = useRouter();

  // --- State ---
  const [meetingDetails, setMeetingDetails] = useState<Meeting | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showMeetingMenu, setShowMeetingMenu] = useState(false);

  // Modals
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Slots
  const [mySavedSlots, setMySavedSlots] = useState<string[]>([]);
  const [draftSlots, setDraftSlots] = useState<string[]>([]);

  // Interaction State
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [focusedSlot, setFocusedSlot] = useState<string | null>(null);
  const [isFocusLocked, setIsFocusLocked] = useState(false);

  // Calendar
  const [currentStartDate, setCurrentStartDate] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"add" | "remove">("add");

  // --- Data Logic State ---
  const [responders, setResponders] = useState<Responder[]>([]);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [times, setTimes] = useState<number[]>([]);

  // --- Configuration ---
  const timeColWidth = "w-14 sm:w-24";
  const sharedCardStyle =
    "bg-white rounded-[2rem] border border-gray-200 shadow-lg p-6 sm:p-8 transition-all duration-300 hover:shadow-primary1/40 hover:-translate-y-2";

  // --- Helpers ---
  const visibleDates = (() => {
    if (!meetingDetails) return [] as Date[];
    if (!currentStartDate) return [];

    const allDates = meetingDetails.selectedDates.map((d) => new Date(d));
    const startIdx = allDates.findIndex(
      (d) => d.getTime() === currentStartDate.getTime()
    );
    if (startIdx === -1) return allDates.slice(0, 3);
    return allDates.slice(startIdx, startIdx + 3);
  })();

  const formatDateKey = (date: Date) => date.toISOString().split("T")[0];
  const formatMonthYear = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const formatDayName = (date: Date) =>
    date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const formatTime = (hour: number) => {
    const h = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? "AM" : "PM";
    return `${h} ${ampm}`;
  };

  const getSlotAvailabilityCount = (key: string) => {
    return responders.filter((p) => p.slots.includes(key)).length;
  };

  const getMaxAvailability = () => Math.max(1, responders.length);

  const toTitleCase = (str: string) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatRoleDisplay = (role: string) => {
    if (!role) return "Member";
    if (role === "council-officer") return "Council Officer";
    if (role === "committee-officer") return "Committee Officer";
    return role.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("meetingId");
    if (!id) return;

    (async () => {
      // 1. Auth & User ID Logic
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken")
            : null;
        setCanEdit(!!token);

        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload.id) setCurrentUserId(payload.id);
            else if (payload._id) setCurrentUserId(payload._id);
          } catch (e) {
            console.error("Failed to decode token", e);
          }
        }
      } catch {}

      // 2. Load Services
      const { getMeeting } = await import("../../services/meeting");
      const { getMyAvailability, getAvailability } = await import(
        "../../services/availability"
      );

      // 3. Get Meeting Details
      const m = await getMeeting(id);
      setMeetingDetails(m);
      setCurrentStartDate(new Date(m.selectedDates[0]));

      // 4. Calculate Times
      const parseHour = (t: string) => {
        const [hm, ap] = t.split(" ");
        const [hh] = hm.split(":").map(Number);
        let hour = hh % 12;
        if (ap.toUpperCase() === "PM") hour += 12;
        return hour;
      };
      const s = parseHour(m.startTime);
      const e = parseHour(m.endTime) + 1;
      const arr: number[] = [];
      for (let h = s; h < e; h++) arr.push(h);
      setTimes(arr);

      // 5. Get My Availability
      try {
        const mine = await getMyAvailability(id);
        setMySavedSlots(mine.slots || []);
        setCanEdit(true);
      } catch (err) {
        console.warn("My availability unavailable (likely guest)", err);
        setMySavedSlots([]);
        setCanEdit(false);
      }

      // 6. Get All Responders
      const submitted = await getAvailability(id);

      try {
        const userSvc = (await import("../../services/user")).default;
        const depts = m.departments || [];
        const includesAll = depts.includes("All Officers");
        const includesExec = depts.includes("Executive Council");

        let baseUsers: any[] = [];

        if (includesAll) {
          const council = await userSvc.listUsers({
            role: "council-officer",
            isActive: true,
            limit: 500,
          });
          const committee = await userSvc.listUsers({
            role: "committee-officer",
            isActive: true,
            limit: 500,
          });
          const map = new Map();
          [...council, ...committee].forEach((u) => map.set(u.id, u));
          baseUsers = Array.from(map.values());
        } else if (includesExec) {
          baseUsers = await userSvc.listUsers({
            role: "council-officer",
            isActive: true,
            limit: 500,
          });
        } else {
          baseUsers = await userSvc.listUsers({
            role: "committee-officer",
            isActive: true,
            limit: 500,
          });
        }

        const slotsByUserId = new Map<string, string[]>();
        submitted.forEach((item: any) => {
          const uid = item.user?._id || item.user?.id || item.user;
          if (uid) slotsByUserId.set(String(uid), item.slots || []);
        });

        const mappedResponders = baseUsers.map((u) => {
          const firstName = u.firstName ?? "";
          const lastName = u.lastName ?? "";
          const name = `${firstName} ${lastName}`.trim() || "Unknown";
          const initials = `${firstName?.[0] ?? "U"}${lastName?.[0] ?? ""}`;
          return {
            id: String(u.id),
            name,
            lastName: lastName || name,
            role: formatRoleDisplay(String(u.role ?? "")),
            initials,
            deptKey: "department",
            slots: slotsByUserId.get(String(u.id)) || [],
          } as Responder;
        });

        mappedResponders.sort((a, b) => {
          const isCouncilA = a.role === "Council Officer";
          const isCouncilB = b.role === "Council Officer";
          if (isCouncilA && !isCouncilB) return -1;
          if (!isCouncilA && isCouncilB) return 1;
          return a.lastName.localeCompare(b.lastName);
        });

        setResponders(mappedResponders);
      } catch (e) {
        console.warn(
          "Failed to load responder users list, falling back to submitted only",
          e
        );
        const mappedFallback = submitted.map((item: any, idx: number) => {
          const firstName = item.user?.firstName ?? "";
          const lastName = item.user?.lastName ?? "";
          const name = `${firstName} ${lastName}`.trim() || "Unknown";

          return {
            id: String(item.user?._id || idx + 1),
            name,
            lastName: lastName || name,
            role: formatRoleDisplay(String(item.user?.role ?? "")),
            initials: `${firstName?.[0] ?? "U"}${lastName?.[0] ?? ""}`,
            deptKey: "department",
            slots: item.slots || [],
          };
        });

        mappedFallback.sort((a: Responder, b: Responder) => {
          const isCouncilA = a.role === "Council Officer";
          const isCouncilB = b.role === "Council Officer";
          if (isCouncilA && !isCouncilB) return -1;
          if (!isCouncilA && isCouncilB) return 1;
          return a.lastName.localeCompare(b.lastName);
        });

        setResponders(mappedFallback);
      }
    })().catch(console.error);
  }, []);

  // --- Event Handlers ---
  const updateDraftSlotState = useCallback(
    (key: string, mode: "add" | "remove") => {
      setDraftSlots((prev) => {
        if (mode === "add") return prev.includes(key) ? prev : [...prev, key];
        return prev.filter((k) => k !== key);
      });
    },
    []
  );

  const handleSlotMouseDown = (key: string) => {
    if (isEditing) {
      setIsDragging(true);
      const isAlreadySelected = draftSlots.includes(key);
      const mode = isAlreadySelected ? "remove" : "add";
      setDragMode(mode);
      updateDraftSlotState(key, mode);
    } else {
      if (focusedSlot === key && isFocusLocked) {
        setIsFocusLocked(false);
        setFocusedSlot(null);
      } else {
        setFocusedSlot(key);
        setIsFocusLocked(true);
        if (viewingId) setViewingId(null);
      }
    }
  };

  const handleSlotMouseEnter = (key: string) => {
    if (isEditing) {
      if (isDragging) {
        updateDraftSlotState(key, dragMode);
      }
    } else {
      if (!isFocusLocked && !viewingId) {
        setFocusedSlot(key);
      }
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const onEditClick = () => {
    if (!canEdit) return;
    setViewingId(null);
    setFocusedSlot(null);
    setIsFocusLocked(false);
    setDraftSlots([...mySavedSlots]);
    setIsEditing(true);
  };

  const onDeleteClick = () => setDraftSlots([]);

  const onCancelClick = () => {
    setIsEditing(false);
    setDraftSlots([]);
  };

  const onConfirmClick = () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("meetingId");
    if (!id) return;
    (async () => {
      const { saveMyAvailability } = await import(
        "../../services/availability"
      );
      try {
        await saveMyAvailability(id, draftSlots);
        
        // 1. Update My Slots Locally
        setMySavedSlots([...draftSlots]);
        
        // 2. FIX: INSTANTLY Update Responders List (Optimistic Update)
        // This ensures the heat map updates immediately without page refresh
        setResponders((prev) => {
           return prev.map(r => {
             if(r.id === currentUserId) {
                return { ...r, slots: [...draftSlots] };
             }
             return r;
           });
        });

        setIsEditing(false);
      } catch (err) {
        console.error("Failed to save availability", err);
      }
    })().catch(console.error);
  };

  const handleResponderClick = (id: string | null) => {
    if (isEditing) return;
    if (viewingId === id) setViewingId(null);
    else setViewingId(id);
    setFocusedSlot(null);
    setIsFocusLocked(false);
  };

  const handleBgClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isEditing) {
      setViewingId(null);
      setFocusedSlot(null);
      setIsFocusLocked(false);
    }
  };

  const handlePrev = () => {
    if (!currentStartDate || !meetingDetails) return;
    const allDates = meetingDetails.selectedDates.map((d) => new Date(d));
    const currentIdx = allDates.findIndex(
      (d) => d.getTime() === currentStartDate.getTime()
    );
    if (currentIdx > 0) {
      const newIdx = Math.max(0, currentIdx - 3);
      setCurrentStartDate(allDates[newIdx]);
    }
  };

  const handleNext = () => {
    if (!currentStartDate || !meetingDetails) return;
    const allDates = meetingDetails.selectedDates.map((d) => new Date(d));
    const currentIdx = allDates.findIndex(
      (d) => d.getTime() === currentStartDate.getTime()
    );
    if (currentIdx + 3 < allDates.length) {
      setCurrentStartDate(allDates[currentIdx + 3]);
    }
  };

  // Styles
  const pillBase =
    "px-3 py-1 rounded-full text-xs font-bold font-raleway flex items-center gap-1.5 transition-all select-none";

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden select-none">
      <Grid />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main
          className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-[9.5rem] pb-24"
          onClick={handleBgClick}
        >
          {/* Back Button */}
          <div className="mb-8 flex justify-start">
            <button
              onClick={() => router.push("/commeet")}
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

          <div className="max-w-7xl mx-auto relative">
            {/* 1. Meeting Details */}
            <div className="text-left mb-10 relative">
              <div className="flex justify-between items-start">
                <h1 className="font-rubik text-3xl sm:text-4xl font-bold text-primary3 leading-tight mb-4">
                  {meetingDetails?.title || "Loading..."}
                </h1>
                <div className="relative">
                  <button
                    onClick={() => setShowMeetingMenu(!showMeetingMenu)}
                    className="p-2 -mr-2 text-gray-400 hover:text-primary1 hover:bg-white rounded-xl transition-all cursor-pointer"
                  >
                    <MoreVertical className="w-6 h-6" />
                  </button>
                  {showMeetingMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMeetingMenu(false)}
                      ></div>
                      <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden py-1">
                        <button
                          onClick={() => {
                            setShowMeetingMenu(false);
                            setIsDetailsModalOpen(true);
                          }}
                          className="w-full text-left px-4 py-3 text-sm font-bold font-raleway text-gray-600 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Settings className="w-4 h-4" /> Edit Details
                        </button>
                        <button
                          onClick={() => {
                            setShowMeetingMenu(false);
                            setIsDeleteModalOpen(true);
                          }}
                          className="w-full text-left px-4 py-3 text-sm font-bold font-raleway text-red-500 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Meeting
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 text-gray-600 font-raleway text-base">
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                  <span className="font-bold text-gray-800 w-28 shrink-0 font-rubik">
                    Departments
                  </span>
                  <span className="text-gray-600 font-medium">
                    {meetingDetails?.departments?.join(", ") || "..."}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                  <span className="font-bold text-gray-800 w-28 shrink-0 font-rubik">
                    Agenda
                  </span>
                  <span className="leading-relaxed max-w-3xl">
                    {meetingDetails?.agenda || "..."}
                  </span>
                </div>
              </div>
            </div>

            {/* SPLIT LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 items-start">
              {/* LEFT: Availability Card (approx 57% width) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {/* Header Controls */}
                <div className="flex flex-row justify-between items-end gap-4">
                  <div className="flex flex-col">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 font-rubik leading-tight">
                      {isEditing
                        ? "Edit Your Availability"
                        : viewingId
                        ? `${toTitleCase(
                            responders.find((p) => p.id === viewingId)?.name ||
                              "Responder"
                          )}'s Availability`
                        : "Meeting Availability"}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 font-raleway mt-1.5 leading-tight">
                      {isEditing
                        ? "Click or drag to select times you are free."
                        : focusedSlot
                        ? "Viewing availability for selected time slot."
                        : viewingId
                        ? "Viewing specific availability."
                        : "Darker slots indicate higher availability."}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="shrink-0">
                    {!isEditing && (!viewingId || viewingId === currentUserId) && (
                      <button
                        onClick={onEditClick}
                        disabled={!canEdit}
                        className={`group p-2.5 sm:px-6 sm:py-2.5 rounded-xl font-rubik text-white font-bold text-sm flex items-center justify-center gap-2 sm:min-w-[11.5rem]
                                        ${
                                          canEdit
                                            ? "bg-gradient-to-r from-primary3 to-primary1 shadow-md shadow-primary1/20 hover:shadow-lg hover:shadow-primary1/30 hover:-translate-y-0.5 cursor-pointer"
                                            : "bg-gray-300 cursor-not-allowed"
                                        }
                                    `}
                      >
                        <Pencil className="w-5 h-5 stroke-[2.5px]" />
                        <span className="hidden sm:inline">
                          Update Availability
                        </span>
                      </button>
                    )}

                    {isEditing && (
                      <div className="flex gap-2">
                        <button
                          onClick={onDeleteClick}
                          className="p-2.5 bg-red-50 border border-red-100 text-red-500 rounded-xl hover:bg-red-100 transition-all cursor-pointer"
                          title="Clear All"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        <button
                          onClick={onCancelClick}
                          className="p-2.5 sm:px-6 sm:py-2.5 bg-white border border-gray-200 rounded-xl font-rubik text-gray-500 font-bold text-sm hover:bg-gray-50 hover:text-red-500 hover:border-red-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                          <span className="hidden sm:inline ml-2">Cancel</span>
                        </button>

                        <button
                          onClick={onConfirmClick}
                          className="p-2.5 sm:px-6 sm:py-2.5 bg-sky-500 rounded-xl font-rubik text-white font-bold text-sm shadow-md shadow-sky-200 hover:bg-sky-600 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center cursor-pointer"
                        >
                          <Check className="w-5 h-5 stroke-[3px]" />
                          <span className="hidden sm:inline ml-2">Save</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline Grid */}
                <div className={`${sharedCardStyle} relative z-20`}>
                  {!canEdit && (
                    <div className="mb-4 p-3 rounded-xl bg-yellow-50 text-yellow-700 text-sm font-raleway border border-yellow-100">
                      You are not logged in. Login to update your availability.
                    </div>
                  )}
                  {/* Calendar Nav */}
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2 text-gray-900 font-bold font-rubik text-xl sm:text-2xl">
                      {currentStartDate
                        ? formatMonthYear(currentStartDate)
                        : ""}
                    </div>
                    <div className="flex gap-2">
                      {meetingDetails &&
                        meetingDetails.selectedDates.length > 3 && (
                          <>
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
                          </>
                        )}
                    </div>
                  </div>

                  {/* Date Columns */}
                  <div className="flex w-full mb-4">
                    <div
                      className={`${timeColWidth} shrink-0 flex items-end justify-end pr-4 pb-2`}
                    >
                      <div className="text-xs text-gray-400 font-bold font-raleway">
                        PST
                      </div>
                    </div>
                    <div className="flex-1 flex">
                      {visibleDates.map((dateObj, i) => (
                        <div
                          key={i}
                          className="flex-1 flex flex-col items-center justify-end pb-2"
                        >
                          <div className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-1.5 font-rubik">
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

                  {/* The Grid */}
                  <div
                    className="flex w-full select-none"
                    onMouseLeave={() => {
                      setIsDragging(false);
                      if (!isEditing && !viewingId && !isFocusLocked) {
                        setFocusedSlot(null);
                      }
                    }}
                  >
                    <div
                      className={`${timeColWidth} shrink-0 flex flex-col text-right pr-4 pt-0`}
                    >
                      {times.map((h) => (
                        <div key={h} className="h-16 relative">
                          <span className="text-xs sm:text-sm text-gray-400 font-bold font-raleway absolute top-0 right-0 transform -translate-y-1/2">
                            {formatTime(h)}
                          </span>
                        </div>
                      ))}
                      {times.length > 0 && (
                        <div className="h-0 relative">
                          <span className="text-xs sm:text-sm text-gray-400 font-bold font-raleway absolute top-0 right-0 transform -translate-y-1/2">
                            {formatTime(times[times.length - 1] + 1)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex">
                      {visibleDates.map((dateObj) => {
                        const dateKey = formatDateKey(dateObj);
                        return (
                          <div
                            key={dateKey}
                            className="flex-1 border-r border-gray-100 last:border-r-0"
                          >
                            {times.map((hour, timeIndex) => {
                              const slot1Key = `${hour}:00`;
                              const slot2Key = `${hour}:30`;
                              const fullKey1 = `${dateKey}|${slot1Key}`;
                              const fullKey2 = `${dateKey}|${slot2Key}`;

                              let isSel1 = false,
                                isSel2 = false;
                              let opacity1 = 0,
                                opacity2 = 0;

                              if (isEditing) {
                                isSel1 = draftSlots.includes(fullKey1);
                                isSel2 = draftSlots.includes(fullKey2);
                                opacity1 = isSel1 ? 1 : 0;
                                opacity2 = isSel2 ? 1 : 0;
                              } else if (viewingId) {
                                const person = responders.find(
                                  (p) => p.id === viewingId
                                );
                                isSel1 =
                                  person?.slots.includes(fullKey1) || false;
                                isSel2 =
                                  person?.slots.includes(fullKey2) || false;
                                opacity1 = isSel1 ? 1 : 0;
                                opacity2 = isSel2 ? 1 : 0;
                              } else {
                                const count1 =
                                  getSlotAvailabilityCount(fullKey1);
                                const count2 =
                                  getSlotAvailabilityCount(fullKey2);
                                const max = getMaxAvailability();

                                isSel1 = count1 > 0;
                                isSel2 = count2 > 0;
                                opacity1 =
                                  count1 > 0 ? 0.15 + 0.85 * (count1 / max) : 0;
                                opacity2 =
                                  count2 > 0 ? 0.15 + 0.85 * (count2 / max) : 0;
                              }

                              const isFocus1 = focusedSlot === fullKey1;
                              const isFocus2 = focusedSlot === fullKey2;

                              return (
                                <div
                                  key={hour}
                                  className="h-16 border-t border-gray-100 w-full relative bg-white group"
                                >
                                  {/* Top Half */}
                                  <div
                                    onMouseDown={() =>
                                      handleSlotMouseDown(fullKey1)
                                    }
                                    onMouseEnter={() =>
                                      handleSlotMouseEnter(fullKey1)
                                    }
                                    className={`h-1/2 w-full transition-all duration-200 relative border-b border-gray-50 border-dashed cursor-pointer 
                                                                    ${
                                                                      isEditing
                                                                        ? "hover:bg-sky-50"
                                                                        : "hover:bg-gray-50"
                                                                    }
                                                                    ${
                                                                      isFocus1
                                                                        ? "ring-2 ring-sky-400 z-10"
                                                                        : ""
                                                                    }`}
                                  >
                                    {isSel1 && (
                                      <div
                                        className={`absolute inset-0 ${
                                          isEditing || viewingId
                                            ? "bg-sky-100"
                                            : "bg-sky-500"
                                        }`}
                                        style={{
                                          opacity:
                                            isEditing || viewingId
                                              ? 1
                                              : opacity1,
                                        }}
                                      ></div>
                                    )}
                                    {(isEditing || viewingId) && isSel1 && (
                                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]"></div>
                                    )}
                                  </div>

                                  {/* Bottom Half */}
                                  <div
                                    onMouseDown={() =>
                                      handleSlotMouseDown(fullKey2)
                                    }
                                    onMouseEnter={() =>
                                      handleSlotMouseEnter(fullKey2)
                                    }
                                    className={`h-1/2 w-full transition-all duration-200 relative cursor-pointer
                                                                    ${
                                                                      isEditing
                                                                        ? "hover:bg-sky-50"
                                                                        : "hover:bg-gray-50"
                                                                    }
                                                                    ${
                                                                      isFocus2
                                                                        ? "ring-2 ring-sky-400 z-10"
                                                                        : ""
                                                                    }`}
                                  >
                                    {isSel2 && (
                                      <div
                                        className={`absolute inset-0 ${
                                          isEditing || viewingId
                                            ? "bg-sky-100"
                                            : "bg-sky-500"
                                        }`}
                                        style={{
                                          opacity:
                                            isEditing || viewingId
                                              ? 1
                                              : opacity2,
                                        }}
                                      ></div>
                                    )}
                                    {(isEditing || viewingId) && isSel2 && (
                                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]"></div>
                                    )}
                                  </div>

                                  {/* FIX: Pointer events none on bottom border to prevent blocking clicks */}
                                  {timeIndex === times.length - 1 && (
                                    <div className="absolute bottom-0 left-0 right-0 border-b border-gray-100 pointer-events-none"></div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer Text */}
                  <div className="mt-8 text-center text-gray-400 text-xs font-medium font-raleway">
                    All times shown in local time (PST)
                  </div>
                </div>
              </div>

              {/* RIGHT: Responders List (approx 43% width) */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                <div className="hidden lg:block h-[74px]"></div>

                {/* FIXED CONTAINER: No scroll on this outer div to prevent overflow bug */}
                <div
                  className={`${sharedCardStyle} lg:sticky lg:top-32 max-h-[46rem] flex flex-col`}
                >
                  <div className="flex items-center justify-between mb-6 shrink-0">
                    <h3 className="text-xl font-bold text-gray-800 font-rubik">
                      Responders
                    </h3>

                    {focusedSlot ? (
                      <button
                        onClick={() => {
                          setFocusedSlot(null);
                          setIsFocusLocked(false);
                        }}
                        className={`${pillBase} bg-sky-50 text-sky-600 hover:bg-sky-100 cursor-pointer`}
                        title="Clear selected time"
                      >
                        <Clock className="w-3 h-3" />
                        {focusedSlot.split("|")[1]}
                        <X className="w-3 h-3 ml-1" />
                      </button>
                    ) : viewingId ? (
                      <button
                        onClick={() => setViewingId(null)}
                        className={`${pillBase} bg-sky-50 text-sky-600 hover:bg-sky-100 cursor-pointer`}
                      >
                        <Users className="w-3 h-3" />
                        View{" "}
                        {toTitleCase(
                          responders.find((p) => p.id === viewingId)?.name || ""
                        )}
                        <X className="w-3 h-3 ml-1" />
                      </button>
                    ) : (
                      <span className={`${pillBase} bg-gray-100 text-gray-500`}>
                        {responders.filter((p) => p.slots.length > 0).length} /{" "}
                        {responders.length}
                      </span>
                    )}
                  </div>

                  {/* SCROLLABLE INNER DIV: Scrollbar is completely inside padding */}
                  <div className="flex-1 overflow-y-auto -mr-2 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
                    <div className="flex flex-col gap-3">
                      {responders.map((responder) => {
                        const isSelected = viewingId === responder.id;
                        const hasResponded = responder.slots.length > 0;
                        const isAvailableNow = focusedSlot
                          ? responder.slots.includes(focusedSlot)
                          : null;
                        
                        const isMe = responder.id === currentUserId;

                        return (
                          <div
                            key={responder.id}
                            onClick={() => handleResponderClick(responder.id)}
                            className={`group p-3 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center gap-3
                                                ${
                                                  isSelected
                                                    ? "bg-sky-50 border-sky-200 shadow-sm"
                                                    : isAvailableNow === true
                                                    ? "bg-green-50/60 border-green-100"
                                                    : isAvailableNow === false
                                                    ? "opacity-60 bg-white border-transparent hover:opacity-100"
                                                    : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-100"
                                                }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-full ${AVATAR_GRADIENT} flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0`}
                            >
                              {responder.initials}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-gray-800 font-rubik text-sm flex items-center gap-2 truncate">
                                {toTitleCase(responder.name)}
                                {isMe && (
                                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 text-[10px] font-bold font-raleway flex items-center justify-center">
                                    Me
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 font-raleway truncate">
                                {responder.role}
                              </div>
                            </div>

                            <div className="shrink-0">
                              {focusedSlot !== null ? (
                                !hasResponded ? (
                                  <span
                                    className={`${pillBase} bg-orange-50 text-orange-500 border border-orange-100`}
                                  >
                                    Pending
                                  </span>
                                ) : isAvailableNow ? (
                                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-green-600 stroke-[3px]" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                    <X className="w-4 h-4 text-gray-400" />
                                  </div>
                                )
                              ) : !hasResponded ? (
                                <span
                                  className={`${pillBase} bg-orange-50 text-orange-500 border border-orange-100`}
                                >
                                  Pending
                                  </span>
                              ) : (
                                <div
                                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                    isSelected
                                      ? "bg-sky-500"
                                      : "bg-gray-200 group-hover:bg-sky-300"
                                  }`}
                                ></div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- MEETING DETAILS MODAL --- */}
            {meetingDetails && (
              <MeetingDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                data={meetingDetails}
                onSave={async (newData: Meeting) => {
                  try {
                    const { updateMeeting } = await import(
                      "../../services/meeting"
                    );
                    const updated = await updateMeeting(newData._id, {
                      title: newData.title,
                      agenda: newData.agenda,
                    });
                    setMeetingDetails(updated);
                    setIsDetailsModalOpen(false);
                  } catch (err) {
                    console.error("Failed to update meeting", err);
                  }
                }}
              />
            )}

            {/* --- DELETE CONFIRMATION MODAL --- */}
            <DeleteConfirmationModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={async () => {
                if (!meetingDetails?._id) return;
                try {
                  const { deleteMeeting } = await import(
                    "../../services/meeting"
                  );
                  await deleteMeeting(meetingDetails._id);
                  setIsDeleteModalOpen(false);
                  router.push("/commeet");
                } catch (err) {
                  console.error("Failed to delete meeting", err);
                }
              }}
              meetingTitle={meetingDetails?.title || ""}
            />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

// --- Sub-Component: Meeting Details Modal ---
interface MeetingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Meeting;
  onSave: (newData: Meeting) => void;
}

const MeetingDetailsModal = ({
  isOpen,
  onClose,
  data,
  onSave,
}: MeetingDetailsModalProps) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    if (isOpen) setFormData(data);
  }, [isOpen, data]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-[100000] w-full max-w-lg bg-white rounded-[2rem] p-8 shadow-2xl border border-white/50 animate-scale-in">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-2xl font-rubik font-bold text-gray-800">
              Edit Meeting
            </h3>
            <p className="text-sm font-raleway text-gray-500 mt-1">
              Update the core details.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full font-rubik bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all text-gray-800 placeholder-gray-400 shadow-sm focus:shadow-md"
              placeholder="e.g. 1st Strategic Meeting"
            />
          </div>

          <div>
            <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
              Departments
            </label>
            <input
              type="text"
              value={formData.departments.join(", ")}
              disabled={true}
              className="w-full font-rubik bg-gray-100 border border-gray-200 rounded-xl px-4 py-3.5 outline-none cursor-not-allowed text-gray-500 shadow-none opacity-80"
              placeholder="Comma separated"
            />
            <p className="text-xs text-gray-400 mt-1.5 font-raleway font-medium ml-1">
              Departments cannot be changed after creation.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
              Agenda
            </label>
            <textarea
              rows={4}
              value={formData.agenda}
              onChange={(e) =>
                setFormData({ ...formData, agenda: e.target.value })
              }
              className="w-full font-rubik bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all text-gray-800 placeholder-gray-400 shadow-sm focus:shadow-md resize-none"
              placeholder="What's this meeting about?"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-200 font-rubik font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-6 py-2.5 bg-sky-500 text-white rounded-xl font-rubik font-semibold shadow-lg shadow-sky-200 hover:bg-sky-600 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// --- Sub-Component: Delete Confirmation Modal ---
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  meetingTitle: string;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  meetingTitle,
}: DeleteModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-[100000] w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl border border-white/50 animate-scale-in">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-500">
            <AlertTriangle className="w-8 h-8 stroke-[1.5px]" />
          </div>

          <h3 className="text-2xl font-rubik font-bold text-gray-800 mb-2">
            Delete Meeting?
          </h3>
          <p className="text-gray-500 font-raleway leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-bold text-gray-800">"{meetingTitle}"</span>?
            This action cannot be undone and all availability data will be lost.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-8 mt-2">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-gray-200 font-rubik font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer w-full"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-red-500 text-white rounded-xl font-rubik font-semibold shadow-lg shadow-red-200 hover:bg-red-600 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2 w-full"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AvailabilityPage;