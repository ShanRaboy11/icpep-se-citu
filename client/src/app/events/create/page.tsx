"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/sidebar";
import Button from "@/app/components/button";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { ChevronDown } from "lucide-react";
import eventService from "../../services/event";

type FormErrors = {
  date: boolean;
  time: boolean;
  title: boolean;
  description: boolean;
  body: boolean;
};

export default function EventsPage() {
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [registrationRequired, setRegistrationRequired] = useState(false);
  const [registrationStart, setRegistrationStart] = useState("");
  const [registrationEnd, setRegistrationEnd] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

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
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [showAdmissionInput, setShowAdmissionInput] = useState(false);
  const [admissions, setAdmissions] = useState<{
    category: string;
    price: string;
  }[]>([]);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [organizer, setOrganizer] = useState("");

  const predefinedTags = ["Workshop", "Seminar", "Training", "Webinar"];

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
        eventDate: formData.date,
        time: formData.time,
        location: formData.location || undefined,
        organizer: organizer || undefined,
  contact: formData.contact || undefined,
        rsvpLink: formData.rsvp || undefined,
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
      };

      const response = await eventService.createEvent(
        eventData,
        images.length > 0 ? images : undefined
      );

      console.log("✅ Event created successfully:", response);
      setSubmitSuccess(true);
      setShowSuccessModal(true);

      // Reset form
      resetForm();
    } catch (error) {
      console.error("❌ Error creating event:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create event. Please try again.";
      alert(errorMessage);
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
        eventDate: formData.date || new Date().toISOString().split("T")[0],
        time: formData.time || undefined,
        location: formData.location || undefined,
        organizer: organizer || undefined,
  contact: formData.contact || undefined,
        rsvpLink: formData.rsvp || undefined,
        tags: tags.length > 0 ? tags : undefined,
        admissions: admissions.length > 0 ? admissions : undefined,
        registrationRequired,
        registrationStart: registrationStart || undefined,
        registrationEnd: registrationEnd || undefined,
        targetAudience: formData.visibility
          ? audienceMap[formData.visibility]
          : ["all"],
        isPublished: false,
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

    // Only clear field-level errors for keys that exist on the errors object
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
      // Replace with single image selection
      setImages([resized]);
      setPreviews([URL.createObjectURL(resized)]);
      // Clear the native input value so selecting the same file again will trigger change
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error('Error resizing image', err);
    }
  };

  useEffect(() => {
    if (Object.values(errors).every((err) => err === false)) {
      setShowGlobalError(false);
    }
  }, [errors]);

  return (
    <section className="min-h-screen bg-white flex flex-col relative">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-12">
        <div className="text-center sm:text-left mb-10">
          <h1 className="text-2xl sm:text-5xl font-bold font-rubik text-primary3">
            Compose
          </h1>
          <div className="h-[3px] bg-primary1 w-24 sm:w-full mt-3 mx-auto rounded-full" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <Sidebar />
          </aside>

          <div className="flex-1">
            {submitSuccess && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                Event published successfully!
              </div>
            )}

            <form className="border border-primary1 rounded-2xl p-6 space-y-4 bg-white mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl sm:text-3xl font-semibold text-primary1 font-rubik">
                  Content
                </h2>
              </div>
              <p className="text-sm text-gray-500 font-raleway -mt-5">
                Provide key information
              </p>

              {/* Upload image(s) */}
              <div>
                {/* hidden file input - kept outside interactive preview area to avoid label / click conflicts */}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImagesChange}
                  ref={fileInputRef}
                />

                {/* Preview area / upload trigger */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                  className="block"
                >
                  {previews.length > 0 ? (
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previews[0]}
                        alt={`preview`}
                        className="w-full h-40 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          try { URL.revokeObjectURL(previews[0]); } catch {}
                          setImages([]);
                          setPreviews([]);
                        }}
                        aria-label={`Remove image`}
                        className="absolute top-2 right-2 bg-white w-8 h-8 flex items-center justify-center rounded-full text-red-500 border shadow-sm"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition">
                      <p className="text-gray-500">Upload cover image</p>
                    </div>
                  )}
                </div>

                {images.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setPreviews([]); setImages([]); }}
                    className="mt-2 text-red-500 text-sm hover:underline"
                  >
                    Remove image
                  </button>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 items-center">
                {!showTagInput && (
                  <button
                    type="button"
                    onClick={() => setShowTagInput(true)}
                    className="px-3 py-1 border border-primary2 text-primary2 rounded-full hover:bg-primary2 hover:text-white transition font-rubik text-sm"
                  >
                    + Add Tag
                  </button>
                )}

                {showTagInput && (
                  <div className="flex items-center gap-2">
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
                      className="border border-gray-300 rounded-lg px-2 py-1 font-rubik text-black text-sm"
                      placeholder="Enter new tag..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newTag.trim() !== "")
                          setTags((prev) => [...prev, newTag.trim()]);
                        setNewTag("");
                        setShowTagInput(false);
                      }}
                      className="px-2 py-1 bg-primary2 text-white rounded-lg text-sm"
                    >
                      Add
                    </button>
                  </div>
                )}

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
                    className={`px-3 py-1 text-sm rounded-full border transition font-rubik ${
                      tags.includes(tag)
                        ? "bg-gray-300 text-white border-gray-300"
                        : "border-gray-300 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Selected Tags Display */}
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 bg-primary2 text-white font-rubik px-4 py-1 rounded-full border border-white text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() =>
                        setTags(tags.filter((_, i) => i !== index))
                      }
                      className="text-gray-300 hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="h-[1px] bg-primary2 w-full mt-8 mx-auto rounded-full" />

              <h2 className="text-2xl font-semibold text-primary3 mt-6">
                Details
              </h2>
              <p className="text-sm text-gray-500 -mt-3">
                Provide key information
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-md font-normal text-primary3 font-raleway mb-2 block">
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full text-gray-400 font-raleway rounded-lg px-3 py-2
  border transition-all
  ${
    errors.date
      ? "border-2 border-red-500 bg-red-50"
      : "border-gray-300 bg-white text-gray-600"
  }
  focus:outline-none focus:border-2 focus:border-primary2 focus:text-black focus:bg-white
`}
                  />
                </div>

                <div>
                  <label className="text-md font-normal text-primary3 font-raleway mb-2 block">
                    Time
                  </label>
                  <input
                    id="time"
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className={`w-full text-gray-400 font-raleway rounded-lg px-3 py-2
  border transition-all
  ${
    errors.time
      ? "border-2 border-red-500 bg-red-50"
      : "border-gray-300 bg-white text-gray-600"
  }
  focus:outline-none focus:border-2 focus:border-primary2 focus:text-black focus:bg-white
`}
                  />
                </div>

                <div>
                  <label className="text-md font-normal text-primary3 font-raleway mb-2 block">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Where is it happening?"
                    className="w-full border border-gray-300 text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-primary2 focus:text-black font-rubik"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAdmissionInput(true)}
                    className="px-4 py-2 border border-primary2 text-primary2 rounded-lg hover:bg-primary2 hover:text-white font-rubik"
                  >
                    + Add Admission
                  </button>
                </div>
              </div>

              {showAdmissionInput && (
                <div className="flex flex-col sm:flex-row gap-3 mt-3">
                  <input
                    type="text"
                    placeholder="Category (e.g., General, VIP, Student)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 font-rubik text-gray-400 focus:outline-none focus:border-2 focus:border-primary2 focus:text-black"
                  />

                  <input
                    type="text"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-32 border border-gray-300 rounded-lg px-3 py-2 font-rubik text-gray-400 focus:outline-none focus:border-2 focus:border-primary2 focus:text-black"
                  />

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
                    className="px-4 py-2 bg-primary2 text-white rounded-lg hover:bg-primary3 font-rubik"
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
                    className="px-4 py-2 border border-gray-400 rounded-lg text-gray-600 hover:bg-gray-200 font-rubik"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {admissions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {admissions.map((ad, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-2 bg-primary2 text-white font-rubik px-5 py-1 rounded-full border font-raleway border-primary1 text-md"
                    >
                      {ad.category} — {ad.price}
                      <button
                        type="button"
                        onClick={() =>
                          setAdmissions(
                            admissions.filter((_, i) => i !== index)
                          )
                        }
                        className="text-gray-500 hover:text-red-500 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="h-[1px] bg-primary2 w-full mt-8 mx-auto rounded-full" />

              {/* Registration Required Toggle */}
              <div className="mt-5">
                <label className="text-md font-normal text-primary3 font-raleway block mb-1">
                  Registration
                </label>

                <div className="flex items-center gap-3 mb-5">
                  <input
                    type="checkbox"
                    id="registrationToggle"
                    checked={registrationRequired}
                    onChange={() => setRegistrationRequired((prev) => !prev)}
                    className="h-4 w-4"
                  />
                  <label
                    htmlFor="registrationToggle"
                    className="text-md font-rubik text-gray-600"
                  >
                    Registration Required
                  </label>
                </div>

                {registrationRequired && (
                  <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
                    <div>
                      <label className="text-sm font-raleway text-primary3 block mb-1">
                        Registration Opens
                      </label>
                      <input
                        type="datetime-local"
                        value={registrationStart}
                        onChange={(e) => setRegistrationStart(e.target.value)}
                        className="w-full border border-gray-300 text-gray-500 rounded-lg px-3 py-2 
          focus:outline-none focus:border-2 focus:border-primary2 focus:text-black"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-raleway text-primary3 block mb-1">
                        Registration Closes
                      </label>
                      <input
                        type="datetime-local"
                        value={registrationEnd}
                        onChange={(e) => setRegistrationEnd(e.target.value)}
                        className="w-full border border-gray-300 text-gray-500 rounded-lg px-3 py-2 
          focus:outline-none focus:border-2 focus:border-primary2 focus:text-black"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="h-[1px] bg-primary2 w-full mt-8 mx-auto rounded-full" />

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-raleway text-primary3 block mb-1">Organizer</label>
                  <input
                    type="text"
                    placeholder="Organizer name or group"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full border border-gray-300 text-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-primary2 focus:text-black font-rubik"
                  />
                </div>
                <div>
                  <label className="text-sm font-raleway text-primary3 block mb-1">Organizer contact (email)</label>
                  <input
                    type="email"
                    name="contact"
                    placeholder="organizer@example.com"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 text-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-primary2 focus:text-black font-rubik"
                  />
                </div>
              </div>

              <label className="text-md font-normal text-primary3 font-raleway mt-5 mb-2 block">
                Event Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Add a clear and descriptive title"
                className={`w-full text-gray-400 font-raleway rounded-lg px-3 py-2
  border transition-all
  ${
    errors.title
      ? "border-2 border-red-500 bg-red-50"
      : "border-gray-300 bg-white text-gray-600"
  }
  focus:outline-none focus:border-2 focus:border-primary2 focus:text-black focus:bg-white
`}
              />

              <label className="text-md font-normal text-primary3 font-raleway mb-1 block">
                Description
              </label>
              <input
                id="description"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Short description for notification"
                className={`w-full text-gray-400 font-raleway rounded-lg px-3 py-2
  border transition-all
  ${
    errors.description
      ? "border-2 border-red-500 bg-red-50"
      : "border-gray-300 bg-white text-gray-600"
  }
  focus:outline-none focus:border-2 focus:border-primary2 focus:text-black focus:bg-white
`}
              />

              <label className="text-md font-normal text-primary3 font-raleway mb-1 block">
                Topics Covered
              </label>
              <textarea
                id="body"
                name="body"
                value={formData.body}
                onChange={handleInputChange}
                rows={6}
                placeholder="Agenda/program highlights"
                className={`w-full text-gray-400 font-raleway rounded-lg px-3 py-2
  border transition-all
  ${
    errors.body
      ? "border-2 border-red-500 bg-red-50"
      : "border-gray-300 bg-white text-gray-600"
  }
  focus:outline-none focus:border-2 focus:border-primary2 focus:text-black focus:bg-white
`}
              />

              <label className="text-md font-normal text-primary3 font-raleway mb-1 block">
                RSVP Link (optional)
              </label>
              <input
                type="url"
                id="rsvp"
                name="rsvp"
                value={formData.rsvp}
                onChange={handleInputChange}
                placeholder="https://example.com/rsvp"
                className="w-full text-gray-400 font-raleway rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:border-2 focus:border-primary2 focus:text-black focus:bg-white"
              />

              <label className="text-md font-normal text-primary3 font-raleway mt-5 mb-1 block">
                Visibility
              </label>
              <div className="relative w-full">
                <select
                  id="visibility"
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleInputChange}
                  className="w-full text-gray-400 font-raleway rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:border-2 focus:border-primary2 focus:text-black focus:bg-white appearance-none pr-10"
                >
                  <option value="" className="text-gray-400">
                    Select visibility
                  </option>
                  <option value="public">Public</option>
                  <option value="members">Members Only</option>
                  <option value="officers">Officers Only</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary3">
                  <ChevronDown className="w-4 h-4" />
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
                {showGlobalError && (
                  <p className="text-red-500 text-sm font-raleway">
                    Please fill all required fields before publishing.
                  </p>
                )}

                <div className="flex gap-3 ml-auto">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
                  >
                    Save Draft
                  </Button>
                  <Button
                    variant="primary2"
                    type="button"
                    onClick={handlePublish}
                    disabled={isSubmitting}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Publishing..." : "Publish"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setShowSuccessModal(false);
              setSubmitSuccess(false);
            }}
          />

          <div className="relative bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-3xl text-white">✔</span>
              </div>

              <h3 className="text-xl text-blue-700 font-semibold">
                Event Published
              </h3>
              <p className="text-sm text-blue-400 text-center">
                Your event was published successfully.
              </p>

              <div className="flex gap-3 mt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSuccessModal(false);
                    setSubmitSuccess(false);
                  }}
                >
                  Close
                </Button>

                <Button
                  variant="primary3"
                  onClick={() => {
                    setShowSuccessModal(false);
                    setSubmitSuccess(false);
                    router.push("/events");
                  }}
                >
                  View events
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