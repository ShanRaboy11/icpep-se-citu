"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "../../components/sidebar";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "../../components/grid";
import { GlassCard } from "../../components/glass-card";
import {
  Pencil,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Globe,
  Users,
  Shield,
  Check,
  Upload,
  Plus,
  X,
  Calendar,
  Tag,
  MapPin,
} from "lucide-react";
import eventService from "../../services/event";

type FormErrors = {
  date: boolean;
  time: boolean;
  title: boolean;
  description: boolean;
  body: boolean;
};

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

const VISIBILITY_OPTIONS = [
  {
    value: "public",
    label: "Public",
    sublabel: "Everyone can see this",
    icon: Globe,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  {
    value: "members",
    label: "Members Only",
    sublabel: "Registered members",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  {
    value: "officers",
    label: "Officers Only",
    sublabel: "Organization officers",
    icon: Shield,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    dot: "bg-violet-500",
  },
] as const;

const predefinedTags = ["Workshop", "Seminar", "Training", "Webinar"];

export default function EventsPage() {
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [dateConflictError, setDateConflictError] = useState(false);
  const [registrationRequired, setRegistrationRequired] = useState(false);
  const [registrationStart, setRegistrationStart] = useState("");
  const [registrationEnd, setRegistrationEnd] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState<
    "saving" | "publishing" | null
  >(null);
  const [successMessage, setSuccessMessage] = useState({
    title: "",
    description: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const editIdParam = searchParams.get("edit");

  const [eventList, setEventList] = useState<EventItem[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);

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
    { category: string; price: string }[]
  >([]);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [details, setDetails] = useState<{ title: string; body: string }[]>([
    { title: "", body: "" },
  ]);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  useEffect(() => {
    if (editIdParam) {
      const fetchEvent = async () => {
        try {
          const response = await eventService.getEventById(editIdParam);
          const data = response.data as any;
          if (data) {
            setEditingId(data._id);
            setIsEditingDraft(!data.isPublished);
            setFormData({
              date: data.eventDate
                ? new Date(data.eventDate).toISOString().split("T")[0]
                : "",
              time: data.time || "",
              title: data.title,
              description: data.description,
              body: data.content,
              rsvp: data.rsvpLink || "",
              contact: data.contact || "",
              location: data.location || "",
              visibility: "public",
            });
            setMode(data.mode);
            if (data.tags) setTags(data.tags);
            if (data.admissions) {
              setAdmissions(
                data.admissions.map((a: any) => ({
                  category: a.category,
                  price: String(a.price),
                })),
              );
              setShowAdmissionInput(true);
            }
            if (data.details) setDetails(data.details);
            if (data.coverImage) setPreviews([data.coverImage]);
            if (data.organizer)
              setOrganizer(
                typeof data.organizer === "string"
                  ? data.organizer
                  : data.organizer.name,
              );
            if (data.registrationRequired)
              setRegistrationRequired(data.registrationRequired);
            if (data.registrationStart)
              setRegistrationStart(
                new Date(data.registrationStart).toISOString().split("T")[0],
              );
            if (data.registrationEnd)
              setRegistrationEnd(
                new Date(data.registrationEnd).toISOString().split("T")[0],
              );
          }
        } catch (error) {
          console.error("Failed to fetch event for edit:", error);
        }
      };
      fetchEvent();
    }
  }, [editIdParam]);

  const fetchEvents = async () => {
    setIsLoadingList(true);
    try {
      const response = await eventService.getEvents({ limit: 100 });
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

  const handleEditClick = (item: EventItem) => {
    setEditingId(item._id);
    setIsEditingDraft(!item.isPublished);
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
    setMode(item.mode);
    setTags(item.tags || []);
    setAdmissions(item.admissions || []);
    setOrganizer(
      typeof item.organizer === "object"
        ? (item.organizer as any).name
        : item.organizer || "",
    );
    setRegistrationRequired(!!item.registrationRequired);
    setRegistrationStart(
      item.registrationStart
        ? new Date(item.registrationStart).toISOString().slice(0, 16)
        : "",
    );
    setRegistrationEnd(
      item.registrationEnd
        ? new Date(item.registrationEnd).toISOString().slice(0, 16)
        : "",
    );
    if (item.details && item.details.length > 0) {
      setDetails(
        item.details.map((d) => ({ title: d.title, body: d.items.join("\n") })),
      );
      setShowAdditionalInfo(true);
    } else {
      setDetails([{ title: "", body: "" }]);
      setShowAdditionalInfo(false);
    }
    setPreviews(item.coverImage ? [item.coverImage] : []);
    setImages([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    setDateConflictError(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsEditingDraft(false);
    resetForm();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
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
      setSuccessMessage({
        title: "Deleted Successfully!",
        description: "The event has been permanently removed.",
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event");
    }
  };

  const buildEventData = (isPublished: boolean) => {
    const audienceMap: Record<string, string[]> = {
      public: ["all"],
      members: ["members"],
      officers: ["officers"],
    };
    return {
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
      mode,
      tags: tags.length > 0 ? tags : undefined,
      admissions: admissions.length > 0 ? admissions : undefined,
      registrationRequired,
      registrationStart: registrationStart || undefined,
      registrationEnd: registrationEnd || undefined,
      targetAudience: formData.visibility
        ? audienceMap[formData.visibility]
        : ["all"],
      isPublished,
      publishDate: isPublished ? new Date().toISOString() : undefined,
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
    setDateConflictError(false);
    if (Object.values(newErrors).some(Boolean)) {
      setShowGlobalError(true);
      return;
    }
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    if (formData.date === todayStr) {
      setDateConflictError(true);
      document
        .getElementById("date")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setIsSubmitting(true);
    setLoadingAction("publishing");
    setShowGlobalError(false);
    try {
      const eventData = buildEventData(true);
      if (editingId)
        await eventService.updateEvent(
          editingId,
          eventData,
          images.length > 0 ? images : undefined,
        );
      else
        await eventService.createEvent(
          eventData,
          images.length > 0 ? images : undefined,
        );
      setSubmitSuccess(true);
      setSuccessMessage({
        title:
          editingId && !isEditingDraft
            ? "Updated Successfully!"
            : "Published Successfully!",
        description:
          editingId && !isEditingDraft
            ? "Changes have been saved."
            : "Event is now live.",
      });
      setShowSuccessModal(true);
      handleCancelEdit();
      fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event.");
    } finally {
      setIsSubmitting(false);
      setLoadingAction(null);
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    setLoadingAction("saving");
    try {
      const eventData = buildEventData(false);
      if (editingId)
        await eventService.updateEvent(
          editingId,
          eventData,
          images.length > 0 ? images : undefined,
        );
      else
        await eventService.createEvent(
          eventData,
          images.length > 0 ? images : undefined,
        );
      setSubmitSuccess(true);
      setSuccessMessage({
        title: editingId ? "Draft Updated!" : "Draft Saved!",
        description: editingId
          ? "Draft changes have been saved."
          : "Draft has been saved successfully.",
      });
      setShowSuccessModal(true);
      handleCancelEdit();
      fetchEvents();
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft.");
    } finally {
      setIsSubmitting(false);
      setLoadingAction(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (Object.prototype.hasOwnProperty.call(errors, name))
      setErrors((prev) => ({ ...prev, [name as keyof FormErrors]: false }));
    if (name === "date") setDateConflictError(false);
  };

  const resizeImage = (file: File, maxWidth = 1200): Promise<File> =>
    new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = maxWidth;
        canvas.height = img.height * (maxWidth / img.width);
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            resolve(new File([blob], file.name, { type: file.type }));
          },
          file.type,
          0.8,
        );
      };
      reader.readAsDataURL(file);
    });

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const resized = await resizeImage(file);
      setImages([resized]);
      setPreviews([URL.createObjectURL(resized)]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const resized = await resizeImage(file);
      setImages([resized]);
      setPreviews([URL.createObjectURL(resized)]);
    } catch (err) {
      console.error(err);
    }
  };

  const publishedItems = eventList.filter((item) => item.isPublished);

  const inputCls = (hasError: boolean) =>
    `w-full font-raleway text-primary3 font-medium rounded-xl px-4 py-3.5 border-2 bg-white/80 transition-all duration-200 outline-none placeholder:text-gray-300 ${hasError ? "border-red-300 focus:border-red-400 bg-red-50/30" : "border-gray-200 focus:border-primary2 focus:bg-white"}`;

  const Divider = () => <div className="h-px bg-gray-100 w-full" />;

  return (
    <section className="min-h-screen bg-[#f8f9fc] flex flex-col relative overflow-x-hidden">
      <Grid />

      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-md">
          <div className="flex flex-col items-center gap-5">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-primary2/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary2 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-primary3 font-bold font-rubik text-lg">
                {loadingAction === "saving"
                  ? "Saving Draft"
                  : editingId
                    ? "Updating Event"
                    : "Publishing Event"}
              </p>
              <p className="text-gray-400 text-sm font-raleway mt-1">
                Please wait a moment...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20">
          {/* PAGE HEADER */}
          <div className="mb-14">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-primary2 uppercase font-raleway mb-3">
              <span className="w-8 h-px bg-primary2 inline-block" />
              Event Management
            </div>
            <h1 className="text-4xl sm:text-7xl font-black font-rubik leading-[0.9] tracking-tight">
              <span className="bg-gradient-to-br from-primary3 via-primary1 to-primary2 bg-clip-text text-transparent">
                {editingId ? "Edit\nEvent" : "Compose\nEvent"}
              </span>
            </h1>
            <p className="text-gray-500 font-raleway text-base mt-4 max-w-sm">
              {editingId
                ? "Update event details and republish"
                : "Create and schedule upcoming chapter events"}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <Sidebar />
              </div>
            </aside>

            <div className="flex-1 min-w-0 space-y-8">
              {/* FORM CARD */}
              <GlassCard>
                <div
                  className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${editingId ? "ring-2 ring-primary1" : ""}`}
                >
                  <div className="absolute inset-0 bg-white" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-primary2/5 pointer-events-none" />

                  {editingId && (
                    <div className="relative z-10 bg-gradient-to-r from-primary1 to-primary2 px-6 py-3 flex items-center justify-between">
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

                  <div className="relative z-10 p-6 sm:p-10 space-y-10">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-black font-rubik text-primary3">
                          {editingId ? "Edit Details" : "New Event"}
                        </h2>
                        <p className="text-gray-400 text-sm font-raleway mt-0.5">
                          Fill in the fields below to create an event
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 bg-primary2/8 rounded-full px-4 py-2">
                        <Calendar size={12} className="text-primary2" />
                        <span className="text-xs font-bold text-primary2 font-rubik uppercase tracking-wider">
                          Event
                        </span>
                      </div>
                    </div>

                    {/* COVER IMAGE */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                        Cover Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImagesChange}
                        ref={fileInputRef}
                      />
                      {previews.length > 0 ? (
                        <div className="relative group rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50 h-56">
                          <img
                            src={previews[0]}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-white text-primary3 text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform font-rubik"
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                try {
                                  URL.revokeObjectURL(previews[0]);
                                } catch {}
                                setImages([]);
                                setPreviews([]);
                              }}
                              className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform font-rubik"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => fileInputRef.current?.click()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                              fileInputRef.current?.click();
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                          }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={handleDrop}
                          className={`cursor-pointer h-56 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4 ${isDragging ? "border-primary2 bg-primary2/5 scale-[1.01]" : "border-gray-200 bg-gray-50/80 hover:border-primary2/60 hover:bg-primary2/3"}`}
                        >
                          <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? "bg-primary2 text-white" : "bg-white text-primary2 shadow-md"}`}
                          >
                            <Upload size={22} strokeWidth={2.5} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-gray-700 font-rubik">
                              {isDragging ? "Drop it!" : "Upload cover image"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 font-raleway">
                              Drag & drop or click · PNG, JPG
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <Divider />

                    {/* TAGS */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2 items-center p-4 bg-gray-50/80 rounded-xl border-2 border-gray-100">
                        {predefinedTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() =>
                              setTags((prev) =>
                                prev.includes(tag)
                                  ? prev.filter((t) => t !== tag)
                                  : [...prev, tag],
                              )
                            }
                            className={`px-4 py-2 text-xs font-bold rounded-xl border-2 transition-all duration-200 font-rubik ${tags.includes(tag) ? "bg-primary2 text-white border-primary2 shadow-md" : "border-gray-200 text-gray-500 bg-white hover:border-primary2/50 hover:text-primary2"}`}
                          >
                            {tag}
                          </button>
                        ))}
                        {!showTagInput ? (
                          <button
                            type="button"
                            onClick={() => setShowTagInput(true)}
                            className="flex items-center gap-1 px-4 py-2 border-2 border-dashed border-primary2/40 text-primary2 rounded-xl hover:border-primary2 hover:bg-primary2/5 transition-all font-rubik text-xs font-bold"
                          >
                            <Plus size={12} /> Custom
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  if (newTag.trim())
                                    setTags((p) => [...p, newTag.trim()]);
                                  setNewTag("");
                                  setShowTagInput(false);
                                }
                              }}
                              className="border-2 border-primary2 rounded-xl px-3 py-2 font-rubik text-xs focus:outline-none w-32"
                              placeholder="Tag name..."
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newTag.trim())
                                  setTags((p) => [...p, newTag.trim()]);
                                setNewTag("");
                                setShowTagInput(false);
                              }}
                              className="px-3 py-2 bg-gradient-to-r from-primary1 to-primary2 text-white rounded-xl text-xs font-bold"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setNewTag("");
                                setShowTagInput(false);
                              }}
                              className="px-3 py-2 border-2 border-gray-200 text-gray-500 rounded-xl text-xs font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag, i) => (
                            <span
                              key={i}
                              className="flex items-center gap-2 bg-white border-2 border-primary2/20 text-primary3 font-bold font-rubik px-3 py-1.5 rounded-xl text-xs shadow-sm"
                            >
                              <Tag size={10} className="text-primary2" />
                              {tag}
                              <button
                                type="button"
                                onClick={() =>
                                  setTags(tags.filter((_, idx) => idx !== i))
                                }
                                className="hover:text-red-500 transition-colors"
                              >
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <Divider />

                    {/* EVENT SCHEDULE */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 font-rubik">
                          Event Schedule
                        </h3>
                        <p className="text-xs text-gray-400 font-raleway mt-0.5">
                          Date, time, and location details
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                            Date <span className="text-red-400">*</span>
                          </label>
                          <input
                            id="date"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className={inputCls(
                              errors.date || dateConflictError,
                            )}
                          />
                          {errors.date && (
                            <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                              <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                              Date is required
                            </p>
                          )}
                          {dateConflictError && (
                            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-amber-700 font-raleway">
                                Today's date is not allowed. Use a past or
                                future date.
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                            Time <span className="text-red-400">*</span>
                          </label>
                          <input
                            id="time"
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            className={inputCls(errors.time)}
                          />
                          {errors.time && (
                            <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                              <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                              Time is required
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                            Location
                          </label>
                          <div className="relative">
                            <MapPin
                              size={14}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                            />
                            <input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              placeholder="Where is it happening?"
                              className={`${inputCls(false)} pl-9`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Mode */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                          Event Mode
                        </label>
                        <div className="flex gap-2 p-1 bg-gray-100/80 rounded-xl border border-gray-200 w-fit">
                          {(["Onsite", "Online"] as const).map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setMode(m)}
                              className={`px-6 py-2.5 rounded-lg text-xs font-bold font-rubik transition-all duration-200 ${mode === m ? "bg-white text-primary1 shadow-sm ring-1 ring-black/5" : "text-gray-400 hover:text-gray-600"}`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Admission */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                            Admission Prices
                          </label>
                          {!showAdmissionInput && (
                            <button
                              type="button"
                              onClick={() => setShowAdmissionInput(true)}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border-2 border-primary2/30 text-primary2 rounded-lg hover:border-primary2 hover:bg-primary2/5 transition-all font-rubik"
                            >
                              <Plus size={11} /> Add
                            </button>
                          )}
                        </div>
                        {showAdmissionInput && (
                          <div className="flex flex-col sm:flex-row gap-3 p-4 border-2 border-gray-100 rounded-xl bg-gray-50/60">
                            <input
                              type="text"
                              placeholder="Category (e.g., General)"
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              className="flex-1 border-2 border-white bg-white rounded-xl px-4 py-2.5 font-rubik text-sm focus:outline-none focus:border-primary2 transition-all"
                              autoFocus
                            />
                            <input
                              type="text"
                              placeholder="Price"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              className="w-full sm:w-28 border-2 border-white bg-white rounded-xl px-4 py-2.5 font-rubik text-sm focus:outline-none focus:border-primary2 transition-all"
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  if (!category.trim()) return;
                                  setAdmissions((p) => [
                                    ...p,
                                    { category, price: price.trim() || "Free" },
                                  ]);
                                  setCategory("");
                                  setPrice("");
                                  setShowAdmissionInput(false);
                                }}
                                className="px-5 py-2.5 bg-gradient-to-r from-primary1 to-primary2 text-white rounded-xl font-bold text-xs font-rubik shadow-sm"
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
                                className="px-4 py-2.5 border-2 border-gray-200 bg-white text-gray-500 rounded-xl font-bold text-xs font-rubik"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                        {admissions.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {admissions.map((ad, i) => (
                              <span
                                key={i}
                                className="flex items-center gap-2 bg-white border-2 border-primary2/20 text-primary3 font-bold font-rubik px-4 py-2 rounded-xl text-sm shadow-sm"
                              >
                                <span>{ad.category}</span>
                                <span className="text-primary2 bg-primary2/10 px-2 py-0.5 rounded-lg text-xs">
                                  {ad.price}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setAdmissions(
                                      admissions.filter((_, idx) => idx !== i),
                                    )
                                  }
                                  className="hover:text-red-500 transition-colors"
                                >
                                  <X size={12} />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <Divider />

                    {/* REGISTRATION */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                          Registration
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <div
                            className={`w-10 h-5 rounded-full transition-all duration-200 relative ${registrationRequired ? "bg-primary2" : "bg-gray-200"}`}
                            onClick={() => setRegistrationRequired((p) => !p)}
                          >
                            <div
                              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${registrationRequired ? "left-5" : "left-0.5"}`}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-500 font-rubik">
                            Required
                          </span>
                        </label>
                      </div>
                      {registrationRequired && (
                        <div className="grid sm:grid-cols-2 gap-4 p-5 border-2 border-gray-100 rounded-xl bg-gray-50/60">
                          <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                              Opens
                            </label>
                            <input
                              type="datetime-local"
                              value={registrationStart}
                              onChange={(e) =>
                                setRegistrationStart(e.target.value)
                              }
                              className={inputCls(false)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                              Closes
                            </label>
                            <input
                              type="datetime-local"
                              value={registrationEnd}
                              onChange={(e) =>
                                setRegistrationEnd(e.target.value)
                              }
                              className={inputCls(false)}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Divider />

                    {/* ORGANIZER & CONTACT */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                          Organizer
                        </label>
                        <input
                          type="text"
                          placeholder="Organizer name or group"
                          value={organizer}
                          onChange={(e) => setOrganizer(e.target.value)}
                          className={inputCls(false)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          name="contact"
                          placeholder="organizer@example.com"
                          value={formData.contact}
                          onChange={handleInputChange}
                          className={inputCls(false)}
                        />
                      </div>
                    </div>

                    <Divider />

                    {/* EVENT CONTENT */}
                    <div className="space-y-5">
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 font-rubik">
                        Event Content
                      </h3>
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                          Event Title <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="title"
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Add a clear and descriptive title"
                          className={inputCls(errors.title)}
                        />
                        {errors.title && (
                          <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                            Title is required
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                          Description <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="description"
                          type="text"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Short description for notifications"
                          className={inputCls(errors.description)}
                        />
                        {errors.description && (
                          <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                            Description is required
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                            Contents <span className="text-red-400">*</span>
                          </label>
                          <span className="text-[11px] text-gray-300 font-raleway">
                            {formData.body.length} chars
                          </span>
                        </div>
                        <textarea
                          id="body"
                          name="body"
                          value={formData.body}
                          onChange={handleInputChange}
                          rows={7}
                          placeholder="Agenda / program highlights..."
                          className={`${inputCls(errors.body)} resize-y min-h-[180px]`}
                        />
                        {errors.body && (
                          <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                            Content is required
                          </p>
                        )}
                      </div>
                    </div>

                    <Divider />

                    {/* ADDITIONAL SECTIONS */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                          Additional Sections
                        </label>
                        {!showAdditionalInfo && (
                          <button
                            type="button"
                            onClick={() => setShowAdditionalInfo(true)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border-2 border-primary2/30 text-primary2 rounded-lg hover:border-primary2 hover:bg-primary2/5 transition-all font-rubik"
                          >
                            <Plus size={11} /> Add Section
                          </button>
                        )}
                      </div>
                      {showAdditionalInfo && (
                        <div className="space-y-4">
                          {details.map((section, idx) => (
                            <div
                              key={idx}
                              className="p-5 border-2 border-gray-100 rounded-xl bg-gray-50/50 space-y-3"
                            >
                              <div className="flex gap-3">
                                <input
                                  type="text"
                                  placeholder="Section header"
                                  value={section.title}
                                  onChange={(e) =>
                                    setDetails((p) =>
                                      p.map((s, i) =>
                                        i === idx
                                          ? { ...s, title: e.target.value }
                                          : s,
                                      ),
                                    )
                                  }
                                  className="flex-1 rounded-xl border-2 border-white bg-white px-4 py-2.5 text-sm font-rubik focus:outline-none focus:border-primary2 transition-all"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDetails((p) =>
                                      p.filter((_, i) => i !== idx),
                                    )
                                  }
                                  className="px-3 py-2.5 rounded-xl bg-white border-2 border-red-100 text-red-400 hover:bg-red-50 text-xs font-bold font-rubik transition-all"
                                >
                                  Remove
                                </button>
                              </div>
                              <textarea
                                placeholder="Section body (new lines = separate items)"
                                value={section.body}
                                onChange={(e) =>
                                  setDetails((p) =>
                                    p.map((s, i) =>
                                      i === idx
                                        ? { ...s, body: e.target.value }
                                        : s,
                                    ),
                                  )
                                }
                                className="w-full rounded-xl border-2 border-white bg-white px-4 py-3 text-sm font-raleway text-gray-600 h-28 focus:outline-none focus:border-primary2 transition-all resize-y"
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              setDetails((d) => [...d, { title: "", body: "" }])
                            }
                            className="w-full px-6 py-3.5 border-2 border-dashed border-primary2/30 text-primary2 rounded-xl hover:border-primary2 hover:bg-primary2/5 transition-all font-bold font-rubik text-sm flex items-center justify-center gap-2"
                          >
                            <Plus size={14} /> Add Another Section
                          </button>
                        </div>
                      )}
                    </div>

                    <Divider />

                    {/* RSVP */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                        RSVP Link
                      </label>
                      <input
                        type="url"
                        name="rsvp"
                        value={formData.rsvp}
                        onChange={handleInputChange}
                        placeholder="https://example.com/rsvp"
                        className={inputCls(false)}
                      />
                    </div>

                    {/* VISIBILITY */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                        Visibility
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {VISIBILITY_OPTIONS.map((opt) => {
                          const Icon = opt.icon;
                          const isActive = formData.visibility === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() =>
                                setFormData((p) => ({
                                  ...p,
                                  visibility: opt.value,
                                }))
                              }
                              className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-left border-2 transition-all duration-200 ${isActive ? `${opt.bg} ${opt.color} ${opt.border} shadow-sm scale-[1.02]` : "bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600"}`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? opt.dot : "bg-gray-200"}`}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold font-rubik leading-tight">
                                  {opt.label}
                                </p>
                                <p
                                  className={`text-[10px] font-raleway mt-0.5 truncate ${isActive ? "opacity-70" : "text-gray-300"}`}
                                >
                                  {opt.sublabel}
                                </p>
                              </div>
                              {isActive && (
                                <Check
                                  size={12}
                                  className="flex-shrink-0 opacity-70"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <Divider />

                    {/* ACTIONS */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      {showGlobalError && (
                        <p className="text-red-400 text-xs font-bold font-raleway flex items-center gap-1.5">
                          <AlertTriangle size={12} /> Please fill all required
                          fields
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 ml-auto">
                        {editingId && (
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-5 py-2.5 text-sm font-bold font-rubik text-gray-400 hover:text-red-400 border-2 border-gray-200 hover:border-red-200 rounded-xl transition-all duration-200"
                          >
                            Cancel
                          </button>
                        )}
                        {(!editingId || isEditingDraft) && (
                          <button
                            type="button"
                            onClick={handleSaveDraft}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-sm font-bold font-rubik text-primary1 border-2 border-primary1/30 hover:border-primary1 hover:bg-primary1/5 rounded-xl transition-all duration-200"
                          >
                            {editingId ? "Update Draft" : "Save Draft"}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handlePublish}
                          disabled={isSubmitting}
                          className="px-7 py-2.5 text-sm font-bold font-rubik text-white bg-gradient-to-r from-primary1 to-primary2 rounded-xl shadow-lg shadow-primary2/25 hover:shadow-primary2/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {editingId && !isEditingDraft
                            ? "Update Event"
                            : "Publish Event"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* MANAGE LIST */}
              <GlassCard>
                <div className="bg-white rounded-2xl overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h2 className="text-xl font-black font-rubik text-primary3">
                        Manage Events
                      </h2>
                      <p className="text-gray-400 text-xs font-raleway mt-0.5 tracking-wide">
                        {publishedItems.length} published{" "}
                        {publishedItems.length === 1 ? "event" : "events"}
                      </p>
                    </div>
                    <button
                      onClick={fetchEvents}
                      className="flex items-center gap-2 text-xs font-bold font-rubik text-primary1 border border-primary1/20 hover:border-primary1/50 hover:bg-primary1/5 px-4 py-2 rounded-full transition-all duration-200"
                    >
                      <RefreshCw
                        size={13}
                        className={isLoadingList ? "animate-spin" : ""}
                      />{" "}
                      Refresh
                    </button>
                  </div>

                  {isLoadingList ? (
                    <div className="py-20 flex flex-col items-center gap-3 text-gray-300">
                      <div className="w-8 h-8 border-2 border-gray-200 border-t-primary2 rounded-full animate-spin" />
                      <p className="text-sm font-raleway">Loading events...</p>
                    </div>
                  ) : publishedItems.length === 0 ? (
                    <div className="py-20 flex flex-col items-center gap-4 text-gray-300">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                        <Calendar size={24} className="text-gray-300" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold font-rubik text-gray-400">
                          No events yet
                        </p>
                        <p className="text-xs font-raleway mt-0.5">
                          Create one using the form above
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[640px]">
                        <thead>
                          <tr className="bg-gray-50/80">
                            <th className="px-8 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                              Cover
                            </th>
                            <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                              Title
                            </th>
                            <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                              Date
                            </th>
                            <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                              Mode
                            </th>
                            <th className="px-8 py-3.5 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {publishedItems.map((item) => {
                            const isEditing = editingId === item._id;
                            const online = item.mode === "Online";
                            return (
                              <tr
                                key={item._id}
                                className={`group border-t border-gray-50 transition-all duration-200 ${isEditing ? "bg-primary1/5" : "hover:bg-gray-50/70"}`}
                              >
                                <td className="px-8 py-4">
                                  <div className="w-14 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                                    {item.coverImage ? (
                                      <img
                                        src={item.coverImage}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <Calendar
                                        size={14}
                                        className="text-gray-300"
                                      />
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-2">
                                    {isEditing && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-primary1 animate-pulse flex-shrink-0" />
                                    )}
                                    <span className="font-bold text-sm text-gray-800 font-rubik">
                                      {item.title}
                                    </span>
                                  </div>
                                  {item.description && (
                                    <p className="text-xs text-gray-400 font-raleway mt-0.5 max-w-[200px] truncate">
                                      {item.description}
                                    </p>
                                  )}
                                </td>
                                <td className="px-4 py-4">
                                  <span className="text-xs text-gray-600 font-raleway">
                                    {item.eventDate
                                      ? new Date(
                                          item.eventDate,
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${online ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-orange-50 text-orange-700 border-orange-200"}`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${online ? "bg-emerald-500" : "bg-orange-400"}`}
                                    />
                                    {item.mode}
                                  </span>
                                </td>
                                <td className="px-8 py-4 text-right">
                                  <div className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => handleEditClick(item)}
                                      className="p-2 text-gray-400 hover:text-primary1 hover:bg-primary1/10 rounded-lg transition-all duration-150"
                                      title="Edit"
                                    >
                                      <Pencil size={15} />
                                    </button>
                                    <button
                                      onClick={() => confirmDelete(item._id)}
                                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150"
                                      title="Delete"
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
              </GlassCard>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-primary3 font-rubik mb-2">
              Delete Event?
            </h3>
            <p className="text-gray-400 text-sm font-raleway mb-6 leading-relaxed">
              This will permanently remove the event. This action cannot be
              undone.
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowSuccessModal(false);
              setSubmitSuccess(false);
            }}
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
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setSubmitSuccess(false);
                  router.push("/events");
                }}
                className="w-full py-3 text-sm font-bold font-rubik text-white bg-gradient-to-r from-primary1 to-primary2 rounded-xl shadow-lg hover:shadow-primary2/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                View Events
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setSubmitSuccess(false);
                }}
                className="w-full py-3 text-sm font-bold font-rubik text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
