"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import faqService from "../services/faq";
import Image from "next/image";
import { Search, ArrowLeft } from 'lucide-react';

interface FAQ {
  id?: number; 
  question: string;
  answer: string;
}

export default function FAQPage() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState("");

  const staticFaqs: FAQ[] = [
    {
      question: "What is the ICpEP.SE CIT-U website for?",
      answer: "The website serves as the official platform for membership registration, announcements, events, and organization updates—making it easier for students to stay informed and connected.",
    },
    {
      question: "How do I register as a member?",
      answer: "Registration is only available during the official membership period announced by the organization, so please stay posted for updates. Once open, you can register directly through the Membership page or during designated onsite registration schedules.",
    },
    {
      question: "How do I check my membership status?",
      answer: "After registering, you can view your membership status on your profile page. Status updates (Pending, Verified, or Expired) are handled by the officers.",
    },
    {
      question: "Can I still join events even if I’m not a member?",
      answer: "Some events are open to all, while others are exclusive to verified ICpEP.SE members. Event details will indicate whether membership is required.",
    },
    {
      question: "Is there a fee for registration?",
      answer: "Membership fees are determined by the Council Officers. Please check the latest announcements for current rates.",
    },
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking 'Forgot Password' on the login screen and the reset form will be sent to your email given.",
    },
    // Repeated items to ensure the right side is long enough to demonstrate scrolling
    { question: "How do I contact support?", answer: "You can reach out to us via the contact form, email, or the ICpEP.SE Facebook Page ." },
    { question: "Can I edit my profile?", answer: "Yes, you can edit your personal information through the account settings." },
    { question: "What are the membership benefits?", answer: "Members get exclusive access to seminars, workshops, and networking events." },
  ];

  const [faqs, setFaqs] = useState<FAQ[]>(staticFaqs);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await faqService.getFAQs();
        if (response.data && response.data.length > 0) {
          setFaqs(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      }
    };
    fetchFAQs();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* Removed overflow-hidden from main to allow sticky behavior to work */}
      <main className="flex-grow relative">
        {/* Background Decoration */}
        <div className="light-dark-background absolute inset-0 z-0 pointer-events-none"></div>

        <div className="absolute inset-0 z-10 pointer-events-none select-none overflow-hidden">
          <Image src="/question.svg" alt="decoration" width={300} height={300} className="hidden lg:block absolute top-[10%] left-[-4%] rotate-[-15deg] blur-[6px] opacity-40" />
          <Image src="/question.svg" alt="decoration" width={350} height={350} className="hidden lg:block absolute bottom-[-10%] right-[-1%] rotate-[15deg] blur-[6px] opacity-50" />
        </div>

        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-40 flex flex-col md:flex-row justify-between items-start w-full gap-12 lg:gap-24">
          
          {/* LEFT COLUMN: Static/Sticky */}
          {/* md:sticky top-32 makes it stay put. h-fit is required for sticky to work in flex containers */}
          <div className="w-full md:w-1/2 md:sticky md:top-32 h-fit flex flex-col text-center md:text-left">
            <div className="flex justify-center md:justify-start mb-12">
              <button
                onClick={() => router.back()}
                className="relative flex h-10 w-10 md:h-12 md:w-12 cursor-pointer items-center justify-center 
                          rounded-full border-2 border-primary1 text-primary1 
                          transition-all duration-300 ease-in-out active:scale-95 hover:bg-primary1/5"
              >
                <ArrowLeft className="h-5 w-5 md:h-6 md:w-6 animate-nudge-left" />
              </button>
            </div>

            <h1 className="font-rubik text-5xl md:text-6xl font-bold text-primary3 mb-6 leading-[1.1] tracking-tight">
              Any questions? <br /> We got you.
            </h1>
            <p className="font-raleway text-slate-600 mb-10 text-base md:text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
              Can't find what you're looking for? Search or browse <br className="hidden md:block" /> our frequently asked questions below.
            </p>
            
            <div className="max-w-md mx-auto md:mx-0 w-full">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border-2 border-gray-100 text-gray-700 placeholder-gray-400 px-14 py-4 md:py-5 rounded-full focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all duration-300 shadow-lg shadow-blue-900/5"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Scrollable (Standard Flow) */}
          <div className="w-full md:w-1/2">
            <div className="space-y-6">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
                  <p className="text-slate-400 font-medium font-raleway">No matches found.</p>
                </div>
              ) : (
                filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-300/80 pb-6 cursor-pointer group"
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="flex justify-between items-center gap-4">
                      <h3 className={`font-rubik text-xl md:text-2xl font-bold transition-colors duration-300 ${openIndex === index ? 'text-primary1' : 'text-primary3'}`}>
                        {faq.question}
                      </h3>
                      <span
                        className={`text-2xl font-bold text-primary1 transition-transform duration-300 ease-in-out flex-shrink-0 ${
                          openIndex === index ? "rotate-45" : "rotate-0"
                        }`}
                      >
                        +
                      </span>
                    </div>
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
                        openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="font-raleway text-slate-500 text-base md:text-lg leading-relaxed pt-4 pr-6">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}