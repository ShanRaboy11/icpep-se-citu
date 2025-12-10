"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  Upload, 
  Image as ImageIcon,
  ChevronDown 
} from "lucide-react";

// --- IMPORTS ---
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "@/app/components/grid";
import Sidebar from "@/app/components/sidebar"; 
import OfficerCard from "@/app/officers/components/officer-card";

// --- LOCAL DATA DEFINITION ---
const departments: Record<string, any> = {
  executive: {
    title: "Executive Council",
    description: "Leading the chapter with vision and integrity.",
    gradient: "bg-gradient-to-r from-blue-600 to-cyan-500",
    shadow: "shadow-blue-500/20",
    officers: [] 
  },
  committee: {
    title: "Committee Officers",
    description: "The dedicated hands behind our events and initiatives.",
    gradient: "bg-gradient-to-r from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/20",
    officers: []
  }
  // Advisers removed as requested
};

// Define the Officer type
type Officer = {
  id: string;
  name: string;
  role: string;
  position: string;
  image: string;
};

const OfficersPage = () => {
  const params = useParams();
  const router = useRouter();

  // 1. Get available keys
  const departmentKeys = Object.keys(departments);
  
  // 2. Determine default key safely
  const urlSlug = (Array.isArray(params?.slug) ? params.slug[0] : params?.slug) || "";
  const initialKey = departmentKeys.includes(urlSlug) ? urlSlug : (departmentKeys[0] || "");

  // --- State Management ---
  const [activeKey, setActiveKey] = useState<string>(initialKey);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Get current data based on selection
  const currentData = departments[activeKey] || departments["executive"];

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    position: "",
    image: "/faculty.png"
  });

  useEffect(() => {
    const currentList = departments[activeKey]?.officers || [];
    setOfficers(currentList);
  }, [activeKey]);

  // --- Handlers ---

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: "", role: "", position: "", image: "/faculty.png" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (officer: Officer) => {
    setEditingId(officer.id);
    setFormData({
      name: officer.name,
      role: officer.role,
      position: officer.position,
      image: officer.image
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this officer?")) {
      setOfficers((prev) => prev.filter((o) => o.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      // Update existing
      setOfficers((prev) => 
        prev.map((o) => (o.id === editingId ? { ...o, ...formData } : o))
      );
    } else {
      // Create new
      const newOfficer = {
        id: Math.random().toString(36).substring(7),
        ...formData
      };
      setOfficers((prev) => [...prev, newOfficer]);
    }
    setIsModalOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, image: url });
    }
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveKey(e.target.value);
  };

  // --- Render ---

  if (!currentData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-white flex flex-col relative">
      {/* Background Grid */}
      <Grid />

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        {/* Page Content */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-16">
          
          {/* Page Header */}
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary1/10 to-primary2/10 rounded-3xl blur-3xl -z-10" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div className="text-center sm:text-left w-full sm:w-auto">
                
                {/* --- CUSTOMIZED TITLE / DROPDOWN --- */}
                <div className="relative inline-block mb-3 group">
                  <select
                    value={activeKey}
                    onChange={handleDropdownChange}
                    // Updated classes: appearance-none, outline-none, removed border, fixed width issue
                    className="appearance-none bg-transparent outline-none cursor-pointer pr-12 text-3xl sm:text-6xl font-bold font-rubik bg-gradient-to-r from-primary3 via-primary1 to-primary2 bg-clip-text text-transparent w-full sm:w-auto hover:opacity-80 transition-opacity"
                  >
                    {departmentKeys.map((key) => (
                      <option key={key} value={key} className="text-lg text-gray-800">
                        {departments[key].title}
                      </option>
                    ))}
                  </select>
                  
                  {/* Chevron Icon - Updated color to primary3 to fit palette */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-primary3">
                    <ChevronDown className="h-8 w-8 sm:h-10 sm:w-10 opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* --- CUSTOMIZED DESCRIPTION --- */}
                <p className="text-gray-600 font-raleway text-lg">
                  {currentData.description}
                </p>
              </div>

              {/* Add Button (Desktop) */}
              <div className="hidden sm:flex flex-wrap gap-3 ml-auto">
                 <button
                  onClick={handleOpenAdd}
                  className={`px-6 py-3 rounded-xl text-white font-bold shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95 flex items-center gap-2 ${currentData.gradient}`}
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-rubik">Add Officer</span>
                </button>
              </div>
            </div>
          </div>

          {/* TWO COLUMN LAYOUT START */}
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Column */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="sticky top-24">
                <Sidebar />
              </div>
            </aside>

            {/* Main Content Column */}
            <div className="flex-1 w-full space-y-8">
              
              {/* Add Button (Mobile Only) */}
              <button
                onClick={handleOpenAdd}
                className={`sm:hidden w-full flex justify-center items-center gap-2 px-6 py-3 rounded-xl text-white shadow-lg font-bold ${currentData.gradient}`}
              >
                <Plus className="h-5 w-5" />
                <span className="font-rubik">Add Officer</span>
              </button>

              {/* Officers Container - Styled like Sponsors/Merch Page */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                
                {/* Container Header */}
                <div className="p-8 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-primary3 font-rubik">
                      {currentData.title} List
                    </h2>
                    <p className="text-gray-500 font-raleway text-sm mt-1">
                      Total: {officers.length} members
                    </p>
                  </div>
                </div>

                {/* Grid Content */}
                <div className="p-8">
                  {officers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                      <p className="font-raleway text-gray-500 mb-4">No officers listed yet.</p>
                      <button onClick={handleOpenAdd} className="text-primary1 font-bold hover:underline">
                        Add the first officer
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
                      {officers.map((officer) => (
                        <div key={officer.id} className="group relative w-full max-w-[280px]">
                          
                          {/* Floating Action Buttons */}
                          <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button 
                              onClick={() => handleOpenEdit(officer)}
                              className="p-2 bg-white rounded-full shadow-md text-blue-600 hover:text-blue-700 hover:bg-gray-50 transition-colors"
                              title="Edit Officer"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(officer.id)}
                              className="p-2 bg-white rounded-full shadow-md text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete Officer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Officer Card */}
                          <div className="transform transition-transform duration-300 hover:scale-[1.02]">
                            <OfficerCard
                              position={officer.position}
                              role={officer.role}
                              name={officer.name}
                              image={officer.image}
                              gradient={currentData.gradient}
                              shadow={currentData.shadow}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* TWO COLUMN LAYOUT END */}

        </main>

        <Footer />
      </div>

      {/* --- CRUD Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className={`px-8 py-6 flex justify-between items-center ${currentData.gradient}`}>
              <h2 className="font-rubik text-2xl font-bold text-white">
                {editingId ? "Edit Officer" : "Add New Officer"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Image Uploader */}
              <div className="flex justify-center mb-6">
                <div className="relative group cursor-pointer">
                  <div className="w-32 h-32 rounded-full border-4 border-gray-100 shadow-md overflow-hidden bg-gray-100">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity cursor-pointer">
                    <Upload className="h-8 w-8" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange}
                    />
                  </label>
                  <div className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-sm text-gray-600">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Jackson, Paul"
                    className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary1 focus:ring-2 focus:ring-primary1/20 outline-none transition-all font-rubik"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Role / Header
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. 2nd Year"
                    className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary1 focus:ring-2 focus:ring-primary1/20 outline-none transition-all font-rubik"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Position / Subtitle
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="e.g. Batch Representative"
                    className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary1 focus:ring-2 focus:ring-primary1/20 outline-none transition-all font-rubik"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className={`w-full h-14 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-lg shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95 ${currentData.gradient}`}
                >
                  <Save className="h-5 w-5" />
                  {editingId ? "Save Changes" : "Create Officer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default OfficersPage;