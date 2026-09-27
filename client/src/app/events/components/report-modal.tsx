"use client";

import { useState, FormEvent } from "react";
import { X, Flag, ChevronDown, Check } from "lucide-react";
import Button from "../../components/button";
import eventService from "../../services/event";

interface ReportEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
}

const REASONS = [
  "Inaccurate or misleading information",
  "Inappropriate content",
  "Spam or scam",
  "Duplicate event",
  "Other",
];

export default function ReportEventModal({
  isOpen,
  onClose,
  eventId,
  eventTitle,
}: ReportEventModalProps) {
  const [reason, setReason] = useState(REASONS[0]);
  const [isReasonOpen, setIsReasonOpen] = useState(false);
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setReason(REASONS[0]);
      setIsReasonOpen(false);
      setDetails("");
      setSubmitted(false);
      setError(null);
    }, 300);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await eventService.reportEvent(eventId, reason, details);
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send your report. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500">
              <Flag className="h-5 w-5" />
            </div>
            <h2 className="font-rubik text-lg font-bold text-primary3">
              Report Event
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="group cursor-pointer rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:rotate-90" />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-10 text-center">
            <p className="font-raleway text-base text-gray-700">
              Thanks for letting us know — your report has been sent to the
              chapter&apos;s team.
            </p>
            <Button variant="hero" onClick={handleClose} className="mt-6">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
            <p className="font-raleway text-sm text-gray-500">
              Tell us what&apos;s wrong with{" "}
              <span className="font-semibold text-gray-700">
                {eventTitle}
              </span>
              . Your report helps keep this space trustworthy.
            </p>

            <div>
              <label className="block font-raleway text-sm font-semibold text-gray-700">
                Reason
              </label>
              <div className="relative mt-2">
                <div
                  onClick={() => setIsReasonOpen((p) => !p)}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-raleway text-gray-800 transition-all hover:bg-gray-100 ${
                    isReasonOpen
                      ? "border-primary1 bg-white ring-4 ring-primary1/10"
                      : ""
                  }`}
                >
                  <span>{reason}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-300 ${
                      isReasonOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {isReasonOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsReasonOpen(false)}
                    />
                    <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                      <div className="flex max-h-56 flex-col gap-1 overflow-y-auto p-2 themed-scrollbar">
                        {REASONS.map((r) => (
                          <div
                            key={r}
                            onClick={() => {
                              setReason(r);
                              setIsReasonOpen(false);
                            }}
                            className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 font-raleway text-sm transition-colors ${
                              reason === r
                                ? "bg-primary1/5 text-primary1"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span>{r}</span>
                            {reason === r && (
                              <Check className="h-4 w-4 text-primary1" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block font-raleway text-sm font-semibold text-gray-700">
                Details <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe the issue..."
                className="mt-2 w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-raleway font-normal text-gray-800 outline-none transition-all placeholder-gray-400 placeholder:font-normal focus:border-primary1 focus:bg-white focus:ring-4 focus:ring-primary1/10"
              />
            </div>

            {error && (
              <p className="font-raleway text-sm text-red-500">{error}</p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="heroOutline"
                onClick={handleClose}
                className="px-5 py-2.5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="hero"
                disabled={isSubmitting}
                className="px-5 py-2.5"
              >
                {isSubmitting ? "Sending..." : "Submit Report"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
