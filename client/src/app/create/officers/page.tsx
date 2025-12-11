"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  Image as ImageIcon,
  ChevronDown,
  Pencil,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

// --- IMPORTS ---
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "@/app/components/grid";
import Sidebar from "@/app/components/sidebar";
import OfficerCard from "@/app/officers/components/officer-card";

// --- LOCAL DATA DEFINITION ---
// UPDATED: Both departments now use the EXACT same color scheme (Primary1 -> Primary2)
// This matches the Sponsors and Merch page styling.
const departments: Record<string, any> = {
  executive: {
    id: "executive",
    title: "Executive Council",
    description: "Leading the chapter with vision and integrity.",
    gradient: "bg-gradient-to-r from-primary1 to-primary2", // Unified
    shadow: "shadow-primary1/20",
    officers: [],
  },
  committee: {
    id: "committee",
    title: "Committee Officers",
    description: "The dedicated hands behind our events and initiatives.",
    gradient: "bg-gradient-to-r from-primary1 to-primary2", // Unified
    shadow: "shadow-primary1/20",
    officers: [],
  },
};

// --- CONSTANTS ---
const EXECUTIVE_POSITIONS = [
  "President",
  "VP Internal",
  "VP External",
  "Secretary",
  "Treasurer",
  "Auditor",
  "PIO",
  "PRO",
  "SSG Representative",
  "Batch Representative",
];

const COMMITTEES_LIST = [
  "Committee on Internal Affairs",
  "Committee on External Affairs",
  "Committee on Finance",
  "Committee on Public Relations",
  "Research and Development Committee",
  "Training and Seminar Committee",
  "Sports and Cultural Committee",
  "Media and Documentation Committee",
];

// Define the Officer type
type Officer = {
  id: string;
  name: string;
  role: string;
  position: string;
  image: string;
  departmentId: string; // Added to track which list they belong to
};

export default function OfficersPage() {
  // --- STATE ---
  // Default to executive tab
  const [activeTab, setActiveTab] = useState<string>("executive");
  const [officers, setOfficers] = useState<Officer[]>([]); // Flat list for all officers
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    position: "",
    image: "", // Start empty to show upload placeholder
  });

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Derived state for current view
  const currentDeptData = departments[activeTab];
  const displayedOfficers = officers.filter(
    (o) => o.departmentId === activeTab
  );

  // --- HANDLERS ---

  const handleEditClick = (officer: Officer) => {
    setEditingId(officer.id);
    setActiveTab(officer.departmentId); // Switch tab to where the officer is
    setFormData({
      name: officer.name,
      role: officer.role,
      position: officer.position,
      image: "", // We keep the URL in preview
    });
    setPreview(officer.image);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: "",
      role: "",
      position: "",
      image: "",
    });
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this officer?")) {
      setOfficers((prev) => prev.filter((o) => o.id !== id));
      if (editingId === id) handleCancelEdit();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Logic: If Executive and NOT Batch Rep, clear the Role (Year Level)
    let finalRole = formData.role;
    if (
      activeTab === "executive" &&
      formData.position !== "Batch Representative"
    ) {
      finalRole = "";
    }

    // Use default image if none provided
    const finalImage = preview || "/faculty.png";

    if (editingId) {
      // Update existing
      setOfficers((prev) =>
        prev.map((o) =>
          o.id === editingId
            ? {
                ...o,
                name: formData.name,
                position: formData.position,
                role: finalRole,
                image: finalImage,
                departmentId: activeTab,
              }
            : o
        )
      );
    } else {
      // Create new
      const newOfficer: Officer = {
        id: Math.random().toString(36).substring(7),
        name: formData.name,
        position: formData.position,
        role: finalRole,
        image: finalImage,
        departmentId: activeTab,
      };
      setOfficers((prev) => [...prev, newOfficer]);
    }

    handleCancelEdit();
  };

  // --- RENDER ---

  return (
    <section className="min-h-screen bg-white flex flex-col relative">
      <Grid />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-16">
          {/* Page Header */}
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary1/10 to-primary2/10 rounded-3xl blur-3xl -z-10" />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-6xl font-bold font-rubik bg-gradient-to-r from-primary3 via-primary1 to-primary2 bg-clip-text text-transparent mb-3">
                {editingId ? "Edit Officer" : "Manage Officers"}
              </h1>
              <p className="text-gray-600 font-raleway text-lg">
                {editingId
                  ? "Update officer details below"
                  : "Add and organize the chapter leadership team"}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="sticky top-24">
                <Sidebar />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-12">
              {/* 1. THE FORM (Compose/Edit) */}
              <div
                className={`bg-white rounded-3xl shadow-xl shadow-gray-200/50 border overflow-hidden transition-all duration-300 ${
                  editingId
                    ? "border-primary1 shadow-primary1/20"
                    : "border-gray-100"
                }`}
              >
                {/* Edit Mode Banner */}
                {editingId && (
                  <div className="bg-amber-50 border-b border-amber-100 px-8 py-5 flex items-center justify-between">
                    <span className="text-amber-800 font-medium font-rubik text-sm flex items-center gap-2">
                      <Pencil size={14} /> Editing Mode Active
                    </span>
                    <button
                      onClick={handleCancelEdit}
                      className="text-sm font-bold text-amber-900 underline"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Form Header */}
                <div className={`p-8 ${currentDeptData.gradient}`}>
                  <h2 className="text-3xl font-bold text-white font-rubik flex items-center gap-3">
                    {editingId ? "Edit Details" : "Compose Officer"}
                  </h2>
                  <p className="text-white/90 font-raleway mt-2">
                    {currentDeptData.description}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                  {/* Department Tabs - UPDATED STYLE to match Sponsors */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-primary3 font-raleway">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.keys(departments).map((key) => {
                        const dept = departments[key];
                        const isActive = activeTab === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setActiveTab(key)}
                            className={`
                              relative rounded-xl px-6 py-4 text-left font-rubik font-semibold border-2 transition-all duration-300
                              ${
                                isActive
                                  ? `bg-primary2 text-white border-primary2 shadow-lg` // Solid color active state
                                  : "bg-white text-gray-600 border-gray-200 hover:border-primary2/50" // Outline inactive state
                              }
                            `}
                          >
                            <div className="flex flex-col">
                              <span
                                className={
                                  isActive ? "text-white" : "text-gray-800"
                                }
                              >
                                {dept.title}
                              </span>
                              <span
                                className={`text-xs font-raleway font-normal mt-1 ${
                                  isActive ? "text-white/80" : "text-gray-400"
                                }`}
                              >
                                {key === "executive"
                                  ? "Elected Positions"
                                  : "Committee Heads"}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-primary3 font-raleway">
                      Officer Photo
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />

                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => fileInputRef.current?.click()}
                      className="block cursor-pointer group"
                    >
                      {preview ? (
                        <div className="relative w-40 h-40 overflow-hidden rounded-2xl mx-auto sm:mx-0">
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover bg-gray-50 border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                          />
                          <button
                            type="button"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              setPreview(null);
                            }}
                            className="absolute top-2 right-2 bg-white w-8 h-8 flex items-center justify-center rounded-full text-red-500 shadow-md hover:bg-red-50"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center transition-all duration-300 bg-gray-50/50 group-hover:border-primary2 group-hover:bg-primary2/5 w-full sm:w-2/3">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary2/10 flex items-center justify-center text-primary2">
                              <ImageIcon size={20} />
                            </div>
                            <div>
                              <p className="text-gray-700 font-semibold font-rubik text-sm">
                                Click to upload photo
                              </p>
                              <p className="text-xs text-gray-500 mt-1 font-raleway">
                                Square ratio recommended
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6 grid grid-cols-1 gap-6">
                    {/* FULL NAME */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-primary3 font-raleway">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="e.g. Dela Cruz, Juan"
                        className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary2 focus:ring-2 focus:ring-primary2/20 outline-none transition-all font-rubik"
                      />
                    </div>

                    {/* --- CONDITIONAL FIELDS BASED ON ACTIVE TAB --- */}
                    {activeTab === "executive" ? (
                      <>
                        {/* EXECUTIVE: POSITION DROPDOWN */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-primary3 font-raleway">
                            Position <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              required
                              value={formData.position}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  position: e.target.value,
                                })
                              }
                              className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary2 focus:ring-2 focus:ring-primary2/20 outline-none transition-all font-rubik appearance-none cursor-pointer"
                            >
                              <option value="" disabled>
                                Select Position
                              </option>
                              {EXECUTIVE_POSITIONS.map((pos) => (
                                <option key={pos} value={pos}>
                                  {pos}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </div>

                        {/* EXECUTIVE: ROLE INPUT (ONLY FOR BATCH REP) */}
                        {formData.position === "Batch Representative" && (
                          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            <label className="text-sm font-semibold text-primary3 font-raleway">
                              Year Level <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.role}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  role: e.target.value,
                                })
                              }
                              placeholder="e.g. 2nd Year"
                              className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary2 focus:ring-2 focus:ring-primary2/20 outline-none transition-all font-rubik"
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {/* COMMITTEE: ROLE DROPDOWN (COMMITTEE NAME) */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-primary3 font-raleway">
                            Committee Name{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              required
                              value={formData.role}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  role: e.target.value,
                                })
                              }
                              className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary2 focus:ring-2 focus:ring-primary2/20 outline-none transition-all font-rubik appearance-none cursor-pointer"
                            >
                              <option value="" disabled>
                                Select Committee
                              </option>
                              {COMMITTEES_LIST.map((comm) => (
                                <option key={comm} value={comm}>
                                  {comm}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </div>

                        {/* COMMITTEE: POSITION INPUT (TEXT) */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-primary3 font-raleway">
                            Specific Title{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.position}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                position: e.target.value,
                              })
                            }
                            placeholder="e.g. Committee Chairperson"
                            className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary2 focus:ring-2 focus:ring-primary2/20 outline-none transition-all font-rubik"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                    {editingId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-6 py-3 rounded-xl border border-red-200 text-red-500 font-bold hover:bg-red-50 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className={`px-8 py-3 rounded-xl text-white font-bold shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95 flex items-center gap-2 ${currentDeptData.gradient}`}
                    >
                      <Save className="h-5 w-5" />
                      {editingId ? "Update Officer" : "Add Officer"}
                    </button>
                  </div>
                </form>
              </div>

              {/* 2. THE LIST (Manage) */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                {/* List Header */}
                <div className="p-8 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-primary3 font-rubik">
                      {currentDeptData.title} List
                    </h2>
                    <p className="text-gray-500 font-raleway text-sm mt-1">
                      Viewing {displayedOfficers.length} members in this
                      department
                    </p>
                  </div>
                </div>

                {/* Grid Content */}
                <div className="p-8">
                  {displayedOfficers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                      <p className="font-raleway text-gray-500 mb-2">
                        No officers in this department yet.
                      </p>
                      <p className="text-sm text-gray-400">
                        Fill out the form above to add one.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
                      {displayedOfficers.map((officer) => (
                        <div
                          key={officer.id}
                          className="group relative w-full max-w-[280px]"
                        >
                          {/* Floating Action Buttons */}
                          <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={() => handleEditClick(officer)}
                              className="p-2 bg-white rounded-full shadow-md text-blue-600 hover:text-blue-700 hover:bg-gray-50 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(officer.id)}
                              className="p-2 bg-white rounded-full shadow-md text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Officer Card */}
                          <div
                            className={`transform transition-transform duration-300 hover:scale-[1.02] ${
                              editingId === officer.id
                                ? "ring-4 ring-primary1/50 rounded-[30px]"
                                : ""
                            }`}
                          >
                            <OfficerCard
                              position={officer.position}
                              role={officer.role}
                              name={officer.name}
                              image={officer.image}
                              gradient={currentDeptData.gradient}
                              shadow={currentDeptData.shadow}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </section>
  );
}
