"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Plus, 
  X, 
  Send, 
  Search, 
  ArrowLeft 
} from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const router = useRouter(); 

  // 2. Static Data
  const [faqs] = useState<FAQ[]>([
    {
      id: 1,
      question: "Lorem ipsum dolor sit amet consectetur adipiscing elit?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      id: 2,
      question: "Ut enim ad minim veniam, quis nostrud exercitation?",
      answer: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    },
    {
      id: 3,
      question: "Excepteur sint occaecat cupidatat non proident?",
      answer: "Sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
      id: 4,
      question: "Aliquip ex ea commodo consequat?",
      answer: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const openModal = () => {
    setNewQuestion('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewQuestion('');
  };

  const handleSubmit = () => {
    if (!newQuestion.trim()) {
      alert('Please type a question');
      return;
    }
    alert("Thank you! Your question has been submitted for review.");
    closeModal();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <section className="relative overflow-hidden min-h-screen bg-slate-50 font-sans">
          {/* Background Decoration */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-50 via-white to-blue-50"></div>

          <div className="absolute inset-0 z-10 pointer-events-none select-none">
            <Image src="/question.svg" alt="decoration" width={300} height={300} className="hidden sm:block absolute top-[10%] left-[-4%] rotate-[-15deg] blur-[6px] opacity-60" />
            <Image src="/question.svg" alt="decoration" width={100} height={100} className="hidden sm:block absolute top-[15%] right-[10%] sm:top-[3%] sm:right-[50%] rotate-[7deg] blur-[7px] opacity-40" />
            <Image src="/question.svg" alt="decoration" width={350} height={350} className="hidden sm:block absolute bottom-[-10%] right-[-1%] rotate-[15deg] blur-[6px] opacity-70" />
            <Image src="/question.svg" alt="decoration" width={150} height={150} className="hidden sm:block absolute bottom-[-5%] left-[30%] rotate-[-30deg] blur-[7px] opacity-50" />
          </div>

          <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-40 flex flex-col md:flex-row justify-between items-start w-full gap-12">
            
            {/* Left Column */}
            <div className="w-full md:w-5/12 mb-10 md:mb-0 text-center md:text-left sticky top-10">
              
              {/* Back Button - Increased margin-bottom to mb-12 */}
              <div className="mb-12 flex justify-start">
                <button
                  onClick={() => router.back()}
                  title="Go Back"
                  className="relative flex h-10 w-10 md:h-12 md:w-12 cursor-pointer items-center justify-center 
                            rounded-full border-2 border-primary1 text-primary1 
                            overflow-hidden transition-all duration-300 ease-in-out 
                            active:scale-95 hover:bg-primary1/5"
                >
                  <ArrowLeft className="h-5 w-5 md:h-6 md:w-6 animate-nudge-left" />
                </button>
              </div>

              <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 mb-4 leading-tight">
                Any questions? <br /> We got you.
              </h1>
              <p className="text-slate-600 mb-8 text-base md:text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
                Can't find what you're looking for? Search or submit a new question to our support team.
              </p>
              
              <div className="flex flex-col gap-4 max-w-md mx-auto md:mx-0">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border-2 border-gray-200 text-gray-700 placeholder-gray-400 font-semibold px-12 py-3 rounded-full focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all duration-300 shadow-sm"
                  />
                </div>

                <button 
                  onClick={openModal}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  <Plus size={20} />
                  <span>Ask a Question</span>
                </button>
              </div>
            </div>

            {/* Right Accordion Block */}
            <div className="w-full md:w-1/2 min-h-[340px] md:mt-24">
              <div className="space-y-4">
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-3xl bg-white/50">
                      <p className="font-raleway text-bodytext font-medium">No questions found.</p>
                  </div>
                ) : (
                  filteredFaqs.map((faq) => {
                    const isOpen = expandedId === faq.id;
                    
                    return (
                      <div
                        key={faq.id}
                        className="border-b border-gray-300/80 pb-4 cursor-pointer"
                        onClick={() => toggleFAQ(faq.id)}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-rubik text-primary3 text-xl font-semibold">
                            {faq.question}
                          </h3>
                          <span
                            className={`text-2xl font-bold text-primary1 transition-transform duration-300 ease-in-out ${
                              isOpen ? "rotate-45" : "rotate-0"
                            }`}
                          >
                            +
                          </span>
                        </div>
                        <div
                          className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
                            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
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
            </div>
          </div>
        </section>
      </main>

      {/* Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-slideUp flex flex-col">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center shrink-0">
              <h2 className="text-2xl font-bold">
                Ask a Question
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                <p className="text-slate-600 text-sm">
                  Can't find the answer you're looking for? Submit your question below and our team will get back to you or update the FAQs.
                </p>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                    Your Question
                  </label>
                  <textarea
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-slate-800 resize-none"
                    rows={4}
                    placeholder="Type your question here..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-slate-600 rounded-xl hover:bg-gray-50 transition-colors font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-600/20"
                >
                  <Send size={18} />
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}