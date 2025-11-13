"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "../../components/sidebar";
import Button from "@/app/components/button";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { ChevronDown } from "lucide-react";
import announcementService, { AnnouncementData } from "../../services/announcement";

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
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    body: "",
    visibility: "",
    date: "",
    time: "",
    location: "",
    attendanceLink: "",
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

    // Require at least one featured image before publishing
    if (!images || images.length === 0) {
      setErrors((prev) => ({ ...prev, image: true }));
      setShowGlobalError(true);
      // scroll to top of form or focus the image input
      fileInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setIsSubmitting(true);
    setShowGlobalError(false);

    try {
      // Map activeTab to backend type
      const typeMap: Record<ActiveTab, AnnouncementData['type']> = {
        General: "General",
        News: "General",
        Meeting: "Meeting",
        Achievement: "Achievement",
      };

      // Map visibility to targetAudience
      const audienceMap: Record<string, string[]> = {
        public: ["all"],
        members: ["members"],
        officers: ["officers"],
      };

      // Prepare attachments data
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
        // If scheduling for future, keep as draft (isPublished: false) and set publishDate
        isPublished: showSchedule && scheduleDate ? false : true,
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

      const response = await announcementService.createAnnouncement(
        announcementData,
        images.length > 0 ? images : undefined
      );

      console.log("✅ Announcement created successfully:", response);
      setSubmitSuccess(true);
      setShowSuccessModal(true);

      // reset form so user can create another immediately
      resetForm();
    } catch (error) {
      console.error("❌ Error creating announcement:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create announcement. Please try again.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);

    try {
      const typeMap: Record<ActiveTab, AnnouncementData['type']> = {
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

      const response = await announcementService.createAnnouncement(
        announcementData,
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
      // Append new images to existing selection
      setImages((prev) => [...prev, ...resized]);
      setPreviews((prev) => [
        ...prev,
        ...resized.map((f) => URL.createObjectURL(f)),
      ]);
      // Clear the native input value so selecting the same file again will trigger change
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Error resizing images", err);
    }
  };

  // cleanup object URLs when previews change/unmount
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
            <form className="border border-primary1 rounded-2xl p-6 space-y-4 bg-white mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl sm:text-3xl font-semibold text-primary1 font-rubik">
                  Content
                </h2>
              </div>
              <p className="text-sm text-gray-500 font-raleway -mt-5">
                Provide key information
              </p>

              {/* Image Upload */}
              <div>
                <label className="text-md font-normal text-primary3 font-raleway mb-2 block">
                  Featured Image
                </label>

                <div
                  className={`w-full rounded-lg px-3 py-3 transition-colors border ${
                    errors.image
                      ? "border-red-500 bg-red-50"
                      : previews.length > 0
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 bg-white"
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
                    className="block"
                  >
                    {previews.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {previews.map((p, i) => (
                          <div key={i} className="relative">
                            {/* small preview using native img for local object URLs */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p}
                              alt={`preview-${i}`}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={(ev) => {
                                ev.stopPropagation();
                                // revoke object URL to avoid memory leaks
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
                              className="absolute top-1 right-1 bg-white w-8 h-8 flex items-center justify-center rounded-full text-red-500 border shadow-sm"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {/* Plus tile to allow adding more images */}
                        <div className="flex items-center justify-center border-2 border-dashed border-primary1 text-primary1 rounded-lg h-32 cursor-pointer">
                          <span className="text-3xl font-bold">+</span>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition">
                        <p className="text-gray-500">Upload image(s)</p>
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
                      className="mt-2 text-red-500 text-sm hover:underline"
                    >
                      Remove all images
                    </button>
                  )}
                </div>

                {errors.image && (
                  <p className="text-sm text-red-600 mt-2">
                    A featured image is required to publish.
                  </p>
                )}
              </div>

              <label className="text-md font-normal text-primary3 font-raleway mb-1 block">
                Tag
              </label>
              <div className="mb-4 flex justify-start">
                <div className="flex space-x-1 rounded-xl bg-primary1/10 p-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`relative w-full rounded-lg px-4 py-2 sm:px-6 sm:py-2.5 text-sm font-rubik font-semibold transition-colors duration-300 ease-in-out cursor-pointer
    ${
      activeTab === tab
        ? "bg-white text-primary1 shadow"
        : "text-primary1/60 hover:bg-white/60"
    }
  `}
                    >
                      {tab}
                      {activeTab === tab && (
                        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 w-1/3 bg-primary1"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

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
                    className={`w-full text-gray-500 font-raleway rounded-lg px-3 py-2
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
                    className={`w-full text-gray-500 font-raleway rounded-lg px-3 py-2
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
                    className="w-full border border-gray-300 text-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-primary2 focus:text-black font-rubik"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      organizer.trim() === ""
                        ? setShowOrganizerInput((prev) => !prev)
                        : setOrganizer("")
                    }
                    className="px-4 py-2 border border-primary2 text-primary2 rounded-lg hover:bg-primary2 hover:text-white font-rubik"
                  >
                    + Add Organizer
                  </button>
                </div>
              </div>
              {showOrganizerInput && (
                <input
                  type="text"
                  placeholder="Organizer name or group"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  className="w-full border border-gray-300 text-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-primary2 focus:text-black font-rubik animate-fade-in"
                />
              )}
              <div className="h-[1px] bg-primary2 w-full mt-8 mx-auto rounded-full" />
              <label className="text-md font-normal text-primary3 font-raleway mt-5 mb-2 block">
                Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Add a clear and descriptive title"
                className={`w-full text-gray-500 font-raleway rounded-lg px-3 py-2
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
                Summary
              </label>
              <input
                id="summary"
                type="text"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Short description for notification"
                className={`w-full text-gray-500 font-raleway rounded-lg px-3 py-2
  border transition-all
  ${
    errors.summary
      ? "border-2 border-red-500 bg-red-50"
      : "border-gray-300 bg-white text-gray-600"
  }
  focus:outline-none focus:border-2 focus:border-primary2 focus:text-black focus:bg-white
`}
              />

              <label className="text-md font-normal text-primary3 font-raleway mb-1 block">
                Body
              </label>
              <textarea
                id="body"
                name="body"
                value={formData.body}
                onChange={handleInputChange}
                rows={6}
                placeholder="Add full details, links, and attachments"
                className={`w-full text-gray-500 font-raleway rounded-lg px-3 py-2
  border transition-all
  ${
    errors.body
      ? "border-2 border-red-500 bg-red-50"
      : "border-gray-300 bg-white text-gray-600"
  }
  focus:outline-none focus:border-2 focus:border-primary2 focus:text-black focus:bg-white
`}
              />

              {activeTab === "Achievement" && (
                <div className="mt-4 space-y-2 mb-10">
                  <h3 className="text-lg font-raleway font-semibold text-primary3">
                    Awardees
                  </h3>

                  {awardees.map((a, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <input
                        type="text"
                        placeholder="Name"
                        value={a.name}
                        onChange={(e) =>
                          handleAwardeeChange(index, "name", e.target.value)
                        }
                        className="border border-gray-300 text-gray-500 rounded-lg p-2 font-rubik focus:outline-none  focus:border-2 focus:border-primary2 focus:text-black"
                      />

                      <input
                        type="text"
                        placeholder="Program (optional)"
                        value={a.program}
                        onChange={(e) =>
                          handleAwardeeChange(index, "program", e.target.value)
                        }
                        className="border border-gray-300 text-gray-500 rounded-lg p-2 font-rubik focus:outline-none  focus:border-2 focus:border-primary2 focus:text-black"
                      />

                      <input
                        type="text"
                        placeholder="Year"
                        value={a.year}
                        onChange={(e) =>
                          handleAwardeeChange(index, "year", e.target.value)
                        }
                        className="border border-gray-300 text-gray-500 rounded-lg p-2 font-rubik focus:outline-none  focus:border-2 focus:border-primary2 focus:text-black"
                      />

                      <input
                        type="text"
                        placeholder="Award"
                        value={a.award}
                        onChange={(e) =>
                          handleAwardeeChange(index, "award", e.target.value)
                        }
                        className="border border-gray-300 text-gray-500 rounded-lg p-2 font-rubik focus:outline-none  focus:border-2 focus:border-primary2 focus:text-black"
                      />

                      <button
                        type="button"
                        onClick={() => removeAwardee(index)}
                        className="text-red-500 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addAwardee}
                    className="px-4 py-2 bg-primary2 text-white rounded-lg font-rubik hover:bg-primary3"
                  >
                    + Add Awardee
                  </button>
                </div>
              )}

              <label className="text-md font-normal text-primary3 font-raleway mt-5 mb-1 block">
                Visibility
              </label>
              <div className="relative w-full">
                <select
                  id="visibility"
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleInputChange}
                  className={`w-full text-gray-500 font-raleway rounded-lg px-3 py-2
  border transition-all
  ${
    errors.visibility
      ? "border-2 border-red-500 bg-red-50"
      : "border-gray-300 bg-white text-gray-600"
  }
  focus:outline-none focus:border-2 focus:border-primary2 focus:text-black focus:bg-white appearance-none pr-10
`}
                >
                  <option value="" className="text-gray-500">
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

              <label className="text-md font-normal text-primary3 font-raleway block mb-1 mt-1">
                Attachments
              </label>
              <p className="text-sm text-gray-500 mb-3">Optional — attach supporting files or links (e.g. PDFs, images, or external resources).</p>

              <div className="flex items-center gap-3 mb-3">
                <input
                  id="fileUpload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />

                <button
                  onClick={() => document.getElementById("fileUpload")?.click()}
                  className="px-4 py-2 bg-primary2 text-white rounded-lg hover:bg-primary3 font-rubik"
                  type="button"
                >
                  + Add File
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
                  className="px-4 py-2 border border-primary2 text-primary2 rounded-lg hover:bg-primary2 hover:text-white font-rubik"
                >
                  + Add Link
                </button>
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
                        <div key={index} className="flex items-center gap-2">
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
                  <p className="text-sm text-gray-500 mb-4">Publish timing</p>

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
              <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
                {showGlobalError && (
                  <p className="text-red-500 text-sm font-raleway">
                    Please fill all required fields before publishing.
                  </p>
                )}

                <div className="flex gap-3 ml-auto">
                  <Link
                    href="/drafts"
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 self-center"
                  >
                    View drafts
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

              <h3 className="text-xl text-blue-700 font-semibold">
                Announcement Published
              </h3>
              <p className="text-sm text-blue-400 text-center">
                Your announcement was published successfully.
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
                    router.push("/announcements");
                  }}
                >
                  View announcements
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
