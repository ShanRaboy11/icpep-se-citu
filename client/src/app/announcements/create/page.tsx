"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "../../components/sidebar";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "@/app/components/grid";
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
  Megaphone,
  MapPin,
  Clock,
  Calendar,
} from "lucide-react";
import announcementService, {
  AnnouncementData,
} from "../../services/announcement";

type FormErrors = {
  date: boolean;
  time: boolean;
  title: boolean;
  summary: boolean;
  body: boolean;
  visibility: boolean;
  attendanceLink?: boolean;
  agenda?: boolean;
  image?: boolean;
};

interface AnnouncementItem {
  _id: string;
  title: string;
  description: string;
  content: string;
  type: "General" | "Meeting" | "Achievement" | "News";
  targetAudience: string[];
  isPublished: boolean;
  publishDate: string;
  time?: string;
  location?: string;
  organizer?: string;
  attendees?: string;
  awardees?: { name: string; program: string; year: string; award: string }[];
  agenda?: string[];
  imageUrl?: string;
  date?: string;
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

type ActiveTab = "General" | "News" | "Meeting" | "Achievement";
const tabs: ActiveTab[] = ["General", "News", "Meeting", "Achievement"];

const TYPE_META: Record<
  string,
  { color: string; bg: string; border: string; dot: string }
> = {
  Meeting: {
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    dot: "bg-violet-500",
  },
  Achievement: {
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  News: {
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  General: {
    color: "text-gray-700",
    bg: "bg-gray-100",
    border: "border-gray-200",
    dot: "bg-gray-400",
  },
};

export default function AnnouncementsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("General");
  const [showOrganizerInput, setShowOrganizerInput] = useState(false);
  const [organizer, setOrganizer] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [awardees, setAwardees] = useState([
    { name: "", program: "", year: "", award: "" },
  ]);
  const [agenda, setAgenda] = useState<string[]>([""]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showGlobalError, setShowGlobalError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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

  const router = useRouter();
  const searchParams = useSearchParams();
  const editIdParam = searchParams.get("edit");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    body: "",
    visibility: "",
    attendanceLink: "",
    date: "",
    time: "",
    location: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    date: false,
    time: false,
    title: false,
    summary: false,
    body: false,
    visibility: false,
    attendanceLink: false,
    agenda: false,
    image: false,
  });
  const [announcementList, setAnnouncementList] = useState<AnnouncementItem[]>(
    [],
  );
  const [isLoadingList, setIsLoadingList] = useState(true);

  // Fetch on edit param
  useEffect(() => {
    if (editIdParam) {
      const fetchAnnouncement = async () => {
        try {
          const response =
            await announcementService.getAnnouncementById(editIdParam);
          const data = response.data as any;
          if (data) {
            setEditingId(data._id);
            setIsEditingDraft(!data.isPublished);
            setFormData({
              title: data.title,
              summary: data.description,
              body: data.content,
              visibility: "public",
              date: data.date || "",
              time: data.time || "",
              location: data.location || "",
              attendanceLink: "",
            });
            setActiveTab(data.type as ActiveTab);
            if (data.agenda) setAgenda(data.agenda);
            if (data.awardees) setAwardees(data.awardees);
            if (data.organizer) {
              setOrganizer(data.organizer);
              setShowOrganizerInput(true);
            }
            if (data.imageUrl) setPreviews([data.imageUrl]);
          }
        } catch (error) {
          console.error("Failed to fetch announcement for edit:", error);
        }
      };
      fetchAnnouncement();
    }
  }, [editIdParam]);

  const fetchAnnouncements = async () => {
    setIsLoadingList(true);
    try {
      const response = await announcementService.getAnnouncements({
        limit: 100,
      });
      const data = response.data || (Array.isArray(response) ? response : []);
      setAnnouncementList(data as AnnouncementItem[]);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleEditClick = (item: AnnouncementItem) => {
    setEditingId(item._id);
    setIsEditingDraft(!item.isPublished);
    setFormData({
      title: item.title,
      summary: item.description,
      body: item.content,
      date: item.date ? new Date(item.date).toISOString().split("T")[0] : "",
      time: item.time || "",
      location: item.location || "",
      attendanceLink: item.attendees || "",
      visibility: item.targetAudience?.includes("members")
        ? "members"
        : item.targetAudience?.includes("officers")
          ? "officers"
          : "public",
    });
    setOrganizer(item.organizer || "");
    setShowOrganizerInput(!!item.organizer);
    let tabToSet: ActiveTab = "General";
    if (item.type === "Meeting") tabToSet = "Meeting";
    if (item.type === "Achievement") tabToSet = "Achievement";
    if (item.type === "News") tabToSet = "News";
    setActiveTab(tabToSet);
    if (item.type === "Meeting" && item.agenda?.length) setAgenda(item.agenda);
    else setAgenda([""]);
    if (item.type === "Achievement" && item.awardees?.length)
      setAwardees(item.awardees);
    else setAwardees([{ name: "", program: "", year: "", award: "" }]);
    if (!item.isPublished && item.publishDate) {
      const pDate = new Date(item.publishDate);
      setShowSchedule(true);
      setScheduleDate(pDate.toISOString().split("T")[0]);
      setScheduleTime(pDate.toTimeString().slice(0, 5));
    } else {
      setShowSchedule(false);
      setScheduleDate("");
      setScheduleTime("");
    }
    setPreviews(item.imageUrl ? [item.imageUrl] : []);
    setImages([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      summary: "",
      body: "",
      visibility: "",
      date: "",
      time: "",
      location: "",
      attendanceLink: "",
    });
    setOrganizer("");
    setAwardees([{ name: "", program: "", year: "", award: "" }]);
    setAgenda([""]);
    setImages([]);
    setPreviews([]);
    setShowSchedule(false);
    setScheduleDate("");
    setScheduleTime("");
    setShowOrganizerInput(false);
    setActiveTab("General");
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
      await announcementService.deleteAnnouncement(itemToDelete);
      fetchAnnouncements();
      setShowDeleteModal(false);
      setItemToDelete(null);
      setSuccessMessage({
        title: "Deleted Successfully!",
        description: "The announcement has been permanently removed.",
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to delete announcement:", error);
      alert("Failed to delete announcement.");
    }
  };

  const buildAnnouncementData = (isPublished: boolean) => {
    const typeMap: Record<ActiveTab, AnnouncementData["type"]> = {
      General: "General",
      News: "General",
      Meeting: "Meeting",
      Achievement: "Achievement",
    };
    const audienceMap: Record<string, string[]> = {
      public: ["all"],
      members: ["members"],
      officers: ["officers"],
    };
    return {
      title: formData.title || "Untitled Draft",
      description: formData.summary || "No description",
      content: formData.body || "No content",
      type: typeMap[activeTab],
      targetAudience: formData.visibility
        ? audienceMap[formData.visibility]
        : ["all"],
      isPublished,
      publishDate: isPublished
        ? showSchedule && scheduleDate
          ? new Date(`${scheduleDate}T${scheduleTime || "00:00"}`).toISOString()
          : new Date().toISOString()
        : undefined,
      time: formData.time || undefined,
      location: formData.location || undefined,
      organizer: organizer || undefined,
      attendees: activeTab === "Meeting" ? formData.attendanceLink : undefined,
      awardees:
        activeTab === "Achievement"
          ? awardees.filter((a) => a.name.trim())
          : undefined,
      agenda:
        activeTab === "Meeting" ? agenda.filter((a) => a.trim()) : undefined,
      date: formData.date || undefined,
    };
  };

  const handlePublish = async () => {
    const newErrors: FormErrors = {
      date: !formData.date.trim(),
      time: !formData.time.trim(),
      title: !formData.title.trim(),
      summary: !formData.summary.trim(),
      body: !formData.body.trim(),
      visibility: !formData.visibility.trim(),
    };
    if (activeTab === "Meeting" && !formData.attendanceLink.trim())
      newErrors.attendanceLink = true;
    if (activeTab === "Meeting" && !agenda.some((a) => a.trim()))
      newErrors.agenda = true;
    setErrors(newErrors);
    if (Object.values(newErrors).some((e) => e)) {
      setShowGlobalError(true);
      return;
    }
    const hasImage = images.length > 0 || (editingId && previews.length > 0);
    if (!hasImage) {
      setErrors((p) => ({ ...p, image: true }));
      setShowGlobalError(true);
      fileInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    setIsSubmitting(true);
    setLoadingAction("publishing");
    setShowGlobalError(false);
    try {
      const announcementData = buildAnnouncementData(true) as any;
      announcementData.isPublished = true;
      if (editingId)
        await announcementService.updateAnnouncement(
          editingId,
          announcementData,
          images.length > 0 ? images : undefined,
        );
      else
        await announcementService.createAnnouncement(
          announcementData,
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
            : "Announcement is now live.",
      });
      setShowSuccessModal(true);
      handleCancelEdit();
      fetchAnnouncements();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to process announcement.");
    } finally {
      setIsSubmitting(false);
      setLoadingAction(null);
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    setLoadingAction("saving");
    try {
      const announcementData = buildAnnouncementData(false);
      if (editingId)
        await announcementService.updateAnnouncement(
          editingId,
          announcementData,
          images.length > 0 ? images : undefined,
        );
      else
        await announcementService.createAnnouncement(
          announcementData,
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
      fetchAnnouncements();
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
    if (errors[name as keyof typeof errors])
      setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleAwardeeChange = (
    index: number,
    field: "name" | "program" | "year" | "award",
    value: string,
  ) =>
    setAwardees((prev) => {
      const u = [...prev];
      u[index][field] = value;
      return u;
    });

  const addAwardee = () =>
    setAwardees([...awardees, { name: "", program: "", year: "", award: "" }]);
  const removeAwardee = (index: number) =>
    setAwardees((prev) => prev.filter((_, i) => i !== index));
  const addAgendaItem = () => setAgenda((prev) => [...prev, ""]);
  const updateAgendaItem = (index: number, value: string) =>
    setAgenda((prev) => {
      const u = [...prev];
      u[index] = value;
      return u;
    });
  const removeAgendaItem = (index: number) =>
    setAgenda((prev) => prev.filter((_, i) => i !== index));

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
    const fileList = e.target.files;
    if (!fileList || !fileList.length) return;
    try {
      const resized = await Promise.all(
        Array.from(fileList).map((f) => resizeImage(f)),
      );
      setImages((prev) => [...prev, ...resized]);
      setPreviews((prev) => [
        ...prev,
        ...resized.map((f) => URL.createObjectURL(f)),
      ]);
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
      setImages((p) => [...p, resized]);
      setPreviews((p) => [...p, URL.createObjectURL(resized)]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        try {
          URL.revokeObjectURL(p);
        } catch {}
      });
    };
  }, [previews]);

  const publishedItems = announcementList.filter((item) => item.isPublished);

  const inputCls = (hasError: boolean) =>
    `w-full font-raleway text-primary3 font-medium rounded-xl px-4 py-3.5 border-2 bg-white/80 transition-all duration-200 outline-none placeholder:text-gray-300 ${hasError ? "border-red-300 focus:border-red-400 bg-red-50/30" : "border-gray-200 focus:border-primary2 focus:bg-white"}`;

  const Divider = () => <div className="h-px bg-gray-100 w-full" />;

  return (
    <section className="min-h-screen bg-[#f8f9fc] flex flex-col relative overflow-x-hidden">
      <Grid />

      {/* Loading Overlay */}
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
                    ? "Updating Announcement"
                    : "Publishing Announcement"}
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
              Announcement Management
            </div>
            <h1 className="text-4xl sm:text-7xl font-black font-rubik leading-[0.9] tracking-tight">
              <span className="bg-gradient-to-br from-primary3 via-primary1 to-primary2 bg-clip-text text-transparent">
                {editingId ? "Edit\nAnnouncement" : "Compose\nAnnouncement"}
              </span>
            </h1>
            <p className="text-gray-500 font-raleway text-base mt-4 max-w-sm">
              {editingId
                ? "Update details and republish"
                : "Share updates, news, and important information"}
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

                  {/* Edit Banner */}
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
                    {/* Section label */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-black font-rubik text-primary3">
                          {editingId ? "Edit Details" : "New Announcement"}
                        </h2>
                        <p className="text-gray-400 text-sm font-raleway mt-0.5">
                          Fill in the fields below
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 bg-primary2/8 rounded-full px-4 py-2">
                        <Megaphone size={12} className="text-primary2" />
                        <span className="text-xs font-bold text-primary2 font-rubik uppercase tracking-wider">
                          Announcement
                        </span>
                      </div>
                    </div>

                    {/* FEATURED IMAGE */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                          Featured Image <span className="text-red-400">*</span>
                        </label>
                        {previews.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setImages([]);
                              setPreviews([]);
                            }}
                            className="text-xs font-bold text-red-400 hover:text-red-600 font-rubik flex items-center gap-1 transition-colors"
                          >
                            <X size={11} /> Clear all
                          </button>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImagesChange}
                        ref={fileInputRef}
                      />

                      {previews.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {previews.map((p, i) => (
                            <div
                              key={i}
                              className="relative group rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50 h-40"
                            >
                              <img
                                src={p}
                                alt={`preview-${i}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    try {
                                      URL.revokeObjectURL(p);
                                    } catch {}
                                    setImages((prev) =>
                                      prev.filter((_, idx) => idx !== i),
                                    );
                                    setPreviews((prev) =>
                                      prev.filter((_, idx) => idx !== i),
                                    );
                                  }}
                                  className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg hover:scale-105 transition-transform font-rubik"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => fileInputRef.current?.click()}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ")
                                fileInputRef.current?.click();
                            }}
                            className="cursor-pointer h-40 rounded-xl border-2 border-dashed border-primary2/40 hover:border-primary2 hover:bg-primary2/5 transition-all flex flex-col items-center justify-center gap-2 text-primary2"
                          >
                            <Plus size={20} strokeWidth={2} />
                            <span className="text-xs font-bold font-rubik">
                              Add More
                            </span>
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
                          className={`cursor-pointer h-52 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4 ${errors.image ? "border-red-300 bg-red-50/30" : isDragging ? "border-primary2 bg-primary2/5 scale-[1.01]" : "border-gray-200 bg-gray-50/80 hover:border-primary2/60"}`}
                        >
                          <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? "bg-primary2 text-white" : "bg-white text-primary2 shadow-md"}`}
                          >
                            <Upload size={22} strokeWidth={2.5} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-gray-700 font-rubik">
                              {isDragging
                                ? "Drop it!"
                                : "Upload featured image(s)"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 font-raleway">
                              Drag & drop or click · PNG, JPG · Multiple allowed
                            </p>
                          </div>
                        </div>
                      )}
                      {errors.image && (
                        <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                          <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                          A featured image is required to publish
                        </p>
                      )}
                    </div>

                    <Divider />

                    {/* CATEGORY TABS */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                        Category
                      </label>
                      <div className="flex flex-wrap gap-2 p-1 bg-gray-100/80 rounded-xl border border-gray-200 w-fit">
                        {tabs.map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-lg text-xs font-bold font-rubik transition-all duration-200 ${activeTab === tab ? "bg-white text-primary1 shadow-sm ring-1 ring-black/5" : "text-gray-400 hover:text-gray-600"}`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Divider />

                    {/* DATE / TIME / LOCATION */}
                    <div className="space-y-5">
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 font-rubik">
                        Schedule & Location
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                            Date <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <Calendar
                              size={14}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                            />
                            <input
                              id="date"
                              type="date"
                              name="date"
                              value={formData.date}
                              onChange={handleInputChange}
                              className={`${inputCls(errors.date)} pl-9`}
                            />
                          </div>
                          {errors.date && (
                            <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                              <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                              Required
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                            Time <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <Clock
                              size={14}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                            />
                            <input
                              id="time"
                              type="time"
                              name="time"
                              value={formData.time}
                              onChange={handleInputChange}
                              className={`${inputCls(errors.time)} pl-9`}
                            />
                          </div>
                          {errors.time && (
                            <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                              <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                              Required
                            </p>
                          )}
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                            Location
                          </label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
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
                            <button
                              type="button"
                              onClick={() =>
                                organizer.trim() === ""
                                  ? setShowOrganizerInput((p) => !p)
                                  : setOrganizer("")
                              }
                              className={`px-4 rounded-xl border-2 font-bold text-xs transition-all font-rubik ${organizer || showOrganizerInput ? "border-red-200 text-red-400 hover:bg-red-50" : "border-primary2/30 text-primary2 hover:border-primary2 hover:bg-primary2/5"}`}
                              title={
                                organizer || showOrganizerInput
                                  ? "Remove Organizer"
                                  : "Add Organizer"
                              }
                            >
                              {organizer || showOrganizerInput
                                ? "×"
                                : "+ Organizer"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {showOrganizerInput && (
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
                      )}
                    </div>

                    <Divider />

                    {/* CONTENT */}
                    <div className="space-y-5">
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 font-rubik">
                        Content
                      </h3>
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                          Title <span className="text-red-400">*</span>
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
                          Summary <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="summary"
                          type="text"
                          name="summary"
                          value={formData.summary}
                          onChange={handleInputChange}
                          placeholder="Brief overview of the announcement"
                          className={inputCls(errors.summary)}
                        />
                        {errors.summary && (
                          <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                            Summary is required
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                            Body <span className="text-red-400">*</span>
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
                          placeholder="Add full details, links, and information..."
                          className={`${inputCls(errors.body)} resize-y min-h-[180px]`}
                        />
                        {errors.body && (
                          <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                            Body is required
                          </p>
                        )}
                      </div>
                    </div>

                    {/* AWARDEES — Achievement tab */}
                    {activeTab === "Achievement" && (
                      <>
                        <Divider />
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 font-rubik">
                              Awardees
                            </label>
                            <button
                              type="button"
                              onClick={addAwardee}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border-2 border-primary2/30 text-primary2 rounded-lg hover:border-primary2 hover:bg-primary2/5 transition-all font-rubik"
                            >
                              <Plus size={11} /> Add Awardee
                            </button>
                          </div>
                          <div className="space-y-3">
                            {awardees.map((a, idx) => (
                              <div
                                key={idx}
                                className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-gray-50/80 border-2 border-gray-100 rounded-xl hover:border-primary2/20 transition-all"
                              >
                                <div className="sm:col-span-3">
                                  <input
                                    type="text"
                                    placeholder="Name"
                                    value={a.name}
                                    onChange={(e) =>
                                      handleAwardeeChange(
                                        idx,
                                        "name",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full rounded-xl border-2 border-white bg-white px-3 py-2.5 text-sm font-rubik focus:outline-none focus:border-primary2 transition-all"
                                  />
                                </div>
                                <div className="sm:col-span-3">
                                  <input
                                    type="text"
                                    placeholder="Program (optional)"
                                    value={a.program}
                                    onChange={(e) =>
                                      handleAwardeeChange(
                                        idx,
                                        "program",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full rounded-xl border-2 border-white bg-white px-3 py-2.5 text-sm font-rubik focus:outline-none focus:border-primary2 transition-all"
                                  />
                                </div>
                                <div className="sm:col-span-2">
                                  <input
                                    type="text"
                                    placeholder="Year"
                                    value={a.year}
                                    onChange={(e) =>
                                      handleAwardeeChange(
                                        idx,
                                        "year",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full rounded-xl border-2 border-white bg-white px-3 py-2.5 text-sm font-rubik focus:outline-none focus:border-primary2 transition-all"
                                  />
                                </div>
                                <div className="sm:col-span-3">
                                  <input
                                    type="text"
                                    placeholder="Award"
                                    value={a.award}
                                    onChange={(e) =>
                                      handleAwardeeChange(
                                        idx,
                                        "award",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full rounded-xl border-2 border-white bg-white px-3 py-2.5 text-sm font-rubik focus:outline-none focus:border-primary2 transition-all"
                                  />
                                </div>
                                <div className="sm:col-span-1 flex items-center justify-end">
                                  <button
                                    type="button"
                                    onClick={() => removeAwardee(idx)}
                                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border-2 border-red-100 text-red-400 hover:bg-red-50 transition-all text-sm font-bold"
                                  >
                                    <X size={13} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* MEETING FIELDS */}
                    {activeTab === "Meeting" && (
                      <>
                        <Divider />
                        <div className="space-y-5">
                          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 font-rubik">
                            Meeting Details
                          </h3>
                          <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                              Attendance Link
                            </label>
                            <input
                              type="url"
                              id="attendanceLink"
                              name="attendanceLink"
                              value={formData.attendanceLink}
                              onChange={handleInputChange}
                              placeholder="Link to attendance Google Sheet / Drive folder"
                              className={inputCls(!!errors.attendanceLink)}
                            />
                            {errors.attendanceLink && (
                              <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                                <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                                Attendance link is required for meetings
                              </p>
                            )}
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                                Agenda <span className="text-red-400">*</span>
                              </label>
                              <button
                                type="button"
                                onClick={addAgendaItem}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border-2 border-primary2/30 text-primary2 rounded-lg hover:border-primary2 hover:bg-primary2/5 transition-all font-rubik"
                              >
                                <Plus size={11} /> Add Item
                              </button>
                            </div>
                            <div className="space-y-2">
                              {agenda.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2"
                                >
                                  <span className="text-xs font-black text-gray-300 font-rubik w-5 text-right flex-shrink-0">
                                    {i + 1}.
                                  </span>
                                  <input
                                    type="text"
                                    value={item}
                                    onChange={(e) =>
                                      updateAgendaItem(i, e.target.value)
                                    }
                                    placeholder={`Agenda item ${i + 1}`}
                                    className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-rubik text-gray-700 focus:outline-none focus:border-primary2 transition-all"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeAgendaItem(i)}
                                    className="w-8 h-8 flex items-center justify-center rounded-xl border-2 border-red-100 text-red-400 hover:bg-red-50 transition-all"
                                  >
                                    <X size={13} />
                                  </button>
                                </div>
                              ))}
                            </div>
                            {errors.agenda && (
                              <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                                <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                                At least one agenda item is required
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <Divider />

                    {/* VISIBILITY */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                        Visibility <span className="text-red-400">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {VISIBILITY_OPTIONS.map((opt) => {
                          const Icon = opt.icon;
                          const isActive = formData.visibility === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                setFormData((p) => ({
                                  ...p,
                                  visibility: opt.value,
                                }));
                                setErrors((p) => ({ ...p, visibility: false }));
                              }}
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
                      {errors.visibility && (
                        <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                          <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                          Visibility is required
                        </p>
                      )}
                    </div>

                    <Divider />

                    {/* SCHEDULE PUBLISH */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                          Schedule Publish
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <div
                            className={`w-10 h-5 rounded-full transition-all duration-200 relative ${showSchedule ? "bg-primary2" : "bg-gray-200"}`}
                            onClick={() => setShowSchedule((p) => !p)}
                          >
                            <div
                              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${showSchedule ? "left-5" : "left-0.5"}`}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-500 font-rubik">
                            Schedule
                          </span>
                        </label>
                      </div>
                      {showSchedule && (
                        <div className="grid sm:grid-cols-2 gap-4 p-5 border-2 border-gray-100 rounded-xl bg-gray-50/60">
                          <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                              Publish Date
                            </label>
                            <input
                              type="date"
                              value={scheduleDate}
                              onChange={(e) => setScheduleDate(e.target.value)}
                              className={inputCls(false)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                              Publish Time
                            </label>
                            <input
                              type="time"
                              value={scheduleTime}
                              onChange={(e) => setScheduleTime(e.target.value)}
                              className={inputCls(false)}
                            />
                          </div>
                        </div>
                      )}
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
                            ? "Update Announcement"
                            : "Publish Announcement"}
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
                        Manage Announcements
                      </h2>
                      <p className="text-gray-400 text-xs font-raleway mt-0.5 tracking-wide">
                        {publishedItems.length} published{" "}
                        {publishedItems.length === 1
                          ? "announcement"
                          : "announcements"}
                      </p>
                    </div>
                    <button
                      onClick={fetchAnnouncements}
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
                      <p className="text-sm font-raleway">
                        Loading announcements...
                      </p>
                    </div>
                  ) : publishedItems.length === 0 ? (
                    <div className="py-20 flex flex-col items-center gap-4 text-gray-300">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                        <Megaphone size={24} className="text-gray-300" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold font-rubik text-gray-400">
                          No announcements yet
                        </p>
                        <p className="text-xs font-raleway mt-0.5">
                          Create one using the form above
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[680px]">
                        <thead>
                          <tr className="bg-gray-50/80">
                            <th className="px-8 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                              Title
                            </th>
                            <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                              Type
                            </th>
                            <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                              Date
                            </th>
                            <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                              Status
                            </th>
                            <th className="px-8 py-3.5 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {publishedItems.map((item) => {
                            const isEditing = editingId === item._id;
                            const meta =
                              TYPE_META[item.type] || TYPE_META.General;
                            return (
                              <tr
                                key={item._id}
                                className={`group border-t border-gray-50 transition-all duration-200 ${isEditing ? "bg-primary1/5" : "hover:bg-gray-50/70"}`}
                              >
                                <td className="px-8 py-4">
                                  <div className="flex items-center gap-2">
                                    {isEditing && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-primary1 animate-pulse flex-shrink-0" />
                                    )}
                                    <div>
                                      <span className="font-bold text-sm text-gray-800 font-rubik truncate max-w-[200px] block">
                                        {item.title}
                                      </span>
                                      {item.description && (
                                        <p className="text-xs text-gray-400 font-raleway mt-0.5 max-w-[200px] truncate">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${meta.bg} ${meta.color} ${meta.border}`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${meta.dot}`}
                                    />
                                    {item.type}
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <span className="text-xs text-gray-600 font-raleway">
                                    {item.publishDate
                                      ? new Date(
                                          item.publishDate,
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${item.isPublished ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${item.isPublished ? "bg-emerald-500" : "bg-gray-400"}`}
                                    />
                                    {item.isPublished ? "Published" : "Draft"}
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
              Delete Announcement?
            </h3>
            <p className="text-gray-400 text-sm font-raleway mb-6 leading-relaxed">
              This will permanently remove the announcement. This action cannot
              be undone.
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
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setSubmitSuccess(false);
              }}
              className="w-full py-3 text-sm font-bold font-rubik text-white bg-gradient-to-r from-primary1 to-primary2 rounded-xl shadow-lg hover:shadow-primary2/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
