"use client";

import { useState, useRef } from "react";
import {
  X,
  Upload,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
} from "lucide-react";
import * as XLSX from "xlsx";

// Define an interface for the raw data read from the Excel sheet
interface RawExcelRow {
  "Student Number"?: string | number;
  studentNumber?: string | number; // Alternate casing
  "Last Name"?: string;
  lastName?: string; // Alternate casing
  "First Name"?: string;
  firstName?: string; // Alternate casing
  "Middle Name"?: string;
  middleName?: string; // Alternate casing
  "Year Level"?: string | number;
  yearLevel?: string | number; // Alternate casing
  Role?: string;
  role?: string; // Alternate casing
  "Membership Status"?: string;
  membershipStatus?: string; // Alternate casing
  [key: string]: string | number | undefined; // More specific for other columns
}

interface UploadedUser {
  studentNumber: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  yearLevel?: number;
  role: string;
  membershipStatus: string;
  status?: "valid" | "error";
  error?: string;
}

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (users: UploadedUser[]) => void;
}

export default function ExcelUploadModal({
  isOpen,
  onClose,
  onUpload,
}: ExcelUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUsers, setUploadedUsers] = useState<UploadedUser[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (!validTypes.includes(selectedFile.type)) {
      alert("Please upload a valid Excel file (.xlsx, .xls, or .csv)");
      return;
    }

    setFile(selectedFile);
    processFile(selectedFile);
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Cast the result to an array of RawExcelRow with a more specific index type
      const jsonData = XLSX.utils.sheet_to_json<RawExcelRow>(worksheet, {
        defval: "",
      });

      const processedUsers = jsonData.map((row) => {
        // Removed 'index' as it's unused
        // Helper function to safely get string value, trim, and handle potential null/undefined
        const getStringValue = (val: string | number | undefined) =>
          String(val || "").trim();

        // Helper function to safely get number value
        const getNumberValue = (val: string | number | undefined) => {
          const num = Number(val);
          return isNaN(num) ? undefined : num;
        };

        const user: UploadedUser = {
          studentNumber: getStringValue(
            row["Student Number"] || row["studentNumber"]
          ),
          lastName: getStringValue(row["Last Name"] || row["lastName"]),
          firstName: getStringValue(row["First Name"] || row["firstName"]),
          middleName:
            getStringValue(row["Middle Name"] || row["middleName"]) ||
            undefined,
          yearLevel: getNumberValue(row["Year Level"] || row["yearLevel"]),
          role: getStringValue(
            row["Role"] || row["role"] || "student"
          ).toLowerCase(),
          membershipStatus: getStringValue(
            row["Membership Status"] || row["membershipStatus"] || "non-member"
          ).toLowerCase(),
          status: "valid",
        };

        // Validation
        const errors: string[] = [];

        if (!user.studentNumber) {
          errors.push("Student Number is required");
        }
        if (!user.lastName) {
          errors.push("Last Name is required");
        }
        if (!user.firstName) {
          errors.push("First Name is required");
        }
        if (
          user.role &&
          ![
            "student",
            "council-officer",
            "committee-officer",
            "faculty",
          ].includes(user.role)
        ) {
          errors.push("Invalid role");
        }
        if (
          user.yearLevel !== undefined &&
          (user.yearLevel < 1 || user.yearLevel > 5)
        ) {
          errors.push("Year Level must be between 1-5");
        }
        if (
          user.membershipStatus &&
          !["local", "regional", "both", "non-member"].includes(
            user.membershipStatus
          )
        ) {
          errors.push("Invalid membership status");
        }

        if (errors.length > 0) {
          user.status = "error";
          user.error = errors.join(", ");
        }

        return user;
      });

      setUploadedUsers(processedUsers);
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Error processing file. Please check the file format.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = () => {
    const validUsers = uploadedUsers.filter((u) => u.status === "valid");
    if (validUsers.length === 0) {
      alert("No valid users to upload. Please fix the errors first.");
      return;
    }
    onUpload(validUsers);
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setUploadedUsers([]);
    setIsProcessing(false);
    onClose();
  };

  const validCount = uploadedUsers.filter((u) => u.status === "valid").length;
  const errorCount = uploadedUsers.filter((u) => u.status === "error").length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-primary1/5 to-secondary2/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary1/10 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-primary1" />
            </div>
            <div>
              <h2 className="font-rubik text-2xl font-bold text-primary3">
                Upload Excel File
              </h2>
              <p className="font-raleway text-sm text-gray-600">
                Import multiple users from an Excel file
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Upload Area */}
          {!file ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                dragActive
                  ? "border-primary1 bg-primary1/5"
                  : "border-gray-300 hover:border-primary1/50"
              }`}
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="font-raleway text-lg font-semibold text-gray-700 mb-2">
                Drop your Excel file here
              </h3>
              <p className="font-raleway text-sm text-gray-500 mb-4">
                or click to browse (supports .xlsx, .xls, .csv)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-gradient-to-r from-primary1 to-primary1/90 text-white font-raleway font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Select File
              </button>
            </div>
          ) : (
            <>
              {/* File Info */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-primary1" />
                  <div>
                    <p className="font-raleway font-semibold text-gray-900">
                      {file.name}
                    </p>
                    <p className="font-raleway text-sm text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setUploadedUsers([]);
                  }}
                  className="text-red-600 hover:text-red-700 font-raleway text-sm font-semibold"
                >
                  Remove
                </button>
              </div>

              {/* Statistics */}
              {uploadedUsers.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="font-raleway text-sm text-blue-600 mb-1">
                      Total Rows
                    </p>
                    <p className="font-rubik text-2xl font-bold text-blue-700">
                      {uploadedUsers.length}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="font-raleway text-sm text-green-600 mb-1">
                      Valid
                    </p>
                    <p className="font-rubik text-2xl font-bold text-green-700">
                      {validCount}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <p className="font-raleway text-sm text-red-600 mb-1">
                      Errors
                    </p>
                    <p className="font-rubik text-2xl font-bold text-red-700">
                      {errorCount}
                    </p>
                  </div>
                </div>
              )}

              {/* Preview Table */}
              {uploadedUsers.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left font-raleway font-semibold text-gray-700">
                            Status
                          </th>
                          <th className="px-4 py-2 text-left font-raleway font-semibold text-gray-700">
                            Student #
                          </th>
                          <th className="px-4 py-2 text-left font-raleway font-semibold text-gray-700">
                            Name
                          </th>
                          <th className="px-4 py-2 text-left font-raleway font-semibold text-gray-700">
                            Year
                          </th>
                          <th className="px-4 py-2 text-left font-raleway font-semibold text-gray-700">
                            Role
                          </th>
                          <th className="px-4 py-2 text-left font-raleway font-semibold text-gray-700">
                            Membership
                          </th>
                          <th className="px-4 py-2 text-left font-raleway font-semibold text-gray-700">
                            Error
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {uploadedUsers.map((user, index) => (
                          <tr
                            key={index}
                            className={
                              user.status === "error" ? "bg-red-50" : ""
                            }
                          >
                            <td className="px-4 py-2">
                              {user.status === "valid" ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-red-600" />
                              )}
                            </td>
                            <td className="px-4 py-2 font-raleway text-gray-900">
                              {user.studentNumber}
                            </td>
                            <td className="px-4 py-2 font-raleway text-gray-900">
                              {`${user.firstName} ${user.middleName || ""} ${
                                user.lastName
                              }`.trim()}
                            </td>
                            <td className="px-4 py-2 font-raleway text-gray-700">
                              {user.yearLevel || "N/A"}
                            </td>
                            <td className="px-4 py-2 font-raleway text-gray-700">
                              {user.role}
                            </td>
                            <td className="px-4 py-2 font-raleway text-gray-700">
                              {user.membershipStatus}
                            </td>
                            <td className="px-4 py-2 font-raleway text-xs text-red-600">
                              {user.error || ""}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-raleway font-semibold text-blue-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Excel File Format
              </h4>
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/user-upload-template.xlsx";
                  link.download = "user-upload-template.xlsx";
                  link.click();
                }}
                className="px-3 py-1 bg-blue-600 text-white text-xs font-raleway font-semibold rounded hover:bg-blue-700 transition-colors"
              >
                Download Template
              </button>
            </div>
            <p className="font-raleway text-sm text-blue-800 mb-2">
              Your Excel file should have the following columns in this exact
              order:
            </p>
            <ul className="font-raleway text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>
                <strong>Student Number</strong> (required) - Format: 23-2502-326
              </li>
              <li>
                <strong>Last Name</strong> (required)
              </li>
              <li>
                <strong>First Name</strong> (required)
              </li>
              <li>Middle Name (optional)</li>
              <li>
                <strong>Year Level</strong> (optional) - Single number: 1, 2, 3,
                4, or 5
              </li>
              <li>
                Role (optional) - student, council-officer, committee-officer,
                faculty (Default: member)
              </li>
              <li>
                <strong>Membership Status</strong> (optional) - member,
                non-member, local, regional (Default: non-member)
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <button
            onClick={handleClose}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-raleway font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={validCount === 0 || isProcessing}
            className="px-6 py-2 bg-gradient-to-r from-primary1 to-primary1/90 text-white font-raleway font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isProcessing
              ? "Processing..."
              : `Upload ${validCount} User${validCount !== 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
