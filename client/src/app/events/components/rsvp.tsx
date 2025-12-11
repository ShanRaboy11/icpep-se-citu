// components/rsvp-card.tsx
"use client";

import { useState, useEffect } from "react";

interface Props {
  status?: "Upcoming" | "Ongoing" | "Ended";
  date: string;
  rsvpLink?: string; // Optional external RSVP link
}

const CountdownPill = ({ days, hours }: { days: number; hours: number }) => (
  <div className="bg-green-100 text-green-800 font-raleway font-semibold px-4 py-2 rounded-full text-sm text-center whitespace-nowrap">
    Starting in {days}d {hours}h
  </div>
);

export default function RsvpCard({ status, date, rsvpLink }: Props) {
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

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000);

    return () => clearInterval(timer);
  }, [date]);

  const handleRsvp = () => {
    if (rsvpLink) {
      window.open(rsvpLink, '_blank', 'noopener,noreferrer');
    } else {
      setHasRsvpd(true);
    }
  };

  if (status === "Ended") {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg text-center">
        <h2 className="font-rubik font-bold text-xl sm:text-2xl text-primary3">
          Registration Closed
        </h2>
        <p className="font-raleway text-bodytext mt-2 text-sm sm:text-base">
          This event has ended. Stay tuned for the next one!
        </p>
      </div>
    );
  }

  if (status === "Ongoing") {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg text-center">
        <div className="bg-blue-100 text-blue-800 font-raleway font-semibold px-4 py-2 rounded-full text-sm inline-flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Event in Progress
        </div>
        <h2 className="font-rubik font-bold text-xl sm:text-2xl text-primary3">
          This event is currently happening!
        </h2>
        <p className="font-raleway text-bodytext mt-2 text-sm sm:text-base">
          Registration may still be available at the venue.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg transition-all duration-300">
      {hasRsvpd && !rsvpLink ? (
        <div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src="https://i.pravatar.cc/150?img=32"
                alt="User"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-green-500 p-0.5"
              />
              <div>
                <h2 className="font-rubik font-bold text-xl sm:text-2xl text-green-700 leading-none">
                  You&apos;re In!
                </h2>
              </div>
            </div>
            {timeLeft.days > 0 || timeLeft.hours > 0 ? (
              <CountdownPill days={timeLeft.days} hours={timeLeft.hours} />
            ) : null}
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
          <p className="font-raleway text-base sm:text-lg text-bodytext mb-6">
            Welcome! To join the event, please <br className="sm:hidden" />
            register below.
          </p>
          <button
            onClick={handleRsvp}
            className="w-full bg-primary1 hover:bg-primary2 text-white font-raleway font-bold py-4 rounded-xl transition-all text-lg sm:text-xl shadow-lg hover:shadow-primary1/40 transform hover:-translate-y-0.5 cursor-pointer"
          >
            {rsvpLink ? "RSVP Now" : "RSVP Now"}
          </button>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm font-raleway text-gray-600">
            <div className="flex -space-x-2">
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                src="https://i.pravatar.cc/100?img=1"
                alt="User 1"
              />
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                src="https://i.pravatar.cc/100?img=2"
                alt="User 2"
              />
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                src="https://i.pravatar.cc/100?img=3"
                alt="User 3"
              />
            </div>
            <p>
              <span className="font-bold text-primary3">105</span> people have
              already registered
            </p>
          </div>
        </div>
      )}
    </div>
  );
}