"use client";

import React, { useState, useRef, useEffect } from "react";
import Sidebar from "@/app/create/components/sidebar";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "@/app/components/grid";
import { GlassCard } from "../../components/glass-card";
import { useSearchParams } from "next/navigation";
import {
  Pencil,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Upload,
  Plus,
  X,
  Tag,
  ShoppingBag,
} from "lucide-react";
import merchService, { MerchItem } from "@/app/services/merch";

type FormErrors = {
  name: boolean;
  descrip: boolean;
  orderlink: boolean;
  prices: boolean;
};

export default function MerchPage() {
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState<
    "saving" | "publishing" | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [merchList, setMerchList] = useState<MerchItem[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: "",
    description: "",
  });
  const searchParams = useSearchParams();
  const editIdParam = searchParams.get("edit");

  const [prices, setPrices] = useState<{ category: string; price: string }[]>(
    [],
  );
  const [priceCategory, setPriceCategory] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [priceError, setPriceError] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    descrip: "",
    orderlink: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    name: false,
    descrip: false,
    orderlink: false,
    prices: false,
  });
  const [cover, setCover] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // --- FETCH ---
  const fetchMerch = async () => {
    setIsLoadingList(true);
    try {
      const data = await merchService.getAll();
      setMerchList(data);
      if (editIdParam) {
        const itemToEdit = data.find((m: MerchItem) => m._id === editIdParam);
        if (itemToEdit) handleEditClick(itemToEdit);
      }
    } catch (error) {
      console.error("Failed to fetch merch:", error);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchMerch();
  }, [editIdParam]);

  const handleEditClick = (item: MerchItem) => {
    setEditingId(item._id);
    setIsEditingDraft(!item.isActive);
    setFormData({
      name: item.name,
      descrip: item.description,
      orderlink: item.orderLink,
    });
    setPrices(
      item.prices.map((p) => ({
        category: p.category,
        price: String(p.price),
      })),
    );
    setPreview(item.image || null);
    setCover(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsEditingDraft(false);
    setFormData({ name: "", descrip: "", orderlink: "" });
    setPrices([]);
    setPreview(null);
    setCover(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await merchService.delete(itemToDelete);
      setMerchList((prev) => prev.filter((m) => m._id !== itemToDelete));
      setShowDeleteModal(false);
      setItemToDelete(null);
      setSuccessMessage({
        title: "Deleted Successfully!",
        description: "The item has been permanently removed.",
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to delete merch:", error);
      alert("Failed to delete item.");
    }
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    const newErrors = {
      name: !formData.name.trim(),
      descrip: !formData.descrip.trim(),
      orderlink: !formData.orderlink.trim(),
      prices: prices.length === 0,
    };
    setErrors(newErrors);
    setPriceError(prices.length === 0);
    if (
      Object.values(newErrors).some(Boolean) ||
      (!cover && !editingId && !preview)
    ) {
      setShowGlobalError(true);
      return;
    }
    setShowGlobalError(false);
    setIsSubmitting(true);
    setLoadingAction(isDraft ? "saving" : "publishing");
    setPriceError(false);
    try {
      const pricesPayload = prices.map((p) => ({
        category: p.category,
        price: Number(p.price),
      }));
      const isActive = !isDraft;
      if (editingId) {
        const updated = await merchService.update(
          editingId,
          {
            name: formData.name,
            description: formData.descrip,
            orderLink: formData.orderlink,
            prices: pricesPayload,
            isActive,
          },
          cover || undefined,
        );
        setMerchList((prev) =>
          prev.map((item) => (item._id === editingId ? updated : item)),
        );
        setSuccessMessage({
          title: isDraft
            ? "Draft Updated!"
            : !isEditingDraft
              ? "Updated Successfully!"
              : "Published Successfully!",
          description: isDraft
            ? "Draft changes have been saved."
            : !isEditingDraft
              ? "Item details have been updated."
              : "Item is now live.",
        });
      } else {
        if (!cover) throw new Error("Image is required");
        const created = await merchService.create(
          {
            name: formData.name,
            description: formData.descrip,
            orderLink: formData.orderlink,
            prices: pricesPayload,
            isActive,
          },
          cover,
        );
        setMerchList((prev) => [created, ...prev]);
        setSuccessMessage({
          title: isDraft ? "Draft Saved!" : "Published Successfully!",
          description: isDraft ? "Saved as a draft." : "Item is now live.",
        });
      }
      handleCancelEdit();
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error saving merch:", error);
      alert("Failed to save item.");
    } finally {
      setIsSubmitting(false);
      setLoadingAction(null);
    }
  };

  const handleAddPrice = () => {
    if (!priceCategory.trim() || !priceValue.trim()) {
      setPriceError(true);
      return;
    }
    setPrices((prev) => [
      ...prev,
      { category: priceCategory, price: priceValue },
    ]);
    setPriceCategory("");
    setPriceValue("");
    setPriceError(false);
  };

  const handleDeletePrice = (index: number) =>
    setPrices((prev) => prev.filter((_, i) => i !== index));

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors])
      setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const resizeImage = (file: File, maxWidth = 1200): Promise<File> =>
    new Promise((resolve) => {
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

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const resized = await resizeImage(file);
      setCover(resized);
      setPreview(URL.createObjectURL(resized));
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const resized = await resizeImage(file);
      setCover(resized);
      setPreview(URL.createObjectURL(resized));
    } catch (err) {
      console.error(err);
    }
  };

  const publishedItems = merchList.filter((item) => item.isActive);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#004e89]">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-md">
          <div className="flex flex-col items-center gap-5">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-primary2/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary2 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-primary3 font-bold font-rubik text-lg">
                {loadingAction === "saving"
                  ? "Saving Draft"
                  : editingId
                    ? "Updating Merch"
                    : "Publishing Merch"}
              </p>
              <p className="text-gray-400 text-sm font-raleway mt-1">
                Please wait a moment...
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 bg-[#f8f9fc] rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />

          <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-40 sm:pt-48 pb-20">
            {/* ── PAGE HEADER ── */}
            <div className="mb-16 text-left">
              <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
                Manage Merchandise
              </h1>
              <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl">
                Add and showcase your official chapter merchandise.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <aside className="w-full lg:w-64 flex-shrink-0">
                <Sidebar />
              </aside>

              <div className="flex-1 min-w-0 space-y-8">
                {/* ── FORM CARD ── */}
                <div className={`bg-white rounded-[2rem] border transition-all duration-300 shadow-lg p-6 sm:p-10 lg:p-12 hover:shadow-primary1/40 hover:-translate-y-2 ${
                  editingId ? "border-primary1 ring-2 ring-primary1/20" : "border-gray-200"
                }`}>
                    {/* Edit Banner */}
                    {editingId && (
                      <div className="-mx-6 sm:-mx-10 lg:-mx-12 -mt-6 sm:-mt-10 lg:-mt-12 mb-8 bg-gradient-to-r from-primary1 to-primary3 px-6 sm:px-10 py-5 flex items-center justify-between rounded-t-[2rem]">
                        <div className="flex items-center gap-2 text-white">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          <span className="text-sm font-bold font-rubik tracking-wide">
                            EDITING MODE
                          </span>
                        </div>
                        <button
                          onClick={handleCancelEdit}
                          className="text-white/80 hover:text-white text-sm font-bold font-raleway underline underline-offset-2 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    <div className="flex flex-col gap-6">
                      {/* Section Header */}
                      <div className="flex items-center justify-between">
                                             <p className="font-raleway text-gray-500 text-sm">
                                               Fill in the fields below
                                             </p>
                                             <div className="hidden sm:flex items-center gap-1.5 bg-primary2/8 rounded-full px-4 py-2">
                                               <ShoppingBag size={12} className="text-primary2" />
                                               <span className="text-xs font-bold text-primary2 font-rubik uppercase tracking-wider">
                                                 Merch
                                               </span>
                                             </div>
                                           </div>

                      {/* Top grid: image + core fields */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* LEFT — Image Upload */}
                        <div className="space-y-3">
                          <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                            Product Image{" "}
                            <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoverChange}
                            ref={fileInputRef}
                          />

                          {preview ? (
                            <div className="relative group rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50 h-56">
                              <img
                                src={preview}
                                alt="merch preview"
                                className="w-full h-full object-contain p-4"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="bg-white text-primary3 text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform font-rubik"
                                >
                                  Replace
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    try {
                                      if (preview) URL.revokeObjectURL(preview);
                                    } catch {}
                                    setCover(null);
                                    setPreview(null);
                                  }}
                                  className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform font-rubik"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => fileInputRef.current?.click()}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ")
                                  fileInputRef.current?.click();
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                              }}
                              onDragLeave={() => setIsDragging(false)}
                              onDrop={handleDrop}
                              className={`cursor-pointer h-56 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
                                isDragging
                                  ? "border-primary2 bg-primary2/5 scale-[1.01]"
                                  : showGlobalError && !cover && !editingId
                                    ? "border-red-300 bg-red-50/50"
                                    : "border-gray-200 bg-gray-50/80 hover:border-primary2/60 hover:bg-primary2/3"
                              }`}
                            >
                              <div
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                                  isDragging
                                    ? "bg-primary2 text-white"
                                    : "bg-white text-primary2 shadow-md"
                                }`}
                              >
                                <Upload size={22} strokeWidth={2.5} />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-bold text-gray-700 font-rubik">
                                  {isDragging
                                    ? "Drop it!"
                                    : "Upload product image"}
                                </p>
                                <p className="text-xs text-gray-400 mt-1 font-raleway">
                                  Drag & drop or click · PNG, JPG
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* RIGHT — Name, Description, Link */}
                        <div className="space-y-5">
                          {/* Name */}
                          <div className="space-y-2">
                            <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                              Item Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="e.g., ICPEP.SE Lanyard"
                              className={`w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all placeholder-gray-400 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10 ${
                                errors.name ? "border-red-300 ring-2 ring-red-100" : ""
                              }`}
                            />
                            {errors.name && (
                              <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                                <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                                Name is required
                              </p>
                            )}
                          </div>

                          {/* Description */}
                          <div className="space-y-2">
                            <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                              Description{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              id="descrip"
                              name="descrip"
                              value={formData.descrip}
                              onChange={handleInputChange}
                              placeholder="e.g., Keep your essentials close..."
                              className={`w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all placeholder-gray-400 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10 ${
                                errors.descrip ? "border-red-300 ring-2 ring-red-100" : ""
                              }`}
                            />
                            {errors.descrip && (
                              <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                                <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                                Description is required
                              </p>
                            )}
                          </div>

                          {/* Order Link */}
                          <div className="space-y-2">
                            <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                              Order Form Link{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              id="orderlink"
                              type="url"
                              name="orderlink"
                              value={formData.orderlink}
                              onChange={handleInputChange}
                              placeholder="https://example.com/order"
                              className={`w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all placeholder-gray-400 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10 ${
                                errors.orderlink ? "border-red-300 ring-2 ring-red-100" : ""
                              }`}
                            />
                            {errors.orderlink && (
                              <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                                <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                                Order link is required
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ── PRICES SECTION ── */}
                      <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-2">
                          <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                            Pricing Tiers{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <span className="text-[10px] font-semibold text-gray-300 font-raleway">
                            (Add at least one)
                          </span>
                        </div>

                        {/* Add Price Row */}
                        <div
                          className={`flex flex-col sm:flex-row gap-3 p-4 rounded-xl border-2 transition-all ${
                            priceError
                              ? "border-red-300 bg-red-50/30"
                              : "border-gray-200 bg-gray-50/60"
                          }`}
                        >
                          <input
                            type="text"
                            placeholder="Category (e.g., Member)"
                            value={priceCategory}
                            onChange={(e) => setPriceCategory(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddPrice();
                              }
                            }}
                            className="flex-1 rounded-xl px-4 py-3 font-rubik text-sm border-2 border-white bg-white focus:border-primary2 outline-none transition-all"
                          />
                          <input
                            type="text"
                            placeholder="Price (₱)"
                            value={priceValue}
                            onChange={(e) => setPriceValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddPrice();
                              }
                            }}
                            className="w-full sm:w-36 rounded-xl px-4 py-3 font-rubik text-sm border-2 border-white bg-white focus:border-primary2 outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={handleAddPrice}
                            className="flex items-center justify-center gap-1.5 px-5 py-3 bg-gradient-to-r from-primary1 to-primary2 text-white text-sm font-bold font-rubik rounded-xl shadow-md shadow-primary2/20 hover:shadow-primary2/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                          >
                            <Plus size={14} /> Add
                          </button>
                        </div>
                        {priceError && (
                          <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                            Please fill in both fields
                          </p>
                        )}

                        {/* Price Tags */}
                        {prices.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {prices.map((p, index) => (
                              <span
                                key={index}
                                className="flex items-center gap-2 bg-white border-2 border-primary2/20 text-primary3 font-bold font-rubik px-4 py-2 rounded-xl text-sm shadow-sm"
                              >
                                <Tag size={12} className="text-primary2" />
                                <span>{p.category}</span>
                                <span className="text-primary2 bg-primary2/10 px-2 py-0.5 rounded-lg text-xs">
                                  ₱{p.price}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePrice(index)}
                                  className="w-5 h-5 flex items-center justify-center rounded-full hover:text-red-500 transition-colors ml-0.5"
                                >
                                  <X size={12} />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* ── ACTIONS ── */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        {showGlobalError && (
                          <p className="text-red-500 text-sm font-raleway flex items-center gap-1.5">
                            <AlertTriangle size={14} /> Please fill all required fields
                          </p>
                        )}
                        <div className="flex flex-wrap gap-3 ml-auto">
                          {editingId && (
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-6 py-3 font-rubik font-bold text-gray-500 border-2 border-gray-200 hover:border-red-200 hover:text-red-400 rounded-2xl transition-all duration-300"
                            >
                              Cancel
                            </button>
                          )}
                          {(!editingId || isEditingDraft) && (
                            <button
                              type="button"
                              onClick={() => handleSubmit(true)}
                              className="px-6 py-3 font-rubik font-bold text-primary1 border-2 border-primary1/30 hover:border-primary1 hover:bg-primary1/5 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {editingId ? "Update Draft" : "Save Draft"}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleSubmit(false)}
                            disabled={isSubmitting}
                            className="group relative px-8 py-3 bg-gradient-to-r from-primary3 to-primary1 rounded-2xl font-rubik font-bold text-white shadow-lg shadow-primary1/20 hover:shadow-primary1/40 transition-all duration-300 flex items-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span>
                              {editingId && !isEditingDraft
                                ? "Update Merch"
                                : "Publish Merch"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                </div>

                {/* ── MANAGE LIST ── */}
                <div className="bg-white rounded-[2rem] border transition-all duration-300 shadow-md hover:shadow-primary1/40 hover:-translate-y-2 border-gray-200">
                    {/* List Header */}
                    <div className="px-6 sm:px-8 py-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <h2 className="text-xl font-black font-rubik text-primary3">
                          Published Merchandise
                        </h2>
                        <p className="text-gray-400 text-xs font-raleway mt-0.5 tracking-wide">
                          {publishedItems.length} active{" "}
                          {publishedItems.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                      <button
                        onClick={fetchMerch}
                        className="flex items-center gap-2 text-xs font-bold font-rubik text-primary1 border border-primary1/20 hover:border-primary1/50 hover:bg-primary1/5 px-4 py-2 rounded-full transition-all duration-200"
                      >
                        <RefreshCw
                          size={13}
                          className={isLoadingList ? "animate-spin" : ""}
                        />
                        Refresh
                      </button>
                    </div>

                    {/* Table */}
                    {isLoadingList ? (
                      <div className="py-20 flex flex-col items-center gap-3 text-gray-300">
                        <div className="w-8 h-8 border-2 border-gray-200 border-t-primary2 rounded-full animate-spin" />
                        <p className="text-sm font-raleway">
                          Loading merchandise...
                        </p>
                      </div>
                    ) : publishedItems.length === 0 ? (
                      <div className="py-20 flex flex-col items-center gap-4 text-gray-300">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                          <ShoppingBag size={24} className="text-gray-300" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold font-rubik text-gray-400">
                            No merchandise yet
                          </p>
                          <p className="text-xs font-raleway mt-0.5">
                            Create one using the form above
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[680px]">
                          <thead>
                            <tr className="bg-gray-50/80">
                              <th className="px-6 sm:px-8 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                                Image
                              </th>
                              <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                                Name
                              </th>
                              <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                                Prices
                              </th>
                              <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
                                Link
                              </th>
                              <th className="px-6 sm:px-8 py-3.5 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 font-rubik">
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
                                  className={`group border-t border-gray-50 transition-all duration-200 ${
                                    isEditing
                                      ? "bg-primary1/5"
                                      : "hover:bg-gray-50/70"
                                  }`}
                                >
                                  {/* Image */}
                                  <td className="px-6 sm:px-8 py-4">
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                                      {item.image ? (
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <ShoppingBag
                                          size={16}
                                          className="text-gray-300"
                                        />
                                      )}
                                    </div>
                                  </td>

                                  {/* Name */}
                                  <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                      {isEditing && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary1 animate-pulse flex-shrink-0" />
                                      )}
                                      <span className="font-bold text-sm text-gray-800 font-rubik">
                                        {item.name}
                                      </span>
                                    </div>
                                    {item.description && (
                                      <p className="text-xs text-gray-400 font-raleway mt-0.5 max-w-[200px] truncate">
                                        {item.description}
                                      </p>
                                    )}
                                  </td>

                                  {/* Prices */}
                                  <td className="px-4 py-4">
                                    <div className="flex flex-wrap gap-1">
                                      {item.prices?.map((p, idx) => (
                                        <span
                                          key={idx}
                                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary2/10 text-primary2 border border-primary2/20"
                                        >
                                          {p.category}: ₱{p.price}
                                        </span>
                                      ))}
                                    </div>
                                  </td>

                                  {/* Link */}
                                  <td className="px-4 py-4">
                                    <a
                                      href={item.orderLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-xs font-bold text-primary2 hover:underline font-rubik truncate max-w-[140px] block"
                                    >
                                      View Form ↗
                                    </a>
                                  </td>

                                  {/* Actions */}
                                  <td className="px-6 sm:px-8 py-4 text-right">
                                    <div className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => handleEditClick(item)}
                                        className="p-2 text-gray-400 hover:text-primary1 hover:bg-primary1/10 rounded-lg transition-all duration-150"
                                        title="Edit"
                                      >
                                        <Pencil size={15} />
                                      </button>
                                      <button
                                        onClick={() => confirmDelete(item._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150"
                                        title="Delete"
                                      >
                                        <Trash2 size={15} />
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

      <div className="mt-[-35px] md:mt-[-80px] relative z-0">
        <Footer />
      </div>

      {/* ── DELETE MODAL ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-primary3 font-rubik mb-2">
              Delete Item?
            </h3>
            <p className="text-gray-400 text-sm font-raleway mb-6 leading-relaxed">
              This will permanently remove the merchandise item. This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 text-sm font-bold font-rubik text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 text-sm font-bold font-rubik text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-lg shadow-red-500/25"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUCCESS MODAL ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" />
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl relative">
                  <svg
                    className="w-10 h-10 text-white"
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
            </div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-black text-primary3 font-rubik">
                {successMessage.title}
              </h3>
              <p className="text-gray-400 text-sm font-raleway mt-2">
                {successMessage.description}
              </p>
            </div>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 text-sm font-bold font-rubik text-white bg-gradient-to-r from-primary1 to-primary2 rounded-xl shadow-lg hover:shadow-primary2/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
