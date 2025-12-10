"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/app/components/sidebar";
import Button from "@/app/components/button";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "@/app/components/grid";
import { Pencil, Trash2, RefreshCw, AlertTriangle } from "lucide-react"; // Icons
import sponsorService, { SponsorData } from "@/app/services/sponsor";

// --- INTERFACES ---
interface Sponsor {
  _id: string;
  name: string;
  type: string; // "Platinum Sponsor", "Gold Sponsor", etc.
  image?: string;
  isActive: boolean;
}

type FormErrors = {
  name: boolean;
};

export default function SponsorsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editIdParam = searchParams.get("edit");

  const [showGlobalError, setShowGlobalError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState<"saving" | "publishing" | null>(null);
  const [successMessage, setSuccessMessage] = useState({ title: "", description: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
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

  // --- MANAGEMENT STATE ---
  const [sponsors, setSponsors] = useState<Partner[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [cover, setCover] = useState<File | null>(null);

  // 1. FETCH SPONSORS
  // 1. FETCH SPONSORS
  const fetchSponsors = async () => {
    setIsLoadingList(true);
    try {
      const response = await sponsorService.getAllSponsors();
      const data = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
      setSponsors(data);
      
      // Handle edit param if present
      if (editIdParam) {
        const itemToEdit = data.find((s: Sponsor) => s._id === editIdParam);
        if (itemToEdit) {
          handleEditClick(itemToEdit);
        }
      }
    } catch (error) {
      console.error("Failed to fetch sponsors:", error);
    } finally {
      setIsLoadingList(false);
    }
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, [editIdParam]);

  // 2. HANDLE EDIT CLICK
  const handleEditClick = (item: Partner) => {
    setEditingId(item._id);
    setIsEditingDraft(!item.isActive);
    setFormData({ name: item.name });
    setActiveTab(item.type);
    setPreview(item.image || null);
    setCover(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 3. CANCEL EDIT
  const handleCancelEdit = () => {
    setEditingId(null);
    setIsEditingDraft(false);
    setFormData({ name: "" });
    setPreview(null);
    setCover(null);
    setActiveTab(tabs[0]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.push("/create/sponsors");
  };


  // 4. HANDLE DELETE
  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await sponsorService.deleteSponsor(itemToDelete);
      setSponsors((prev) => prev.filter((s) => s._id !== itemToDelete));
      setShowDeleteModal(false);
      setItemToDelete(null);

      setSuccessMessage({
        title: "Deleted Successfully!",
        description: "The sponsor has been permanently removed."
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to delete sponsor:", error);
      alert("Failed to delete sponsor");
    }
  };

  // 5. PUBLISH / UPDATE LOGIC
  const handlePublish = async () => {
    const newErrors = {
      name: !formData.name.trim(),
    };

    setErrors(newErrors);

    if (
      Object.values(newErrors).some(Boolean) ||
      !activeTab ||
      (!cover && !editingId && !preview)
      (!cover && !editingId && !preview)
    ) {
      setShowGlobalError(true);
      return;
    }

    setShowGlobalError(false);
    setIsSubmitting(true);
    setLoadingAction("publishing");

    try {
      const data: SponsorData = {
        name: formData.name,
        type: activeTab,
        image: cover || undefined,
        isActive: true, // Publish
      };

      if (editingId) {
        await sponsorService.updateSponsor(editingId, data);
        setSponsors((prev) =>
          prev.map((s) =>
            s._id === editingId
              ? { ...s, name: data.name, type: data.type, image: preview || s.image, isActive: true }
              : s
          )
        );
      } else {
        const res = await sponsorService.createSponsor(data);
        setSponsors((prev) => [res.data, ...prev]);
      }

      setSuccessMessage({
        title: editingId && !isEditingDraft ? "Updated Successfully!" : "Published Successfully!",
        description: editingId && !isEditingDraft ? "Changes have been saved." : "Sponsor is now live."
      });
      setShowSuccessModal(true);
      handleCancelEdit();
    } catch (error) {
      console.error("Failed to save sponsor:", error);
      alert("Failed to save sponsor");
    } finally {
      setIsSubmitting(false);
      setLoadingAction(null);
    }
  };

  // 6. HANDLE SAVE DRAFT
  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    setLoadingAction("saving");
    setShowGlobalError(false);

    // Validation for draft (minimal)
    if (!formData.name.trim()) {
      setErrors({ ...errors, name: true });
      setShowGlobalError(true);
      setIsSubmitting(false);
      setLoadingAction(null);
      return;
    }

    try {
      const data: SponsorData = {
        name: formData.name,
        type: activeTab,
        image: cover || undefined,
        isActive: false, // Draft
      };

      if (editingId) {
        await sponsorService.updateSponsor(editingId, data);
        setSponsors((prev) =>
          prev.map((s) =>
            s._id === editingId
              ? { ...s, name: data.name, type: data.type, image: preview || s.image, isActive: false }
              : s
          )
        );
      } else {
        const res = await sponsorService.createSponsor(data);
        setSponsors((prev) => [res.data, ...prev]);
      }

      setSuccessMessage({
        title: editingId ? "Draft Updated!" : "Draft Saved!",
        description: editingId ? "Draft changes have been saved." : "Draft has been saved successfully."
      });
      setShowSuccessModal(true);
      handleCancelEdit();
    } catch (error) {
      console.error("Failed to save draft:", error);
      alert("Failed to save draft");
    } finally {
      setIsSubmitting(false);
      setLoadingAction(null);
    }
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

    try {
      const resized = await resizeImage(file);
      setCover(resized);
      setPreview(URL.createObjectURL(resized));
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Error resizing image", err);
    }
  };

  const publishedItems = sponsors.filter((item) => item.isActive);

  return (
    <section className="min-h-screen bg-white flex flex-col relative">
      <Grid />

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-300">
          <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
            <div className="w-12 h-12 border-4 border-primary2 border-t-transparent rounded-full animate-spin" />
            <p className="text-primary3 font-semibold font-rubik animate-pulse">
              {loadingAction === "saving" ? "Saving Draft..." : editingId ? "Updating Sponsor..." : "Publishing Sponsor..."}
            </p>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-16">
          {/* Page Header */}
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary1/10 to-primary2/10 rounded-3xl blur-3xl -z-10" />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-6xl font-bold font-rubik bg-gradient-to-r from-primary3 via-primary1 to-primary2 bg-clip-text text-transparent mb-3">
                {editingId ? "Edit Sponsor" : "Compose Sponsor"}
              </h1>
              <p className="text-gray-600 font-raleway text-lg">
                {editingId
                  ? "Update sponsor details below"
                  : "Add and showcase your valued sponsors"}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="sticky top-24">
                <Sidebar />
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 space-y-12">
              {/* 1. THE FORM */}
              <div
                className={`bg-white rounded-3xl shadow-xl shadow-gray-200/50 border overflow-hidden transition-all duration-300 ${
                  editingId
                    ? "border-primary1 shadow-primary1/20"
                    : "border-gray-100"
                }`}
              >
                {/* Edit Mode Banner */}
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

                <div className="bg-gradient-to-r from-primary1 to-primary2 p-8">
                  <h2 className="text-3xl font-bold text-white font-rubik flex items-center gap-3">
                    {editingId ? "Edit Details" : "Content Details"}
                  </h2>
                  <p className="text-blue-100 font-raleway mt-2">
                    {editingId
                      ? "Modify sponsor information"
                      : "Upload logo and provide sponsor information"}
                  </p>
                </div>

                <div className="p-8 space-y-8">
                  {/* Upload Logo Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      {/* Icon */}
                      <label className="text-lg font-semibold text-primary3 font-rubik">
                        Sponsor Logo{" "}
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
                            alt="sponsor logo preview"
                            className="w-full h-64 object-contain bg-gray-50 rounded-2xl border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                          />
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
                            className="absolute top-4 right-4 bg-white w-10 h-10 flex items-center justify-center rounded-full text-red-500 shadow-lg hover:bg-red-50"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                            showGlobalError && !cover && !editingId
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
                                Click to upload sponsor logo
                              </p>
                              <p className="text-sm text-gray-500 mt-1 font-raleway">
                                PNG, JPG, SVG up to 10MB
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-2xl font-bold text-primary3 font-rubik mb-2">
                      Sponsor Information
                    </h3>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary3 font-raleway">
                      Sponsor Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Tech Company Inc."
                      className={`w-full font-raleway rounded-xl px-4 py-3.5 border-2 ${
                        errors.name ? "border-red-400" : "border-gray-200"
                      } focus:border-primary2 outline-none`}
                    />
                  </div>

                  {/* Sponsorship Tiers */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-primary3 font-raleway">
                      Sponsorship Tier <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tabs.map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`
                              relative rounded-xl px-6 py-4 text-left font-rubik font-semibold border-2 transition-all duration-300
                              ${
                                isActive
                                  ? "bg-primary2 text-white border-primary2 shadow-lg"
                                  : "bg-white text-gray-600 border-gray-200 hover:border-primary2/50"
                              }
                            `}
                          >
                            {tab}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                    {showGlobalError && (
                      <p className="text-red-500 text-sm font-bold font-raleway animate-pulse">
                        Please fill all required fields.
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 ml-auto w-full sm:w-auto">


                      {editingId && (
                        <Button
                          variant="outline"
                          type="button"
                          onClick={handleCancelEdit}
                          className="text-red-500 border-red-200 hover:bg-red-500 hover:text-red-500"
                        >
                          Cancel Edit
                        </Button>
                      )}

                      {(!editingId || isEditingDraft) && (
                        <Button variant="outline" onClick={handleSaveDraft}>
                          {editingId ? "Update" : "Save Draft"}
                        </Button>
                      )}

                      <Button
                        variant="primary3"
                        type="button"
                        onClick={handlePublish}
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-primary3 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 hover:shadow-primary3/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {editingId && !isEditingDraft ? "Update Sponsor" : "Publish"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. MANAGE SPONSORS LIST */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-primary3 font-rubik">
                      Manage Sponsors
                    </h2>
                    <p className="text-gray-500 font-raleway text-sm mt-1">
                      Total: {publishedItems.length} sponsors
                    </p>
                  </div>
                  <button
                    onClick={fetchSponsors}
                    className="flex items-center gap-2 text-sm text-primary1 font-bold hover:bg-primary1/10 px-4 py-2 rounded-lg transition-colors"
                  >
                    <RefreshCw size={16} /> Refresh List
                  </button>
                </div>

                <div className="overflow-x-auto">
                  {isLoadingList ? (
                    <div className="p-12 text-center text-gray-500 font-raleway">
                      Loading existing sponsors...
                    </div>
                  ) : publishedItems.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 font-raleway">
                      No sponsors found. Create one above!
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold font-rubik tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Logo</th>
                          <th className="px-6 py-4">Sponsor Name</th>
                          <th className="px-6 py-4">Tier</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-raleway">
                        {publishedItems.map((item) => (
                          <tr
                            key={item._id}
                            className={`hover:bg-blue-50/40 transition-colors group ${
                              editingId === item._id
                                ? "bg-blue-50 ring-1 ring-inset ring-primary1/30"
                                : ""
                            }`}
                          >
                            <td className="px-6 py-4">
                              <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-contain p-1"
                                  />
                                ) : (
                                  <span className="text-xs text-gray-400">
                                    No Logo
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-800 font-rubik">
                              {item.name}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  item.description?.includes("Platinum")
                                    ? "bg-slate-100 text-slate-700 border border-slate-300"
                                    : item.description?.includes("Gold")
                                    ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                    : item.description?.includes("Silver")
                                    ? "bg-gray-100 text-gray-600 border border-gray-200"
                                    : "bg-orange-50 text-orange-700 border border-orange-200"
                                }`}
                              >
                                {item.description || item.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleEditClick(item)}
                                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                                  title="Edit"
                                >
                                  <Pencil size={18} />
                                </button>
                                <button
                                  onClick={() => confirmDelete(item._id)}
                                  onClick={() => confirmDelete(item._id)}
                                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
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

        <Footer />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 font-rubik mb-2">
              Confirm Deletion
              Confirm Deletion
            </h3>
            <p className="text-gray-500 font-raleway mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
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
                  {successMessage.title}
                </h3>
                <p className="text-gray-600 font-raleway">
                  {successMessage.description}
                </p>
              </div>

              <div className="flex gap-3 mt-2 w-full">
                <Button
                  variant="primary3"
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
