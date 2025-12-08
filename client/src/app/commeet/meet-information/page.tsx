"use client";

import Header from "../../components/header";
import Footer from "../../components/footer";
import Grid from "../../components/grid";
import { FunctionComponent, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, X, ChevronDown, ArrowLeft } from "lucide-react";

const departmentsList = [
  "All Officers",
  "Executive Council",
  "Committee on Internal Affairs",
  "Committee on External Affairs",
  "Committee on Finance",
  "Committee on Public Relations",
  "Research and Development Committee",
  "Training and Seminar Committee",
  "Sports and Cultural Committee",
  "Media and Documentation Committee",
];

const hours = Array.from({ length: 12 }, (_, i) =>
  (i + 1).toString().padStart(2, "0")
);
const minutes = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0")
);
const periods = ["AM", "PM"];

const MeetInfoPage: FunctionComponent = () => {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [agenda, setAgenda] = useState("");

  // Custom Time State
  const [startHour, setStartHour] = useState("09");
  const [startMinute, setStartMinute] = useState("00");
  const [startPeriod, setStartPeriod] = useState("AM");

  const [endHour, setEndHour] = useState("10");
  const [endMinute, setEndMinute] = useState("00");
  const [endPeriod, setEndPeriod] = useState("AM");

  // Dept & Limit State
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [limitValue, setLimitValue] = useState("");
  const [limitUnit, setLimitUnit] = useState("Minutes");

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authHint, setAuthHint] = useState<string>("");

  // Department Logic
  const toggleDept = (dept: string) => {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
    if (errors.department) setErrors({ ...errors, department: "" });
  };

  const removeDept = (dept: string) => {
    setSelectedDepts((prev) => prev.filter((d) => d !== dept));
  };

  // Submit Logic
  const onCreateMeetingClick = useCallback(async () => {
    const newErrors: Record<string, string> = {};
    if (!title) newErrors.title = "Meeting title is required";
    if (!agenda) newErrors.agenda = "Agenda is required";
    if (selectedDepts.length === 0)
      newErrors.department = "Select at least one department";

    if (limitValue && parseInt(limitValue) <= 0) {
      newErrors.timeLimit = "Invalid time";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formattedStartTime = `${startHour}:${startMinute} ${startPeriod}`;
    const formattedEndTime = `${endHour}:${endMinute} ${endPeriod}`;
    const formattedLimit = limitValue
      ? `${limitValue} ${limitUnit}`
      : "No Limit";

    try {
      const payload = {
        title,
        agenda,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        timeLimit: formattedLimit,
        departments: selectedDepts,
        // selectedDates should come from the previous step (commeet/page)
        // For now, read from query if present, else default to today's date
      } as any;
      const params = new URLSearchParams(window.location.search);
      const datesParam = params.get("dates");
      const selectedDates = datesParam
        ? datesParam.split(",")
        : [new Date().toISOString().split("T")[0]];
      payload.selectedDates = selectedDates;

      const { createMeeting } = await import("../../services/meeting");
      const created = await createMeeting(payload);
      router.push(`/commeet/schedule?meetingId=${created._id}`);
    } catch (err: any) {
      console.error(err);
      // Show login hint if unauthorized
      setAuthHint("Login required to create a meeting.");
      setErrors({ ...newErrors, submit: "Failed to create meeting" });
    }
  }, [
    title,
    agenda,
    startHour,
    startMinute,
    startPeriod,
    endHour,
    endMinute,
    endPeriod,
    selectedDepts,
    limitValue,
    limitUnit,
    router,
  ]);

  // --- Shared Styles ---
  const labelStyle =
    "block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1";

  const inputBaseStyle =
    "w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all placeholder-gray-400";
  const inputFocusStyle =
    "focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10";
  const errorStyle = "border-red-300 ring-2 ring-red-100";

  const dropdownContainerStyle =
    "absolute z-30 w-full min-w-[5rem] mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden flex flex-col gap-1 p-2 max-h-56 overflow-y-auto";
  const dropdownItemStyle =
    "flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors font-rubik text-sm font-medium";
  const dropdownItemSelectedStyle = "bg-primary1/5 text-primary1";
  const dropdownItemHoverStyle = "hover:bg-gray-50 text-gray-700";

  // --- Helper to Render Input + Dropdown ---
  const renderTimeInput = (
    id: string,
    value: string,
    setValue: (v: string) => void,
    options: string[],
    type: "hour" | "minute" | "period"
  ) => {
    const isOpen = activeDropdown === id;

    // 1. Logic for typing directly over value
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;

      if (type === "period") {
        // Instant replace logic for AM/PM
        if (val.toLowerCase().includes("p")) {
          setValue("PM");
          setTimeout(() => e.target.select(), 0);
        } else if (val.toLowerCase().includes("a")) {
          setValue("AM");
          setTimeout(() => e.target.select(), 0);
        }
      } else {
        // Numeric Logic
        if (val !== "" && !/^\d*$/.test(val)) return;

        // Strict 2 digit limit
        if (val.length > 2) return;

        const num = parseInt(val);
        if (val !== "") {
          // Logic limits
          if (type === "minute" && num > 59) return;
          if (type === "hour" && num > 12) return;
        }
        setValue(val);
      }
    };

    // 2. Handle Focus (Initial Open + Select All)
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (activeDropdown !== id) setActiveDropdown(id);
      e.target.select();
    };

    // 3. Handle Click (Toggle + Force Selection)
    const handleMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
      if (document.activeElement === e.currentTarget) {
        if (activeDropdown === id) {
          setActiveDropdown(null);
        } else {
          setActiveDropdown(id);
        }
        e.preventDefault();
        e.currentTarget.select();
      }
    };

    // 4. Handle Blur (Close & Format)
    const handleBlur = () => {
      setTimeout(() => {
        if (activeDropdown === id) setActiveDropdown(null);
      }, 200);

      if (type === "hour") {
        let num = parseInt(value || "0");
        if (num < 1) num = 1;
        if (num > 12) num = 12;
        setValue(num.toString().padStart(2, "0"));
      } else if (type === "minute") {
        let num = parseInt(value || "0");
        if (num < 0) num = 0;
        if (num > 59) num = 59;
        setValue(num.toString().padStart(2, "0"));
      } else if (type === "period") {
        if (value !== "AM" && value !== "PM") setValue("AM");
      }
    };

    return (
      <div className="relative flex-1 h-full group">
        <input
          type="text"
          className="w-full h-full text-center bg-transparent outline-none font-rubik text-base text-gray-700 font-medium placeholder-gray-300 transition-colors cursor-pointer caret-transparent focus:text-primary1 selection:bg-transparent selection:text-primary1"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onMouseDown={handleMouseDown}
          onBlur={handleBlur}
          maxLength={2}
          autoComplete="off"
        />

        {isOpen && (
          <>
            <div
              className={`${dropdownContainerStyle} left-1/2 -translate-x-1/2 text-center`}
              onMouseDown={(e) => e.preventDefault()}
            >
              {options.map((opt) => (
                <div
                  key={opt}
                  className={`justify-center ${dropdownItemStyle} ${
                    value === opt
                      ? dropdownItemSelectedStyle
                      : dropdownItemHoverStyle
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setValue(opt);
                    setActiveDropdown(null);
                  }}
                >
                  <span>{opt}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Grid />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        {/* Updated Width to max-w-7xl to match reference page layout */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-24">
          {/* Back Button - Now aligned far left relative to the wider container */}
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

          {/* Centered Content Container for Form */}
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
                <div className="h-2 w-2 rounded-full bg-primary1"></div>
                <span className="font-raleway text-sm font-semibold text-primary1">
                  New Meeting
                </span>
              </div>
              <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
                Meeting Details
              </h1>
              <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                Set up the agenda, participants, and schedule for your upcoming
                session.
              </p>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-[2rem] border border-gray-200 shadow-lg p-8 sm:p-12 transition-all duration-300 hover:shadow-primary1/40 hover:-translate-y-2">
              {authHint && (
                <div className="mb-4 p-3 rounded-xl bg-yellow-50 text-yellow-700 text-sm font-raleway border border-yellow-100">
                  {authHint}
                </div>
              )}
              <div className="flex flex-col gap-6">
                {/* Title */}
                <div className="w-full">
                  <label className={labelStyle}>
                    Meeting Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`${inputBaseStyle} ${
                      errors.title ? errorStyle : ""
                    } ${inputFocusStyle}`}
                    placeholder="e.g. 1st Strategic Meeting"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title) setErrors({ ...errors, title: "" });
                    }}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1 ml-2 font-raleway">
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Agenda */}
                <div className="w-full">
                  <label className={labelStyle}>
                    Agenda <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className={`${inputBaseStyle} resize-none ${
                      errors.agenda ? errorStyle : ""
                    } ${inputFocusStyle}`}
                    placeholder="What will be discussed?"
                    value={agenda}
                    onChange={(e) => {
                      setAgenda(e.target.value);
                      if (errors.agenda) setErrors({ ...errors, agenda: "" });
                    }}
                  />
                  {errors.agenda && (
                    <p className="text-red-500 text-xs mt-1 ml-2 font-raleway">
                      {errors.agenda}
                    </p>
                  )}
                </div>

                {/* Time Frame (Start & End) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Start Time Selector */}
                  <div>
                    <label className={labelStyle}>
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <div
                      className={`flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 transition-all ${
                        ["startHour", "startMinute", "startPeriod"].includes(
                          activeDropdown || ""
                        )
                          ? "bg-white border-primary1 ring-4 ring-primary1/10"
                          : ""
                      }`}
                    >
                      {renderTimeInput(
                        "startHour",
                        startHour,
                        setStartHour,
                        hours,
                        "hour"
                      )}
                      <span className="text-gray-400 font-bold">:</span>
                      {renderTimeInput(
                        "startMinute",
                        startMinute,
                        setStartMinute,
                        minutes,
                        "minute"
                      )}
                      <div className="w-[1px] h-6 bg-gray-200 mx-2"></div>
                      {renderTimeInput(
                        "startPeriod",
                        startPeriod,
                        setStartPeriod,
                        periods,
                        "period"
                      )}
                    </div>
                  </div>

                  {/* End Time Selector */}
                  <div>
                    <label className={labelStyle}>
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <div
                      className={`flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 transition-all ${
                        ["endHour", "endMinute", "endPeriod"].includes(
                          activeDropdown || ""
                        )
                          ? "bg-white border-primary1 ring-4 ring-primary1/10"
                          : ""
                      }`}
                    >
                      {renderTimeInput(
                        "endHour",
                        endHour,
                        setEndHour,
                        hours,
                        "hour"
                      )}
                      <span className="text-gray-400 font-bold">:</span>
                      {renderTimeInput(
                        "endMinute",
                        endMinute,
                        setEndMinute,
                        minutes,
                        "minute"
                      )}
                      <div className="w-[1px] h-6 bg-gray-200 mx-2"></div>
                      {renderTimeInput(
                        "endPeriod",
                        endPeriod,
                        setEndPeriod,
                        periods,
                        "period"
                      )}
                    </div>
                  </div>
                </div>

                {/* Department Selection (Multi-Select) */}
                <div className="w-full relative">
                  <label className={labelStyle}>
                    Departments Involved <span className="text-red-500">*</span>
                  </label>

                  <div
                    className={`w-full min-h-[3rem] bg-gray-50 border rounded-2xl px-4 py-3 cursor-pointer relative transition-all hover:bg-gray-100 ${
                      errors.department ? errorStyle : "border-gray-200"
                    } ${
                      activeDropdown === "dept"
                        ? "bg-white border-primary1 ring-4 ring-primary1/10"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === "dept" ? null : "dept"
                      )
                    }
                  >
                    <div className="flex flex-wrap gap-2 pr-8">
                      {selectedDepts.length > 0 ? (
                        selectedDepts.map((dept) => (
                          <span
                            key={dept}
                            className="inline-flex items-center gap-1 bg-white border border-gray-200 text-primary3 px-3 py-1.5 rounded-full text-xs font-bold font-rubik shadow-sm"
                          >
                            {dept}
                            <X
                              className="w-3.5 h-3.5 cursor-pointer text-gray-400 hover:text-red-500 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeDept(dept);
                              }}
                            />
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 font-rubik text-base">
                          Select departments...
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`absolute right-4 top-3.5 w-5 h-5 text-gray-400 transition-transform duration-300 ${
                        activeDropdown === "dept" ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Dropdown Menu */}
                  {activeDropdown === "dept" && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setActiveDropdown(null)}
                      ></div>
                      <div className={dropdownContainerStyle}>
                        {departmentsList.map((dept) => (
                          <div
                            key={dept}
                            className={`${dropdownItemStyle} px-4 ${
                              selectedDepts.includes(dept)
                                ? dropdownItemSelectedStyle
                                : dropdownItemHoverStyle
                            }`}
                            onClick={() => toggleDept(dept)}
                          >
                            <span>{dept}</span>
                            {selectedDepts.includes(dept) && (
                              <Check className="w-4 h-4 text-primary1" />
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {errors.department && (
                    <p className="text-red-500 text-xs mt-1 ml-2 font-raleway">
                      {errors.department}
                    </p>
                  )}
                </div>

                {/* Time Limit (Value + Unit) */}
                <div className="w-full">
                  <label className={labelStyle}>
                    Time Limit{" "}
                    <span className="text-gray-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <div className="flex gap-4">
                    {/* Value Input */}
                    <div className="flex-1">
                      <input
                        type="number"
                        min="1"
                        className={`${inputBaseStyle} ${inputFocusStyle}`}
                        placeholder="e.g. 45"
                        value={limitValue}
                        onChange={(e) => setLimitValue(e.target.value)}
                      />
                    </div>
                    {/* Unit Dropdown (Custom) */}
                    <div className="w-1/3 relative">
                      <div
                        className={`w-full h-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 cursor-pointer flex items-center justify-between text-gray-700 transition-all hover:bg-gray-100 ${
                          activeDropdown === "limitUnit"
                            ? "bg-white border-primary1 ring-4 ring-primary1/10"
                            : ""
                        }`}
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === "limitUnit" ? null : "limitUnit"
                          )
                        }
                      >
                        <span className="font-rubik text-base font-medium">
                          {limitUnit}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                            activeDropdown === "limitUnit" ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {/* Options */}
                      {activeDropdown === "limitUnit" && (
                        <>
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setActiveDropdown(null)}
                          ></div>
                          <div className={dropdownContainerStyle}>
                            {["Minutes", "Hours"].map((unit) => (
                              <div
                                key={unit}
                                className={`${dropdownItemStyle} px-4 ${
                                  limitUnit === unit
                                    ? dropdownItemSelectedStyle
                                    : dropdownItemHoverStyle
                                }`}
                                onClick={() => {
                                  setLimitUnit(unit);
                                  setActiveDropdown(null);
                                }}
                              >
                                <span>{unit}</span>
                                {limitUnit === unit && (
                                  <Check className="w-4 h-4 text-primary1" />
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {errors.timeLimit && (
                    <p className="text-red-500 text-xs mt-1 ml-2 font-raleway">
                      {errors.timeLimit}
                    </p>
                  )}
                </div>

                {/* Action Button */}
                <div className="mt-4 flex justify-end">
                  <button
                    className="group relative px-8 py-3.5 bg-gradient-to-r from-primary3 to-primary1 rounded-2xl font-rubik font-bold text-white shadow-lg shadow-primary1/20 hover:shadow-primary1/40 transition-all duration-300 flex items-center gap-3 cursor-pointer"
                    onClick={onCreateMeetingClick}
                  >
                    <span>Create Meeting</span>
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

export default MeetInfoPage;
