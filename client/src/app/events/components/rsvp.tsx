"use client";

import { useState, useEffect } from "react";
import { Event } from "../utils/event";

interface Props {
  status: Event["status"];
  date: string;
}

const CountdownPill = ({ days, hours }: { days: number; hours: number }) => (
  <div className="bg-green-100 text-green-800 font-raleway font-semibold px-4 py-2 rounded-full text-sm text-center whitespace-nowrap">
    Starting in {days}d {hours}h
  </div>
);

export default function RsvpCard({ status, date }: Props) {
  const [hasRsvpd, setHasRsvpd] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(date) - +new Date();
      let newTimeLeft = { days: 0, hours: 0 };
      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        };
      }
      return newTimeLeft;
    };

    setTimeLeft(calculateTimeLeft()); // Initial calculation
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000); // Update every minute

    return () => clearInterval(timer);
  }, [date]);

  if (status === "Ended") {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg text-center">
        <h2 className="font-rubik font-bold text-2xl text-primary3">
          Registration Closed
        </h2>
        <p className="font-raleway text-bodytext mt-2">
          This event has ended. Stay tuned for the next one!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg transition-all duration-300">
      {hasRsvpd ? (
        <div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src="https://i.pravatar.cc/150?img=32"
                alt="User"
                className="w-14 h-14 rounded-full border-2 border-green-500 p-0.5"
              />
              <div>
                <h2 className="font-rubik font-bold text-2xl text-green-700 leading-none">
                  You&apos;re In!
                </h2>
              </div>
            </div>
            <CountdownPill days={timeLeft.days} hours={timeLeft.hours} />
          </div>
          <p className="font-raleway text-sm text-gray-500 mt-6 text-center border-t border-gray-100 pt-4">
            No longer able to attend?{" "}
            <button
              onClick={() => setHasRsvpd(false)}
              className="text-primary1 font-medium underline hover:text-primary2 transition-colors cursor-pointer"
            >
              Cancel your registration
            </button>
            .
          </p>
        </div>
      ) : (
        <div className="text-center">
          <p className="font-raleway text-lg text-bodytext mb-6">
            Welcome! To join the event, please register below.
          </p>
          <button
            onClick={() => setHasRsvpd(true)}
            className="w-full bg-primary1 hover:bg-primary2 text-white font-raleway font-bold py-4 rounded-xl transition-all text-xl shadow-lg hover:shadow-primary1/40 transform hover:-translate-y-0.5 cursor-pointer"
          >
            RSVP Now
          </button>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm font-raleway text-gray-600">
            {/* This part can be made dynamic later */}
            <span className="font-bold text-primary3">105</span> people have
            already registered
          </div>
        </div>
      )}
    </div>
  );
}
