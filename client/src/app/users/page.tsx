"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { users as initialUsers, User } from "./utils/user";
import { downloadExcelTemplate } from "./utils/excel_template";
import Header from "../components/header";
import Footer from "../components/footer";
import UsersTable from "./components/users_table";
import UserStats from "./components/stats";
import ExcelUploadModal from "./components/excel_upload_modal";
import Grid from "../components/grid";
import { ArrowLeft, UserPlus, Download, Upload, FileDown } from "lucide-react";

export default function UsersListPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleAddUser = () => {
    // Navigate to add user page
    router.push("/users/add");
  };

  const handleExcelUpload = async (uploadedUsers: any[]) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/users/bulk-upload', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ users: uploadedUsers }),
      // });
      // const data = await response.json();

      // For now, just add to local state
      const newUsers: User[] = uploadedUsers.map((user, index) => ({
        id: `uploaded-${Date.now()}-${index}`,
        studentNumber: user.studentNumber,
        lastName: user.lastName,
        firstName: user.firstName,
        middleName: user.middleName || null,
        fullName: `${user.firstName} ${user.middleName || ""} ${user.lastName}`.trim(),
        role: user.role as any,
        yearLevel: user.yearLevel,
        membershipStatus: {
          isMember: user.role === "member" || user.role === "officer",
          membershipType: user.membershipType || (user.role === "member" ? "local" : null),
        },
        profilePicture: null,
        isActive: true,
        registeredBy: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

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

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-12">
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

          {/* Header Section */}
          <div className="mb-12">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
                  <div className="h-2 w-2 rounded-full bg-primary1"></div>
                  <span className="font-raleway text-sm font-semibold text-primary1">
                    User Management
                  </span>
                </div>
                <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
                  Registered Users
                </h1>
                <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-2xl">
                  Manage and view all registered users, members, officers, and faculty.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={downloadExcelTemplate}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-secondary2 text-secondary2 font-raleway font-semibold rounded-lg hover:bg-secondary2 hover:text-white transition-colors duration-300"
                  title="Download Excel template"
                >
                  <FileDown className="w-4 h-4" />
                  Template
                </button>
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

            {/* Stats Cards */}
            <UserStats users={users} />
          </div>

          {/* Users Table */}
          <UsersTable users={users} />
        </main>
        <Footer />
      </div>

      {/* Excel Upload Modal */}
      <ExcelUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleExcelUpload}
      />
    </div>
  );
}