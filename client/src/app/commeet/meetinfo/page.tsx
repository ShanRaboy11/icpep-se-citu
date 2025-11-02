"use client";

import Header from "../../components/header"; 
import Footer from "../../components/footer"; 
import { FunctionComponent, useCallback, useState } from "react";
import { useRouter } from 'next/navigation';


const CommeetPage: FunctionComponent = () => {
  const router = useRouter();

  const [meetingName, setMeetingName] = useState("");
  const [meetingTopic, setMeetingTopic] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meetingType, setMeetingType] = useState<"group" | "one-on-one" | null>(null);
  const [limitedTime, setLimitedTime] = useState("");

  // Renamed from onCreateBtnClick to match the new button's onClick
  const onLetsMeetBtnClick = useCallback(() => {
    console.log({
      meetingName,
      meetingTopic,
      startTime,
      endTime,
      meetingType,
      limitedTime,
    });
    // Assuming you still want to navigate to '/commeet/meetinfo' after "Let's meet"
    router.push('/commeet/meetinfo'); 
  }, [meetingName, meetingTopic, startTime, endTime, meetingType, limitedTime, router]);

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
          </div>

          {/* Right Section - Let's Meet Button */}
          <div className="flex-shrink-0 mt-8 lg:mt-32">
            <button
              className="px-6 py-3 border-2 border-gray-900 rounded-full font-manrope text-gray-700 font-semibold flex items-center justify-center space-x-2
                         hover:bg-sky-200 hover:text-white hover:border-sky-400 active:bg-sky-600 active:border-sky-600 active:text-white transition-colors duration-200" 
              onClick={onLetsMeetBtnClick} // Calling the defined function
            >
              <span>Create</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Input Fields and Meeting Type Section - Re-positioned inside a structured div for consistent layout */}
        <div className="relative w-full max-w-[1440px] px-[75px] py-10 flex flex-col gap-10 mt-12"> {/* Added mt-12 for spacing from the previous section */}
          {/* Name your meeting Input */}
          <div className="w-[960px] h-10 text-gray-300">
            <input
              type="text"
              className="w-full h-full border-b-[1px] border-solid border-gray-300 focus:outline-none focus:border-deepskyblue-200 text-black text-[24px] pl-2 pb-1 bg-transparent"
              placeholder="Name your meeting"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
            />
          </div>

          {/* What's your meeting about? */}
          <div className="flex flex-col gap-2">
            <p className="text-[24px] text-gray-900 font-raleway">
                What&apos;s your meeting about?
            </p>
            <div className="w-[960px] h-10 text-gray-300">
              <input
                type="text"
                className="w-full h-full border-b-[1px] border-solid border-gray-300 focus:outline-none focus:border-deepskyblue-200 text-black text-[24px] pl-2 pb-1 bg-transparent"
                placeholder="Topic discussion on commeet"
                value={meetingTopic}
                onChange={(e) => setMeetingTopic(e.target.value)}
              />
            </div>
          </div>

          {/* What times would you like to meet between? */}
          <div className="flex flex-col gap-2">
            <p className="text-[24px] text-gray-900 font-raleway">
              What times would you like to meet between?
            </p>
            <div className="flex items-center space-x-4">
              <input
                type="time"
                className="w-[150px] h-10 border-b-[1px] border-solid border-gray-300 focus:outline-none focus:border-deepskyblue-200 text-black text-[20px] px-2 bg-transparent"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <span className="text-gray-700 text-[20px]">to</span>
              <input
                type="time"
                className="w-[150px] h-10 border-b-[1px] border-solid border-gray-300 focus:outline-none focus:border-deepskyblue-200 text-black text-[20px] px-2 bg-transparent"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              <span className="text-gray-700 text-[20px]">PST</span>
            </div>
          </div>

          {/* What type of meeting? */}
          <div className="flex flex-col gap-2">
            <p className="text-[24px] text-gray-900 font-raleway">
              What type of meeting?
            </p>
            <div className="flex space-x-8">
              {/* Group Meeting Card */}
              <div
                className={`w-[250px] h-[150px] rounded-[10px] border-[2px] border-solid flex flex-col items-center justify-center p-4 cursor-pointer transition-all duration-200
                  ${meetingType === "group" ? "border-deepskyblue-200 bg-deepskyblue-50 shadow-md" : "border-gray-300 bg-white hover:border-deepskyblue-100"}`}
                onClick={() => setMeetingType("group")}
              >
                <div className="text-[24px] font-semibold text-gray-800">Group</div>
                <div className="mt-2 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a4.5 4.5 0 002.343-3.375M12 12.75a3 3 0 100-6 3 3 0 000 6zM12.75 12c-1.233 0-2.25 1.117-2.25 2.5V18.75c0 .621.504 1.125 1.125 1.125h4.5c.621 0 1.125-.504 1.125-1.125V14.5c0-1.383-1.017-2.5-2.25-2.5H12.75zM15 18.72a4.5 4.5 0 002.343-3.375M12 12.75a3 3 0 100-6 3 3 0 000 6zM12.75 12c-1.233 0-2.25 1.117-2.25 2.5V18.75c0 .621.504 1.125 1.125 1.125h4.5c.621 0 1.125-.504 1.125-1.125V14.5c0-1.383-1.017-2.5-2.25-2.5H12.75zM12 3C6.477 3 2 7.477 2 13s4.477 10 10 10 10-4.477 10-10S17.523 3 12 3z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-[14px] text-center mt-2">
                  For meetings with three or more people
                </p>
              </div>

              {/* One on One Meeting Card */}
              <div
                className={`w-[250px] h-[150px] rounded-[10px] border-[2px] border-solid flex flex-col items-center justify-center p-4 cursor-pointer transition-all duration-200
                  ${meetingType === "one-on-one" ? "border-deepskyblue-200 bg-deepskyblue-50 shadow-md" : "border-gray-300 bg-white hover:border-deepskyblue-100"}`}
                onClick={() => setMeetingType("one-on-one")}
              >
                <div className="text-[24px] font-semibold text-gray-800">One on One</div>
                <div className="mt-2 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-[14px] text-center mt-2">
                  For meetings with two people
                </p>
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="flex flex-col gap-2 mb-10">
            <p className="text-[24px] text-gray-900 font-raleway">
              Advanced Options
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 text-[20px]">Limit scheduled meeting time to:</span>
              <input
                type="text"
                className="w-[150px] h-10 border-b-[1px] border-solid border-gray-300 focus:outline-none focus:border-deepskyblue-200 text-black text-[20px] px-2 bg-transparent"
                value={limitedTime}
                onChange={(e) => setLimitedTime(e.target.value)}
                placeholder="e.g., 60 mins"
              />
            </div>
          </div>
        </div>
      </div> 
      <Footer />
    </div>
  );
};

export default CommeetPage;