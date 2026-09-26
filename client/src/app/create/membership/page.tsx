"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/app/create/components/sidebar";
import Button from "@/app/components/button";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "@/app/components/grid";
import {
  Pencil,
  Trash2,
  RefreshCw,
  AlertTriangle,
  ChevronDown,
  Check,
  Users,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react";
import membershipService, {
  MembershipTierData,
} from "@/app/services/membership";
import { LoadingIndicator } from "@/app/components/loading";

interface MembershipTierRow extends MembershipTierData {
  _id: string;
  isActive: boolean;
}

type FormErrors = {
  planLabel: boolean;
  title: boolean;
  price: boolean;
  description: boolean;
};

const ACCENT_OPTIONS: { value: "primary" | "steel" | "sky"; label: string }[] =
  [
    { value: "steel", label: "Steel (blue-cyan)" },
    { value: "primary", label: "Primary (deep blue) — Spotlight" },
    { value: "sky", label: "Sky (light blue)" },
  ];

export default function MembershipPage() {
  // --- SETTINGS STATE ---
  const [settingsIsOpen, setSettingsIsOpen] = useState(true);
  const [settingsUrl, setSettingsUrl] = useState("");
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // --- TIER FORM STATE ---
  const [formData, setFormData] = useState({
    planLabel: "",
    title: "",
    price: "",
    description: "",
    benefitsText: "",
    accentColor: "steel" as "primary" | "steel" | "sky",
    isHighlighted: false,
  });
  const [errors, setErrors] = useState<FormErrors>({
    planLabel: false,
    title: false,
    price: false,
    description: false,
  });
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingAction, setLoadingAction] = useState<
    "saving" | "publishing" | null
  >(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [isAccentDropdownOpen, setIsAccentDropdownOpen] = useState(false);

  // --- LIST STATE ---
  const [tiers, setTiers] = useState<MembershipTierRow[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  // --- MODALS ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: "",
    description: "",
  });

  const fetchSettings = async () => {
    setSettingsLoading(true);
    try {
      const res = await membershipService.getSettings();
      if (res.data) {
        setSettingsIsOpen(res.data.isOpen ?? true);
        setSettingsUrl(res.data.registrationUrl || "");
      }
    } catch {
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchTiers = async () => {
    setIsLoadingList(true);
    try {
      const res = await membershipService.getAllTiers();
      setTiers(Array.isArray(res.data) ? res.data : []);
    } catch {
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchTiers();
  }, []);

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    try {
      await membershipService.updateSettings({
        isOpen: settingsIsOpen,
        registrationUrl: settingsUrl,
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2000);
    } catch {
      alert("Failed to save settings");
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleEditClick = (tier: MembershipTierRow) => {
    setEditingId(tier._id);
    setIsEditingDraft(!tier.isActive);
    setFormData({
      planLabel: tier.planLabel,
      title: tier.title,
      price: tier.price,
      description: tier.description,
      benefitsText: (tier.benefits || []).join("\n"),
      accentColor: tier.accentColor,
      isHighlighted: !!tier.isHighlighted,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsEditingDraft(false);
    setFormData({
      planLabel: "",
      title: "",
      price: "",
      description: "",
      benefitsText: "",
      accentColor: "steel",
      isHighlighted: false,
    });
    setErrors({ planLabel: false, title: false, price: false, description: false });
    setShowGlobalError(false);
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await membershipService.deleteTier(itemToDelete);
      setTiers((prev) => prev.filter((t) => t._id !== itemToDelete));
      setShowDeleteModal(false);
      setItemToDelete(null);
      setSuccessMessage({
        title: "Deleted Successfully!",
        description: "The membership tier has been permanently removed.",
      });
      setShowSuccessModal(true);
    } catch {
      alert("Failed to delete membership tier");
    }
  };

  const validate = () => {
    const newErrors = {
      planLabel: !formData.planLabel.trim(),
      title: !formData.title.trim(),
      price: !formData.price.trim(),
      description: !formData.description.trim(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const buildData = (isActive: boolean): MembershipTierData => ({
    planLabel: formData.planLabel,
    title: formData.title,
    price: formData.price,
    description: formData.description,
    benefits: formData.benefitsText
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean),
    accentColor: formData.accentColor,
    isHighlighted: formData.isHighlighted,
    isActive,
  });

  const handlePublish = async () => {
    if (!validate()) {
      setShowGlobalError(true);
      return;
    }
    setShowGlobalError(false);
    setIsSubmitting(true);
    setLoadingAction("publishing");
    try {
      const data = buildData(true);
      if (editingId) {
        await membershipService.updateTier(editingId, data);
      } else {
        await membershipService.createTier(data);
      }
      setSuccessMessage({
        title:
          editingId && !isEditingDraft
            ? "Updated Successfully!"
            : "Published Successfully!",
        description:
          editingId && !isEditingDraft
            ? "Changes have been saved."
            : "The tier is now live on the Membership page.",
      });
      setShowSuccessModal(true);
      handleCancelEdit();
      fetchTiers();
    } catch {
      alert("Failed to save membership tier");
    } finally {
      setIsSubmitting(false);
      setLoadingAction(null);
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    setLoadingAction("saving");
    setShowGlobalError(false);
    if (!formData.planLabel.trim() && !formData.title.trim()) {
      setErrors((p) => ({ ...p, planLabel: true, title: true }));
      setShowGlobalError(true);
      setIsSubmitting(false);
      setLoadingAction(null);
      return;
    }
    try {
      const data = {
        ...buildData(false),
        title: formData.title || "Untitled Tier",
        price: formData.price || "TBA",
        description: formData.description || "TBA",
      };
      if (editingId) {
        await membershipService.updateTier(editingId, data);
      } else {
        await membershipService.createTier(data);
      }
      setSuccessMessage({
        title: editingId ? "Draft Updated!" : "Draft Saved!",
        description: editingId
          ? "Draft changes have been saved."
          : "Draft has been saved successfully.",
      });
      setShowSuccessModal(true);
      handleCancelEdit();
      fetchTiers();
    } catch {
      alert("Failed to save draft");
    } finally {
      setIsSubmitting(false);
      setLoadingAction(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name in errors)
      setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const inputCls =
    "w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all placeholder-gray-400 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10";

  const selectedAccentLabel =
    ACCENT_OPTIONS.find((o) => o.value === formData.accentColor)?.label ??
    "Select accent";

  const publishedTiers = tiers.filter((t) => t.isActive);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#004e89]">
      {(isSubmitting || settingsSaving) && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/90 backdrop-blur-md">
          <div className="flex flex-col items-center gap-5">
            <LoadingIndicator />
            <div className="text-center">
              <p className="text-primary3 font-bold font-rubik text-lg">
                {settingsSaving
                  ? "Saving Settings"
                  : loadingAction === "saving"
                    ? "Saving Draft"
                    : editingId
                      ? "Updating Tier"
                      : "Publishing Tier"}
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

          <div className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-40 sm:pt-48 pb-20">
            <div className="mb-10 text-left">
              <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
                Manage Membership
              </h1>
              <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl">
                Control the pricing tiers and registration link shown on the
                public Membership page.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-stretch lg:items-start">
              <aside className="w-full lg:w-64 shrink-0">
                <Sidebar />
              </aside>

              <div className="flex-1 min-w-0 space-y-8">
                {/* ── SETTINGS CARD ── */}
                <div className="bg-white rounded-4xl border border-gray-200 transition-all duration-300 shadow-lg p-6 sm:p-10 hover:shadow-primary1/40 hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-8">
                    <p className="text-gray-400 text-sm font-raleway">
                      Sitewide registration controls
                    </p>
                    <div className="hidden sm:flex items-center gap-1.5 bg-primary1/8 rounded-full px-4 py-2">
                      <Sparkles size={12} className="text-primary1" />
                      <span className="text-xs font-bold text-primary1 font-rubik uppercase tracking-wider">
                        Settings
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                        Registration Status
                      </label>
                      <button
                        type="button"
                        onClick={() => setSettingsIsOpen((v) => !v)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <span
                          className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors duration-300 ${
                            settingsIsOpen ? "bg-primary1" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                              settingsIsOpen ? "translate-x-7" : "translate-x-1"
                            }`}
                          />
                        </span>
                        <span className="font-rubik text-sm font-semibold text-gray-700">
                          {settingsIsOpen
                            ? "Open — accepting registrations"
                            : "Closed — registration disabled"}
                        </span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                        Registration Link
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <LinkIcon size={16} />
                        </div>
                        <input
                          value={settingsUrl}
                          onChange={(e) => setSettingsUrl(e.target.value)}
                          placeholder="https://forms.gle/..."
                          className={`${inputCls} pl-11`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-end gap-4">
                    {settingsSaved && (
                      <p className="text-green-600 text-xs font-bold font-raleway flex items-center gap-1.5">
                        <Check size={14} /> Saved
                      </p>
                    )}
                    <Button
                      variant="hero"
                      onClick={handleSaveSettings}
                      disabled={settingsSaving || settingsLoading}
                      className="px-5 py-2 sm:px-8 sm:py-3"
                    >
                      Save Settings
                    </Button>
                  </div>
                </div>

                {/* ── TIER FORM CARD ── */}
                <div
                  className={`bg-white rounded-4xl border transition-all duration-300 shadow-lg p-6 sm:p-10 lg:p-12 hover:shadow-primary1/40 hover:-translate-y-2 ${
                    editingId
                      ? "border-primary1 ring-2 ring-primary1/20"
                      : "border-gray-200"
                  }`}
                >
                  {editingId && (
                    <div className="-mx-6 sm:-mx-10 lg:-mx-12 -mt-6 sm:-mt-10 lg:-mt-12 mb-8 bg-linear-to-r from-primary1 to-primary3 px-6 sm:px-10 py-5 flex items-center justify-between rounded-t-4xl">
                      <div className="flex items-center gap-2 text-white">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="text-sm font-bold font-rubik tracking-wide">
                          EDITING MODE
                        </span>
                      </div>
                      <button
                        onClick={handleCancelEdit}
                        className="text-white/80 hover:text-white text-sm font-bold font-raleway underline underline-offset-2 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-8">
                    <p className="text-gray-400 text-sm font-raleway">
                      Fill in the fields below
                    </p>
                    <div className="hidden sm:flex items-center gap-1.5 bg-primary2/8 rounded-full px-4 py-2">
                      <Users size={12} className="text-primary2" />
                      <span className="text-xs font-bold text-primary2 font-rubik uppercase tracking-wider">
                        Membership Tier
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                          Plan Label <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="planLabel"
                          value={formData.planLabel}
                          onChange={handleInputChange}
                          placeholder="e.g., Student"
                          className={`${inputCls} ${errors.planLabel ? "border-red-300 ring-2 ring-red-100" : ""}`}
                        />
                        {errors.planLabel && (
                          <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                            Plan label is required
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="e.g., Student Chapter"
                          className={`${inputCls} ${errors.title ? "border-red-300 ring-2 ring-red-100" : ""}`}
                        />
                        {errors.title && (
                          <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                            Title is required
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                          Price <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="e.g., ₱160"
                          className={`${inputCls} ${errors.price ? "border-red-300 ring-2 ring-red-100" : ""}`}
                        />
                        {errors.price && (
                          <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                            Price is required
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                          Accent Color
                        </label>
                        <div className="relative">
                          <div
                            onClick={() => setIsAccentDropdownOpen((p) => !p)}
                            className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border bg-gray-50 px-4 py-3 font-rubik text-base text-gray-700 transition-all hover:bg-gray-100 border-gray-200 ${
                              isAccentDropdownOpen
                                ? "bg-white border-primary1 ring-4 ring-primary1/10"
                                : ""
                            }`}
                          >
                            <span>{selectedAccentLabel}</span>
                            <ChevronDown
                              className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${
                                isAccentDropdownOpen ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                          {isAccentDropdownOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsAccentDropdownOpen(false)}
                              />
                              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                                <div className="flex flex-col gap-1 p-2 max-h-56 overflow-y-auto themed-scrollbar">
                                  {ACCENT_OPTIONS.map((opt) => (
                                    <div
                                      key={opt.value}
                                      onClick={() => {
                                        setFormData((prev) => ({
                                          ...prev,
                                          accentColor: opt.value,
                                        }));
                                        setIsAccentDropdownOpen(false);
                                      }}
                                      className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 font-rubik text-sm transition-colors ${
                                        formData.accentColor === opt.value
                                          ? "bg-primary1/5 text-primary1"
                                          : "text-gray-700 hover:bg-gray-50"
                                      }`}
                                    >
                                      <span>{opt.label}</span>
                                      {formData.accentColor === opt.value && (
                                        <Check className="h-4 w-4 text-primary1" />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer w-fit">
                        <span
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              isHighlighted: !prev.isHighlighted,
                            }))
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                            formData.isHighlighted ? "bg-primary1" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                              formData.isHighlighted
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </span>
                        <span className="font-raleway text-sm font-semibold text-gray-700">
                          Spotlight this tier (center, larger card)
                        </span>
                      </label>
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="e.g., For active students within the CIT-U chapter."
                          rows={3}
                          className={`${inputCls} resize-none ${errors.description ? "border-red-300 ring-2 ring-red-100" : ""}`}
                        />
                        {errors.description && (
                          <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                            Description is required
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                          Benefits{" "}
                          <span className="text-gray-400 font-normal">
                            (one per line)
                          </span>
                        </label>
                        <textarea
                          name="benefitsText"
                          value={formData.benefitsText}
                          onChange={handleInputChange}
                          placeholder={
                            "Access to exclusive local workshops & seminars.\nDiscounts on chapter-led events and merchandise."
                          }
                          rows={6}
                          className={`${inputCls} resize-none`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                    {showGlobalError && (
                      <p className="text-red-400 text-xs font-bold font-raleway flex items-center gap-1.5">
                        <AlertTriangle size={12} /> Please fill all required
                        fields
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 ml-auto">
                      {editingId && (
                        <Button
                          type="button"
                          variant="heroOutline"
                          onClick={handleCancelEdit}
                          className="px-4 py-2 sm:px-6 sm:py-3"
                        >
                          Cancel
                        </Button>
                      )}
                      {(!editingId || isEditingDraft) && (
                        <Button
                          type="button"
                          variant="heroOutline"
                          onClick={handleSaveDraft}
                          disabled={isSubmitting}
                          className="px-4 py-2 sm:px-6 sm:py-3"
                        >
                          {editingId ? "Update Draft" : "Save Draft"}
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="hero"
                        onClick={handlePublish}
                        disabled={isSubmitting}
                        className="px-5 py-2 sm:px-8 sm:py-3"
                      >
                        {editingId && !isEditingDraft
                          ? "Update Tier"
                          : "Publish Tier"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* ── LIST ── */}
                <div className="bg-white rounded-4xl border transition-all duration-300 shadow-md hover:shadow-primary1/40 hover:-translate-y-2 border-gray-200 overflow-hidden">
                  <div className="px-6 sm:px-8 py-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold font-rubik text-primary3">
                        Membership Tiers
                      </h2>
                      <p className="text-gray-400 text-xs font-raleway mt-0.5 tracking-wide">
                        {publishedTiers.length} active{" "}
                        {publishedTiers.length === 1 ? "tier" : "tiers"}
                      </p>
                    </div>
                    <button
                      onClick={fetchTiers}
                      className="flex items-center gap-2 text-xs font-bold font-rubik text-primary1 border border-primary1/20 hover:border-primary1/50 hover:bg-primary1/5 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer"
                    >
                      <RefreshCw
                        size={13}
                        className={isLoadingList ? "animate-spin" : ""}
                      />
                      Refresh
                    </button>
                  </div>

                  {isLoadingList ? (
                    <LoadingIndicator label="Loading tiers..." className="py-16" />
                  ) : tiers.length === 0 ? (
                    <div className="py-20 flex flex-col items-center gap-4 text-gray-300">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                        <Users size={24} className="text-gray-300" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold font-rubik text-gray-400">
                          No membership tiers yet
                        </p>
                        <p className="text-xs font-raleway mt-0.5">
                          Create one using the form above
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto themed-scrollbar">
                      <table className="responsive-table w-full text-left min-w-170">
                        <thead>
                          <tr className="bg-gray-50/80">
                            <th className="px-6 sm:px-8 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                              Plan
                            </th>
                            <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                              Title
                            </th>
                            <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                              Price
                            </th>
                            <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                              Accent
                            </th>
                            <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                              Status
                            </th>
                            <th className="px-6 sm:px-8 py-3.5 text-right text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {tiers.map((tier) => {
                            const isEditing = editingId === tier._id;
                            return (
                              <tr
                                key={tier._id}
                                className={`group border-t border-gray-50 transition-all duration-200 ${isEditing ? "bg-primary1/5" : "hover:bg-gray-50/70"}`}
                              >
                                <td data-label="Plan" data-primary="media" className="px-6 sm:px-8 py-4">
                                  <div className="flex items-center gap-2">
                                    {isEditing && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-primary1 animate-pulse shrink-0" />
                                    )}
                                    <span className="font-bold text-sm text-gray-800 font-rubik">
                                      {tier.planLabel}
                                    </span>
                                    {tier.isHighlighted && (
                                      <Sparkles
                                        size={13}
                                        className="text-amber-400"
                                      />
                                    )}
                                  </div>
                                </td>
                                <td data-label="Title" data-primary="" className="px-4 py-4">
                                  <span className="text-xs text-gray-600 font-raleway">
                                    {tier.title}
                                  </span>
                                </td>
                                <td data-label="Price" className="px-4 py-4">
                                  <span className="text-xs text-gray-600 font-raleway">
                                    {tier.price}
                                  </span>
                                </td>
                                <td data-label="Accent" className="px-4 py-4">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-raleway font-semibold border ${
                                      tier.accentColor === "primary"
                                        ? "bg-primary1/8 text-primary1 border-primary1/30"
                                        : tier.accentColor === "sky"
                                          ? "bg-sky-50 text-sky-600 border-sky-200"
                                          : "bg-cyan-50 text-cyan-600 border-cyan-200"
                                    }`}
                                  >
                                    {tier.accentColor}
                                  </span>
                                </td>
                                <td data-label="Status" className="px-4 py-4">
                                  {tier.isActive ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-raleway font-semibold border bg-green-50 text-green-700 border-green-200">
                                      Published
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-raleway font-semibold border bg-amber-50 text-amber-700 border-amber-200">
                                      Draft
                                    </span>
                                  )}
                                </td>
                                <td data-label="Actions" className="px-6 sm:px-8 py-4 text-right">
                                  <div className="inline-flex items-center gap-1 opacity-100 lg:opacity-40 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => handleEditClick(tier)}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-raleway font-semibold whitespace-nowrap text-gray-400 hover:text-primary1 hover:bg-primary1/10 rounded-lg transition-all duration-150 cursor-pointer"
                                      title="Edit"
                                    >
                                      <Pencil size={15} />
                                        Edit
                                    </button>
                                    <button
                                      onClick={() => confirmDelete(tier._id)}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-raleway font-semibold whitespace-nowrap text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150 cursor-pointer"
                                      title="Delete"
                                    >
                                      <Trash2 size={15} />
                                        Delete
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

      <div className="-mt-8.75 md:-mt-20 relative z-0">
        <Footer />
      </div>

      {/* ── DELETE MODAL ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-primary3 font-rubik mb-2">
              Delete Tier?
            </h3>
            <p className="text-gray-400 text-sm font-raleway mb-6 leading-relaxed">
              This will permanently remove this membership tier from the
              public page. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="heroOutline"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 sm:py-3"
              >
                Cancel
              </Button>
              <Button
                variant="heroDanger"
                onClick={handleDelete}
                className="flex-1 py-2 sm:py-3"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUCCESS MODAL ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" />
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl relative">
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
              <h3 className="text-xl font-bold text-primary3 font-rubik">
                {successMessage.title}
              </h3>
              <p className="text-gray-400 text-sm font-raleway mt-2">
                {successMessage.description}
              </p>
            </div>
            <Button
              variant="hero"
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-2 text-sm sm:py-3"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
