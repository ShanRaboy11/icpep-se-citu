"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User } from "./utils/user";
import Button from "../components/button";
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
import BackButton from "../components/back-button";
import PageHeader from "../components/page-header";
import {
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
import { toTitleCase } from "../officers/utils/format-name";
import { LoadingIndicator } from "@/app/components/loading";

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
  position?: string;
  yearLevel?: number;
  membershipStatus?: string;
}

type SortField =
  | "studentNumber"
  | "fullName"
  | "role"
  | "yearLevel"
  | "createdAt"
  | "updatedAt";
type SortDirection = "asc" | "desc";

const getApiUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== "undefined") {
    const { hostname } = window.location;

    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return "https://your-backend-url.com/api";
    }
  }

  return "http://localhost:5000/api";
};

const API_BASE_URL = getApiUrl();
const USERS_PER_PAGE = 20;

// Helper functions
const validateRole = (
  role: string,
):
  | "faculty"
  | "council-officer"
  | "committee-officer"
  | "student"
  | "admin" => {
  const roleMap: Record<
    string,
    "faculty" | "council-officer" | "committee-officer" | "student" | "admin"
  > = {
    faculty: "faculty",
    "council-officer": "council-officer",
    "committee-officer": "committee-officer",
    student: "student",
    member: "student",
    "non-member": "student",
    admin: "admin",
  };

  return roleMap[role] || "student";
};

const validateMembershipType = (
  membershipType: string | null,
): "regional" | "local" | "both" | null => {
  if (membershipType === null) return null;

  const validTypes = ["regional", "local", "both"];
  if (validTypes.includes(membershipType.toLowerCase())) {
    return membershipType.toLowerCase() as "regional" | "local" | "both";
  }

  return null;
};

const parseMembershipStatus = (
  membershipStatus?: string,
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
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageInputValue, setPageInputValue] = useState("1");

  // Filter and Sort state - MOVED FROM UsersTable
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterMembership, setFilterMembership] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("yearLevel");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [searchQuery, setSearchQuery] = useState<string>("");

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

      const searchMatch =
        searchQuery === "" ||
        user.studentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.middleName &&
          user.middleName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.yearLevel && user.yearLevel.toString().includes(searchQuery));

      return roleMatch && membershipMatch && searchMatch;
    });
  };

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
  }, [
    currentPage,
    allUsers,
    filterRole,
    filterMembership,
    sortField,
    sortDirection,
    searchQuery,
  ]);

  // Keep the "jump to page" input in sync when the page changes via the
  // prev/next buttons (or a filter/search reset back to page 1).
  useEffect(() => {
    setPageInputValue(String(currentPage));
  }, [currentPage]);

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);

      const response: ApiResponse<ApiUser[]> = await fetchWithAuth(
        `${API_BASE_URL}/users?limit=10000&page=1`,
      );

      if (response.success) {
        const transformedUsers: User[] = response.data.map((user: ApiUser) => ({
          id: user._id,
          studentNumber: user.studentNumber,
          lastName: toTitleCase(user.lastName),
          firstName: toTitleCase(user.firstName),
          middleName: user.middleName ? toTitleCase(user.middleName) : "",
          fullName: toTitleCase(
            user.fullName ||
              `${user.firstName} ${user.middleName || ""} ${
                user.lastName
              }`.trim(),
          ),
          role: validateRole(user.role),
          yearLevel: user.yearLevel,
          membershipStatus: {
            isMember: user.membershipStatus.isMember,
            membershipType: validateMembershipType(
              user.membershipStatus.membershipType,
            ),
          },
          profilePicture: user.profilePicture,
          isActive: user.isActive,
          registeredBy: user.registeredBy
            ? {
                id: user.registeredBy._id,
                fullName: toTitleCase(
                  `${user.registeredBy.firstName} ${user.registeredBy.lastName}`,
                ),
              }
            : null,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }));

        setAllUsers(transformedUsers);
      }
    } catch {
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

  // Filter -> Sort -> Paginate
  const updateDisplayedUsers = () => {
    let processedUsers = getFilteredUsers();
    processedUsers = sortUsers(processedUsers);

    const pages = Math.ceil(processedUsers.length / USERS_PER_PAGE);
    setTotalPages(pages);

    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;
    const usersToDisplay = processedUsers.slice(startIndex, endIndex);

    setDisplayedUsers(usersToDisplay);
  };

  // Reset to page 1 when filters or sort changes
  const handleFilterChange = (type: "role" | "membership", value: string) => {
    if (type === "role") {
      setFilterRole(value);
    } else {
      setFilterMembership(value);
    }
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleSortChange = (field: SortField, direction: SortDirection) => {
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
        },
      );

      if (response.success) {
        await fetchAllUsers();
        setSuccessModal({
          show: true,
          title: "User Added Successfully",
          message: `${toTitleCase(
            response.data.fullName,
          )} has been added to the system.`,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while adding the user.";
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
      const totalUsers = uploadedUsers.length;
      setUploadStats({
        total: totalUsers,
        current: 0,
        successful: 0,
        failed: 0,
      });
      setUploadProgress("Removing users not in the file...");

      // Phase 1: Send all student numbers so backend can delete users not in the Excel
      const studentNumbers = uploadedUsers.map((u) => u.studentNumber);

      await fetchWithAuth(`${API_BASE_URL}/users/sync-delete`, {
        method: "POST",
        body: JSON.stringify({ studentNumbers }),
      });

      setUploadProgress("Syncing user data...");

      // Phase 2: Process users in batches of 5 for real-time progress
      const BATCH_SIZE = 5;
      let totalSuccessful = 0;
      let totalFailed = 0;
      const allFailedUsers: FailedUser[] = [];

      for (let i = 0; i < totalUsers; i += BATCH_SIZE) {
        const batch = uploadedUsers.slice(i, i + BATCH_SIZE).map((userData) => ({
          studentNumber: userData.studentNumber,
          firstName: userData.firstName,
          lastName: userData.lastName,
          middleName: userData.middleName,
          role: userData.role,
          position: userData.position,
          yearLevel: userData.yearLevel,
          membershipStatus: userData.membershipStatus,
        }));

        const response: ApiResponse<any> = await fetchWithAuth(
          `${API_BASE_URL}/users/sync-upsert-batch`,
          {
            method: "POST",
            body: JSON.stringify({ users: batch }),
          },
        );

        if (response.success && response.data) {
          totalSuccessful += response.data.successful || 0;
          totalFailed += response.data.failed || 0;

          if (response.data.failedUsers) {
            allFailedUsers.push(
              ...response.data.failedUsers.map((fail: any) => ({
                studentNumber: fail.studentNumber,
                reason: fail.reason,
                data: fail.data,
              })),
            );
          }
        }

        // Update progress in real-time
        const processed = Math.min(i + BATCH_SIZE, totalUsers);
        setUploadStats({
          total: totalUsers,
          current: processed,
          successful: totalSuccessful,
          failed: totalFailed,
        });
        setUploadProgress(
          `Processing users... (${processed}/${totalUsers})`,
        );
      }

      setUploadProgress("Sync complete! Refreshing user list...");
      await new Promise((resolve) => setTimeout(resolve, 800));

      await fetchAllUsers();

      setIsUploading(false);
      setUploadProgress("");
      setIsUploadModalOpen(false);

      setUploadResult({
        show: true,
        success: totalSuccessful,
        failed: totalFailed,
        failedUsers: allFailedUsers,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
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
        },
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
          },
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
            { method: "PATCH" },
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

  // Let the user jump straight to a page by typing it in
  const commitPageInput = () => {
    const page = parseInt(pageInputValue, 10);
    if (!isNaN(page)) {
      const clamped = Math.min(Math.max(page, 1), totalPages);
      setCurrentPage(clamped);
      setPageInputValue(String(clamped));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setPageInputValue(String(currentPage));
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
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#004e89]">
      <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <div className="grow w-full max-w-400 mx-auto px-8 pt-38 pb-12">
            <div className="mb-8 flex justify-start">
              <BackButton onClick={() => router.push("/")} title="Back to Home" />
            </div>

            <PageHeader
              badge="User Management"
              title="Registered Users"
              subtitle={
                <>
                  Manage and view all registered users, members, officers, and
                  faculty.
                </>
              }
            />

            <UserStats users={allUsers} />

            {/* Search Bar */}
            <div className="mb-6 max-w-3xl mx-auto">
              <div className="flex items-center w-full bg-white border-2 border-primary1/20 rounded-2xl px-4 py-2 sm:px-5 sm:py-3 transition-all duration-300 hover:border-primary1 focus-within:border-primary1">
                <Search className="h-5 w-5 text-primary1 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search users by name, student number, role, or year level..."
                  className="w-full bg-transparent ml-3 outline-none font-rubik text-sm sm:text-base font-medium text-primary3 placeholder:text-gray-400 placeholder:font-normal"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="ml-2 text-gray-400 hover:text-primary1 transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-end sm:gap-3">
              <Button
                variant="heroOutline"
                rounded="lg"
                onClick={handleExport}
                className="flex items-center justify-center gap-1.5 px-2 py-2 text-xs sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
              >
                <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Export All
              </Button>
              <Button
                variant="heroOutline"
                rounded="lg"
                onClick={() => setIsUploadModalOpen(true)}
                disabled={isUploading}
                className="flex items-center justify-center gap-1.5 px-2 py-2 text-xs sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
              >
                <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Upload Excel
              </Button>
              <Button
                variant="hero"
                rounded="lg"
                onClick={handleAddUser}
                className="flex items-center justify-center gap-1.5 px-2 py-2 text-xs sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
              >
                <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Add User
              </Button>
            </div>

            {/* Pass props to UsersTable */}
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
            />

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center border-t border-gray-200 pt-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-primary1/40 bg-white/80 backdrop-blur-sm text-primary1 transition-all duration-300 hover:bg-primary1/10 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Previous page"
                  >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={pageInputValue}
                      onChange={(e) =>
                        setPageInputValue(e.target.value.replace(/\D/g, ""))
                      }
                      onBlur={commitPageInput}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.currentTarget.blur();
                        }
                      }}
                      className="w-14 text-center font-raleway font-bold text-primary1 bg-white border-2 border-primary1/30 rounded-lg py-1.5 outline-none focus:border-primary1 focus:ring-4 focus:ring-primary1/10 transition-all"
                    />
                    <span className="font-raleway text-base text-gray-700">
                      of{" "}
                      <span className="font-bold text-primary1">
                        {totalPages}
                      </span>
                    </span>
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-primary1/40 bg-white/80 backdrop-blur-sm text-primary1 transition-all duration-300 hover:bg-primary1/10 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Next page"
                  >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="-mt-8.75 md:-mt-20 relative z-0">
        <Footer />
      </div>

      {isUploading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
            <div className="text-center">
              <LoadingIndicator className="mb-6" />

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
                  className="h-full bg-linear-to-r from-primary1 to-primary1/80 rounded-full transition-all duration-300 ease-out"
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
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() =>
              setUploadResult({
                show: false,
                success: 0,
                failed: 0,
                failedUsers: [],
              })
            }
          />
          <div className="relative bg-white rounded-2xl p-8 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto themed-scrollbar animate-scale-in">
            <div className="text-center mb-5">
              {uploadResult.failed === 0 ? (
                <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
              ) : (
                <AlertCircle className="w-14 h-14 text-amber-500 mx-auto mb-3" />
              )}

              <h3 className="text-xl font-bold text-primary3 font-rubik mb-4">
                Upload Complete
              </h3>

              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="font-raleway text-3xl font-bold text-green-600">
                    {uploadResult.success}
                  </div>
                  <div className="font-raleway text-sm text-gray-500">
                    Successful
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-raleway text-3xl font-bold text-red-600">
                    {uploadResult.failed}
                  </div>
                  <div className="font-raleway text-sm text-gray-500">
                    Failed
                  </div>
                </div>
              </div>
            </div>

            {uploadResult.failedUsers.length > 0 && (
              <div className="mb-5">
                <h4 className="font-raleway font-semibold text-base mb-2.5 text-red-600">
                  Failed Users:
                </h4>
                <div className="bg-red-50 rounded-xl p-3.5 max-h-60 overflow-y-auto themed-scrollbar">
                  {uploadResult.failedUsers.map((user, index) => (
                    <div
                      key={index}
                      className="mb-2 pb-2 border-b border-red-200 last:border-0 last:mb-0 last:pb-0"
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

            <Button
              variant="hero"
              onClick={() =>
                setUploadResult({
                  show: false,
                  success: 0,
                  failed: 0,
                  failedUsers: [],
                })
              }
              className="w-full py-2 text-sm sm:py-3"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {successModal.show && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() =>
              setSuccessModal({ show: false, title: "", message: "" })
            }
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl animate-scale-in">
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
                {successModal.title}
              </h3>
              <p className="text-gray-400 text-sm font-raleway mt-2">
                {successModal.message}
              </p>
            </div>
            <Button
              variant="hero"
              onClick={() =>
                setSuccessModal({ show: false, title: "", message: "" })
              }
              className="w-full py-2 text-sm sm:py-3"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {errorModal.show && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() =>
              setErrorModal({ show: false, title: "", message: "" })
            }
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center animate-scale-in">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-primary3 font-rubik mb-2">
              {errorModal.title}
            </h3>
            <p className="text-gray-400 text-sm font-raleway mb-6 leading-relaxed">
              {errorModal.message}
            </p>
            <Button
              variant="heroDanger"
              onClick={() =>
                setErrorModal({ show: false, title: "", message: "" })
              }
              className="w-full py-2 sm:py-3"
            >
              Close
            </Button>
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
