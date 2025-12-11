"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Save,
  Image as ImageIcon,
  ChevronDown,
  Pencil,
  AlertCircle,
  Search,
  X,
} from "lucide-react";

// --- IMPORTS ---
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "@/app/components/grid";
import Sidebar from "@/app/components/sidebar";
import OfficerCard from "@/app/officers/components/officer-card";
import officerService, { Officer as IOfficer } from "@/app/services/officer";

// --- DATA CONFIGURATION ---
const departments: Record<string, any> = {
  executive: {
    id: "executive",
    title: "Executive Council",
    description: "Leading the chapter with vision and integrity.",
    gradient: "bg-gradient-to-r from-primary1 to-primary2",
    shadow: "shadow-primary1/20",
  },
  committee: {
    id: "committee",
    title: "Committee Officers",
    description: "The dedicated hands behind our events and initiatives.",
    gradient: "bg-gradient-to-r from-primary1 to-primary2",
    shadow: "shadow-primary1/20",
  },
};

// --- POSITIONS & DROPDOWN DATA ---

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

const YEAR_LEVELS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

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

const COMMITTEE_ROLES = [
  "Committee Head",
  "Assistant Head",
  "Secretary",
  "Member",
];

// Define the Officer type for UI state
type Officer = {
  id: string;
  name: string;
  role: string; // Used for Year Level (Exec) or Committee Name (Comm)
  position: string; // Used for Position Title
  image: string;
  departmentId: string;
  studentNumber?: string;
};

export default function OfficersPage() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<string>("executive");
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Search State
  const [searchResults, setSearchResults] = useState<IOfficer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<IOfficer | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "", // Used as Year Level for Batch Reps, or Committee Name
    position: "", // Actual Position Title
    image: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Derived state
  const currentDeptData = departments[activeTab];
  const displayedOfficers = officers.filter(
    (o) => o.departmentId === activeTab
  );

  // --- FETCH DATA ---
  const fetchOfficers = async () => {
    try {
      const data = await officerService.getOfficers();
      const mapped: Officer[] = data.map((o) => {
        let role = "";
        if (o.role === "council-officer") {
          if (o.position === "Batch Representative" && o.yearLevel) {
            role = `${o.yearLevel}${
              o.yearLevel === 1
                ? "st"
                : o.yearLevel === 2
                ? "nd"
                : o.yearLevel === 3
                ? "rd"
                : "th"
            } Year`;
          }
        } else {
          role = o.department || "";
        }

        return {
          id: o._id,
          name: `${o.firstName} ${o.lastName}`,
          role: role,
          position: o.position || "",
          image: o.profilePicture || "/faculty.png",
          departmentId:
            o.role === "council-officer" ? "executive" : "committee",
          studentNumber: o.studentNumber,
        };
      });
      setOfficers(mapped);
    } catch (err) {
      console.error("Failed to fetch officers:", err);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  // --- HANDLERS ---

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setIsSearching(true);
      try {
        const results = await officerService.searchNonOfficers(query);
        setSearchResults(results);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const selectUser = (user: IOfficer) => {
    setSelectedUser(user);
    setFormData((prev) => ({
      ...prev,
      name: `${user.firstName} ${user.lastName}`,
    }));
    setPreview(user.profilePicture || "/faculty.png");
    setSearchResults([]);
    setSearchQuery("");
  };

  const clearSelection = () => {
    setSelectedUser(null);
    setFormData((prev) => ({ ...prev, name: "" }));
    setPreview(null);
  };

  const handleEditClick = (officer: Officer) => {
    setError(null);
    setEditingId(officer.id);
    setActiveTab(officer.departmentId);
    setFormData({
      name: officer.name,
      role: officer.role,
      position: officer.position,
      image: "",
    });
    setPreview(officer.image);
    setSelectedUser(null); // Clear selected user when editing existing
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setError(null);
    setFormData({ name: "", role: "", position: "", image: "" });
    setPreview(null);
    setSelectedUser(null);
    setSearchQuery("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this officer?")) {
      try {
        // Demote to student
        await officerService.updateOfficer(id, {
          role: "student",
          position: "",
          department: "",
          yearLevel: undefined,
        } as any);
        fetchOfficers();
        if (editingId === id) handleCancelEdit();
      } catch (err) {
        console.error("Failed to remove officer:", err);
        setError("Failed to remove officer.");
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview
      setPreview(URL.createObjectURL(file));

      // Convert to Base64 for upload
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- VALIDATION LOGIC ---
  const validateLimits = (
    dept: string,
    pos: string,
    role: string,
    currentId: string | null
  ): boolean => {
    // Filter out the officer being edited so they don't count against themselves
    const existing = officers.filter((o) => o.id !== currentId);

    if (dept === "executive") {
      if (pos === "Batch Representative") {
        // Limit: 2 per specific Year Level
        const count = existing.filter(
          (o) => o.position === pos && o.role === role
        ).length;
        if (count >= 2) {
          setError(`Max 2 Batch Representatives allowed for ${role}.`);
          return false;
        }
      } else if (pos === "SSG Representative") {
        // Limit: 2 Total
        const count = existing.filter((o) => o.position === pos).length;
        if (count >= 2) {
          setError("Max 2 SSG Representatives allowed.");
          return false;
        }
      } else {
        // Limit: 1 for all other positions
        const count = existing.filter((o) => o.position === pos).length;
        if (count >= 1) {
          setError(`The position of ${pos} is already filled.`);
          return false;
        }
      }
    } else if (dept === "committee") {
      // Role = Committee Name
      // Position = Role inside committee (Head, Member, etc)
      const committeeMembers = existing.filter(
        (o) => o.departmentId === "committee" && o.role === role
      );

      // Unique positions per committee (except Member)
      if (["Committee Head", "Assistant Head", "Secretary"].includes(pos)) {
        if (committeeMembers.some((o) => o.position === pos)) {
          setError(`'${role}' already has a ${pos}.`);
          return false;
        }
      }
      // "Member" has no limit
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Prepare Data
    let finalRole = formData.role;

    // Logic: If Executive and NOT Batch Rep, clear the Role (Year Level)
    if (
      activeTab === "executive" &&
      formData.position !== "Batch Representative"
    ) {
      finalRole = "";
    }

    // 2. Validate Limits
    const targetId = editingId || selectedUser?._id;
    const isValid = validateLimits(
      activeTab,
      formData.position,
      finalRole,
      targetId || null
    );
    if (!isValid) return;

    if (!targetId) {
      setError("Please select a user to assign.");
      return;
    }

    // 3. Update Backend
    try {
      const updateData: any = {
        role:
          activeTab === "executive" ? "council-officer" : "committee-officer",
        position: formData.position,
        department: activeTab === "committee" ? formData.role : undefined, // Committee Name
        yearLevel:
          activeTab === "executive" &&
          formData.position === "Batch Representative"
            ? parseInt(formData.role) // "1st Year" -> 1
            : undefined,
      };

      // Include image if it was changed (it will be a base64 string)
      if (formData.image && formData.image.startsWith("data:image")) {
        updateData.profilePicture = formData.image;
      }

      await officerService.updateOfficer(targetId, updateData as any);
      fetchOfficers();
      handleCancelEdit();
    } catch (err) {
      console.error("Failed to save officer:", err);
      setError("Failed to save officer.");
    }
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
              {/* 1. THE FORM */}
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
                  {/* Department Tabs */}
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
                            onClick={() => {
                              setActiveTab(key);
                              setError(null);
                              // Reset fields to avoid data contamination
                              setFormData((prev) => ({
                                ...prev,
                                role: "",
                                position: "",
                              }));
                              setSelectedUser(null);
                              setSearchQuery("");
                            }}
                            className={`
                              relative rounded-xl px-6 py-4 text-left font-rubik font-semibold border-2 transition-all duration-300
                              ${
                                isActive
                                  ? `bg-primary2 text-white border-primary2 shadow-lg`
                                  : "bg-white text-gray-600 border-gray-200 hover:border-primary2/50"
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

                  {/* Error Alert */}
                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-100 animate-in fade-in slide-in-from-top-1">
                      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold font-rubik">
                          Action Required
                        </p>
                        <p className="text-sm font-raleway">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Image Upload / Preview */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-primary3 font-raleway">
                      Officer Photo
                    </label>

                    {/* Hidden input if we were to support upload */}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />

                    <div className="block group">
                      {preview ? (
                        <div
                          className="relative w-40 h-40 overflow-hidden rounded-2xl mx-auto sm:mx-0 cursor-pointer group-hover:opacity-90 transition-opacity"
                          onClick={() => fileInputRef.current?.click()}
                          title="Click to change photo"
                        >
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover bg-gray-50 border-4 border-white shadow-lg"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Pencil className="text-white h-6 w-6" />
                          </div>
                          {/* Only allow clearing if it's a new selection, not editing existing */}
                          {!editingId && (
                            <button
                              type="button"
                              onClick={(ev) => {
                                ev.stopPropagation();
                                clearSelection();
                              }}
                              className="absolute top-2 right-2 bg-white w-8 h-8 flex items-center justify-center rounded-full text-red-500 shadow-md hover:bg-red-50 z-10"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ) : (
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50/50 w-full sm:w-2/3 cursor-pointer hover:border-primary2 hover:bg-primary2/5 transition-all"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary2/10 flex items-center justify-center text-primary2">
                              <ImageIcon size={20} />
                            </div>
                            <div>
                              <p className="text-gray-700 font-semibold font-rubik text-sm">
                                {selectedUser
                                  ? "Upload photo"
                                  : "No photo available"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 font-raleway">
                                {selectedUser
                                  ? "Click to upload a new photo"
                                  : "Select a user to see their profile picture"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6 grid grid-cols-1 gap-6">
                    {/* FULL NAME / SEARCH */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-primary3 font-raleway">
                        Full Name <span className="text-red-500">*</span>
                      </label>

                      {editingId ? (
                        // Read-only when editing
                        <input
                          type="text"
                          disabled
                          value={formData.name}
                          className="w-full h-12 px-4 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 font-rubik cursor-not-allowed"
                        />
                      ) : selectedUser ? (
                        // Selected User Display
                        <div className="flex items-center justify-between w-full h-12 px-4 rounded-xl bg-primary1/10 border border-primary1 text-primary3 font-rubik">
                          <span>{formData.name}</span>
                          <button
                            type="button"
                            onClick={clearSelection}
                            className="text-primary3 hover:text-red-500"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        // Search Input
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={18} />
                          </div>
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search for a student..."
                            className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary2 focus:ring-2 focus:ring-primary2/20 outline-none transition-all font-rubik"
                          />
                          {/* Search Results Dropdown */}
                          {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-50">
                              {searchResults.map((user) => (
                                <button
                                  key={user._id}
                                  type="button"
                                  onClick={() => selectUser(user)}
                                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-0"
                                >
                                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                    {user.profilePicture ? (
                                      <img
                                        src={user.profilePicture}
                                        alt=""
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                        {user.firstName[0]}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-800 text-sm">
                                      {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {user.studentNumber}
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                          {isSearching && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              <div className="w-4 h-4 border-2 border-primary2 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* --- EXECUTIVE FIELDS --- */}
                    {activeTab === "executive" ? (
                      <>
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
                                  role:
                                    e.target.value === "Batch Representative"
                                      ? formData.role
                                      : "",
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

                        {/* Year Level - Only for Batch Rep */}
                        {formData.position === "Batch Representative" && (
                          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            <label className="text-sm font-semibold text-primary3 font-raleway">
                              Year Level <span className="text-red-500">*</span>
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
                                  Select Year
                                </option>
                                {YEAR_LEVELS.map((yr) => (
                                  <option key={yr} value={yr}>
                                    {yr}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                <ChevronDown className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      /* --- COMMITTEE FIELDS --- */
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-primary3 font-raleway">
                            Committee Name{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              required
                              value={formData.role} // Committee Name
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

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-primary3 font-raleway">
                            Specific Title{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              required
                              value={formData.position} // Position (Head, Member, etc)
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  position: e.target.value,
                                })
                              }
                              className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary2 focus:ring-2 focus:ring-primary2/20 outline-none transition-all font-rubik appearance-none cursor-pointer"
                            >
                              <option value="" disabled>
                                Select Role
                              </option>
                              {COMMITTEE_ROLES.map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
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
                              // DISPLAY LOGIC:
                              // If Batch Rep: Combine Role (Year) + Position => "1st Year Batch Representative"
                              // Else: Just use Position
                              position={
                                officer.position === "Batch Representative"
                                  ? `${officer.role} Batch Representative`
                                  : officer.position
                              }
                              // For committees, role is committee name. For execs, it's usually empty (except batch rep logic above)
                              role={
                                officer.departmentId === "committee"
                                  ? officer.role
                                  : ""
                              }
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
