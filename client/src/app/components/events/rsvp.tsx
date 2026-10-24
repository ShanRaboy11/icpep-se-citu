"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/button";
import eventService from "@/app/services/event";
import { errorMessage } from "@/app/services/api-client";

interface Props {
  eventId: string;
  status?: "Upcoming" | "Ongoing" | "Ended";
  date: string;
  rsvpLink?: string;
  rsvpCount?: number;
}

const CountdownPill = ({ days, hours }: { days: number; hours: number }) => (
  <div className="bg-green-100 text-green-800 font-raleway font-semibold px-4 py-2 rounded-full text-sm text-center whitespace-nowrap">
    Starting in {days}d {hours}h
  </div>
);

const CARD = "bg-linear-to-br from-buttonbg1 to-white border border-primary1/20 rounded-3xl p-6 sm:p-8 shadow-md";

const AVATARS = ["/placeholders/woman.avif", "/placeholders/man.avif", "/placeholders/woman.avif"];

const countLabel = (count: number) =>
  count === 0
    ? "Be the first to register"
    : `${count} ${count === 1 ? "person has" : "people have"} registered`;

export default function RsvpCard({ eventId, status, date, rsvpLink, rsvpCount = 0 }: Props) {
  const router = useRouter();
  const [rsvped, setRsvped] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [count, setCount] = useState(rsvpCount);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0 });

  useEffect(() => setCount(rsvpCount), [rsvpCount]);

  useEffect(() => {
    const hasToken = Boolean(localStorage.getItem("authToken"));
    setLoggedIn(hasToken);
    if (rsvpLink || !hasToken) return;
    eventService
      .getMyRsvp(eventId)
      .then((mine) => {
        setRsvped(mine.rsvped);
        setCount(mine.count);
      })
      .catch(() => undefined);
  }, [eventId, rsvpLink]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(date) - +new Date();
      if (difference <= 0) return { days: 0, hours: 0 };
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000);
    return () => clearInterval(timer);
  }, [date]);

  const handleRsvp = async () => {
    if (rsvpLink) {
      window.open(rsvpLink, "_blank", "noopener,noreferrer");
      return;
    }
    if (!loggedIn) {
      router.push("/login");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const result = rsvped ? await eventService.cancelRsvp(eventId) : await eventService.rsvp(eventId);
      setRsvped(result.rsvped);
      setCount(result.count);
    } catch (err) {
      setError(errorMessage(err, "Could not update your registration."));
    } finally {
      setBusy(false);
    }
  };

  if (status === "Ended") {
    return (
      <div className={`${CARD} text-center`}>
        <h2 className="font-rubik font-bold text-xl sm:text-2xl text-primary3">Registration Closed</h2>
        <p className="font-raleway text-bodytext mt-2 text-sm sm:text-base">
          This event has ended. Stay tuned for the next one!
        </p>
      </div>
    );
  }

  if (status === "Ongoing") {
    return (
      <div className={`${CARD} text-center`}>
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

  const hasCountdown = timeLeft.days > 0 || timeLeft.hours > 0;

  return (
    <div className={CARD}>
      {rsvped ? (
        <div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="font-rubik font-bold text-xl sm:text-2xl text-green-700 leading-none">You&apos;re In!</h2>
            {hasCountdown && <CountdownPill days={timeLeft.days} hours={timeLeft.hours} />}
          </div>
          <p className="font-raleway text-sm text-gray-500 mt-6 text-center border-t border-gray-100 pt-4">
            No longer able to attend?{" "}
            <button
              onClick={handleRsvp}
              disabled={busy}
              className="text-primary1 font-medium underline hover:text-primary2 transition-colors cursor-pointer disabled:opacity-50"
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
          <Button variant="hero" rounded="lg" onClick={handleRsvp} disabled={busy} className="w-full py-3 text-lg">
            {rsvpLink || loggedIn ? "RSVP Now" : "Log in to RSVP"}
          </Button>
          {(!rsvpLink || count > 0) && (
            <div className="mt-4 flex items-center justify-center gap-2 font-raleway text-sm text-gray-600">
              {count > 0 && (
                <div className="flex -space-x-2">
                  {AVATARS.slice(0, count).map((src, i) => (
                    <Image
                      key={i}
                      src={src}
                      alt=""
                      width={24}
                      height={24}
                      className="inline-block h-6 w-6 rounded-full bg-white object-cover ring-2 ring-white"
                    />
                  ))}
                </div>
              )}
              <span className="font-bold text-primary3">{countLabel(count)}</span>
            </div>
          )}
        </div>
      )}
      {error && <p className="mt-3 text-center font-raleway text-xs font-bold text-red-500">{error}</p>}
    </div>
  );
}
