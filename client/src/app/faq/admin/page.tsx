"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, X, Save, Search, Edit2, Trash2, MessageCircle, Check } from 'lucide-react';

// 1. Interfaces
interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface PendingQuestion {
  id: number;
  question: string;
  date: string; // Added date for context
}

export default function FAQAdminPage() {
  // 2. State Management

  // A. Active/Published FAQs
  const [faqs, setFaqs] = useState<FAQ[]>([
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
  ]);

  // B. New "Pending" Questions (Submitted by users)
  const [pendingQuestions, setPendingQuestions] = useState<PendingQuestion[]>([
    { id: 101, question: "Do you offer international shipping?", date: "2 mins ago" },
    { id: 102, question: "How do I reset my password if I lost my email?", date: "1 hour ago" }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State to track if we are editing an existing one, or resolving a pending one
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [resolvingPendingId, setResolvingPendingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({ question: '', answer: '' });

  // Filter Logic
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- HANDLERS ---

  const toggleFAQ = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Open Modal: Standard Add or Edit
  const openModal = (faq: FAQ | null = null) => {
    setResolvingPendingId(null); // Ensure we aren't in "resolving" mode
    if (faq) {
      setEditingFaq(faq);
      setFormData({ question: faq.question, answer: faq.answer });
    } else {
      setEditingFaq(null);
      setFormData({ question: '', answer: '' });
    }
    setIsModalOpen(true);
  };

  // Open Modal: Respond to a Pending Question
  const handleRespondToPending = (pending: PendingQuestion) => {
    setEditingFaq(null); // We are creating a new entry, not editing an existing ID
    setResolvingPendingId(pending.id); // Track which pending item we are fixing
    setFormData({ question: pending.question, answer: '' }); // Pre-fill question, empty answer
    setIsModalOpen(true);
  };

  // Reject/Delete a Pending Question
  const handleRejectPending = (id: number) => {
    if(window.confirm("Reject and delete this user question?")) {
      setPendingQuestions(pendingQuestions.filter(q => q.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
    setResolvingPendingId(null);
    setFormData({ question: '', answer: '' });
  };

  // Unified Submit Logic
  const handleSubmit = () => {
    if (!formData.question || !formData.answer) {
      alert('Please fill in the answer before publishing.');
      return;
    }

    if (editingFaq) {
      // Scenario A: Editing an existing published FAQ
      setFaqs(faqs.map(faq => 
        faq.id === editingFaq.id 
          ? { ...faq, question: formData.question, answer: formData.answer }
          : faq
      ));
    } else {
      // Scenario B: Creating a new FAQ (Either from scratch OR from Pending)
      const newFaq: FAQ = {
        id: faqs.length > 0 ? Math.max(...faqs.map(f => f.id)) + 1 : 1,
        question: formData.question,
        answer: formData.answer
      };
      
      // Add to main list
      setFaqs([...faqs, newFaq]);

      // If this came from the Pending list, remove it from there now
      if (resolvingPendingId) {
        setPendingQuestions(pendingQuestions.filter(q => q.id !== resolvingPendingId));
      }
    }
    closeModal();
  };

  const deleteFaq = (id: number) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(faqs.filter(faq => faq.id !== id));
      if (expandedId === id) {
        setExpandedId(null);
      }
    }
  };

  return (
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
        
        {/* --- LEFT COLUMN: Header & Controls --- */}
        <div className="w-full md:w-5/12 mb-10 md:mb-0 text-center md:text-left sticky top-10">
          <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 mb-4 leading-tight">
            FAQ Admin <br /> Dashboard
          </h1>
          <p className="text-slate-600 mb-8 text-base md:text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
            Review incoming questions from users, answer them, and manage your published knowledge base.
          </p>
          
          <div className="flex flex-col gap-4 max-w-md mx-auto md:mx-0">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search published FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 placeholder-gray-400 font-semibold px-12 py-3 rounded-full focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all duration-300 shadow-sm"
              />
            </div>

            <button 
              onClick={() => openModal()}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              <Plus size={20} />
              <span>Create Manual FAQ</span>
            </button>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Lists --- */}
        <div className="w-full md:w-6/12 min-h-[340px] space-y-8">
          
          {/* 1. NEW SECTION: Pending Questions Queue */}
          {pendingQuestions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-orange-200 overflow-hidden">
              <div className="bg-orange-50 px-6 py-3 border-b border-orange-100 flex items-center justify-between">
                <h3 className="font-rubik text-orange-800 font-semibold flex items-center gap-2">
                  <MessageCircle size={18} />
                  Pending Review ({pendingQuestions.length})
                </h3>
              </div>
              <div className="divide-y divide-orange-100">
                {pendingQuestions.map((pq) => (
                  <div key={pq.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-rubik text-slate-800 font-medium text-sm mb-1">
                        {pq.question}
                      </p>
                      <span className="text-xs text-slate-400 font-medium">Submitted {pq.date}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleRespondToPending(pq)}
                        className="flex items-center gap-1 text-xs font-bold bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Check size={14} />
                        Answer
                      </button>
                      <button
                        onClick={() => handleRejectPending(pq.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Reject Question"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. EXISTING SECTION: Published FAQ List */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
              Published Questions
            </h3>
            
            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                 <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-3xl bg-white/50">
                    <p className="font-raleway text-bodytext font-medium">No published questions found.</p>
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

                          {/* Edit/Delete Actions */}
                          <div className="flex gap-3 mt-4 mb-2">
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 openModal(faq);
                               }}
                               className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-bodytext hover:text-primary1 transition-colors px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg"
                             >
                               <Edit2 size={14} />
                               Edit
                             </button>
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 deleteFaq(faq.id);
                               }}
                               className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-bodytext hover:text-red-600 transition-colors px-3 py-1.5 bg-gray-100 hover:bg-red-50 rounded-lg"
                             >
                               <Trash2 size={14} />
                               Delete
                             </button>
                           </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Unified for New, Edit, and Respond */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slideUp flex flex-col">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center shrink-0">
              <h2 className="text-2xl font-bold">
                {resolvingPendingId 
                  ? 'Respond to User Question' 
                  : editingFaq 
                    ? 'Edit FAQ' 
                    : 'Add New FAQ'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                    Question
                  </label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-slate-800"
                    placeholder="Type the question..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                    Answer
                  </label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none font-medium text-slate-600 leading-relaxed"
                    rows={6}
                    placeholder="Write your official response here..."
                    autoFocus={!!resolvingPendingId} // Autofocus answer field if responding
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 border-2 border-gray-200 text-slate-600 rounded-xl hover:bg-gray-50 transition-colors font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-600/20"
                >
                  <Save size={18} />
                  {resolvingPendingId ? 'Publish Response' : 'Save FAQ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}