"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  const [mode, setMode] = useState<'Online' | 'Onsite'>('Onsite');
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
  const [details, setDetails] = useState<{
    title: string;
    body: string;
  }[]>([{ title: "", body: "" }]);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

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
        eventDate: new Date(formData.date).toISOString(),
        time: formData.time,
        location: formData.location || undefined,
        organizer: organizer || undefined,
        contact: formData.contact || undefined,
        rsvpLink: formData.rsvp || undefined,
        mode: mode,
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
        details: details
          .map((d) => ({
            title: d.title || "",
            items: d.body
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean),
          }))
          .filter((d) => d.title || d.items.length > 0),
      };

      const response = await eventService.createEvent(
        eventData,
        images.length > 0 ? images : undefined
      );

      console.log("✅ Event created successfully:", response);
      setSubmitSuccess(true);
      setShowSuccessModal(true);

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
        eventDate: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
        time: formData.time || undefined,
        location: formData.location || undefined,
        organizer: organizer || undefined,
        contact: formData.contact || undefined,
        rsvpLink: formData.rsvp || undefined,
        mode: mode,
        tags: tags.length > 0 ? tags : undefined,
        admissions: admissions.length > 0 ? admissions : undefined,
        registrationRequired,
        registrationStart: registrationStart || undefined,
        registrationEnd: registrationEnd || undefined,
        targetAudience: formData.visibility
          ? audienceMap[formData.visibility]
          : ["all"],
        isPublished: false,
        details: details
          .map((d) => ({
            title: d.title || "",
            items: d.body
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean),
          }))
          .filter((d) => d.title || d.items.length > 0),
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
    setDetails([{ title: "", body: "" }]);
    setShowAdditionalInfo(false);
    setMode('Onsite');
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
      setImages([resized]);
      setPreviews([URL.createObjectURL(resized)]);
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

            <form className="border border-primary1 rounded-2xl p-6 space-y-6 bg-white mb-10">
              {/* Header */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-primary1 font-rubik">
                  Content
                </h2>
                <p className="text-sm text-gray-500 font-raleway mt-1">
                  Provide key information
                </p>
              </div>

              {/* Upload Image */}
              <div>
                <label className="text-md font-medium text-primary3 font-raleway mb-2 block">
                  Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImagesChange}
                  ref={fileInputRef}
                />

                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                  className="block cursor-pointer"
                >
                  {previews.length > 0 ? (
                    <div className="relative">
                      <img
                        src={previews[0]}
                        alt="preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          try { URL.revokeObjectURL(previews[0]); } catch {}
                          setImages([]);
                          setPreviews([]);
                        }}
                        aria-label="Remove image"
                        className="absolute top-2 right-2 bg-white w-8 h-8 flex items-center justify-center rounded-full text-red-500 border shadow-sm hover:bg-red-50"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition">
                      <p className="text-gray-500 font-raleway">Click to upload cover image</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-md font-medium text-primary3 font-raleway mb-2 block">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 items-center">
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
                          ? "bg-primary2 text-white border-primary2"
                          : "border-gray-300 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}

                  {!showTagInput && (
                    <button
                      type="button"
                      onClick={() => setShowTagInput(true)}
                      className="px-3 py-1 border border-primary2 text-primary2 rounded-full hover:bg-primary2 hover:text-white transition font-rubik text-sm"
                    >
                      + Add Custom Tag
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
                        className="border border-gray-300 rounded-lg px-3 py-1 font-rubik text-sm focus:outline-none focus:border-primary2"
                        placeholder="Enter custom tag..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newTag.trim() !== "")
                            setTags((prev) => [...prev, newTag.trim()]);
                          setNewTag("");
                          setShowTagInput(false);
                        }}
                        className="px-3 py-1 bg-primary2 text-white rounded-lg text-sm hover:bg-primary3"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNewTag("");
                          setShowTagInput(false);
                        }}
                        className="px-3 py-1 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Selected Tags Display */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-2 bg-primary2 text-white font-rubik px-4 py-1 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() =>
                            setTags(tags.filter((_, i) => i !== index))
                          }
                          className="text-white hover:text-red-200 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-[1px] bg-gray-200 w-full" />

              {/* Details Section */}
              <div>
                <h3 className="text-xl font-semibold text-primary3 font-rubik mb-1">
                  Details
                </h3>
                <p className="text-sm text-gray-500 font-raleway mb-4">
                  Specify event date, time, and location
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-primary3 font-raleway mb-2 block">
                      Date *
                    </label>
                    <input
                      id="date"
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={`w-full font-raleway rounded-lg px-3 py-2 border transition-all ${
                        errors.date
                          ? "border-2 border-red-500 bg-red-50"
                          : "border-gray-300 bg-white text-gray-600"
                      } focus:outline-none focus:border-2 focus:border-primary2 focus:text-black focus:bg-white`}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-primary3 font-raleway mb-2 block">
                      Time *
                    </label>
                    <input
                      id="time"
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className={`w-full font-raleway rounded-lg px-3 py-2 border transition-all ${
                        errors.time
                          ? "border-2 border-red-500 bg-red-50"
                          : "border-gray-300 bg-white text-gray-600"
                      } focus:outline-none focus:border-2 focus:border-primary2 focus:text-black focus:bg-white`}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-primary3 font-raleway mb-2 block">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Where is it happening?"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-primary2 font-raleway"
                    />
                  </div>
                </div>

                {/* Admission Section */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-primary3 font-raleway">
                      Admission Prices
                    </label>
                    {!showAdmissionInput && (
                      <button
                        type="button"
                        onClick={() => setShowAdmissionInput(true)}
                        className="px-3 py-1 text-sm border border-primary2 text-primary2 rounded-lg hover:bg-primary2 hover:text-white font-rubik transition"
                      >
                        + Add Admission
                      </button>
                    )}
                  </div>

                  {showAdmissionInput && (
                    <div className="flex flex-col sm:flex-row gap-3 mb-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <input
                        type="text"
                        placeholder="Category (e.g., General, VIP)"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 font-raleway focus:outline-none focus:border-primary2"
                      />

                      <input
                        type="text"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full sm:w-32 border border-gray-300 rounded-lg px-3 py-2 font-raleway focus:outline-none focus:border-primary2"
                      />

                      <div className="flex gap-2">
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
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 font-rubik"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {admissions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {admissions.map((ad, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-2 bg-primary2 text-white font-raleway px-4 py-1 rounded-full text-sm"
                        >
                          {ad.category} — {ad.price}
                          <button
                            type="button"
                            onClick={() =>
                              setAdmissions(
                                admissions.filter((_, i) => i !== index)
                              )
                            }
                            className="text-white hover:text-red-200 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mode */}
              <div>
                <label className="text-md font-medium text-primary3 font-raleway mb-2 block">
                  Mode
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setMode('Onsite')}
                    className={`px-4 py-2 rounded-full border font-rubik ${mode === 'Onsite' ? 'bg-primary2 text-white border-primary2' : 'border-gray-300 text-gray-600'}`}
                  >
                    Onsite
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('Online')}
                    className={`px-4 py-2 rounded-full border font-rubik ${mode === 'Online' ? 'bg-primary2 text-white border-primary2' : 'border-gray-300 text-gray-600'}`}
                  >
                    Online
                  </button>
                </div>
              </div>

              <div className="h-[1px] bg-gray-200 w-full" />

              {/* Registration Section */}
              <div>
                <label className="text-sm font-medium text-primary3 font-raleway mb-3 block">
                  Registration
                </label>

                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="registrationToggle"
                    checked={registrationRequired}
                    onChange={() => setRegistrationRequired((prev) => !prev)}
                    className="h-4 w-4"
                  />
                  <label
                    htmlFor="registrationToggle"
                    className="text-sm font-raleway text-gray-600"
                  >
                    Registration Required
                  </label>
                </div>

                {registrationRequired && (
                  <div className="grid sm:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div>
                      <label className="text-sm font-raleway text-primary3 block mb-2">
                        Registration Opens
                      </label>
                      <input
                        type="datetime-local"
                        value={registrationStart}
                        onChange={(e) => setRegistrationStart(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-raleway text-primary3 block mb-2">
                        Registration Closes
                      </label>
                      <input
                        type="datetime-local"
                        value={registrationEnd}
                        onChange={(e) => setRegistrationEnd(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary2"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="h-[1px] bg-gray-200 w-full" />

              {/* Organizer Section */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-primary3 font-raleway mb-2 block">
                    Organizer
                  </label>
                  <input
                    type="text"
                    placeholder="Organizer name or group"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-primary2 font-raleway"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-primary3 font-raleway mb-2 block">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contact"
                    placeholder="organizer@example.com"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-primary2 font-raleway"
                  />
                </div>
              </div>

              <div className="h-[1px] bg-gray-200 w-full" />

              {/* Event Content */}
              <div>
                <label className="text-sm font-medium text-primary3 font-raleway mb-2 block">
                  Event Title *
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Add a clear and descriptive title"
                  className={`w-full font-raleway rounded-lg px-3 py-2 border transition-all ${
                    errors.title
                      ? "border-2 border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                  } focus:outline-none focus:border-2 focus:border-primary2 focus:bg-white`}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-primary3 font-raleway mb-2 block">
                  Description *
                </label>
                <input
                  id="description"
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Short description for notification"
                  className={`w-full font-raleway rounded-lg px-3 py-2 border transition-all ${
                    errors.description
                      ? "border-2 border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                  } focus:outline-none focus:border-2 focus:border-primary2 focus:bg-white`}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-primary3 font-raleway mb-2 block">
                  Topics Covered *
                </label>
                <textarea
                  id="body"
                  name="body"
                  value={formData.body}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Agenda/program highlights"
                  className={`w-full font-raleway rounded-lg px-3 py-2 border transition-all ${
                    errors.body
                      ? "border-2 border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                  } focus:outline-none focus:border-2 focus:border-primary2 focus:bg-white`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-primary3 font-raleway">
                    Additional Information
                  </label>
                  {!showAdditionalInfo && (
                    <button
                      type="button"
                      onClick={() => setShowAdditionalInfo(true)}
                      className="px-3 py-1 text-sm border border-primary2 text-primary2 rounded-lg hover:bg-primary2 hover:text-white font-rubik transition"
                    >
                      + Add Section
                    </button>
                  )}
                </div>

                {showAdditionalInfo && (
                  <div className="space-y-3">
                    {details.map((section, idx) => (
                      <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            placeholder="Section header"
                            value={section.title}
                            onChange={(e) =>
                              setDetails((prev) => prev.map((s, i) => (i === idx ? { ...s, title: e.target.value } : s)))
                            }
                            className="flex-1 rounded-lg text-gray-600 border border-gray-300 px-3 py-2 text-sm font-raleway focus:outline-none focus:border-primary2"
                          />
                          <button
                            type="button"
                            onClick={() => setDetails((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-red-500 px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-red-50 font-rubik"
                          >
                            Remove
                          </button>
                        </div>

                        <textarea
                          placeholder="Section body (use new lines to separate items)"
                          value={section.body}
                          onChange={(e) =>
                            setDetails((prev) => prev.map((s, i) => (i === idx ? { ...s, body: e.target.value } : s)))
                          }
                          className="w-full rounded-lg border border-gray-300 text-gray-600 px-3 py-2 text-sm font-raleway h-24 focus:outline-none focus:border-primary2"
                        />
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => setDetails((d) => [...d, { title: "", body: "" }])}
                      className="w-full px-4 py-2 border border-dashed border-primary2 text-primary2 rounded-lg hover:bg-primary2 hover:text-white transition font-rubik"
                    >
                      + Add Another Section
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-primary3 font-raleway mb-2 block">
                  RSVP Link
                </label>
                <input
                  type="url"
                  id="rsvp"
                  name="rsvp"
                  value={formData.rsvp}
                  onChange={handleInputChange}
                  placeholder="https://example.com/rsvp"
                  className="w-full font-raleway rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:border-2 focus:border-primary2"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-primary3 font-raleway mb-2 block">
                  Visibility *
                </label>
                <div className="relative w-full">
                  <select
                    id="visibility"
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleInputChange}
                    className="w-full font-raleway rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:border-2 focus:border-primary2 appearance-none pr-10"
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
              </div>

              <div className="h-[1px] bg-gray-200 w-full" />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                {showGlobalError && (
                  <p className="text-red-500 text-sm font-raleway">
                    Please fill all required fields before publishing.
                  </p>
                )}

                <div className="flex flex-wrap gap-3 ml-auto">
                  <Link 
                    href="/drafts" 
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 font-raleway transition"
                  >
                    View Drafts
                  </Link>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
                  >
                    Save Draft
                  </Button>
                  <Button
                    variant="primary3"
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

              <h3 className="text-xl text-primary3 font-semibold font-rubik">
                Event Published
              </h3>
              <p className="text-sm text-gray-600 text-center font-raleway">
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
                  View Events
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