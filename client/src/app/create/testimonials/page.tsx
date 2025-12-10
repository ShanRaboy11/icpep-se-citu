"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/app/components/sidebar";
import Button from "@/app/components/button";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "@/app/components/grid";
import testimonialService from "@/app/services/testimonial";
// Added icons for the management list
import { Pencil, Trash2, RefreshCw } from "lucide-react";

// Define interface for data
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
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const editIdParam = searchParams.get("edit");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- NEW STATE FOR MANAGEMENT ---
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);

  // 1. Fetch List on Load
  const fetchTestimonials = async () => {
    try {
      setIsLoadingList(true);
      const response = await testimonialService.getAllTestimonials();
      // Handle response structure depending on your backend
      const data = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
      setTestimonials(data);

      if (editIdParam) {
        const itemToEdit = data.find((t: Testimonial) => t._id === editIdParam);
        if (itemToEdit) {
          handleEditClick(itemToEdit);
        }
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [editIdParam]);

  // 2. Handle Edit Click (Populate Form)
  const handleEditClick = (item: Testimonial) => {
    setEditingId(item._id);
    setIsEditingDraft(!item.isActive);
    setFormData({
      name: item.name,
      position: item.role,
      message: item.quote,
    });
    setPreview(item.image || null);
    setCover(null); // Keep null so we don't upload a new file unless changed
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 3. Handle Cancel Edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setIsEditingDraft(false);
    setFormData({ name: "", position: "", message: "" });
    setPreview(null);
    setCover(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 4. Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      //await testimonialService.deleteTestimonial(id);
      fetchTestimonials(); // Refresh list
    } catch (error) {
      alert("Failed to delete testimonial");
    }
  };

  // 5. Handle Save Draft
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
    setShowGlobalError(false);

    try {
      const payload = {
        name: formData.name,
        role: formData.position,
        quote: formData.message,
        image: cover || undefined,
        isActive: false, // Draft
      };

      if (editingId) {
        // UPDATE MODE
        //await testimonialService.updateTestimonial(editingId, payload);
      } else {
        // CREATE MODE
        await testimonialService.createTestimonial(payload);
      }

      // Reset form & Refresh list
      handleCancelEdit();
      setSubmitSuccess(true);
      setShowSuccessModal(true);
      fetchTestimonials();
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. Updated Publish Logic
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
    setShowGlobalError(false);

    try {
      const payload = {
        name: formData.name,
        role: formData.position,
        quote: formData.message,
        image: cover || undefined, // undefined keeps existing image on update
        isActive: true,
      };

      if (editingId) {
        // UPDATE MODE
        //await testimonialService.updateTestimonial(editingId, payload);
      } else {
        // CREATE MODE
        await testimonialService.createTestimonial(payload);
      }

      // Reset form & Refresh list
      handleCancelEdit();
      setSubmitSuccess(true);
      setShowSuccessModal(true);
      fetchTestimonials();
    } catch (error) {
      console.error("Error publishing testimonial:", error);
      alert("Failed to publish testimonial. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error as soon as user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const [cover, setCover] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const resized = await resizeImage(file);
    setCover(resized);
    setPreview(URL.createObjectURL(resized));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
            <p className="text-gray-700 font-rubik text-base font-semibold">
              {editingId ? "Updating..." : "Publishing..."}
            </p>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-16">
          {/* Page Header with Gradient */}
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary1/10 to-primary2/10 rounded-3xl blur-3xl -z-10" />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-6xl font-bold font-rubik bg-gradient-to-r from-primary3 via-primary1 to-primary2 bg-clip-text text-transparent mb-3">
                {editingId ? "Edit Testimonial" : "Compose Testimonial"}
              </h1>
              <p className="text-gray-600 font-raleway text-lg">
                {editingId
                  ? "Update the details below"
                  : "Share valuable feedback and experiences"}
              </p>
            </div>
          </div>

          {/* Sidebar + Main Form */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="sticky top-24">
                <Sidebar />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-12">
              {/* 1. EXISTING FORM (Wrapped) */}
              <div
                className={`bg-white rounded-3xl shadow-xl shadow-gray-200/50 border overflow-hidden transition-all duration-300 ${
                  editingId
                    ? "border-primary1 shadow-primary1/20"
                    : "border-gray-100"
                }`}
              >
                {/* Added: Edit Mode Banner */}
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
                      : "Fill in the information below to create a testimonial"}
                  </p>
                </div>

                <div className="p-8 space-y-8">
                  {/* Upload Image Section */}
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
                        Profile Image
                      </label>
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverChange}
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
                      {preview ? (
                        <div className="relative overflow-hidden rounded-2xl">
                          <img
                            src={preview}
                            alt="cover preview"
                            className="w-full h-64 object-cover rounded-2xl border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                          <button
                            type="button"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              try {
                                if (preview) URL.revokeObjectURL(preview);
                              } catch {}
                              setCover(null);
                              setPreview(null);
                            }}
                            aria-label="Remove image"
                            className="absolute top-4 right-4 bg-white w-10 h-10 flex items-center justify-center rounded-full text-red-500 shadow-lg hover:bg-red-50 hover:scale-110 transition-all duration-200 font-bold text-xl"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                            showGlobalError && !cover
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
                                Click to upload profile image
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

                  {/* Divider */}
                  <div className="border-t border-gray-200 pt-8">
                    <div className="flex items-center gap-2 mb-6">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <h3 className="text-2xl font-bold text-primary3 font-rubik">
                        Personal Information
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 font-raleway mb-6">
                      Provide the author's details for this testimonial
                    </p>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary3 font-raleway flex items-center gap-2">
                      Full Name
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., John Smith"
                        className={`w-full font-raleway rounded-xl px-4 py-3.5 pr-10
                        border-2 transition-all duration-200
                        ${
                          errors.name
                            ? "border-red-400 bg-red-50 text-red-900 placeholder-red-400"
                            : "border-gray-200 bg-white text-gray-700 placeholder-gray-400"
                        }
                        focus:outline-none focus:border-primary2 focus:ring-4 focus:ring-primary2/10 focus:text-black focus:bg-white
                      `}
                      />
                      {errors.name && (
                        <svg
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-600 font-raleway flex items-center gap-1">
                        <span>•</span> Please enter a full name
                      </p>
                    )}
                  </div>

                  {/* Position Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary3 font-raleway flex items-center gap-2">
                      Position/Title
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="position"
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        placeholder="e.g., CEO at Tech Company"
                        className={`w-full font-raleway rounded-xl px-4 py-3.5 pr-10
                        border-2 transition-all duration-200
                        ${
                          errors.position
                            ? "border-red-400 bg-red-50 text-red-900 placeholder-red-400"
                            : "border-gray-200 bg-white text-gray-700 placeholder-gray-400"
                        }
                        focus:outline-none focus:border-primary2 focus:ring-4 focus:ring-primary2/10 focus:text-black focus:bg-white
                      `}
                      />
                      {errors.position && (
                        <svg
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </div>
                    {errors.position && (
                      <p className="text-sm text-red-600 font-raleway flex items-center gap-1">
                        <span>•</span> Please enter a position or title
                      </p>
                    )}
                  </div>

                  {/* Message Textarea */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary3 font-raleway flex items-center gap-2">
                      Testimonial Message
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Share your experience, feedback, or thoughts here..."
                        rows={6}
                        className={`w-full font-raleway rounded-xl px-4 py-3.5
                        border-2 transition-all duration-200 resize-none
                        ${
                          errors.message
                            ? "border-red-400 bg-red-50 text-red-900 placeholder-red-400"
                            : "border-gray-200 bg-white text-gray-700 placeholder-gray-400"
                        }
                        focus:outline-none focus:border-primary2 focus:ring-4 focus:ring-primary2/10 focus:text-black focus:bg-white
                      `}
                      />
                    </div>
                    {errors.message && (
                      <p className="text-sm text-red-600 font-raleway flex items-center gap-1">
                        <span>•</span> Please enter a testimonial message
                      </p>
                    )}
                    <p className="text-xs text-gray-500 font-raleway">
                      {formData.message.length} characters
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                    {showGlobalError && (
                      <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-xl border border-red-200 w-full sm:w-auto">
                        <svg
                          className="w-5 h-5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-sm font-raleway font-medium">
                          Please fill all required fields
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 ml-auto w-full sm:w-auto">


                      {/* Show Cancel if editing */}
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
                          className="flex-1 sm:flex-none"
                          onClick={handleSaveDraft}
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
                        <span className="flex items-center gap-2">
                          {editingId && !isEditingDraft ? "Update Testimonial" : "Publish"}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. THE NEW MANAGE TESTIMONIALS LIST */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-primary3 font-rubik">
                      Manage Testimonials
                    </h2>
                    <p className="text-gray-500 font-raleway text-sm mt-1">
                      Manage your published testimonials list.
                    </p>
                  </div>
                  <button
                    onClick={fetchTestimonials}
                    className="flex items-center gap-2 text-sm text-primary1 font-bold hover:bg-primary1/10 px-4 py-2 rounded-lg transition-colors"
                  >
                    <RefreshCw size={16} /> Refresh List
                  </button>
                </div>

                <div className="overflow-x-auto">
                  {isLoadingList ? (
                    <div className="p-12 text-center text-gray-500 font-raleway">
                      Loading existing testimonials...
                    </div>
                  ) : testimonials.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 font-raleway">
                      No testimonials found. Create your first one above!
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold font-rubik tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Author</th>
                          <th className="px-6 py-4">Message</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-raleway">
                        {testimonials.map((item) => (
                          <tr
                            key={item._id}
                            className={`hover:bg-blue-50/40 transition-colors group ${
                              editingId === item._id
                                ? "bg-blue-50 ring-1 ring-inset ring-primary1/30"
                                : ""
                            }`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-200">
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary1/10 text-primary1 text-xs font-bold">
                                      {item.name.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-800 font-rubik">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-primary1">
                                    {item.role}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-600 line-clamp-2 max-w-md italic">
                                "{item.quote}"
                              </p>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleEditClick(item)}
                                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Pencil size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(item._id)}
                                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
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
                      ? "Your changes have been saved."
                      : "Your testimonial has been published and is now live."}
                  </p>
                </div>

                <div className="flex gap-3 mt-2 w-full">
                  <Button
                    variant="primary3"
                    onClick={() => {
                      setShowSuccessModal(false);
                      setSubmitSuccess(false);
                      // router.push("/testimonials");
                    }}
                    className="w-full"
                  >
                    Continue
                  </Button>
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
