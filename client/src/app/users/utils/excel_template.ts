import * as XLSX from "xlsx";

export function downloadExcelTemplate() {
  // Sample data to show the format
  const templateData = [
    {
      "Student Number": "23-2502-326",
      "Last Name": "Dela Cruz",
      "First Name": "Juan",
      "Middle Name": "Santos",
      "Year Level": 1,
      "Password": "123456",
      "Role": "member",
      "Membership Status": "member",
    },
    {
      "Student Number": "23-2502-327",
      "Last Name": "Reyes",
      "First Name": "Maria",
      "Middle Name": "",
      "Year Level": 3,
      "Password": "123456",
      "Role": "council-officer",
      "Membership Status": "regional",
    },
    {
      "Student Number": "23-2502-328",
      "Last Name": "Santos",
      "First Name": "Pedro",
      "Middle Name": "Garcia",
      "Year Level": 2,
      "Password": "123456",
      "Role": "committee-officer",
      "Membership Status": "local",
    },
  ];

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

  // Set column widths
  worksheet["!cols"] = [
    { wch: 15 }, // Student Number
    { wch: 15 }, // Last Name
    { wch: 15 }, // First Name
    { wch: 15 }, // Middle Name
    { wch: 12 }, // Year Level
    { wch: 12 }, // Password
    { wch: 12 }, // Role
    { wch: 18 }, // Membership Status
  ];

  // Add instructions sheet
  const instructions = [
    ["INSTRUCTIONS FOR BULK USER UPLOAD"],
    [""],
    ["Column Requirements (in exact order):"],
    ["1. Student Number - REQUIRED - Format: 23-2502-326"],
    ["2. Last Name - REQUIRED - Student's last name"],
    ["3. First Name - REQUIRED - Student's first name"],
    ["4. Middle Name - OPTIONAL - Student's middle name"],
    ["5. Year Level - OPTIONAL - Single number: 1, 2, 3, 4, or 5"],
    ["6. Password - OPTIONAL - Default: 123456 (will be hashed)"],
    ["7. Role - OPTIONAL - Valid values: member, non-member, council-officer, committee-officer, faculty (Default: member)"],
    ["8. Membership Status - OPTIONAL - Valid values: member, non-member, local, regional (Default: non-member)"],
    [""],
    ["Notes:"],
    ["- Remove the sample data before uploading"],
    ["- Do not change the column headers or their order"],
    ["- Student Number must be unique for each user"],
    ["- All fields are case-insensitive"],
    ["- Empty cells will use default values where applicable"],
    ["- Year Level should be a single number (1-5)"],
    ["- Password will default to 123456 if left empty"],
  ];

  const instructionsSheet = XLSX.utils.aoa_to_sheet(instructions);
  XLSX.utils.book_append_sheet(workbook, instructionsSheet, "Instructions");

  // Set column width for instructions
  instructionsSheet["!cols"] = [{ wch: 90 }];

  // Generate file and trigger download
  XLSX.writeFile(workbook, "user-upload-template.xlsx");
}