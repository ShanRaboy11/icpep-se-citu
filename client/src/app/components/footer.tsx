"use client";
import React from "react";
import Image from "next/image";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      // Kept reduced height to minimize empty space
      className="relative w-full h-[520px] md:h-[380px]"
      style={{ clipPath: "inset(0 0 0 0)" }}
    >
      {/* 
        === ROUNDED BOTTOM CORNER MASK ===
      */}
      <div className="absolute -top-[1px] left-0 w-full h-10 bg-white rounded-b-[40px] z-10 pointer-events-none"></div>

      {/* 
        === FIXED FOOTER CONTENT ===
      */}
      <div className="fixed bottom-0 left-0 right-0 h-[520px] md:h-[380px] w-full -z-10 bg-[#00609c] text-white overflow-hidden flex flex-col justify-between font-raleway">
        {/* 
           Middle Section Wrapper 
        */}
        <div className="max-w-7xl mx-auto w-full px-6 flex-grow flex flex-col justify-start pt-16 md:pt-20 gap-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-0">
            {/* Left Logo + Info */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Image
                src="/icpep logo.png"
                alt="ICPEP Logo"
                width={100}
                height={100}
                className="cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={scrollToTop}
              />

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
                {/* Top Row: Vector Letters + Region 7 Text */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center sm:justify-start">
                  {/* Vector Letters (Height 50px) */}
                  <div
                    className="flex items-end gap-0.5 cursor-pointer h-[50px]"
                    onClick={scrollToTop}
                  >
                    <Image
                      src="/Vector-ifooter.svg"
                      alt="I"
                      width={0}
                      height={50}
                      className="h-full w-auto"
                    />
                    <Image
                      src="/Vector-cfooter.svg"
                      alt="C"
                      width={0}
                      height={50}
                      className="h-full w-auto"
                    />
                    <Image
                      src="/Vector-p1footer.svg"
                      alt="P"
                      width={0}
                      height={50}
                      className="h-full w-auto"
                    />
                    <Image
                      src="/Vector-e1footer.svg"
                      alt="E"
                      width={0}
                      height={50}
                      className="h-full w-auto"
                    />
                    <Image
                      src="/Vector-p2footer.svg"
                      alt="P"
                      width={0}
                      height={50}
                      className="h-full w-auto"
                    />

                    {/* 
                      Dot Placement:
                      Left adjusted (ml-[-5px]), Flush bottom.
                    */}
                    <Image
                      src="/Vector-dotfooter.svg"
                      alt="."
                      width={0}
                      height={16}
                      className="h-[30%] w-auto ml-[-5px] mr-[1px]"
                    />

                    <Image
                      src="/Vector-sfooter.svg"
                      alt="S"
                      width={0}
                      height={50}
                      className="h-full w-auto"
                    />
                    <Image
                      src="/Vector-e2footer.svg"
                      alt="E"
                      width={0}
                      height={50}
                      className="h-full w-auto"
                    />
                  </div>

                  {/* 
                      Chapter Info
                      Mobile: One line (flex-row). Desktop: Stacked (flex-col).
                  */}
                  <div
                    className="flex flex-row sm:flex-col gap-2 sm:gap-0 items-baseline sm:justify-between h-auto sm:h-[50px] sm:ml-3 font-rubik text-[#002231] cursor-pointer mt-2 sm:mt-0"
                    onClick={scrollToTop}
                  >
                    <span className="text-[20px] sm:text-[23px] font-bold leading-none tracking-wide">
                      Region 7
                    </span>
                    <span className="text-[20px] sm:text-[23px] font-bold leading-none tracking-wide">
                      CIT-U Chapter
                    </span>
                  </div>
                </div>

                {/* Slogan & Copyright */}
                <div>
                  <p className="text-sm text-sky-100 whitespace-normal sm:whitespace-nowrap leading-relaxed max-w-xl">
                    To empower future computer engineers through innovation,
                    collaboration, and leadership.
                  </p>
                  <p className="text-xs text-sky-200 mt-2">
                    © 2025 ICpEP Student Edition R7 CIT-U Chapter. All rights
                    reserved.
                  </p>
                </div>
              </div>
            </div>

            {/* 
              Contact Section 
              Mobile: 'mb-6' 
            */}
            <div className="flex flex-col items-center sm:items-end gap-3 mb-6 sm:mb-0">
              <p className="font-medium text-sky-100 cursor-default">
                Contact Us
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/cituicpep"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex hover:scale-110 transition-transform duration-300"
                >
                  <Image src="/fb.svg" alt="Facebook" width={28} height={28} />
                </a>
                <a
                  href="mailto:icpepse@cit.edu"
                  className="flex hover:scale-110 transition-transform duration-300"
                >
                  <Image src="/email.svg" alt="Email" width={28} height={28} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ====== Bottom Giant Text ====== */}
        <div className="w-full border-t border-white/10 bg-black/5 mt-auto">
          <div
            className="w-full text-center font-medium uppercase text-white/10
                       text-[5vw] md:text-[6vw] leading-none tracking-wider
                       whitespace-nowrap py-4 select-none"
          >
            ICPEP SE CIT-UNIVERSITY
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
