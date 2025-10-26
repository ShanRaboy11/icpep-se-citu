"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
// Import User, and the specific types UserRole, MembershipType
import { users as initialUsers, User, UserRole, MembershipType } from "./utils/user";
import Header from "../components/header";
import Footer from "../components/footer";
import UsersTable from "./components/users_table";
import UserStats from "./components/stats";
import ExcelUploadModal from "./components/excel_upload_modal";
// Import UploadedUser from the modal component file
import { UploadedUser } from "./components/excel_upload_modal";
import AddUserModal, { NewUser } from "./components/add_user_modal";
import ConfirmDialog from "./components/confirm_dialog";
import ViewUserModal from "./components/view_user_modal";
import EditUserModal from "./components/edit_user_modal";
import Grid from "../components/grid";
import { ArrowLeft, UserPlus, Download, Upload } from "lucide-react";

export default function UsersListPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Confirmation Dialogs
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);

  // View and Edit Modals
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleAddUser = () => {
    setIsAddUserModalOpen(true);
  };

  const handleAddUserSubmit = async (newUser: NewUser) => {
    try {
      // For now, just add to local state
      const user: User = {
        id: `new-${Date.now()}`,
        studentNumber: newUser.studentNumber,
        lastName: newUser.lastName,
        firstName: newUser.firstName,
        middleName: newUser.middleName || null,
        fullName: `${newUser.firstName} ${newUser.middleName || ""} ${newUser.lastName}`.trim(),
        role: newUser.role as UserRole, // FIX 1: Cast to UserRole
        yearLevel: newUser.yearLevel,
        membershipStatus: {
          isMember: newUser.membershipStatus === "member" || newUser.membershipStatus === "local" || newUser.membershipStatus === "regional",
          membershipType: (newUser.membershipStatus === "local" ? "local" : newUser.membershipStatus === "regional" ? "regional" : null) as MembershipType, // Cast to MembershipType
        },
        profilePicture: null,
        isActive: true,
        registeredBy: null, // This would typically be the ID of the user performing the registration
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUsers([user, ...users]);
      alert("User added successfully!");
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user. Please try again.");
    }
  };

  const handleExcelUpload = async (uploadedUsers: UploadedUser[]) => { // FIX 2: Type uploadedUsers as UploadedUser[]
    try {
      // For now, just add to local state
      const newUsers: User[] = uploadedUsers.map((user, index) => {
        // Safely determine membership type based on the string from the uploaded file
        let membershipType: MembershipType = null;
        if (user.membershipStatus === "local") {
          membershipType = "local";
        } else if (user.membershipStatus === "regional") {
          membershipType = "regional";
        }

        return {
          id: `uploaded-${Date.now()}-${index}`,
          studentNumber: user.studentNumber,
          lastName: user.lastName,
          firstName: user.firstName,
          middleName: user.middleName || null,
          fullName: `${user.firstName} ${user.middleName || ""} ${user.lastName}`.trim(),
          role: user.role as UserRole, // FIX 3: Cast to UserRole
          yearLevel: user.yearLevel,
          membershipStatus: {
            isMember: ["member", "local", "regional"].includes(user.membershipStatus),
            membershipType: membershipType,
          },
          profilePicture: null,
          isActive: true,
          registeredBy: null, // This would typically be the ID of the user performing the upload
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

      setUsers([...newUsers, ...users]);
      alert(`Successfully uploaded ${newUsers.length} users!`);
    } catch (error) {
      console.error("Error uploading users:", error);
      alert("Failed to upload users. Please try again.");
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

  const handleSaveEdit = (updatedUser: User) => {
    // TODO: Call PUT /api/users/${updatedUser.id}

    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    alert(`${updatedUser.fullName} has been updated successfully!`);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      // TODO: Call DELETE /api/users/${userToDelete.id}

      setUsers(users.filter(u => u.id !== userToDelete.id));
      alert(`${userToDelete.fullName} has been deleted successfully!`);
      setUserToDelete(null);
    }
  };

  const handleToggleActive = (user: User) => {
    setUserToToggle(user);
    setIsStatusConfirmOpen(true);
  };

  const confirmToggleActive = () => {
    if (userToToggle) {
      // TODO: Call PATCH /api/users/${userToToggle.id}
      // body: { isActive: !userToToggle.isActive }

      setUsers(users.map(u =>
        u.id === userToToggle.id
          ? { ...u, isActive: !u.isActive, updatedAt: new Date().toISOString() }
          : u
      ));

      const status = userToToggle.isActive ? 'deactivated' : 'activated';
      alert(`${userToToggle.fullName} has been ${status} successfully!`);
      setUserToToggle(null);
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

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
            {/* This will hold filters from UsersTable component */}
            <div className="flex-1">
              {/* Filters will be rendered here by passing as prop */}
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
                className="flex items-center gap-2 px-4 py-2 border-2 border-primary1 text-primary1 font-raleway font-semibold rounded-lg hover:bg-primary1 hover:text-white transition-colors duration-300"
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

      {/* Excel Upload Modal */}
      <ExcelUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
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