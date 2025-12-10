"use client";

import React, { useState, useRef, useEffect } from "react";
import Sidebar from "@/app/components/sidebar";
import Button from "@/app/components/button";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "@/app/components/grid";
import Link from "next/link";
import { Pencil, Trash2, RefreshCw, AlertTriangle } from "lucide-react"; // Icons
import merchService, { MerchItem } from "@/app/services/merch";

// --- INTERFACES ---
// MerchItem is imported from service

type FormErrors = {
  name: boolean;
  descrip: boolean;
  orderlink: boolean;
  prices: boolean;
};

export default function SponsorsPage() {
  // Note: Function name should ideally be MerchPage based on context, but keeping as requested
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- MANAGEMENT STATE ---
  const [merchList, setMerchList] = useState<MerchItem[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: "", description: "" });

  // 1. FETCH MERCH
  const fetchMerch = async () => {
    setIsLoadingList(true);
    try {
      const data = await merchService.getAll();
      setMerchList(data);
    } catch (error) {
      console.error("Failed to fetch merch:", error);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchMerch();
  }, []);

  // 2. HANDLE EDIT CLICK
  const handleEditClick = (item: MerchItem) => {
    setEditingId(item._id);
    setFormData({
      name: item.name,
      descrip: item.description,
      orderlink: item.orderLink,
    });
    setPrices(item.prices.map(p => ({ category: p.category, price: String(p.price) })));
    setPreview(item.image || null);
    setCover(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 3. CANCEL EDIT
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", descrip: "", orderlink: "" });
    setPrices([]);
    setPreview(null);
    setCover(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 4. HANDLE DELETE
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
        description: "The item has been permanently removed."
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to delete merch:", error);
      alert("Failed to delete item. Please try again.");
    }
  };

  // 5. PUBLISH / UPDATE LOGIC
  const handlePublish = async () => {
    const newErrors = {
      name: !formData.name.trim(),
      descrip: !formData.descrip.trim(),
      orderlink: !formData.orderlink.trim(),
      prices: prices.length === 0,
    };

    setErrors(newErrors);
    setPriceError(prices.length === 0); // Trigger price error only if empty

    if (Object.values(newErrors).some(Boolean) || (!cover && !editingId && !preview)) {
      setShowGlobalError(true);
      return;
    }

    setShowGlobalError(false);
    setIsSubmitting(true);
    setPriceError(false);

    try {
      const pricesPayload = prices.map(p => ({ category: p.category, price: Number(p.price) }));

      if (editingId) {
        // Update Logic
        const updated = await merchService.update(editingId, {
          name: formData.name,
          description: formData.descrip,
          orderLink: formData.orderlink,
          prices: pricesPayload,
        }, cover || undefined);

        setMerchList((prev) =>
          prev.map((item) => (item._id === editingId ? updated : item))
        );
        setSuccessMessage({
          title: "Updated Successfully!",
          description: "Item details have been updated."
        });
      } else {
        // Create Logic
        if (!cover) throw new Error("Image is required for new items");

        const created = await merchService.create({
          name: formData.name,
          description: formData.descrip,
          orderLink: formData.orderlink,
          prices: pricesPayload,
        }, cover);

        setMerchList((prev) => [created, ...prev]);
        setSuccessMessage({
          title: "Published Successfully!",
          description: "Your item has been successfully created and is now live."
        });
      }

      handleCancelEdit(); // Reset form
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error saving merch:", error);
      alert("Failed to save item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- DYNAMIC PRICES STATE ---
  const [prices, setPrices] = useState<{ category: string; price: string }[]>([]);
  const [priceCategory, setPriceCategory] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [priceError, setPriceError] = useState(false);

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

  const handleDeletePrice = (index: number) => {
    setPrices((prev) => prev.filter((_, i) => i !== index));
  };

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
          0.8
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="min-h-screen bg-white flex flex-col relative">
      <Grid />

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-300">
          <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
            <div className="w-12 h-12 border-4 border-primary2 border-t-transparent rounded-full animate-spin" />
            <p className="text-primary3 font-semibold font-rubik animate-pulse">
              {editingId ? "Updating..." : "Publishing..."}
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
                {editingId ? "Edit Merchandise" : "Compose Merchandise"}
              </h1>
              <p className="text-gray-600 font-raleway text-lg">
                {editingId
                  ? "Update product details below"
                  : "Add and showcase your official merchandise"}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="sticky top-24">
                <Sidebar />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-12">
              {/* 1. THE FORM */}
              <div
                className={`bg-white rounded-3xl shadow-xl shadow-gray-200/50 border overflow-hidden transition-all duration-300 ${
                  editingId
                    ? "border-primary1 shadow-primary1/20"
                    : "border-gray-100"
                }`}
              >
                {/* Edit Banner */}
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
                      ? "Modify the information below"
                      : "Fill in the information below to add a merchandise"}
                  </p>
                </div>

                <div className="p-8 space-y-8">
                  {/* Upload Image Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      {/* Icon */}
                      <label className="text-lg font-semibold text-primary3 font-rubik">
                        Merchandise Image{" "}
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
                      className="block cursor-pointer group"
                    >
                      {preview ? (
                        <div className="relative overflow-hidden rounded-2xl">
                          <img
                            src={preview}
                            alt="preview"
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
                                Click to upload merchandise image
                              </p>
                              <p className="text-sm text-gray-500 mt-1 font-raleway">
                                PNG, JPG up to 10MB
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-2xl font-bold text-primary3 font-rubik">
                      Merchandise Information
                    </h3>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary3 font-raleway">
                      Merchandise Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., ICPEP.SE Lanyard"
                      className={`w-full font-raleway rounded-xl px-4 py-3.5 border-2 ${
                        errors.name ? "border-red-400" : "border-gray-200"
                      } focus:border-primary2 outline-none`}
                    />
                  </div>

                  {/* Description Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary3 font-raleway">
                      Merchandise Description{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="descrip"
                      name="descrip"
                      value={formData.descrip}
                      onChange={handleInputChange}
                      placeholder="e.g., Keep your essentials close..."
                      className={`w-full font-raleway rounded-xl px-4 py-3.5 border-2 ${
                        errors.descrip ? "border-red-400" : "border-gray-200"
                      } focus:border-primary2 outline-none`}
                    />
                  </div>

                  {/* Link Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary3 font-raleway">
                      Form Link <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="orderlink"
                      type="url"
                      name="orderlink"
                      value={formData.orderlink}
                      onChange={handleInputChange}
                      placeholder="https://example.com/orderlink"
                      className={`w-full font-raleway rounded-xl px-4 py-3.5 border-2 ${
                        errors.orderlink ? "border-red-400" : "border-gray-200"
                      } focus:border-primary2 outline-none`}
                    />
                  </div>

                  {/* Prices Section */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary3 font-raleway">
                      Merchandise Prices <span className="text-red-500">*</span>
                    </label>
                    <div
                      className={`flex flex-col sm:flex-row gap-3 p-4 rounded-2xl transition-all ${
                        priceError
                          ? "border-2 border-red-400 bg-red-50"
                          : "border-2 border-primary2/20 bg-primary2/5"
                      }`}
                    >
                      <input
                        type="text"
                        placeholder="Category (e.g., Member)"
                        value={priceCategory}
                        onChange={(e) => setPriceCategory(e.target.value)}
                        className="flex-1 rounded-xl px-4 py-3 font-rubik border-2 border-white bg-white focus:border-primary2 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Price (₱)"
                        value={priceValue}
                        onChange={(e) => setPriceValue(e.target.value)}
                        className="w-full sm:w-32 rounded-xl px-4 py-3 font-rubik border-2 border-white bg-white focus:border-primary2 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddPrice}
                        className="px-6 py-2 bg-primary2 text-white rounded-xl font-bold hover:bg-primary3"
                      >
                        Add
                      </button>
                    </div>

                    {/* Display Prices */}
                    <div className="flex flex-wrap gap-3 mt-4">
                      {prices.map((p, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-3 bg-white border-2 border-primary2/20 text-primary3 font-bold font-rubik px-5 py-2 rounded-xl"
                        >
                          <span>{p.category}</span>
                          <span className="text-primary2 bg-primary2/10 px-2 py-0.5 rounded-md text-sm">
                            PHP {p.price}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeletePrice(index)}
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                    {showGlobalError && (
                      <p className="text-red-500 text-sm font-bold font-raleway animate-pulse">
                        Please fill all fields.
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 ml-auto w-full sm:w-auto">
                      {!editingId && (
                        <Link
                          href="/drafts"
                          className="px-6 py-3 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 text-center"
                        >
                          View drafts
                        </Link>
                      )}

                      {editingId && (
                        <Button
                          variant="outline"
                          type="button"
                          onClick={handleCancelEdit}
                          className="text-red-500 border-red-200 hover:bg-red-50"
                        >
                          Cancel Edit
                        </Button>
                      )}

                      {!editingId && (
                        <Button variant="outline">Save Draft</Button>
                      )}

                      <Button
                        variant="primary3"
                        type="button"
                        onClick={handlePublish}
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-primary3 text-white rounded-xl font-bold shadow-lg disabled:opacity-50"
                      >
                        {editingId ? "Update Merch" : "Publish"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. MANAGE MERCH LIST */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-primary3 font-rubik">
                      Manage Merchandise
                    </h2>
                    <p className="text-gray-500 font-raleway text-sm mt-1">
                      Total: {merchList.length} items
                    </p>
                  </div>
                  <button
                    onClick={fetchMerch}
                    className="flex items-center gap-2 text-sm text-primary1 font-bold hover:bg-primary1/10 px-4 py-2 rounded-lg"
                  >
                    <RefreshCw size={16} /> Refresh List
                  </button>
                </div>

                <div className="overflow-x-auto">
                  {isLoadingList ? (
                    <div className="p-12 text-center text-gray-500 font-raleway">
                      Loading existing merchandise...
                    </div>
                  ) : merchList.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 font-raleway">
                      No items found. Create one above!
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold font-rubik tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Image</th>
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">Prices</th>
                          <th className="px-6 py-4">Link</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-raleway">
                        {merchList.map((item) => (
                          <tr
                            key={item._id}
                            className={`hover:bg-blue-50/40 transition-colors group ${
                              editingId === item._id
                                ? "bg-blue-50 ring-1 ring-inset ring-primary1/30"
                                : ""
                            }`}
                          >
                            <td className="px-6 py-4">
                              <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                    No Img
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-800 font-rubik">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                {item.description}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                {item.prices.map((p, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-gray-100 px-2 py-1 rounded w-fit"
                                  >
                                    {p.category}: ₱{p.price}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <a
                                href={item.orderLink}
                                target="_blank"
                                className="text-primary1 hover:underline text-sm truncate max-w-[100px] block"
                              >
                                View Form
                              </a>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 font-rubik mb-2">
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
                  {successMessage.title || (editingId ? "Updated Successfully!" : "Published Successfully!")}
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
