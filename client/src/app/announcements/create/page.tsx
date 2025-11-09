"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";
import Button from "@/app/components/button";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { Eye, ChevronDown } from "lucide-react";
import announcementService from "@/services/announcementService";

type FormErrors = {
  date: boolean;
  time: boolean;
  title: boolean;
  summary: boolean;
  body: boolean;
  visibility: boolean;
  attendanceLink?: boolean;
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [newLink, setNewLink] = useState("");
  const [activeTab, setActiveTab] = useState<string>("General");
  const [showOrganizerInput, setShowOrganizerInput] = useState(false);
  const [organizer, setOrganizer] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [awardees, setAwardees] = useState([
    { name: "", program: "", year: "", award: "" },
  ]);
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) {
      setShowGlobalError(true);
      return;
    }

    setIsSubmitting(true);
    setShowGlobalError(false);

    try {
      // Map activeTab to backend type
      const typeMap: Record<string, string> = {
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
        type: typeMap[activeTab] as any,
        targetAudience: audienceMap[formData.visibility] || ["all"],
        isPublished: true,
        publishDate: showSchedule && scheduleDate ? 
          new Date(`${scheduleDate}T${scheduleTime || "00:00"}`).toISOString() : 
          new Date().toISOString(),
        time: formData.time,
        location: formData.location,
        organizer: organizer || undefined,
        attendees: activeTab === "Meeting" ? formData.attendanceLink : undefined,
        awardees: activeTab === "Achievement" ? awardees.filter(a => a.name.trim()) : undefined,
        attachments: attachmentsData.length > 0 ? attachmentsData : undefined,
      };

      const response = await announcementService.createAnnouncement(
        announcementData,
        imageFile || undefined
      );

      console.log("✅ Announcement created successfully:", response);
      setSubmitSuccess(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        resetForm();
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("❌ Error creating announcement:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create announcement. Please try again.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);

    try {
      const typeMap: Record<string, string> = {
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
        type: typeMap[activeTab] as any,
        targetAudience: formData.visibility ? 
          audienceMap[formData.visibility] : ["all"],
        isPublished: false,
        time: formData.time || undefined,
        location: formData.location || undefined,
        organizer: organizer || undefined,
        awardees: activeTab === "Achievement" ? 
          awardees.filter(a => a.name.trim()) : undefined,
        attachments: attachmentsData.length > 0 ? attachmentsData : undefined,
      };

      const response = await announcementService.createAnnouncement(
        announcementData,
        imageFile || undefined
      );

      console.log("✅ Draft saved successfully:", response);
      alert("Draft saved successfully!");
    } catch (error) {
      console.error("❌ Error saving draft:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save draft. Please try again.";
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
    setImageFile(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newFiles: Attachment[] = files.map((file) => ({
      name: file.name,
      type: "file",
      file,
    }));
    setAttachments((prev) => [...prev, ...newFiles]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const tabs = ["General", "News", "Meeting", "Achievement"];

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
            Announcements / Events
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
                ✅ Announcement published successfully!
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

              {/* Image Upload */}
              <div>
                <label className="text-md font-normal text-primary3 font-raleway mb-2 block">
                  Featured Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary2 font-rubik"
                />
                {imageFile && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {imageFile.name}
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
                  className="w-full border border-gray-300 text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-primary2 focus:text-black font-rubik animate-fade-in"
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
                Summary
              </label>
              <input
                id="summary"
                type="text"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Short description for notification"
                className={`w-full text-gray-400 font-raleway rounded-lg px-3 py-2
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
                  className={`w-full text-gray-400 font-raleway rounded-lg px-3 py-2
  border transition-all
  ${
    errors.visibility
      ? "border-2 border-red-500 bg-red-50"
      : "border-gray-300 bg-white text-gray-600"
  }
  focus:outline-none focus:border-2 focus:border-primary2 focus:text-black focus:bg-white appearance-none pr-10
`}
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

              <label className="text-md font-normal text-primary3 font-raleway block mb-1 mt-1">
                Attachments
              </label>

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
                        { name: newLink.trim(), url: newLink.trim(), type: "link" },
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
                    className={`w-full text-gray-400 font-raleway rounded-lg px-3 py-2
  border transition-all
  ${
    errors.attendanceLink
      ? "border-2 border-red-500 bg-red-50"
      : "border-gray-300 bg-white text-gray-600"
  }
  focus:outline-none focus:border-2 focus:border-primary2 focus:text-black focus:bg-white
`}
                  />
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
                          className="w-full border border-primary2 rounded-xl px-3 py-2 focus:outline-none focus:border-primary3 font-rubik"
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
                          className="w-full border border-primary2 rounded-xl px-3 py-2 focus:outline-none focus:border-primary3 font-rubik"
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

      <Footer />
    </section>
  );
}