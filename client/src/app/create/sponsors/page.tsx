"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Button from "@/app/components/button";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

type FormErrors = {
  name: boolean;
};

export default function SponsorsPage() {
  const [showGlobalError, setShowGlobalError] = useState(false);

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

  // Map category keyword → background color
  const tabColors = {
    Platinum: "bg-white",
    Gold: "bg-white",
    Silver: "bg-white",
    Bronze: "bg-white",
  } as const;

  const handlePublish = () => {
    const newErrors = {
      name: !formData.name.trim(),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean) || !activeTab || !cover) {
      setShowGlobalError(true);
      return;
    }

    setShowGlobalError(false); // Clear error if everything is fine

    console.log("✅ Submitted:", formData, {
      cover,
      activeTab,
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
                      className={`w-full h-48 object-cover rounded-lg border transition
        ${showGlobalError && !cover ? "border-2 border-red-500" : "border"}`}
                    />
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition
        ${showGlobalError && !cover ? "border-red-500" : "border-gray-300"}`}
                    >
                      {" "}
                      <p className="text-gray-500">Upload Sponsor Logo</p>
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

              <h2 className="text-2xl font-semibold text-primary3 mt-6 font-rubik">
                Details
              </h2>
              <p className="text-sm text-gray-500 -mt-3 font-raleway">
                Provide key information
              </p>

              <label className="text-md font-normal text-primary3 font-raleway mt-5 mb-3 block">
                Sponsor Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter sponsor name"
                className={`w-full text-gray-400 font-raleway rounded-lg px-3 py-2
  border transition-all
  ${
    errors.name
      ? "border-2 border-red-500 bg-red-50"
      : "border-gray-300 bg-white text-gray-600"
  }
  focus:outline-none focus:border-2 focus:border-primary2 focus:text-black focus:bg-white
`}
              />

              <label className="text-md font-normal text-primary3 font-raleway mb-3 mt- block">
                Sponsorship Tiers
              </label>
              <div className="mb-4 flex justify-start">
                <div
                  className={`flex flex-nowrap space-x-1 rounded-xl p-1.5
    ${
      showGlobalError && !activeTab
        ? "border-2 border-red-500"
        : "bg-primary1/10"
    }`}
                >
                  {tabs.map((tab) =>
                    (() => {
                      const category = tab.split(
                        " "
                      )[0] as keyof typeof tabColors;
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`
            relative rounded-lg px-4 py-2 sm:px-6 sm:py-2.5 text-sm font-rubik font-semibold 
            transition-colors duration-300 ease-in-out cursor-pointer
            ${
              activeTab === tab
                ? `${tabColors[category]} text-primary1 shadow`
                : "text-primary1/60 hover:bg-white/60"
            }
          `}
                        >
                          {tab}
                          {activeTab === tab && (
                            <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 w-1/3 bg-primary1"></span>
                          )}
                        </button>
                      );
                    })()
                  )}
                </div>
              </div>

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
      </main>
      <Footer />
    </section>
  );
}
