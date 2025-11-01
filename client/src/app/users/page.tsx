"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { User } from "./utils/user";
import Header from "../components/header";
import Footer from "../components/footer";
import UsersTable from "./components/users_table";
import UserStats from "./components/stats";
import ExcelUploadModal from "./components/excel_upload_modal";
import AddUserModal, { NewUser } from "./components/add_user_modal";
import ConfirmDialog from "./components/confirm_dialog";
import ViewUserModal from "./components/view_user_modal";
import EditUserModal from "./components/edit_user_modal";
import Grid from "../components/grid";
import {
  ArrowLeft,
  UserPlus,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { LoadingScreen } from "../components/loading";

// Type definitions for API responses
interface ApiUser {
  _id: string;
  studentNumber: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  fullName: string;
  role: string;
  yearLevel?: number;
  membershipStatus: {
    isMember: boolean;
    membershipType: string | null;
  };
  profilePicture?: string;
  isActive: boolean;
  registeredBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface FailedUser {
  studentNumber: string;
  reason: string;
  data: Record<string, unknown>;
}

interface UploadUserData {
  studentNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  role: string;
  yearLevel?: number;
  membershipStatus?: string;
}

type SortField = "studentNumber" | "fullName" | "role" | "yearLevel" | "createdAt" | "updatedAt";
type SortDirection = "asc" | "desc";

// API Configuration - Production Ready
const getApiUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    console.log("🔗 API URL from env:", process.env.NEXT_PUBLIC_API_URL);
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;

    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      const productionApiUrl = "https://your-backend-url.com/api";
      console.log("🔗 Production API URL:", productionApiUrl);
      return productionApiUrl;
    }
  }

  console.log("🔗 Development API URL: http://localhost:5000/api");
  return "http://localhost:5000/api";
};

const API_BASE_URL = getApiUrl();
const USERS_PER_PAGE = 100;

// Helper functions
const validateRole = (
  role: string
): "faculty" | "council-officer" | "committee-officer" | "student" => {
  const roleMap: Record<
    string,
    "faculty" | "council-officer" | "committee-officer" | "student"
  > = {
    faculty: "faculty",
    "council-officer": "council-officer",
    "committee-officer": "committee-officer",
    student: "student",
    member: "student",
    "non-member": "student",
  };

  return roleMap[role] || "student";
};

const validateMembershipType = (
  membershipType: string | null
): "regional" | "local" | "both" | null => {
  if (membershipType === null) return null;

  const validTypes = ["regional", "local", "both"];
  if (validTypes.includes(membershipType.toLowerCase())) {
    return membershipType.toLowerCase() as "regional" | "local" | "both";
  }

  return null;
};

const parseMembershipStatus = (
  membershipStatus?: string
): { isMember: boolean; membershipType: string | null } => {
  if (!membershipStatus) {
    return { isMember: false, membershipType: null };
  }

  const statusLower = membershipStatus.toLowerCase().trim();

  if (
    statusLower === "local" ||
    statusLower === "regional" ||
    statusLower === "both"
  ) {
    return { isMember: true, membershipType: statusLower };
  }

  if (statusLower === "member") {
    return { isMember: true, membershipType: null };
  }

  return { isMember: false, membershipType: null };
};

const capitalizeWords = (str: string): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      if (typeof value === "string") {
        headers[key] = value;
      }
    });
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred");
  }

  return response.json();
};

export default function UsersListPage() {
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter and Sort state - MOVED FROM UsersTable
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterMembership, setFilterMembership] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  
  // 🔍 NEW: Search state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  // Upload progress state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    current: 0,
    successful: 0,
    failed: 0,
  });

  // Modal states
  const [uploadResult, setUploadResult] = useState({
    show: false,
    success: 0,
    failed: 0,
    failedUsers: [] as FailedUser[],
  });

  const [successModal, setSuccessModal] = useState({
    show: false,
    title: "",
    message: "",
  });

  const [errorModal, setErrorModal] = useState({
    show: false,
    title: "",
    message: "",
  });

  // Confirmation Dialogs
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);

  // View and Edit Modals
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Get filtered users with search
  const getFilteredUsers = () => {
    return allUsers.filter((user) => {
      // Role filter
      const roleMatch = filterRole === "all" || user.role === filterRole;
      
      // Membership filter
      const membershipMatch =
        filterMembership === "all" ||
        (filterMembership === "local" &&
          user.membershipStatus.membershipType === "local") ||
        (filterMembership === "regional" &&
          user.membershipStatus.membershipType === "regional") ||
        (filterMembership === "both" &&
          user.membershipStatus.membershipType === "both") ||
        (filterMembership === "non-member" && !user.membershipStatus.isMember);
      
      // 🔍 Search filter - searches across multiple fields
      const searchMatch = searchQuery === "" || 
        user.studentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.middleName && user.middleName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.yearLevel && user.yearLevel.toString().includes(searchQuery));
      
      return roleMatch && membershipMatch && searchMatch;
    });
  };

  // 🔥 NEW: Sort users function
  const sortUsers = (users: User[]): User[] => {
    return [...users].sort((a, b) => {
      let aValue: string | number | Date | undefined;
      let bValue: string | number | Date | undefined;

      switch (sortField) {
        case "studentNumber":
          aValue = a.studentNumber;
          bValue = b.studentNumber;
          break;
        case "fullName":
          aValue = a.fullName.toLowerCase();
          bValue = b.fullName.toLowerCase();
          break;
        case "role":
          aValue = a.role;
          bValue = b.role;
          break;
        case "yearLevel":
          aValue = a.yearLevel;
          bValue = b.yearLevel;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "updatedAt":
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        default:
          return 0;
      }

      // Special handling for yearLevel
      if (sortField === "yearLevel") {
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1; // nulls at end
        if (bValue == null) return -1; // nulls at end
        
        const aNum = aValue as number;
        const bNum = bValue as number;
        
        return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
      }

      // String comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      } 
      // Number comparison
      else if (typeof aValue === "number" && typeof bValue === "number") {
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      } 
      // Date comparison
      else if (aValue instanceof Date && bValue instanceof Date) {
        if (aValue.getTime() < bValue.getTime())
          return sortDirection === "asc" ? -1 : 1;
        if (aValue.getTime() > bValue.getTime())
          return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  // Fetch ALL users on component mount
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Update displayed users when page, filters, OR SORT changes
  useEffect(() => {
    updateDisplayedUsers();
  }, [currentPage, allUsers, filterRole, filterMembership, sortField, sortDirection, searchQuery]);
  
  // 🔍 Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      console.log("🔍 Fetching all users...");

      const response: ApiResponse<ApiUser[]> = await fetchWithAuth(
        `${API_BASE_URL}/users?limit=10000&page=1`
      );

      console.log("📊 Response:", response);

      if (response.success) {
        const transformedUsers: User[] = response.data.map((user: ApiUser) => ({
          id: user._id,
          studentNumber: user.studentNumber,
          lastName: capitalizeWords(user.lastName),
          firstName: capitalizeWords(user.firstName),
          middleName: user.middleName ? capitalizeWords(user.middleName) : "",
          fullName: capitalizeWords(
            user.fullName ||
              `${user.firstName} ${user.middleName || ""} ${
                user.lastName
              }`.trim()
          ),
          role: validateRole(user.role),
          yearLevel: user.yearLevel,
          membershipStatus: {
            isMember: user.membershipStatus.isMember,
            membershipType: validateMembershipType(
              user.membershipStatus.membershipType
            ),
          },
          profilePicture: user.profilePicture,
          isActive: user.isActive,
          registeredBy: user.registeredBy
            ? {
                id: user.registeredBy._id,
                fullName: capitalizeWords(
                  `${user.registeredBy.firstName} ${user.registeredBy.lastName}`
                ),
              }
            : null,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }));

        console.log(`✅ Loaded ${transformedUsers.length} users`);
        setAllUsers(transformedUsers);
      }
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      setErrorModal({
        show: true,
        title: "Failed to Load Users",
        message:
          "Unable to fetch users from the server. Please try refreshing the page.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 FIXED: Update displayed users with proper flow: Filter -> Sort -> Paginate
  const updateDisplayedUsers = () => {
    // Step 1: Filter
    let processedUsers = getFilteredUsers();
    
    // Step 2: Sort ALL filtered users
    processedUsers = sortUsers(processedUsers);

    // Step 3: Calculate pagination
    const pages = Math.ceil(processedUsers.length / USERS_PER_PAGE);
    setTotalPages(pages);

    // Step 4: Paginate
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;
    const usersToDisplay = processedUsers.slice(startIndex, endIndex);

    console.log(
      `📄 Page ${currentPage}: Showing users ${startIndex + 1}-${Math.min(
        endIndex,
        processedUsers.length
      )} of ${processedUsers.length} (filtered from ${allUsers.length} total, sorted by ${sortField} ${sortDirection})`
    );
    setDisplayedUsers(usersToDisplay);
  };

  // Reset to page 1 when filters or sort changes
  const handleFilterChange = (type: 'role' | 'membership', value: string) => {
    if (type === 'role') {
      setFilterRole(value);
    } else {
      setFilterMembership(value);
    }
    setCurrentPage(1);
  };
  
  // 🔍 NEW: Handle search input
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
    setShowSearchSuggestions(value.length > 0);
  };
  
  // 🔍 NEW: Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setShowSearchSuggestions(false);
  };
  
  // 🔍 NEW: Get search suggestions (top 10 matches)
  const getSearchSuggestions = () => {
    if (searchQuery.length === 0) return [];
    
    const filtered = allUsers.filter((user) => {
      return user.studentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.middleName && user.middleName.toLowerCase().includes(searchQuery.toLowerCase()));
    });
    
    return filtered.slice(0, 10); // Limit to 10 suggestions
  };

  // 🔥 NEW: Handle sort changes from table
  const handleSortChange = (field: SortField, direction: SortDirection) => {
    console.log(`🔄 Sort changed: ${field} ${direction}`);
    setSortField(field);
    setSortDirection(direction);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleAddUser = () => {
    setIsAddUserModalOpen(true);
  };

  const handleAddUserSubmit = async (newUser: NewUser) => {
    try {
      const response: ApiResponse<ApiUser> = await fetchWithAuth(
        `${API_BASE_URL}/users`,
        {
          method: "POST",
          body: JSON.stringify(newUser),
        }
      );

      if (response.success) {
        await fetchAllUsers();
        setSuccessModal({
          show: true,
          title: "User Added Successfully",
          message: `${capitalizeWords(
            response.data.fullName
          )} has been added to the system.`,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while adding the user.";
      console.error("Error adding user:", error);
      setErrorModal({
        show: true,
        title: "Failed to Add User",
        message: errorMessage,
      });
    }
  };

  const handleExcelUpload = async (uploadedUsers: UploadUserData[]) => {
    try {
      setIsUploading(true);
      setUploadStats({
        total: uploadedUsers.length,
        current: 0,
        successful: 0,
        failed: 0,
      });
      setUploadProgress("Preparing upload...");

      let successCount = 0;
      let failedCount = 0;
      const failedUsers: FailedUser[] = [];

      for (let i = 0; i < uploadedUsers.length; i++) {
        const userData = uploadedUsers[i];

        setUploadStats((prev) => ({
          ...prev,
          current: i + 1,
        }));

        setUploadProgress(`Processing ${userData.studentNumber || "user"}...`);

        try {
          const transformedUserData = {
            studentNumber: userData.studentNumber,
            firstName: userData.firstName,
            lastName: userData.lastName,
            middleName: userData.middleName,
            role: userData.role,
            yearLevel: userData.yearLevel,
            membershipStatus: parseMembershipStatus(userData.membershipStatus),
          };

          const response: ApiResponse<ApiUser> = await fetchWithAuth(
            `${API_BASE_URL}/users`,
            {
              method: "POST",
              body: JSON.stringify(transformedUserData),
            }
          );

          if (response.success) {
            successCount++;
            setUploadStats((prev) => ({
              ...prev,
              successful: successCount,
            }));
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          failedCount++;
          failedUsers.push({
            studentNumber: userData.studentNumber || "UNKNOWN",
            reason: errorMessage,
            data: userData as unknown as Record<string, unknown>,
          });
          setUploadStats((prev) => ({
            ...prev,
            failed: failedCount,
          }));
        }
      }

      setUploadStats({
        total: uploadedUsers.length,
        current: uploadedUsers.length,
        successful: successCount,
        failed: failedCount,
      });

      setUploadProgress("Upload complete! Refreshing user list...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await fetchAllUsers();

      setIsUploading(false);
      setUploadProgress("");
      setIsUploadModalOpen(false);

      setUploadResult({
        show: true,
        success: successCount,
        failed: failedCount,
        failedUsers: failedUsers,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      console.error("❌ Bulk upload error:", error);
      setIsUploading(false);
      setUploadProgress("");

      setErrorModal({
        show: true,
        title: "Upload Failed",
        message:
          errorMessage === "Failed to fetch"
            ? "Connection error. Please check if the backend is running on port 5000."
            : errorMessage,
      });
    }
  };

  const handleExport = () => {
    const csv = convertToCSV(allUsers);
    downloadCSV(csv, "users-export.csv");
    setSuccessModal({
      show: true,
      title: "Export Successful",
      message: `Successfully exported ${allUsers.length} users to CSV.`,
    });
  };

  const convertToCSV = (data: User[]) => {
    const headers = [
      "Student Number",
      "Last Name",
      "First Name",
      "Middle Name",
      "Role",
      "Year Level",
      "Membership Status",
      "Membership Type",
      "Registered By",
      "Registration Date",
      "Last Updated",
      "Status",
    ];

    const rows = data.map((user) => [
      user.studentNumber,
      user.lastName,
      user.firstName,
      user.middleName || "",
      user.role,
      user.yearLevel || "",
      user.membershipStatus.isMember ? "Member" : "Non-Member",
      user.membershipStatus.membershipType || "",
      user.registeredBy?.fullName || "Self-registered",
      new Date(user.createdAt).toLocaleDateString(),
      new Date(user.updatedAt).toLocaleDateString(),
      user.isActive ? "Active" : "Inactive",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    return csvContent;
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedUser: User) => {
    try {
      const response: ApiResponse<ApiUser> = await fetchWithAuth(
        `${API_BASE_URL}/users/${updatedUser.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            middleName: updatedUser.middleName,
            role: updatedUser.role,
            yearLevel: updatedUser.yearLevel,
            membershipStatus: updatedUser.membershipStatus,
          }),
        }
      );

      if (response.success) {
        await fetchAllUsers();
        setSuccessModal({
          show: true,
          title: "User Updated",
          message: `${updatedUser.fullName} has been updated successfully.`,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update user.";
      console.error("Error updating user:", error);
      setErrorModal({
        show: true,
        title: "Update Failed",
        message: errorMessage,
      });
    }
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        const response: ApiResponse<{ message: string }> = await fetchWithAuth(
          `${API_BASE_URL}/users/${userToDelete.id}`,
          {
            method: "DELETE",
          }
        );

        if (response.success) {
          await fetchAllUsers();
          setSuccessModal({
            show: true,
            title: "User Deleted",
            message: `${userToDelete.fullName} has been deleted successfully.`,
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete user.";
        console.error("Error deleting user:", error);
        setErrorModal({
          show: true,
          title: "Delete Failed",
          message: errorMessage,
        });
      } finally {
        setUserToDelete(null);
      }
    }
  };

  const handleToggleActive = (user: User) => {
    setUserToToggle(user);
    setIsStatusConfirmOpen(true);
  };

  const confirmToggleActive = async () => {
    if (userToToggle) {
      try {
        const response: ApiResponse<{ isActive: boolean; updatedAt: string }> =
          await fetchWithAuth(
            `${API_BASE_URL}/users/${userToToggle.id}/toggle-status`,
            { method: "PATCH" }
          );

        if (response.success) {
          await fetchAllUsers();
          const status = response.data.isActive ? "activated" : "deactivated";
          setSuccessModal({
            show: true,
            title: "Status Updated",
            message: `${userToToggle.fullName} has been ${status} successfully.`,
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to update user status.";
        console.error("Error toggling user status:", error);
        setErrorModal({
          show: true,
          title: "Status Update Failed",
          message: errorMessage,
        });
      } finally {
        setUserToToggle(null);
      }
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const progressPercentage =
    uploadStats.total > 0
      ? Math.round((uploadStats.current / uploadStats.total) * 100)
      : 0;

  if (isLoading) {
    return <LoadingScreen showEntrance={false} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow w-full max-w-[1600px] mx-auto px-8 pt-[9.5rem] pb-12">
          <div className="mb-8 flex justify-start">
            <button
              onClick={handleBackToHome}
              title="Back to Home"
              className="relative flex h-12 w-12 cursor-pointer items-center justify-center 
                         rounded-full border-2 border-primary1 text-primary1 
                         overflow-hidden transition-all duration-300 ease-in-out 
                         active:scale-95 before:absolute before:inset-0 
                         before:bg-gradient-to-r before:from-transparent 
                         before:via-white/40 before:to-transparent 
                         before:translate-x-[-100%] hover:before:translate-x-[100%] 
                         before:transition-transform before:duration-700"
            >
              <ArrowLeft className="h-6 w-6 animate-nudge-left translate-x-[2px]" />
            </button>
          </div>

          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
              <div className="h-2 w-2 rounded-full bg-primary1"></div>
              <span className="font-raleway text-sm font-semibold text-primary1">
                User Management
              </span>
            </div>
            <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
              Registered Users
            </h1>
            <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Manage and view all registered users, members, officers, and
              faculty.
            </p>
          </div>

          <UserStats users={allUsers} />

          {/* 🔍 Search Bar - Redesigned */}
          <div className="mb-6">
            <div className="relative max-w-3xl mx-auto" ref={searchContainerRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-primary1" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setShowSearchSuggestions(searchQuery.length > 0)}
                  placeholder="Search users by name, student number, role, or year level..."
                  className="w-full pl-14 pr-14 py-4 font-raleway text-base text-gray-900 placeholder-gray-500 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary1 focus:border-primary1 transition-all duration-300 shadow-sm hover:shadow-md"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-primary1 transition-colors"
                    title="Clear search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              {/* Search Suggestions Dropdown - Redesigned */}
              {showSearchSuggestions && searchQuery.length > 0 && (
                <div className="absolute z-50 mt-3 w-full bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[32rem] overflow-hidden">
                  {getSearchSuggestions().length > 0 ? (
                    <>
                      <div className="px-5 py-3 bg-gradient-to-r from-primary1/5 to-primary1/10 border-b border-gray-200">
                        <p className="font-raleway text-sm font-semibold text-primary3">
                          Found {getSearchSuggestions().length} result{getSearchSuggestions().length !== 1 ? 's' : ''}
                          {getSearchSuggestions().length === 10 && ' (showing top 10)'}
                        </p>
                      </div>
                      <div className="overflow-y-auto max-h-[28rem]">
                        {getSearchSuggestions().map((user, index) => (
                          <div
                            key={user.id}
                            onClick={() => {
                              handleViewUser(user);
                              setShowSearchSuggestions(false);
                            }}
                            className="px-5 py-4 hover:bg-primary1/5 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-0 group"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="font-raleway font-bold text-base text-gray-900 truncate group-hover:text-primary1 transition-colors">
                                    {user.fullName}
                                  </h4>
                                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-raleway text-sm text-gray-600 font-medium">
                                    {user.studentNumber}
                                  </span>
                                  <span className="text-gray-400">•</span>
                                  <span className="font-raleway text-sm text-gray-600 capitalize">
                                    {user.role.replace('-', ' ')}
                                  </span>
                                  {user.yearLevel && (
                                    <>
                                      <span className="text-gray-400">•</span>
                                      <span className="font-raleway text-sm text-gray-600">
                                        Year {user.yearLevel}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                {user.membershipStatus.isMember ? (
                                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-raleway font-bold rounded-full uppercase tracking-wide shadow-sm">
                                    {user.membershipStatus.membershipType || 'Member'}
                                  </span>
                                ) : (
                                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-raleway font-semibold rounded-full">
                                    Non-Member
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="px-5 py-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="font-raleway text-base font-semibold text-gray-700 mb-1">
                        No users found
                      </p>
                      <p className="font-raleway text-sm text-gray-500">
                        Try searching with a different keyword
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 font-raleway font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-300"
            >
              <Download className="w-4 h-4" />
              Export All
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-2 border-2 border-primary1 text-primary1 font-raleway font-semibold rounded-lg hover:bg-primary1 hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              Upload Excel
            </button>
            <button
              onClick={handleAddUser}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary1 to-primary1/90 text-white font-raleway font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>

          {/* 🔥 Pass sort state and handler to UsersTable */}
          <UsersTable
            users={displayedUsers}
            totalUsers={getFilteredUsers().length}
            currentPage={currentPage}
            usersPerPage={USERS_PER_PAGE}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onToggleActive={handleToggleActive}
            onView={handleViewUser}
            filterRole={filterRole}
            filterMembership={filterMembership}
            onFilterChange={handleFilterChange}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
          />

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center border-t border-gray-200 pt-6">
              <div className="flex items-center gap-4">
                {currentPage > 1 ? (
                  <button
                    onClick={handlePreviousPage}
                    className="p-2 rounded-lg border-2 border-primary1 text-primary1 hover:bg-primary1 hover:text-white transition-all duration-300"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="w-[42px]"></div>
                )}

                <div className="flex items-center gap-2 min-w-[100px] justify-center">
                  <span className="font-raleway text-base text-gray-700">
                    <span className="font-bold text-primary1">
                      {currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-primary1">
                      {totalPages}
                    </span>
                  </span>
                </div>

                {currentPage < totalPages ? (
                  <button
                    onClick={handleNextPage}
                    className="p-2 rounded-lg border-2 border-primary1 text-primary1 hover:bg-primary1 hover:text-white transition-all duration-300"
                    title="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="w-[42px]"></div>
                )}
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>

      {/* All modals remain the same... */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary1 border-t-transparent mb-6"></div>

              <h3 className="font-rubik text-2xl font-bold text-primary3 mb-2">
                Uploading Users
              </h3>

              <div className="font-raleway text-4xl font-bold text-primary1 mb-2">
                {uploadStats.current} / {uploadStats.total}
              </div>

              <p className="font-raleway text-gray-600 mb-4 text-sm">
                {uploadProgress}
              </p>

              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-primary1 to-primary1/80 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              <p className="font-raleway text-sm font-semibold text-primary1 mb-4">
                {progressPercentage}% Complete
              </p>

              <div className="flex justify-center gap-6 mb-4">
                <div className="text-center">
                  <div className="font-raleway text-2xl font-bold text-green-600">
                    {uploadStats.successful}
                  </div>
                  <div className="font-raleway text-xs text-gray-500">
                    Successful
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-raleway text-2xl font-bold text-red-600">
                    {uploadStats.failed}
                  </div>
                  <div className="font-raleway text-xs text-gray-500">
                    Failed
                  </div>
                </div>
              </div>

              <p className="font-raleway text-sm text-gray-500">
                Please wait... Do not close this window.
              </p>
            </div>
          </div>
        </div>
      )}

      {uploadResult.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-6">
              {uploadResult.failed === 0 ? (
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              ) : (
                <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              )}

              <h3 className="font-rubik text-2xl font-bold text-primary3 mb-2">
                Upload Complete
              </h3>

              <div className="flex justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="font-raleway text-3xl font-bold text-green-600">
                    {uploadResult.success}
                  </div>
                  <div className="font-raleway text-sm text-gray-600">
                    Successful
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-raleway text-3xl font-bold text-red-600">
                    {uploadResult.failed}
                  </div>
                  <div className="font-raleway text-sm text-gray-600">
                    Failed
                  </div>
                </div>
              </div>
            </div>

            {uploadResult.failedUsers.length > 0 && (
              <div className="mb-6">
                <h4 className="font-raleway font-semibold text-lg mb-3 text-red-600">
                  Failed Users:
                </h4>
                <div className="bg-red-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  {uploadResult.failedUsers.map((user, index) => (
                    <div
                      key={index}
                      className="mb-2 pb-2 border-b border-red-200 last:border-0"
                    >
                      <p className="font-raleway text-sm font-semibold text-gray-800">
                        {user.studentNumber}
                      </p>
                      <p className="font-raleway text-xs text-gray-600">
                        {user.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() =>
                setUploadResult({
                  show: false,
                  success: 0,
                  failed: 0,
                  failedUsers: [],
                })
              }
              className="w-full px-6 py-3 bg-primary1 text-white font-raleway font-semibold rounded-lg hover:bg-primary1/90 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {successModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="font-rubik text-2xl font-bold text-primary3 mb-2">
                {successModal.title}
              </h3>
              <p className="font-raleway text-gray-600 mb-6">
                {successModal.message}
              </p>
              <button
                onClick={() =>
                  setSuccessModal({ show: false, title: "", message: "" })
                }
                className="w-full px-6 py-3 bg-primary1 text-white font-raleway font-semibold rounded-lg hover:bg-primary1/90 transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {errorModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
            <div className="text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="font-rubik text-2xl font-bold text-primary3 mb-2">
                {errorModal.title}
              </h3>
              <p className="font-raleway text-gray-600 mb-6">
                {errorModal.message}
              </p>
              <button
                onClick={() =>
                  setErrorModal({ show: false, title: "", message: "" })
                }
                className="w-full px-6 py-3 bg-red-500 text-white font-raleway font-semibold rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ExcelUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => !isUploading && setIsUploadModalOpen(false)}
        onUpload={handleExcelUpload}
      />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAdd={handleAddUserSubmit}
      />

      {isViewModalOpen && selectedUser && (
        <ViewUserModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />
      )}

      {isEditModalOpen && selectedUser && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveEdit}
          user={selectedUser}
        />
      )}

      {isDeleteConfirmOpen && userToDelete && (
        <ConfirmDialog
          isOpen={isDeleteConfirmOpen}
          onClose={() => {
            setIsDeleteConfirmOpen(false);
            setUserToDelete(null);
          }}
          onConfirm={confirmDelete}
          title="Delete User"
          message={`Are you sure you want to delete ${userToDelete.fullName}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      )}

      {isStatusConfirmOpen && userToToggle && (
        <ConfirmDialog
          isOpen={isStatusConfirmOpen}
          onClose={() => {
            setIsStatusConfirmOpen(false);
            setUserToToggle(null);
          }}
          onConfirm={confirmToggleActive}
          title={userToToggle.isActive ? "Deactivate User" : "Activate User"}
          message={`Are you sure you want to ${
            userToToggle.isActive ? "deactivate" : "activate"
          } ${userToToggle.fullName}?`}
          confirmText={userToToggle.isActive ? "Deactivate" : "Activate"}
          cancelText="Cancel"
          type="warning"
        />
      )}
    </div>
  );
}