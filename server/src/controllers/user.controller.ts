import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { sendNotification } from "../utils/notification";
import { escapeRegExp } from "../utils/regex";
import { getDefaultPassword } from "../config/env";

// Interface for request with authenticated user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    userId: string;
  };
}

// Only admins may hand out the admin role (e.g. via an Excel upload).
const assignableRole = (role: string | undefined, requesterRole?: string) =>
  role === "admin" && requesterRole !== "admin" ? "student" : role;

const PUBLIC_DIRECTORY_ROLES = ["council-officer", "committee-officer"];
const PUBLIC_DIRECTORY_FIELDS =
  "firstName lastName middleName role position department councilPosition committeeDepartment committeeTitle";

// Get all users with filtering and sorting
export const getAllUsers = async (
  req: Request,
  res: Response,
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

    // Anyone logged in can look up officers (e.g. ComMeet availability), but
    // only officers/admins get the full directory with everyone's details.
    const canSeeEveryone =
      req.user?.role === "council-officer" || req.user?.role === "admin";

    const filter: any = {};

    if (canSeeEveryone) {
      if (role && role !== "all") {
        filter.role = role;
      }
    } else {
      const requested = role && role !== "all" ? String(role) : null;
      filter.role =
        requested === null
          ? { $in: PUBLIC_DIRECTORY_ROLES }
          : PUBLIC_DIRECTORY_ROLES.includes(requested)
            ? requested
            : { $in: [] };
    }

    if (canSeeEveryone && membershipType && membershipType !== "all") {
      if (membershipType === "non-member") {
        filter["membershipStatus.isMember"] = false;
      } else {
        filter["membershipStatus.membershipType"] = membershipType;
      }
    }

    if (!canSeeEveryone) {
      filter.isActive = true;
    } else if (isActive !== undefined) {
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
    let query = User.find(filter);
    query = canSeeEveryone
      ? query.populate("registeredBy", "firstName lastName middleName")
      : query.select(PUBLIC_DIRECTORY_FIELDS);
    const users = await query.sort(sort).skip(skip).limit(limitNum).lean();

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
  res: Response,
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
      "firstName lastName middleName",
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
  res: Response,
): Promise<void> => {
  try {
    const {
      studentNumber,
      lastName,
      firstName,
      middleName,
      password: submittedPassword,
      role = "student",
      yearLevel,
      membershipStatus,
    } = req.body;
    const password = submittedPassword || getDefaultPassword();

    // Validation
    if (!studentNumber || !lastName || !firstName) {
      res.status(400).json({
        success: false,
        message: "Student number, first name, and last name are required",
      });
      return;
    }

    if (role === "admin" && req.user?.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only admins can create admin accounts",
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

    // Handle membership status - supports both string and object formats
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
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};

type UserDoc = InstanceType<typeof User>;

type MembershipStatus = {
  isMember: boolean;
  membershipType: "local" | "regional" | "both" | null;
};

interface UploadSuccess {
  studentNumber: string;
  fullName: string;
  id: string;
}

interface UploadFailure {
  studentNumber: string;
  reason: string;
  data?: any;
}

const UPLOAD_BATCH_SIZE = 25;
const MIN_PASSWORD_LENGTH = 6;

// bcryptjs is pure JavaScript, so hashing one password per new account made big
// uploads crawl (and block the server). Most rows share the default password,
// so each distinct password is hashed once per upload and reused.
const createPasswordHasher = () => {
  const hashes = new Map<string, Promise<string>>();
  return (plain: string) => {
    let hash = hashes.get(plain);
    if (!hash) {
      hash = bcrypt.hash(plain, 10);
      hashes.set(plain, hash);
    }
    return hash;
  };
};

const createUserWithHashedPassword = async (
  data: Record<string, unknown> & { password: string },
  hashPassword: (plain: string) => Promise<string>,
) => {
  if (data.password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    );
  }
  const user = new User({ ...data, password: await hashPassword(data.password) });
  user.$locals.passwordAlreadyHashed = true;
  return user.save();
};
const MISSING_FIELDS_REASON =
  "Missing required fields (studentNumber, firstName, lastName)";

// Accepts either an object (already processed by the client) or the string
// found in an Excel cell.
const parseMembershipStatus = (value: unknown): MembershipStatus => {
  if (value && typeof value === "object") {
    const status = value as Partial<MembershipStatus>;
    return {
      isMember: status.isMember || false,
      membershipType: status.membershipType || null,
    };
  }
  if (typeof value === "string") {
    const status = value.toLowerCase().trim();
    if (status === "local" || status === "regional" || status === "both") {
      return { isMember: true, membershipType: status };
    }
    if (status === "member") {
      return { isMember: true, membershipType: null };
    }
  }
  return { isMember: false, membershipType: null };
};

// Splits an upload into the rows to process (the last row wins when a
// student number repeats) and the rows missing required fields.
const splitUploadRows = (rows: any[]) => {
  const valid = new Map<string, any>();
  const invalid: any[] = [];
  for (const row of rows) {
    if (row.studentNumber && row.firstName && row.lastName) {
      valid.set(String(row.studentNumber).toUpperCase(), row);
    } else {
      invalid.push(row);
    }
  }
  return { valid: [...valid.entries()], invalid };
};

const findUsersByStudentNumber = async (studentNumbers: string[]) => {
  const users = await User.find({ studentNumber: { $in: studentNumbers } });
  return new Map<string, UserDoc>(
    users.map((user) => [user.studentNumber.toUpperCase(), user]),
  );
};

// Runs the worker over the items a batch at a time, so a large roster
// doesn't turn into hundreds of strictly sequential database round-trips.
const inBatches = async <T>(
  items: T[],
  worker: (item: T, index: number) => Promise<void>,
) => {
  for (let i = 0; i < items.length; i += UPLOAD_BATCH_SIZE) {
    await Promise.all(
      items
        .slice(i, i + UPLOAD_BATCH_SIZE)
        .map((item, offset) => worker(item, i + offset)),
    );
  }
};

// Bulk upload users
export const bulkUploadUsers = async (
  req: AuthRequest,
  res: Response,
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

    const { valid, invalid } = splitUploadRows(users);
    const existingUsers = await findUsersByStudentNumber(
      valid.map(([studentNumber]) => studentNumber),
    );

    const failed: UploadFailure[] = invalid.map((row) => ({
      studentNumber: row.studentNumber || "UNKNOWN",
      reason: MISSING_FIELDS_REASON,
      data: row,
    }));
    const outcomes: (UploadSuccess | null)[] = valid.map(() => null);
    const hashPassword = createPasswordHasher();

    await inBatches(valid, async ([studentNumber, userData], index) => {
      try {
        const membershipStatus = parseMembershipStatus(
          userData.membershipStatus,
        );
        const existingUser = existingUsers.get(studentNumber);

        if (existingUser) {
          // Update existing user but keep password
          existingUser.firstName = userData.firstName;
          existingUser.lastName = userData.lastName;
          if (userData.middleName !== undefined)
            existingUser.middleName = userData.middleName || null;

          if (userData.role && existingUser.role !== "admin") {
            existingUser.role = assignableRole(
              userData.role,
              req.user?.role,
            ) as IUser["role"];
          }

          if (userData.yearLevel) existingUser.yearLevel = userData.yearLevel;

          existingUser.membershipStatus = membershipStatus;

          await existingUser.save();

          outcomes[index] = {
            studentNumber: userData.studentNumber,
            fullName: existingUser.fullName,
            id: existingUser._id.toString(),
          };
          return;
        }

        const newUser = await createUserWithHashedPassword(
          {
            studentNumber: userData.studentNumber,
            lastName: userData.lastName,
            firstName: userData.firstName,
            middleName: userData.middleName || null,
            password: userData.password || getDefaultPassword(),
            role: assignableRole(userData.role, req.user?.role) || "student",
            yearLevel: userData.yearLevel || null,
            membershipStatus,
            registeredBy: req.user?.id || null,
          },
          hashPassword,
        );

        outcomes[index] = {
          studentNumber: userData.studentNumber,
          fullName: newUser.fullName,
          id: newUser._id.toString(),
        };
      } catch (error: any) {
        failed.push({
          studentNumber: userData.studentNumber || "UNKNOWN",
          reason: error.message || "Unknown error occurred",
          data: userData,
        });
      }
    });

    const success = outcomes.filter(
      (outcome): outcome is UploadSuccess => outcome !== null,
    );

    res.status(201).json({
      success: true,
      message: `Bulk upload completed. ${success.length} succeeded, ${failed.length} failed`,
      data: { success, failed },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error during bulk upload",
      error: error.message,
    });
  }
};

// Sync upload users - Phase 1: deactivate users not in the Excel (admin accounts are never touched)
export const syncDeleteUsers = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { studentNumbers } = req.body;

    if (!Array.isArray(studentNumbers) || studentNumbers.length === 0) {
      res.status(400).json({
        success: false,
        message: "studentNumbers array is required",
      });
      return;
    }

    const uploadedStudentNumbers = studentNumbers.map((sn: string) =>
      sn.toUpperCase(),
    );

    // Deactivate (rather than hard-delete) everyone missing from the roster:
    // deleting permanently destroyed anything referencing them (the Officers
    // Archive's sourceUserId link, registeredBy on other accounts, etc.) every
    // time a graduated officer dropped off a re-uploaded roster. Deactivating
    // already blocks login (see auth.controller's isActive check) with none of
    // the data loss — and syncUpsertBatch reactivates anyone who reappears.
    const missingUsers = await User.find({
      studentNumber: { $nin: uploadedStudentNumbers },
    }).select("studentNumber firstName middleName lastName role isActive");

    const summarize = (user: UserDoc) => ({
      studentNumber: user.studentNumber,
      fullName: user.fullName,
      id: user._id.toString(),
    });

    const skippedAdmins = missingUsers
      .filter((user) => user.role === "admin")
      .map(summarize);
    const toDeactivate = missingUsers.filter(
      (user) => user.role !== "admin" && user.isActive,
    );

    if (toDeactivate.length > 0) {
      await User.updateMany(
        { _id: { $in: toDeactivate.map((user) => user._id) } },
        { $set: { isActive: false } },
      );
    }
    const deactivated = toDeactivate.map(summarize);

    res.status(200).json({
      success: true,
      message: `Delete phase complete. ${deactivated.length} deactivated, ${skippedAdmins.length} admins protected.`,
      data: { deactivated, skippedAdmins },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error during sync delete",
      error: error.message,
    });
  }
};

// Sync upload users - Phase 2: Create or update a batch of users
export const syncUpsertBatch = async (
  req: AuthRequest,
  res: Response,
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

    const { valid, invalid } = splitUploadRows(users);
    const existingUsers = await findUsersByStudentNumber(
      valid.map(([studentNumber]) => studentNumber),
    );

    const failedUsers: UploadFailure[] = invalid.map((row) => ({
      studentNumber: row.studentNumber || "UNKNOWN",
      reason: MISSING_FIELDS_REASON,
      data: row,
    }));
    let successful = 0;
    const hashPassword = createPasswordHasher();

    await inBatches(valid, async ([studentNumber, userData]) => {
      try {
        const membershipStatus = parseMembershipStatus(
          userData.membershipStatus,
        );
        const existingUser = existingUsers.get(studentNumber);

        if (existingUser) {
          // Being in the current roster means they're active again,
          // regardless of whether a previous sync deactivated them.
          existingUser.isActive = true;

          if (existingUser.role === "admin") {
            // Admin: update membership status and year level, clear position (role stays admin)
            existingUser.membershipStatus = membershipStatus;
            existingUser.position = undefined; // Admins don't need a position
            if (userData.yearLevel) existingUser.yearLevel = userData.yearLevel;
            await existingUser.save();
            successful++;
            return;
          }

          // Non-admin user: update Year Level, Position, Membership Status, Role, and name fields
          if (userData.yearLevel) existingUser.yearLevel = userData.yearLevel;

          existingUser.membershipStatus = membershipStatus;

          if (userData.role) {
            const newRole = userData.role.toLowerCase();
            if (
              ["student", "council-officer", "committee-officer", "faculty"].includes(
                newRole,
              )
            ) {
              existingUser.role = newRole as IUser["role"];
            }
          }

          // Position: only keep for officers, clear for students/non-officers
          const finalRole = existingUser.role;
          if (finalRole === "council-officer" || finalRole === "committee-officer") {
            existingUser.position = userData.position || null;
          } else {
            existingUser.position = undefined;
          }

          if (userData.firstName) existingUser.firstName = userData.firstName;
          if (userData.lastName) existingUser.lastName = userData.lastName;
          if (userData.middleName !== undefined)
            existingUser.middleName = userData.middleName || null;

          await existingUser.save();
          successful++;
          return;
        }

        const role =
          assignableRole(userData.role?.toLowerCase(), req.user?.role) ||
          "student";
        // Only officers get positions
        const position =
          role === "council-officer" || role === "committee-officer"
            ? userData.position || null
            : null;

        await createUserWithHashedPassword(
          {
            studentNumber: userData.studentNumber,
            lastName: userData.lastName,
            firstName: userData.firstName,
            middleName: userData.middleName || null,
            password: userData.password || getDefaultPassword(),
            role,
            yearLevel: userData.yearLevel || null,
            position,
            membershipStatus,
            registeredBy: req.user?.id || null,
          },
          hashPassword,
        );
        successful++;
      } catch (error: any) {
        failedUsers.push({
          studentNumber: userData.studentNumber || "UNKNOWN",
          reason: error.message || "Unknown error occurred",
          data: userData,
        });
      }
    });

    res.status(200).json({
      success: true,
      data: { successful, failed: failedUsers.length, failedUsers },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error during sync upsert batch",
      error: error.message,
    });
  }
};

// What each kind of caller may change. Anything else in the request body
// (password, studentNumber, firstLogin, reset codes, ...) is ignored.
const SELF_EDITABLE_FIELDS = ["email", "yearLevel"];
const MANAGED_EDITABLE_FIELDS = [
  "firstName",
  "lastName",
  "middleName",
  "email",
  "role",
  "yearLevel",
  "membershipStatus",
  "isActive",
];

const pickFields = (source: Record<string, unknown>, fields: string[]) =>
  Object.fromEntries(
    fields.filter((field) => field in source).map((field) => [field, source[field]]),
  );

// Update user
export const updateUser = async (
  req: Request,
  res: Response,
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

    // Fetch original user to compare changes
    const originalUser = await User.findById(id);
    if (!originalUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const isAdmin = req.user?.role === "admin";
    if (!isAdmin && (originalUser.role === "admin" || req.body.role === "admin")) {
      res.status(403).json({
        success: false,
        message: "Only admins can edit or assign admin accounts",
      });
      return;
    }

    // People editing their own record can only change profile details;
    // role, membership and status are managed by officers and admins.
    const isSelfService = req.user?.id === id && !isAdmin;
    const updates = pickFields(
      req.body,
      isSelfService ? SELF_EDITABLE_FIELDS : MANAGED_EDITABLE_FIELDS,
    );

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true },
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
        "Membership" as any,
      );
    }

    // 2. Profile Update
    const profileFields = [
      "firstName",
      "lastName",
      "middleName",
      "yearLevel",
      "email",
    ];
    const changedFields = profileFields.filter(
      (field) =>
        updates[field] !== undefined &&
        updates[field] !== (originalUser as any)[field],
    );

    if (changedFields.length > 0) {
      await sendNotification(
        updatedUser._id,
        "[PROFILE] Profile Updated",
        `Your profile information (${changedFields.join(", ")}) has been updated.`,
        "system",
        updatedUser._id,
        null,
      );
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
  res: Response,
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

    if (user.role === "admin" && req.user?.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only admins can change an admin account's status",
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
  res: Response,
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

    const userToDelete = await User.findById(id);

    if (!userToDelete) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (userToDelete.role === "admin" && req.user?.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only admins can delete admin accounts",
      });
      return;
    }

    await userToDelete.deleteOne();

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
  res: Response,
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
  res: Response,
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

    const searchRegex = new RegExp(escapeRegExp(String(query).slice(0, 100)), "i");

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
