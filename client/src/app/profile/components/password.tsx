"use client";
import { Lock } from "lucide-react";
import Button from "@/app/components/button";

export default function SecuritySection() {
  return (
    <div className="w-full border border-primary1 rounded-lg p-5 px-7 sm:px-10 sm:py-8 bg-white shadow-sm">
      <h2 className="text-xl sm:text-2xl font-rubik text-black font-semibold mb-4 border-b border-primary1 pb-2 sm:mr-5">
        Security
      </h2>

      <div className="flex flex-row justify-between items-center text-sm md:text-base">
        <div className="flex items-center gap-3 whitespace-nowrap text-black font-raleway text-lg ">
          <span>Password</span>
        </div>

        <span className="text-s text-gray-400 hidden sm:inline">
          Last changed 1 month ago
        </span>

        <Button
          variant="primary2"
          className="flex items-center gap-2 whitespace-nowrap sm:mr-10"
        >
          Update
        </Button>
      </div>
    </div>
  );
}
