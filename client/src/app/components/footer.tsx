'use client';
import type { NextPage } from 'next';
import Image from 'next/image';

const Footer: NextPage = () => {
  return (
    <footer className="w-full bg-steelblue-200 text-buttonbg1 font-raleway">
      <div className="max-w-7xl mx-auto px-2 py-10 flex flex-col gap-8 pb-5">

        {/* ====== Top Navigation ====== */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/30 pb-4">
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 text-sm font-medium">
            {['Home', 'About', 'Events', 'Membership', 'Developers'].map((item, i) => (
              <div key={item} className="flex items-center">
                {i > 0 && <span className="mx-2">•</span>}
                <span className="cursor-pointer hover:text-white transition">{item}</span>
              </div>
            ))}
          </div>

          {/* Specific Pages Button */}
          <div className="flex items-center">
            <div className="relative flex items-center gap-2 border border-steelblue-100 bg-secondary1 rounded-full px-5 py-2 cursor-pointer">
              <span className="text-sm text-buttonbg1 font-medium">Specific Pages</span>
              <Image
                src="/up arrow.svg"
                alt="up arrow"
                width={24}
                height={24}
                className="opacity-70 hover:opacity-100 transition"
              />
            </div>
          </div>
        </div>

        {/* ====== Middle Section ====== */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 text-gray">
          {/* Left Logo + Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Image
              src="/icpep logo-footer.svg"
              alt="ICPEP Logo"
              width={100}
              height={100}
            />

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
            {/* Top Row: Logo + Chapter Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center sm:justify-start">
                {/* Logo */}
                <div className="flex items-end gap-0.5">
                <Image src="/Vector-ifooter.svg" alt="I" width={0} height={50} className="h-10 w-auto" />
                <Image src="/Vector-cfooter.svg" alt="C" width={0} height={50} className="h-10 w-auto" />
                <Image src="/Vector-p1footer.svg" alt="P" width={0} height={50} className="h-10 w-auto" />
                <Image src="/Vector-e1footer.svg" alt="E" width={0} height={50} className="h-10 w-auto" />
                <Image src="/Vector-p2footer.svg" alt="P" width={0} height={50} className="h-10 w-auto" />
                <Image src="/Vector-dotfooter.svg" alt="." width={0} height={16} className="h-0 w-auto sm:h-3 -ml-1" />
                <Image src="/Vector-sfooter.svg" alt="S" width={0} height={50} className="h-10 w-auto" />
                <Image src="/Vector-e2footer.svg" alt="E" width={0} height={50} className="h-10 w-auto" />
                </div>

                {/* Chapter Info - stacked */}
                <div className="flex flex-col sm:ml-3 font-rubik text-secondary1">
                <span className="text-[16px] sm:text-[22px] font-bold leading-tight">Region 7</span>
                <span className="text-[16px] sm:text-[22px] font-bold leading-tight -mt-1 -mb-2">CIT-U Chapter</span>
                </div>
            </div>

            
            <div>
                {/* Description */}
            <p className="text-sm text-lavender whitespace-normal sm:whitespace-nowrap leading-relaxed max-w-xl ">
                To empower future computer engineers through innovation, collaboration, and leadership.
            </p>

            {/* Copyright */}
            <p className="text-xs text-lavender">
                © 2025 ICpEP Student Edition R7 CIT-U Chapter. All rights reserved.
            </p>
            </div>
            </div>


          </div>

          {/* Contact */}
          <div className="flex flex-col items-center sm:items-end gap-3">
            <p className="font-medium text-lavender cursor-auto">Contact Us</p>
            <div className="flex gap-3">
              <Image
                src="/fb.svg"
                alt="Facebook"
                width={25}
                height={25}
                className="cursor-pointer hover:opacity-80 transition"
              />
              <Image
                src="/email.svg"
                alt="Email"
                width={25}
                height={25}
                className="cursor-pointer hover:opacity-80 transition"
              />
            </div>
          </div>
        </div>

        {/* ====== Bottom Text ====== */}
        
    </div>
    <div
        className="w-full text-center font-medium uppercase text-steelblue-100 
                    text-[30px] sm:text-[103px] leading-none tracking-[0.1em] 
                    whitespace-nowrap py-2">
        ICPEP SE CIT-UNIVERSITY
    </div>
</footer>
  );
};

export default Footer;
