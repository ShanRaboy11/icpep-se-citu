"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/sidebar";
import Button from "@/app/components/button";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "@/app/components/grid";
import testimonialService from "@/app/services/testimonial";

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      await testimonialService.createTestimonial({
        name: formData.name,
        role: formData.position,
        quote: formData.message,
        image: cover || undefined,
        isActive: true,
      });

      // Reset form
      setFormData({ name: "", position: "", message: "" });
      setCover(null);
      setPreview(null);
      setSubmitSuccess(true);
      setShowSuccessModal(true);
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
    <section className="min-h-screen bg-white flex flex-col relative overflow-hidden">
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
              Publishing your testimonial...
            </p>
          </div>
        </div>
      )}

      <Header />

      <main className="relative z-10 flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-16">
        {/* Page Header with Gradient */}
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary1/10 to-primary2/10 rounded-3xl blur-3xl -z-10" />
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-6xl font-bold font-rubik bg-gradient-to-r from-primary3 via-primary1 to-primary2 bg-clip-text text-transparent mb-3">
              Compose Testimonial
            </h1>
            <p className="text-gray-600 font-raleway text-lg">
              Share valuable feedback and experiences
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
          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-primary1 to-primary2 p-8">
                <h2 className="text-3xl font-bold text-white font-rubik flex items-center gap-3">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Content Details
                </h2>
                <p className="text-blue-100 font-raleway mt-2">Fill in the information below to create a testimonial</p>
              </div>

              <div className="p-8 space-y-8">
                {/* Upload Image Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-primary2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
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
                            try { if (preview) URL.revokeObjectURL(preview); } catch {}
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
                      <div className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                        showGlobalError && !cover 
                          ? "border-red-400 bg-red-50/50" 
                          : "border-gray-300 bg-gray-50/50 group-hover:border-primary2 group-hover:bg-primary2/5"
                      }`}>
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-primary2/10 flex items-center justify-center group-hover:bg-primary2/20 transition-colors duration-300">
                            <svg className="w-8 h-8 text-primary2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-gray-700 font-semibold font-rubik">Click to upload profile image</p>
                            <p className="text-sm text-gray-500 mt-1 font-raleway">PNG, JPG up to 10MB</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 pt-8">
                  <div className="flex items-center gap-2 mb-6">
                    <svg className="w-5 h-5 text-primary2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
                        ${errors.name
                          ? "border-red-400 bg-red-50 text-red-900 placeholder-red-400"
                          : "border-gray-200 bg-white text-gray-700 placeholder-gray-400"
                        }
                        focus:outline-none focus:border-primary2 focus:ring-4 focus:ring-primary2/10 focus:text-black focus:bg-white
                      `}
                    />
                    {errors.name && (
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                        ${errors.position
                          ? "border-red-400 bg-red-50 text-red-900 placeholder-red-400"
                          : "border-gray-200 bg-white text-gray-700 placeholder-gray-400"
                        }
                        focus:outline-none focus:border-primary2 focus:ring-4 focus:ring-primary2/10 focus:text-black focus:bg-white
                      `}
                    />
                    {errors.position && (
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                        ${errors.message
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
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-raleway font-medium">
                        Please fill all required fields
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 ml-auto w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none">
                      Save Draft
                    </Button>
                    <Button
                      variant="primary2"
                      type="button"
                      onClick={handlePublish}
                      disabled={isSubmitting}
                      className="disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none shadow-lg shadow-primary2/30 hover:shadow-xl hover:shadow-primary2/40 transition-all duration-300"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Publish
                      </span>
                    </Button>
                  </div>
                </div>
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
                  <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-2xl text-primary3 font-bold font-rubik">
                  Successfully Published!
                </h3>
                <p className="text-gray-600 font-raleway">
                  Your testimonial has been published and is now live.
                </p>
              </div>

              <div className="flex gap-3 mt-2 w-full">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSuccessModal(false);
                    setSubmitSuccess(false);
                  }}
                  className="flex-1"
                >
                  Close
                </Button>

                <Button
                  variant="primary3"
                  onClick={() => {
                    setShowSuccessModal(false);
                    setSubmitSuccess(false);
                    // router.push("/testimonials");
                  }}
                  className="flex-1"
                >
                  View All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </section>
  );
}