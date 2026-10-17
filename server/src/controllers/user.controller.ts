import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { sendNotification } from "../utils/notification";
import { escapeRegExp } from "../utils/regex";
import { issueFirstLoginCode } from "../utils/first-login-code";
import { buildSchoolEmail } from "../utils/school-email";
import { parseGender } from "../utils/gender";
import { queueFirstLoginEmail } from "../utils/first-login-mail";
import { recordAudit } from "../utils/audit";

// Interface for request with authenticated user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    userId: string;
  };
}

const VALID_ROLES = ["student", "council-officer", "committee-officer", "faculty", "admin"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Only admins may hand out the admin role (e.g. via an Excel upload).
const assignableRole = (role: string | undefined, requesterRole?: string) =>
  role === "admin" && requesterRole !== "admin" ? "student" : role;

// Council officers are peers: only an admin can delete, deactivate, demote or
// otherwise manage another council officer's account (their own is theirs to edit).
const isProtectedPeer = (target: { role: string }, actor?: { id?: string; role?: string }, targetId?: string) =>
  target.role === "council-officer" && actor?.role !== "admin" && actor?.id !== targetId;

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
    // Only fields that are safe to order by. Sorting on a hidden field (e.g. a
    // password hash or reset code) would leak its order even without the value.
    const SORTABLE = ["createdAt", "updatedAt", "studentNumber", "lastName", "firstName", "role", "yearLevel", "isActive"];
    const sort: any = {};
    sort[SORTABLE.includes(String(sortBy)) ? String(sortBy) : "createdAt"] = sortOrder === "asc" ? 1 : -1;

    // Pagination
    // Cap page size: staff get up to 10000 (the users page loads everyone at once),
    // everyone else 500. Pages are never below 1.
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const maxLimit = canSeeEveryone ? 10000 : 500;
    const limitNum = Math.min(maxLimit, Math.max(1, parseInt(limit as string) || 50));
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    let query = User.find(filter);
    query = canSeeEveryone
      ? query.select("+firstLogin").populate("registeredBy", "firstName lastName middleName role")
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
      "firstName lastName middleName role",
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
      role = "student",
      yearLevel,
      membershipStatus,
      email,
      position,
      department,
      gender,
    } = req.body;

    // Validation
    if (!studentNumber || !lastName || !firstName) {
      res.status(400).json({
        success: false,
        message: "ID number, first name, and last name are required",
      });
      return;
    }

    if (!VALID_ROLES.includes(role)) {
      res.status(400).json({
        success: false,
        message: "Invalid role",
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

    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (cleanEmail && !EMAIL_PATTERN.test(cleanEmail)) {
      res.status(400).json({
        success: false,
        message: "Enter a valid email address",
      });
      return;
    }
    const accountEmail = cleanEmail || buildSchoolEmail(firstName, lastName);
    const { code, expires } = issueFirstLoginCode();

    // Officer and faculty titles live in different fields depending on role.
    const positionFields = {
      position: null as string | null,
      department: null as string | null,
      councilPosition: null as string | null,
      committeeTitle: null as string | null,
      committeeDepartment: null as string | null,
    };
    const cleanPosition = typeof position === "string" && position.trim() ? position.trim() : null;
    const cleanDepartment = typeof department === "string" && department.trim() ? department.trim() : null;
    if (role === "council-officer") {
      positionFields.councilPosition = cleanPosition;
    } else if (role === "committee-officer") {
      positionFields.committeeTitle = cleanPosition;
      positionFields.committeeDepartment = cleanDepartment;
    } else if (role === "faculty") {
      positionFields.position = cleanPosition;
      positionFields.department = cleanDepartment;
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
      email: accountEmail,
      gender: parseGender(gender),
      password: code,
      firstLoginCodeStatus: accountEmail ? "pending" : "no-email",
      firstLoginCodeExpires: expires,
      role,
      // Year level only means something for students and officers, who are
      // students too; faculty don't get one.
      yearLevel: role === "faculty" ? undefined : yearLevel,
      ...positionFields,
      membershipStatus: membershipStatusObj,
      registeredBy: req.user?.id || null,
    });

    // Populate registeredBy before sending response
    await newUser.populate("registeredBy", "firstName lastName middleName role");

    await recordAudit({
      action: "user.create",
      actorId: req.user?.id,
      targetId: newUser._id,
      details: { role: newUser.role },
    });

    if (accountEmail) {
      queueFirstLoginEmail({
        userId: newUser._id.toString(),
        email: accountEmail,
        firstName: newUser.firstName,
        code,
        expires,
      });
    }

    res.status(201).json({
      success: true,
      message: accountEmail
        ? `User created. A first-login code is being sent to ${accountEmail}.`
        : "User created, but no school email could be worked out, so no first-login code was sent.",
      data: newUser,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
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

const createUserWithFirstLoginCode = async (
  data: Record<string, unknown> & { firstName: string; lastName: string },
  hashPassword: (plain: string) => Promise<string>,
) => {
  const { code, expires } = issueFirstLoginCode();
  const email = buildSchoolEmail(data.firstName, data.lastName);
  const user = new User({
    ...data,
    email,
    password: await hashPassword(code),
    firstLoginCodeStatus: email ? "pending" : "no-email",
    firstLoginCodeExpires: expires,
  });
  user.$locals.passwordAlreadyHashed = true;
  const saved = await user.save();
  if (email) {
    queueFirstLoginEmail({
      userId: saved._id.toString(),
      email,
      firstName: saved.firstName,
      code,
      expires,
    });
  }
  return saved;
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

          if (
            userData.role &&
            existingUser.role !== "admin" &&
            !isProtectedPeer(existingUser, req.user, existingUser._id.toString())
          ) {
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

        const newUser = await createUserWithFirstLoginCode(
          {
            studentNumber: userData.studentNumber,
            lastName: userData.lastName,
            firstName: userData.firstName,
            middleName: userData.middleName || null,
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

    // The roster is a list of students: officers, faculty and admins who aren't
    // on it are left alone rather than locked out.
    const skippedAdmins = missingUsers
      .filter((user) => user.role === "admin")
      .map(summarize);
    const skippedStaff = missingUsers
      .filter((user) => user.role !== "admin" && user.role !== "student")
      .map(summarize);
    const toDeactivate = missingUsers.filter(
      (user) => user.role === "student" && user.isActive,
    );

    // A wrong or partial file would lock out most of the chapter, so anything
    // that large needs an admin.
    if (req.user?.role !== "admin") {
      const activeStudents = await User.countDocuments({
        role: "student",
        isActive: true,
      });
      if (toDeactivate.length > Math.max(10, activeStudents * 0.5)) {
        res.status(400).json({
          success: false,
          message: `This file would deactivate ${toDeactivate.length} of ${activeStudents} active students, which looks like a wrong or partial roster. Please check the file, or ask an admin to run it.`,
        });
        return;
      }
    }

    if (toDeactivate.length > 0) {
      await User.updateMany(
        { _id: { $in: toDeactivate.map((user) => user._id) } },
        { $set: { isActive: false } },
      );
    }
    const deactivated = toDeactivate.map(summarize);

    await recordAudit({
      action: "roster.deactivate",
      actorId: req.user?.id,
      details: { deactivated: deactivated.length, rosterSize: uploadedStudentNumbers.length },
    });

    res.status(200).json({
      success: true,
      message: `Delete phase complete. ${deactivated.length} deactivated, ${skippedAdmins.length + skippedStaff.length} admins, officers and faculty left alone.`,
      data: { deactivated, skippedAdmins, skippedStaff },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error during sync delete",
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

          if (
            userData.role &&
            !isProtectedPeer(existingUser, req.user, existingUser._id.toString())
          ) {
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

        await createUserWithFirstLoginCode(
          {
            studentNumber: userData.studentNumber,
            lastName: userData.lastName,
            firstName: userData.firstName,
            middleName: userData.middleName || null,
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

    await recordAudit({
      action: "roster.upsert",
      actorId: req.user?.id,
      details: { successful, failed: failedUsers.length },
    });

    res.status(200).json({
      success: true,
      data: { successful, failed: failedUsers.length, failedUsers },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error during sync upsert batch",
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
  "gender",
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

    if (isProtectedPeer(originalUser, req.user, id)) {
      res.status(403).json({
        success: false,
        message: "Only admins can edit another council officer's account",
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

    if ("gender" in updates) updates.gender = parseGender(updates.gender);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).populate("registeredBy", "firstName lastName middleName role");

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (updates.role && updates.role !== originalUser.role) {
      await recordAudit({
        action: "user.role-change",
        actorId: req.user?.id,
        targetId: id,
        details: { from: originalUser.role, to: updates.role },
      });
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

    if (req.user?.id === id) {
      res.status(400).json({
        success: false,
        message: "You can't deactivate your own account",
      });
      return;
    }

    if (isProtectedPeer(user, req.user, id)) {
      res.status(403).json({
        success: false,
        message: "Only admins can change another council officer's status",
      });
      return;
    }

    user.isActive = !user.isActive;
    await user.save();
    await recordAudit({
      action: user.isActive ? "user.activate" : "user.deactivate",
      actorId: req.user?.id,
      targetId: id,
    });

    await user.populate("registeredBy", "firstName lastName middleName role");

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

    if (req.user?.id === id) {
      res.status(400).json({
        success: false,
        message: "You can't delete your own account",
      });
      return;
    }

    if (isProtectedPeer(userToDelete, req.user, id)) {
      res.status(403).json({
        success: false,
        message: "Only admins can delete a council officer's account",
      });
      return;
    }

    await userToDelete.deleteOne();
    await recordAudit({
      action: "user.delete",
      actorId: req.user?.id,
      targetId: id,
      details: { studentNumber: userToDelete.studentNumber, role: userToDelete.role },
    });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: { id },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
    });
  }
};

const reissueFirstLoginCode = async (
  user: UserDoc,
  restartFirstLogin = false,
): Promise<string | null> => {
  const email = user.email || buildSchoolEmail(user.firstName, user.lastName);
  const { code, expires } = issueFirstLoginCode();
  if (email) user.email = email;
  user.password = code;
  if (restartFirstLogin) user.firstLogin = true;
  user.firstLoginCodeStatus = email ? "pending" : "no-email";
  user.firstLoginCodeExpires = expires;
  await user.save();
  if (!email) return null;
  queueFirstLoginEmail({
    userId: user._id.toString(),
    email,
    firstName: user.firstName,
    code,
    expires,
  });
  return email;
};

export const sendFirstLoginCode = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid user ID" });
      return;
    }

    const user = await User.findById(id).select("+firstLogin");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    const restart = req.user?.role === "admin" && req.body?.force === true;
    if (!user.firstLogin && !restart) {
      res.status(400).json({
        success: false,
        message: "This account has already set its own password",
      });
      return;
    }
    if (user.role === "admin" && req.user?.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only admins can send a code to an admin account",
      });
      return;
    }

    const email = await reissueFirstLoginCode(user, restart);
    if (!email) {
      res.status(400).json({
        success: false,
        message: "No school email could be worked out for this account",
      });
      return;
    }

    await recordAudit({
      action: "user.first-login-code",
      actorId: req.user?.id,
      targetId: id,
      details: { restart },
    });

    res.status(200).json({
      success: true,
      message: `A new first-login code is being sent to ${email}`,
      data: {
        firstLoginCodeStatus: user.firstLoginCodeStatus,
        firstLoginCodeExpires: user.firstLoginCodeExpires,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Error sending first-login code",
    });
  }
};

export const sendFirstLoginCodes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const studentNumbers: string[] = Array.isArray(req.body?.studentNumbers)
      ? req.body.studentNumbers
          .filter((value: unknown): value is string => typeof value === "string")
          .map((value: string) => value.trim().toUpperCase())
          .filter(Boolean)
      : [];

    if (studentNumbers.length === 0) {
      res.status(400).json({
        success: false,
        message: "Choose which accounts to send codes to",
      });
      return;
    }
    if (studentNumbers.length > 2000) {
      res.status(400).json({
        success: false,
        message: "Send codes to at most 2000 accounts at a time",
      });
      return;
    }

    const found = await User.find({ studentNumber: { $in: studentNumbers } })
      .select("+firstLogin")
      .lean();
    const eligible = found.filter(
      (user) =>
        user.firstLogin !== false &&
        user.isActive &&
        (user.role !== "admin" || req.user?.role === "admin"),
    );

    await recordAudit({
      action: "user.first-login-codes-bulk",
      actorId: req.user?.id,
      details: { requested: studentNumbers.length, accounts: eligible.length },
    });

    res.status(202).json({
      success: true,
      message: `First-login codes are being sent to ${eligible.length} account(s).`,
      data: {
        queued: eligible.length,
        skipped: studentNumbers.length - eligible.length,
      },
    });

    for (let i = 0; i < eligible.length; i += UPLOAD_BATCH_SIZE) {
      const users = await User.find({
        _id: { $in: eligible.slice(i, i + UPLOAD_BATCH_SIZE).map((user) => user._id) },
      });
      for (const user of users) {
        await reissueFirstLoginCode(user).catch(() => undefined);
      }
    }
  } catch {
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Error sending first-login codes",
      });
    }
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
      .populate("registeredBy", "firstName lastName middleName role")
      .limit(20);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error searching users",
    });
  }
};
