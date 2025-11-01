"use client";

import { useState } from "react";
import Image from "next/image";

interface FAQ {
  question: string;
  answer: string;
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQ[] = [
    {
      question: "Lorem ipsum dolor sit amet consectetur adipiscing elit?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      question: "Ut enim ad minim veniam, quis nostrud exercitation?",
      answer:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    {
      question: "Excepteur sint occaecat cupidatat non proident?",
      answer: "Sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      question: "Aliquip ex ea commodo consequat?",
      answer:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="light-dark-background absolute inset-0 z-0"></div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <Image
          src="/question.svg"
          alt="question mark"
          width={300}
          height={300}
          className="hidden sm:block absolute top-[10%] left-[-4%] rotate-[-15deg] blur-[6px] opacity-60"
        />
        <Image
          src="/question.svg"
          alt="question mark"
          width={100}
          height={100}
          className="hidden sm:block absolute top-[15%] right-[10%] sm:top-[3%] sm:right-[50%] rotate-[7deg] blur-[7px] opacity-40"
        />
        <Image
          src="/question.svg"
          alt="question mark"
          width={350}
          height={350}
          className="hidden sm:block absolute bottom-[-10%] right-[-1%] rotate-[15deg] blur-[6px] opacity-70"
        />
        <Image
          src="/question.svg"
          alt="question mark"
          width={150}
          height={150}
          className="hidden sm:block absolute bottom-[-5%] left-[30%] rotate-[-30deg] blur-[7px] opacity-50"
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 py-40 pb-56 flex flex-col md:flex-row justify-between items-start w-full">
        {/* Left Content Block */}
        <div className="w-full md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
          <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 mb-4 leading-tight">
            Any questions? <br /> We got you.
          </h1>
          <p className="font-raleway text-bodytext mb-8 text-base md:text-lg max-w-md mx-auto md:mx-0">
            Explore our FAQs or reach out for personalized support—our team is
            here to help you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <button className="bg-primary1 hover:bg-primary2 text-white font-raleway font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer">
              Contact Us
            </button>
            <button className="bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-buttonbg1 hover:border-primary1 hover:text-primary1 font-raleway font-semibold px-8 py-3 rounded-full transition-all duration-300 cursor-pointer">
              More FAQs
            </button>
          </div>
        </div>

        {/* Right Accordion Block */}
        <div className="w-full md:w-1/2 min-h-[340px]">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-300/80 pb-4 cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-rubik text-primary3 text-xl font-semibold">
                    {faq.question}
                  </h3>
                  <span
                    className={`text-2xl font-bold text-primary1 transition-transform duration-300 ease-in-out ${
                      openIndex === index ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    +
                  </span>
                </div>
                <div
                  className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
                    openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="font-raleway text-bodytext text-sm md:text-base leading-relaxed pt-3">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
