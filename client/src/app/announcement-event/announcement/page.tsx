"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Button from "@/app/components/button";
import PreviewModal from "../components/previewdialog";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { Eye } from "lucide-react";

type FormErrors = {
  date: boolean;
  time: boolean;
  title: boolean;
  summary: boolean;
  body: boolean;
  visibility: boolean;
};
type Attachment =
  | { name: string; type: "file"; file: File }
  | { url: string; type: "link" };

export default function AnnouncementsPage() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [newLink, setNewLink] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [showOrganizerInput, setShowOrganizerInput] = useState(false);
  const [organizer, setOrganizer] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [awardees, setAwardees] = useState([
    { name: "", program: "", year: "", award: "" },
  ]);
  const [showGlobalError, setShowGlobalError] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [visibility, setVisibility] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    body: "",
    visibility: "",
    date: "",
    time: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    date: false,
    time: false,
    title: false,
    summary: false,
    body: false,
    visibility: false,
  });

  const handlePublish = () => {
    const newErrors: FormErrors = {
      date: !date.trim(),
      time: !time.trim(),
      title: !title.trim(),
      summary: !summary.trim(),
      body: !body.trim(),
      visibility: !visibility.trim(),
    };

    setErrors(newErrors);

    // If ANY errors exist → show message + scroll first invalid field
    if (Object.values(newErrors).some((err) => err)) {
      setShowGlobalError(true);

      const firstErrorField = Object.keys(newErrors)[0];
      const el = document.getElementById(firstErrorField);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("animate-shake");
        setTimeout(() => el.classList.remove("animate-shake"), 400);
      }
      return;
    }

    // ✅ No errors → Submit successfully
    console.log("Submitted successfully");
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

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const tabs = ["General", "News", "Meeting", "Achievement"];

  useEffect(() => {
    // If all errors are cleared, hide global message
    if (Object.values(errors).every((err) => err === false)) {
      setShowGlobalError(false);
    }
  }, [errors]);

  return (
    <section className="min-h-screen bg-white flex flex-col relative">
      {/* Global Header */}
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-12">
        {/* Page Title */}
        <div className="text-center sm:text-left mb-10">
          <h1 className="text-2xl sm:text-5xl font-bold font-rubik text-primary3">
            Announcements / Events
          </h1>
          <div className="h-[3px] bg-primary1 w-24 sm:w-full mt-3 mx-auto rounded-full" />
        </div>

        {/* Sidebar + Main Form */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <Sidebar />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <form className="border border-primary1 rounded-2xl p-6 space-y-4 bg-white mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl sm:text-3xl font-semibold text-primary1 font-rubik">
                  Content
                </h2>
                {/*<Button
                  variant="primary2"
                  onClick={() => setPreviewOpen(true)}
                  className="flex items-center gap-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>*/}
              </div>
              <p className="text-sm text-gray-500 font-raleway -mt-5">
                Provide key information
              </p>

              <label className="text-md font-normal text-primary3 font-raleway mb-1 block">
                Tag
              </label>
              <div className="mb-4 flex justify-start">
                <div className="flex space-x-1 rounded-xl bg-primary1/10 p-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      type="button" // ← Add this
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

              {/* Date / Time / Location Row */}
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
                  ▼
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
                    // If it's already open and no text → close
                    if (showLinkInput && newLink.trim() === "") {
                      setShowLinkInput(false);
                      return;
                    }

                    // Otherwise → open
                    setShowLinkInput(true);
                  }}
                  className="px-4 py-2 border border-primary2 text-primary2 rounded-lg hover:bg-primary2 hover:text-white font-rubik"
                >
                  + Add Link
                </button>
              </div>

              {/* Link Input Appears Only When Button is Clicked */}
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
                        { url: newLink.trim(), type: "link" },
                      ]);

                      setNewLink(""); // clear field
                      setShowLinkInput(false); // hide box after adding
                    }}
                    className="px-4 py-2 bg-primary2 text-white rounded-lg hover:bg-primary3 font-rubik"
                  >
                    Add
                  </button>
                </div>
              )}
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {attachments.map((att, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-300 text-sm"
                  >
                    {att.type === "file" ? att.name : att.url}

                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-gray-500 hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
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
                    {/* Date */}
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

                    {/* Time */}
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
                {/* Error Message */}
                {showGlobalError && (
                  <p className="text-red-500 text-sm font-raleway">
                    Please fill all required fields before publishing.
                  </p>
                )}

                {/* Buttons */}
                <div className="flex gap-3 ml-auto">
                  <Button variant="outline">Save Draft</Button>
                  <Button
                    variant="primary2"
                    type="button"
                    onClick={handlePublish}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Publish
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Modal */}
        <PreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          content={<p>Your announcement preview will appear here.</p>}
        />
      </main>

      {/* Global Footer */}
      <Footer />
    </section>
  );
}
