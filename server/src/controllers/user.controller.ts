import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import mongoose from "mongoose";
import { sendNotification } from "../utils/notification";

// Interface for request with authenticated user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    userId: string;
  };
}

// Get all users with filtering and sorting
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      role,
      membershipType,
      isActive,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = "1",
      limit = "50",
    } = req.query;

    // Build filter object
    const filter: any = {};

    if (role && role !== "all") {
      filter.role = role;
    }

    if (membershipType && membershipType !== "all") {
      if (membershipType === "non-member") {
        filter["membershipStatus.isMember"] = false;
      } else {
        filter["membershipStatus.membershipType"] = membershipType;
      }
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === "asc" ? 1 : -1;

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const users = await User.find(filter)
      .populate("registeredBy", "firstName lastName middleName")
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// Get single user by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    const user = await User.findById(id).populate(
      "registeredBy",
      "firstName lastName middleName"
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};

// Create new user
export const createUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      studentNumber,
      lastName,
      firstName,
      middleName,
      password = "123456",
      role = "student",
      yearLevel,
      membershipStatus,
    } = req.body;

    console.log("📝 CREATE USER - req.user:", req.user);
    console.log(
      "📝 CREATE USER - membershipStatus received:",
      membershipStatus
    );

    // Validation
    if (!studentNumber || !lastName || !firstName) {
      res.status(400).json({
        success: false,
        message: "Student number, first name, and last name are required",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      studentNumber: studentNumber.toUpperCase(),
    });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User with this student number already exists",
      });
      return;
    }

    // ✅ NEW: Handle membership status - supports both string and object formats
    let membershipStatusObj: {
      isMember: boolean;
      membershipType: "local" | "regional" | "both" | null;
    } = {
      isMember: false,
      membershipType: null,
    };

    // Check if membershipStatus is already an object (from Excel upload)
    if (membershipStatus && typeof membershipStatus === "object") {
      membershipStatusObj = {
        isMember: membershipStatus.isMember || false,
        membershipType: membershipStatus.membershipType || null,
      };
    }
    // Handle string format (from manual add form)
    else if (membershipStatus && typeof membershipStatus === "string") {
      const statusLower = membershipStatus.toLowerCase();

      if (statusLower === "local") {
        membershipStatusObj = {
          isMember: true,
          membershipType: "local",
        };
      } else if (statusLower === "regional") {
        membershipStatusObj = {
          isMember: true,
          membershipType: "regional",
        };
      } else if (statusLower === "both") {
        membershipStatusObj = {
          isMember: true,
          membershipType: "both",
        };
      } else if (statusLower === "member") {
        membershipStatusObj = {
          isMember: true,
          membershipType: null, // Generic member without specific type
        };
      }
      // 'non-member' or any other value defaults to the initial values
    }

    console.log("✅ Processed membershipStatus:", membershipStatusObj);

    // Create user
    const newUser = await User.create({
      studentNumber,
      lastName,
      firstName,
      middleName: middleName || null,
      password,
      role,
      yearLevel,
      membershipStatus: membershipStatusObj,
      registeredBy: req.user?.id || null,
    });

    // Populate registeredBy before sending response
    await newUser.populate("registeredBy", "firstName lastName middleName");

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error: any) {
    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};

// Bulk upload users
export const bulkUploadUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { users } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      res.status(400).json({
        success: false,
        message: "Users array is required",
      });
      return;
    }

    console.log(`📦 Processing bulk upload of ${users.length} users...`);
    console.log("📦 BULK UPLOAD - req.user:", req.user);

    interface SuccessResult {
      studentNumber: string;
      fullName: string;
      id: string;
    }

    interface FailedResult {
      studentNumber: string;
      reason: string;
      data?: any;
    }

    const results: {
      success: SuccessResult[];
      failed: FailedResult[];
    } = {
      success: [],
      failed: [],
    };

    for (const userData of users) {
      try {
        // Validate required fields
        if (
          !userData.studentNumber ||
          !userData.firstName ||
          !userData.lastName
        ) {
          results.failed.push({
            studentNumber: userData.studentNumber || "UNKNOWN",
            reason:
              "Missing required fields (studentNumber, firstName, lastName)",
            data: userData,
          });
          continue;
        }

        // Check if user exists
        const existingUser = await User.findOne({
          studentNumber: userData.studentNumber.toUpperCase(),
        });

        if (existingUser) {
          results.failed.push({
            studentNumber: userData.studentNumber,
            reason: "User with this student number already exists",
            data: userData,
          });
          continue;
        }

        // ✅ NEW: Handle membership status - supports both string and object formats
        let membershipStatusObj: {
          isMember: boolean;
          membershipType: "local" | "regional" | "both" | null;
        } = {
          isMember: false,
          membershipType: null,
        };

        // Check if membershipStatus is already an object (from frontend processing)
        if (
          userData.membershipStatus &&
          typeof userData.membershipStatus === "object"
        ) {
          membershipStatusObj = {
            isMember: userData.membershipStatus.isMember || false,
            membershipType: userData.membershipStatus.membershipType || null,
          };
        }
        // Handle string format (from Excel file)
        else if (
          userData.membershipStatus &&
          typeof userData.membershipStatus === "string"
        ) {
          const statusLower = userData.membershipStatus.toLowerCase().trim();

          if (statusLower === "local") {
            membershipStatusObj = {
              isMember: true,
              membershipType: "local",
            };
          } else if (statusLower === "regional") {
            membershipStatusObj = {
              isMember: true,
              membershipType: "regional",
            };
          } else if (statusLower === "both") {
            membershipStatusObj = {
              isMember: true,
              membershipType: "both",
            };
          } else if (statusLower === "member") {
            membershipStatusObj = {
              isMember: true,
              membershipType: null, // Generic member
            };
          }
          // 'non-member' or any other value defaults to initial values
        }

        // Create new user
        const newUser = await User.create({
          studentNumber: userData.studentNumber,
          lastName: userData.lastName,
          firstName: userData.firstName,
          middleName: userData.middleName || null,
          password: userData.password || "123456",
          role: userData.role || "student",
          yearLevel: userData.yearLevel || null,
          membershipStatus: membershipStatusObj,
          registeredBy: req.user?.id || null,
        });

        results.success.push({
          studentNumber: userData.studentNumber,
          fullName: newUser.fullName,
          id: newUser._id.toString(),
        });

        console.log(
          `✅ Created user: ${newUser.fullName} (${newUser.studentNumber}) - Member: ${membershipStatusObj.isMember}, Type: ${membershipStatusObj.membershipType}`
        );
      } catch (error: any) {
        console.error(
          `❌ Failed to create user ${userData.studentNumber}:`,
          error.message
        );

        results.failed.push({
          studentNumber: userData.studentNumber || "UNKNOWN",
          reason: error.message || "Unknown error occurred",
          data: userData,
        });
      }
    }

    console.log(
      `✅ Bulk upload complete: ${results.success.length} succeeded, ${results.failed.length} failed`
    );

    res.status(201).json({
      success: true,
      message: `Bulk upload completed. ${results.success.length} succeeded, ${results.failed.length} failed`,
      data: results,
    });
  } catch (error: any) {
    console.error("❌ Bulk upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error during bulk upload",
      error: error.message,
    });
  }
};

// Update user
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    // Fetch original user to compare changes
    const originalUser = await User.findById(id);
    if (!originalUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Don't allow updating certain fields directly
    delete updates.createdAt;
    delete updates.registeredBy;

    // If updating password, it will be hashed by pre-save middleware

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate("registeredBy", "firstName lastName middleName");

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Notification Logic
    // 1. Membership Notification
    // Check if membership status is being updated and the user is a member
    if (updates.membershipStatus && updatedUser.membershipStatus.isMember) {
      const isNewMember = !originalUser.membershipStatus.isMember;

      await sendNotification(
        updatedUser._id,
        isNewMember
          ? "[MEMBERSHIP] Welcome to ICPEP-SE!"
          : "[MEMBERSHIP] Membership Updated",
        isNewMember
          ? "Your membership status has been updated to Member."
          : `Your membership details have been updated. Type: ${updatedUser.membershipStatus.membershipType}`,
        "membership",
        updatedUser._id,
        "Membership" as any
      );
    }

    // 2. Profile Update
    if (updates.password) {
      await sendNotification(
        updatedUser._id,
        "[PROFILE] Password Updated",
        "Your password has been successfully updated.",
        "system",
        updatedUser._id,
        null
      );
    } else {
      const profileFields = [
        "firstName",
        "lastName",
        "middleName",
        "studentNumber",
        "yearLevel",
        "email",
        "profilePicture",
      ];
      const changedFields = profileFields.filter(
        (field) =>
          updates[field] !== undefined &&
          updates[field] !== (originalUser as any)[field]
      );

      if (changedFields.length > 0) {
        await sendNotification(
          updatedUser._id,
          "[PROFILE] Profile Updated",
          `Your profile information (${changedFields.join(
            ", "
          )}) has been updated.`,
          "system",
          updatedUser._id,
          null
        );
      }
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};

// Toggle user active status
export const toggleUserStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    user.isActive = !user.isActive;
    await user.save();

    await user.populate("registeredBy", "firstName lastName middleName");

    res.status(200).json({
      success: true,
      message: `User ${
        user.isActive ? "activated" : "deactivated"
      } successfully`,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error toggling user status",
      error: error.message,
    });
  }
};

// Delete user
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: { id },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

// Get user statistics
export const getUserStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const members = await User.countDocuments({
      "membershipStatus.isMember": true,
    });
    const localMembers = await User.countDocuments({
      "membershipStatus.membershipType": "local",
    });
    const regionalMembers = await User.countDocuments({
      "membershipStatus.membershipType": "regional",
    });
    const bothMembers = await User.countDocuments({
      "membershipStatus.membershipType": "both",
    });
    const nonMembers = await User.countDocuments({
      "membershipStatus.isMember": false,
    });

    const roleStats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    const yearLevelStats = await User.aggregate([
      {
        $group: {
          _id: "$yearLevel",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
        members,
        nonMembers,
        membershipBreakdown: {
          local: localMembers,
          regional: regionalMembers,
          both: bothMembers,
        },
        roleStats,
        yearLevelStats,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching user statistics",
      error: error.message,
    });
  }
};

// Search users
export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query) {
      res.status(400).json({
        success: false,
        message: "Search query is required",
      });
      return;
    }

    const searchRegex = new RegExp(query as string, "i");

    const users = await User.find({
      $or: [
        { studentNumber: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { middleName: searchRegex },
      ],
    })
      .populate("registeredBy", "firstName lastName middleName")
      .limit(20);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error searching users",
      error: error.message,
    });
  }
};
