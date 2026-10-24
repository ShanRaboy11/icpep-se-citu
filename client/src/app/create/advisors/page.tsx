"use client";

import { INPUT_CLASS as inputCls, labelStyle } from "@/app/components/ui/form-styles";
import ConfirmModal from "@/app/components/ui/confirm-modal";
import SuccessModal from "@/app/components/ui/success-modal";
import EditingBanner from "@/app/components/ui/editing-banner";
import { ListSkeleton } from "@/app/components/feedback/skeleton-cards";
import { swapToFallback } from "@/app/components/ui/fallback-image";
import React, { useState, useEffect } from "react";
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
  GraduationCap,
  ImageIcon,
} from "lucide-react";
import advisorService, { AdvisorData } from "@/app/services/advisor";
import { LoadingIndicator } from "@/app/components/feedback/loading";
import facultyService from "@/app/services/faculty";
import Dropdown from "@/app/components/ui/dropdown";
import { placeholderPhoto } from "@/app/utils/placeholder-photo";

// --- INTERFACES ---
interface Advisor {
  _id: string;
  name: string;
  position: string;
  yearRange: string;
  isCurrent: boolean;
  faculty?: string | null;
  image?: string;
  gender?: string | null;
  isActive: boolean;
}

interface FacultyOption {
  _id: string;
  name: string;
  position: string;
  image?: string;
  gender?: string | null;
}

type FormErrors = {
  name: boolean;
  position: boolean;
  yearRange: boolean;
};

export default function AdvisorsPage() {
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

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    yearRange: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    name: false,
    position: false,
    yearRange: false,
  });
  const [isCurrent, setIsCurrent] = useState(false);
  const [facultyId, setFacultyId] = useState("");
  const [facultyOptions, setFacultyOptions] = useState<FacultyOption[]>([]);

  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);

  const fetchAdvisors = async () => {
    setIsLoadingList(true);
    try {
      const response = await advisorService.getAllAdvisors();
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];
      setAdvisors(data);
      if (editIdParam) {
        const itemToEdit = data.find((a: Advisor) => a._id === editIdParam);
        if (itemToEdit) handleEditClick(itemToEdit);
      }
    } catch {
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    facultyService
      .getFaculty()
      .then((response) =>
        setFacultyOptions(Array.isArray(response.data) ? response.data : []),
      )
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    fetchAdvisors();
  }, [editIdParam]);

  const handleEditClick = (item: Advisor) => {
    setEditingId(item._id);
    setIsEditingDraft(!item.isActive);
    setFormData({
      name: item.name,
      position: item.position,
      yearRange: item.yearRange,
    });
    setIsCurrent(item.isCurrent);
    setFacultyId(item.faculty || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsEditingDraft(false);
    setFormData({ name: "", position: "", yearRange: "" });
    setIsCurrent(false);
    setFacultyId("");
    router.push("/create/advisors");
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await advisorService.deleteAdvisor(itemToDelete);
      setAdvisors((prev) => prev.filter((a) => a._id !== itemToDelete));
      setShowDeleteModal(false);
      setItemToDelete(null);
      setSuccessMessage({
        title: "Deleted Successfully!",
        description: "The advisor has been permanently removed.",
      });
      setShowSuccessModal(true);
    } catch {
      alert("Failed to delete advisor");
    }
  };

  const validate = () => {
    const newErrors = {
      name: !facultyId && !formData.name.trim(),
      position: !formData.position.trim(),
      yearRange: !formData.yearRange.trim(),
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
      const data: AdvisorData = {
        faculty: facultyId || (editingId ? "" : undefined),
        name: formData.name || undefined,
        position: formData.position,
        yearRange: formData.yearRange,
        isCurrent,
        isActive: true,
      };
      if (editingId) {
        await advisorService.updateAdvisor(editingId, data);
      } else {
        await advisorService.createAdvisor(data);
      }
      setSuccessMessage({
        title:
          editingId && !isEditingDraft
            ? "Updated Successfully!"
            : "Published Successfully!",
        description:
          editingId && !isEditingDraft
            ? "Changes have been saved."
            : "Advisor is now live.",
      });
      setShowSuccessModal(true);
      handleCancelEdit();
      fetchAdvisors();
    } catch {
      alert("Failed to save advisor");
    } finally {
      setIsSubmitting(false);
      setLoadingAction(null);
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    setLoadingAction("saving");
    setShowGlobalError(false);
    if (!facultyId && !formData.name.trim()) {
      setErrors((p) => ({ ...p, name: true }));
      setShowGlobalError(true);
      setIsSubmitting(false);
      setLoadingAction(null);
      return;
    }
    try {
      const data: AdvisorData = {
        faculty: facultyId || (editingId ? "" : undefined),
        name: formData.name || undefined,
        position: formData.position || "TBA",
        yearRange: formData.yearRange || "TBA",
        isCurrent,
        isActive: false,
      };
      if (editingId) {
        await advisorService.updateAdvisor(editingId, data);
      } else {
        await advisorService.createAdvisor(data);
      }
      setSuccessMessage({
        title: editingId ? "Draft Updated!" : "Draft Saved!",
        description: editingId
          ? "Draft changes have been saved."
          : "Draft has been saved successfully.",
      });
      setShowSuccessModal(true);
      handleCancelEdit();
      fetchAdvisors();
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

  const publishedItems = advisors.filter((item) => item.isActive);
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
                    ? "Updating Advisor"
                    : "Publishing Advisor"}
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
                Manage Advisors
              </h1>
              <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl">
                Keep the About page&apos;s advisor history and the Home
                page&apos;s current faculty roster up to date.
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
                      <GraduationCap size={12} className="text-primary2" />
                      <span className="text-xs font-bold text-primary2 font-rubik uppercase tracking-wider">
                        Advisor
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    {/* RIGHT — Info */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className={labelStyle}>
                          Faculty Member <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                          variant="field"
                          value={facultyId}
                          invalid={errors.name}
                          placeholder="Select a faculty member"
                          options={[
                            {
                              value: "",
                              label: formData.name ? `Keep ${formData.name}` : "Select a faculty member",
                            },
                            ...facultyOptions.map((member) => ({
                              value: member._id,
                              label: `${member.name} — ${member.position}`,
                            })),
                          ]}
                          onChange={(value) => {
                            setFacultyId(value);
                            setErrors((prev) => ({ ...prev, name: false }));
                          }}
                        />
                        {errors.name ? (
                          <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                            Choose a faculty member
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400 font-raleway">
                            Add people on the Faculty page first. Name and photo come from there.
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
                          placeholder="e.g., CPE Department Head"
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
                          Year Range <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="yearRange"
                          value={formData.yearRange}
                          onChange={handleInputChange}
                          placeholder="e.g., 2022 - Present"
                          className={`${inputCls} ${errors.yearRange ? "border-red-300 ring-2 ring-red-100" : ""}`}
                        />
                        {errors.yearRange && (
                          <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                            Year range is required
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold font-raleway text-gray-700">
                            Currently Serving
                          </p>
                          <p className="text-xs text-gray-400 font-raleway">
                            Also appears in Home&apos;s Council Officers &amp;
                            Faculty section
                          </p>
                        </div>
                        <div
                          className={`w-10 h-5 rounded-full transition-all duration-300 relative cursor-pointer active:scale-95 shrink-0 ${isCurrent ? "bg-primary2" : "bg-gray-200"}`}
                          onClick={() => setIsCurrent((p) => !p)}
                        >
                          <div
                            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${isCurrent ? "left-5.5" : "left-0.5"}`}
                          />
                        </div>
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
                          ? "Update Advisor"
                          : "Publish Advisor"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-4xl border transition-all duration-300 shadow-md hover:shadow-primary1/40 hover:-translate-y-2 border-gray-200 overflow-hidden">
                  <div className="px-6 sm:px-8 py-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold font-rubik text-primary3">
                        Published Advisors
                      </h2>
                      <p className="text-gray-400 text-xs font-raleway mt-0.5 tracking-wide">
                        {publishedItems.length} active{" "}
                        {publishedItems.length === 1 ? "advisor" : "advisors"}
                      </p>
                    </div>
                    <button
                      onClick={fetchAdvisors}
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
                          No advisors yet
                        </p>
                        <p className="text-xs font-raleway mt-0.5">
                          Create one using the form above
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto themed-scrollbar">
                      <table className="responsive-table w-full text-left min-w-160">
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
                            <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                              Years
                            </th>
                            <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                              Status
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
                                <td data-label="Years" className="px-4 py-4">
                                  <span className="text-xs text-gray-600 font-raleway">
                                    {item.yearRange}
                                  </span>
                                </td>
                                <td data-label="Status" className="px-4 py-4">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-raleway font-semibold border ${item.isCurrent ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${item.isCurrent ? "bg-emerald-500" : "bg-gray-400"}`}
                                    />
                                    {item.isCurrent ? "Current" : "Past"}
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
        title="Delete Advisor?"
        message="This will permanently remove the advisor. This action cannot be undone."
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
