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
  RefreshCw,
  Users,
  AlertTriangle,
  ChevronRight,
  Shield,
  Layers,
  Check, User
} from "lucide-react";

// --- IMPORTS ---
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "@/app/components/grid";
import Sidebar from "@/app/create/components/sidebar";
import { GlassCard } from "../../components/glass-card";
import officerService, { Officer as IOfficer } from "@/app/services/officer";

// --- DATA CONFIGURATION ---
const departments: Record<string, any> = {
  executive: {
    id: "executive",
    title: "Executive Council",
    subtitle: "Elected Positions",
    description: "Leading the chapter with vision and integrity.",
    icon: Shield,
    color: "text-primary1",
    bg: "bg-primary1/8",
    border: "border-primary1/30",
    dot: "bg-primary1",
    rank: 1,
  },
  committee: {
    id: "committee",
    title: "Committee Officers",
    subtitle: "Committee Heads",
    description: "The dedicated hands behind our events and initiatives.",
    icon: Layers,
    color: "text-primary2",
    bg: "bg-primary2/8",
    border: "border-primary2/30",
    dot: "bg-primary2",
    rank: 2,
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

type Officer = {
  id: string;
  name: string;
  role: string;
  position: string;
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
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: "",
    description: "",
  });

  // Dropdown State
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Search State
  const [searchResults, setSearchResults] = useState<IOfficer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<IOfficer | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    position: "",
    image: "",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Shared dropdown styles
  const dropdownContainerStyle =
    "absolute z-30 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden flex flex-col gap-1 p-2 max-h-56 overflow-y-auto";
  const dropdownItemStyle =
    "flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-colors font-rubik text-sm font-medium";
  const dropdownItemSelectedStyle = "bg-primary1/5 text-primary1";
  const dropdownItemHoverStyle = "hover:bg-gray-50 text-gray-700";

  const currentDeptData = departments[activeTab];
  const displayedOfficers = officers.filter(
    (o) => o.departmentId === activeTab,
  );

  // --- FETCH DATA ---
  const fetchOfficers = async () => {
    setIsLoadingList(true);
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
          role,
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
    } finally {
      setIsLoadingList(false);
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
    setSelectedUser(null);
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

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await officerService.updateOfficer(itemToDelete, {
        role: "student",
        position: "",
        department: "",
        yearLevel: undefined,
      } as any);
      fetchOfficers();
      setShowDeleteModal(false);
      setItemToDelete(null);
      setSuccessMessage({
        title: "Removed Successfully!",
        description: "The officer has been demoted to student.",
      });
      setShowSuccessModal(true);
      if (editingId === itemToDelete) handleCancelEdit();
    } catch (err) {
      console.error("Failed to remove officer:", err);
      setError("Failed to remove officer.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const validateLimits = (
    dept: string,
    pos: string,
    role: string,
    currentId: string | null,
  ): boolean => {
    const existing = officers.filter((o) => o.id !== currentId);
    if (dept === "executive") {
      if (pos === "Batch Representative") {
        const count = existing.filter(
          (o) => o.position === pos && o.role === role,
        ).length;
        if (count >= 2) {
          setError(`Max 2 Batch Representatives allowed for ${role}.`);
          return false;
        }
      } else if (pos === "SSG Representative") {
        const count = existing.filter((o) => o.position === pos).length;
        if (count >= 2) {
          setError("Max 2 SSG Representatives allowed.");
          return false;
        }
      } else {
        const count = existing.filter((o) => o.position === pos).length;
        if (count >= 1) {
          setError(`The position of ${pos} is already filled.`);
          return false;
        }
      }
    } else if (dept === "committee") {
      const committeeMembers = existing.filter(
        (o) => o.departmentId === "committee" && o.role === role,
      );
      if (["Committee Head", "Assistant Head", "Secretary"].includes(pos)) {
        if (committeeMembers.some((o) => o.position === pos)) {
          setError(`'${role}' already has a ${pos}.`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    let finalRole = formData.role;
    if (
      activeTab === "executive" &&
      formData.position !== "Batch Representative"
    )
      finalRole = "";
    const targetId = editingId || selectedUser?._id;
    if (
      !validateLimits(activeTab, formData.position, finalRole, targetId || null)
    )
      return;
    if (!targetId) {
      setError("Please select a user to assign.");
      return;
    }
    setIsSubmitting(true);
    try {
      const updateData: any = {
        role:
          activeTab === "executive" ? "council-officer" : "committee-officer",
        position: formData.position,
        department: activeTab === "committee" ? formData.role : undefined,
        yearLevel:
          activeTab === "executive" &&
          formData.position === "Batch Representative"
            ? parseInt(formData.role)
            : undefined,
      };
      if (formData.image && formData.image.startsWith("data:image")) {
        updateData.profilePicture = formData.image;
      }
      await officerService.updateOfficer(targetId, updateData as any);
      await fetchOfficers();
      setSuccessMessage({
        title: editingId ? "Updated Successfully!" : "Officer Added!",
        description: editingId
          ? "Officer details have been updated."
          : "Officer has been assigned successfully.",
      });
      setShowSuccessModal(true);
      handleCancelEdit();
    } catch (err) {
      console.error("Failed to save officer:", err);
      setError("Failed to save officer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#004e89]">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-md">
          <div className="flex flex-col items-center gap-5">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-primary2/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary2 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-primary3 font-bold font-rubik text-lg">
                {editingId ? "Updating Officer" : "Assigning Officer"}
              </p>
              <p className="text-gray-400 text-sm font-raleway mt-1">
                Please wait a moment...
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 bg-[#f8f9fc] rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />

          <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-40 sm:pt-48 pb-20">
            {/* ── PAGE HEADER ── */}
            <div className="mb-16 text-left">
              <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
                {editingId ? "Edit Officer" : "Manage Officers"}
              </h1>
              <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl">
                {editingId
                  ? "Update officer details and save changes for the leadership team."
                  : "Assign and organize the chapter leadership team."}
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <aside className="w-full lg:w-64 flex-shrink-0">
                <Sidebar />
              </aside>

              {/* Main Content */}
              <div className="flex-1 min-w-0 space-y-8">
                {/* ── FORM CARD ── */}
                <div className={`bg-white rounded-[2rem] border transition-all duration-300 shadow-lg p-6 sm:p-10 lg:p-12 hover:shadow-primary1/40 hover:-translate-y-2 ${
                  editingId ? "border-primary1 ring-2 ring-primary1/20" : "border-gray-200"
                }`}>
                    {/* Edit Banner */}
                    {editingId && (
                      <div className="-mx-6 sm:-mx-10 lg:-mx-12 -mt-6 sm:-mt-10 lg:-mt-12 mb-8 bg-gradient-to-r from-primary1 to-primary3 px-6 sm:px-10 py-5 flex items-center justify-between rounded-t-[2rem]">
                        <div className="flex items-center gap-2 text-white">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          <span className="text-sm font-bold font-rubik tracking-wide">
                            EDITING MODE
                          </span>
                        </div>
                        <button
                          onClick={handleCancelEdit}
                          className="text-white/80 hover:text-white text-sm font-bold font-raleway underline underline-offset-2 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    <div className="flex flex-col gap-6">
                      {/* Section Header */}
                      <div className="flex items-center justify-between">
                        <p className="font-raleway text-gray-500 text-sm">
                          Fill in the fields below
                        </p>
                        
                          <div
                          className={`hidden sm:flex items-center gap-1.5 rounded-full px-4 py-2 ${currentDeptData.bg}`}
                        >
                          <User className="w-4 h-4 text-primary2" />
                          <span
                            className={`text-xs font-bold font-rubik uppercase tracking-wider ${currentDeptData.color}`}
                          >
                            {currentDeptData.subtitle}
                          </span>
                        </div>
                      </div>
                      
                        {/* Active Dept Badge */}
                        
                      </div>

                      {/* Department Selector */}
                      <div className="my-5 space-y-3">
                        <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                          Department <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {Object.keys(departments).map((key) => {
                            const dept = departments[key];
                            const isActive = activeTab === key;
                            const Icon = dept.icon;
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => {
                                  setActiveTab(key);
                                  setError(null);
                                  setFormData((prev) => ({
                                    ...prev,
                                    role: "",
                                    position: "",
                                  }));
                                  setSelectedUser(null);
                                  setSearchQuery("");
                                }}
                                className={`
                                relative flex items-center gap-3 rounded-xl px-5 py-4 text-left font-rubik font-bold text-sm border-2
                                transition-all duration-200
                                ${
                                  isActive
                                    ? `${dept.bg} ${dept.color} ${dept.border} shadow-sm scale-[1.02]`
                                    : "bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600"
                                }
                              `}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                                    isActive ? dept.dot : "bg-gray-200"
                                  }`}
                                />
                                <div>
                                  <p className="leading-tight">{dept.title}</p>
                                  <p
                                    className={`text-[14px] font-raleway font-semibold mt-0.5 truncate ${isActive ? "opacity-90" : "text-gray-300"}`}
                                  >
                                    {dept.subtitle}
                                  </p>
                                </div>
                                {isActive && (
                                  <ChevronRight
                                    size={12}
                                    className="ml-auto opacity-50"
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Error Alert */}
                      {error && (
                        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-100">
                          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold font-rubik">
                              Action Required
                            </p>
                            <p className="text-sm font-raleway">{error}</p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* LEFT — Photo */}
                        <div className="space-y-3">
                          <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                            Officer Photo
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                          />

                          {preview ? (
                            <div
                              className="relative group rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50 h-56 cursor-pointer"
                              onClick={() => fileInputRef.current?.click()}
                              title="Click to change photo"
                            >
                              <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                  }}
                                  className="bg-white text-primary3 text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform font-rubik"
                                >
                                  Replace
                                </button>
                                {!editingId && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      clearSelection();
                                    }}
                                    className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform font-rubik"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => fileInputRef.current?.click()}
                              className="cursor-pointer h-56 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/80 hover:border-primary2/60 hover:bg-primary2/3 transition-all duration-300 flex flex-col items-center justify-center gap-4"
                            >
                              <div className="w-14 h-14 rounded-2xl bg-white text-primary2 shadow-md flex items-center justify-center">
                                <ImageIcon size={22} strokeWidth={2.5} />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-bold text-gray-700 font-rubik">
                                  {selectedUser
                                    ? "Upload photo"
                                    : "No photo available"}
                                </p>
                                <p className="text-xs text-gray-400 mt-1 font-raleway">
                                  {selectedUser
                                    ? "Click to upload a photo"
                                    : "Select a student first"}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* RIGHT — Fields */}
                        <div className="space-y-6">
                          {/* Full Name / Search */}
                          <div className="space-y-2">
                            <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                              Full Name <span className="text-red-500">*</span>
                            </label>

                            {editingId ? (
                              <input
                                type="text"
                                disabled
                                value={formData.name}
                                className="w-full font-rubik text-base bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 text-gray-500 cursor-not-allowed"
                              />
                            ) : selectedUser ? (
                              <div className="flex items-center justify-between w-full font-rubik text-base bg-primary1/10 border-2 border-primary1/30 rounded-2xl px-4 py-3 text-primary3">
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
                              <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                  <Search size={18} />
                                </div>
                                <input
                                  type="text"
                                  value={searchQuery}
                                  onChange={(e) => handleSearch(e.target.value)}
                                  placeholder="Search for a student..."
                                  className="w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3 outline-none transition-all placeholder-gray-400 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10"
                                />
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
                                    <div className="w-4 h-4 border-2 border-primary2 border-t-transparent rounded-full animate-spin" />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Executive Fields */}
                          {activeTab === "executive" ? (
                            <>
                              {/* Position Dropdown */}
                              <div className="space-y-2">
                                <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                                  Position{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <div
                                    className={`w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 cursor-pointer flex items-center justify-between text-gray-700 transition-all hover:bg-gray-100 ${
                                      activeDropdown === "position"
                                        ? "bg-white border-primary1 ring-4 ring-primary1/10"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      setActiveDropdown(
                                        activeDropdown === "position" ? null : "position"
                                      )
                                    }
                                  >
                                    <span className="font-rubik text-base">
                                      {formData.position || <span className="text-gray-400">Select Position</span>}
                                    </span>
                                    <ChevronDown
                                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                                        activeDropdown === "position" ? "rotate-180" : ""
                                      }`}
                                    />
                                  </div>
                                  {activeDropdown === "position" && (
                                    <>
                                      <div
                                        className="fixed inset-0 z-20"
                                        onClick={() => setActiveDropdown(null)}
                                      />
                                      <div className={dropdownContainerStyle}>
                                        {EXECUTIVE_POSITIONS.map((pos) => (
                                          <div
                                            key={pos}
                                            className={`${dropdownItemStyle} ${
                                              formData.position === pos
                                                ? dropdownItemSelectedStyle
                                                : dropdownItemHoverStyle
                                            }`}
                                            onClick={() => {
                                              setFormData({
                                                ...formData,
                                                position: pos,
                                                role:
                                                  pos === "Batch Representative"
                                                    ? formData.role
                                                    : "",
                                              });
                                              setActiveDropdown(null);
                                            }}
                                          >
                                            <span>{pos}</span>
                                            {formData.position === pos && (
                                              <Check className="w-4 h-4 text-primary1" />
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Year Level Dropdown — only for Batch Representative */}
                              {formData.position === "Batch Representative" && (
                                <div className="space-y-2">
                                  <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                                    Year Level{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative">
                                    <div
                                      className={`w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 cursor-pointer flex items-center justify-between text-gray-700 transition-all hover:bg-gray-100 ${
                                        activeDropdown === "yearLevel"
                                          ? "bg-white border-primary1 ring-4 ring-primary1/10"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        setActiveDropdown(
                                          activeDropdown === "yearLevel" ? null : "yearLevel"
                                        )
                                      }
                                    >
                                      <span className="font-rubik text-base">
                                        {formData.role || <span className="text-gray-400">Select Year</span>}
                                      </span>
                                      <ChevronDown
                                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                                          activeDropdown === "yearLevel" ? "rotate-180" : ""
                                        }`}
                                      />
                                    </div>
                                    {activeDropdown === "yearLevel" && (
                                      <>
                                        <div
                                          className="fixed inset-0 z-20"
                                          onClick={() => setActiveDropdown(null)}
                                        />
                                        <div className={dropdownContainerStyle}>
                                          {YEAR_LEVELS.map((yr) => (
                                            <div
                                              key={yr}
                                              className={`${dropdownItemStyle} ${
                                                formData.role === yr
                                                  ? dropdownItemSelectedStyle
                                                  : dropdownItemHoverStyle
                                              }`}
                                              onClick={() => {
                                                setFormData({ ...formData, role: yr });
                                                setActiveDropdown(null);
                                              }}
                                            >
                                              <span>{yr}</span>
                                              {formData.role === yr && (
                                                <Check className="w-4 h-4 text-primary1" />
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            /* Committee Fields */
                            <>
                              {/* Committee Name Dropdown */}
                              <div className="space-y-2">
                                <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                                  Committee Name{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <div
                                    className={`w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 cursor-pointer flex items-center justify-between text-gray-700 transition-all hover:bg-gray-100 ${
                                      activeDropdown === "committee"
                                        ? "bg-white border-primary1 ring-4 ring-primary1/10"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      setActiveDropdown(
                                        activeDropdown === "committee" ? null : "committee"
                                      )
                                    }
                                  >
                                    <span className="font-rubik text-base truncate pr-2">
                                      {formData.role || <span className="text-gray-400">Select Committee</span>}
                                    </span>
                                    <ChevronDown
                                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                                        activeDropdown === "committee" ? "rotate-180" : ""
                                      }`}
                                    />
                                  </div>
                                  {activeDropdown === "committee" && (
                                    <>
                                      <div
                                        className="fixed inset-0 z-20"
                                        onClick={() => setActiveDropdown(null)}
                                      />
                                      <div className={dropdownContainerStyle}>
                                        {COMMITTEES_LIST.map((comm) => (
                                          <div
                                            key={comm}
                                            className={`${dropdownItemStyle} ${
                                              formData.role === comm
                                                ? dropdownItemSelectedStyle
                                                : dropdownItemHoverStyle
                                            }`}
                                            onClick={() => {
                                              setFormData({ ...formData, role: comm });
                                              setActiveDropdown(null);
                                            }}
                                          >
                                            <span>{comm}</span>
                                            {formData.role === comm && (
                                              <Check className="w-4 h-4 text-primary1" />
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Specific Title Dropdown */}
                              <div className="space-y-2">
                                <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                                  Specific Title{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <div
                                    className={`w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 cursor-pointer flex items-center justify-between text-gray-700 transition-all hover:bg-gray-100 ${
                                      activeDropdown === "title"
                                        ? "bg-white border-primary1 ring-4 ring-primary1/10"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      setActiveDropdown(
                                        activeDropdown === "title" ? null : "title"
                                      )
                                    }
                                  >
                                    <span className="font-rubik text-base">
                                      {formData.position || <span className="text-gray-400">Select Role</span>}
                                    </span>
                                    <ChevronDown
                                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                                        activeDropdown === "title" ? "rotate-180" : ""
                                      }`}
                                    />
                                  </div>
                                  {activeDropdown === "title" && (
                                    <>
                                      <div
                                        className="fixed inset-0 z-20"
                                        onClick={() => setActiveDropdown(null)}
                                      />
                                      <div className={dropdownContainerStyle}>
                                        {COMMITTEE_ROLES.map((role) => (
                                          <div
                                            key={role}
                                            className={`${dropdownItemStyle} ${
                                              formData.position === role
                                                ? dropdownItemSelectedStyle
                                                : dropdownItemHoverStyle
                                            }`}
                                            onClick={() => {
                                              setFormData({ ...formData, position: role });
                                              setActiveDropdown(null);
                                            }}
                                          >
                                            <span>{role}</span>
                                            {formData.position === role && (
                                              <Check className="w-4 h-4 text-primary1" />
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                                  {/* Actions */}
                      
                    </div>
                    <div className="mt-10 flex flex-wrap justify-end gap-4">
                        <div className="flex flex-wrap gap-3 ml-auto">
                          {editingId && (
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-6 py-3 font-rubik font-bold text-gray-500 border-2 border-gray-200 hover:border-red-200 hover:text-red-400 rounded-2xl transition-all duration-300"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="group relative px-8 py-3 bg-gradient-to-r from-primary3 to-primary1 rounded-2xl font-rubik font-bold text-white shadow-lg shadow-primary1/20 hover:shadow-primary1/40 transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Save className="h-4 w-4" />
                            <span>{editingId ? "Update Officer" : "Add Officer"}</span>
                          </button>
                        </div>
                      </div>
                </div>

                {/* ── MANAGE LIST ── */}
                <div className="bg-white rounded-[2rem] border transition-all duration-300 shadow-md hover:shadow-primary1/40 hover:-translate-y-2 border-gray-200">
                    {/* List Header */}
                    <div className="px-6 sm:px-8 py-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <h2 className="text-xl font-black font-rubik text-primary3">
                          {currentDeptData.title} List
                        </h2>
                        <p className="text-gray-400 text-xs font-raleway mt-0.5 tracking-wide">
                          {displayedOfficers.length}{" "}
                          {displayedOfficers.length === 1
                            ? "member"
                            : "members"}{" "}
                          in this department
                        </p>
                      </div>
                      <button
                        onClick={fetchOfficers}
                        className="flex items-center gap-2 text-xs font-bold font-rubik text-primary1 border border-primary1/20 hover:border-primary1/50 hover:bg-primary1/5 px-4 py-2 rounded-full transition-all duration-200"
                      >
                        <RefreshCw
                          size={13}
                          className={isLoadingList ? "animate-spin" : ""}
                        />
                        Refresh
                      </button>
                    </div>

                    {/* Dept Legend */}
                    <div className="px-6 sm:px-8 py-3 border-b border-gray-50 flex flex-wrap gap-3">
                      {Object.keys(departments).map((key) => {
                        const dept = departments[key];
                        const count = officers.filter(
                          (o) => o.departmentId === key,
                        ).length;
                        return (
                          <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold font-rubik transition-all ${
                              activeTab === key
                                ? `${dept.bg} ${dept.color} ${dept.border}`
                                : "bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-300"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                activeTab === key ? dept.dot : "bg-gray-300"
                              }`}
                            />
                            {dept.subtitle}
                            <span className="opacity-50">·</span>
                            <span className="opacity-70">{count}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Table */}
                    {isLoadingList ? (
                      <div className="py-20 flex flex-col items-center gap-3 text-gray-300">
                        <div className="w-8 h-8 border-2 border-gray-200 border-t-primary2 rounded-full animate-spin" />
                        <p className="text-sm font-raleway">
                          Loading officers...
                        </p>
                      </div>
                    ) : displayedOfficers.length === 0 ? (
                      <div className="py-20 flex flex-col items-center gap-4 text-gray-300">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                          <Users size={24} className="text-gray-300" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold font-rubik text-gray-400">
                            No officers yet
                          </p>
                          <p className="text-xs font-raleway mt-0.5">
                            Assign one using the form above
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[580px]">
                          <thead>
                            <tr className="bg-gray-50/80">
                              <th className="px-6 sm:px-8 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                                Photo
                              </th>
                              <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                                Name
                              </th>
                              <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                                Position
                              </th>
                              {activeTab === "committee" && (
                                <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                                  Committee
                                </th>
                              )}
                              <th className="px-6 sm:px-8 py-3.5 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {displayedOfficers.map((officer) => {
                              const dept = departments[officer.departmentId];
                              const isEditing = editingId === officer.id;
                              return (
                                <tr
                                  key={officer.id}
                                  className={`group border-t border-gray-50 transition-all duration-200 ${
                                    isEditing
                                      ? "bg-primary1/5"
                                      : "hover:bg-gray-50/70"
                                  }`}
                                >
                                  {/* Photo */}
                                  <td className="px-6 sm:px-8 py-4">
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                                      <img
                                        src={officer.image}
                                        alt={officer.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </td>

                                  {/* Name */}
                                  <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                      {isEditing && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary1 animate-pulse flex-shrink-0" />
                                      )}
                                      <span className="font-bold text-sm text-gray-800 font-rubik">
                                        {officer.name}
                                      </span>
                                    </div>
                                    {officer.studentNumber && (
                                      <p className="text-xs text-gray-400 font-raleway mt-0.5">
                                        {officer.studentNumber}
                                      </p>
                                    )}
                                  </td>

                                  {/* Position */}
                                  <td className="px-4 py-4">
                                    <span
                                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${dept.bg} ${dept.color} ${dept.border}`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${dept.dot}`}
                                      />
                                      {officer.position ===
                                      "Batch Representative"
                                        ? `${officer.role} Batch Rep`
                                        : officer.position}
                                    </span>
                                  </td>

                                  {/* Committee (conditional) */}
                                  {activeTab === "committee" && (
                                    <td className="px-4 py-4">
                                      <span className="text-xs text-gray-500 font-raleway">
                                        {officer.role}
                                      </span>
                                    </td>
                                  )}

                                  {/* Actions */}
                                  <td className="px-6 sm:px-8 py-4 text-right">
                                    <div className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => handleEditClick(officer)}
                                        className="p-2 text-gray-400 hover:text-primary1 hover:bg-primary1/10 rounded-lg transition-all duration-150"
                                        title="Edit"
                                      >
                                        <Pencil size={15} />
                                      </button>
                                      <button
                                        onClick={() =>
                                          confirmDelete(officer.id)
                                        }
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150"
                                        title="Remove"
                                      >
                                        <Trash2 size={15} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="mt-[-35px] md:mt-[-80px] relative z-0">
        <Footer />
      </div>

      {/* ── DELETE MODAL ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-primary3 font-rubik mb-2">
              Remove Officer?
            </h3>
            <p className="text-gray-400 text-sm font-raleway mb-6 leading-relaxed">
              This will demote the officer back to student status. This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 text-sm font-bold font-rubik text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 text-sm font-bold font-rubik text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-lg shadow-red-500/25"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUCCESS MODAL ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" />
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl relative">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-black text-primary3 font-rubik">
                {successMessage.title}
              </h3>
              <p className="text-gray-400 text-sm font-raleway mt-2">
                {successMessage.description}
              </p>
            </div>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 text-sm font-bold font-rubik text-white bg-gradient-to-r from-primary1 to-primary2 rounded-xl shadow-lg hover:shadow-primary2/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
