"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "../../components/sidebar";
import Button from "@/app/components/button";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "../../components/grid";
import { ChevronDown, Pencil, Trash2, RefreshCw, AlertTriangle } from "lucide-react"; // Icons
import eventService from "../../services/event";

type FormErrors = {
  date: boolean;
  time: boolean;
  title: boolean;
  description: boolean;
  body: boolean;
};

// --- INTERFACE FOR EVENT ---
interface EventItem {
  _id: string;
  title: string;
  eventDate: string;
  time?: string;
  location?: string;
  mode: "Online" | "Onsite";
  isPublished: boolean;
  description: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  admissions?: { category: string; price: string }[];
  organizer?: string | { name: string };
  contact?: string;
  rsvpLink?: string;
  registrationRequired?: boolean;
  registrationStart?: string;
  registrationEnd?: string;
  targetAudience?: string[];
  details?: { title: string; items: string[] }[];
}

export default function EventsPage() {
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [registrationRequired, setRegistrationRequired] = useState(false);
  const [registrationStart, setRegistrationStart] = useState("");
  const [registrationEnd, setRegistrationEnd] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const router = useRouter();

  // --- MANAGEMENT STATE ---
  const [eventList, setEventList] = useState<EventItem[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    title: "",
    description: "",
    body: "",
    rsvp: "",
    contact: "",
    location: "",
    visibility: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    date: false,
    time: false,
    title: false,
    description: false,
    body: false,
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [mode, setMode] = useState<"Online" | "Onsite">("Onsite");
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [showAdmissionInput, setShowAdmissionInput] = useState(false);
  const [admissions, setAdmissions] = useState<
    {
      category: string;
      price: string;
    }[]
  >([]);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [details, setDetails] = useState<
    {
      title: string;
      body: string;
    }[]
  >([{ title: "", body: "" }]);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const predefinedTags = ["Workshop", "Seminar", "Training", "Webinar"];

  // 1. FETCH EVENTS ON LOAD
  const fetchEvents = async () => {
    setIsLoadingList(true);
    try {
      const response = await eventService.getEvents({ limit: 100 });
      // Handle different response structures
      const data = response.data || (Array.isArray(response) ? response : []);
      setEventList(data as EventItem[]);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 2. HANDLE EDIT CLICK (Populate All Fields)
  const handleEditClick = (item: EventItem) => {
    setEditingId(item._id);

    // Basic Fields
    setFormData({
      title: item.title,
      description: item.description,
      body: item.content,
      date: item.eventDate
        ? new Date(item.eventDate).toISOString().split("T")[0]
        : "",
      time: item.time || "",
      location: item.location || "",
      rsvp: item.rsvpLink || "",
      contact: item.contact || "",
      visibility: item.targetAudience?.includes("members")
        ? "members"
        : item.targetAudience?.includes("officers")
        ? "officers"
        : "public",
    });

    // Complex Fields
    setMode(item.mode);
    setTags(item.tags || []);
    setAdmissions(item.admissions || []);
    setOrganizer(
      typeof item.organizer === "object"
        ? item.organizer.name
        : item.organizer || ""
    );
    setRegistrationRequired(!!item.registrationRequired);
    setRegistrationStart(
      item.registrationStart
        ? new Date(item.registrationStart).toISOString().slice(0, 16)
        : ""
    );
    setRegistrationEnd(
      item.registrationEnd
        ? new Date(item.registrationEnd).toISOString().slice(0, 16)
        : ""
    );

    // Transform Details back to form format
    if (item.details && item.details.length > 0) {
      setDetails(
        item.details.map((d) => ({ title: d.title, body: d.items.join("\n") }))
      );
      setShowAdditionalInfo(true);
    } else {
      setDetails([{ title: "", body: "" }]);
      setShowAdditionalInfo(false);
    }

    // Image
    setPreviews(item.coverImage ? [item.coverImage] : []);
    setImages([]); // Reset file input

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 3. CANCEL EDIT
  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 4. HANDLE DELETE
  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await eventService.deleteEvent(itemToDelete);
      fetchEvents();
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      alert("Failed to delete event");
    }
  };

  const handlePublish = async () => {
    const newErrors = {
      date: !formData.date.trim(),
      time: !formData.time.trim(),
      title: !formData.title.trim(),
      description: !formData.description.trim(),
      body: !formData.body.trim(),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      setShowGlobalError(true);
      return;
    }

    setIsSubmitting(true);
    setShowGlobalError(false);

    try {
      const audienceMap: Record<string, string[]> = {
        public: ["all"],
        members: ["members"],
        officers: ["officers"],
      };

      const eventData = {
        title: formData.title,
        description: formData.description,
        content: formData.body,
        eventDate: new Date(formData.date).toISOString(),
        time: formData.time,
        location: formData.location || undefined,
        organizer: organizer || undefined,
        contact: formData.contact || undefined,
        rsvpLink: formData.rsvp || undefined,
        mode: mode,
        tags: tags.length > 0 ? tags : undefined,
        admissions: admissions.length > 0 ? admissions : undefined,
        registrationRequired,
        registrationStart: registrationStart || undefined,
        registrationEnd: registrationEnd || undefined,
        targetAudience: formData.visibility
          ? audienceMap[formData.visibility]
          : ["all"],
        isPublished: true,
        publishDate: new Date().toISOString(),
        details: details
          .map((d) => ({
            title: d.title || "",
            items: d.body
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
          }))
          .filter((d) => d.title || d.items.length > 0),
      };

      if (editingId) {
        // UPDATE MODE
        await eventService.updateEvent(
          editingId,
          eventData,
          images.length > 0 ? images : undefined
        );
        console.log("✅ Event updated successfully");
      } else {
        // CREATE MODE
        await eventService.createEvent(
          eventData,
          images.length > 0 ? images : undefined
        );
        console.log("✅ Event created successfully");
      }

      setSubmitSuccess(true);
      setShowSuccessModal(true);
      handleCancelEdit(); // Reset form
      fetchEvents(); // Refresh list
    } catch (error) {
      console.error("❌ Error saving event:", error);
      alert("Failed to save event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);

    try {
      const audienceMap: Record<string, string[]> = {
        public: ["all"],
        members: ["members"],
        officers: ["officers"],
      };

      const eventData = {
        title: formData.title || "Untitled Draft",
        description: formData.description || "No description",
        content: formData.body || "No content",
        eventDate: formData.date
          ? new Date(formData.date).toISOString()
          : new Date().toISOString(),
        time: formData.time || undefined,
        location: formData.location || undefined,
        organizer: organizer || undefined,
        contact: formData.contact || undefined,
        rsvpLink: formData.rsvp || undefined,
        mode: mode,
        tags: tags.length > 0 ? tags : undefined,
        admissions: admissions.length > 0 ? admissions : undefined,
        registrationRequired,
        registrationStart: registrationStart || undefined,
        registrationEnd: registrationEnd || undefined,
        targetAudience: formData.visibility
          ? audienceMap[formData.visibility]
          : ["all"],
        isPublished: false,
        details: details
          .map((d) => ({
            title: d.title || "",
            items: d.body
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
          }))
          .filter((d) => d.title || d.items.length > 0),
      };

      const response = await eventService.createEvent(
        eventData,
        images.length > 0 ? images : undefined
      );

      console.log("✅ Draft saved successfully:", response);
      alert("Draft saved successfully!");
    } catch (error) {
      console.error("❌ Error saving draft:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save draft. Please try again.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      date: "",
      time: "",
      title: "",
      description: "",
      body: "",
      rsvp: "",
      contact: "",
      location: "",
      visibility: "",
    });
    setImages([]);
    setPreviews([]);
    setTags([]);
    setAdmissions([]);
    setOrganizer("");
    setRegistrationRequired(false);
    setRegistrationStart("");
    setRegistrationEnd("");
    setDetails([{ title: "", body: "" }]);
    setShowAdditionalInfo(false);
    setMode("Onsite");
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement & {
      name: string;
      value: string;
    };

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (Object.prototype.hasOwnProperty.call(errors, name)) {
      setErrors((prev) => ({ ...prev, [name as keyof FormErrors]: false }));
    }
  };

  const resizeImage = (file: File, maxWidth = 1200): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scaleSize = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const resizedFile = new File([blob], file.name, {
              type: file.type,
            });
            resolve(resizedFile);
          },
          file.type,
          0.8
        );
      };

      reader.readAsDataURL(file);
    });
  };

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resized = await resizeImage(file);
      setImages([resized]);
      setPreviews([URL.createObjectURL(resized)]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Error resizing image", err);
    }
  };

  useEffect(() => {
    if (Object.values(errors).every((err) => err === false)) {
      setShowGlobalError(false);
    }
  }, [errors]);

  return (
    <section className="min-h-screen bg-gray-50/50 flex flex-col relative">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Grid />
      </div>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-300">
          <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
            <div className="w-12 h-12 border-4 border-primary2 border-t-transparent rounded-full animate-spin" />
            <p className="text-primary3 font-semibold font-rubik animate-pulse">
              {editingId ? "Updating Event..." : "Publishing Event..."}
            </p>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-16">
          {/* Page Header */}
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary1/10 to-primary2/10 rounded-3xl blur-3xl -z-10" />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-6xl font-bold font-rubik bg-gradient-to-r from-primary3 via-primary1 to-primary2 bg-clip-text text-transparent mb-3">
                {editingId ? "Edit Event" : "Compose Event"}
              </h1>
              <p className="text-gray-600 font-raleway text-lg">
                {editingId
                  ? "Update event details below"
                  : "Create and schedule upcoming events"}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="sticky top-24">
                <Sidebar />
              </div>
            </aside>

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
                <div className="bg-gradient-to-r from-primary1 to-primary2 p-8">
                  <h2 className="text-3xl font-bold text-white font-rubik flex items-center gap-3">
                    {editingId ? "Edit Details" : "Content Details"}
                  </h2>
                  <p className="text-blue-100 font-raleway mt-2">
                    {editingId
                      ? "Modify information below"
                      : "Fill in the information below to create an event"}
                  </p>
                </div>

                <div className="p-8 space-y-8">
                  {/* Upload Image */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <label className="text-lg font-semibold text-primary3 font-rubik">
                        Cover Image
                      </label>
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImagesChange}
                      ref={fileInputRef}
                    />

                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => fileInputRef.current?.click()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          fileInputRef.current?.click();
                      }}
                      className="block cursor-pointer group"
                    >
                      {previews.length > 0 ? (
                        <div className="relative overflow-hidden rounded-xl group-image">
                          <img
                            src={previews[0]}
                            alt="preview"
                            className="w-full h-64 object-cover rounded-xl border-2 border-white shadow-md transition-transform duration-300 hover:scale-105"
                          />
                          <button
                            type="button"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              try {
                                URL.revokeObjectURL(previews[0]);
                              } catch {}
                              setImages([]);
                              setPreviews([]);
                            }}
                            aria-label="Remove image"
                            className="absolute top-4 right-4 bg-white w-10 h-10 flex items-center justify-center rounded-full text-red-500 shadow-lg hover:bg-red-50 hover:scale-110 transition-all duration-200"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                            showGlobalError && !images
                              ? "border-red-400 bg-red-50/50"
                              : "border-gray-300 bg-gray-50/50 group-hover:border-primary2 group-hover:bg-primary2/5"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary2/10 flex items-center justify-center group-hover:bg-primary2/20 transition-colors duration-300">
                              <svg
                                className="w-8 h-8 text-primary2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-gray-700 font-semibold font-rubik">
                                Click to upload cover photo
                              </p>
                              <p className="text-sm text-gray-500 mt-1 font-raleway">
                                PNG, JPG up to 10MB
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-3">
                    <label className="text-lg font-semibold text-primary3 font-rubik flex items-center gap-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 items-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
                      {predefinedTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() =>
                            setTags((prev) =>
                              prev.includes(tag)
                                ? prev.filter((t) => t !== tag)
                                : [...prev, tag]
                            )
                          }
                          className={`px-4 py-2 text-sm font-bold rounded-xl border-2 transition-all duration-300 font-rubik ${
                            tags.includes(tag)
                              ? "bg-primary2 text-white border-primary2 shadow-md shadow-primary2/30"
                              : "border-gray-200 text-gray-500 bg-white hover:border-primary2 hover:text-primary2"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}

                      {!showTagInput && (
                        <button
                          type="button"
                          onClick={() => setShowTagInput(true)}
                          className="px-4 py-2 border-2 border-dashed border-primary2 text-primary2 rounded-xl hover:bg-primary2 hover:text-white transition-all duration-300 font-rubik text-sm font-bold"
                        >
                          + Add Custom Tag
                        </button>
                      )}

                      {showTagInput && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                          <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (newTag.trim() !== "")
                                  setTags((prev) => [...prev, newTag.trim()]);
                                setNewTag("");
                                setShowTagInput(false);
                              }
                            }}
                            className="border-2 border-primary2 rounded-xl px-3 py-2 font-rubik text-sm focus:outline-none focus:ring-2 focus:ring-primary2/20 w-40"
                            placeholder="Enter tag..."
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newTag.trim() !== "")
                                setTags((prev) => [...prev, newTag.trim()]);
                              setNewTag("");
                              setShowTagInput(false);
                            }}
                            className="px-3 py-2 bg-primary2 text-white rounded-xl text-sm font-bold hover:bg-primary3 transition-colors"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNewTag("");
                              setShowTagInput(false);
                            }}
                            className="px-3 py-2 border-2 border-gray-200 text-gray-500 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Selected Tags Display */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="flex items-center gap-2 bg-primary2/10 text-primary2 font-bold font-rubik px-4 py-2 rounded-xl text-sm border border-primary2/20"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() =>
                                setTags(tags.filter((_, i) => i !== index))
                              }
                              className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-primary2 hover:text-white transition-colors"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-gray-100 w-full" />

                  {/* Details Section */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-primary3 font-rubik mb-1">
                        Event Schedule
                      </h3>
                      <p className="text-sm text-gray-500 font-raleway">
                        Specify event date, time, and location
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-primary3 font-rubik">
                          Date *
                        </label>
                        <input
                          id="date"
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className={`w-full rounded-xl border-2 px-4 py-3 text-gray-600 focus:outline-none focus:ring-4 transition-all duration-300 ${
                            errors.date
                              ? "border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30"
                              : "border-gray-200 focus:border-primary2 focus:ring-primary2/10 bg-gray-50/30 focus:bg-white"
                          }`}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-primary3 font-rubik">
                          Time *
                        </label>
                        <input
                          id="time"
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          className={`w-full rounded-xl border-2 px-4 py-3 text-gray-600 focus:outline-none focus:ring-4 transition-all duration-300 ${
                            errors.time
                              ? "border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30"
                              : "border-gray-200 focus:border-primary2 focus:ring-primary2/10 bg-gray-50/30 focus:bg-white"
                          }`}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-primary3 font-rubik">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Where is it happening?"
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-600 bg-gray-50/30 focus:bg-white focus:outline-none focus:border-primary2 focus:ring-4 focus:ring-primary2/10 transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Admission Section */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <label className="text-lg font-semibold text-primary3 font-rubik">
                          Admission Prices
                        </label>
                        {!showAdmissionInput && (
                          <button
                            type="button"
                            onClick={() => setShowAdmissionInput(true)}
                            className="px-4 py-2 text-sm font-bold border-2 border-primary2 text-primary2 rounded-xl hover:bg-primary2 hover:text-white transition-all duration-300 font-rubik"
                          >
                            + Add Admission
                          </button>
                        )}
                      </div>

                      {showAdmissionInput && (
                        <div className="flex flex-col sm:flex-row gap-3 p-4 border-2 border-primary2/20 rounded-2xl bg-primary2/5 animate-in fade-in slide-in-from-top-2 duration-300">
                          <input
                            type="text"
                            placeholder="Category (e.g., General, VIP)"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="flex-1 border-2 border-white bg-white rounded-xl px-4 py-3 font-rubik focus:outline-none focus:border-primary2 focus:ring-2 focus:ring-primary2/10 transition-all"
                            autoFocus
                          />

                          <input
                            type="text"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full sm:w-32 border-2 border-white bg-white rounded-xl px-4 py-3 font-rubik focus:outline-none focus:border-primary2 focus:ring-2 focus:ring-primary2/10 transition-all"
                          />

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (!category.trim()) return;
                                setAdmissions((prev) => [
                                  ...prev,
                                  { category, price: price.trim() || "Free" },
                                ]);
                                setCategory("");
                                setPrice("");
                                setShowAdmissionInput(false);
                              }}
                              className="px-6 py-2 bg-primary2 text-white rounded-xl font-bold hover:bg-primary3 transition-colors font-rubik"
                            >
                              Add
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setCategory("");
                                setPrice("");
                                setShowAdmissionInput(false);
                              }}
                              className="px-4 py-2 border-2 border-gray-200 bg-white text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition-colors font-rubik"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {admissions.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                          {admissions.map((ad, index) => (
                            <span
                              key={index}
                              className="flex items-center gap-3 bg-white border-2 border-primary2/20 text-primary3 font-bold font-rubik px-5 py-2 rounded-xl shadow-sm"
                            >
                              <span>{ad.category}</span>
                              <span className="text-primary2 bg-primary2/10 px-2 py-0.5 rounded-md text-sm">
                                {ad.price}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setAdmissions(
                                    admissions.filter((_, i) => i !== index)
                                  )
                                }
                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors ml-1"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mode */}
                  <div className="space-y-3">
                    <label className="text-lg font-semibold text-primary3 font-rubik">
                      Event Mode
                    </label>
                    <div className="flex gap-4 p-1.5 bg-gray-50 rounded-2xl border border-gray-200 w-fit">
                      <button
                        type="button"
                        onClick={() => setMode("Onsite")}
                        className={`px-6 py-3 rounded-xl text-sm font-bold font-rubik transition-all duration-300 ${
                          mode === "Onsite"
                            ? "bg-white text-primary1 shadow-md shadow-gray-200 ring-1 ring-black/5"
                            : "text-gray-500 hover:text-primary1 hover:bg-white/50"
                        }`}
                      >
                        Onsite
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode("Online")}
                        className={`px-6 py-3 rounded-xl text-sm font-bold font-rubik transition-all duration-300 ${
                          mode === "Online"
                            ? "bg-white text-primary1 shadow-md shadow-gray-200 ring-1 ring-black/5"
                            : "text-gray-500 hover:text-primary1 hover:bg-white/50"
                        }`}
                      >
                        Online
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 w-full" />

                  {/* Registration Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-lg font-semibold text-primary3 font-rubik">
                        Registration
                      </label>
                      <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                        <input
                          type="checkbox"
                          id="registrationToggle"
                          checked={registrationRequired}
                          onChange={() =>
                            setRegistrationRequired((prev) => !prev)
                          }
                          className="w-5 h-5 text-primary2 rounded focus:ring-primary2 border-gray-300"
                        />
                        <label
                          htmlFor="registrationToggle"
                          className="text-sm font-bold text-gray-600 font-rubik cursor-pointer select-none"
                        >
                          Registration Required
                        </label>
                      </div>
                    </div>

                    {registrationRequired && (
                      <div className="grid sm:grid-cols-2 gap-6 p-6 border-2 border-primary2/20 rounded-2xl bg-primary2/5 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-primary3 font-rubik">
                            Registration Opens
                          </label>
                          <input
                            type="datetime-local"
                            value={registrationStart}
                            onChange={(e) =>
                              setRegistrationStart(e.target.value)
                            }
                            className="w-full rounded-xl border-2 border-white bg-white px-4 py-3 text-gray-600 focus:outline-none focus:border-primary2 focus:ring-2 focus:ring-primary2/10 transition-all"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-primary3 font-rubik">
                            Registration Closes
                          </label>
                          <input
                            type="datetime-local"
                            value={registrationEnd}
                            onChange={(e) => setRegistrationEnd(e.target.value)}
                            className="w-full rounded-xl border-2 border-white bg-white px-4 py-3 text-gray-600 focus:outline-none focus:border-primary2 focus:ring-2 focus:ring-primary2/10 transition-all"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-gray-100 w-full" />

                  {/* Organizer Section */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-primary3 font-rubik">
                        Organizer
                      </label>
                      <input
                        type="text"
                        placeholder="Organizer name or group"
                        value={organizer}
                        onChange={(e) => setOrganizer(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-600 bg-gray-50/30 focus:bg-white focus:outline-none focus:border-primary2 focus:ring-4 focus:ring-primary2/10 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-primary3 font-rubik">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        name="contact"
                        placeholder="organizer@example.com"
                        value={formData.contact}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-600 bg-gray-50/30 focus:bg-white focus:outline-none focus:border-primary2 focus:ring-4 focus:ring-primary2/10 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 w-full" />

                  {/* Event Content */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="title"
                        className="text-lg font-semibold text-primary3 font-rubik flex items-center gap-2"
                      >
                        Event Title
                        {formData.title && (
                          <span className="text-green-500 text-xs">✓</span>
                        )}
                      </label>
                      <input
                        id="title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Add a clear and descriptive title"
                        className={`w-full rounded-xl border-2 px-5 py-4 text-lg focus:outline-none focus:ring-4 transition-all duration-300 ${
                          errors.title
                            ? "border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30"
                            : "border-gray-200 focus:border-primary2 focus:ring-primary2/10 bg-gray-50/30 focus:bg-white"
                        }`}
                      />
                      {errors.title && (
                        <p className="text-sm text-red-600 mt-1 font-raleway flex items-center gap-1">
                          <span>•</span> Title is required.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="description"
                        className="text-lg font-semibold text-primary3 font-rubik flex items-center gap-2"
                      >
                        Description
                        {formData.description && (
                          <span className="text-green-500 text-xs">✓</span>
                        )}
                      </label>
                      <input
                        id="description"
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Short description for notification"
                        className={`w-full rounded-xl border-2 px-5 py-4 text-lg focus:outline-none focus:ring-4 transition-all duration-300 ${
                          errors.description
                            ? "border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30"
                            : "border-gray-200 focus:border-primary2 focus:ring-primary2/10 bg-gray-50/30 focus:bg-white"
                        }`}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-600 mt-1 font-raleway flex items-center gap-1">
                          <span>•</span> Description is required.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="body"
                        className="text-lg font-semibold text-primary3 font-rubik flex items-center gap-2"
                      >
                        Contents
                        {formData.body && (
                          <span className="text-green-500 text-xs">✓</span>
                        )}
                      </label>
                      <textarea
                        id="body"
                        name="body"
                        value={formData.body}
                        onChange={handleInputChange}
                        rows={8}
                        placeholder="Agenda/program highlights"
                        className={`w-full rounded-xl border-2 px-5 py-4 text-lg focus:outline-none focus:ring-4 transition-all duration-300 resize-y min-h-[200px] ${
                          errors.body
                            ? "border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30"
                            : "border-gray-200 focus:border-primary2 focus:ring-primary2/10 bg-gray-50/30 focus:bg-white"
                        }`}
                      />
                      {errors.body && (
                        <p className="text-sm text-red-600 mt-1 font-raleway flex items-center gap-1">
                          <span>•</span> Content is required.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <label className="text-lg font-semibold text-primary3 font-rubik">
                        Additional Information
                      </label>
                      {!showAdditionalInfo && (
                        <button
                          type="button"
                          onClick={() => setShowAdditionalInfo(true)}
                          className="px-4 py-2 text-sm font-bold border-2 border-primary2 text-primary2 rounded-xl hover:bg-primary2 hover:text-white transition-all duration-300 font-rubik"
                        >
                          + Add Section
                        </button>
                      )}
                    </div>

                    {showAdditionalInfo && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        {details.map((section, idx) => (
                          <div
                            key={idx}
                            className="p-6 border-2 border-gray-200 rounded-2xl bg-gray-50/50 hover:border-primary2/30 transition-all duration-300"
                          >
                            <div className="flex gap-3 mb-4">
                              <input
                                type="text"
                                placeholder="Section header"
                                value={section.title}
                                onChange={(e) =>
                                  setDetails((prev) =>
                                    prev.map((s, i) =>
                                      i === idx
                                        ? { ...s, title: e.target.value }
                                        : s
                                    )
                                  )
                                }
                                className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-600 focus:outline-none focus:border-primary2 focus:ring-2 focus:ring-primary2/10 transition-all"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setDetails((prev) =>
                                    prev.filter((_, i) => i !== idx)
                                  )
                                }
                                className="px-4 py-2 rounded-xl bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 font-bold transition-all"
                              >
                                Remove
                              </button>
                            </div>

                            <textarea
                              placeholder="Section body (use new lines to separate items)"
                              value={section.body}
                              onChange={(e) =>
                                setDetails((prev) =>
                                  prev.map((s, i) =>
                                    i === idx
                                      ? { ...s, body: e.target.value }
                                      : s
                                  )
                                )
                              }
                              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-600 h-32 focus:outline-none focus:border-primary2 focus:ring-2 focus:ring-primary2/10 transition-all resize-y"
                            />
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() =>
                            setDetails((d) => [...d, { title: "", body: "" }])
                          }
                          className="w-full px-6 py-4 border-2 border-dashed border-primary2 text-primary2 rounded-2xl hover:bg-primary2 hover:text-white transition-all duration-300 font-bold font-rubik"
                        >
                          + Add Another Section
                        </button>
                      </div>
                    )}
                  </div>

                  {/* RSVP Link */}
                  <div className="space-y-2">
                    <label className="text-lg font-semibold text-primary3 font-rubik flex items-center gap-2">
                      RSVP Link
                    </label>
                    <input
                      type="url"
                      id="rsvp"
                      name="rsvp"
                      value={formData.rsvp}
                      onChange={handleInputChange}
                      placeholder="https://example.com/rsvp"
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-600 bg-gray-50/30 focus:bg-white focus:outline-none focus:border-primary2 focus:ring-4 focus:ring-primary2/10 transition-all duration-300"
                    />
                  </div>

                  {/* Visibility */}
                  <div className="space-y-2">
                    <label className="text-lg font-semibold text-primary3 font-rubik flex items-center gap-2">
                      Visibility
                    </label>
                    <div className="relative w-full">
                      <select
                        id="visibility"
                        name="visibility"
                        value={formData.visibility}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-600 bg-gray-50/30 focus:bg-white focus:outline-none focus:border-primary2 focus:ring-4 focus:ring-primary2/10 transition-all duration-300 appearance-none cursor-pointer"
                      >
                        <option value="" className="text-gray-400">
                          Select visibility
                        </option>
                        <option value="public">Public (Everyone)</option>
                        <option value="members">Members Only</option>
                        <option value="officers">Officers Only</option>
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-primary3">
                        <ChevronDown className="w-5 h-5" />
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 w-full" />

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                    {showGlobalError && (
                      <p className="text-red-500 text-sm font-bold font-raleway animate-pulse">
                        Please fill all required fields before publishing.
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 ml-auto w-full sm:w-auto">
                      {!editingId && (
                        <Link
                          href="/drafts"
                          className="px-6 py-3 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 hover:border-gray-300 transition-all duration-300 text-center"
                        >
                          View Drafts
                        </Link>
                      )}

                      {editingId && (
                        <Button
                          variant="outline"
                          type="button"
                          onClick={handleCancelEdit}
                          className="text-red-500 border-red-200 hover:bg-red-50"
                        >
                          Cancel Edit
                        </Button>
                      )}

                      {!editingId && (
                        <Button
                          variant="outline"
                          type="button"
                          onClick={handleSaveDraft}
                          disabled={isSubmitting}
                          className="px-6 py-3 border-2 border-primary2 text-primary2 rounded-xl font-bold hover:bg-primary2 hover:text-white transition-all duration-300"
                        >
                          Save Draft
                        </Button>
                      )}

                      <Button
                        variant="primary3"
                        type="button"
                        onClick={handlePublish}
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-primary3 text-white rounded-xl font-bold shadow-lg shadow-primary3/30 hover:shadow-primary3/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {editingId ? "Update Event" : "Publish"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {/* 2. MANAGE EVENTS LIST */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-primary3 font-rubik">
                      Manage Events
                    </h2>
                    <p className="text-gray-500 font-raleway text-sm mt-1">
                      Total: {eventList.length} events
                    </p>
                  </div>
                  <button
                    onClick={fetchEvents}
                    className="flex items-center gap-2 text-sm text-primary1 font-bold hover:bg-primary1/10 px-4 py-2 rounded-lg"
                  >
                    <RefreshCw size={16} /> Refresh List
                  </button>
                </div>

                <div className="overflow-x-auto">
                  {isLoadingList ? (
                    <div className="p-12 text-center text-gray-500 font-raleway">
                      Loading existing events...
                    </div>
                  ) : eventList.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 font-raleway">
                      No events found. Create one above!
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold font-rubik tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Title</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Mode</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-raleway">
                        {eventList.map((item) => (
                          <tr
                            key={item._id}
                            className={`hover:bg-blue-50/40 transition-colors group ${
                              editingId === item._id
                                ? "bg-blue-50 ring-1 ring-inset ring-primary1/30"
                                : ""
                            }`}
                          >
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-800 font-rubik">
                                {item.title}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-600">
                                {item.eventDate
                                  ? new Date(
                                      item.eventDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded text-xs font-bold ${
                                  item.mode === "Online"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-orange-100 text-orange-700"
                                }`}
                              >
                                {item.mode}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleEditClick(item)}
                                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                                  title="Edit"
                                >
                                  <Pencil size={18} />
                                </button>
                                <button
                                  onClick={() => confirmDelete(item._id)}
                                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setShowSuccessModal(false);
                setSubmitSuccess(false);
              }}
            />

            <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in duration-300">
              <div className="flex flex-col items-center gap-6">
                {/* Success Icon with Animation */}
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg relative">
                    <svg
                      className="w-12 h-12 text-white"
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

                <div className="text-center space-y-2">
                  <h3 className="text-2xl text-primary3 font-bold font-rubik">
                    {editingId
                      ? "Updated Successfully!"
                      : "Published Successfully!"}
                  </h3>
                  <p className="text-gray-600 font-raleway">
                    {editingId
                      ? "Event details have been updated."
                      : "Your event has been successfully created and is now live."}
                  </p>
                </div>

                <div className="flex gap-3 mt-2 w-full">
                  <Button
                    variant="primary3"
                    onClick={() => {
                      setShowSuccessModal(false);
                      setSubmitSuccess(false);
                      router.push("/events");
                    }}
                    className="w-full"
                  >
                    View Events
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSuccessModal(false);
                      setSubmitSuccess(false);
                    }}
                    className="w-full"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 font-rubik mb-2">
              Confirm Deletion
            </h3>
            <p className="text-gray-500 font-raleway mb-6">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
