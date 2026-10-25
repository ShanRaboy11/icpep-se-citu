"use client";

import { inputClass, labelStyle } from "@/app/components/ui/form-styles";
import ImageUploadField from "@/app/components/ui/image-upload-field";
import ConfirmModal from "@/app/components/ui/confirm-modal";
import SuccessModal from "@/app/components/ui/success-modal";
import EditingBanner from "@/app/components/ui/editing-banner";
import { swapToFallback } from "@/app/components/ui/fallback-image";
import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/app/components/create/sidebar";
import Header from "@/app/components/layout/header";
import Footer from "@/app/components/layout/footer";
import Grid from "@/app/components/layout/grid";
import Button from "@/app/components/ui/button";
import testimonialService from "@/app/services/testimonial";
import {
  Pencil,
  Trash2,
  AlertTriangle,
  Quote } from "lucide-react";
import { LoadingIndicator } from "@/app/components/feedback/loading";
import ManageListCard from "@/app/components/create/manage-list-card";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  quote: string;
  image?: string;
  isActive: boolean;
}

type FormErrors = {
  name: boolean;
  position: boolean;
  message: boolean;
};

export default function TestimonialsPage() {
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    name: false,
    position: false,
    message: false,
  });
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
  const [isDragging, setIsDragging] = useState(false);

  const searchParams = useSearchParams();
  const editIdParam = searchParams.get("edit");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [cover, setCover] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);


  // --- FETCH ---
  const fetchTestimonials = async () => {
    try {
      setIsLoadingList(true);
      const response = await testimonialService.getAllTestimonials();
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];
      setTestimonials(data);
      if (editIdParam) {
        const itemToEdit = data.find((t: Testimonial) => t._id === editIdParam);
        if (itemToEdit) handleEditClick(itemToEdit);
      }
    } catch {
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [editIdParam]);

  const handleEditClick = (item: Testimonial) => {
    setEditingId(item._id);
    setIsEditingDraft(!item.isActive);
    setFormData({ name: item.name, position: item.role, message: item.quote });
    setPreview(item.image || null);
    setCover(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsEditingDraft(false);
    setFormData({ name: "", position: "", message: "" });
    setPreview(null);
    setCover(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      setTestimonials((prev) => prev.filter((t) => t._id !== itemToDelete));
      setShowDeleteModal(false);
      setItemToDelete(null);
      setSuccessMessage({
        title: "Deleted Successfully!",
        description: "The testimonial has been permanently removed.",
      });
      setShowSuccessModal(true);
    } catch {
      alert("Failed to delete testimonial");
    }
  };

  const handleSaveDraft = async () => {
    const newErrors = {
      name: !formData.name.trim(),
      position: !formData.position.trim(),
      message: !formData.message.trim(),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      setShowGlobalError(true);
      return;
    }
    setIsSubmitting(true);
    setLoadingAction("saving");
    setShowGlobalError(false);
    try {
      const payload = {
        name: formData.name,
        role: formData.position,
        quote: formData.message,
        image: cover || undefined,
        isActive: false,
      };
      if (editingId)
        await testimonialService.updateTestimonial(editingId, payload);
      else await testimonialService.createTestimonial(payload);
      handleCancelEdit();
      setSuccessMessage({
        title: editingId ? "Draft Updated!" : "Draft Saved!",
        description: editingId
          ? "Draft changes have been saved."
          : "Draft has been saved successfully.",
      });
      setShowSuccessModal(true);
      fetchTestimonials();
    } catch {
      alert("Failed to save draft.");
    } finally {
      setIsSubmitting(false);
      setLoadingAction(null);
    }
  };

  const handlePublish = async () => {
    const newErrors = {
      name: !formData.name.trim(),
      position: !formData.position.trim(),
      message: !formData.message.trim(),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      setShowGlobalError(true);
      return;
    }
    setIsSubmitting(true);
    setLoadingAction("publishing");
    setShowGlobalError(false);
    try {
      const payload = {
        name: formData.name,
        role: formData.position,
        quote: formData.message,
        image: cover || undefined,
        isActive: true,
      };
      if (editingId)
        await testimonialService.updateTestimonial(editingId, payload);
      else await testimonialService.createTestimonial(payload);
      handleCancelEdit();
      setSuccessMessage({
        title:
          editingId && !isEditingDraft
            ? "Updated Successfully!"
            : "Published Successfully!",
        description:
          editingId && !isEditingDraft
            ? "Changes have been saved."
            : "Testimonial is now live.",
      });
      setShowSuccessModal(true);
      fetchTestimonials();
    } catch {
      alert("Failed to publish testimonial.");
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
    if (errors[name as keyof typeof errors])
      setErrors((prev) => ({ ...prev, [name]: false }));
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
          0.8,
        );
      };
      reader.readAsDataURL(file);
    });

  const MAX_IMAGE_SIZE_MB = 5;

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      alert(`Image must be ${MAX_IMAGE_SIZE_MB}MB or smaller.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    try {
      const resized = await resizeImage(file);
      setCover(resized);
      setPreview(URL.createObjectURL(resized));
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      alert(`Image must be ${MAX_IMAGE_SIZE_MB}MB or smaller.`);
      return;
    }
    try {
      const resized = await resizeImage(file);
      setCover(resized);
      setPreview(URL.createObjectURL(resized));
    } catch {
    }
  };

  const publishedItems = testimonials.filter((item) => item.isActive);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-pageblue">
      {isSubmitting && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/90 backdrop-blur-md">
          <div className="flex flex-col items-center gap-5">
            <LoadingIndicator />
            <div className="text-center">
              <p className="text-primary3 font-bold font-rubik text-lg">
                {loadingAction === "saving"
                  ? "Saving Draft"
                  : editingId
                    ? "Updating Testimonial"
                    : "Publishing Testimonial"}
              </p>
              <p className="text-gray-400 text-sm font-raleway mt-1">
                Please wait a moment...
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 bg-surface rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />

          <div className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-40 sm:pt-48 pb-20">
            {/* ── PAGE HEADER ── */}
            <div className="mb-16 text-left">
              <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
                Manage Testimonials
              </h1>
              <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl">
                Share valuable feedback and member experiences.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-stretch lg:items-start">
              <aside className="w-full lg:w-64 shrink-0">
                <Sidebar />
              </aside>

              <div className="flex-1 min-w-0 space-y-8">
                {/* ── FORM CARD ── */}
                <div className={`bg-white rounded-4xl border transition-all duration-300 shadow-md p-6 sm:p-10 lg:p-12 hover:shadow-primary1/40 hover:-translate-y-2 ${
                  editingId ? "border-primary1 ring-2 ring-primary1/20" : "border-gray-200"
                }`}>
                    {editingId && (
                      <EditingBanner onCancel={handleCancelEdit} />
                    )}

                    <div className="flex items-center justify-between mb-8">
                      <div>
                      <p className="text-gray-400 text-sm font-raleway mt-0.5">
                            Fill in the fields below to add a testimonial
                          </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 bg-primary2/8 rounded-full px-4 py-2">
                        <Quote size={12} className="text-primary2" />
                        <span className="text-xs font-bold text-primary2 font-rubik uppercase tracking-wider">
                          Testimonial
                        </span>
                      </div>
                    </div>

                      {/* Top grid: photo + name/role */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* LEFT — Photo Upload */}
                        <div className="space-y-3">
                          <label className={`${labelStyle}`}>
                            Profile Photo
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoverChange}
                            ref={fileInputRef}
                          />

                          <ImageUploadField
                            preview={preview}
                            alt="profile preview"
                            title="Upload profile photo"
                            hint="Drag & drop or click · PNG, JPG"
                            isDragging={isDragging}
                            onBrowse={() => fileInputRef.current?.click()}
                            onDragChange={setIsDragging}
                            onDrop={handleDrop}
                            onRemove={() => { try { if (preview) URL.revokeObjectURL(preview); } catch {} setCover(null); setPreview(null); }}
                          />
                        </div>

                        {/* RIGHT — Name & Role */}
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <label
                              htmlFor="name"
                              className={`${labelStyle}`}
                            >
                              Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              id="name"
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="e.g., John Smith"
                              className={inputClass(Boolean(errors.name))}
                            />
                            {errors.name && (
                              <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                                <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                                Full name is required
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className={labelStyle}>
                              Position / Title{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              id="position"
                              type="text"
                              name="position"
                              value={formData.position}
                              onChange={handleInputChange}
                              placeholder="e.g., CEO at Tech Company"
                              className={inputClass(Boolean(errors.position))}
                            />
                            {errors.position && (
                              <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                                <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                                Position is required
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ── MESSAGE FIELD (full width) ── */}
                      <div className="mt-8 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className={labelStyle}>
                            Testimonial Message{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <span className="text-[11px] text-gray-300 font-raleway">
                            {formData.message.length} characters
                          </span>
                        </div>

                        <div className="relative">
                          <div className="absolute top-3 left-4 text-primary2/20 pointer-events-none">
                            <Quote size={28} />
                          </div>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Share your experience, feedback, or thoughts here"
                            rows={5}
                            className={`w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3 outline-none transition-all placeholder-gray-400 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10 resize-none ${
                              errors.message ? "border-red-300 ring-2 ring-red-100" : ""
                            }`}
                          />
                        </div>
                        {errors.message && (
                          <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                            Message is required
                          </p>
                        )}
                      </div>

                      {/* ── ACTIONS ── */}
                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                        {showGlobalError && (
                          <p className="text-red-400 text-xs font-bold font-raleway flex items-center gap-1.5">
                            <AlertTriangle size={12} /> Please fill all required fields
                          </p>
                        )}
                        <div className="flex flex-wrap gap-3 ml-auto">
                          {editingId && (
                            <Button
                              type="button"
                              variant="heroCancel"
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
                              ? "Update Testimonial"
                              : "Publish Testimonial"}
                          </Button>
                        </div>
                      </div>
                </div>

                {/* ── MANAGE LIST ── */}
                <ManageListCard
                  title="Manage Testimonials"
                  count={publishedItems.length}
                  singular="testimonial"
                  plural="testimonials"
                  status="active"
                  loading={isLoadingList}
                  onRefresh={fetchTestimonials}
                  emptyIcon={<Quote size={24} className="text-gray-300" />}
                  emptyTitle="No testimonials yet"
                  emptyHint="Create one using the form above"
                  columns={["Author","Message","Actions"]}
                  minWidth="min-w-145"
                >
                            {publishedItems.map((item) => {
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
                                  <td data-label="Author" data-primary="" className="px-6 sm:px-8 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-100 shrink-0">
                                        {item.image ? (
                                          <img
                                            src={item.image}
                                            onError={swapToFallback}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-primary1/10 text-primary1 text-xs font-bold font-rubik">
                                            {item.name.charAt(0)}
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          {isEditing && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary1 animate-pulse shrink-0" />
                                          )}
                                          <span className="font-bold text-sm text-gray-800 font-rubik">
                                            {item.name}
                                          </span>
                                        </div>
                                        <p className="text-xs text-primary1 font-semibold font-raleway mt-0.5">
                                          {item.role}
                                        </p>
                                      </div>
                                    </div>
                                  </td>

                                  <td data-label="Message" data-long className="px-4 py-4 max-w-sm">
                                    <p className="text-xs text-gray-500 font-raleway italic line-clamp-2 leading-relaxed">
                                      <Quote
                                        size={10}
                                        className="inline text-primary2/40 mr-1 -mt-0.5"
                                      />
                                      {item.quote}
                                    </p>
                                  </td>

                                  <td data-label="Actions" className="px-6 sm:px-8 py-4 text-right">
                                    <div className="inline-flex items-center gap-1 opacity-100 lg:opacity-40 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => handleEditClick(item)}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-raleway font-semibold whitespace-nowrap text-gray-400 hover:text-primary1 hover:bg-primary1/10 rounded-lg transition-all duration-150 cursor-pointer"
                                        title="Edit"
                                      >
                                        <Pencil size={15} />
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => confirmDelete(item._id)}
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
                </ManageListCard>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="-mt-8.75 md:-mt-20 relative z-0">
        <Footer />
      </div>

      {/* ── DELETE MODAL ── */}
      <ConfirmModal
        open={showDeleteModal}
        title="Delete Testimonial?"
        message="This will permanently remove the testimonial. This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />

      {/* ── SUCCESS MODAL ── */}
      <SuccessModal
        open={showSuccessModal}
        title={successMessage.title}
        description={successMessage.description}
        buttonLabel="Continue"
        onClose={() => { setShowSuccessModal(false); }}
      />
    </div>
  );
}
