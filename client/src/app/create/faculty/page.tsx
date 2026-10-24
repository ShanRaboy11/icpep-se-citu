"use client";

import { INPUT_CLASS as inputCls, labelStyle } from "@/app/components/ui/form-styles";
import ImageUploadField from "@/app/components/ui/image-upload-field";
import ConfirmModal from "@/app/components/ui/confirm-modal";
import SuccessModal from "@/app/components/ui/success-modal";
import EditingBanner from "@/app/components/ui/editing-banner";
import { ListSkeleton } from "@/app/components/feedback/skeleton-cards";
import { swapToFallback } from "@/app/components/ui/fallback-image";
import RemoveButton from "@/app/components/ui/remove-button";
import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/app/components/create/sidebar";
import Button from "@/app/components/ui/button";
import Header from "@/app/components/layout/header";
import Footer from "@/app/components/layout/footer";
import Grid from "@/app/components/layout/grid";
import {
  Pencil,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Users,
  ImageIcon } from "lucide-react";
import facultyService, { FacultyData } from "@/app/services/faculty";
import { LoadingIndicator } from "@/app/components/feedback/loading";
import GenderSelect, { GenderValue } from "@/app/components/ui/gender-select";
import { placeholderPhoto } from "@/app/utils/placeholder-photo";

// --- INTERFACES ---
interface FacultyMember {
  _id: string;
  name: string;
  position: string;
  image?: string;
  gender?: string | null;
  isActive: boolean;
}

type FormErrors = {
  name: boolean;
  position: boolean;
};

export default function FacultyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editIdParam = searchParams.get("edit");

  const [showGlobalError, setShowGlobalError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState<
    "saving" | "publishing" | null
  >(null);
  const [successMessage, setSuccessMessage] = useState({
    title: "",
    description: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({ name: "", position: "" });
  const [gender, setGender] = useState<GenderValue>("");
  const [errors, setErrors] = useState<FormErrors>({
    name: false,
    position: false,
  });

  const [facultyList, setFacultyList] = useState<FacultyMember[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [cover, setCover] = useState<File | null>(null);

  const fetchFaculty = async () => {
    setIsLoadingList(true);
    try {
      const response = await facultyService.getAllFaculty();
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];
      setFacultyList(data);
      if (editIdParam) {
        const itemToEdit = data.find((f: FacultyMember) => f._id === editIdParam);
        if (itemToEdit) handleEditClick(itemToEdit);
      }
    } catch {
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, [editIdParam]);

  const handleEditClick = (item: FacultyMember) => {
    setEditingId(item._id);
    setIsEditingDraft(!item.isActive);
    setFormData({ name: item.name, position: item.position });
    setGender((item.gender || "") as GenderValue);
    setPreview(item.image || null);
    setCover(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsEditingDraft(false);
    setFormData({ name: "", position: "" });
    setGender("");
    setPreview(null);
    setCover(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.push("/create/faculty");
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await facultyService.deleteFaculty(itemToDelete);
      setFacultyList((prev) => prev.filter((f) => f._id !== itemToDelete));
      setShowDeleteModal(false);
      setItemToDelete(null);
      setSuccessMessage({
        title: "Deleted Successfully!",
        description: "The faculty member has been permanently removed.",
      });
      setShowSuccessModal(true);
    } catch {
      alert("Failed to delete faculty member");
    }
  };

  const validate = () => {
    const newErrors = {
      name: !formData.name.trim(),
      position: !formData.position.trim(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handlePublish = async () => {
    if (!validate()) {
      setShowGlobalError(true);
      return;
    }
    setShowGlobalError(false);
    setIsSubmitting(true);
    setLoadingAction("publishing");
    try {
      const data: FacultyData = {
        name: formData.name,
        position: formData.position,
        gender,
        image: cover || undefined,
        isActive: true,
      };
      if (editingId) {
        await facultyService.updateFaculty(editingId, data);
      } else {
        await facultyService.createFaculty(data);
      }
      setSuccessMessage({
        title:
          editingId && !isEditingDraft
            ? "Updated Successfully!"
            : "Published Successfully!",
        description:
          editingId && !isEditingDraft
            ? "Changes have been saved."
            : "Faculty member is now live.",
      });
      setShowSuccessModal(true);
      handleCancelEdit();
      fetchFaculty();
    } catch {
      alert("Failed to save faculty member");
    } finally {
      setIsSubmitting(false);
      setLoadingAction(null);
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    setLoadingAction("saving");
    setShowGlobalError(false);
    if (!formData.name.trim()) {
      setErrors((p) => ({ ...p, name: true }));
      setShowGlobalError(true);
      setIsSubmitting(false);
      setLoadingAction(null);
      return;
    }
    try {
      const data: FacultyData = {
        name: formData.name,
        position: formData.position || "TBA",
        gender,
        image: cover || undefined,
        isActive: false,
      };
      if (editingId) {
        await facultyService.updateFaculty(editingId, data);
      } else {
        await facultyService.createFaculty(data);
      }
      setSuccessMessage({
        title: editingId ? "Draft Updated!" : "Draft Saved!",
        description: editingId
          ? "Draft changes have been saved."
          : "Draft has been saved successfully.",
      });
      setShowSuccessModal(true);
      handleCancelEdit();
      fetchFaculty();
    } catch {
      alert("Failed to save draft");
    } finally {
      setIsSubmitting(false);
      setLoadingAction(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors])
      setErrors((prev) => ({ ...prev, [name]: false }));
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
            resolve(new File([blob], file.name, { type: file.type }));
          },
          file.type,
          0.8,
        );
      };
      reader.readAsDataURL(file);
    });
  };

  const MAX_IMAGE_SIZE_MB = 5;

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      alert(`Image must be ${MAX_IMAGE_SIZE_MB}MB or smaller.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    try {
      const resized = await resizeImage(file);
      setCover(resized);
      setPreview(URL.createObjectURL(resized));
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      alert(`Image must be ${MAX_IMAGE_SIZE_MB}MB or smaller.`);
      return;
    }
    try {
      const resized = await resizeImage(file);
      setCover(resized);
      setPreview(URL.createObjectURL(resized));
    } catch {
    }
  };

  const publishedItems = facultyList.filter((item) => item.isActive);
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-pageblue">
      {isSubmitting && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/90 backdrop-blur-md">
          <div className="flex flex-col items-center gap-5">
            <LoadingIndicator />
            <div className="text-center">
              <p className="text-primary3 font-bold font-rubik text-lg">
                {loadingAction === "saving"
                  ? "Saving Draft"
                  : editingId
                    ? "Updating Faculty Member"
                    : "Publishing Faculty Member"}
              </p>
              <p className="text-gray-400 text-sm font-raleway mt-1">
                Please wait a moment...
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 bg-surface rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />

          <div className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-40 sm:pt-48 pb-20">
            <div className="mb-16 text-left">
              <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
                Manage Faculty
              </h1>
              <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl">
                Keep the About page&apos;s CPE department faculty roster up to
                date.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-stretch lg:items-start">
              <aside className="w-full lg:w-64 shrink-0">
                <Sidebar />
              </aside>

              <div className="flex-1 min-w-0 space-y-8">
                <div
                  className={`bg-white rounded-4xl border transition-all duration-300 shadow-md p-6 sm:p-10 lg:p-12 hover:shadow-primary1/40 hover:-translate-y-2 ${
                    editingId
                      ? "border-primary1 ring-2 ring-primary1/20"
                      : "border-gray-200"
                  }`}
                >
                  {editingId && (
                    <EditingBanner onCancel={handleCancelEdit} />
                  )}

                  <div className="flex items-center justify-between mb-8">
                    <p className="text-gray-400 text-sm font-raleway">
                      Fill in the fields below
                    </p>
                    <div className="hidden sm:flex items-center gap-1.5 bg-primary2/8 rounded-full px-4 py-2">
                      <Users size={12} className="text-primary2" />
                      <span className="text-xs font-bold text-primary2 font-rubik uppercase tracking-wider">
                        Faculty
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT — Upload */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className={labelStyle}>
                          Photo
                        </label>
                        <span className="text-xs text-gray-400 font-raleway">
                          Max {MAX_IMAGE_SIZE_MB}MB
                        </span>
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverChange}
                        ref={fileInputRef}
                      />

                      <ImageUploadField
                            preview={preview}
                            alt="faculty preview"
                            title="Upload photo"
                            hint="Drag & drop or click · PNG, JPG"
                            isDragging={isDragging}
                            onBrowse={() => fileInputRef.current?.click()}
                            onDragChange={setIsDragging}
                            onDrop={handleDrop}
                            onRemove={() => { try { if (preview) URL.revokeObjectURL(preview); } catch {} setCover(null); setPreview(null); }}
                          />
                    </div>

                    {/* RIGHT — Info */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className={labelStyle}>
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g., Engr. Roel P. Lauron"
                          className={`${inputCls} ${errors.name ? "border-red-300 ring-2 ring-red-100" : ""}`}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                            Name is required
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className={labelStyle}>
                          Position <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          placeholder="e.g., Department Head"
                          className={`${inputCls} ${errors.position ? "border-red-300 ring-2 ring-red-100" : ""}`}
                        />
                        {errors.position && (
                          <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                            Position is required
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className={labelStyle}>
                          Placeholder Photo
                        </label>
                        <GenderSelect value={gender} onChange={setGender} />
                        <p className="text-xs text-gray-400 font-raleway">
                          Shown when there&apos;s no photo. Auto picks one for you.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    {showGlobalError && (
                      <p className="text-red-400 text-xs font-bold font-raleway flex items-center gap-1.5">
                        <AlertTriangle size={12} /> Please fill all required
                        fields
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 ml-auto">
                      {editingId && (
                        <Button
                          type="button"
                          variant="heroOutline"
                          onClick={handleCancelEdit}
                          className="px-4 py-2 sm:px-6 sm:py-3"
                        >
                          Cancel
                        </Button>
                      )}

                      {(!editingId || isEditingDraft) && (
                        <Button
                          type="button"
                          variant="heroOutline"
                          onClick={handleSaveDraft}
                          disabled={isSubmitting}
                          className="px-4 py-2 sm:px-6 sm:py-3"
                        >
                          {editingId ? "Update Draft" : "Save Draft"}
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="hero"
                        onClick={handlePublish}
                        disabled={isSubmitting}
                        className="px-5 py-2 sm:px-8 sm:py-3"
                      >
                        {editingId && !isEditingDraft
                          ? "Update Faculty"
                          : "Publish Faculty"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-4xl border transition-all duration-300 shadow-md hover:shadow-primary1/40 hover:-translate-y-2 border-gray-200 overflow-hidden">
                  <div className="px-6 sm:px-8 py-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold font-rubik text-primary3">
                        Published Faculty
                      </h2>
                      <p className="text-gray-400 text-xs font-raleway mt-0.5 tracking-wide">
                        {publishedItems.length} active{" "}
                        {publishedItems.length === 1 ? "member" : "members"}
                      </p>
                    </div>
                    <button
                      onClick={fetchFaculty}
                      className="flex items-center gap-2 text-xs font-bold font-rubik text-primary1 border border-primary1/20 hover:border-primary1/50 hover:bg-primary1/5 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer"
                    >
                      <RefreshCw
                        size={13}
                        className={isLoadingList ? "animate-spin" : ""}
                      />
                      Refresh
                    </button>
                  </div>

                  {isLoadingList ? (
                    <ListSkeleton />
                  ) : publishedItems.length === 0 ? (
                    <div className="py-20 flex flex-col items-center gap-4 text-gray-300">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                        <ImageIcon size={24} className="text-gray-300" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold font-rubik text-gray-400">
                          No faculty members yet
                        </p>
                        <p className="text-xs font-raleway mt-0.5">
                          Create one using the form above
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto themed-scrollbar">
                      <table className="responsive-table w-full text-left min-w-145">
                        <thead>
                          <tr className="bg-gray-50/80">
                            <th className="px-6 sm:px-8 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                              Photo
                            </th>
                            <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                              Name
                            </th>
                            <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                              Position
                            </th>
                            <th className="px-6 sm:px-8 py-3.5 text-right text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {publishedItems.map((item) => {
                            const isEditing = editingId === item._id;
                            return (
                              <tr
                                key={item._id}
                                className={`group border-t border-gray-50 transition-all duration-200 ${isEditing ? "bg-primary1/5" : "hover:bg-gray-50/70"}`}
                              >
                                <td data-label="Photo" data-primary="media" className="px-6 sm:px-8 py-4">
                                  <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                                    <img
                                      src={item.image || placeholderPhoto(item.name, item.gender)}
                                      onError={(e) => swapToFallback(e, placeholderPhoto(item.name, item.gender))}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </td>
                                <td data-label="Name" data-primary="" className="px-4 py-4">
                                  <div className="flex items-center gap-2">
                                    {isEditing && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-primary1 animate-pulse shrink-0" />
                                    )}
                                    <span className="font-bold text-sm text-gray-800 font-rubik">
                                      {item.name}
                                    </span>
                                  </div>
                                </td>
                                <td data-label="Position" className="px-4 py-4">
                                  <span className="text-xs text-gray-600 font-raleway">
                                    {item.position}
                                  </span>
                                </td>
                                <td data-label="Actions" className="px-6 sm:px-8 py-4 text-right">
                                  <div className="inline-flex items-center gap-1 opacity-100 lg:opacity-40 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => handleEditClick(item)}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-raleway font-semibold whitespace-nowrap text-gray-400 hover:text-primary1 hover:bg-primary1/10 rounded-lg transition-all duration-150 cursor-pointer"
                                      title="Edit"
                                    >
                                      <Pencil size={15} />
                                        Edit
                                    </button>
                                    <button
                                      onClick={() => confirmDelete(item._id)}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-raleway font-semibold whitespace-nowrap text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150 cursor-pointer"
                                      title="Delete"
                                    >
                                      <Trash2 size={15} />
                                        Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="-mt-8.75 md:-mt-20 relative z-0">
        <Footer />
      </div>

      <ConfirmModal
        open={showDeleteModal}
        title="Delete Faculty Member?"
        message="This will permanently remove the faculty member. This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />

      <SuccessModal
        open={showSuccessModal}
        title={successMessage.title}
        description={successMessage.description}
        buttonLabel="Continue"
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
