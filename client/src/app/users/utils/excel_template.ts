import * as XLSX from "xlsx";

export function downloadExcelTemplate() {
  // Sample data to show the format
  const templateData = [
    {
      "Student Number": "2024-00001",
      "First Name": "Juan",
      "Last Name": "Dela Cruz",
      "Middle Name": "Santos",
      "Role": "member",
      "Year Level": 1,
      "Membership Type": "local",
    },
    {
      "Student Number": "2024-00002",
      "First Name": "Maria",
      "Last Name": "Reyes",
      "Middle Name": "",
      "Role": "officer",
      "Year Level": 3,
      "Membership Type": "regional",
    },
  ];

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

  // Set column widths
  worksheet["!cols"] = [
    { wch: 15 }, // Student Number
    { wch: 15 }, // First Name
    { wch: 15 }, // Last Name
    { wch: 15 }, // Middle Name
    { wch: 12 }, // Role
    { wch: 12 }, // Year Level
    { wch: 18 }, // Membership Type
  ];

  // Add instructions sheet
  const instructions = [
    ["INSTRUCTIONS FOR BULK USER UPLOAD"],
    [""],
    ["Column Requirements:"],
    ["1. Student Number - REQUIRED - Unique identifier (e.g., 2024-00001)"],
    ["2. First Name - REQUIRED - Student's first name"],
    ["3. Last Name - REQUIRED - Student's last name"],
    ["4. Middle Name - OPTIONAL - Student's middle name"],
    ["5. Role - OPTIONAL - Valid values: member, non-member, officer, faculty (Default: member)"],
    ["6. Year Level - OPTIONAL - Valid values: 1, 2, 3, 4, 5"],
    ["7. Membership Type - OPTIONAL - Valid values: local, regional"],
    [""],
    ["Notes:"],
    ["- Remove the sample data before uploading"],
    ["- Do not change the column headers"],
    ["- Student Number must be unique for each user"],
    ["- All fields are case-insensitive"],
    ["- Empty cells will use default values where applicable"],
  ];

  const instructionsSheet = XLSX.utils.aoa_to_sheet(instructions);
  XLSX.utils.book_append_sheet(workbook, instructionsSheet, "Instructions");

  // Set column width for instructions
  instructionsSheet["!cols"] = [{ wch: 80 }];

  // Generate file and trigger download
  XLSX.writeFile(workbook, "user-upload-template.xlsx");
}