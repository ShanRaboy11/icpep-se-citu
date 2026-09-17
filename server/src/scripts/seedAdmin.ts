import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/user";

export const seedAdmin = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/icpep_db";

  console.log("🌱 Connecting to database:", mongoUri);
  await mongoose.connect(mongoUri);

  try {
    const adminStudentNumber = process.env.DEFAULT_ADMIN_ID || "ADMIN-001";
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "Admin@12345";
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || "admin@icpep-citu.org";

    const existingAdmin = await User.findOne({
      $or: [
        { studentNumber: adminStudentNumber.toUpperCase() },
        { role: "admin" },
      ],
    });

    if (existingAdmin) {
      console.log("ℹ️ Admin account already exists:");
      console.log(`   Student Number: ${existingAdmin.studentNumber}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Active: ${existingAdmin.isActive}`);
      return existingAdmin;
    }

    const admin = new User({
      studentNumber: adminStudentNumber.toUpperCase(),
      firstName: "Super",
      lastName: "Administrator",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      isActive: true,
      firstLogin: false,
      membershipStatus: {
        isMember: true,
        membershipType: "both",
      },
    });

    await admin.save();

    console.log("✅ Admin user created successfully!");
    console.log("-----------------------------------------");
    console.log(`👤 Student Number: ${adminStudentNumber.toUpperCase()}`);
    console.log(`🔑 Password:       ${adminPassword}`);
    console.log(`📧 Email:          ${adminEmail}`);
    console.log(`🛡️ Role:           admin`);
    console.log("-----------------------------------------");
    return admin;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("🔌 Database connection closed.");
    }
  }
};

// Run directly if invoked from CLI
if (require.main === module) {
  seedAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Failed to seed admin user:", err);
      process.exit(1);
    });
}
