"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
import { ArrowLeft, UserPlus, Download, Upload } from "lucide-react";

// 🔥 HARDCODED FOR TESTING - This should work!
const API_BASE_URL = 'http://localhost:5000/api';

// Debug on mount
if (typeof window !== 'undefined') {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔧 API Configuration:');
  console.log('   Base URL:', API_BASE_URL);
  console.log('   Bulk Upload URL:', `${API_BASE_URL}/users/bulk-upload`);
  console.log('   Expected backend log: POST /api/users/bulk-upload');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Helper function to make authenticated API calls
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  // 🔥 DEBUG: Log every API call
  console.log('🌐 API Call:', {
    url,
    method: options.method || 'GET',
    hasToken: !!token
  });
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  console.log('📨 Response:', {
    status: response.status,
    statusText: response.statusText,
    url: response.url
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
};

export default function UsersListPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  
  // 🔥 NEW: Upload progress state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  
  // Confirmation Dialogs
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);
  
  // View and Edit Modals
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth(`${API_BASE_URL}/users`);
      
      if (response.success) {
        // Transform backend data to match frontend User type
        const transformedUsers: User[] = response.data.map((user: any) => ({
          id: user._id,
          studentNumber: user.studentNumber,
          lastName: user.lastName,
          firstName: user.firstName,
          middleName: user.middleName,
          fullName: user.fullName,
          role: user.role,
          yearLevel: user.yearLevel,
          membershipStatus: user.membershipStatus,
          profilePicture: user.profilePicture,
          isActive: user.isActive,
          registeredBy: user.registeredBy ? {
            id: user.registeredBy._id,
            fullName: `${user.registeredBy.firstName} ${user.registeredBy.lastName}`,
          } : null,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }));
        
        setUsers(transformedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleAddUser = () => {
    setIsAddUserModalOpen(true);
  };

  const handleAddUserSubmit = async (newUser: NewUser) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/users`, {
        method: 'POST',
        body: JSON.stringify(newUser),
      });

      if (response.success) {
        // Transform and add the new user to the list
        const transformedUser: User = {
          id: response.data._id,
          studentNumber: response.data.studentNumber,
          lastName: response.data.lastName,
          firstName: response.data.firstName,
          middleName: response.data.middleName,
          fullName: response.data.fullName,
          role: response.data.role,
          yearLevel: response.data.yearLevel,
          membershipStatus: response.data.membershipStatus,
          profilePicture: response.data.profilePicture,
          isActive: response.data.isActive,
          registeredBy: response.data.registeredBy ? {
            id: response.data.registeredBy._id,
            fullName: `${response.data.registeredBy.firstName} ${response.data.registeredBy.lastName}`,
          } : null,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };

        setUsers([transformedUser, ...users]);
        alert("User added successfully!");
      }
    } catch (error: any) {
      console.error("Error adding user:", error);
      alert(error.message || "Failed to add user. Please try again.");
    }
  };

  const handleExcelUpload = async (uploadedUsers: any[]) => {
    try {
      // 🔥 Set uploading state
      setIsUploading(true);
      setUploadProgress(`Uploading ${uploadedUsers.length} users...`);
      
      // 🔥 EXPLICIT URL CONSTRUCTION
      const bulkUploadUrl = `${API_BASE_URL}/users/bulk-upload`;
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🚀 BULK UPLOAD STARTING');
      console.log('   Full URL:', bulkUploadUrl);
      console.log('   User count:', uploadedUsers.length);
      console.log('   First user:', uploadedUsers[0]);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      setUploadProgress('Processing users on server...');

      const response = await fetchWithAuth(bulkUploadUrl, {
        method: 'POST',
        body: JSON.stringify({ users: uploadedUsers }),
      });

      console.log('✅ Bulk upload response:', response);

      if (response.success) {
        const successCount = response.data.success.length;
        const failedCount = response.data.failed.length;
        
        setUploadProgress('Refreshing user list...');
        
        // Refresh the user list
        await fetchUsers();
        
        // 🔥 Reset states
        setIsUploading(false);
        setUploadProgress('');
        setIsUploadModalOpen(false);
        
        // Show results
        if (failedCount > 0) {
          alert(
            `Upload completed!\n\n` +
            `✅ ${successCount} users uploaded successfully\n` +
            `❌ ${failedCount} users failed\n\n` +
            `Failed users:\n${response.data.failed.map((f: any) => `• ${f.studentNumber}: ${f.reason}`).join('\n')}`
          );
        } else {
          alert(`🎉 Success! All ${successCount} users uploaded successfully!`);
        }
      }
    } catch (error: any) {
      console.error("❌ Bulk upload error:", error);
      
      // 🔥 Reset states on error
      setIsUploading(false);
      setUploadProgress('');
      
      let errorMessage = "Failed to upload users.\n\n";
      if (error.message === "Failed to fetch") {
        errorMessage += "⚠️ Connection Error\n\n" +
          "Check:\n" +
          "1. Backend running on port 5000?\n" +
          "2. CORS configured correctly?\n" +
          "3. Network tab in DevTools (F12)\n\n" +
          "Current API URL: " + API_BASE_URL;
      } else {
        errorMessage += "Error: " + error.message;
      }
      
      alert(errorMessage);
    }
  };

  const handleExport = () => {
    // Export users to CSV
    const csv = convertToCSV(users);
    downloadCSV(csv, "users-export.csv");
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

  // Context Menu Action Handlers
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedUser: User) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/users/${updatedUser.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          middleName: updatedUser.middleName,
          role: updatedUser.role,
          yearLevel: updatedUser.yearLevel,
          membershipStatus: updatedUser.membershipStatus,
        }),
      });

      if (response.success) {
        // Update the user in the local state
        setUsers(users.map(u => {
          if (u.id === updatedUser.id) {
            return {
              ...updatedUser,
              fullName: response.data.fullName,
              updatedAt: response.data.updatedAt,
            };
          }
          return u;
        }));
        
        alert(`${updatedUser.fullName} has been updated successfully!`);
      }
    } catch (error: any) {
      console.error("Error updating user:", error);
      alert(error.message || "Failed to update user. Please try again.");
    }
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/users/${userToDelete.id}`, {
          method: 'DELETE',
        });

        if (response.success) {
          setUsers(users.filter(u => u.id !== userToDelete.id));
          alert(`${userToDelete.fullName} has been deleted successfully!`);
        }
      } catch (error: any) {
        console.error("Error deleting user:", error);
        alert(error.message || "Failed to delete user. Please try again.");
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
        const response = await fetchWithAuth(
          `${API_BASE_URL}/users/${userToToggle.id}/toggle-status`,
          { method: 'PATCH' }
        );

        if (response.success) {
          setUsers(users.map(u => 
            u.id === userToToggle.id 
              ? { ...u, isActive: response.data.isActive, updatedAt: response.data.updatedAt }
              : u
          ));
          
          const status = response.data.isActive ? 'activated' : 'deactivated';
          alert(`${userToToggle.fullName} has been ${status} successfully!`);
        }
      } catch (error: any) {
        console.error("Error toggling user status:", error);
        alert(error.message || "Failed to update user status. Please try again.");
      } finally {
        setUserToToggle(null);
      }
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary1 mb-4"></div>
          <p className="font-raleway text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow w-full max-w-[1600px] mx-auto px-8 pt-[9.5rem] pb-12">
          {/* Back Button */}
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

          {/* Header Section - Centered */}
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
              Manage and view all registered users, members, officers, and faculty.
            </p>
          </div>

          {/* Stats Cards */}
          <UserStats users={users} />

          {/* Filters and Action Buttons */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1">
              {/* Filters placeholder */}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 font-raleway font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                <Download className="w-4 h-4" />
                Export
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
          </div>

          {/* Users Table with Context Menu Actions */}
          <UsersTable 
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onToggleActive={handleToggleActive}
            onView={handleViewUser}
          />
        </main>
        <Footer />
      </div>

      {/* 🔥 NEW: Upload Progress Overlay */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
            <div className="text-center">
              {/* Animated spinner */}
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary1 border-t-transparent mb-6"></div>
              
              {/* Progress text */}
              <h3 className="font-rubik text-2xl font-bold text-primary3 mb-2">
                Uploading Users
              </h3>
              <p className="font-raleway text-gray-600 mb-4">
                {uploadProgress}
              </p>
              
              {/* Progress indicator */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary1 to-primary1/80 rounded-full animate-pulse"></div>
              </div>
              
              <p className="font-raleway text-sm text-gray-500 mt-4">
                Please wait... Do not close this window.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Excel Upload Modal */}
      <ExcelUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => !isUploading && setIsUploadModalOpen(false)}
        onUpload={handleExcelUpload}
      />

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAdd={handleAddUserSubmit}
      />

      {/* View User Details Modal */}
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

      {/* Edit User Modal */}
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

      {/* Delete Confirmation Dialog */}
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

      {/* Toggle Status Confirmation Dialog */}
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