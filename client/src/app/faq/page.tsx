"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import faqService from "../services/faq";
import Image from "next/image";
import { 
  Search, 
  ArrowLeft 
} from 'lucide-react';

// Fixed Interface: id made optional since static data uses index
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
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-grow relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-50 via-white to-blue-50"></div>

        <div className="absolute inset-0 z-10 pointer-events-none select-none">
          <Image src="/question.svg" alt="decoration" width={300} height={300} className="hidden lg:block absolute top-[10%] left-[-4%] rotate-[-15deg] blur-[6px] opacity-20" />
          <Image src="/question.svg" alt="decoration" width={350} height={350} className="hidden lg:block absolute bottom-[-10%] right-[-1%] rotate-[15deg] blur-[6px] opacity-30" />
        </div>

        {/* Unified Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
          <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-16">
            
            {/* Left Column */}
            <div className="w-full lg:w-5/12 text-center md:text-left">
              {/* Back Button */}
              <div className="mb-12 flex justify-center md:justify-start">
                <button
                  onClick={() => router.back()}
                  className="flex h-12 w-12 cursor-pointer items-center justify-center 
                            rounded-full border-2 border-primary1 text-primary1 
                            transition-all duration-300 ease-in-out hover:bg-primary1 hover:text-white"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
              </div>

              <h1 className="font-rubik text-5xl md:text-6xl font-bold text-primary3 mb-6 leading-tight">
                Any questions? <br /> <span className="text-primary1">We got you.</span>
              </h1>
              <p className="font-raleway text-slate-600 mb-8 text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
                Can't find what you're looking for? Search or submit a new question to our support team.
              </p>
              
              <div className="max-w-md mx-auto md:mx-0">
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary1 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border-2 border-gray-100 text-gray-700 placeholder-gray-400 font-semibold px-14 py-4 rounded-full focus:outline-none focus:border-primary1 transition-all duration-300 shadow-sm shadow-blue-50"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: FAQ List */}
            <div className="w-full lg:w-7/12 space-y-2 mt-8 lg:mt-4">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
                  <p className="text-slate-400 font-medium">No matches found for your search.</p>
                </div>
              ) : (
                filteredFaqs.map((faq, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <div
                      key={index}
                      onClick={() => toggleFAQ(index)}
                      className="border-b border-gray-300/80 pb-4 cursor-pointer"
                    >
                      <div className="flex justify-between items-center py-6 gap-4">
                        <h3 className={`font-rubik text-lg md:text-xl font-semibold transition-colors duration-300 ${isOpen ? 'text-primary1' : 'text-primary3'}`}>
                          {faq.question}
                        </h3> 
                        <span
                          className={`text-2xl font-bold text-primary1 transition-transform duration-500 ease-in-out flex-shrink-0 ${
                            isOpen ? "rotate-45" : "rotate-0"
                          }`}
                        >
                          +
                        </span>
                      </div>
                      
                      <div
                        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="font-raleway text-bodytext text-sm md:text-base leading-relaxed pt-3">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div> {/* End Flex Row Container */}
        </div>
      </main>

      <Footer />
    </div>
  );
}