"use client";

export default function EditingBanner({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="-mx-6 sm:-mx-10 lg:-mx-12 -mt-6 sm:-mt-10 lg:-mt-12 mb-8 bg-linear-to-r from-primary1 to-primary3 px-6 sm:px-10 py-5 flex items-center justify-between rounded-t-4xl">
      <div className="flex items-center gap-2 text-white">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="text-sm font-bold font-rubik tracking-wide">EDITING MODE</span>
      </div>
      <button
        onClick={onCancel}
        className="text-white/80 hover:text-white text-sm font-bold font-raleway underline underline-offset-2 transition-colors cursor-pointer"
      >
        Cancel
      </button>
    </div>
  );
}
