"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "../../components/sidebar";
import Button from "@/app/components/button";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "@/app/components/grid";
import { ChevronDown, Pencil, Trash2, RefreshCw } from "lucide-react"; // Added Icons
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

type FileAttachment = {
  name: string;
  type: "file";
  file: File;
};

type LinkAttachment = {
  name: string;
  url: string;
  type: "link";
};

type Attachment = FileAttachment | LinkAttachment;

// Interface for the list items
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

export default function AnnouncementsPage() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [newLink, setNewLink] = useState("");
  type ActiveTab = "General" | "News" | "Meeting" | "Achievement";
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
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState<"saving" | "publishing" | null>(null);
  const [successMessage, setSuccessMessage] = useState({ title: "", description: "" });
  const router = useRouter();
  const searchParams = useSearchParams();
  const editIdParam = searchParams.get("edit");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (editIdParam) {
      const fetchAnnouncement = async () => {
        try {
          const response = await announcementService.getAnnouncementById(editIdParam);
          const data = response.data as any; // Assuming response structure
          if (data) {
            setEditingId(data._id);
            setIsEditingDraft(!data.isPublished);
            setFormData({
              title: data.title,
              summary: data.description,
              body: data.content,
              visibility: "Public", // Default or map from data
              date: data.date || "",
              time: data.time || "",
              location: data.location || "",
              attendanceLink: "", // Map if available
            });
            setActiveTab(data.type as ActiveTab);
            // Populate other fields as needed (images, agenda, etc.)
            if (data.agenda) setAgenda(data.agenda);
            if (data.awardees) setAwardees(data.awardees);
            if (data.organizer) {
                setOrganizer(data.organizer);
                setShowOrganizerInput(true);
            }
            if (data.imageUrl) {
                setPreviews([data.imageUrl]);
            }
          }
        } catch (error) {
          console.error("Failed to fetch announcement for edit:", error);
        }
      };
      fetchAnnouncement();
    }
  }, [editIdParam]);

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

  // --- NEW MANAGEMENT STATE ---
  const [announcementList, setAnnouncementList] = useState<AnnouncementItem[]>(
    []
  );
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isEditingDraft, setIsEditingDraft] = useState(false);

  // 1. FETCH ANNOUNCEMENTS
  const fetchAnnouncements = async () => {
    setIsLoadingList(true);
    try {
      const response = await announcementService.getAnnouncements({
        limit: 100,
      });
      // Handle various API response structures
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

  // 2. HANDLE EDIT CLICK (Populates Form)
  const handleEditClick = (item: AnnouncementItem) => {
    setEditingId(item._id);
    setIsEditingDraft(!item.isPublished);

    // Basic Fields
    setFormData({
      title: item.title,
      summary: item.description,
      body: item.content,
      date: item.date ? new Date(item.date).toISOString().split("T")[0] : "",
      time: item.time || "",
      location: item.location || "",
      attendanceLink: item.attendees || "",
      // Map audience array to visibility string
      visibility: item.targetAudience?.includes("members")
        ? "members"
        : item.targetAudience?.includes("officers")
        ? "officers"
        : "public",
    });

    // Organizer
    setOrganizer(item.organizer || "");
    setShowOrganizerInput(!!item.organizer);

    // Tabs
    let tabToSet: ActiveTab = "General";
    if (item.type === "Meeting") tabToSet = "Meeting";
    if (item.type === "Achievement") tabToSet = "Achievement";
    if (item.type === "News") tabToSet = "News";
    setActiveTab(tabToSet);

    // Complex Arrays
    if (item.type === "Meeting" && item.agenda && item.agenda.length > 0) {
      setAgenda(item.agenda);
    } else {
      setAgenda([""]);
    }

    if (
      item.type === "Achievement" &&
      item.awardees &&
      item.awardees.length > 0
    ) {
      setAwardees(item.awardees);
    } else {
      setAwardees([{ name: "", program: "", year: "", award: "" }]);
    }

    // Schedule / Draft Status
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

    // Images
    setPreviews(item.imageUrl ? [item.imageUrl] : []);
    setImages([]); // Clear file input since we have a preview URL

    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 3. CANCEL EDIT
  const handleCancelEdit = () => {
    setEditingId(null);
    setIsEditingDraft(false);
    resetForm();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 4. DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      await announcementService.deleteAnnouncement(id);
      fetchAnnouncements();
    } catch (error) {
      alert("Failed to delete announcement.");
    }
  };

  // 5. UPDATE PUBLISH LOGIC
  const handlePublish = async () => {
    const newErrors: FormErrors = {
      date: !formData.date.trim(),
      time: !formData.time.trim(),
      title: !formData.title.trim(),
      summary: !formData.summary.trim(),
      body: !formData.body.trim(),
      visibility: !formData.visibility.trim(),
    };

    if (activeTab === "Meeting" && !formData.attendanceLink.trim()) {
      newErrors.attendanceLink = true;
    }
    if (activeTab === "Meeting" && !agenda.some((a) => a.trim())) {
      newErrors.agenda = true;
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) {
      setShowGlobalError(true);
      return;
    }

    // Require image only if new creation OR editing but user removed existing image
    const hasImage = images.length > 0 || (editingId && previews.length > 0);
    if (!hasImage) {
      setErrors((prev) => ({ ...prev, image: true }));
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
      const typeMap: Record<ActiveTab, AnnouncementData["type"]> = {
        General: "General",
        News: "General", // Mapping News to General/News based on backend
        Meeting: "Meeting",
        Achievement: "Achievement",
      };

      const audienceMap: Record<string, string[]> = {
        public: ["all"],
        members: ["members"],
        officers: ["officers"],
      };

      const attachmentsData = attachments
        .filter((att): att is LinkAttachment => att.type === "link")
        .map((att) => ({
          name: att.name,
          url: att.url,
          fileType: att.type,
        }));

      const announcementData = {
        title: formData.title,
        description: formData.summary,
        content: formData.body,
        type: typeMap[activeTab],
        targetAudience: audienceMap[formData.visibility] || ["all"],
        isPublished: true, // Always true for publish
        publishDate:
          showSchedule && scheduleDate
            ? new Date(
                `${scheduleDate}T${scheduleTime || "00:00"}`
              ).toISOString()
            : new Date().toISOString(),
        time: formData.time,
        location: formData.location,
        organizer: organizer || undefined,
        attendees:
          activeTab === "Meeting" ? formData.attendanceLink : undefined,
        awardees:
          activeTab === "Achievement"
            ? awardees.filter((a) => a.name.trim())
            : undefined,
        attachments: attachmentsData.length > 0 ? attachmentsData : undefined,
        agenda:
          activeTab === "Meeting" ? agenda.filter((a) => a.trim()) : undefined,
        date: formData.date || undefined,
      };

      if (editingId) {
        // UPDATE
        await announcementService.updateAnnouncement(
          editingId,
          announcementData,
          images.length > 0 ? images : undefined
        );
      } else {
        // CREATE
        await announcementService.createAnnouncement(
          announcementData,
          images.length > 0 ? images : undefined
        );
      }

      setSubmitSuccess(true);
      setSuccessMessage({
        title: editingId && !isEditingDraft ? "Updated Successfully!" : "Published Successfully!",
        description: editingId && !isEditingDraft ? "Changes have been saved." : "Announcement is now live."
      });
      setShowSuccessModal(true);
      handleCancelEdit(); // Reset form
      fetchAnnouncements(); // Refresh List
    } catch (error) {
      console.error("❌ Error:", error);
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

      const attachmentsData = attachments
        .filter((att): att is LinkAttachment => att.type === "link")
        .map((att) => ({
          name: att.name,
          url: att.url,
          fileType: att.type,
        }));

      const announcementData = {
        title: formData.title || "Untitled Draft",
        description: formData.summary || "No description",
        content: formData.body || "No content",
        type: typeMap[activeTab],
        targetAudience: formData.visibility
          ? audienceMap[formData.visibility]
          : ["all"],
        isPublished: false,
        time: formData.time || undefined,
        location: formData.location || undefined,
        organizer: organizer || undefined,
        awardees:
          activeTab === "Achievement"
            ? awardees.filter((a) => a.name.trim())
            : undefined,
        attachments: attachmentsData.length > 0 ? attachmentsData : undefined,
        agenda:
          activeTab === "Meeting" ? agenda.filter((a) => a.trim()) : undefined,
        date: formData.date || undefined,
      };

      if (editingId) {
        // UPDATE DRAFT
        await announcementService.updateAnnouncement(
          editingId,
          announcementData,
          images.length > 0 ? images : undefined
        );
      } else {
        // CREATE DRAFT
        await announcementService.createAnnouncement(
          announcementData,
          images.length > 0 ? images : undefined
        );
      }

      setSubmitSuccess(true);
      setSuccessMessage({
        title: editingId ? "Draft Updated!" : "Draft Saved!",
        description: editingId ? "Draft changes have been saved." : "Draft has been saved successfully."
      });
      setShowSuccessModal(true);
      handleCancelEdit(); // Reset form
      fetchAnnouncements(); // Refresh List
    } catch (error) {
      console.error("❌ Error saving draft:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save draft. Please try again.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
      setLoadingAction(null);
    }
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
    setAttachments([]);
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleAwardeeChange = (
    index: number,
    field: "name" | "program" | "year" | "award",
    value: string
  ) => {
    setAwardees((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addAwardee = () => {
    setAwardees([...awardees, { name: "", program: "", year: "", award: "" }]);
  };

  const removeAwardee = (index: number) => {
    setAwardees((prev) => prev.filter((_, i) => i !== index));
  };

  const addAgendaItem = () => {
    setAgenda((prev) => [...prev, ""]);
  };

  const updateAgendaItem = (index: number, value: string) => {
    setAgenda((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const removeAgendaItem = (index: number) => {
    setAgenda((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newFiles: Attachment[] = files.map((file) => ({
      name: file.name,
      type: "file",
      file,
    }));
    setAttachments((prev) => [...prev, ...newFiles]);
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
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    try {
      const resized = await Promise.all(files.map((f) => resizeImage(f)));
      setImages((prev) => [...prev, ...resized]);
      setPreviews((prev) => [
        ...prev,
        ...resized.map((f) => URL.createObjectURL(f)),
      ]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Error resizing images", err);
    }
  };

  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        try {
          URL.revokeObjectURL(p);
        } catch (err) {
          /* ignore */
        }
      });
    };
  }, [previews]);

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const tabs: ActiveTab[] = ["General", "News", "Meeting", "Achievement"];

  useEffect(() => {
    if (Object.values(errors).every((err) => err === false)) {
      setShowGlobalError(false);
    }
  }, [errors]);

  return (
    <section className="min-h-screen bg-white flex flex-col relative">
      <Grid />
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md transition-all animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in duration-300">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 rounded-full" />
              <div className="w-16 h-16 border-4 border-primary2 border-t-transparent rounded-full animate-spin absolute inset-0" />
            </div>
            <p className="text-primary3 font-semibold font-rubik animate-pulse">
              {loadingAction === "saving" ? "Saving Draft..." : editingId ? "Updating Announcement..." : "Publishing..."}
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
                {editingId ? "Edit Announcement" : "Compose Announcement"}
              </h1>
              <p className="text-gray-600 font-raleway text-lg">
                {editingId
                  ? "Update the details below"
                  : "Share updates, news, and important information"}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="sticky top-24">
                <Sidebar />
              </div>
            </aside>

            {/* MAIN CONTENT COLUMN */}
            <div className="flex-1 space-y-12">
              {/* 1. THE FORM */}
              <div
                className={`bg-white rounded-3xl shadow-xl shadow-gray-200/50 border overflow-hidden transition-all duration-300 ${
                  editingId
                    ? "border-primary1 shadow-primary1/20"
                    : "border-gray-100"
                }`}
              >
                {/* Edit Banner */}
                {editingId && (
                  <div className="bg-amber-50 border-b border-amber-100 px-8 py-3 flex items-center justify-between">
                    <span className="text-amber-800 font-medium font-rubik text-sm flex items-center gap-2">
                      <Pencil size={14} /> Editing Mode Active
                    </span>
                    <button
                      onClick={handleCancelEdit}
                      className="text-xs font-bold text-amber-900 underline"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Form Header */}
                <div className="bg-gradient-to-r from-primary1 to-primary2 p-8">
                  <h2 className="text-3xl font-bold text-white font-rubik flex items-center gap-3">
                    {editingId ? "Edit Content" : "Content Details"}
                  </h2>
                  <p className="text-blue-100 font-raleway mt-2">
                    {editingId
                      ? "Modify information below"
                      : "Fill in the information below to create an announcement"}
                  </p>
                </div>

                <div className="p-8 space-y-8">
                  {/* Image Upload */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <svg
                        className="w-5 h-5 text-primary2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <label className="text-lg font-semibold text-primary3 font-rubik">
                        Featured Image
                      </label>
                    </div>

                    <div
                      className={`w-full rounded-2xl p-3 transition-all duration-300 border-2 ${
                        errors.image
                          ? "border-red-400 bg-red-50/50"
                          : previews.length > 0
                          ? "border-green-400 bg-green-50/30"
                          : "border-gray-300 bg-gray-50/50 hover:border-primary2 hover:bg-primary2/5"
                      }`}
                      aria-invalid={errors.image ? "true" : "false"}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        multiple
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
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {previews.map((p, i) => (
                              <div
                                key={i}
                                className="relative overflow-hidden rounded-xl group-image"
                              >
                                <img
                                  src={p}
                                  alt={`preview-${i}`}
                                  className="w-full h-40 object-cover rounded-xl border-2 border-white shadow-md transition-transform duration-300 hover:scale-105"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    try {
                                      URL.revokeObjectURL(p);
                                    } catch {}
                                    setImages((prev) =>
                                      prev.filter((_, idx) => idx !== i)
                                    );
                                    setPreviews((prev) =>
                                      prev.filter((_, idx) => idx !== i)
                                    );
                                  }}
                                  aria-label={`Remove image ${i + 1}`}
                                  className="absolute top-2 right-2 bg-white w-8 h-8 flex items-center justify-center rounded-full text-red-500 shadow-lg hover:bg-red-50 hover:scale-110 transition-all duration-200"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary2/50 text-primary2 rounded-xl h-40 hover:bg-primary2/5 transition-colors">
                              <span className="text-4xl font-light mb-2">
                                +
                              </span>
                              <span className="text-sm font-rubik">
                                Add More
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="py-12 text-center">
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
                                  Click to upload featured image(s)
                                </p>
                                <p className="text-sm text-gray-500 mt-1 font-raleway">
                                  PNG, JPG up to 10MB
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {images.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviews([]);
                            setImages([]);
                          }}
                          className="mt-4 text-red-500 text-sm hover:text-red-600 font-medium flex items-center gap-1 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Remove all images
                        </button>
                      )}
                    </div>
                    {errors.image && (
                      <p className="text-sm text-red-600 mt-2 font-raleway flex items-center gap-1">
                        <span>•</span> A featured image is required to publish.
                      </p>
                    )}
                  </div>

                  {/* Tabs */}
                  <div className="space-y-3">
                    <label className="text-lg font-semibold text-primary3 font-rubik flex items-center gap-2">
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-200 w-fit">
                      {tabs.map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`relative px-6 py-3 rounded-xl text-sm font-bold font-rubik transition-all duration-300 ${
                            activeTab === tab
                              ? "bg-white text-primary1 shadow-md shadow-gray-200 ring-1 ring-black/5"
                              : "text-gray-500 hover:text-primary1 hover:bg-white/50"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-primary3 font-rubik">
                        Date
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
                        Time
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

                    <div className="space-y-2 sm:col-span-2 lg:col-span-2">
                      <label className="text-sm font-semibold text-primary3 font-rubik">
                        Location
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Where is it happening?"
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-600 bg-gray-50/30 focus:bg-white focus:outline-none focus:border-primary2 focus:ring-4 focus:ring-primary2/10 transition-all duration-300"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            organizer.trim() === ""
                              ? setShowOrganizerInput((prev) => !prev)
                              : setOrganizer("")
                          }
                          className={`px-4 rounded-xl border-2 font-bold transition-all duration-300 ${
                            organizer || showOrganizerInput
                              ? "border-red-200 text-red-500 hover:bg-red-50"
                              : "border-primary2 text-primary2 hover:bg-primary2 hover:text-white"
                          }`}
                          title={
                            organizer || showOrganizerInput
                              ? "Remove Organizer"
                              : "Add Organizer"
                          }
                        >
                          {organizer || showOrganizerInput ? "×" : "+"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {showOrganizerInput && (
                    <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                      <label className="text-sm font-semibold text-primary3 font-rubik mb-2 block">
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
                  )}
                  <div className="h-px bg-gray-100 w-full" />

                  {/* Text Inputs */}
                  <div className="space-y-2">
                    <label
                      htmlFor="title"
                      className="text-lg font-semibold text-primary3 font-rubik flex items-center gap-2"
                    >
                      Title
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

                  {/* Summary */}
                  <div className="space-y-2">
                    <label
                      htmlFor="summary"
                      className="text-lg font-semibold text-primary3 font-rubik flex items-center gap-2"
                    >
                      Summary
                      {formData.summary && (
                        <span className="text-green-500 text-xs">✓</span>
                      )}
                    </label>
                    <input
                      id="summary"
                      type="text"
                      name="summary"
                      value={formData.summary}
                      onChange={handleInputChange}
                      placeholder="Brief overview of the announcement"
                      className={`w-full rounded-xl border-2 px-5 py-4 text-lg focus:outline-none focus:ring-4 transition-all duration-300 ${
                        errors.summary
                          ? "border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30"
                          : "border-gray-200 focus:border-primary2 focus:ring-primary2/10 bg-gray-50/30 focus:bg-white"
                      }`}
                    />
                    {errors.summary && (
                      <p className="text-sm text-red-600 mt-1 font-raleway flex items-center gap-1">
                        <span>•</span> Summary is required.
                      </p>
                    )}
                  </div>
                  {/* Body */}
                  <div className="space-y-2">
                    <label
                      htmlFor="body"
                      className="text-lg font-semibold text-primary3 font-rubik flex items-center gap-2"
                    >
                      Body
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
                      placeholder="Add full details, links, and attachments"
                      className={`w-full rounded-xl border-2 px-5 py-4 text-lg focus:outline-none focus:ring-4 transition-all duration-300 resize-y min-h-[200px] ${
                        errors.body
                          ? "border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30"
                          : "border-gray-200 focus:border-primary2 focus:ring-primary2/10 bg-gray-50/30 focus:bg-white"
                      }`}
                    />
                    {errors.body && (
                      <p className="text-sm text-red-600 mt-1 font-raleway flex items-center gap-1">
                        <span>•</span> Body is required.
                      </p>
                    )}
                  </div>

                  {activeTab === "Achievement" && (
                    <div className="space-y-4 animate-in slide-in-from-top-4 fade-in duration-300">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-primary3 font-rubik">
                          Awardees
                        </h3>
                        <button
                          type="button"
                          onClick={addAwardee}
                          className="px-4 py-2 bg-primary2/10 text-primary2 rounded-xl font-bold text-sm hover:bg-primary2 hover:text-white transition-all duration-300"
                        >
                          + Add Awardee
                        </button>
                      </div>

                      <div className="space-y-3">
                        {awardees.map((a, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start bg-gray-50 p-4 rounded-2xl border border-gray-200 group hover:border-primary2/30 transition-all duration-300"
                          >
                            <div className="sm:col-span-3">
                              <input
                                type="text"
                                placeholder="Name"
                                value={a.name}
                                onChange={(e) =>
                                  handleAwardeeChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary2 focus:ring-2 focus:ring-primary2/10 transition-all"
                              />
                            </div>

                            <div className="sm:col-span-3">
                              <input
                                type="text"
                                placeholder="Program (optional)"
                                value={a.program}
                                onChange={(e) =>
                                  handleAwardeeChange(
                                    index,
                                    "program",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary2 focus:ring-2 focus:ring-primary2/10 transition-all"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <input
                                type="text"
                                placeholder="Year"
                                value={a.year}
                                onChange={(e) =>
                                  handleAwardeeChange(
                                    index,
                                    "year",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary2 focus:ring-2 focus:ring-primary2/10 transition-all"
                              />
                            </div>

                            <div className="sm:col-span-3">
                              <input
                                type="text"
                                placeholder="Award"
                                value={a.award}
                                onChange={(e) =>
                                  handleAwardeeChange(
                                    index,
                                    "award",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary2 focus:ring-2 focus:ring-primary2/10 transition-all"
                              />
                            </div>

                            <div className="sm:col-span-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() => removeAwardee(index)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
                        className={`w-full rounded-xl border-2 px-5 py-4 text-lg appearance-none cursor-pointer transition-all duration-300 ${
                          errors.visibility
                            ? "border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30"
                            : "border-gray-200 focus:border-primary2 focus:ring-primary2/10 bg-gray-50/30 focus:bg-white"
                        }`}
                      >
                        <option value="" className="text-gray-500">
                          Select visibility
                        </option>
                        <option value="public">Public (Everyone)</option>
                        <option value="members">Members Only</option>
                        <option value="officers">Officers Only</option>
                      </select>
                      <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-primary3">
                        <ChevronDown className="w-5 h-5" />
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 w-full" />

                  {/* Attachments */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-lg font-semibold text-primary3 font-rubik flex items-center gap-2">
                        Attachments
                      </label>
                      <p className="text-sm text-gray-500 font-raleway mt-1">
                        Optional — attach supporting files or links (e.g. PDFs,
                        images, or external resources).
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        id="fileUpload"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      <button
                        onClick={() =>
                          document.getElementById("fileUpload")?.click()
                        }
                        className="px-6 py-3 bg-primary2 text-white rounded-xl font-bold shadow-lg shadow-primary2/30 hover:bg-primary3 hover:shadow-primary2/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                        type="button"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                          />
                        </svg>
                        Add File
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (showLinkInput && newLink.trim() === "") {
                            setShowLinkInput(false);
                            return;
                          }
                          setShowLinkInput(true);
                        }}
                        className="px-6 py-3 border-2 border-primary2 text-primary2 rounded-xl font-bold hover:bg-primary2 hover:text-white transition-all duration-300 flex items-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        Add Link
                      </button>
                    </div>
                  </div>

                  {showLinkInput && (
                    <div className="flex gap-2 mb-4 animate-fade-in">
                      <input
                        type="text"
                        placeholder="Paste link here"
                        value={newLink}
                        onChange={(e) => setNewLink(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-primary2 font-rubik"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          if (!newLink.trim()) return;

                          setAttachments((prev) => [
                            ...prev,
                            {
                              name: newLink.trim(),
                              url: newLink.trim(),
                              type: "link",
                            },
                          ]);

                          setNewLink("");
                          setShowLinkInput(false);
                        }}
                        className="px-4 py-2 bg-primary2 text-white rounded-lg hover:bg-primary3 font-rubik"
                      >
                        Add
                      </button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((att, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-300 text-sm"
                      >
                        {att.name}

                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-gray-500 hover:text-red-500 font-bold"
                          type="button"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  {activeTab === "Meeting" && (
                    <div className="mt-6">
                      <label className="text-md font-normal text-primary3 font-raleway block mb-1 mt-1">
                        Attendance Transparency (optional)
                      </label>

                      <input
                        type="url"
                        id="attendanceLink"
                        name="attendanceLink"
                        value={formData.attendanceLink}
                        onChange={handleInputChange}
                        placeholder="Link to attendance Google Sheet / Drive folder"
                        className={`w-full text-gray-500 font-raleway rounded-lg px-3 py-2
  border transition-all
  ${
    errors.attendanceLink
      ? "border-2 border-red-500 bg-red-50"
      : "border-gray-300 bg-white text-gray-600"
  }
  focus:outline-none focus:border-2 focus:border-primary2 focus:text-black focus:bg-white
`}
                      />

                      <div className="mt-4">
                        <label className="text-md font-normal text-primary3 font-raleway block mb-2">
                          Agenda (list the meeting agenda items)
                        </label>

                        <div className="space-y-2">
                          {agenda.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="text"
                                value={item}
                                onChange={(e) =>
                                  updateAgendaItem(index, e.target.value)
                                }
                                placeholder={`Agenda item ${index + 1}`}
                                className="flex-1 text-gray-500 placeholder-gray-400 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary2 font-rubik"
                              />
                              <button
                                type="button"
                                onClick={() => removeAgendaItem(index)}
                                className="text-red-500 font-bold"
                              >
                                ×
                              </button>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={addAgendaItem}
                            className="px-3 py-1 bg-primary2 text-white rounded-lg text-sm"
                          >
                            + Add Agenda Item
                          </button>
                        </div>
                        {errors.agenda && (
                          <p className="text-red-500 text-sm mt-2">
                            Please add at least one agenda item for meetings.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setShowSchedule((prev) => !prev)}
                  >
                    Set Schedule
                  </Button>
                  {showSchedule && (
                    <div className="animate-fade-in">
                      <h3 className="text-lg font-semibold text-primary3 font-rubik mb-1">
                        Schedule
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Publish timing
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-md font-normal text-primary3 font-raleway block mb-1">
                            Date
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              value={scheduleDate}
                              onChange={(e) => setScheduleDate(e.target.value)}
                              className="w-full border border-primary2 text-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:border-primary3 font-rubik"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-md font-normal text-primary3 font-raleway block mb-1">
                            Time
                          </label>
                          <div className="relative">
                            <input
                              type="time"
                              value={scheduleTime}
                              onChange={(e) => setScheduleTime(e.target.value)}
                              className="w-full border border-primary2 text-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:border-primary3 font-rubik"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="h-px bg-gray-100 w-full" />
                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                    {showGlobalError && (
                      <p className="text-red-500 text-sm font-bold font-raleway animate-pulse">
                        Please fill all required fields before publishing.
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 ml-auto w-full sm:w-auto">

                      {editingId && (
                        <Button
                          variant="outline"
                          type="button"
                          onClick={handleCancelEdit}
                          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-500"
                        >
                          Cancel Edit
                        </Button>
                      )}
                      {(!editingId || isEditingDraft) && (
                        <Button
                          variant="outline"
                          type="button"
                          onClick={handleSaveDraft}
                          disabled={isSubmitting}
                          className="px-6 py-3 border-2 border-primary2 text-primary2 rounded-xl font-bold hover:bg-primary2 hover:text-white transition-all duration-300"
                        >
                          {editingId ? "Update" : "Save Draft"}
                        </Button>
                      )}
                      <Button
                        variant="primary3"
                        type="button"
                        onClick={handlePublish}
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-primary3 text-white rounded-xl font-bold shadow-lg shadow-primary3/30 hover:shadow-primary3/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting
                          ? "Processing..."
                          : editingId && !isEditingDraft
                          ? "Update Announcement"
                          : "Publish"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. MANAGE LIST */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-primary3 font-rubik">
                      Manage Announcements
                    </h2>
                    <p className="text-gray-500 font-raleway text-sm mt-1">
                      Total: {announcementList.length} items
                    </p>
                  </div>
                  <button
                    onClick={fetchAnnouncements}
                    className="flex items-center gap-2 text-sm text-primary1 font-bold hover:bg-primary1/10 px-4 py-2 rounded-lg transition-colors"
                  >
                    <RefreshCw size={16} /> Refresh List
                  </button>
                </div>

                <div className="overflow-x-auto">
                  {isLoadingList ? (
                    <div className="p-12 text-center text-gray-500 font-raleway">
                      Loading existing announcements...
                    </div>
                  ) : announcementList.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 font-raleway">
                      No announcements found. Create one above!
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold font-rubik tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Title</th>
                          <th className="px-6 py-4">Type</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-raleway">
                        {announcementList.map((item) => (
                          <tr
                            key={item._id}
                            className={`hover:bg-blue-50/40 transition-colors group ${
                              editingId === item._id
                                ? "bg-blue-50 ring-1 ring-inset ring-primary1/30"
                                : ""
                            }`}
                          >
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-800 font-rubik truncate max-w-[200px]">
                                {item.title}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded text-xs font-bold ${
                                  item.type === "Meeting"
                                    ? "bg-purple-100 text-purple-700"
                                    : item.type === "Achievement"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {item.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {item.publishDate
                                ? new Date(
                                    item.publishDate
                                  ).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded text-xs font-bold ${
                                  item.isPublished
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-200 text-gray-600"
                                }`}
                              >
                                {item.isPublished ? "Published" : "Draft"}
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
                                  onClick={() => handleDelete(item._id)}
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

        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => {
                setShowSuccessModal(false);
                setSubmitSuccess(false);
              }}
            />
            <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform animate-in zoom-in-95 duration-300 border border-gray-100">
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-2 animate-bounce">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900 font-rubik">
                    {successMessage.title}
                  </h3>
                  <p className="text-gray-500 font-raleway mb-6">
                    {successMessage.description}
                  </p>
                </div>

                <div className="w-full pt-2 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      setSubmitSuccess(false);
                      if (!editingId) router.push("/announcements");
                    }}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold"
                  >
                    View Announcements
                  </button>
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      setSubmitSuccess(false);
                    }}
                    className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </section>
  );
}
