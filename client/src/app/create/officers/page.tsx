"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Image as ImageIcon,
  ChevronDown,
  Pencil,
  AlertCircle,
  Search,
  X,
  RefreshCw,
  Users,
  AlertTriangle,
  ChevronRight,
  Shield,
  Layers,
  Check,
  User,
  UserCog,
  Archive,
  Upload,
} from "lucide-react";

// --- IMPORTS ---
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "@/app/components/grid";
import Button from "@/app/components/button";
import Sidebar from "@/app/create/components/sidebar";
import { GlassCard } from "../../components/glass-card";
import officerService, { Officer as IOfficer } from "@/app/services/officer";
import officerTermService, {
  OfficerTermData,
} from "@/app/services/officerTerm";
import { getCurrentAcademicYear } from "@/app/utils/academic-year";
import { shortDepartmentName } from "@/app/utils/department";
import { useDropdownDismiss } from "@/app/utils/use-dropdown-dismiss";
import { LoadingIndicator } from "@/app/components/loading";

// --- DATA CONFIGURATION ---
const departments: Record<string, any> = {
  executive: {
    id: "executive",
    title: "Executive Council",
    subtitle: "Elected Positions",
    description: "Leading the chapter with vision and integrity.",
    icon: Shield,
    color: "text-primary1",
    bg: "bg-primary1/8",
    border: "border-primary1/30",
    dot: "bg-primary1",
    rank: 1,
  },
  committee: {
    id: "committee",
    title: "Committee Officers",
    subtitle: "Committee Heads",
    description: "The dedicated hands behind our events and initiatives.",
    icon: Layers,
    color: "text-primary2",
    bg: "bg-primary2/8",
    border: "border-primary2/30",
    dot: "bg-primary2",
    rank: 2,
  },
};

// --- POSITIONS & DROPDOWN DATA ---
const EXECUTIVE_POSITIONS = [
  "President",
  "VP Internal",
  "VP External",
  "Secretary",
  "Treasurer",
  "Auditor",
  "PIO",
  "PRO",
  "SSG Representative",
  "Batch Representative",
];

const YEAR_LEVELS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const COMMITTEES_LIST = [
  "Committee on Internal Affairs",
  "Committee on External Affairs",
  "Committee on Finance",
  "Committee on Public Relations",
  "Research and Development Committee",
  "Training and Seminar Committee",
  "Sports and Cultural Committee",
  "Media and Documentation Committee",
];

const COMMITTEE_ROLES = [
  "Committee Head",
  "Assistant Head",
  "Secretary",
  "Member",
];

type Officer = {
  id: string; // composite key: `${userId}::${assignmentType}` — a student can have both
  userId: string;
  assignmentType: "council" | "committee";
  name: string;
  role: string;
  position: string;
  image: string;
  departmentId: string;
  studentNumber?: string;
  // The officer's other assignment, so someone with both a council seat and a
  // committee seat shows both wherever they appear.
  also?: string;
};

const ordinalYear = (n: number) => {
  const suffix = n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
  return `${n}${suffix} Year`;
};

interface OfficerTermRow {
  _id: string;
  name: string;
  position: string;
  role?: string;
  departmentType: "executive" | "committee";
  committeeName?: string;
  termYear: string;
  image?: string;
  isActive: boolean;
  sourceUserId?: string;
}

type ArchiveFormErrors = {
  name: boolean;
  position: boolean;
  termYear: boolean;
  committeeName: boolean;
};

const archiveKey = (term: OfficerTermRow) =>
  `${term.termYear}::${term.sourceUserId || term.name.trim().toLowerCase()}`;

const archiveAssignmentLabel = (term: OfficerTermRow) =>
  term.departmentType === "executive"
    ? [term.position, term.role].filter(Boolean).join(" ")
    : `${term.position} · ${shortDepartmentName(term.committeeName)}`;

// A student can be an executive officer and sit on a committee (or several) in
// the same year, so each row also lists that person's other assignments.
const otherAssignments = (term: OfficerTermRow, all: OfficerTermRow[]) =>
  all
    .filter((other) => other._id !== term._id && archiveKey(other) === archiveKey(term))
    .map(archiveAssignmentLabel);

export default function OfficersPage() {
  // --- STATE ---
  // "manage" assigns/edits the live current roster; "archive" logs past
  // years' officers (independent of who currently holds the seat).
  const [pageView, setPageView] = useState<"manage" | "archive">("manage");
  const [activeTab, setActiveTab] = useState<string>("executive");
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    userId: string;
    assignmentType: "council" | "committee";
  } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: "",
    description: "",
  });

  // Dropdown State
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  useDropdownDismiss(activeDropdown !== null, () => setActiveDropdown(null));

  // Search State
  const [searchResults, setSearchResults] = useState<IOfficer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<IOfficer | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    position: "",
    image: "",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // Which academic year this assignment counts toward — auto-archived under
  // this year whenever the officer is (re-)assigned, defaulting to now.
  const [termYear, setTermYear] = useState(getCurrentAcademicYear());

  // --- ARCHIVE STATE ---
  const [archiveDepartmentType, setArchiveDepartmentType] = useState<
    "executive" | "committee"
  >("executive");
  const [archiveFormData, setArchiveFormData] = useState({
    name: "",
    position: "",
    role: "",
    committeeName: "",
    termYear: getCurrentAcademicYear(),
  });
  const [archiveErrors, setArchiveErrors] = useState<ArchiveFormErrors>({
    name: false,
    position: false,
    termYear: false,
    committeeName: false,
  });
  const [archiveTerms, setArchiveTerms] = useState<OfficerTermRow[]>([]);
  const [archiveIsLoadingList, setArchiveIsLoadingList] = useState(true);
  const [archiveEditingId, setArchiveEditingId] = useState<string | null>(null);
  const [archiveIsEditingDraft, setArchiveIsEditingDraft] = useState(false);
  const [archivePreview, setArchivePreview] = useState<string | null>(null);
  const [archiveCover, setArchiveCover] = useState<File | null>(null);
  const archiveFileInputRef = useRef<HTMLInputElement | null>(null);
  const [archiveIsDragging, setArchiveIsDragging] = useState(false);
  const [archiveYearFilter, setArchiveYearFilter] = useState("all");
  const [archiveIsYearFilterOpen, setArchiveIsYearFilterOpen] = useState(false);
  useDropdownDismiss(archiveIsYearFilterOpen, () => setArchiveIsYearFilterOpen(false));
  const [archiveIsCommitteeDropdownOpen, setArchiveIsCommitteeDropdownOpen] =
    useState(false);
  const [archiveShowGlobalError, setArchiveShowGlobalError] = useState(false);
  const [archiveIsSubmitting, setArchiveIsSubmitting] = useState(false);
  const [archiveLoadingAction, setArchiveLoadingAction] = useState<
    "saving" | "publishing" | null
  >(null);
  const [archiveShowDeleteModal, setArchiveShowDeleteModal] = useState(false);
  const [archiveItemToDelete, setArchiveItemToDelete] = useState<string | null>(
    null,
  );
  const [archiveShowSuccessModal, setArchiveShowSuccessModal] = useState(false);
  const [archiveSuccessMessage, setArchiveSuccessMessage] = useState({
    title: "",
    description: "",
  });

  // Shared dropdown styles. Split into a non-scrolling outer wrapper (owns
  // the rounding/border/shadow) and a scrolling inner container, so the
  // scrollbar never pokes past the rounded corners.
  const dropdownOuterStyle =
    "absolute z-30 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden";
  const dropdownInnerStyle =
    "flex flex-col gap-1 p-2 max-h-56 overflow-y-auto themed-scrollbar";
  const dropdownItemStyle =
    "flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-colors font-rubik text-sm font-medium";
  const dropdownItemSelectedStyle = "bg-primary1/5 text-primary1";
  const dropdownItemHoverStyle = "hover:bg-gray-50 text-gray-700";

  const currentDeptData = departments[activeTab];
  const displayedOfficers = officers.filter(
    (o) => o.departmentId === activeTab,
  );

  // --- FETCH DATA ---
  const fetchOfficers = async () => {
    setIsLoadingList(true);
    try {
      const data = await officerService.getOfficers();
      const mapped: Officer[] = [];

      data.forEach((o) => {
        // A student can independently hold a council seat, a committee seat,
        // or both at once — each becomes its own row here.
        const hasCouncil = !!o.councilPosition || o.role === "council-officer";
        const hasCommittee =
          !!o.committeeTitle ||
          !!o.committeeDepartment ||
          o.role === "committee-officer";
        const name = `${o.firstName} ${o.lastName}`;
        const image = o.profilePicture || "/content/faculty.png";

        const committeeSummary = [
          o.committeeTitle,
          shortDepartmentName(o.committeeDepartment || o.department),
        ]
          .filter(Boolean)
          .join(" · ");
        const councilYearLevel = o.councilYearLevel ?? o.yearLevel;
        const councilSummary =
          o.councilPosition === "Batch Representative" && councilYearLevel
            ? `${ordinalYear(councilYearLevel)} Batch Representative`
            : o.councilPosition || o.position || "";

        if (hasCouncil) {
          const councilPos = o.councilPosition || o.position || "";
          const councilYear = o.councilYearLevel ?? o.yearLevel;
          const role =
            councilPos === "Batch Representative" && councilYear
              ? ordinalYear(councilYear)
              : "";
          mapped.push({
            id: `${o._id}::council`,
            userId: o._id,
            assignmentType: "council",
            name,
            role,
            position: councilPos,
            image,
            departmentId: "executive",
            studentNumber: o.studentNumber,
            also: hasCommittee ? committeeSummary : undefined,
          });
        }

        if (hasCommittee) {
          mapped.push({
            id: `${o._id}::committee`,
            userId: o._id,
            assignmentType: "committee",
            name,
            role: o.committeeDepartment || o.department || "",
            position: o.committeeTitle || (hasCouncil ? "" : o.position) || "",
            image,
            departmentId: "committee",
            studentNumber: o.studentNumber,
            also: hasCouncil ? councilSummary : undefined,
          });
        }
      });

      setOfficers(mapped);
    } catch {
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  // --- HANDLERS ---
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setIsSearching(true);
      try {
        const results = await officerService.searchNonOfficers(
          query,
          activeTab === "executive" ? "council" : "committee",
        );
        setSearchResults(results);
      } catch {
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const selectUser = (user: IOfficer) => {
    setSelectedUser(user);
    setFormData((prev) => ({
      ...prev,
      name: `${user.firstName} ${user.lastName}`,
    }));
    setPreview(user.profilePicture || "/content/faculty.png");
    setSearchResults([]);
    setSearchQuery("");
  };

  const clearSelection = () => {
    setSelectedUser(null);
    setFormData((prev) => ({ ...prev, name: "" }));
    setPreview(null);
  };

  const handleEditClick = (officer: Officer) => {
    setError(null);
    setEditingId(officer.userId);
    setActiveTab(officer.departmentId);
    setFormData({
      name: officer.name,
      role: officer.role,
      position: officer.position,
      image: "",
    });
    setPreview(officer.image);
    setSelectedUser(null);
    setTermYear(getCurrentAcademicYear());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setError(null);
    setFormData({ name: "", role: "", position: "", image: "" });
    setPreview(null);
    setSelectedUser(null);
    setSearchQuery("");
    setTermYear(getCurrentAcademicYear());
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const confirmDelete = (officer: Officer) => {
    setItemToDelete({
      userId: officer.userId,
      assignmentType: officer.assignmentType,
    });
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await officerService.updateOfficer(itemToDelete.userId, {
        assignmentType: itemToDelete.assignmentType,
        remove: true,
      } as any);
      fetchOfficers();
      setShowDeleteModal(false);
      const wasEditing = editingId === itemToDelete.userId;
      setItemToDelete(null);
      setSuccessMessage({
        title: "Removed Successfully!",
        description:
          itemToDelete.assignmentType === "council"
            ? "The council seat has been removed."
            : "The committee seat has been removed.",
      });
      setShowSuccessModal(true);
      if (wasEditing) handleCancelEdit();
    } catch {
      setError("Failed to remove officer.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const validateLimits = (
    dept: string,
    pos: string,
    role: string,
    currentId: string | null,
  ): boolean => {
    const existing = officers.filter((o) => o.userId !== currentId);
    if (dept === "executive") {
      const executiveMembers = existing.filter(
        (o) => o.departmentId === "executive",
      );
      if (pos === "Batch Representative") {
        const count = executiveMembers.filter(
          (o) => o.position === pos && o.role === role,
        ).length;
        if (count >= 2) {
          setError(`Max 2 Batch Representatives allowed for ${role}.`);
          return false;
        }
      } else if (pos === "SSG Representative") {
        const count = executiveMembers.filter((o) => o.position === pos).length;
        if (count >= 2) {
          setError("Max 2 SSG Representatives allowed.");
          return false;
        }
      } else {
        const count = executiveMembers.filter((o) => o.position === pos).length;
        if (count >= 1) {
          setError(`The position of ${pos} is already filled.`);
          return false;
        }
      }
    } else if (dept === "committee") {
      const committeeMembers = existing.filter(
        (o) => o.departmentId === "committee" && o.role === role,
      );
      if (["Committee Head", "Assistant Head", "Secretary"].includes(pos)) {
        if (committeeMembers.some((o) => o.position === pos)) {
          setError(`'${role}' already has a ${pos}.`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    let finalRole = formData.role;
    if (
      activeTab === "executive" &&
      formData.position !== "Batch Representative"
    )
      finalRole = "";
    const targetId = editingId || selectedUser?._id;
    if (
      !validateLimits(activeTab, formData.position, finalRole, targetId || null)
    )
      return;
    if (!targetId) {
      setError("Please select a user to assign.");
      return;
    }
    setIsSubmitting(true);
    try {
      const updateData: any = {
        assignmentType: activeTab === "executive" ? "council" : "committee",
        position: formData.position,
        department: activeTab === "committee" ? formData.role : undefined,
        yearLevel:
          activeTab === "executive" &&
          formData.position === "Batch Representative"
            ? parseInt(formData.role)
            : undefined,
        termYear: termYear || getCurrentAcademicYear(),
      };
      if (formData.image && formData.image.startsWith("data:image")) {
        updateData.profilePicture = formData.image;
      }
      await officerService.updateOfficer(targetId, updateData as any);
      await fetchOfficers();
      setSuccessMessage({
        title: editingId ? "Updated Successfully!" : "Officer Added!",
        description: editingId
          ? "Officer details have been updated."
          : "Officer has been assigned successfully.",
      });
      setShowSuccessModal(true);
      handleCancelEdit();
    } catch {
      setError("Failed to save officer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- ARCHIVE HANDLERS ---
  const fetchTerms = async () => {
    setArchiveIsLoadingList(true);
    try {
      const response = await officerTermService.getAllOfficerTerms();
      const data = Array.isArray(response.data) ? response.data : [];
      setArchiveTerms(data);
    } catch {
    } finally {
      setArchiveIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const handleArchiveEditClick = (item: OfficerTermRow) => {
    setArchiveEditingId(item._id);
    setArchiveIsEditingDraft(!item.isActive);
    setArchiveDepartmentType(item.departmentType);
    setArchiveFormData({
      name: item.name,
      position: item.position,
      role: item.role || "",
      committeeName: item.committeeName || "",
      termYear: item.termYear,
    });
    setArchivePreview(item.image || null);
    setArchiveCover(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleArchiveCancelEdit = () => {
    setArchiveEditingId(null);
    setArchiveIsEditingDraft(false);
    setArchiveDepartmentType("executive");
    setArchiveFormData({
      name: "",
      position: "",
      role: "",
      committeeName: "",
      termYear: getCurrentAcademicYear(),
    });
    setArchivePreview(null);
    setArchiveCover(null);
    if (archiveFileInputRef.current) archiveFileInputRef.current.value = "";
  };

  const confirmArchiveDelete = (id: string) => {
    setArchiveItemToDelete(id);
    setArchiveShowDeleteModal(true);
  };

  const handleArchiveDelete = async () => {
    if (!archiveItemToDelete) return;
    try {
      await officerTermService.deleteOfficerTerm(archiveItemToDelete);
      setArchiveTerms((prev) =>
        prev.filter((t) => t._id !== archiveItemToDelete),
      );
      setArchiveShowDeleteModal(false);
      setArchiveItemToDelete(null);
      setArchiveSuccessMessage({
        title: "Deleted Successfully!",
        description: "The archive entry has been permanently removed.",
      });
      setArchiveShowSuccessModal(true);
    } catch {
      alert("Failed to delete archive entry");
    }
  };

  const validateArchive = () => {
    const newErrors = {
      name: !archiveFormData.name.trim(),
      position: !archiveFormData.position.trim(),
      termYear: !/^\d{4}-\d{4}$/.test(archiveFormData.termYear.trim()),
      committeeName:
        archiveDepartmentType === "committee" && !archiveFormData.committeeName,
    };
    setArchiveErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const buildArchiveData = (isActive: boolean): OfficerTermData => ({
    name: archiveFormData.name,
    position: archiveFormData.position,
    role: archiveFormData.role || undefined,
    departmentType: archiveDepartmentType,
    committeeName:
      archiveDepartmentType === "committee"
        ? archiveFormData.committeeName
        : undefined,
    termYear: archiveFormData.termYear,
    image: archiveCover || undefined,
    isActive,
  });

  const handleArchivePublish = async () => {
    if (!validateArchive()) {
      setArchiveShowGlobalError(true);
      return;
    }
    setArchiveShowGlobalError(false);
    setArchiveIsSubmitting(true);
    setArchiveLoadingAction("publishing");
    try {
      const data = buildArchiveData(true);
      if (archiveEditingId) {
        await officerTermService.updateOfficerTerm(archiveEditingId, data);
      } else {
        await officerTermService.createOfficerTerm(data);
      }
      setArchiveSuccessMessage({
        title:
          archiveEditingId && !archiveIsEditingDraft
            ? "Updated Successfully!"
            : "Published Successfully!",
        description:
          archiveEditingId && !archiveIsEditingDraft
            ? "Changes have been saved."
            : "Archive entry is now live.",
      });
      setArchiveShowSuccessModal(true);
      handleArchiveCancelEdit();
      fetchTerms();
    } catch {
      alert("Failed to save archive entry");
    } finally {
      setArchiveIsSubmitting(false);
      setArchiveLoadingAction(null);
    }
  };

  const handleArchiveSaveDraft = async () => {
    setArchiveIsSubmitting(true);
    setArchiveLoadingAction("saving");
    setArchiveShowGlobalError(false);
    if (!archiveFormData.name.trim()) {
      setArchiveErrors((p) => ({ ...p, name: true }));
      setArchiveShowGlobalError(true);
      setArchiveIsSubmitting(false);
      setArchiveLoadingAction(null);
      return;
    }
    try {
      const data = {
        ...buildArchiveData(false),
        position: archiveFormData.position || "TBA",
        termYear: archiveFormData.termYear || getCurrentAcademicYear(),
      };
      if (archiveEditingId) {
        await officerTermService.updateOfficerTerm(archiveEditingId, data);
      } else {
        await officerTermService.createOfficerTerm(data);
      }
      setArchiveSuccessMessage({
        title: archiveEditingId ? "Draft Updated!" : "Draft Saved!",
        description: archiveEditingId
          ? "Draft changes have been saved."
          : "Draft has been saved successfully.",
      });
      setArchiveShowSuccessModal(true);
      handleArchiveCancelEdit();
      fetchTerms();
    } catch {
      alert("Failed to save draft");
    } finally {
      setArchiveIsSubmitting(false);
      setArchiveLoadingAction(null);
    }
  };

  const handleArchiveInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setArchiveFormData((prev) => ({ ...prev, [name]: value }));
    if (archiveErrors[name as keyof ArchiveFormErrors])
      setArchiveErrors((prev) => ({ ...prev, [name]: false }));
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

  const handleArchiveCoverChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      alert(`Image must be ${MAX_IMAGE_SIZE_MB}MB or smaller.`);
      if (archiveFileInputRef.current) archiveFileInputRef.current.value = "";
      return;
    }
    try {
      const resized = await resizeImage(file);
      setArchiveCover(resized);
      setArchivePreview(URL.createObjectURL(resized));
      if (archiveFileInputRef.current) archiveFileInputRef.current.value = "";
    } catch {
    }
  };

  const handleArchiveDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setArchiveIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      alert(`Image must be ${MAX_IMAGE_SIZE_MB}MB or smaller.`);
      return;
    }
    try {
      const resized = await resizeImage(file);
      setArchiveCover(resized);
      setArchivePreview(URL.createObjectURL(resized));
    } catch {
    }
  };

  const archivePublishedItems = archiveTerms.filter((item) => item.isActive);
  const archiveYears = Array.from(
    new Set(archivePublishedItems.map((t) => t.termYear)),
  ).sort((a, b) => b.localeCompare(a));
  const archiveFilteredItems =
    archiveYearFilter === "all"
      ? archivePublishedItems
      : archivePublishedItems.filter((t) => t.termYear === archiveYearFilter);

  const archiveInputCls =
    "w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all placeholder-gray-400 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10";

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#004e89]">
      {/* Loading Overlay */}
      {(isSubmitting || archiveIsSubmitting) && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/90 backdrop-blur-md">
          <div className="flex flex-col items-center gap-5">
            <LoadingIndicator />
            <div className="text-center">
              <p className="text-primary3 font-bold font-rubik text-lg">
                {isSubmitting
                  ? editingId
                    ? "Updating Officer"
                    : "Assigning Officer"
                  : archiveLoadingAction === "saving"
                    ? "Saving Draft"
                    : archiveEditingId
                      ? "Updating Entry"
                      : "Publishing Entry"}
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

          <div className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-40 sm:pt-48 pb-20">
            {/* ── PAGE HEADER ── */}
            <div className="mb-10 text-left">
              <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
                {pageView === "manage"
                  ? editingId
                    ? "Edit Officer"
                    : "Manage Officers"
                  : archiveEditingId
                    ? "Edit Archive Entry"
                    : "Officers Archive"}
              </h1>
              <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl">
                {pageView === "manage"
                  ? editingId
                    ? "Update officer details and save changes for the leadership team."
                    : "Assign and organize the chapter leadership team."
                  : `Log past officers per academic year for the About page's "Our Student Leaders" history.`}
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-stretch lg:items-start">
              <aside className="w-full lg:w-64 shrink-0">
                <Sidebar />
              </aside>

              {/* Main Content */}
              <div className="flex-1 min-w-0 space-y-8">
                {/* ── VIEW SWITCHER ── */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    {
                      id: "manage" as const,
                      label: "Manage Officers",
                      icon: UserCog,
                      count: officers.length,
                    },
                    {
                      id: "archive" as const,
                      label: "Officers Archive",
                      icon: Archive,
                      count: archiveTerms.length,
                    },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = pageView === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setPageView(tab.id)}
                        className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold font-rubik border-2 transition-all duration-200 select-none flex items-center gap-2 cursor-pointer ${
                          isActive
                            ? "border-primary1 bg-primary1/10 text-primary1 shadow-sm"
                            : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        }`}
                      >
                        <Icon
                          size={14}
                          className={
                            isActive ? "text-primary1" : "text-gray-400"
                          }
                        />
                        <span>{tab.label}</span>
                        <span
                          className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none ${
                            isActive
                              ? "bg-primary1 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {pageView === "manage" ? (
                  <>
                    {/* ── FORM CARD ── */}
                    <div
                      className={`bg-white rounded-4xl border transition-all duration-300 shadow-lg p-6 sm:p-10 lg:p-12 hover:shadow-primary1/40 hover:-translate-y-2 ${
                        editingId
                          ? "border-primary1 ring-2 ring-primary1/20"
                          : "border-gray-200"
                      }`}
                    >
                      {/* Edit Banner */}
                      {editingId && (
                        <div className="-mx-6 sm:-mx-10 lg:-mx-12 -mt-6 sm:-mt-10 lg:-mt-12 mb-8 bg-linear-to-r from-primary1 to-primary3 px-6 sm:px-10 py-5 flex items-center justify-between rounded-t-4xl">
                          <div className="flex items-center gap-2 text-white">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            <span className="text-sm font-bold font-rubik tracking-wide">
                              EDITING MODE
                            </span>
                          </div>
                          <button
                            onClick={handleCancelEdit}
                            className="text-white/80 hover:text-white text-sm font-bold font-raleway underline underline-offset-2 transition-colors cursor-pointer"
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

                          <div
                            className={`hidden sm:flex items-center gap-1.5 rounded-full px-4 py-2 ${currentDeptData.bg}`}
                          >
                            <User className="w-4 h-4 text-primary2" />
                            <span
                              className={`text-xs font-bold font-rubik uppercase tracking-wider ${currentDeptData.color}`}
                            >
                              {currentDeptData.subtitle}
                            </span>
                          </div>
                        </div>

                        {/* Active Dept Badge */}
                      </div>

                      {/* Department Selector */}
                      <div className="my-5 space-y-3">
                        <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                          Department <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {Object.keys(departments).map((key) => {
                            const dept = departments[key];
                            const isActive = activeTab === key;
                            const Icon = dept.icon;
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => {
                                  setActiveTab(key);
                                  setError(null);
                                  setFormData((prev) => ({
                                    ...prev,
                                    role: "",
                                    position: "",
                                  }));
                                  setSelectedUser(null);
                                  setSearchQuery("");
                                }}
                                className={`
                                relative flex items-center gap-3 rounded-xl px-5 py-4 text-left font-rubik font-bold text-sm border-2
                                transition-all duration-200 cursor-pointer
                                ${
                                  isActive
                                    ? `${dept.bg} ${dept.color} ${dept.border} shadow-sm scale-[1.02]`
                                    : "bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600"
                                }
                              `}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                                    isActive ? dept.dot : "bg-gray-200"
                                  }`}
                                />
                                <div>
                                  <p className="leading-tight">{dept.title}</p>
                                  <p
                                    className={`text-[14px] font-raleway font-semibold mt-0.5 truncate ${isActive ? "opacity-90" : "text-gray-300"}`}
                                  >
                                    {dept.subtitle}
                                  </p>
                                </div>
                                {isActive && (
                                  <ChevronRight
                                    size={12}
                                    className="ml-auto opacity-50"
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Error Alert */}
                      {error && (
                        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-100">
                          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold font-rubik">
                              Action Required
                            </p>
                            <p className="text-sm font-raleway">{error}</p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* LEFT — Photo */}
                        <div className="space-y-3">
                          <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                            Officer Photo
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                          />

                          {preview ? (
                            <div
                              className="relative group rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50 h-56 cursor-pointer"
                              onClick={() => fileInputRef.current?.click()}
                              title="Click to change photo"
                            >
                              <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                  }}
                                  className="bg-white text-primary3 text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform font-rubik cursor-pointer"
                                >
                                  Replace
                                </button>
                                {!editingId && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      clearSelection();
                                    }}
                                    className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform font-rubik cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => fileInputRef.current?.click()}
                              className="cursor-pointer h-56 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/80 hover:border-primary2/60 hover:bg-primary2/3 transition-all duration-300 flex flex-col items-center justify-center gap-4"
                            >
                              <div className="w-14 h-14 rounded-2xl bg-white text-primary2 shadow-md flex items-center justify-center">
                                <ImageIcon size={22} strokeWidth={2.5} />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-bold text-gray-700 font-rubik">
                                  {selectedUser
                                    ? "Upload photo"
                                    : "No photo available"}
                                </p>
                                <p className="text-xs text-gray-400 mt-1 font-raleway">
                                  {selectedUser
                                    ? "Click to upload a photo"
                                    : "Select a student first"}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* RIGHT — Fields */}
                        <div className="space-y-6">
                          {/* Full Name / Search */}
                          <div className="space-y-2">
                            <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                              Full Name <span className="text-red-500">*</span>
                            </label>

                            {editingId ? (
                              <input
                                type="text"
                                disabled
                                value={formData.name}
                                className="w-full font-rubik text-base bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 text-gray-500 cursor-not-allowed"
                              />
                            ) : selectedUser ? (
                              <div className="flex items-center justify-between w-full font-rubik text-base bg-primary1/10 border-2 border-primary1/30 rounded-2xl px-4 py-3 text-primary3">
                                <span>{formData.name}</span>
                                <button
                                  type="button"
                                  onClick={clearSelection}
                                  className="text-primary3 hover:text-red-500 cursor-pointer"
                                >
                                  <X size={18} />
                                </button>
                              </div>
                            ) : (
                              <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                  <Search size={18} />
                                </div>
                                <input
                                  type="text"
                                  value={searchQuery}
                                  onChange={(e) => handleSearch(e.target.value)}
                                  placeholder="Search for a student..."
                                  className="w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3 outline-none transition-all placeholder-gray-400 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10"
                                />
                                {searchResults.length > 0 && (
                                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                    <div className="max-h-60 overflow-y-auto themed-scrollbar">
                                      {searchResults.map((user) => (
                                        <button
                                          key={user._id}
                                          type="button"
                                          onClick={() => selectUser(user)}
                                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-0 cursor-pointer"
                                        >
                                          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                            {user.profilePicture ? (
                                              <img
                                                src={user.profilePicture}
                                                alt=""
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center font-raleway text-gray-500 text-xs">
                                                {user.firstName[0]}
                                              </div>
                                            )}
                                          </div>
                                          <div>
                                            <p className="font-raleway font-semibold text-gray-800 text-sm">
                                              {user.firstName} {user.lastName}
                                            </p>
                                            <p className="font-raleway text-xs text-gray-500">
                                              {user.studentNumber}
                                            </p>
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {isSearching && (
                                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <LoadingIndicator size="sm" />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Executive Fields */}
                          {activeTab === "executive" ? (
                            <>
                              {/* Position Dropdown */}
                              <div className="space-y-2">
                                <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                                  Position{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <div data-dropdown className="relative">
                                  <div
                                    className={`w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 cursor-pointer flex items-center justify-between text-gray-700 transition-all hover:bg-gray-100 ${
                                      activeDropdown === "position"
                                        ? "bg-white border-primary1 ring-4 ring-primary1/10"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      setActiveDropdown(
                                        activeDropdown === "position"
                                          ? null
                                          : "position",
                                      )
                                    }
                                  >
                                    <span className="font-rubik text-base">
                                      {formData.position || (
                                        <span className="text-gray-400">
                                          Select Position
                                        </span>
                                      )}
                                    </span>
                                    <ChevronDown
                                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                                        activeDropdown === "position"
                                          ? "rotate-180"
                                          : ""
                                      }`}
                                    />
                                  </div>
                                  {activeDropdown === "position" && (
                                    <>
                                      <div className={dropdownOuterStyle}>
                                        <div className={dropdownInnerStyle}>
                                          {EXECUTIVE_POSITIONS.map((pos) => (
                                            <div
                                              key={pos}
                                              className={`${dropdownItemStyle} ${
                                                formData.position === pos
                                                  ? dropdownItemSelectedStyle
                                                  : dropdownItemHoverStyle
                                              }`}
                                              onClick={() => {
                                                setFormData({
                                                  ...formData,
                                                  position: pos,
                                                  role:
                                                    pos ===
                                                    "Batch Representative"
                                                      ? formData.role
                                                      : "",
                                                });
                                                setActiveDropdown(null);
                                              }}
                                            >
                                              <span>{pos}</span>
                                              {formData.position === pos && (
                                                <Check className="w-4 h-4 text-primary1" />
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Year Level Dropdown — only for Batch Representative */}
                              {formData.position === "Batch Representative" && (
                                <div className="space-y-2">
                                  <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                                    Year Level{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <div data-dropdown className="relative">
                                    <div
                                      className={`w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 cursor-pointer flex items-center justify-between text-gray-700 transition-all hover:bg-gray-100 ${
                                        activeDropdown === "yearLevel"
                                          ? "bg-white border-primary1 ring-4 ring-primary1/10"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        setActiveDropdown(
                                          activeDropdown === "yearLevel"
                                            ? null
                                            : "yearLevel",
                                        )
                                      }
                                    >
                                      <span className="font-rubik text-base">
                                        {formData.role || (
                                          <span className="text-gray-400">
                                            Select Year
                                          </span>
                                        )}
                                      </span>
                                      <ChevronDown
                                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                                          activeDropdown === "yearLevel"
                                            ? "rotate-180"
                                            : ""
                                        }`}
                                      />
                                    </div>
                                    {activeDropdown === "yearLevel" && (
                                      <>
                                        <div className={dropdownOuterStyle}>
                                          <div className={dropdownInnerStyle}>
                                            {YEAR_LEVELS.map((yr) => (
                                              <div
                                                key={yr}
                                                className={`${dropdownItemStyle} ${
                                                  formData.role === yr
                                                    ? dropdownItemSelectedStyle
                                                    : dropdownItemHoverStyle
                                                }`}
                                                onClick={() => {
                                                  setFormData({
                                                    ...formData,
                                                    role: yr,
                                                  });
                                                  setActiveDropdown(null);
                                                }}
                                              >
                                                <span>{yr}</span>
                                                {formData.role === yr && (
                                                  <Check className="w-4 h-4 text-primary1" />
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            /* Committee Fields */
                            <>
                              {/* Committee Name Dropdown */}
                              <div className="space-y-2">
                                <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                                  Committee Name{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <div data-dropdown className="relative">
                                  <div
                                    className={`w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 cursor-pointer flex items-center justify-between text-gray-700 transition-all hover:bg-gray-100 ${
                                      activeDropdown === "committee"
                                        ? "bg-white border-primary1 ring-4 ring-primary1/10"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      setActiveDropdown(
                                        activeDropdown === "committee"
                                          ? null
                                          : "committee",
                                      )
                                    }
                                  >
                                    <span className="font-rubik text-base truncate pr-2">
                                      {formData.role || (
                                        <span className="text-gray-400">
                                          Select Committee
                                        </span>
                                      )}
                                    </span>
                                    <ChevronDown
                                      className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                                        activeDropdown === "committee"
                                          ? "rotate-180"
                                          : ""
                                      }`}
                                    />
                                  </div>
                                  {activeDropdown === "committee" && (
                                    <>
                                      <div className={dropdownOuterStyle}>
                                        <div className={dropdownInnerStyle}>
                                          {COMMITTEES_LIST.map((comm) => (
                                            <div
                                              key={comm}
                                              className={`${dropdownItemStyle} ${
                                                formData.role === comm
                                                  ? dropdownItemSelectedStyle
                                                  : dropdownItemHoverStyle
                                              }`}
                                              onClick={() => {
                                                setFormData({
                                                  ...formData,
                                                  role: comm,
                                                });
                                                setActiveDropdown(null);
                                              }}
                                            >
                                              <span>{comm}</span>
                                              {formData.role === comm && (
                                                <Check className="w-4 h-4 text-primary1" />
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Specific Title Dropdown */}
                              <div className="space-y-2">
                                <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                                  Specific Title{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <div data-dropdown className="relative">
                                  <div
                                    className={`w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 cursor-pointer flex items-center justify-between text-gray-700 transition-all hover:bg-gray-100 ${
                                      activeDropdown === "title"
                                        ? "bg-white border-primary1 ring-4 ring-primary1/10"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      setActiveDropdown(
                                        activeDropdown === "title"
                                          ? null
                                          : "title",
                                      )
                                    }
                                  >
                                    <span className="font-rubik text-base">
                                      {formData.position || (
                                        <span className="text-gray-400">
                                          Select Role
                                        </span>
                                      )}
                                    </span>
                                    <ChevronDown
                                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                                        activeDropdown === "title"
                                          ? "rotate-180"
                                          : ""
                                      }`}
                                    />
                                  </div>
                                  {activeDropdown === "title" && (
                                    <>
                                      <div className={dropdownOuterStyle}>
                                        <div className={dropdownInnerStyle}>
                                          {COMMITTEE_ROLES.map((role) => (
                                            <div
                                              key={role}
                                              className={`${dropdownItemStyle} ${
                                                formData.position === role
                                                  ? dropdownItemSelectedStyle
                                                  : dropdownItemHoverStyle
                                              }`}
                                              onClick={() => {
                                                setFormData({
                                                  ...formData,
                                                  position: role,
                                                });
                                                setActiveDropdown(null);
                                              }}
                                            >
                                              <span>{role}</span>
                                              {formData.position === role && (
                                                <Check className="w-4 h-4 text-primary1" />
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </>
                          )}

                          {/* Academic Year — which year this assignment is archived under.
                              Admin only picks the starting calendar year; the
                              "YYYY-YYYY" range is derived automatically so a
                              typo like "2025-2026" for the actual 2026-2027
                              school year can't happen. */}
                          <div className="space-y-2">
                            <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                              Academic Year{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={termYear.split("-")[0] || ""}
                              onChange={(e) => {
                                const start = parseInt(e.target.value, 10);
                                setTermYear(
                                  isNaN(start) ? "" : `${start}-${start + 1}`,
                                );
                              }}
                              placeholder="e.g., 2026"
                              className="w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all placeholder-gray-400 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10"
                            />
                            <p className="text-xs text-gray-400 font-raleway ml-1">
                              Auto-logged to the Officers Archive as A.Y.{" "}
                              {termYear || "—"}.
                            </p>
                          </div>
                        </div>
                        {/* Actions */}
                      </div>
                      <div className="mt-10 flex flex-wrap justify-end gap-4">
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
                          <Button
                            variant="hero"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-5 py-2 sm:px-8 sm:py-3"
                          >
                            {editingId ? "Update Officer" : "Add Officer"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* ── MANAGE LIST ── */}
                    <div className="bg-white rounded-4xl border transition-all duration-300 shadow-md hover:shadow-primary1/40 hover:-translate-y-2 border-gray-200 overflow-hidden">
                      {/* List Header */}
                      <div className="px-6 sm:px-8 py-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                        <div>
                          <h2 className="text-xl font-bold font-rubik text-primary3">
                            {currentDeptData.title} List
                          </h2>
                          <p className="text-gray-400 text-xs font-raleway mt-0.5 tracking-wide">
                            {displayedOfficers.length}{" "}
                            {displayedOfficers.length === 1
                              ? "member"
                              : "members"}{" "}
                            in this department
                          </p>
                        </div>
                        <button
                          onClick={fetchOfficers}
                          className="flex items-center gap-2 text-xs font-bold font-rubik text-primary1 border border-primary1/20 hover:border-primary1/50 hover:bg-primary1/5 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer"
                        >
                          <RefreshCw
                            size={13}
                            className={isLoadingList ? "animate-spin" : ""}
                          />
                          Refresh
                        </button>
                      </div>

                      {/* Dept Legend */}
                      <div className="px-6 sm:px-8 py-3 border-b border-gray-50 flex flex-wrap gap-3">
                        {Object.keys(departments).map((key) => {
                          const dept = departments[key];
                          const count = officers.filter(
                            (o) => o.departmentId === key,
                          ).length;
                          return (
                            <button
                              key={key}
                              onClick={() => setActiveTab(key)}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold font-rubik transition-all cursor-pointer ${
                                activeTab === key
                                  ? `${dept.bg} ${dept.color} ${dept.border}`
                                  : "bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-300"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  activeTab === key ? dept.dot : "bg-gray-300"
                                }`}
                              />
                              {dept.subtitle}
                              <span className="opacity-50">·</span>
                              <span className="opacity-70">{count}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Table */}
                      {isLoadingList ? (
                        <LoadingIndicator label="Loading officers..." className="py-16" />
                      ) : displayedOfficers.length === 0 ? (
                        <div className="py-20 flex flex-col items-center gap-4 text-gray-300">
                          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                            <Users size={24} className="text-gray-300" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold font-rubik text-gray-400">
                              No officers yet
                            </p>
                            <p className="text-xs font-raleway mt-0.5">
                              Assign one using the form above
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
                                {activeTab === "committee" && (
                                  <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                                    Committee
                                  </th>
                                )}
                                <th className="px-6 sm:px-8 py-3.5 text-right text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {displayedOfficers.map((officer) => {
                                const dept = departments[officer.departmentId];
                                const isEditing = editingId === officer.id;
                                return (
                                  <tr
                                    key={officer.id}
                                    className={`group border-t border-gray-50 transition-all duration-200 ${
                                      isEditing
                                        ? "bg-primary1/5"
                                        : "hover:bg-gray-50/70"
                                    }`}
                                  >
                                    {/* Photo */}
                                    <td data-label="Photo" data-primary="media" className="px-6 sm:px-8 py-4">
                                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                                        <img
                                          src={officer.image}
                                          alt={officer.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    </td>

                                    {/* Name */}
                                    <td data-label="Name" data-primary="" className="px-4 py-4">
                                      <div className="flex items-center gap-2">
                                        {isEditing && (
                                          <span className="w-1.5 h-1.5 rounded-full bg-primary1 animate-pulse shrink-0" />
                                        )}
                                        <span className="font-bold text-sm text-gray-800 font-rubik">
                                          {officer.name}
                                        </span>
                                      </div>
                                      {officer.studentNumber && (
                                        <p className="text-xs text-gray-400 font-raleway mt-0.5">
                                          {officer.studentNumber}
                                        </p>
                                      )}
                                    </td>

                                    {/* Position */}
                                    <td data-label="Position" className="px-4 py-4">
                                      <div className="flex flex-col items-start gap-1.5">
                                      {officer.position ? (
                                        <span
                                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-raleway font-semibold border ${dept.bg} ${dept.color} ${dept.border}`}
                                        >
                                          <span
                                            className={`w-1.5 h-1.5 rounded-full ${dept.dot}`}
                                          />
                                          {officer.position ===
                                          "Batch Representative"
                                            ? `${officer.role} Batch Rep`
                                            : officer.position}
                                        </span>
                                      ) : (
                                        <span
                                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-raleway font-semibold border bg-amber-50 text-amber-700 border-amber-200"
                                          title="This officer hasn't been assigned a position yet — click Edit to set one."
                                        >
                                          <AlertCircle size={11} />
                                          No Position Set
                                        </span>
                                      )}
                                      {officer.also && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-raleway font-semibold border bg-gray-50 text-gray-600 border-gray-200">
                                          <span aria-hidden>+</span>
                                          {officer.also}
                                        </span>
                                      )}
                                      </div>
                                    </td>

                                    {/* Committee (conditional) */}
                                    {activeTab === "committee" && (
                                      <td data-label="Committee" className="px-4 py-4">
                                        <span className="text-xs text-gray-500 font-raleway">
                                          {shortDepartmentName(officer.role)}
                                        </span>
                                      </td>
                                    )}

                                    {/* Actions */}
                                    <td data-label="Actions" className="px-6 sm:px-8 py-4 text-right">
                                      <div className="inline-flex items-center gap-1 opacity-100 lg:opacity-40 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 transition-opacity">
                                        <button
                                          onClick={() =>
                                            handleEditClick(officer)
                                          }
                                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-raleway font-semibold whitespace-nowrap text-gray-400 hover:text-primary1 hover:bg-primary1/10 rounded-lg transition-all duration-150 cursor-pointer"
                                          title="Edit"
                                        >
                                          <Pencil size={15} />
                                        Edit
                                        </button>
                                        <button
                                          onClick={() => confirmDelete(officer)}
                                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-raleway font-semibold whitespace-nowrap text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150 cursor-pointer"
                                          title="Remove"
                                        >
                                          <Trash2 size={15} />
                                        Remove
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
                  </>
                ) : (
                  <>
                    {/* ── ARCHIVE FORM CARD ── */}
                    <div
                      className={`bg-white rounded-4xl border transition-all duration-300 shadow-lg p-6 sm:p-10 lg:p-12 hover:shadow-primary1/40 hover:-translate-y-2 ${
                        archiveEditingId
                          ? "border-primary1 ring-2 ring-primary1/20"
                          : "border-gray-200"
                      }`}
                    >
                      {archiveEditingId && (
                        <div className="-mx-6 sm:-mx-10 lg:-mx-12 -mt-6 sm:-mt-10 lg:-mt-12 mb-8 bg-linear-to-r from-primary1 to-primary3 px-6 sm:px-10 py-5 flex items-center justify-between rounded-t-4xl">
                          <div className="flex items-center gap-2 text-white">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            <span className="text-sm font-bold font-rubik tracking-wide">
                              EDITING MODE
                            </span>
                          </div>
                          <button
                            onClick={handleArchiveCancelEdit}
                            className="text-white/80 hover:text-white text-sm font-bold font-raleway underline underline-offset-2 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-8">
                        <p className="text-gray-400 text-sm font-raleway">
                          Fill in the fields below
                        </p>
                        <div className="hidden sm:flex items-center gap-1.5 bg-primary2/8 rounded-full px-4 py-2">
                          <Archive size={12} className="text-primary2" />
                          <span className="text-xs font-bold text-primary2 font-rubik uppercase tracking-wider">
                            Archive Entry
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* LEFT — Upload */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
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
                            onChange={handleArchiveCoverChange}
                            ref={archiveFileInputRef}
                          />

                          {archivePreview ? (
                            <div className="relative group rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50 h-56">
                              <img
                                src={archivePreview}
                                alt="officer preview"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={() =>
                                    archiveFileInputRef.current?.click()
                                  }
                                  className="bg-white text-primary3 text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform font-rubik cursor-pointer"
                                >
                                  Replace
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    try {
                                      if (archivePreview)
                                        URL.revokeObjectURL(archivePreview);
                                    } catch {}
                                    setArchiveCover(null);
                                    setArchivePreview(null);
                                  }}
                                  className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform font-rubik cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() =>
                                archiveFileInputRef.current?.click()
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ")
                                  archiveFileInputRef.current?.click();
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setArchiveIsDragging(true);
                              }}
                              onDragLeave={() => setArchiveIsDragging(false)}
                              onDrop={handleArchiveDrop}
                              className={`cursor-pointer h-56 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
                                archiveIsDragging
                                  ? "border-primary2 bg-primary2/5 scale-[1.01]"
                                  : "border-gray-200 bg-gray-50/80 hover:border-primary2/60 hover:bg-primary2/3"
                              }`}
                            >
                              <div
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                                  archiveIsDragging
                                    ? "bg-primary2 text-white"
                                    : "bg-white text-primary2 shadow-md"
                                }`}
                              >
                                <Upload size={22} strokeWidth={2.5} />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-bold text-gray-700 font-rubik">
                                  {archiveIsDragging
                                    ? "Drop it!"
                                    : "Upload photo"}
                                </p>
                                <p className="text-xs text-gray-400 mt-1 font-raleway">
                                  Drag & drop or click · PNG, JPG
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* RIGHT — Info */}
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                              Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              name="name"
                              value={archiveFormData.name}
                              onChange={handleArchiveInputChange}
                              placeholder="e.g., Dela Cruz, Juan"
                              className={`${archiveInputCls} ${archiveErrors.name ? "border-red-300 ring-2 ring-red-100" : ""}`}
                            />
                            {archiveErrors.name && (
                              <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                                <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                                Name is required
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                              Department Type{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {(["executive", "committee"] as const).map(
                                (t) => (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => setArchiveDepartmentType(t)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold font-rubik border-2 transition-all duration-200 cursor-pointer ${
                                      archiveDepartmentType === t
                                        ? "border-primary1 text-primary1 bg-primary1/10"
                                        : "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 bg-transparent"
                                    }`}
                                  >
                                    {t === "executive"
                                      ? "Executive Council"
                                      : "Committee"}
                                  </button>
                                ),
                              )}
                            </div>
                          </div>

                          {archiveDepartmentType === "committee" && (
                            <div className="space-y-2">
                              <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                                Committee{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <div
                                  onClick={() =>
                                    setArchiveIsCommitteeDropdownOpen((p) => !p)
                                  }
                                  className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border bg-gray-50 px-4 py-3 font-rubik text-base text-gray-700 transition-all hover:bg-gray-100 ${
                                    archiveErrors.committeeName
                                      ? "border-red-300 ring-2 ring-red-100"
                                      : "border-gray-200"
                                  } ${
                                    archiveIsCommitteeDropdownOpen
                                      ? "bg-white border-primary1 ring-4 ring-primary1/10"
                                      : ""
                                  }`}
                                >
                                  <span
                                    className={
                                      archiveFormData.committeeName
                                        ? "text-gray-800"
                                        : "text-gray-400 font-normal"
                                    }
                                  >
                                    {archiveFormData.committeeName ||
                                      "Select committee"}
                                  </span>
                                  <ChevronDown
                                    className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${
                                      archiveIsCommitteeDropdownOpen
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                </div>
                                {archiveIsCommitteeDropdownOpen && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-10"
                                      onClick={() =>
                                        setArchiveIsCommitteeDropdownOpen(false)
                                      }
                                    />
                                    <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                                      <div className="flex max-h-56 flex-col gap-1 overflow-y-auto p-2 themed-scrollbar">
                                        {COMMITTEES_LIST.map((c) => (
                                          <div
                                            key={c}
                                            onClick={() => {
                                              setArchiveFormData((prev) => ({
                                                ...prev,
                                                committeeName: c,
                                              }));
                                              setArchiveErrors((prev) => ({
                                                ...prev,
                                                committeeName: false,
                                              }));
                                              setArchiveIsCommitteeDropdownOpen(
                                                false,
                                              );
                                            }}
                                            className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 font-rubik text-sm transition-colors ${
                                              archiveFormData.committeeName ===
                                              c
                                                ? "bg-primary1/5 text-primary1"
                                                : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                          >
                                            <span>{c}</span>
                                            {archiveFormData.committeeName ===
                                              c && (
                                              <Check className="h-4 w-4 text-primary1" />
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                              {archiveErrors.committeeName && (
                                <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                                  Committee is required
                                </p>
                              )}
                            </div>
                          )}

                          <div className="space-y-2">
                            <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                              Position <span className="text-red-500">*</span>
                            </label>
                            <input
                              name="position"
                              value={archiveFormData.position}
                              onChange={handleArchiveInputChange}
                              placeholder={
                                archiveDepartmentType === "executive"
                                  ? "e.g., President"
                                  : "e.g., Committee Head"
                              }
                              className={`${archiveInputCls} ${archiveErrors.position ? "border-red-300 ring-2 ring-red-100" : ""}`}
                            />
                            {archiveErrors.position && (
                              <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                                <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                                Position is required
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                              Sub-label
                            </label>
                            <input
                              name="role"
                              value={archiveFormData.role}
                              onChange={handleArchiveInputChange}
                              placeholder="e.g., Batch Representative"
                              className={archiveInputCls}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                              Academic Year{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={
                                archiveFormData.termYear.split("-")[0] || ""
                              }
                              onChange={(e) => {
                                const start = parseInt(e.target.value, 10);
                                setArchiveFormData((prev) => ({
                                  ...prev,
                                  termYear: isNaN(start)
                                    ? ""
                                    : `${start}-${start + 1}`,
                                }));
                                if (archiveErrors.termYear)
                                  setArchiveErrors((prev) => ({
                                    ...prev,
                                    termYear: false,
                                  }));
                              }}
                              placeholder="e.g., 2026"
                              className={`${archiveInputCls} ${archiveErrors.termYear ? "border-red-300 ring-2 ring-red-100" : ""}`}
                            />
                            <p className="text-xs text-gray-400 font-raleway ml-1">
                              Enter just the starting year — shown as A.Y.{" "}
                              {archiveFormData.termYear || "—"}.
                            </p>
                            {archiveErrors.termYear && (
                              <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                                <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                                A starting year is required
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                        {archiveShowGlobalError && (
                          <p className="text-red-400 text-xs font-bold font-raleway flex items-center gap-1.5">
                            <AlertTriangle size={12} /> Please fill all required
                            fields
                          </p>
                        )}

                        <div className="flex flex-wrap gap-3 ml-auto">
                          {archiveEditingId && (
                            <Button
                              type="button"
                              variant="heroOutline"
                              onClick={handleArchiveCancelEdit}
                              className="px-4 py-2 sm:px-6 sm:py-3"
                            >
                              Cancel
                            </Button>
                          )}

                          {(!archiveEditingId || archiveIsEditingDraft) && (
                            <Button
                              type="button"
                              variant="heroOutline"
                              onClick={handleArchiveSaveDraft}
                              disabled={archiveIsSubmitting}
                              className="px-4 py-2 sm:px-6 sm:py-3"
                            >
                              {archiveEditingId ? "Update Draft" : "Save Draft"}
                            </Button>
                          )}

                          <Button
                            type="button"
                            variant="hero"
                            onClick={handleArchivePublish}
                            disabled={archiveIsSubmitting}
                            className="px-5 py-2 sm:px-8 sm:py-3"
                          >
                            {archiveEditingId && !archiveIsEditingDraft
                              ? "Update Entry"
                              : "Publish Entry"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* ── ARCHIVE LIST ── */}
                    <div className="bg-white rounded-4xl border transition-all duration-300 shadow-md hover:shadow-primary1/40 hover:-translate-y-2 border-gray-200 overflow-hidden">
                      <div className="px-6 sm:px-8 py-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                        <div>
                          <h2 className="text-xl font-bold font-rubik text-primary3">
                            Published Archive
                          </h2>
                          <p className="text-gray-400 text-xs font-raleway mt-0.5 tracking-wide">
                            {archiveFilteredItems.length} active{" "}
                            {archiveFilteredItems.length === 1
                              ? "entry"
                              : "entries"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {archiveYears.length > 0 && (
                            <div data-dropdown className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setArchiveIsYearFilterOpen((prev) => !prev)
                                }
                                className={`flex items-center gap-1.5 text-xs font-bold font-rubik border px-3 py-2 rounded-full transition-all duration-200 cursor-pointer bg-white ${
                                  archiveIsYearFilterOpen
                                    ? "border-primary1 text-primary1 ring-4 ring-primary1/10"
                                    : "text-primary1 border-primary1/20 hover:border-primary1/50"
                                }`}
                              >
                                <span>
                                  {archiveYearFilter === "all"
                                    ? "All years"
                                    : archiveYearFilter}
                                </span>
                                <ChevronDown
                                  size={13}
                                  className={`transition-transform duration-300 ${
                                    archiveIsYearFilterOpen ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                              {archiveIsYearFilterOpen && (
                                <>
                                  <div className="absolute z-30 top-full right-0 mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
                                    <div className="flex flex-col gap-1 p-2 max-h-56 overflow-y-auto themed-scrollbar">
                                      <div
                                        onClick={() => {
                                          setArchiveYearFilter("all");
                                          setArchiveIsYearFilterOpen(false);
                                        }}
                                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-colors font-rubik text-sm font-medium ${
                                          archiveYearFilter === "all"
                                            ? dropdownItemSelectedStyle
                                            : dropdownItemHoverStyle
                                        }`}
                                      >
                                        <span>All years</span>
                                        {archiveYearFilter === "all" && (
                                          <Check className="w-4 h-4 text-primary1" />
                                        )}
                                      </div>
                                      {archiveYears.map((y) => (
                                        <div
                                          key={y}
                                          onClick={() => {
                                            setArchiveYearFilter(y);
                                            setArchiveIsYearFilterOpen(false);
                                          }}
                                          className={`flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-colors font-rubik text-sm font-medium ${
                                            archiveYearFilter === y
                                              ? dropdownItemSelectedStyle
                                              : dropdownItemHoverStyle
                                          }`}
                                        >
                                          <span>{y}</span>
                                          {archiveYearFilter === y && (
                                            <Check className="w-4 h-4 text-primary1" />
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                          <button
                            onClick={fetchTerms}
                            className="flex items-center gap-2 text-xs font-bold font-rubik text-primary1 border border-primary1/20 hover:border-primary1/50 hover:bg-primary1/5 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer"
                          >
                            <RefreshCw
                              size={13}
                              className={
                                archiveIsLoadingList ? "animate-spin" : ""
                              }
                            />
                            Refresh
                          </button>
                        </div>
                      </div>

                      {archiveIsLoadingList ? (
                        <LoadingIndicator label="Loading archive..." className="py-16" />
                      ) : archiveFilteredItems.length === 0 ? (
                        <div className="py-20 flex flex-col items-center gap-4 text-gray-300">
                          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                            <ImageIcon size={24} className="text-gray-300" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold font-rubik text-gray-400">
                              No archive entries yet
                            </p>
                            <p className="text-xs font-raleway mt-0.5">
                              Create one using the form above
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="overflow-x-auto themed-scrollbar">
                          <table className="responsive-table w-full text-left min-w-170">
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
                                  Department
                                </th>
                                <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                                  Year
                                </th>
                                <th className="px-6 sm:px-8 py-3.5 text-right text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {archiveFilteredItems.map((item) => {
                                const isEditing = archiveEditingId === item._id;
                                return (
                                  <tr
                                    key={item._id}
                                    className={`group border-t border-gray-50 transition-all duration-200 ${isEditing ? "bg-primary1/5" : "hover:bg-gray-50/70"}`}
                                  >
                                    <td data-label="Photo" data-primary="media" className="px-6 sm:px-8 py-4">
                                      <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                                        {item.image ? (
                                          <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <Archive
                                            size={14}
                                            className="text-gray-300"
                                          />
                                        )}
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
                                        {item.role ? ` · ${item.role}` : ""}
                                      </span>
                                    </td>
                                    <td data-label="Department" className="px-4 py-4">
                                      <div className="flex flex-col items-start gap-1.5">
                                      <span
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-raleway font-semibold border ${
                                          item.departmentType === "executive"
                                            ? "bg-primary1/8 text-primary1 border-primary1/30"
                                            : "bg-primary2/8 text-primary2 border-primary2/30"
                                        }`}
                                      >
                                        {item.departmentType === "executive"
                                          ? "Executive"
                                          : shortDepartmentName(item.committeeName) ||
                                            "Committee"}
                                      </span>
                                      {otherAssignments(item, archiveTerms).map((label) => (
                                        <span
                                          key={label}
                                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-raleway font-semibold border bg-gray-50 text-gray-600 border-gray-200"
                                        >
                                          <span aria-hidden>+</span>
                                          {label}
                                        </span>
                                      ))}
                                      </div>
                                    </td>
                                    <td data-label="Year" className="px-4 py-4">
                                      <span className="text-xs text-gray-600 font-raleway">
                                        {item.termYear}
                                      </span>
                                    </td>
                                    <td data-label="Actions" className="px-6 sm:px-8 py-4 text-right">
                                      <div className="inline-flex items-center gap-1 opacity-100 lg:opacity-40 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 transition-opacity">
                                        <button
                                          onClick={() =>
                                            handleArchiveEditClick(item)
                                          }
                                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-raleway font-semibold whitespace-nowrap text-gray-400 hover:text-primary1 hover:bg-primary1/10 rounded-lg transition-all duration-150 cursor-pointer"
                                          title="Edit"
                                        >
                                          <Pencil size={15} />
                                        Edit
                                        </button>
                                        <button
                                          onClick={() =>
                                            confirmArchiveDelete(item._id)
                                          }
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="-mt-8.75 md:-mt-20 relative z-0">
        <Footer />
      </div>

      {/* ── DELETE MODAL ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-primary3 font-rubik mb-2">
              Remove Officer?
            </h3>
            <p className="text-gray-400 text-sm font-raleway mb-6 leading-relaxed">
              This will demote the officer back to student status. This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="heroOutline"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 sm:py-3"
              >
                Cancel
              </Button>
              <Button
                variant="heroDanger"
                onClick={handleDelete}
                className="flex-1 py-2 sm:py-3"
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUCCESS MODAL ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" />
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl relative">
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
              <h3 className="text-xl font-bold text-primary3 font-rubik">
                {successMessage.title}
              </h3>
              <p className="text-gray-400 text-sm font-raleway mt-2">
                {successMessage.description}
              </p>
            </div>
            <Button
              variant="hero"
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-2 text-sm sm:py-3"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* ── ARCHIVE DELETE MODAL ── */}
      {archiveShowDeleteModal && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setArchiveShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-primary3 font-rubik mb-2">
              Delete Entry?
            </h3>
            <p className="text-gray-400 text-sm font-raleway mb-6 leading-relaxed">
              This will permanently remove this archive entry. This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="heroOutline"
                onClick={() => setArchiveShowDeleteModal(false)}
                className="flex-1 py-2 sm:py-3"
              >
                Cancel
              </Button>
              <Button
                variant="heroDanger"
                onClick={handleArchiveDelete}
                className="flex-1 py-2 sm:py-3"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── ARCHIVE SUCCESS MODAL ── */}
      {archiveShowSuccessModal && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setArchiveShowSuccessModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" />
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl relative">
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
              <h3 className="text-xl font-bold text-primary3 font-rubik">
                {archiveSuccessMessage.title}
              </h3>
              <p className="text-gray-400 text-sm font-raleway mt-2">
                {archiveSuccessMessage.description}
              </p>
            </div>
            <Button
              variant="hero"
              onClick={() => setArchiveShowSuccessModal(false)}
              className="w-full py-2 text-sm sm:py-3"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
