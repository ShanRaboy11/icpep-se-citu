"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { GlassCard } from "../../components/glass-card";
import Sidebar from "@/app/components/sidebar";
import Button from "@/app/components/button";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "@/app/components/grid";
import {
  Pencil,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Upload,
  Star,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import sponsorService, { SponsorData } from "@/app/services/sponsor";

// --- INTERFACES ---
interface Sponsor {
  _id: string;
  name: string;
  type: string;
  image?: string;
  isActive: boolean;
}

type FormErrors = {
  name: boolean;
};

const TIER_CONFIG: Record<
  string,
  { color: string; bg: string; border: string; dot: string; rank: number }
> = {
  "Platinum Sponsor": {
    color: "text-slate-700",
    bg: "bg-gradient-to-r from-slate-100 to-slate-200",
    border: "border-slate-300",
    dot: "bg-slate-500",
    rank: 1,
  },
  "Gold Sponsor": {
    color: "text-amber-700",
    bg: "bg-gradient-to-r from-amber-50 to-yellow-100",
    border: "border-amber-300",
    dot: "bg-amber-400",
    rank: 2,
  },
  "Silver Sponsor": {
    color: "text-gray-600",
    bg: "bg-gradient-to-r from-gray-100 to-gray-200",
    border: "border-gray-300",
    dot: "bg-gray-400",
    rank: 3,
  },
  "Bronze Sponsor": {
    color: "text-orange-700",
    bg: "bg-gradient-to-r from-orange-50 to-amber-100",
    border: "border-orange-300",
    dot: "bg-orange-400",
    rank: 4,
  },
};

export default function SponsorsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editIdParam = searchParams.get("edit");

  const [showGlobalError, setShowGlobalError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({ name: "" });
  const [errors, setErrors] = useState<FormErrors>({ name: false });

  const tabs = [
    "Platinum Sponsor",
    "Gold Sponsor",
    "Silver Sponsor",
    "Bronze Sponsor",
  ];
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);

  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [cover, setCover] = useState<File | null>(null);

  const fetchSponsors = async () => {
    setIsLoadingList(true);
    try {
      const response = await sponsorService.getAllSponsors();
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
      setSponsors(data);
      if (editIdParam) {
        const itemToEdit = data.find((s: Sponsor) => s._id === editIdParam);
        if (itemToEdit) handleEditClick(itemToEdit);
      }
    } catch (error) {
      console.error("Failed to fetch sponsors:", error);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, [editIdParam]);

  const handleEditClick = (item: Sponsor) => {
    setEditingId(item._id);
    setIsEditingDraft(!item.isActive);
    setFormData({ name: item.name });
    setActiveTab(item.type);
    setPreview(item.image || null);
    setCover(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsEditingDraft(false);
    setFormData({ name: "" });
    setPreview(null);
    setCover(null);
    setActiveTab(tabs[0]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.push("/create/sponsors");
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await sponsorService.deleteSponsor(itemToDelete);
      setSponsors((prev) => prev.filter((s) => s._id !== itemToDelete));
      setShowDeleteModal(false);
      setItemToDelete(null);
      setSuccessMessage({
        title: "Deleted Successfully!",
        description: "The sponsor has been permanently removed.",
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to delete sponsor:", error);
      alert("Failed to delete sponsor");
    }
  };

  const handlePublish = async () => {
    const newErrors = { name: !formData.name.trim() };
    setErrors(newErrors);
    if (
      Object.values(newErrors).some(Boolean) ||
      !activeTab ||
      (!cover && !editingId && !preview)
    ) {
      setShowGlobalError(true);
      return;
    }
    setShowGlobalError(false);
    setIsSubmitting(true);
    setLoadingAction("publishing");
    try {
      const data: SponsorData = {
        name: formData.name,
        type: activeTab,
        image: cover || undefined,
        isActive: true,
      };
      if (editingId) {
        await sponsorService.updateSponsor(editingId, data);
        setSponsors((prev) =>
          prev.map((s) =>
            s._id === editingId
              ? {
                  ...s,
                  name: data.name,
                  type: data.type,
                  image: preview || s.image,
                  isActive: true,
                }
              : s
          )
        );
      } else {
        const res = await sponsorService.createSponsor(data);
        setSponsors((prev) => [res.data, ...prev]);
      }
      setSuccessMessage({
        title:
          editingId && !isEditingDraft
            ? "Updated Successfully!"
            : "Published Successfully!",
        description:
          editingId && !isEditingDraft
            ? "Changes have been saved."
            : "Sponsor is now live.",
      });
      setShowSuccessModal(true);
      handleCancelEdit();
    } catch (error) {
      console.error("Failed to save sponsor:", error);
      alert("Failed to save sponsor");
    } finally {
      setIsSubmitting(false);
      setLoadingAction(null);
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    setLoadingAction("saving");
    setShowGlobalError(false);
    if (!formData.name.trim()) {
      setErrors({ ...errors, name: true });
      setShowGlobalError(true);
      setIsSubmitting(false);
      setLoadingAction(null);
      return;
    }
    try {
      const data: SponsorData = {
        name: formData.name,
        type: activeTab,
        image: cover || undefined,
        isActive: false,
      };
      if (editingId) {
        await sponsorService.updateSponsor(editingId, data);
        setSponsors((prev) =>
          prev.map((s) =>
            s._id === editingId
              ? {
                  ...s,
                  name: data.name,
                  type: data.type,
                  image: preview || s.image,
                  isActive: false,
                }
              : s
          )
        );
      } else {
        const res = await sponsorService.createSponsor(data);
        setSponsors((prev) => [res.data, ...prev]);
      }
      setSuccessMessage({
        title: editingId ? "Draft Updated!" : "Draft Saved!",
        description: editingId
          ? "Draft changes have been saved."
          : "Draft has been saved successfully.",
      });
      setShowSuccessModal(true);
      handleCancelEdit();
    } catch (error) {
      console.error("Failed to save draft:", error);
      alert("Failed to save draft");
    } finally {
      setIsSubmitting(false);
      setLoadingAction(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors])
      setErrors((prev) => ({ ...prev, [name]: false }));
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
            resolve(new File([blob], file.name, { type: file.type }));
          },
          file.type,
          0.8
        );
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const resized = await resizeImage(file);
      setCover(resized);
      setPreview(URL.createObjectURL(resized));
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Error resizing image", err);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const resized = await resizeImage(file);
      setCover(resized);
      setPreview(URL.createObjectURL(resized));
    } catch (err) {
      console.error("Error resizing image", err);
    }
  };

  const publishedItems = sponsors.filter((item) => item.isActive);

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
                  ? "Updating Sponsor"
                  : "Publishing Sponsor"}
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
          {/* ── PAGE HEADER ── */}
          <div className="mb-14">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-primary2 uppercase font-raleway mb-3">
              <span className="w-8 h-px bg-primary2 inline-block" />
              Sponsor Management
            </div>
            <h1 className="text-4xl sm:text-7xl font-black font-rubik leading-[0.9] tracking-tight">
              <span className="bg-gradient-to-br from-primary3 via-primary1 to-primary2 bg-clip-text text-transparent">
                {editingId ? "Edit\nSponsor" : "Compose\nSponsor"}
              </span>
            </h1>
            <p className="text-gray-500 font-raleway text-base mt-4 max-w-sm">
              {editingId
                ? "Update sponsor details and republish"
                : "Showcase your valued partners and sponsors"}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <Sidebar />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* ── FORM CARD ── */}
              <GlassCard>
                <div
                  className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${
                    editingId ? "ring-2 ring-primary1" : ""
                  }`}
                >
                  {/* Card background */}
                  <div className="absolute inset-0 bg-white" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-primary2/5 pointer-events-none" />

                  {/* Edit banner */}
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

                  <div className="relative z-10 p-6 sm:p-10">
                    {/* Section label */}
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-black font-rubik text-primary3">
                          {editingId ? "Edit Details" : "New Sponsor"}
                        </h2>
                        <p className="text-gray-400 text-sm font-raleway mt-0.5">
                          Fill in the fields below and choose a sponsorship tier
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 bg-primary2/8 rounded-full px-4 py-2">
                        <Star
                          size={12}
                          className="text-primary2 fill-primary2"
                        />
                        <span className="text-xs font-bold text-primary2 font-rubik uppercase tracking-wider">
                          {activeTab.replace(" Sponsor", "")}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* LEFT — Upload */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                          Logo <span className="text-red-400">*</span>
                        </label>

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleCoverChange}
                          ref={fileInputRef}
                        />

                        {preview ? (
                          <div className="relative group rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50 h-56">
                            <img
                              src={preview}
                              alt="sponsor preview"
                              className="w-full h-full object-contain p-6"
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
                                    if (preview) URL.revokeObjectURL(preview);
                                  } catch {}
                                  setCover(null);
                                  setPreview(null);
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
                            className={`
                            relative cursor-pointer h-56 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4
                            ${
                              isDragging
                                ? "border-primary2 bg-primary2/5 scale-[1.01]"
                                : showGlobalError && !cover && !editingId
                                ? "border-red-300 bg-red-50/50"
                                : "border-gray-200 bg-gray-50/80 hover:border-primary2/60 hover:bg-primary2/3"
                            }
                          `}
                          >
                            <div
                              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                                isDragging
                                  ? "bg-primary2 text-white"
                                  : "bg-white text-primary2 shadow-md"
                              }`}
                            >
                              <Upload size={22} strokeWidth={2.5} />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-bold text-gray-700 font-rubik">
                                {isDragging
                                  ? "Drop it!"
                                  : "Upload sponsor logo"}
                              </p>
                              <p className="text-xs text-gray-400 mt-1 font-raleway">
                                Drag & drop or click · PNG, JPG, SVG
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* RIGHT — Info */}
                      <div className="space-y-6">
                        {/* Name */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                            Sponsor Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., Tech Company Inc."
                            className={`
                            w-full font-raleway text-primary3 font-medium rounded-xl px-4 py-3.5 border-2 bg-white/80
                            transition-all duration-200 outline-none placeholder:text-gray-300
                            ${
                              errors.name
                                ? "border-red-300 focus:border-red-400 bg-red-50/30"
                                : "border-gray-200 focus:border-primary2 focus:bg-white"
                            }
                          `}
                          />
                          {errors.name && (
                            <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                              <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                              Sponsor name is required
                            </p>
                          )}
                        </div>

                        {/* Tier Selector */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold tracking-widest uppercase text-gray-400 font-rubik">
                            Sponsorship Tier{" "}
                            <span className="text-red-400">*</span>
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {tabs.map((tab) => {
                              const cfg = TIER_CONFIG[tab];
                              const isActive = activeTab === tab;
                              return (
                                <button
                                  key={tab}
                                  type="button"
                                  onClick={() => setActiveTab(tab)}
                                  className={`
                                  relative flex items-center gap-2.5 rounded-xl px-4 py-3 text-left font-rubik font-bold text-sm border-2
                                  transition-all duration-200 group
                                  ${
                                    isActive
                                      ? `${cfg.bg} ${cfg.color} ${cfg.border} shadow-sm scale-[1.02]`
                                      : "bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600"
                                  }
                                `}
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                                      isActive ? cfg.dot : "bg-gray-200"
                                    }`}
                                  />
                                  <span className="truncate">
                                    {tab.replace(" Sponsor", "")}
                                  </span>
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
                      </div>
                    </div>

                    {/* ── ACTIONS ── */}
                    <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
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
                            ? "Update Sponsor"
                            : "Publish Sponsor"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* ── MANAGE LIST ── */}
              <GlassCard>
                <div className=" bg-white rounded-2xl overflow-hidden">
                  {/* List Header */}
                  <div className="px-8 py-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h2 className="text-xl font-black font-rubik text-primary3">
                        Manage Sponsors
                      </h2>
                      <p className="text-gray-400 text-xs font-raleway mt-0.5 tracking-wide">
                        {publishedItems.length} active{" "}
                        {publishedItems.length === 1 ? "sponsor" : "sponsors"}
                      </p>
                    </div>
                    <button
                      onClick={fetchSponsors}
                      className="flex items-center gap-2 text-xs font-bold font-rubik text-primary1 border border-primary1/20 hover:border-primary1/50 hover:bg-primary1/5 px-4 py-2 rounded-full transition-all duration-200"
                    >
                      <RefreshCw
                        size={13}
                        className={isLoadingList ? "animate-spin" : ""}
                      />
                      Refresh
                    </button>
                  </div>

                  {/* Tier legend */}
                  <div className="px-8 py-3 border-b border-gray-50 flex flex-wrap gap-3">
                    {tabs.map((tab) => {
                      const cfg = TIER_CONFIG[tab];
                      const count = publishedItems.filter(
                        (s) => s.type === tab
                      ).length;
                      return (
                        <div
                          key={tab}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold font-rubik ${cfg.bg} ${cfg.color} ${cfg.border}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                          />
                          {tab.replace(" Sponsor", "")}
                          <span className="opacity-50">·</span>
                          <span className="opacity-70">{count}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Table */}
                  {isLoadingList ? (
                    <div className="py-20 flex flex-col items-center gap-3 text-gray-300">
                      <div className="w-8 h-8 border-2 border-gray-200 border-t-primary2 rounded-full animate-spin" />
                      <p className="text-sm font-raleway">
                        Loading sponsors...
                      </p>
                    </div>
                  ) : publishedItems.length === 0 ? (
                    <div className="py-20 flex flex-col items-center gap-4 text-gray-300">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                        <ImageIcon size={24} className="text-gray-300" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold font-rubik text-gray-400">
                          No sponsors yet
                        </p>
                        <p className="text-xs font-raleway mt-0.5">
                          Create one using the form above
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[580px]">
                        <thead>
                          <tr className="bg-gray-50/80">
                            <th className="px-8 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                              Logo
                            </th>
                            <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                              Name
                            </th>
                            <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                              Tier
                            </th>
                            <th className="px-8 py-3.5 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {publishedItems
                            .sort(
                              (a, b) =>
                                (TIER_CONFIG[a.type]?.rank || 9) -
                                (TIER_CONFIG[b.type]?.rank || 9)
                            )
                            .map((item, i) => {
                              const cfg =
                                TIER_CONFIG[item.type] ||
                                TIER_CONFIG["Bronze Sponsor"];
                              const isEditing = editingId === item._id;
                              return (
                                <tr
                                  key={item._id}
                                  className={`group border-t border-gray-50 transition-all duration-200 ${
                                    isEditing
                                      ? "bg-primary1/5"
                                      : "hover:bg-gray-50/70"
                                  }`}
                                >
                                  {/* Logo */}
                                  <td className="px-8 py-4">
                                    <div className="w-14 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                                      {item.image ? (
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-full h-full object-contain p-1.5"
                                        />
                                      ) : (
                                        <ImageIcon
                                          size={14}
                                          className="text-gray-300"
                                        />
                                      )}
                                    </div>
                                  </td>

                                  {/* Name */}
                                  <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                      {isEditing && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary1 animate-pulse flex-shrink-0" />
                                      )}
                                      <span className="font-bold text-sm text-gray-800 font-rubik">
                                        {item.name}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Tier */}
                                  <td className="px-4 py-4">
                                    <span
                                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                                      />
                                      {item.type.replace(" Sponsor", "")}
                                    </span>
                                  </td>

                                  {/* Actions */}
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

      {/* ── DELETE MODAL ── */}
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
              Delete Sponsor?
            </h3>
            <p className="text-gray-400 text-sm font-raleway mb-6 leading-relaxed">
              This will permanently remove the sponsor. This action cannot be
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

      {/* ── SUCCESS MODAL ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            {/* Animated check */}
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
    </section>
  );
}
