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
      answer:
        "The website serves as the official platform for membership registration, announcements, events, and organization updates—making it easier for students to stay informed and connected.",
    },
    {
      question: "How do I register as a member?",
      answer:
        "Registration is only available during the official membership period announced by the organization, so please stay posted for updates. Once open, you can register directly through the Membership page or during designated onsite registration schedules.",
    },
    {
      question: "How do I check my membership status?",
      answer:
        "After registering, you can view your membership status on your profile page. Status updates (Pending, Verified, or Expired) are handled by the officers.",
    },
    {
      question: "Can I still join events even if I’m not a member?",
      answer:
        "Some events are open to all, while others are exclusive to verified ICpEP.SE members. Event details will indicate whether membership is required.",
    },
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

      <main className="flex-grow relative overflow-hidden">
        {/* Background Decoration */}
        <div className="light-dark-background absolute inset-0 z-0"></div>

        <div className="absolute inset-0 z-10 pointer-events-none select-none">
          <Image src="/question.svg" alt="decoration" width={300} height={300} className="hidden lg:block absolute top-[10%] left-[-4%] rotate-[-15deg] blur-[6px] opacity-40" />
          <Image src="/question.svg" alt="decoration" width={350} height={350} className="hidden lg:block absolute bottom-[-10%] right-[-1%] rotate-[15deg] blur-[6px] opacity-50" />
        </div>

        {/* Centered Content Container */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col items-center">
          
          {/* Top Row: Back Button and Search Bar aligned */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-16 w-full">
             <button
                onClick={() => router.back()}
                className="inline-flex w-12 h-12 flex-shrink-0 items-center justify-center rounded-full border border-blue-400 text-blue-500 hover:bg-blue-50 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>

            <div className="flex-grow w-full">
              <div className="relative group shadow-sm rounded-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-slate-700 placeholder-slate-400 px-14 py-4 rounded-full focus:outline-none focus:border-blue-400 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Centered FAQ List */}
          <div className="w-full min-h-[400px]">
            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
                  <p className="text-slate-400 font-medium font-raleway">No matches found for your search.</p>
                </div>
              ) : (
                filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-300/80 pb-4 cursor-pointer"
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="flex justify-between items-center gap-4">
                      <h3 className="font-rubik text-primary3 text-xl md:text-2xl font-semibold leading-snug">
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
                      className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
                        openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="font-raleway text-bodytext text-sm md:text-base lg:text-lg leading-relaxed pt-4">
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