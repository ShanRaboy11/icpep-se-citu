"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/app/components/button";

interface FAQ {
  question: string;
  answer: string;
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
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
    <div
      className="relative flex flex-col md:flex-row justify-between items-start w-full max-w-7xl mx-auto px-6 md:px-12 py-40 mb-40"
      style={{ backgroundColor: "#FEFEFF" }}
    >
      <div className="absolute inset-0 -z-0">
        <Image
          src="/question.svg"
          alt="question mark"
          width={300}
          height={300}
          className="absolute top-[-10%] left-[-5%] rotate-[-20deg] blur-xl opacity-60"
        />
        <Image
          src="/question.svg"
          alt="question mark"
          width={250}
          height={250}
          className="absolute top-[5%] right-[10%] sm:top-[-10%] sm:right-[30%] rotate-[15deg] blur-xl opacity-50"
        />
        <Image
          src="/question.svg"
          alt="question mark"
          width={350}
          height={350}
          className="absolute bottom-[-10%] right-[-15%] rotate-[-15deg] blur-[10px] opacity-80"
        />
        <Image
          src="/question.svg"
          alt="question mark"
          width={200}
          height={200}
          className="absolute bottom-[-30%] left-[30%] rotate-[10deg] blur-[5px] opacity-60"
        />
      </div>

      <div className="w-full md:w-1/2 mb-10 md:mb-0 text-center md:text-left z-5">
        <h2 className="font-rubik text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Any questions? <br /> We got you.
        </h2>
        <p className="font-raleway text-gray-700 mb-6 text-base md:text-lg max-w-md">
          Explore our FAQs or reach out for personalized support—our team is
          here to help you.
        </p>
        <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
          <Button className="bg-primary3 border-primary3 hover:bg-primary2 hover:border-primary2 text-white px-6 py-3 rounded-full">
            Contact Us
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-full"
          >
            More FAQs <span className="text-lg font-bold">+</span>
          </Button>
        </div>
      </div>

      <div className="w-full md:w-1/2 space-y-4 z-5">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-gray-300 pb-4 cursor-pointer transition-all"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-rubik text-gray-900 text-xl font-semibold">
                {faq.question}
              </h3>
              <span className="text-2xl font-bold text-blue-600">
                {openIndex === index ? "−" : "+"}
              </span>
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ${
                openIndex === index
                  ? "max-h-40 mt-3 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <p className="font-raleway text-gray-700 text-sm md:text-base leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
