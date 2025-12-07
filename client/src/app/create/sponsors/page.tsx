"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Sidebar from "@/app/components/sidebar";
import Button from "@/app/components/button";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "@/app/components/grid";

type FormErrors = {
  name: boolean;
};

export default function SponsorsPage() {
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: false,
  });

  const tabs = [
    "Platinum Sponsor",
    "Gold Sponsor",
    "Silver Sponsor",
    "Bronze Sponsor",
  ];
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);

  const tabColors = {
    Platinum: "bg-white",
    Gold: "bg-white",
    Silver: "bg-white",
    Bronze: "bg-white",
  } as const;

  const handlePublish = async () => {
    const newErrors = {
      name: !formData.name.trim(),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean) || !activeTab || !cover) {
      setShowGlobalError(true);
      return;
    }

    setShowGlobalError(false);
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("✅ Submitted:", formData, {
        cover,
        activeTab,
      });

      // Reset form
      setFormData({ name: "" });
      setCover(null);
      setPreview(null);
      setActiveTab(tabs[0]);
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 1500);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-300">
          <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
            <div className="w-12 h-12 border-4 border-primary2 border-t-transparent rounded-full animate-spin" />
            <p className="text-primary3 font-semibold font-rubik animate-pulse">
              Publishing Sponsor...
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
                Compose Sponsor
              </h1>
              <p className="text-gray-600 font-raleway text-lg">
                Add and showcase your valued sponsors
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
                    Content Details
                  </h2>
                  <p className="text-blue-100 font-raleway mt-2">Upload logo and provide sponsor information</p>
                </div>

                <div className="p-8 space-y-8">
                  {/* Upload Logo Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-primary2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <label className="text-lg font-semibold text-primary3 font-rubik">
                        Sponsor Logo
                        <span className="text-red-500 ml-1">*</span>
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
                            alt="sponsor logo preview"
                            className="w-full h-64 object-contain bg-gray-50 rounded-2xl border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
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
                              <p className="text-gray-700 font-semibold font-rubik">Click to upload sponsor logo</p>
                              <p className="text-sm text-gray-500 mt-1 font-raleway">PNG, JPG, SVG up to 10MB</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {showGlobalError && !cover && (
                      <p className="text-sm text-red-600 font-raleway flex items-center gap-1">
                        <span>•</span> Please upload a sponsor logo
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 pt-8">
                    <div className="flex items-center gap-2 mb-6">
                      <svg className="w-5 h-5 text-primary2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-2xl font-bold text-primary3 font-rubik">
                        Sponsor Information
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 font-raleway mb-6">
                      Provide the sponsor name and tier level
                    </p>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary3 font-raleway flex items-center gap-2">
                      Sponsor Name
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Tech Company Inc."
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
                        <span>•</span> Please enter a sponsor name
                      </p>
                    )}
                  </div>

                  {/* Sponsorship Tiers */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-primary3 font-raleway flex items-center gap-2">
                      Sponsorship Tier
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tabs.map((tab) => {
                        const category = tab.split(" ")[0] as keyof typeof tabColors;
                        const isActive = activeTab === tab;
                        
                        return (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => {
                              setActiveTab(tab);
                              if (showGlobalError && !cover && formData.name) {
                                setShowGlobalError(false);
                              }
                            }}
                            className={`
                              relative rounded-xl px-6 py-4 text-left font-rubik font-semibold 
                              transition-all duration-300 ease-in-out cursor-pointer border-2
                              ${isActive
                                ? "bg-primary2 text-white border-primary2 shadow-lg shadow-primary2/30"
                                : "bg-white text-gray-600 border-gray-200 hover:border-primary2/50 hover:bg-primary2/5"
                              }
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                isActive ? "border-white" : "border-gray-300"
                              }`}>
                                {isActive && (
                                  <div className="w-3 h-3 rounded-full bg-white" />
                                )}
                              </div>
                              <span className="text-sm sm:text-base">{tab}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {showGlobalError && !activeTab && (
                      <p className="text-sm text-red-600 font-raleway flex items-center gap-1">
                        <span>•</span> Please select a sponsorship tier
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                    {showGlobalError && (
                      <p className="text-red-500 text-sm font-bold font-raleway animate-pulse">
                        Please fill all required fields before publishing.
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 ml-auto w-full sm:w-auto">
                      <Link
                        href="/drafts"
                        className="px-6 py-3 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 hover:border-gray-300 transition-all duration-300 text-center flex items-center justify-center"
                      >
                        View drafts
                      </Link>
                      <Button
                        variant="outline"
                        className="px-6 py-3 border-2 border-primary2 text-primary2 rounded-xl font-bold hover:bg-primary2 hover:text-white transition-all duration-300"
                      >
                        Save Draft
                      </Button>
                      <Button
                        variant="primary3"
                        type="button"
                        onClick={handlePublish}
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-primary3 text-white rounded-xl font-bold shadow-lg shadow-primary3/30 hover:shadow-primary3/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="flex items-center gap-2">
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

        <Footer />
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowSuccessModal(false)}
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
                  Sponsor Published!
                </h3>
                <p className="text-gray-500 font-raleway">
                  Your sponsor has been successfully published and is now live.
                </p>
              </div>

              <div className="w-full pt-2 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    // Redirect to sponsors list if needed
                  }}
                  className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 shadow-lg shadow-gray-900/20"
                >
                  View Sponsors
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}