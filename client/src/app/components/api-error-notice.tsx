"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { API_ERROR_EVENT } from "../utils/api-error";

// Shown when a request fails because the server can't be reached or errors
// out, so pages that don't handle the failure themselves aren't left silent.
export default function ApiErrorNotice() {
  const [message, setMessage] = useState<string | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const onError = (event: Event) => {
      setMessage((event as CustomEvent<string>).detail);
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setMessage(null), 6000);
    };
    window.addEventListener(API_ERROR_EVENT, onError);
    return () => {
      window.removeEventListener(API_ERROR_EVENT, onError);
      clearTimeout(hideTimer.current);
    };
  }, []);

  if (!message) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-6 left-1/2 z-100000 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border border-red-100 bg-white px-4 py-3 shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
      <p className="flex-1 font-raleway text-sm font-medium text-gray-700">
        {message}
      </p>
      <button
        onClick={() => setMessage(null)}
        aria-label="Dismiss"
        className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
