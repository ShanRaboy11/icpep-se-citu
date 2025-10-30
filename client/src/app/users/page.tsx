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
import { ArrowLeft, UserPlus, Download, Upload, CheckCircle, XCircle, AlertCircle } from "lucide-react";

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to capitalize first letter of each word
const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

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
  
  // Upload progress state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    current: 0,
    successful: 0,
    failed: 0
  });
  
  // Modal states
  const [uploadResult, setUploadResult] = useState({
    show: false,
    success: 0,
    failed: 0,
    failedUsers: [] as any[],
  });
  
  const [successModal, setSuccessModal] = useState({
    show: false,
    title: '',
    message: '',
  });
  
  const [errorModal, setErrorModal] = useState({
    show: false,
    title: '',
    message: '',
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

  // Fetch ALL users on component mount
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // 🔥 NEW: Fetch ALL users with pagination
  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Fetching all users...');
      
      // Fetch with a very high limit to get all users
      // You can also implement proper pagination if you have thousands of users
      const response = await fetchWithAuth(`${API_BASE_URL}/users?limit=10000&page=1`);
      
      console.log('📊 Response:', response);
      
      if (response.success) {
        // Transform backend data to match frontend User type
        const transformedUsers: User[] = response.data.map((user: any) => ({
          id: user._id,
          studentNumber: user.studentNumber,
          // 🔥 Capitalize names properly
          lastName: capitalizeWords(user.lastName),
          firstName: capitalizeWords(user.firstName),
          middleName: user.middleName ? capitalizeWords(user.middleName) : '',
          fullName: capitalizeWords(user.fullName || `${user.firstName} ${user.middleName || ''} ${user.lastName}`.trim()),
          role: user.role,
          yearLevel: user.yearLevel,
          membershipStatus: user.membershipStatus,
          profilePicture: user.profilePicture,
          isActive: user.isActive,
          registeredBy: user.registeredBy ? {
            id: user.registeredBy._id,
            fullName: capitalizeWords(`${user.registeredBy.firstName} ${user.registeredBy.lastName}`),
          } : null,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }));
        
        console.log(`✅ Loaded ${transformedUsers.length} users`);
        setUsers(transformedUsers);
      }
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      setErrorModal({
        show: true,
        title: 'Failed to Load Users',
        message: 'Unable to fetch users from the server. Please try refreshing the page.',
      });
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
        const transformedUser: User = {
          id: response.data._id,
          studentNumber: response.data.studentNumber,
          lastName: capitalizeWords(response.data.lastName),
          firstName: capitalizeWords(response.data.firstName),
          middleName: response.data.middleName ? capitalizeWords(response.data.middleName) : '',
          fullName: capitalizeWords(response.data.fullName),
          role: response.data.role,
          yearLevel: response.data.yearLevel,
          membershipStatus: response.data.membershipStatus,
          profilePicture: response.data.profilePicture,
          isActive: response.data.isActive,
          registeredBy: response.data.registeredBy ? {
            id: response.data.registeredBy._id,
            fullName: capitalizeWords(`${response.data.registeredBy.firstName} ${response.data.registeredBy.lastName}`),
          } : null,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };

        setUsers([transformedUser, ...users]);
        setSuccessModal({
          show: true,
          title: 'User Added Successfully',
          message: `${transformedUser.fullName} has been added to the system.`,
        });
      }
    } catch (error: any) {
      console.error("Error adding user:", error);
      setErrorModal({
        show: true,
        title: 'Failed to Add User',
        message: error.message || 'An error occurred while adding the user.',
      });
    }
  };

  const handleExcelUpload = async (uploadedUsers: any[]) => {
    try {
      setIsUploading(true);
      setUploadStats({
        total: uploadedUsers.length,
        current: 0,
        successful: 0,
        failed: 0
      });
      setUploadProgress('Preparing upload...');
      
      let successCount = 0;
      let failedCount = 0;
      const failedUsers: any[] = [];

      for (let i = 0; i < uploadedUsers.length; i++) {
        const userData = uploadedUsers[i];
        
        setUploadStats(prev => ({
          ...prev,
          current: i + 1,
        }));
        
        setUploadProgress(`Processing ${userData.studentNumber || 'user'}...`);

        try {
          const response = await fetchWithAuth(`${API_BASE_URL}/users`, {
            method: 'POST',
            body: JSON.stringify(userData),
          });

          if (response.success) {
            successCount++;
            setUploadStats(prev => ({
              ...prev,
              successful: successCount,
            }));
          }
        } catch (error: any) {
          failedCount++;
          failedUsers.push({
            studentNumber: userData.studentNumber || 'UNKNOWN',
            reason: error.message || 'Unknown error',
            data: userData,
          });
          setUploadStats(prev => ({
            ...prev,
            failed: failedCount,
          }));
        }
      }

      setUploadStats({
        total: uploadedUsers.length,
        current: uploadedUsers.length,
        successful: successCount,
        failed: failedCount
      });
      
      setUploadProgress('Upload complete! Refreshing user list...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 🔥 Refresh to get ALL users again
      await fetchAllUsers();
      
      setIsUploading(false);
      setUploadProgress('');
      setIsUploadModalOpen(false);
      
      setUploadResult({
        show: true,
        success: successCount,
        failed: failedCount,
        failedUsers: failedUsers,
      });
    } catch (error: any) {
      console.error("❌ Bulk upload error:", error);
      setIsUploading(false);
      setUploadProgress('');
      
      setErrorModal({
        show: true,
        title: 'Upload Failed',
        message: error.message === "Failed to fetch" 
          ? 'Connection error. Please check if the backend is running on port 5000.'
          : error.message || 'An unknown error occurred.',
      });
    }
  };

  const handleExport = () => {
    const csv = convertToCSV(users);
    downloadCSV(csv, "users-export.csv");
    setSuccessModal({
      show: true,
      title: 'Export Successful',
      message: `Successfully exported ${users.length} users to CSV.`,
    });
  };

  const convertToCSV = (data: User[]) => {
    const headers = [
      "Student Number", "Last Name", "First Name", "Middle Name",
      "Role", "Year Level", "Membership Status", "Membership Type",
      "Registered By", "Registration Date", "Last Updated", "Status",
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
        setUsers(users.map(u => {
          if (u.id === updatedUser.id) {
            return {
              ...updatedUser,
              fullName: capitalizeWords(response.data.fullName),
              updatedAt: response.data.updatedAt,
            };
          }
          return u;
        }));
        
        setSuccessModal({
          show: true,
          title: 'User Updated',
          message: `${updatedUser.fullName} has been updated successfully.`,
        });
      }
    } catch (error: any) {
      console.error("Error updating user:", error);
      setErrorModal({
        show: true,
        title: 'Update Failed',
        message: error.message || 'Failed to update user.',
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
        const response = await fetchWithAuth(`${API_BASE_URL}/users/${userToDelete.id}`, {
          method: 'DELETE',
        });

        if (response.success) {
          setUsers(users.filter(u => u.id !== userToDelete.id));
          setSuccessModal({
            show: true,
            title: 'User Deleted',
            message: `${userToDelete.fullName} has been deleted successfully.`,
          });
        }
      } catch (error: any) {
        console.error("Error deleting user:", error);
        setErrorModal({
          show: true,
          title: 'Delete Failed',
          message: error.message || 'Failed to delete user.',
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
          setSuccessModal({
            show: true,
            title: 'Status Updated',
            message: `${userToToggle.fullName} has been ${status} successfully.`,
          });
        }
      } catch (error: any) {
        console.error("Error toggling user status:", error);
        setErrorModal({
          show: true,
          title: 'Status Update Failed',
          message: error.message || 'Failed to update user status.',
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

  const progressPercentage = uploadStats.total > 0 
    ? Math.round((uploadStats.current / uploadStats.total) * 100)
    : 0;

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
              Manage and view all registered users, members, officers, and faculty.
            </p>
          </div>

          <UserStats users={users} />

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1"></div>
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

      {/* Upload Progress Overlay - Same as before */}
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

      {/* Upload Result Modal */}
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
                    <div key={index} className="mb-2 pb-2 border-b border-red-200 last:border-0">
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
              onClick={() => setUploadResult({ show: false, success: 0, failed: 0, failedUsers: [] })}
              className="w-full px-6 py-3 bg-primary1 text-white font-raleway font-semibold rounded-lg hover:bg-primary1/90 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
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
                onClick={() => setSuccessModal({ show: false, title: '', message: '' })}
                className="w-full px-6 py-3 bg-primary1 text-white font-raleway font-semibold rounded-lg hover:bg-primary1/90 transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
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
                onClick={() => setErrorModal({ show: false, title: '', message: '' })}
                className="w-full px-6 py-3 bg-red-500 text-white font-raleway font-semibold rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Other Modals */}
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