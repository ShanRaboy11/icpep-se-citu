"use client";

import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import Button from "@/app/components/button";
import PreviewModal from "../components/previewdialog";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

type FormErrors = {
  date: boolean;
  time: boolean;
  title: boolean;
  description: boolean;
  body: boolean;
  rsvp: boolean;
};

export default function EventsPage() {
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [registrationRequired, setRegistrationRequired] = useState(false);
  const [registrationStart, setRegistrationStart] = useState("");
  const [registrationEnd, setRegistrationEnd] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [rsvp, setRsvp] = useState("");
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    title: "",
    description: "",
    body: "",
    rsvp: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    date: false,
    time: false,
    title: false,
    description: false,
    body: false,
    rsvp: false,
  });

  const handlePublish = () => {
    const newErrors = {
      date: !formData.date.trim(),
      time: !formData.time.trim(),
      title: !formData.title.trim(),
      description: !formData.description.trim(),
      body: !formData.body.trim(),
      rsvp: false, // Optional, so default no error
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      setShowGlobalError(true);
      return;
    }

    console.log("✅ Submitted:", formData, {
      tags,
      admissions,
      organizer,
      cover,
    });
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

  const [previewOpen, setPreviewOpen] = useState(false);
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
          0.8 // compression level (0-1)
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
  };
  const predefinedTags = ["Workshop", "Seminar", "Training", "Webinar"];

  const [tags, setTags] = useState<string[]>([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState("");

  const [showAdmissionInput, setShowAdmissionInput] = useState(false);
  const [admissions, setAdmissions] = useState<
    { category: string; price: string }[]
  >([]);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [showOrganizerInput, setShowOrganizerInput] = useState(false);
  const [organizer, setOrganizer] = useState("");

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
              {/* Upload image */}
              <div>
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverChange}
                  />

                  {preview ? (
                    <img
                      src={preview}
                      alt="cover preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition">
                      <p className="text-gray-500">📷 Upload cover image</p>
                    </div>
                  )}
                </label>

                {cover && (
                  <button
                    onClick={() => {
                      setPreview(null);
                      setCover(null);
                    }}
                    className="mt-2 text-red-500 text-sm hover:underline"
                  >
                    Remove image
                  </button>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 items-center">
                {/* Add Tag Button */}
                {!showTagInput && (
                  <button
                    type="button"
                    onClick={() => setShowTagInput(true)}
                    className="px-3 py-1 border border-primary2 text-primary2 rounded-full hover:bg-primary2 hover:text-white transition font-rubik text-sm"
                  >
                    + Add Tag
                  </button>
                )}

                {/* Input that appears when Add Tag is clicked */}
                {showTagInput && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
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

                {/* Predefined Tags */}
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

                {/* Render Selected Tags Below */}
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
                      className="text-gray-500 hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

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
                    disabled={price === "Free"}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      // if free, store price as "Free"
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

              {/* Display Added Admissions */}
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

                {/* These fields only appear if toggle is ON */}
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

              <div className="mt-5 mb-5 flex flex-col justify-end">
                <button
                  type="button"
                  onClick={() =>
                    organizer.trim() === ""
                      ? setShowOrganizerInput((prev) => !prev)
                      : setOrganizer("")
                  }
                  className="px-4 py-2 border border-primary2 text-primary2 rounded-lg hover:bg-primary2 hover:text-white font-rubik"
                >
                  + Add Event Organizer
                </button>
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
                className={`w-full text-gray-400 font-raleway rounded-lg px-3 py-2
  border transition-all
  ${
    errors.rsvp
      ? "border-2 border-red-500 bg-red-50"
      : "border-gray-300 bg-white text-gray-600"
  }
  focus:outline-none focus:border-2 focus:border-primary2 focus:text-black focus:bg-white
`}
              />

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

            <PreviewModal
              open={previewOpen}
              onClose={() => setPreviewOpen(false)}
              content={<p>Your event preview will appear here.</p>}
            />
          </div>
        </div>
      </main>
      <Footer />
    </section>
  );
}
